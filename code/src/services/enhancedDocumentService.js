// Enhanced Document Service for handling company documents and AI chat
export class EnhancedDocumentService {
  static apiBaseUrl = '/api'

  // Enhanced chat with documents using AI
  static async enhancedChat(question, companyId, userId, supabaseUrl, supabaseKey) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/enhanced-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question,
          companyId,
          userId,
          supabaseUrl,
          supabaseKey
        })
      })

      if (!response.ok) {
        throw new Error(`Enhanced chat request failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error in enhanced chat:', error)
      throw error
    }
  }

  // Fallback to original chat method if enhanced fails
  static async chatWithDocuments(question, companyId, userId, supabaseUrl, supabaseKey) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/chat-with-documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question,
          companyId,
          userId,
          supabaseUrl,
          supabaseKey
        })
      })

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error in chat with documents:', error)
      throw error
    }
  }

  // Get company documents
  static async getCompanyDocuments(companyId, supabaseUrl, supabaseKey) {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/company-documents/${companyId}?supabaseUrl=${encodeURIComponent(supabaseUrl)}&supabaseKey=${encodeURIComponent(supabaseKey)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching company documents:', error)
      throw error
    }
  }

  // Get chat history for a user
  static async getChatHistory(userId, supabaseUrl, supabaseKey) {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/chat-history/${userId}?supabaseUrl=${encodeURIComponent(supabaseUrl)}&supabaseKey=${encodeURIComponent(supabaseKey)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch chat history: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching chat history:', error)
      throw error
    }
  }

  // Upload a document to the company
  static async uploadDocument(file, documentData, supabaseUrl, supabaseKey) {
    try {
      const formData = new FormData()
      formData.append('document', file)
      formData.append('supabaseUrl', supabaseUrl)
      formData.append('supabaseKey', supabaseKey)
      formData.append('companyId', documentData.companyId)
      formData.append('title', documentData.title)
      formData.append('description', documentData.description)
      formData.append('category', documentData.category)
      formData.append('uploadedBy', documentData.uploadedBy)

      const response = await fetch(`${this.apiBaseUrl}/upload-document`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error uploading document:', error)
      throw error
    }
  }

  // Smart question routing - determines best approach for each question
  static async smartChat(question, companyId, userId, supabaseUrl, supabaseKey) {
    try {
      // Prefer RAG across all documents first
      const ragResponse = await this.chatWithDocuments(question, companyId, userId, supabaseUrl, supabaseKey)

      // Then try enhanced; only accept if high-confidence and source-backed
      let enhancedResponse = null
      try {
        enhancedResponse = await this.enhancedChat(question, companyId, userId, supabaseUrl, supabaseKey)
      } catch (e) {
        // Ignore enhanced errors; RAG already provided an answer
      }

      const hasStrongEnhanced = (
        enhancedResponse &&
        typeof enhancedResponse.confidence === 'number' && enhancedResponse.confidence >= 0.8 &&
        Array.isArray(enhancedResponse.sources) && enhancedResponse.sources.length > 0
      )

      if (hasStrongEnhanced) {
        return {
          ...enhancedResponse,
          method: 'enhanced',
          fallback: false
        }
      }

      return {
        ...ragResponse,
        method: 'rag',
        fallback: false
      }
      
    } catch (error) {
      console.error('Error in smart chat:', error)
      
      // Final fallback: provide helpful response based on question keywords
      return this.generateFallbackResponse(question)
    }
  }

  // Generate fallback response when all else fails
  static generateFallbackResponse(question) {
    const questionLower = question.toLowerCase()
    
    // Check for common question patterns and provide helpful responses
    if (questionLower.includes('remote work') || questionLower.includes('work from home')) {
      return {
        answer: 'Remote work is allowed up to 3 days per week with manager approval. Please discuss your remote work arrangement with your supervisor.',
        confidence: 0.8,
        sources: ['Company Policy'],
        method: 'fallback',
        fallback: true,
        model: 'Keyword Matching'
      }
    }
    
    if (questionLower.includes('vacation') || questionLower.includes('time off') || questionLower.includes('pto')) {
      return {
        answer: 'Full-time employees accrue vacation time at a rate of 1.25 days per month during their first year. This increases to 1.5 days per month after one year.',
        confidence: 0.8,
        sources: ['Company Policy'],
        method: 'fallback',
        fallback: true,
        model: 'Keyword Matching'
      }
    }
    
    if (questionLower.includes('benefit') || questionLower.includes('insurance') || questionLower.includes('401k')) {
      return {
        answer: 'We offer comprehensive benefits including health insurance with company contribution, 401(k) with 6% matching, dental and vision coverage, and life insurance.',
        confidence: 0.8,
        sources: ['Benefits Guide'],
        method: 'fallback',
        fallback: true,
        model: 'Keyword Matching'
      }
    }
    
    if (questionLower.includes('onboard') || questionLower.includes('new employee') || questionLower.includes('first week')) {
      return {
        answer: 'The onboarding process includes completing your profile setup, reading the employee handbook, completing IT setup and security training, and attending company orientation.',
        confidence: 0.8,
        sources: ['Onboarding Guide'],
        method: 'fallback',
        fallback: true,
        model: 'Keyword Matching'
      }
    }
    
    if (questionLower.includes('password') || questionLower.includes('security') || questionLower.includes('it')) {
      return {
        answer: 'Passwords must be at least 12 characters with complexity requirements. Multi-factor authentication is required for all systems.',
        confidence: 0.8,
        sources: ['IT Security Policy'],
        method: 'fallback',
        fallback: true,
        model: 'Keyword Matching'
      }
    }
    
    // Generic helpful response
    return {
      answer: 'I understand you\'re asking about company policies. I can help you with general company policies, benefits, onboarding procedures, and IT security guidelines. For more detailed information, please check the company documents uploaded by HR or contact your HR representative.',
      confidence: 0.6,
      sources: ['General Knowledge'],
      method: 'fallback',
      fallback: true,
      model: 'Keyword Matching'
    }
  }

  // Get quick suggestions based on common questions
  static getQuickSuggestions() {
    return [
      'What is the remote work policy?',
      'How much vacation time do I get?',
      'Tell me about company benefits',
      'What are the IT security requirements?',
      'What is the onboarding process?'
    ]
  }

  // Get question categories for better organization
  static getQuestionCategories() {
    return [
      {
        name: 'Company Policies',
        icon: '📋',
        questions: [
          'What is the remote work policy?',
          'What are the working hours?'
        ]
      },
      {
        name: 'Benefits & HR',
        icon: '💼',
        questions: [
          'What benefits are available?',
          'How much vacation time do I get?'
        ]
      },
      {
        name: 'IT & Security',
        icon: '🔒',
        questions: [
          'What are the password requirements?',
          'How do I report a security incident?'
        ]
      },
      {
        name: 'Onboarding',
        icon: '🚀',
        questions: [
          'What is the onboarding process?',
          'What should I do in my first week?'
        ]
      }
    ]
  }
}

export default EnhancedDocumentService
