import express from 'express'
import cors from 'cors'
import { pipeline } from '@xenova/transformers'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Initialize the embedding model
let embedder = null

async function initializeModel() {
  try {
    console.log('Loading BGE-small-en model...')
    embedder = await pipeline('feature-extraction', 'Xenova/bge-small-en')
    console.log('Model loaded successfully!')
  } catch (error) {
    console.error('Error loading model:', error)
  }
}

// Generate embedding for text
async function generateEmbedding(text) {
  if (!embedder) {
    throw new Error('Model not initialized')
  }

  try {
    const output = await embedder(text, {
      pooling: 'mean',
      normalize: true
    })
    
    // Convert to array
    return Array.from(output.data)
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw error
  }
}

// API Routes
app.post('/api/generate-embedding', async (req, res) => {
  try {
    const { text } = req.body
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' })
    }

    const embedding = await generateEmbedding(text)
    
    res.json({ embedding })
  } catch (error) {
    console.error('Error in generate-embedding endpoint:', error)
    res.status(500).json({ error: 'Failed to generate embedding' })
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    modelLoaded: embedder !== null,
    timestamp: new Date().toISOString()
  })
})

// Start server
async function startServer() {
  await initializeModel()
  
  app.listen(PORT, () => {
    console.log(`Embedding API server running on port ${PORT}`)
    console.log(`Health check: http://localhost:${PORT}/api/health`)
  })
}

startServer().catch(console.error)
