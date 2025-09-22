import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pipeline } from '@xenova/transformers'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3008

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'text/plain', 'application/msword',
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'))
    }
  }
})

// Initialize Supabase client
let supabase = null

// Enhanced RAG pipelines
let embeddingPipeline = null
let qaPipeline = null
let textGenerationPipeline = null

// Use better models for enhanced performance
const EMBEDDING_MODEL_ID = 'Xenova/all-MiniLM-L6-v2'
const QA_MODEL_ID = 'Xenova/distilbert-base-uncased-distilled-squad'
const TEXT_GENERATION_MODEL_ID = 'Xenova/flan-t5-small' // Better for general Q&A

// Knowledge base for general questions
const GENERAL_KNOWLEDGE = {
  'company_policies': [
    'Remote work is allowed up to 3 days per week with manager approval',
    'Vacation time accrues at 1.25 days per month for new employees',
    'Annual performance reviews are conducted in Q4',
    'Professional development budget is $2,000 per employee',
    'Flexible working hours are between 7 AM - 7 PM'
  ],
  'benefits': [
    'Multiple health insurance plans available with company contribution',
    '401(k) plan with 6% company matching',
    'Dental and vision coverage included',
    'Life insurance provided at 2x annual salary',
    'Enrollment period is November 1-30 annually'
  ],
  'it_security': [
    'Passwords must be at least 12 characters with complexity requirements',
    'Multi-factor authentication required for all systems',
    'Data encryption mandatory for sensitive information',
    'Security incidents must be reported within 1 hour',
    'Regular security training required quarterly'
  ],
  'onboarding': [
    'Complete profile setup within first week',
    'Read employee handbook within first week',
    'Complete IT setup and security training within first week',
    'Attend company orientation within first month',
    'Schedule 1:1 with manager within first week'
  ]
}

// Initialize RAG components
const initializeRAG = async () => {
  try {
    if (!embeddingPipeline) {
      console.log(`🔌 Loading embedding model: ${EMBEDDING_MODEL_ID}`)
      embeddingPipeline = await pipeline('feature-extraction', EMBEDDING_MODEL_ID, { quantized: true })
    }
    if (!qaPipeline) {
      console.log(`🔌 Loading QA model: ${QA_MODEL_ID}`)
      qaPipeline = await pipeline('question-answering', QA_MODEL_ID, { quantized: true })
    }
    if (!textGenerationPipeline) {
      console.log(`🔌 Loading text generation model: ${TEXT_GENERATION_MODEL_ID}`)
      textGenerationPipeline = await pipeline('text2text-generation', TEXT_GENERATION_MODEL_ID, { quantized: true })
    }
    console.log('✅ Enhanced RAG components loaded')
    return true
  } catch (e) {
    console.error('Failed to load RAG components:', e)
    return false
  }
}

// Enhanced text extraction
const extractTextFromFile = async (filePath, mimeType) => {
  try {
    if (mimeType === 'text/plain') {
      const content = fs.readFileSync(filePath, 'utf8')
      console.log(`📄 Extracted ${content.length} characters from text file`)
      return content
    } else if (mimeType === 'application/pdf') {
      try {
        const pdfBuffer = fs.readFileSync(filePath)
        const pdf = await import('pdf-parse')
        const data = await pdf.default(pdfBuffer)
        console.log(`📄 Extracted ${data.text.length} characters from PDF`)
        return data.text
      } catch (pdfError) {
        console.error('PDF parsing failed:', pdfError)
        return `PDF Document: Content extraction failed - ${pdfError.message}`
      }
    } else {
      return `Document: Content extraction not implemented for ${mimeType}`
    }
  } catch (error) {
    console.error('Text extraction error:', error)
    return `Document: Content extraction failed - ${error.message}`
  }
}

// Enhanced question classification
const classifyQuestion = (question) => {
  const questionLower = question.toLowerCase()
  
  // Document-specific questions
  if (questionLower.includes('document') || questionLower.includes('file') || 
      questionLower.includes('upload') || questionLower.includes('policy')) {
    return 'document_specific'
  }
  
  // General knowledge questions
  if (questionLower.includes('remote work') || questionLower.includes('vacation') || 
      questionLower.includes('benefits') || questionLower.includes('onboarding')) {
    return 'general_knowledge'
  }
  
  // Company policies
  if (questionLower.includes('policy') || questionLower.includes('rule') || 
      questionLower.includes('procedure') || questionLower.includes('guideline')) {
    return 'company_policies'
  }
  
  // Benefits and HR
  if (questionLower.includes('benefit') || questionLower.includes('insurance') || 
      questionLower.includes('401k') || questionLower.includes('salary')) {
    return 'benefits'
  }
  
  // IT and Security
  if (questionLower.includes('password') || questionLower.includes('security') || 
      questionLower.includes('it') || questionLower.includes('computer')) {
    return 'it_security'
  }
  
  // Onboarding
  if (questionLower.includes('onboard') || questionLower.includes('new employee') || 
      questionLower.includes('first week') || questionLower.includes('orientation')) {
    return 'onboarding'
  }
  
  return 'general'
}

// Enhanced answer generation
const generateAnswer = async (question, context, questionType) => {
  try {
    // For document-specific questions, use QA pipeline
    if (questionType === 'document_specific' && context && qaPipeline) {
      console.log('🔍 Using QA pipeline for document-specific question')
      const qa = await qaPipeline({
        question: question,
        context: context
      })
      
      if (qa?.answer && qa.score > 0.3) {
        return {
          answer: qa.answer,
          confidence: qa.score,
          source: 'Document Analysis',
          model: 'DistilBERT SQuAD'
        }
      }
    }
    
    // For general questions, use text generation pipeline
    if (textGenerationPipeline) {
      console.log('🤖 Using text generation for general question')
      
      let prompt = ''
      if (questionType === 'general_knowledge' || questionType === 'company_policies' || 
          questionType === 'benefits' || questionType === 'it_security' || questionType === 'onboarding') {
        
        const relevantKnowledge = GENERAL_KNOWLEDGE[questionType] || []
        prompt = `Based on the following company information, answer this question: "${question}"\n\nCompany Information:\n${relevantKnowledge.join('\n')}\n\nAnswer:`
      } else {
        prompt = `Answer this question about company policies and procedures: "${question}"\n\nAnswer:`
      }
      
      const result = await textGenerationPipeline(prompt, {
        max_length: 200,
        temperature: 0.7,
        do_sample: true
      })
      
      if (result?.[0]?.generated_text) {
        const answer = result[0].generated_text.replace(prompt, '').trim()
        return {
          answer: answer,
          confidence: 0.8,
          source: 'Company Knowledge Base',
          model: 'Flan-T5'
        }
      }
    }
    
    // Fallback: keyword-based answer
    console.log('🔄 Using keyword-based fallback')
    return generateKeywordBasedAnswer(question, questionType)
    
  } catch (error) {
    console.error('Answer generation error:', error)
    return generateKeywordBasedAnswer(question, questionType)
  }
}

// Keyword-based answer generation
const generateKeywordBasedAnswer = (question, questionType) => {
  const questionLower = question.toLowerCase()
  
  // Check for specific keywords and provide relevant answers
  if (questionLower.includes('remote work')) {
    return {
      answer: 'Remote work is allowed up to 3 days per week with manager approval. You need to discuss your remote work arrangement with your supervisor and have it documented.',
      confidence: 0.9,
      source: 'Company Policy',
      model: 'Keyword Matching'
    }
  }
  
  if (questionLower.includes('vacation') || questionLower.includes('time off')) {
    return {
      answer: 'Full-time employees accrue vacation time at a rate of 1.25 days per month during their first year of employment. This increases to 1.5 days per month after one year.',
      confidence: 0.9,
      source: 'Company Policy',
      model: 'Keyword Matching'
    }
  }
  
  if (questionLower.includes('benefit') || questionLower.includes('insurance')) {
    return {
      answer: 'We offer comprehensive benefits including health insurance with company contribution, 401(k) with 6% matching, dental and vision coverage, and life insurance. The enrollment period is November 1-30 annually.',
      confidence: 0.9,
      source: 'Benefits Guide',
      model: 'Keyword Matching'
    }
  }
  
  if (questionLower.includes('onboard') || questionLower.includes('new employee')) {
    return {
      answer: 'The onboarding process includes completing your profile setup, reading the employee handbook, completing IT setup and security training, and attending company orientation. Your manager will schedule a 1:1 meeting within your first week.',
      confidence: 0.9,
      source: 'Onboarding Guide',
      model: 'Keyword Matching'
    }
  }
  
  if (questionLower.includes('password') || questionLower.includes('security')) {
    return {
      answer: 'Passwords must be at least 12 characters with complexity requirements. Multi-factor authentication is required for all systems, and security incidents must be reported within 1 hour.',
      confidence: 0.9,
      source: 'IT Security Policy',
      model: 'Keyword Matching'
    }
  }
  
  // Generic helpful response
  return {
    answer: 'I understand you\'re asking about company policies. While I don\'t have specific information about that topic, I can help you with general company policies, benefits, onboarding procedures, and IT security guidelines. You can also check the company documents uploaded by HR for more detailed information.',
    confidence: 0.6,
    source: 'General Knowledge',
    model: 'Keyword Matching'
  }
}

// Enhanced chat endpoint
app.post('/api/enhanced-chat', async (req, res) => {
  try {
    const { supabaseUrl, supabaseKey, question, companyId, userId } = req.body

    if (!supabaseUrl || !supabaseKey || !question || !companyId) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    supabase = createClient(supabaseUrl, supabaseKey)

    // Verify user belongs to the company
    if (userId) {
      const { data: userProfile, error: profileError } = await supabase
        .from('job_seeker_profiles')
        .select('company_id')
        .eq('user_id', userId)
        .single()

      if (profileError) {
        console.log(`⚠️ Could not verify user company: ${profileError.message}`)
      } else if (userProfile && userProfile.company_id !== companyId) {
        console.log(`🚨 Security warning: User ${userId} tried to access documents from company ${companyId}`)
        return res.status(403).json({ 
          error: 'Access denied: You can only access documents from your own company'
        })
      }
    }

    console.log(`🔍 Processing question: "${question}"`)

    // Classify the question type
    const questionType = classifyQuestion(question)
    console.log(`📊 Question classified as: ${questionType}`)

    // Initialize RAG components
    await initializeRAG()

    let answer = null
    let sources = []
    let context = ''

    // For document-specific questions, search company documents
    if (questionType === 'document_specific') {
      console.log('📚 Searching company documents for specific information')
      
      const { data: documents, error: docError } = await supabase
        .from('company_documents')
        .select('id, title, description, category, document_content, mime_type')
        .eq('company_id', companyId)
        .eq('is_analyzed', true)

      if (docError) throw docError

      if (documents && documents.length > 0) {
        // Find most relevant document content
        const questionEmbedding = await embeddingPipeline(question)
        const questionVec = Array.from(questionEmbedding.data || questionEmbedding[0]?.data || questionEmbedding)

        let bestDoc = null
        let bestScore = -1

        for (const doc of documents) {
          if (doc.document_content) {
            const docEmbedding = await embeddingPipeline(doc.document_content.substring(0, 1000))
            const docVec = Array.from(docEmbedding.data || docEmbedding[0]?.data || docEmbedding)
            
            // Calculate cosine similarity
            const similarity = cosineSimilarity(questionVec, docVec)
            if (similarity > bestScore) {
              bestScore = similarity
              bestDoc = doc
            }
          }
        }

        if (bestDoc && bestScore > 0.3) {
          context = bestDoc.document_content
          sources = [bestDoc.title]
          console.log(`📖 Found relevant document: ${bestDoc.title} (similarity: ${bestScore})`)
        }
      }
    }

    // Generate answer based on question type and available context
    answer = await generateAnswer(question, context, questionType)

    // Add sources if we have document context
    if (sources.length > 0) {
      answer.sources = sources
    }

    console.log(`💡 Generated answer: ${answer.answer.substring(0, 100)}...`)
    console.log(`🎯 Confidence: ${answer.confidence}, Source: ${answer.source}`)

    res.json({
      answer: answer.answer,
      confidence: answer.confidence,
      sources: answer.sources || [],
      model: answer.model,
      questionType: questionType,
      source: answer.source
    })

  } catch (error) {
    console.error('Error in enhanced chat:', error)
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.message
    })
  }
})

// Cosine similarity calculation
const cosineSimilarity = (a, b) => {
  let dot = 0, na = 0, nb = 0
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i++) { 
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb)
  return denom ? dot / denom : 0
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Enhanced Document QA API',
    timestamp: new Date().toISOString(),
    models: {
      embedding: EMBEDDING_MODEL_ID,
      qa: QA_MODEL_ID,
      textGeneration: TEXT_GENERATION_MODEL_ID
    }
  })
})

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Enhanced Document QA API running on port ${PORT}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
  
  // Initialize RAG components
  await initializeRAG()
  console.log(`🎯 RAG system ready: Enhanced Embedding search + QA + Text Generation`)
})

export default app
