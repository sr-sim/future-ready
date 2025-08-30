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
              type="file"
              @change="handleFileUpload"
              required
              class="hidden"
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
        <div v-if="jobDocuments[selectedJobId] && jobDocuments[selectedJobId].length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="doc in jobDocuments[selectedJobId]"
            :key="doc.id"
            class="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center">
                <div :class="['h-12 w-12 rounded-lg flex items-center justify-center mr-3', getDocumentTypeColor(doc.type)]">
                  <FileTextIcon class="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">{{ doc.name }}</h4>
                  <p class="text-sm text-gray-600">{{ doc.category }}</p>
                </div>
              </div>
              <div class="text-right">
                <span :class="['px-2 py-1 rounded-full text-xs font-medium', doc.analyzed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800']">
                  {{ doc.analyzed ? 'Analyzed' : 'Pending' }}
                </span>
              </div>
            </div>
            <p class="text-sm text-gray-700 mb-2">{{ doc.description }}</p>
            <div class="flex items-center gap-2 mt-2">
              <button @click="previewDocument(doc)" class="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium">
                <EyeIcon class="h-4 w-4 inline mr-1" /> Preview
              </button>
              <button @click="markAnalyzed(doc)" :disabled="doc.analyzed" class="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-medium disabled:opacity-50">
                <SparklesIcon class="h-4 w-4 inline mr-1" /> Mark Analyzed
              </button>
              <button @click="editDocument(doc)" class="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs font-medium">
                <FileTextIcon class="h-4 w-4 inline mr-1" /> Edit
              </button>
              <button @click="deleteDocument(doc.id)" class="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-medium">
                <TrashIcon class="h-4 w-4 inline mr-1" /> Delete
              </button>
            </div>
            <div v-if="doc.analyzed && doc.summary" class="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
              <h5 class="font-semibold text-green-700 mb-1">AI Summary:</h5>
              <p class="text-sm text-gray-700">{{ doc.summary }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500 text-sm">No materials uploaded for this job yet.</div>
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
import { ref } from 'vue'
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

function uploadDocument() {
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

  // 2. Create new document object
  const doc = {
    id: Date.now(),
    name: newDoc.value.name,
    category: newDoc.value.category,
    description: newDoc.value.description,
    type: newDoc.value.type,
    analyzed: false,
    summary: '',
    file: newDoc.value.file // Store file object (or upload to server here)
  }

  // 3. Add to selected job's documents
  if (!jobDocuments.value[selectedJobId.value]) jobDocuments.value[selectedJobId.value] = []
  jobDocuments.value[selectedJobId.value].push(doc)

  // 4. Reset form
  newDoc.value = { name: '', category: '', description: '', type: 'PDF', file: null }
}

function getDocumentTypeColor(type) {
  const colors = { PDF: 'bg-red-500', DOCX: 'bg-blue-500', TXT: 'bg-gray-500' }
  return colors[type] || 'bg-gray-500'
}

function previewDocument(doc) {
  previewDoc.value = doc
  showPreview.value = true
}

function markAnalyzed(doc) {
  doc.analyzed = true
  doc.summary = 'AI summary generated for this document. (Demo text)'
}

function editDocument(doc) {
  alert('Edit functionality coming soon!')
}

function deleteDocument(docId) {
  jobDocuments.value[selectedJobId.value] = jobDocuments.value[selectedJobId.value].filter(d => d.id !== docId)
}
</script>