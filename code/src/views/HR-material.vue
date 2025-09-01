<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <header class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-3">
              <FolderIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">HR Onboarding Material Management</h1>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="relative">
      
              <div
                v-if="showAIHistoryDropdown"
                class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
              >
                <div class="p-4 border-b border-gray-100">
                  <h3 class="font-semibold text-gray-900">Previously AI Matched Jobs</h3>
                  <p class="text-xs text-gray-500 mt-1">Recent AI matching results</p>
                </div>
                
                <div class="max-h-64 overflow-y-auto">
                  <div
                    v-for="job in aiMatchHistory"
                    :key="job.id"
                    class="p-4 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 cursor-pointer transition-colors"
                    @click="viewAIMatchHistory(job)"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-900 text-sm">{{ job.title }}</h4>
                        <p class="text-xs text-gray-500">{{ job.department }} • {{ job.matchedDate }}</p>
                        <div class="flex items-center mt-2 space-x-4">
                          <span class="text-xs text-blue-600 font-medium">
                            {{ job.totalCandidates }} candidates matched
                          </span>
                          <span class="text-xs text-green-600 font-medium">
                            {{ job.topMatchScore }}% top score
                          </span>
                        </div>
                      </div>
                      <div class="ml-3">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="p-3 border-t border-gray-100">
                  <button class="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-1">
                    View All AI Match History
                  </button>
                </div>
              </div>
            </div>
          
                      <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
              <div class="h-2 w-2 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-700">HR Manager</span>
            </div>
          </div>
          </div>
        </div>
      </div>
      <div
        v-if="showAIHistoryDropdown"
        class="fixed inset-0 z-40"
        @click="showAIHistoryDropdown = false"
      ></div>
    </header>

    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Job Selector -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Select Job</label>
        <select v-model="selectedJobId" class="w-full px-4 py-2 border rounded-lg">
          <option value="general">General (All Jobs)</option>
          <option v-for="job in jobs" :key="job.id" :value="job.id">{{ job.title }}</option>
        </select>
      </div>

      <!-- Upload Form Section -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
        <h2 class="text-lg font-bold mb-4 text-gray-900">
          Upload New Material for {{ jobs.find(j => j.id === selectedJobId)?.title }}
        </h2>
        <form @submit.prevent="uploadDocument" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Document Name</label>
            <input v-model="newDoc.name" type="text" required class="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Employee Handbook" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <input v-model="newDoc.category" type="text" required class="w-full px-4 py-2 border rounded-lg" placeholder="e.g. HR Policies" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input v-model="newDoc.description" type="text" required class="w-full px-4 py-2 border rounded-lg" placeholder="Short summary of the document" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select v-model="newDoc.type" required class="w-full px-4 py-2 border rounded-lg">
              <option value="PDF">PDF</option>
              <option value="DOCX">DOCX</option>
              <option value="TXT">TXT</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">File</label>
            <label
              class="flex items-center gap-2 cursor-pointer bg-blue-300 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow transition"
              for="material-upload"
            >
              <FileTextIcon class="h-5 w-5" />
              <span>
                {{ newDoc.file ? 'Change File' : 'Choose File' }}
              </span>
            </label>
            <input
              id="material-upload"
              name="document-file"
              type="file"
              @change="handleFileUpload"
              required
              class="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
            <span v-if="newDoc.file" class="text-xs text-blue-600 mt-2 block font-medium">
              <FileTextIcon class="h-4 w-4 inline mr-1" /> Selected: {{ newDoc.file.name }}
            </span>
          </div>
          <div class="flex items-end">
            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Upload
            </button>
          </div>
        </form>
        <div v-if="uploadError" class="mt-4 text-red-600 text-sm font-medium">
          {{ uploadError }}
        </div>
      </div>

      <!-- Document List -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <h2 class="text-lg font-bold mb-4 text-gray-900">Materials for {{ jobs.find(j => j.id === selectedJobId)?.title }}</h2>
        <!-- Loading state -->
        <div v-if="isLoadingDocuments" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-gray-600 mt-2">Loading documents...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="documentError" class="text-center py-8">
          <p class="text-red-600">{{ documentError }}</p>
          <button @click="loadCompanyDocuments" class="mt-2 text-blue-600 hover:text-blue-700">
            Try again
          </button>
        </div>

        <!-- Documents list -->
        <div v-else-if="companyDocuments.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="doc in companyDocuments"
            :key="doc.id"
            class="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center">
                <div :class="['h-12 w-12 rounded-lg flex items-center justify-center mr-3', getDocumentTypeColor(doc.file_type)]">
                  <FileTextIcon class="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">{{ doc.title }}</h4>
                  <p class="text-sm text-gray-600">{{ doc.category }}</p>
                  <p class="text-xs text-gray-500">{{ formatFileSize(doc.file_size) }} • {{ doc.file_type }}</p>
                </div>
              </div>
              <div class="text-right">
                <span :class="['px-2 py-1 rounded-full text-xs font-medium', doc.is_analyzed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800']">
                  {{ doc.is_analyzed ? 'Analyzed' : 'Pending' }}
                </span>
              </div>
            </div>
            <p class="text-sm text-gray-700 mb-2">{{ doc.description }}</p>
            <div class="flex items-center gap-2 mt-2">
              <a :href="doc.file_url" target="_blank" class="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium">
                <EyeIcon class="h-4 w-4 inline mr-1" /> View
              </a>
              <button @click="markAnalyzed(doc)" :disabled="doc.is_analyzed" class="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-medium disabled:opacity-50">
                <SparklesIcon class="h-4 w-4 inline mr-1" /> Mark Analyzed
              </button>
              <button @click="editDocument(doc)" class="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs font-medium">
                <FileTextIcon class="h-4 w-4 inline mr-1" /> Edit
              </button>
              <button @click="deleteDocument(doc.id)" class="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-medium">
                <TrashIcon class="h-4 w-4 inline mr-1" /> Delete
              </button>
            </div>
            <div v-if="doc.is_analyzed && doc.document_summaries && doc.document_summaries[0]" class="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
              <h5 class="font-semibold text-green-700 mb-1">AI Summary:</h5>
              <p class="text-sm text-gray-700">{{ doc.document_summaries[0].summary_text }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500 text-sm">No documents uploaded yet.</div>
      </div>

      <!-- Jobseeker Onboarding Progress Tracker -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mt-8">
        <h2 class="text-lg font-bold mb-4 text-gray-900">Jobseeker Onboarding Progress</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-700">Job</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-700">Progress</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-700">Completed Tasks</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="js in jobseekers" :key="js.id" class="border-b">
                <td class="px-4 py-2">{{ js.name }}</td>
                <td class="px-4 py-2">{{ jobs.find(j => j.id === js.jobId)?.title }}</td>
                <td class="px-4 py-2">
                  <div class="w-32 bg-gray-200 rounded-full h-3">
                    <div
                      class="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      :style="{ width: js.progress + '%' }"
                    ></div>
                  </div>
                  <span class="ml-2 font-medium text-gray-700">{{ js.progress }}%</span>
                </td>
                <td class="px-4 py-2">{{ js.completedTasks }}/{{ js.totalTasks }}</td>
                <td class="px-4 py-2">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      js.progress === 100 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    ]"
                  >
                    {{ js.progress === 100 ? 'Completed' : 'In Progress' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
        <button @click="showPreview = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XIcon class="h-6 w-6" />
        </button>
        <h2 class="text-xl font-bold mb-4 text-gray-900">Preview: {{ previewDoc.name }}</h2>
        <p class="text-gray-700 mb-2">{{ previewDoc.description }}</p>
        <div v-if="previewDoc.analyzed && previewDoc.summary" class="bg-green-50 border border-green-200 rounded-lg p-3">
          <h5 class="font-semibold text-green-700 mb-1">AI Summary:</h5>
          <p class="text-sm text-gray-700">{{ previewDoc.summary }}</p>
        </div>
        <div v-else class="text-gray-500 text-sm">No summary available yet.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { 
  FolderIcon, FileTextIcon, EyeIcon, SparklesIcon, TrashIcon, XIcon
} from 'lucide-vue-next'

// Example jobs
const jobs = ref([
  { id: 1, title: 'Frontend Developer' },
  { id: 2, title: 'Backend Engineer' },
  { id: 3, title: 'QA Tester' }
])

const selectedJobId = ref(jobs.value[0].id)

// Company documents (will be loaded from database)
const companyDocuments = ref([])
const isLoadingDocuments = ref(false)
const documentError = ref('')
const uploadError = ref('')
const isUploading = ref(false)

// Documents per job (object keyed by jobId)
const jobDocuments = ref({
  1: [ // Frontend Developer
    {
      id: 101,
      name: 'Frontend Onboarding Guide',
      category: 'HR Policies',
      description: 'Guide for frontend team onboarding.',
      type: 'PDF',
      analyzed: true,
      summary: 'Covers code standards, UI/UX guidelines, and team contacts.'
    }
  ],
  2: [ // Backend Engineer
    {
      id: 201,
      name: 'Backend Security Checklist',
      category: 'IT & Security',
      description: 'Checklist for backend security practices.',
      type: 'PDF',
      analyzed: false,
      summary: ''
    }
  ],
  3: [] // QA Tester
})

const newDoc = ref({
  name: '',
  category: '',
  description: '',
  type: 'PDF',
  file: null
})

const showPreview = ref(false)
const previewDoc = ref({})

const jobseekers = ref([
  {
    id: 1,
    name: 'Sarah Johnson',
    jobId: 1,
    progress: 100,
    completedTasks: 12,
    totalTasks: 12
  },
  {
    id: 2,
    name: 'Michael Chen',
    jobId: 2,
    progress: 75,
    completedTasks: 9,
    totalTasks: 12
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    jobId: 3,
    progress: 50,
    completedTasks: 6,
    totalTasks: 12
  },
  {
    id: 4,
    name: 'David Kim',
    jobId: 1,
    progress: 25,
    completedTasks: 3,
    totalTasks: 12
  }
])

function handleFileUpload(e) {
  newDoc.value.file = e.target.files[0]
}

async function uploadDocument() {
  try {
    // 1. Validate all fields
    if (
      !newDoc.value.name ||
      !newDoc.value.category ||
      !newDoc.value.description ||
      !newDoc.value.type ||
      !newDoc.value.file
    ) {
      alert('Please fill in all fields and select a file.')
      return
    }

    isUploading.value = true
    uploadError.value = ''

    // 2. Get current user and company profile
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (!currentUser.id) {
      throw new Error('User session not found')
    }

    // Get user's company profile
    const { data: companyProfile, error: companyError } = await supabase
      .from('company_profiles')
      .select('id')
      .eq('user_id', currentUser.id)
      .single()

    if (companyError || !companyProfile) {
      throw new Error('Company profile not found')
    }

    // 3. Upload file to Supabase Storage
    const file = newDoc.value.file
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `company-documents/${companyProfile.id}/${fileName}`

    const { data: uploadData, error: storageError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (storageError) {
      throw new Error(`File upload failed: ${storageError.message}`)
    }

    // 4. Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath)

    // 5. Save document metadata to database
    const documentData = {
      company_id: companyProfile.id,
      title: newDoc.value.name,
      description: newDoc.value.description,
      category: newDoc.value.category,
      file_name: file.name,
      file_url: publicUrl,
      file_size: file.size,
      file_type: `.${fileExt}`,
      mime_type: file.type,
      uploaded_by: currentUser.id,
      is_public: false,
      is_analyzed: false,
      analysis_status: 'PENDING'
    }

    const { data: savedDocument, error: saveError } = await supabase
      .from('company_documents')
      .insert(documentData)
      .select()
      .single()

    if (saveError) {
      throw new Error(`Database save failed: ${saveError.message}`)
    }

    // 6. Add to local documents list
    companyDocuments.value.unshift(savedDocument)

    // 7. Reset form
    newDoc.value = { name: '', category: 'HR Policies', description: '', type: 'PDF', file: null }
    
    // Clear file input
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) fileInput.value = ''

    alert('Document uploaded successfully!')

  } catch (error) {
    console.error('Error uploading document:', error)
    uploadError.value = error.message
    alert(`Upload failed: ${error.message}`)
  } finally {
    isUploading.value = false
  }
}

function formatFileSize(bytes) {
  if (!bytes) return 'Unknown size'
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

function getDocumentTypeColor(type) {
  // Handle file extensions (e.g., '.pdf', '.docx')
  const fileType = type ? type.replace('.', '').toUpperCase() : 'UNKNOWN'
  const colors = { 
    PDF: 'bg-red-500', 
    DOCX: 'bg-blue-500', 
    DOC: 'bg-blue-600',
    TXT: 'bg-gray-500',
    JPG: 'bg-green-500',
    JPEG: 'bg-green-500',
    PNG: 'bg-green-600'
  }
  return colors[fileType] || 'bg-gray-500'
}

function previewDocument(doc) {
  previewDoc.value = doc
  showPreview.value = true
}

async function markAnalyzed(doc) {
  try {
    // Update the document in the database
    const { error: updateError } = await supabase
      .from('company_documents')
      .update({ 
        is_analyzed: true, 
        analysis_status: 'COMPLETED' 
      })
      .eq('id', doc.id)

    if (updateError) {
      throw new Error(`Failed to update document: ${updateError.message}`)
    }

    // Update local state
    doc.is_analyzed = true
    doc.analysis_status = 'COMPLETED'
    
    alert('Document marked as analyzed!')
  } catch (error) {
    console.error('Error marking document as analyzed:', error)
    alert(`Failed to mark as analyzed: ${error.message}`)
  }
}

function editDocument(doc) {
  alert('Edit functionality coming soon!')
}

// Load company documents from database
const loadCompanyDocuments = async () => {
  try {
    isLoadingDocuments.value = true
    documentError.value = ''
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (!currentUser.id) {
      throw new Error('User session not found')
    }
    
    // Get user's company profile
    const { data: companyProfile, error: companyError } = await supabase
      .from('company_profiles')
      .select('id')
      .eq('user_id', currentUser.id)
      .single()
    
    if (companyError || !companyProfile) {
      throw new Error('Company profile not found')
    }
    
    // Fetch documents directly from the database
    const { data: documents, error: fetchError } = await supabase
      .from('company_documents')
      .select('*')
      .eq('company_id', companyProfile.id)
      .order('created_at', { ascending: false })
    
    if (fetchError) {
      throw new Error(`Failed to fetch documents: ${fetchError.message}`)
    }
    
    companyDocuments.value = documents || []
    
  } catch (error) {
    console.error('Error loading company documents:', error)
    documentError.value = error.message
    companyDocuments.value = []
  } finally {
    isLoadingDocuments.value = false
  }
}

async function deleteDocument(docId) {
  try {
    if (!confirm('Are you sure you want to delete this document?')) {
      return
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('company_documents')
      .delete()
      .eq('id', docId)

    if (deleteError) {
      throw new Error(`Failed to delete document: ${deleteError.message}`)
    }

    // Remove from local list
    companyDocuments.value = companyDocuments.value.filter(d => d.id !== docId)
    
    alert('Document deleted successfully!')
  } catch (error) {
    console.error('Error deleting document:', error)
    alert(`Delete failed: ${error.message}`)
  }
}

// Load documents when component mounts
onMounted(() => {
  loadCompanyDocuments()
})
</script>