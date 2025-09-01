import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import { pipeline } from '@xenova/transformers'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// Check if Supabase credentials are properly configured
if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.error('❌ ERROR: Supabase credentials not configured!')
  console.error('Please set the following environment variables:')
  console.error('  SUPABASE_URL=your_supabase_project_url')
  console.error('  SUPABASE_ANON_KEY=your_supabase_anon_key')
  console.error('')
  console.error('You can also create a .env file in this directory with these values.')
  console.error('')
  console.error('Example .env file:')
  console.error('  SUPABASE_URL=https://your-project.supabase.co')
  console.error('  SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
  console.error('  PORT=3002')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Initialize the embedding model
let embedder = null
const initializeModel = async () => {
  try {
    console.log('Loading BGE-small-en model...')
    embedder = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5')
    console.log('Model loaded successfully!')
  } catch (error) {
    console.error('Error loading model:', error)
  }
}

// Generate embeddings for text
async function generateEmbedding(text) {
  try {
    if (!embedder) {
      await initializeModel()
    }
    
    const output = await embedder(text, { pooling: 'mean', normalize: true })
    return Array.from(output.data)
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw error
  }
}

// API endpoint to perform job matching
app.post('/api/job-matching', async (req, res) => {
  try {
    const { userId, limit = 20 } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    console.log(`Starting job matching for user: ${userId}`)

    // Get user's job seeker profile
    const { data: profile, error: profileError } = await supabase
      .from('job_seeker_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError) {
      console.error('Profile error:', profileError)
      return res.status(404).json({ error: 'Job seeker profile not found' })
    }

    if (!profile) {
      return res.status(404).json({ error: 'Job seeker profile not found' })
    }

    // Generate embedding if not exists
    if (!profile.embedding) {
      console.log('Generating embedding for profile...')
      
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

      const embedding = await generateEmbedding(text)
      
      // Save embedding to profile
      const { error: updateError } = await supabase
        .from('job_seeker_profiles')
        .update({ embedding })
        .eq('id', profile.id)

      if (updateError) {
        console.error('Error updating profile embedding:', updateError)
        return res.status(500).json({ error: 'Failed to update profile embedding' })
      }

      profile.embedding = embedding
    }

    // Perform vector similarity search for job postings
    const { data: jobMatches, error: matchError } = await supabase
      .rpc('match_jobs_with_profile', {
        profile_embedding: profile.embedding,
        match_limit: limit
      })

    if (matchError) {
      console.error('Match error:', matchError)
      return res.status(500).json({ error: 'Failed to perform job matching' })
    }

    if (!jobMatches || jobMatches.length === 0) {
      return res.json({
        profile,
        matches: [],
        totalMatches: 0,
        highMatches: 0,
        averageScore: 0,
        message: 'No job matches found'
      })
    }

    // Format job matches with additional data
    const formattedMatches = []
    const matchesToSave = []

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

      // Calculate matching skills
      const profileSkills = Array.isArray(profile.skills) ? profile.skills : []
      const jobSkills = Array.isArray(match.skills_required) ? match.skills_required : []
      
      const profileSkillsLower = profileSkills.map(skill => skill.toLowerCase())
      const jobSkillsLower = jobSkills.map(skill => skill.toLowerCase())

      const matchingSkills = jobSkillsLower.filter(skill => 
        profileSkillsLower.some(profileSkill => 
          profileSkill.includes(skill) || skill.includes(profileSkill)
        )
      )

      const matchScore = Math.round(match.similarity_score * 100)
      
      // Generate match reason
      const matchReason = generateMatchReason(matchScore, matchingSkills, match, profile)

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
          ? `$${match.salary_min.toLocaleString()} - $${match.salary_max.toLocaleString()}`
          : 'Salary not specified',
        postedDate: formatDate(match.created_at),
        matchScore,
        matchingSkills,
        jobDescription: match.description,
        requirements: match.requirements,
        responsibilities: match.responsibilities,
        experienceLevel: match.experience_level,
        tags: match.skills_required || []
      }

      formattedMatches.push(formattedMatch)

      // Prepare match data to save to database
      matchesToSave.push({
        job_posting_id: match.id,
        job_seeker_id: profile.id,
        match_score: match.similarity_score,
        matched_skills: matchingSkills,
        match_reason: matchReason
      })
    }

    // Save matches to database
    if (matchesToSave.length > 0) {
      const { error: saveError } = await supabase
        .from('job_matches')
        .upsert(matchesToSave, {
          onConflict: 'job_posting_id,job_seeker_id',
          ignoreDuplicates: false
        })

      if (saveError) {
        console.error('Error saving matches:', saveError)
        // Don't fail the request if saving fails, just log it
      } else {
        console.log(`Saved ${matchesToSave.length} matches to database`)
      }
    }

    // Sort by match score (highest first)
    const sortedMatches = formattedMatches.sort((a, b) => b.matchScore - a.matchScore)

    const result = {
      profile,
      matches: sortedMatches,
      totalMatches: sortedMatches.length,
      highMatches: sortedMatches.filter(match => match.matchScore >= 80).length,
      averageScore: sortedMatches.length > 0 
        ? Math.round(sortedMatches.reduce((sum, match) => sum + match.matchScore, 0) / sortedMatches.length)
        : 0
    }

    console.log(`Job matching completed: ${result.totalMatches} matches found`)
    res.json(result)

  } catch (error) {
    console.error('Error in job matching:', error)
    res.status(500).json({ error: 'Internal server error during job matching' })
  }
})

// API endpoint to get saved job matches for a user
app.get('/api/job-matches/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { limit = 20, minScore = 0 } = req.query

    // Get user's profile ID
    const { data: profile, error: profileError } = await supabase
      .from('job_seeker_profiles')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Job seeker profile not found' })
    }

    // Get saved matches using the database function
    const { data: matches, error: matchesError } = await supabase
      .rpc('get_job_matches_for_seeker', {
        seeker_id: profile.id,
        limit_count: parseInt(limit),
        min_score: parseFloat(minScore)
      })

    if (matchesError) {
      console.error('Error fetching matches:', matchesError)
      return res.status(500).json({ error: 'Failed to fetch job matches' })
    }

    res.json({
      matches: matches || [],
      totalMatches: matches ? matches.length : 0
    })

  } catch (error) {
    console.error('Error fetching job matches:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// API endpoint to update match status (viewed, interested, applied)
app.patch('/api/job-matches/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params
    const { viewed, interested, applied } = req.body

    const updateData = {}
    if (viewed !== undefined) updateData.viewed = viewed
    if (interested !== undefined) updateData.interested = interested
    if (applied !== undefined) updateData.applied = applied

    const { data, error } = await supabase
      .from('job_matches')
      .update(updateData)
      .eq('id', matchId)
      .select()
      .single()

    if (error) {
      console.error('Error updating match:', error)
      return res.status(500).json({ error: 'Failed to update match' })
    }

    res.json({ match: data })

  } catch (error) {
    console.error('Error updating match status:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Helper function to generate match reason
function generateMatchReason(matchScore, matchingSkills, jobMatch, profile) {
  const reasons = []

  if (matchScore >= 90) {
    reasons.push('Excellent overall compatibility')
  } else if (matchScore >= 80) {
    reasons.push('Strong profile alignment')
  } else if (matchScore >= 70) {
    reasons.push('Good potential match')
  } else {
    reasons.push('Moderate compatibility')
  }

  if (matchingSkills.length > 0) {
    reasons.push(`${matchingSkills.length} matching skills: ${matchingSkills.slice(0, 3).join(', ')}${matchingSkills.length > 3 ? '...' : ''}`)
  }

  if (profile.experience && Array.isArray(profile.experience)) {
    const relevantExperience = profile.experience.filter(exp => 
      jobMatch.title.toLowerCase().includes(exp.title?.toLowerCase() || '') ||
      jobMatch.description.toLowerCase().includes(exp.title?.toLowerCase() || '')
    )
    if (relevantExperience.length > 0) {
      reasons.push('Relevant work experience found')
    }
  }

  if (profile.location && jobMatch.location) {
    const profileLocation = profile.location.toLowerCase()
    const jobLocation = jobMatch.location.toLowerCase()
    if (profileLocation.includes(jobLocation) || jobLocation.includes(profileLocation)) {
      reasons.push('Location match')
    }
  }

  return reasons.join('; ')
}

// Helper function to format date
function formatDate(dateString) {
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Job Matching API', port: PORT })
})

// Initialize model and start server
initializeModel().then(() => {
  app.listen(PORT, () => {
    console.log(`Job Matching API server running on port ${PORT}`)
    console.log(`Health check: http://localhost:${PORT}/health`)
  })
}).catch(error => {
  console.error('Failed to initialize model:', error)
  process.exit(1)
})

export default app
