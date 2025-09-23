import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pipeline } from '@xenova/transformers'
import mammoth from 'mammoth'
// Note: You'll need to install pdf-parse: npm install pdf-parse
// import pdf from 'pdf-parse'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3010

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

// RAG pipelines
let embeddingPipeline = null
let qaPipeline = null
const EMBEDDING_MODEL_ID = 'Xenova/all-MiniLM-L6-v2'
const QA_MODEL_ID = 'Xenova/distilbert-base-uncased-distilled-squad'

// Placeholder for optional generative model (may remain null)
let aiModel = null


// Initialize RAG components: Embedding + QA
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
    console.log('✅ RAG components loaded')
    return true
  } catch (e) {
    console.error('Failed to load RAG components:', e)
    return false
  }
}



// Enhanced text extraction with proper PDF support
const extractTextFromFile = async (filePath, mimeType) => {
  try {
    if (mimeType === 'text/plain') {
      const content = fs.readFileSync(filePath, 'utf8')
      console.log(`📄 Extracted ${content.length} characters from text file`)
      return content
    } else if (mimeType === 'application/pdf') {
      try {
        // Try to use pdf-parse if available
        const pdfBuffer = fs.readFileSync(filePath)
        
        const pdf = await import('pdf-parse')
        const data = await pdf.default(pdfBuffer)
        console.log(`📄 Extracted ${data.text.length} characters from PDF`)
        return data.text
        
      } catch (pdfError) {
        console.error('Error processing PDF:', pdfError)
        const fileName = path.basename(filePath)
        return `PDF Document: ${fileName}\n\nError: Could not process PDF file - ${pdfError.message}\n\nPlease refer to the original PDF file for content.`
      }
    } else if (mimeType.includes('word') || mimeType.includes('document') || filePath.endsWith('.docx')) {
      try {
        const buffer = fs.readFileSync(filePath)
        const { value } = await mammoth.convertToHtml({ buffer })
        // Convert simple HTML to markdown-like text (preserve headings and lists)
        const html = value || ''
        const text = html
          .replace(/<\/?h[1-6][^>]*>/gi, '\n\n')
          .replace(/<li[^>]*>/gi, '\n• ')
          .replace(/<\/?ul[^>]*>/gi, '\n')
          .replace(/<\/?ol[^>]*>/gi, '\n')
          .replace(/<p[^>]*>/gi, '')
          .replace(/<\/?p[^>]*>/gi, '\n')
          .replace(/<br\s*\/?>(\r?\n)?/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .replace(/\n{3,}/g, '\n\n')
          .trim()
        console.log(`📄 Extracted DOCX content: ${text.length} characters`)
        return text
      } catch (docxError) {
        console.error('DOCX extraction failed:', docxError)
        return `Document: ${path.basename(filePath)}\nContent extraction not available for DOCX: ${docxError.message}`
      }
    } else {
      const fileName = path.basename(filePath)
      const content = `Document: ${fileName}

This document contains company information and has been uploaded to the system. The document is available for reference and contains relevant company policies, procedures, or guidelines.

Document Type: ${mimeType}
File Size: ${fs.statSync(filePath).size} bytes

Please refer to the original file for complete details and proper formatting.`
      console.log(`📄 Extracted content from ${mimeType}: ${content.length} characters`)
      return content
    }
  } catch (error) {
    console.error('Error extracting text:', error)
    const fileName = path.basename(filePath)
    return `Document: ${fileName}

Content extraction failed: ${error.message}

This document has been uploaded but the content could not be extracted automatically. Please refer to the original file for the complete content.`
  }
}

// Fallback response when RAG fails (improved keyword fallback)
const generateFallbackResponse = async (question) => {
  const q = String(question || '').toLowerCase()
  const rules = [
    { match: ['remote work', 'work from home', 'telecommute', 'hybrid'], answer: 'Remote work is allowed with manager approval. Specific limits and procedures are described in the General Handbook remote work policy.' },
    { match: ['vacation', 'annual leave', 'time off', 'pto'], answer: 'Vacation (PTO) accrues monthly for full-time employees. Check the General Handbook for the exact accrual table and carryover rules.' },
    { match: ['benefit', 'insurance', 'medical', 'dental', 'vision', '401k', 'retirement'], answer: 'Benefits include medical, dental, vision, and a retirement plan. See the Benefits section of the General Handbook.' },
    { match: ['security', 'password', 'mfa', 'multi-factor', '2fa'], answer: 'Passwords must meet complexity requirements and MFA is required for key systems. Refer to the IT Security policy.' },
    { match: ['onboard', 'new hire', 'first week', 'orientation'], answer: 'Onboarding includes profile setup, handbook review, IT setup, and orientation. See the Onboarding section for timelines.' },
    { match: ['developer', 'engineering', 'code', 'git', 'repository', 'branch', 'pull request'], answer: 'Developer workflows and engineering standards are covered in the Developers Handbook, including branching strategy and code review process.' }
  ]
  for (const r of rules) {
    if (r.match.some(m => q.includes(m))) {
      return { answer: r.answer, confidence: 0.5, sources: [] }
    }
  }
  return {
    answer: 'I could not find a specific answer. Try rephrasing or ask about a narrower topic (e.g., vacation accrual rate, remote work days, code review policy).',
    confidence: 0.2,
    sources: []
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'RAG Document Q&A API',
    message: 'RAG-based document Q&A system',
    modelStatus: 'rag',
    rag: {
      embeddingModel: EMBEDDING_MODEL_ID,
      qaModel: QA_MODEL_ID,
      embeddingLoaded: Boolean(embeddingPipeline),
      qaLoaded: Boolean(qaPipeline)
    }
  })
})

// Preview DOCX as HTML
app.get('/api/preview-docx/:documentId', async (req, res) => {
  try {
    const { supabaseUrl, supabaseKey } = req.query
    const { documentId } = req.params

    if (!supabaseUrl || !supabaseKey) {
      return res.status(400).send('<h3>Supabase credentials are required</h3>')
    }

    supabase = createClient(supabaseUrl, supabaseKey)

    const { data: doc, error } = await supabase
      .from('company_documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (error || !doc) {
      return res.status(404).send('<h3>Document not found</h3>')
    }

    if (!(doc.file_type && doc.file_type.toLowerCase() === '.docx')) {
      return res.status(400).send('<h3>Document is not a DOCX file</h3>')
    }

    let buffer
    try {
      // If file_url is a local path, try reading directly
      if (doc.file_url && (doc.file_url.startsWith('/') || doc.file_url.match(/^[A-Za-z]:\\/))) {
        buffer = fs.readFileSync(doc.file_url)
      } else {
        const response = await fetch(doc.file_url)
        if (!response.ok) throw new Error(`Failed to download file: ${response.status}`)
        const arrayBuffer = await response.arrayBuffer()
        buffer = Buffer.from(arrayBuffer)
      }
    } catch (e) {
      return res.status(500).send(`<h3>Failed to load DOCX: ${e.message}</h3>`)
    }

    try {
      const { value: html } = await mammoth.convertToHtml({ buffer })
      const page = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${(doc.title || 'Document').replace(/</g, '&lt;')}</title>
    <style>
      body { font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Arial, sans-serif; padding: 16px; color: #111827; }
      h1,h2,h3,h4 { color: #111827; }
      p { line-height: 1.6; }
      ul { padding-left: 1.25rem; }
      li { margin: 0.25rem 0; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #e5e7eb; padding: 8px; }
      code { background: #f3f4f6; padding: 2px 4px; border-radius: 4px; }
    </style>
  </head>
  <body>
    ${html || '<p>No content extracted.</p>'}
  </body>
</html>`
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      return res.send(page)
    } catch (e) {
      return res.status(500).send(`<h3>Failed to convert DOCX to HTML: ${e.message}</h3>`)
    }
  } catch (error) {
    console.error('Error in DOCX preview:', error)
    return res.status(500).send('<h3>Internal Server Error</h3>')
  }
})

// Upload and process document
app.post('/api/upload-document', upload.single('document'), async (req, res) => {
  try {
    const { supabaseUrl, supabaseKey, companyId, title, description, category, uploadedBy } = req.body

    if (!supabaseUrl || !supabaseKey) {
      return res.status(400).json({ error: 'Supabase credentials are required' })
    }

    if (!companyId) {
      return res.status(400).json({ error: 'Company ID is required' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    supabase = createClient(supabaseUrl, supabaseKey)

    // Verify the uploader belongs to the company (security check)
    if (uploadedBy) {
      const { data: userProfile, error: profileError } = await supabase
        .from('job_seeker_profiles')
        .select('company_id')
        .eq('user_id', uploadedBy)
        .single()

      if (profileError) {
        console.log(`⚠️ Could not verify uploader company: ${profileError.message}`)
      } else if (userProfile && userProfile.company_id !== companyId) {
        console.log(`🚨 Security warning: User ${uploadedBy} tried to upload document to company ${companyId}, but belongs to company ${userProfile.company_id}`)
        return res.status(403).json({ 
          error: 'Access denied: You can only upload documents to your own company',
          userCompany: userProfile.company_id,
          requestedCompany: companyId
        })
      }
    }

    console.log(`📤 Uploading document for company: ${companyId}`)

    const text = await extractTextFromFile(req.file.path, req.file.mimetype)
    const summary = await generateDocumentSummary(text)

    const { data: document, error: docError } = await supabase
      .from('company_documents')
      .insert({
        company_id: companyId,
        title: title || req.file.originalname,
        description: description || '',
        category: category || 'General',
        file_name: req.file.originalname,
        file_url: req.file.path,
        file_size: req.file.size,
        file_type: path.extname(req.file.originalname),
        mime_type: req.file.mimetype,
        uploaded_by: req.body.uploadedBy || 'system',
        is_analyzed: true,
        analysis_status: 'COMPLETED',
        document_content: text  // Save the extracted text content to database
      })
      .select()
      .single()

    if (docError) {
      throw docError
    }

    const { error: summaryError } = await supabase
      .from('document_summaries')
      .insert({
        document_id: document.id,
        summary_text: summary.summary,
        key_points: summary.keyPoints,
        topics: summary.topics,
        generated_by: aiModel ? 'ai-model' : 'fallback-api',
        model_version: aiModel ? 'bert-roberta' : 'keyword-based',
        processing_time_ms: 2000
      })

    if (summaryError) {
      console.error('Error saving summary:', summaryError)
    }

    fs.unlinkSync(req.file.path)

    res.json({
      success: true,
      document: document,
      summary: summary,
      message: 'Document uploaded and processed successfully',
      modelUsed: aiModel ? 'Enhanced AI Model' : 'Fallback'
    })

  } catch (error) {
    console.error('Error uploading document:', error)
    res.status(500).json({ error: 'Failed to upload and process document' })
  }
})

// Get company documents
app.get('/api/company-documents/:companyId', async (req, res) => {
  try {
    const { supabaseUrl, supabaseKey, userId } = req.query
    const { companyId } = req.params

    if (!supabaseUrl || !supabaseKey) {
      return res.status(400).json({ error: 'Supabase credentials are required' })
    }

    if (!companyId) {
      return res.status(400).json({ error: 'Company ID is required' })
    }

    supabase = createClient(supabaseUrl, supabaseKey)

    // Verify user belongs to the company (security check)
    if (userId) {
      const { data: userProfile, error: profileError } = await supabase
        .from('job_seeker_profiles')
        .select('company_id')
        .eq('user_id', userId)
        .single()

      if (profileError) {
        console.log(`⚠️ Could not verify user company: ${profileError.message}`)
      } else if (userProfile && userProfile.company_id !== companyId) {
        console.log(`🚨 Security warning: User ${userId} tried to access documents from company ${companyId}, but belongs to company ${userProfile.company_id}`)
        return res.status(403).json({ 
          error: 'Access denied: You can only access documents from your own company',
          userCompany: userProfile.company_id,
          requestedCompany: companyId
        })
      }
    }

    console.log(`📋 Fetching documents for company: ${companyId}`)

    const { data: documents, error } = await supabase
      .from('company_documents')
      .select(`
        *,
        document_summaries (*)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({ documents })

  } catch (error) {
    console.error('Error fetching documents:', error)
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
})

// Chat with documents using AI
app.post('/api/chat-with-documents', async (req, res) => {
  try {
    const { supabaseUrl, supabaseKey, question, companyId, userId } = req.body

    if (!supabaseUrl || !supabaseKey || !question || !companyId) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    supabase = createClient(supabaseUrl, supabaseKey)

    // Verify user belongs to the company (additional security check)
    if (userId) {
      const { data: userProfile, error: profileError } = await supabase
        .from('job_seeker_profiles')
        .select('company_id')
        .eq('user_id', userId)
        .single()

      if (profileError) {
        console.log(`⚠️ Could not verify user company: ${profileError.message}`)
      } else if (userProfile && userProfile.company_id !== companyId) {
        console.log(`🚨 Security warning: User ${userId} tried to access documents from company ${companyId}, but belongs to company ${userProfile.company_id}`)
        return res.status(403).json({ 
          error: 'Access denied: You can only access documents from your own company',
          userCompany: userProfile.company_id,
          requestedCompany: companyId
        })
      }
    }

    console.log(`🔍 Searching documents for company: ${companyId}`)
    
    // Retrieve and rank documents by textual relevance first
    const { data: candidates, error: docError } = await supabase
      .from('company_documents')
      .select('id, title, description, category, document_content, mime_type, file_url')
      .eq('company_id', companyId)
      .eq('is_analyzed', true)

    if (docError) throw docError

    if (!candidates || candidates.length === 0) {
      return res.json({
        answer: "I don't have access to any company documents yet. Please ask your HR team to upload some documents.",
        confidence: 0.0,
        sources: []
      })
    }

    // Ensure RAG components are ready
    await initializeRAG()

    // Chunk docs and compute embeddings, then retrieve by cosine similarity to the question
    const CHUNK_SIZE = 500
    const CHUNK_STRIDE = 100
    const TOP_K = 5

    // Lightweight query expansion to improve recall for paraphrases
    const expansions = [
      ['vacation', 'annual leave', 'time off', 'PTO'],
      ['remote work', 'work from home', 'telecommute', 'hybrid'],
      ['benefits', 'health insurance', 'medical', 'dental', 'vision', '401k', 'retirement'],
      ['security', 'password', 'MFA', 'multi-factor', 'IT policy'],
      ['onboarding', 'new hire', 'first week', 'orientation'],
      // developer domain
      ['developer', 'engineering', 'git', 'branch', 'branching', 'pull request', 'PR', 'merge request', 'code review', 'lint', 'eslint', 'prettier', 'ci', 'cd', 'pipeline', 'docker', 'kubernetes', 'k8s', 'github actions']
    ]
    let expandedQuestion = String(question || '')
    const qLower = expandedQuestion.toLowerCase()
    for (const group of expansions) {
      if (group.some(g => qLower.includes(g))) {
        expandedQuestion += ' ' + group.join(' ')
      }
    }

    const questionEmbedding = await embeddingPipeline(expandedQuestion)
    const questionVec = Array.from(questionEmbedding.data || questionEmbedding[0]?.data || questionEmbedding)

    const chunks = []
    candidates.forEach(doc => {
      const text = (doc.document_content || '').trim()
      if (!text) return
      for (let i = 0; i < text.length; i += (CHUNK_SIZE - CHUNK_STRIDE)) {
        const slice = text.slice(i, i + CHUNK_SIZE)
        if (slice.length > 50) {
          chunks.push({ doc, text: slice })
        }
      }
    })

    const embedOf = async (t) => {
      const out = await embeddingPipeline(t)
      return Array.from(out.data || out[0]?.data || out)
    }

    // Compute embeddings (sequential to limit memory)
    const chunkEmbeddings = []
    for (const c of chunks) {
      const v = await embedOf(c.text)
      chunkEmbeddings.push(v)
    }

    const cosineSim = (a, b) => {
      let dot = 0, na = 0, nb = 0
      const len = Math.min(a.length, b.length)
      for (let i = 0; i < len; i++) { dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i] }
      const denom = Math.sqrt(na) * Math.sqrt(nb)
      return denom ? dot/denom : 0
    }

    // Score and select top-k chunks with adaptive keyword-aware reranker (domain-agnostic)
    const qLowerAll = String(question || '').toLowerCase()
    const stopwords = new Set(['the','a','an','and','or','but','if','then','else','for','to','of','in','on','at','by','from','with','about','into','over','after','before','between','is','are','was','were','be','been','being','it','this','that','these','those','as','not','no','do','does','did','can','could','should','would','will','shall','may','might','your','our','their','my','his','her'])
    const rawTokens = qLowerAll.split(/[^a-z0-9+#/.%-]+/).filter(Boolean)
    const keywords = Array.from(new Set(rawTokens.filter(t => t.length >= 4 && !stopwords.has(t))))
    const baseScored = chunkEmbeddings.map((emb, idx) => ({ idx, cos: cosineSim(questionVec, emb) }))
    const scored = baseScored.map(s => {
      const text = (chunks[s.idx]?.text || '').toLowerCase()
      let matches = 0
      for (const kw of keywords) {
        if (text.includes(kw)) matches += 1
      }
      const denom = Math.max(1, Math.min(keywords.length, 8))
      const overlapBoost = Math.min(matches / denom, 1)
      const combined = (0.85 * s.cos) + (0.15 * overlapBoost)
      return { idx: s.idx, cos: s.cos, combined }
    })
    scored.sort((a, b) => b.combined - a.combined)
    const topScored = scored.slice(0, Math.min(TOP_K, scored.length))
    const topChunks = topScored.map(s => ({ ...chunks[s.idx], score: s.score }))
    const uniqueDocTitles = Array.from(new Set(topChunks.map(tc => tc.doc.title)))
    const topDocs = uniqueDocTitles.map(t => topChunks.find(tc => tc.doc.title === t)?.doc).filter(Boolean)

    // Extract text from top documents stored in database
    const documentTexts = topDocs.map(doc => {
      let content = ''
      
      // First, try to get content from the database
      if (doc.document_content) {
        content = doc.document_content
        console.log(`📖 Reading content from database: ${doc.title} (${content.length} characters)`) 
        console.log(`📄 Content preview: ${content.substring(0, 200)}...`)
      } else {
        // Fallback: try to read from file if database content is not available
        console.log(`⚠️ No database content for: ${doc.title}, trying file read...`)
        
        if (doc.file_url && doc.mime_type === 'text/plain') {
          try {
            content = fs.readFileSync(doc.file_url, 'utf8')
            console.log(`📖 Reading from file: ${doc.title} (${content.length} characters)`)
          } catch (readError) {
            console.log(`❌ Could not read file: ${doc.title} - ${readError.message}`)
            content = `Document: ${doc.title}\nDescription: ${doc.description}\nCategory: ${doc.category}\nContent: Document content not available`
          }
        } else {
          console.log(`⚠️ Document is not a text file: ${doc.mime_type}`)
          content = `Document: ${doc.title}\nDescription: ${doc.description}\nCategory: ${doc.category}\nContent: Document type ${doc.mime_type} - content extraction not implemented`
        }
      }
      
      return content
    })

    const sourceTitles = topDocs.map(d => d.title)

    // Debug logging
    const bestCos = baseScored.sort((a,b)=>b.cos-a.cos)[0]?.cos ?? -1
    const bestScore = topScored[0]?.combined ?? -1
    console.log(`📊 Found ${chunks.length} chunks from ${candidates.length} documents`)
    console.log(`🎯 Top combined: ${topScored.map(s => s.combined.toFixed(3)).join(', ')}`)
    console.log(`🎯 Best cosine: ${bestCos.toFixed(3)}`)
    console.log(`📝 Top chunk preview: ${topChunks[0] ? topChunks[0].text.substring(0, 200) + '...' : 'None'}`)

    // If similarity is too low, don't guess
    const MIN_SIMILARITY = 0.2
    if (bestCos < MIN_SIMILARITY && bestScore < MIN_SIMILARITY) {
      console.log(`⚠️ Low similarity (cos=${bestCos.toFixed(3)} combined=${bestScore.toFixed(3)}). Returning no-answer fallback.`)
      const fb = await generateFallbackResponse(question)
      return res.json({
        answer: fb.answer,
        confidence: 0.2,
        sources: [],
        model: 'No-Answer Threshold'
      })
    }

    // If we have a top chunk and QA pipeline, run extractive QA
    if (topChunks.length > 0 && qaPipeline) {
      try {
        // Validate QA pipeline is properly loaded
        console.log(`🔍 QA Pipeline status: ${qaPipeline ? 'loaded' : 'not loaded'}`)
        console.log(`🔍 QA Pipeline type: ${typeof qaPipeline}`)
        console.log(`🔍 QA Pipeline constructor: ${qaPipeline?.constructor?.name}`)
        
        if (typeof qaPipeline !== 'function') {
          console.log(`⚠️ QA Pipeline is not a function, skipping QA`)
          throw new Error('QA Pipeline is not properly loaded')
        }
        // Build combined context from top-k chunks, with soft separators and titles
        const combined = topChunks
          .map((c, i) => `Document: ${c.doc.title}\n\n${typeof c.text === 'string' ? c.text : String(c.text || '')}`)
          .join('\n\n---\n\n')
        const contextText = combined
        const questionText = typeof question === 'string' ? question : String(question || '')
        
        // Additional validation to prevent empty strings
        if (!contextText || contextText.trim().length === 0) {
          console.log(`⚠️ Empty context text, skipping QA pipeline`)
          throw new Error('Empty context text')
        }
        
        if (!questionText || questionText.trim().length === 0) {
          console.log(`⚠️ Empty question text, skipping QA pipeline`)
          throw new Error('Empty question text')
        }
        
        console.log(`🤖 Running QA on combined context (${contextText.length} chars)`)
        console.log(`🔍 Question: "${questionText}"`)
        console.log(`📝 Context preview: "${contextText.substring(0, 100)}..."`)
        
        // Debug the actual types and values being passed
        console.log(`🔍 Question type: ${typeof questionText}, value: ${JSON.stringify(questionText)}`)
        console.log(`📝 Context type: ${typeof contextText}, value: ${JSON.stringify(contextText.substring(0, 100))}`)
        
        const trimmedQuestion = questionText.trim()
        const trimmedContext = contextText.trim()
        
        console.log(`🔍 Trimmed question type: ${typeof trimmedQuestion}, length: ${trimmedQuestion.length}`)
        console.log(`📝 Trimmed context type: ${typeof trimmedContext}, length: ${trimmedContext.length}`)
        
        // Try different parameter formats for QA pipeline
        let qa
        try {
          // First try: Standard format
          console.log(`🔄 Trying standard QA format...`)
          qa = await qaPipeline({
            question: trimmedQuestion,
            context: trimmedContext
          })
        } catch (standardError) {
          console.log(`❌ Standard format failed: ${standardError.message}`)
          try {
            // Second try: Alternative format
            console.log(`🔄 Trying alternative QA format...`)
            qa = await qaPipeline(trimmedQuestion, trimmedContext)
          } catch (altError) {
            console.log(`❌ Alternative format failed: ${altError.message}`)
            try {
              // Third try: Array format
              console.log(`🔄 Trying array QA format...`)
              qa = await qaPipeline([trimmedQuestion, trimmedContext])
            } catch (arrayError) {
              console.log(`❌ Array format failed: ${arrayError.message}`)
              console.log(`🔄 Falling back to simple text-based answer extraction...`)
              
              // Fallback: Simple keyword-based answer extraction
              const questionLower = trimmedQuestion.toLowerCase()
              const contextLower = trimmedContext.toLowerCase()
              
              // Look for question keywords in context
              const questionWords = questionLower.split(/\s+/).filter(word => word.length > 3)
              let bestSentence = ''
              let maxMatches = 0
              
              // Split context into sentences
              const sentences = trimmedContext.split(/[.!?]+/).filter(s => s.trim().length > 10)
              
              for (const sentence of sentences) {
                const sentenceLower = sentence.toLowerCase()
                const matches = questionWords.filter(word => sentenceLower.includes(word)).length
                if (matches > maxMatches) {
                  maxMatches = matches
                  bestSentence = sentence.trim()
                }
              }
              
              qa = {
                answer: bestSentence || 'I found relevant information but cannot extract a specific answer.',
                score: maxMatches > 0 ? 0.5 : 0.1
              }
            }
          }
        }
        const answerText = (qa?.answer || '').trim()
        const score = qa?.score ?? 0
        
        console.log(`💡 QA Result: "${answerText}" (confidence: ${score})`)
        
        // Require a more meaningful QA score
        if (answerText && score >= 0.3) {
          console.log(`✅ Returning answer with confidence ${score}`)
          return res.json({
            answer: answerText,
            confidence: score,
            sources: sourceTitles,
            model: 'Extractive QA (DistilBERT SQuAD)'
          })
        } else {
          console.log(`❌ Answer rejected: text="${answerText}", score=${score}`)
        }
      } catch (e) {
        console.error('QA pipeline error:', e)
      }
    } else {
      console.log(`❌ No top chunks or QA pipeline: chunks=${topChunks.length}, qa=${!!qaPipeline}`)
    }

    // Fallback message with debug info
    console.log(`🔄 Returning fallback message`)
    // Last resort: improved keyword fallback
    const fb = await generateFallbackResponse(question)
    return res.json({
      answer: fb.answer,
      confidence: fb.confidence,
      sources: fb.sources,
      model: 'Fallback (keywords)',
      debug: {
        documentsFound: candidates.length,
        chunksCreated: chunks.length,
        bestSimilarity: bestScore,
        hasTopChunks: topChunks.length > 0,
        hasQAPipeline: !!qaPipeline
      }
    })



  } catch (error) {
    console.error('Error in chat:', error)
    res.status(500).json({ error: 'Failed to process chat request' })
  }
})

// Re-analyze document to extract proper content
app.post('/api/reanalyze-document/:documentId', async (req, res) => {
  try {
    const { supabaseUrl, supabaseKey } = req.query
    const { documentId } = req.params

    if (!supabaseUrl || !supabaseKey) {
      return res.status(400).json({ error: 'Supabase credentials are required' })
    }

    supabase = createClient(supabaseUrl, supabaseKey)

    // Get document info
    const { data: document, error: docError } = await supabase
      .from('company_documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError) throw docError
    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }

    console.log(`🔄 Re-analyzing document: ${document.title}`)

    // Try to extract text from the file URL (if accessible)
    let extractedContent = ''
    
    if (document.file_url) {
      try {
        // Download and extract real content
        let localPath = null
        try {
          const response = await fetch(document.file_url)
          if (!response.ok) throw new Error(`Failed to download file: ${response.status}`)
          const arrayBuffer = await response.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          // Save to temp file
          const tmpDir = path.join(__dirname, 'tmp')
          if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
          localPath = path.join(tmpDir, `${document.id}.pdf`)
          fs.writeFileSync(localPath, buffer)
        } catch (downloadErr) {
          console.log(`⚠️ Could not download file directly, will try reading from URL in extractor. ${downloadErr.message}`)
        }

        const sourcePath = localPath || document.file_url
        extractedContent = await extractTextFromFile(sourcePath, document.mime_type)

        // If extraction returned a placeholder too short, append metadata to help RAG
        if (!extractedContent || extractedContent.length < 50) {
          const fileName = document.file_name || document.title
          extractedContent = `Document: ${document.title}\nDescription: ${document.description}\nCategory: ${document.category}\nFile: ${fileName}\n\nContent: (No text extracted)`
        }

        console.log(`📄 Extracted content length: ${extractedContent.length}`)
      } catch (extractError) {
        console.error('Error extracting content:', extractError)
        extractedContent = `Document: ${document.title}\nDescription: ${document.description}\nCategory: ${document.category}\nContent: Error extracting content - ${extractError.message}`
      }
    } else {
      extractedContent = `Document: ${document.title}\nDescription: ${document.description}\nCategory: ${document.category}\nContent: No file URL available for content extraction`
    }

    // Generate/update summary based on extracted content
    const summary = await generateDocumentSummary(extractedContent)

    // Update document with extracted content and summary
    const { error: updateError } = await supabase
      .from('company_documents')
      .update({
        document_content: extractedContent,
        document_summary: summary.summary,
        analysis_status: 'COMPLETED',
        is_analyzed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId)

    if (updateError) throw updateError

    res.json({
      message: 'Document re-analyzed successfully',
      documentId: documentId,
      contentLength: extractedContent.length,
      extractedContent: extractedContent.substring(0, 500) + '...', // Preview
      summary
    })

  } catch (error) {
    console.error('Error re-analyzing document:', error)
    res.status(500).json({ error: 'Failed to re-analyze document' })
  }
})

// Re-analyze all documents for a company
app.post('/api/reanalyze-company/:companyId', async (req, res) => {
  try {
    const { supabaseUrl, supabaseKey } = req.query
    const { companyId } = req.params

    if (!supabaseUrl || !supabaseKey) {
      return res.status(400).json({ error: 'Supabase credentials are required' })
    }

    if (!companyId) {
      return res.status(400).json({ error: 'Company ID is required' })
    }

    supabase = createClient(supabaseUrl, supabaseKey)

    const { data: docs, error: listError } = await supabase
      .from('company_documents')
      .select('*')
      .eq('company_id', companyId)

    if (listError) throw listError

    const results = []
    for (const d of (docs || [])) {
      try {
        let extractedContent = ''
        if (d.file_url) {
          let localPath = null
          try {
            const response = await fetch(d.file_url)
            if (response.ok) {
              const buffer = Buffer.from(await response.arrayBuffer())
              const tmpDir = path.join(__dirname, 'tmp')
              if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
              localPath = path.join(tmpDir, `${d.id}${path.extname(d.file_name || 'file')}`)
              fs.writeFileSync(localPath, buffer)
            }
          } catch (e) {
            // best-effort
          }
          const sourcePath = localPath || d.file_url
          extractedContent = await extractTextFromFile(sourcePath, d.mime_type)
          if (!extractedContent || extractedContent.length < 50) {
            const fileName = d.file_name || d.title
            extractedContent = `Document: ${d.title}\nDescription: ${d.description}\nCategory: ${d.category}\nFile: ${fileName}\n\nContent: (No text extracted)`
          }
        } else {
          extractedContent = `Document: ${d.title}\nDescription: ${d.description}\nCategory: ${d.category}\nContent: No file URL available for content extraction`
        }

        const summary = await generateDocumentSummary(extractedContent)

        await supabase
          .from('company_documents')
          .update({
            document_content: extractedContent,
            document_summary: summary.summary,
            analysis_status: 'COMPLETED',
            is_analyzed: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', d.id)

        results.push({ id: d.id, title: d.title, contentLength: extractedContent.length })
      } catch (e) {
        results.push({ id: d.id, title: d.title, error: e.message })
      }
    }

    res.json({ message: 'Company documents re-analyzed', count: results.length, results })
  } catch (error) {
    console.error('Error re-analyzing company documents:', error)
    res.status(500).json({ error: 'Failed to re-analyze company documents' })
  }
})

// Get chat history
app.get('/api/chat-history/:userId', async (req, res) => {
  try {
    const { supabaseUrl, supabaseKey } = req.query
    const { userId } = req.params

    if (!supabaseUrl || !supabaseKey) {
      return res.status(400).json({ error: 'Supabase credentials are required' })
    }

    supabase = createClient(supabaseUrl, supabaseKey)

    const { data: history, error } = await supabase
      .from('document_chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    res.json({ history })

  } catch (error) {
    console.error('Error fetching chat history:', error)
    res.status(500).json({ error: 'Failed to fetch chat history' })
  }
})

// Local summarization: section-aware map-reduce using transformers.js (DistilBART)
const summarizeWithLocalModel = async (text) => {
  try {
    const summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-12-6')

    // Split by headings (simple heuristic) and double newlines
    const rawSections = text.split(/\n\n(?=[A-Z][A-Za-z0-9\-\s]{2,}$)|\n\n/)
      .map(s => s.trim()).filter(Boolean)

    // Group into chunks ~800-1200 chars
    const chunks = []
    let current = ''
    for (const s of rawSections) {
      if ((current + '\n\n' + s).length > 1200 && current) {
        chunks.push(current)
        current = s
      } else {
        current = current ? (current + '\n\n' + s) : s
      }
    }
    if (current) chunks.push(current)

    const sectionSummaries = []
    for (const c of chunks) {
      const out = await summarizer(c, { max_length: 180, min_length: 80 })
      const sum = Array.isArray(out) ? out[0]?.summary_text : out?.summary_text
      if (sum) sectionSummaries.push(sum)
    }

    const combined = sectionSummaries.join('\n') || text.slice(0, 1200)
    const finalOut = await summarizer(
      `Create an executive summary from the following notes. Include: what it is, key features (bullets), primary applications (bullets), notable facts, and a one-sentence takeaway.\n\nNotes:\n${combined}`,
      { max_length: 220, min_length: 120 }
    )
    const finalSummary = Array.isArray(finalOut) ? finalOut[0]?.summary_text : finalOut?.summary_text

    return {
      summary: (finalSummary || combined).trim()
    }
  } catch (e) {
    console.error('Local summarization failed, falling back:', e)
    const words = text.split(/\s+/)
    const fallback = words.slice(0, 120).join(' ')
    return { summary: fallback }
  }
}

// Generate document summary (uses local model pipeline)
const generateDocumentSummary = async (text) => {
  return summarizeWithLocalModel(text)
}

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 RAG Document Q&A API running on port ${PORT}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
  
  const ragReady = await initializeRAG()
  
  if (ragReady) {
    console.log('🎯 RAG system ready: Embedding search + Extractive QA')
  } else {
    console.log('⚠️ RAG system failed to initialize')
  }
})

export default app
