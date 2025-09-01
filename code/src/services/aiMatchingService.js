import { supabase } from '../lib/supabase'

// AI Matching Service using bge-small-en model and vector similarity
export class AIMatchingService {
  
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
      const response = await fetch('http://localhost:3001/api/generate-embedding', {
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
      // Call the job matching API endpoint
      const response = await fetch('http://localhost:3002/api/job-matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, limit })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to perform job matching')
      }

      const result = await response.json()
      return result

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

        // Calculate matching skills from tags
        const matchingSkills = this.calculateMatchingSkills(
          profile.skills || [],
          match.tags || []
        )

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

    const profileSkillsLower = profileSkills.map(skill => skill.toLowerCase())
    const jobSkillsLower = jobSkills.map(skill => skill.toLowerCase())

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
