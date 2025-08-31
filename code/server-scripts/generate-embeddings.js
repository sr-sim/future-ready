import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(cors())
app.use(express.json())

// Simple embedding generation function
function generateEmbedding(text) {
  const hash = text.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const embedding = new Array(384).fill(0)
  for (let i = 0; i < 384; i++) {
    embedding[i] = Math.sin(hash + i) * 0.1
  }
  
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  return embedding.map(val => val / magnitude)
}

// API endpoint to generate embeddings for job postings
app.post('/api/generate-job-embeddings', async (req, res) => {
  try {
    const { supabaseUrl, supabaseKey } = req.body
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(400).json({ error: 'Supabase URL and key are required' })
    }

    // Import Supabase client dynamically
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Fetching job postings without embeddings...')
    
    // Get job postings that don't have embeddings
    const { data: jobs, error } = await supabase
      .from('job_postings')
      .select('*')
      .is('embedding', null)
    
    if (error) {
      console.error('Error fetching jobs:', error)
      return res.status(500).json({ error: 'Failed to fetch job postings' })
    }
    
    if (!jobs || jobs.length === 0) {
      return res.json({ message: 'No job postings found without embeddings', processed: 0 })
    }
    
    console.log(`Found ${jobs.length} job postings to process`)
    
    let processed = 0
    for (const job of jobs) {
      try {
        // Combine job data into text for embedding
        const text = [
          job.title,
          job.description,
          job.requirements,
          job.responsibilities,
          job.location,
          job.job_type,
          job.experience_level,
          Array.isArray(job.tags) ? job.tags.join(', ') : job.tags
        ].filter(Boolean).join('\n\n')
        
        // Generate embedding
        const embedding = generateEmbedding(text)
        
        // Update job posting with embedding
        const { error: updateError } = await supabase
          .from('job_postings')
          .update({ embedding })
          .eq('id', job.id)
        
        if (updateError) {
          console.error(`Error updating job ${job.id}:`, updateError)
        } else {
          console.log(`✅ Generated embedding for: ${job.title}`)
          processed++
        }
        
      } catch (jobError) {
        console.error(`Error processing job ${job.id}:`, jobError)
      }
    }
    
    console.log(`✅ Finished generating embeddings for ${processed} job postings`)
    
    res.json({ 
      message: `Successfully generated embeddings for ${processed} job postings`,
      processed,
      total: jobs.length
    })
    
  } catch (error) {
    console.error('Error in generate-job-embeddings endpoint:', error)
    res.status(500).json({ error: 'Failed to generate embeddings' })
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    note: 'Embedding generation service'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Embedding generation service running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})
