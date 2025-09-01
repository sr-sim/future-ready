const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Simple embedding generation function (placeholder)
// In a real implementation, you would use a proper embedding model
async function generateEmbedding(text) {
  try {
    // For now, we'll create a simple hash-based embedding
    // This is just for demonstration - in production use a real embedding model
    const hash = text.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    // Create a 384-dimensional vector (like BGE-small-en)
    const embedding = new Array(384).fill(0)
    for (let i = 0; i < 384; i++) {
      embedding[i] = Math.sin(hash + i) * 0.1
    }
    
    // Normalize the vector
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
    return embedding.map(val => val / magnitude)
    
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
    modelLoaded: true,
    timestamp: new Date().toISOString(),
    note: 'Using simple hash-based embeddings for demonstration'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Embedding API server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
  console.log('Note: Using simple hash-based embeddings for demonstration')
})
