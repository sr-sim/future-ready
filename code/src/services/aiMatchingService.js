import { supabase } from '../lib/supabase'

// AI Matching Service using bge-small-en model and vector similarity
export class AIMatchingService {
  
  // --- Helpers ---
  static _normalizeSkill(skill) {
    return (skill || '').toString().trim().toLowerCase()
  }

  // Perform AI matching for a specific job against its applicants
  static async performCandidateMatchingForJob(jobPostingId, limit = 50) {
    try {
      // 1) Load job posting and its requirements
      const { data: job, error: jobErr } = await supabase
        .from('job_postings')
        .select('id, company_id, title, description, scope, job_type, experience_level, salary_min, salary_max, location, status, created_at')
        .eq('id', jobPostingId)
        .single()
      if (jobErr) throw jobErr

      const { data: reqs, error: reqErr } = await supabase
        .from('job_posting_requirements')
        .select('job_posting_id, skill, description, score')
        .eq('job_posting_id', jobPostingId)
      if (reqErr) throw reqErr

      const requirementList = (reqs || []).map(r => ({
        skillNorm: this._normalizeSkill(r.skill),
        skillOrig: r.skill,
        description: r.description,
        score: Number.isFinite(r.score) ? r.score : 0
      }))

      // 2) Build job embedding text and generate embedding
      const jobText = [
        job.title,
        job.scope,
        job.description,
        requirementList.map(x => x.skillOrig || x.skillNorm).join(', ')
      ].filter(Boolean).join('\n\n')
      const jobEmbedding = await this._getEmbeddingForText(jobText)

      // 3) Load applicants for this job (applications → job_seeker_profiles)
      const { data: apps, error: appErr } = await supabase
        .from('applications')
        .select('job_seeker_profiles ( id, first_name, last_name, phone, location, summary, skills, experience, education, updated_at )')
        .eq('job_posting_id', jobPostingId)
        .eq('status', 'SUBMITTED')
        .eq('email_status', 'NOT_SENT')
      if (appErr) throw appErr

      const applicants = (apps || [])
        .map(a => a.job_seeker_profiles)
        .filter(Boolean)

      if (applicants.length === 0) {
        return { job, matches: [], totalApplicants: 0 }
      }

      // 4) Compute match scores for each applicant
      const matches = []
      for (const profile of applicants) {
        // Candidate text
        const experienceText = Array.isArray(profile.experience)
          ? profile.experience.map(exp => `${exp.title || ''} ${exp.company || ''} ${exp.description || ''}`).join('\n')
          : ''
        const educationText = Array.isArray(profile.education)
          ? profile.education.map(edu => `${edu.degree || ''} ${edu.field || ''} ${edu.institution || ''}`).join('\n')
          : ''
        const rawSkills = Array.isArray(profile.skills) ? profile.skills : (profile.skills ? Object.values(profile.skills) : [])
        const candidateSkillsSet = new Set(
          rawSkills
            .map(s => (typeof s === 'string' ? s : (s?.name || s?.skill || '')))
            .filter(Boolean)
            .map(this._normalizeSkill)
        )
        const candidateText = [
          profile.first_name,
          profile.last_name,
          profile.summary,
          [...candidateSkillsSet].join(', '),
          experienceText,
          educationText
        ].filter(Boolean).join('\n\n')

        // Embedding similarity
        const candidateEmbedding = await this._getEmbeddingForText(candidateText)
        const sim = this._cosineSimilarity(candidateEmbedding, jobEmbedding)
        const embeddingPercent = Math.max(0, Math.min(100, Math.round(sim * 100)))

        // Weighted skills overlap
        let totalWeight = 0
        let matchedWeight = 0
        const matchingSkills = []
        for (const r of requirementList) {
          totalWeight += r.score
          const { credit, label } = this._computePartialCredit(r.skillOrig || r.skillNorm, candidateSkillsSet)
          if (credit > 0) {
            matchedWeight += r.score * credit
            if (!matchingSkills.includes(label)) matchingSkills.push(label)
          }
        }
        const matchPercent = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0

        // Final blend
        const finalScore = Math.round(0.6 * embeddingPercent + 0.4 * matchPercent)

        matches.push({
          job_seeker_id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
          location: profile.location,
          matchScore: finalScore,
          embeddingPercent,
          skillsPercent: matchPercent,
          matchingSkills,
          updated_at: profile.updated_at
        })
      }

      // 5) Sort and limit
      matches.sort((a, b) => b.matchScore - a.matchScore)
      const top = matches.slice(0, limit)

      return { job, matches: top, totalApplicants: applicants.length }

    } catch (error) {
      console.error('Error performing candidate matching for job:', error)
      throw error
    }
  }

  static _cosineSimilarity(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length || a.length === 0) return 0
    let dot = 0
    let normA = 0
    let normB = 0
    for (let i = 0; i < a.length; i++) {
      const va = a[i]
      const vb = b[i]
      dot += va * vb
      normA += va * va
      normB += vb * vb
    }
    if (normA === 0 || normB === 0) return 0
    return dot / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  static async _getEmbeddingForText(text) {
    const body = { text }
    const response = await fetch('http://localhost:3011/api/generate-embedding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (!response.ok) {
      throw new Error('Failed to generate embedding')
    }
    const { embedding } = await response.json()
    return embedding
  }

  // Fuzzy/partial matching helpers
  static _splitSkillIntoTokens(skill) {
    // split on non-alphanumeric and connectors like '/', '&', ','
    return this._normalizeSkill(skill)
      .split(/[^a-z0-9+]+/g)
      .map(s => s.trim())
      .filter(Boolean)
  }

  static _synonymMap() {
    return {
      'excel / google sheets': ['excel', 'google sheets', 'spreadsheets', 'google-sheets'],
      'pandas & numpy': ['pandas', 'numpy'],
      'statistics & data interpretation': ['statistics', 'statistical analysis', 'data interpretation'],
      'data cleaning & validation': ['data cleaning', 'data cleansing', 'data validation'],
      'python programming': ['python'],
      'scikit-learn, pandas, numpy': ['scikit-learn', 'sklearn', 'pandas', 'numpy'],
      'aws sagemaker': ['aws sagemaker', 'sagemaker', 'aws'],
      'etl & data integration basics': ['etl', 'data integration']
    }
  }

  static _expandRequirementTerms(reqSkill) {
    const norm = this._normalizeSkill(reqSkill)
    const map = this._synonymMap()
    const terms = new Set()
    terms.add(norm)
    if (map[norm]) {
      for (const t of map[norm]) terms.add(this._normalizeSkill(t))
    }
    // Also add tokenized components for composite phrases
    for (const t of this._splitSkillIntoTokens(norm)) terms.add(t)
    return Array.from(terms)
  }

  // Returns { credit: number [0..1], label: string }
  static _computePartialCredit(reqSkill, candidateSkillsSet) {
    const normReq = this._normalizeSkill(reqSkill)
    const expanded = this._expandRequirementTerms(normReq)

    // Full credit if any expanded term exactly matches a candidate skill
    for (const term of expanded) {
      if (candidateSkillsSet.has(this._normalizeSkill(term))) {
        return { credit: 1, label: reqSkill }
      }
    }

    // Partial credit if any candidate skill is a substring match of the requirement (or vice versa)
    for (const cand of candidateSkillsSet) {
      for (const term of expanded) {
        if (!term) continue
        if (cand.includes(term) || term.includes(cand)) {
          // Keep original label without the "(partial)" suffix
          return { credit: 0.5, label: reqSkill }
        }
      }
    }

    return { credit: 0, label: reqSkill }
  }
  
  // Generate embeddings for job seeker profile
  static async generateJobSeekerEmbedding(profile) {
    try {
      // Combine profile data into a single text for embedding
      const text = [
        profile.first_name,
        profile.last_name,
        profile.professional_title,
        profile.summary,
        Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills,
        Array.isArray(profile.experience) ? profile.experience.map(exp => 
          `${exp.title} at ${exp.company}: ${exp.description}`
        ).join('. ') : '',
        Array.isArray(profile.education) ? profile.education.map(edu => 
          `${edu.degree} in ${edu.field} from ${edu.institution}`
        ).join('. ') : ''
      ].filter(Boolean).join('\n\n')

      // Call backend API to generate embedding
      const response = await fetch('http://localhost:3011/api/generate-embedding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      })

      if (!response.ok) {
        throw new Error('Failed to generate embedding')
      }

      const { embedding } = await response.json()
      return embedding

    } catch (error) {
      console.error('Error generating job seeker embedding:', error)
      throw error
    }
  }

  // Update job seeker profile with embedding
  static async updateJobSeekerEmbedding(profileId, embedding) {
    try {
      const { error } = await supabase
        .from('job_seeker_profiles')
        .update({ embedding })
        .eq('id', profileId)

      if (error) throw error
      return true

    } catch (error) {
      console.error('Error updating job seeker embedding:', error)
      throw error
    }
  }

  // Perform AI job matching using the backend API
  static async performJobMatching(userId, limit = 20) {
    try {
      // 1) Load job seeker profile
      const { data: profile, error: profileError } = await supabase
        .from('job_seeker_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      if (profileError) throw profileError

      // Normalize candidate skills into a set
      const rawSkills = Array.isArray(profile.skills) ? profile.skills : (profile.skills ? Object.values(profile.skills) : [])
      const candidateSkillsSet = new Set(
        rawSkills
          .map(s => (typeof s === 'string' ? s : (s?.name || s?.skill || '')))
          .filter(Boolean)
          .map(this._normalizeSkill)
      )

      // Build text for candidate embedding
      const experienceText = Array.isArray(profile.experience)
        ? profile.experience.map(exp => `${exp.title || ''} ${exp.company || ''} ${exp.description || ''}`).join('\n')
        : ''
      const educationText = Array.isArray(profile.education)
        ? profile.education.map(edu => `${edu.degree || ''} ${edu.field || ''} ${edu.institution || ''}`).join('\n')
        : ''
      const candidateText = [
        profile.first_name,
        profile.last_name,
        profile.summary,
        [...candidateSkillsSet].join(', '),
        experienceText,
        educationText
      ].filter(Boolean).join('\n\n')

      // 2) Generate candidate embedding (bge-small-en behind the API)
      const candidateEmbedding = await this._getEmbeddingForText(candidateText)

      // 3) Load published jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('job_postings')
        .select('id, company_id, title, description, scope, job_type, experience_level, salary_min, salary_max, location, status, created_at')
        .eq('status', 'PUBLISHED')
        .order('created_at', { ascending: false })
        .limit(limit)
      if (jobsError) throw jobsError

      if (!jobs || jobs.length === 0) {
        return { profile, matches: [], totalMatches: 0, highMatches: 0, averageScore: 0 }
      }

      // 4) Load requirements for these jobs
      const jobIds = jobs.map(j => j.id)
      const { data: reqs, error: reqErr } = await supabase
        .from('job_posting_requirements')
        .select('job_posting_id, skill, description, score')
        .in('job_posting_id', jobIds)
      if (reqErr) throw reqErr

      const jobIdToReqs = {}
      for (const r of (reqs || [])) {
        if (!jobIdToReqs[r.job_posting_id]) jobIdToReqs[r.job_posting_id] = []
        jobIdToReqs[r.job_posting_id].push({
          skillNorm: this._normalizeSkill(r.skill),
          skillOrig: r.skill,
          description: r.description,
          score: Number.isFinite(r.score) ? r.score : 0
        })
      }

      // 5) Build job embeddings in parallel
      const jobEmbeddings = await Promise.all(jobs.map(async (job) => {
        const reqList = jobIdToReqs[job.id] || []
        const jobText = [
          job.title,
          job.scope,
          job.description,
          reqList.map(x => x.skillOrig || x.skillNorm).join(', ')
        ].filter(Boolean).join('\n\n')
        try {
          const emb = await this._getEmbeddingForText(jobText)
          return emb
        } catch (e) {
          console.warn('Failed to embed job', job.id, e)
          return null
        }
      }))

      // 6) Score jobs
      const matches = []
      for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i]
        const reqList = jobIdToReqs[job.id] || []

        // Weighted skill overlap with partial credit
        let totalWeight = 0
        let matchedWeight = 0
        const matchingSkills = []
        for (const r of reqList) {
          totalWeight += r.score
          const { credit, label } = this._computePartialCredit(r.skillOrig || r.skillNorm, candidateSkillsSet)
          if (credit > 0) {
            matchedWeight += r.score * credit
            // Avoid duplicates
            if (!matchingSkills.includes(label)) matchingSkills.push(label)
          }
        }
        const matchPercent = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0

        // Embedding similarity percent
        const jobEmb = jobEmbeddings[i]
        const sim = jobEmb ? this._cosineSimilarity(candidateEmbedding, jobEmb) : 0
        const embeddingPercent = Math.max(0, Math.min(100, Math.round(sim * 100)))

        // Blend
        const finalScore = Math.round(0.6 * embeddingPercent + 0.4 * matchPercent)

        matches.push({
          id: job.id,
          company_id: job.company_id,
          title: job.title,
          description: job.description,
          scope: job.scope,
          job_type: job.job_type,
          experience_level: job.experience_level,
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          location: job.location,
          created_at: job.created_at,
          similarity_score: finalScore / 100,
          match_percent: matchPercent,
          embedding_percent: embeddingPercent,
          matching_skills: matchingSkills,
          requirements: reqList
        })
      }

      // 7) Sort and summarize
      matches.sort((a, b) => b.similarity_score - a.similarity_score)
      const topMatches = matches.slice(0, limit)
      const totalMatches = topMatches.length
      const highMatches = topMatches.filter(m => Math.round(m.similarity_score * 100) >= 70).length
      const averageScore = totalMatches > 0 ? Math.round(topMatches.reduce((s, m) => s + Math.round(m.similarity_score * 100), 0) / totalMatches) : 0

      return {
        profile,
        matches: topMatches,
        totalMatches,
        highMatches,
        averageScore
      }

    } catch (error) {
      console.error('Error performing job matching:', error)
      throw error
    }
  }

  // Get saved job matches for a user
  static async getSavedJobMatches(userId, limit = 20, minScore = 0) {
    try {
      const response = await fetch(`http://localhost:3002/api/job-matches/${userId}?limit=${limit}&minScore=${minScore}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch job matches')
      }

      const result = await response.json()
      return result

    } catch (error) {
      console.error('Error fetching saved job matches:', error)
      throw error
    }
  }

  // Update match status (viewed, interested, applied)
  static async updateMatchStatus(matchId, status) {
    try {
      const response = await fetch(`http://localhost:3002/api/job-matches/${matchId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(status)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update match status')
      }

      const result = await response.json()
      return result

    } catch (error) {
      console.error('Error updating match status:', error)
      throw error
    }
  }

  // Format job matches with additional data
  static async formatJobMatches(jobMatches, profile) {
    try {
      const formattedMatches = []

      for (const match of jobMatches) {
        // Get company information
        const { data: company, error: companyError } = await supabase
          .from('company_profiles')
          .select('company_name, industry, company_size, company_description')
          .eq('id', match.company_id)
          .single()

        if (companyError) {
          console.warn('Company not found for job:', match.id)
          continue
        }

        // Determine matching skills:
        // Prefer precomputed match.matching_skills; otherwise compute from requirements vs profile skills
        let matchingSkills = []
        if (Array.isArray(match.matching_skills) && match.matching_skills.length > 0) {
          matchingSkills = match.matching_skills
        } else {
          const profileSkills = Array.isArray(profile.skills) ? profile.skills : []
          const reqSkills = Array.isArray(match.requirements)
            ? match.requirements.map(r => r?.skillOrig || r?.skillNorm || r?.skill || '')
            : (match.tags || [])
          matchingSkills = this.calculateMatchingSkills(profileSkills, reqSkills)
        }

        // Format the match
        const formattedMatch = {
          id: match.id,
          companyId: match.company_id,
          name: company.company_name,
          industry: company.industry,
          size: company.company_size,
          description: company.company_description,
          position: match.title,
          jobType: match.job_type,
          location: match.location,
          salaryRange: match.salary_min && match.salary_max 
            ? `RM${match.salary_min.toLocaleString()} - RM${match.salary_max.toLocaleString()}`
            : 'Salary not specified',
          postedDate: this.formatDate(match.published_at || match.created_at),
          matchScore: Math.round(match.similarity_score * 100),
          matchingSkills,
          jobDescription: match.description,
          requirements: match.requirements,
          responsibilities: match.responsibilities,
          experienceLevel: match.experience_level,
          tags: match.tags
        }

        formattedMatches.push(formattedMatch)
      }

      // Sort by match score (highest first)
      return formattedMatches.sort((a, b) => b.matchScore - a.matchScore)

    } catch (error) {
      console.error('Error formatting job matches:', error)
      throw error
    }
  }

  // Calculate matching skills between profile and job
  static calculateMatchingSkills(profileSkills, jobSkills) {
    if (!Array.isArray(profileSkills) || !Array.isArray(jobSkills)) {
      return []
    }

    const toSafeLower = (v) => (typeof v === 'string' ? v.toLowerCase() : (v?.name || v?.skill || '').toLowerCase())
    const profileSkillsLower = profileSkills
      .map(toSafeLower)
      .filter(Boolean)
    const jobSkillsLower = jobSkills
      .map(toSafeLower)
      .filter(Boolean)

    return jobSkillsLower.filter(skill => 
      profileSkillsLower.some(profileSkill => 
        profileSkill.includes(skill) || skill.includes(profileSkill)
      )
    )
  }

  // Format date for display
  static formatDate(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  // Save matching results to database (optional)
  static async saveMatchingResults(userId, results) {
    try {
      const { error } = await supabase
        .from('matching_results')
        .insert({
          user_id: userId,
          results: results,
          created_at: new Date().toISOString()
        })

      if (error) throw error
      return true

    } catch (error) {
      console.error('Error saving matching results:', error)
      // Don't throw error as this is optional
      return false
    }
  }

  // Get user's resume score based on profile completeness
  static calculateResumeScore(profile) {
    let score = 0
    let totalFields = 0

    // Personal information (20 points)
    totalFields += 4
    if (profile.first_name) score += 5
    if (profile.last_name) score += 5
    if (profile.phone) score += 5
    if (profile.location) score += 5

    // Professional summary (15 points)
    totalFields += 1
    if (profile.summary && profile.summary.length > 50) score += 15

    // Skills (20 points)
    totalFields += 1
    if (profile.skills && Array.isArray(profile.skills) && profile.skills.length >= 5) score += 20

    // Experience (25 points)
    totalFields += 1
    if (profile.experience && Array.isArray(profile.experience) && profile.experience.length > 0) {
      const hasValidExperience = profile.experience.some(exp => 
        exp.title && exp.company && exp.startDate
      )
      if (hasValidExperience) score += 25
    }

    // Education (20 points)
    totalFields += 1
    if (profile.education && Array.isArray(profile.education) && profile.education.length > 0) {
      const hasValidEducation = profile.education.some(edu => 
        edu.degree && edu.institution && edu.year
      )
      if (hasValidEducation) score += 20
    }

    return Math.round(score)
  }

  // Generate improvement suggestions
  static generateImprovementSuggestions(profile) {
    const suggestions = []

    if (!profile.summary || profile.summary.length < 50) {
      suggestions.push('Add a detailed professional summary (at least 50 characters)')
    }

    if (!profile.skills || !Array.isArray(profile.skills) || profile.skills.length < 5) {
      suggestions.push('Add more skills to your profile (at least 5 skills)')
    }

    if (!profile.experience || !Array.isArray(profile.experience) || profile.experience.length === 0) {
      suggestions.push('Add your work experience to improve matching')
    }

    if (!profile.education || !Array.isArray(profile.education) || profile.education.length === 0) {
      suggestions.push('Add your education background')
    }

    if (!profile.professional_title) {
      suggestions.push('Add a professional title to your profile')
    }

    return suggestions
  }
}
