// Document Service for handling company documents and AI chat
export class DocumentService {
  static apiBaseUrl = '/api'

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

  // Chat with documents using AI
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

  // Format file size
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format date
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

  // Get document icon based on file type
  static getDocumentIcon(fileType) {
    const icons = {
      'pdf': 'FileTextIcon',
      'doc': 'FileTextIcon',
      'docx': 'FileTextIcon',
      'txt': 'FileTextIcon',
      'default': 'FileIcon'
    }
    return icons[fileType.toLowerCase()] || icons.default
  }

  // Validate file upload
  static validateFile(file) {
    const maxSize = 50 * 1024 * 1024 // 50MB
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (file.size > maxSize) {
      throw new Error('File size must be less than 50MB')
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only PDF, DOC, DOCX, and TXT files are allowed')
    }

    return true
  }

  // Get document categories
  static getDocumentCategories() {
    return [
      'HR Policies',
      'IT & Security',
      'Benefits',
      'Training',
      'Compliance',
      'Safety',
      'General'
    ]
  }

  // Search documents by category
  static filterDocumentsByCategory(documents, category) {
    if (!category || category === 'All') return documents
    return documents.filter(doc => doc.category === category)
  }

  // Search documents by title or description
  static searchDocuments(documents, searchTerm) {
    if (!searchTerm) return documents
    const term = searchTerm.toLowerCase()
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(term) ||
      doc.description.toLowerCase().includes(term) ||
      doc.category.toLowerCase().includes(term)
    )
  }
}
