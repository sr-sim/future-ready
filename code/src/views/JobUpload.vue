<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <header class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
              <BriefcaseIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Talent Acquisition Hub</h1>
              <p class="text-sm text-gray-500">Smart Resume Processing</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
              <div class="h-2 w-2 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-700">HR Manager</span>
            </div>
            <button class="text-gray-400 hover:text-gray-600 transition-colors">
              <LogOutIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="mb-10">
        <div class="flex items-center justify-between max-w-2xl mx-auto">
          <div class="flex items-center">
            <div class="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full text-white text-sm font-bold shadow-lg">
              <CheckIcon class="h-5 w-5" />
            </div>
            <span class="ml-3 text-sm font-semibold text-blue-600">Job Setup</span>
          </div>
          <div class="flex-1 mx-6 h-1 bg-blue-200 rounded-full">
            <div class="h-1 bg-blue-600 rounded-full" :style="{ width: currentStep >= 2 ? '100%' : '0%' }"></div>
          </div>
          <div class="flex items-center">
            <div class="flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shadow-lg transition-all duration-300"
                 :class="currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'">
              <UploadIcon class="h-5 w-5" />
            </div>
            <span class="ml-3 text-sm font-semibold transition-colors"
                  :class="currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'">Upload Resumes</span>
          </div>
          <div class="flex-1 mx-6 h-1 bg-gray-200 rounded-full">
            <div class="h-1 bg-blue-600 rounded-full transition-all duration-300" :style="{ width: currentStep >= 3 ? '100%' : '0%' }"></div>
          </div>
          <div class="flex items-center">
            <div class="flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shadow-lg transition-all duration-300"
                 :class="currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'">
              <BarChart3Icon class="h-5 w-5" />
            </div>
            <span class="ml-3 text-sm font-semibold transition-colors"
                  :class="currentStep >= 3 ? 'text-blue-600' : 'text-gray-500'">Analysis</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- Job Description Panel -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-4">
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div class="flex items-center text-white">
                <FileTextIcon class="h-6 w-6 mr-3" />
                <h2 class="text-xl font-bold">Job Requirements</h2>
              </div>
            </div>

            <div class="p-4 space-y-4">
              <form @submit.prevent="saveJobDescription" class="space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">
                    Position Title *
                  </label>
                  <input
                    v-model="jobForm.title"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="e.g., Senior Full Stack Developer"
                  />
                </div>

                <div class="grid grid-cols-1 gap-3">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      v-model="jobForm.department"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    >
                      <option value="">Select</option>
                      <option value="engineering">Engineering</option>
                      <option value="design">Design</option>
                      <option value="product">Product</option>
                      <option value="marketing">Marketing</option>
                      <option value="sales">Sales</option>
                      <option value="data">Data Science</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">
                      Experience
                    </label>
                    <select
                      v-model="jobForm.experience"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    >
                      <option value="">Select</option>
                      <option value="entry">Entry (0-2 years)</option>
                      <option value="mid">Mid (2-5 years)</option>
                      <option value="senior">Senior (5-8 years)</option>
                      <option value="lead">Lead (8+ years)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">
                    Required Skills (comma separated)
                  </label>
                  <input
                    v-model="jobForm.skills"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="React, TypeScript, Node.js, AWS"
                  />
                  <div v-if="skillTags.length > 0" class="flex flex-wrap gap-1 mt-2">
                    <span
                      v-for="skill in skillTags"
                      :key="skill"
                      class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                    >
                      {{ skill }}
                    </span>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">
                    Job Description *
                  </label>
                  <textarea
                    v-model="jobForm.description"
                    required
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-sm"
                    placeholder="Paste the complete job description..."
                  ></textarea>
                  <div class="text-right text-xs text-gray-500 mt-1">
                    {{ jobForm.description.length }} characters
                  </div>
                </div>

                <button
                  type="submit"
                  :disabled="!isJobFormValid"
                  class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg text-sm"
                >
                  <CheckIcon class="h-4 w-4 inline mr-2" />
                  Save Job Requirements
                </button>
              </form>

              <!-- Job Summary -->
              <div v-if="jobSaved" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center text-green-800 mb-1">
                  <CheckCircleIcon class="h-4 w-4 mr-2" />
                  <span class="font-semibold text-sm">Job Requirements Saved</span>
                </div>
                <p class="text-xs text-green-700">{{ jobForm.title }} - {{ jobForm.department }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-3">
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div class="flex items-center justify-between text-white">
                <div class="flex items-center">
                  <UploadCloudIcon class="h-6 w-6 mr-3" />
                  <h2 class="text-xl font-bold">Resume Upload Center</h2>
                </div>
                <div class="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {{ uploadedFiles.length }} files uploaded
                </div>
              </div>
            </div>

            <div class="p-6">
              <div
                @drop="handleDrop"
                @dragover.prevent
                @dragenter.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                class="border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 mb-6"
                :class="isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'"
              >
                <div class="flex flex-col items-center">
                  <div class="h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4">
                    <UploadCloudIcon class="h-8 w-8 text-white" />
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2">
                    Drop resume files here
                  </h3>
                  <p class="text-gray-600 mb-4 max-w-md text-sm">
                    Drag and drop multiple resume files, or click to browse. We support PDF, DOC, and DOCX formats.
                  </p>
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    @change="handleFileSelect"
                    class="hidden"
                  />
                  <div class="flex space-x-3">
                    <button
                      @click="$refs.fileInput.click()"
                      class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg text-sm"
                    >
                      <FolderOpenIcon class="h-4 w-4 inline mr-2" />
                      Browse Files
                    </button>
                    <button
                      @click="clearAllFiles"
                      v-if="uploadedFiles.length > 0"
                      class="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold text-sm"
                    >
                      <TrashIcon class="h-4 w-4 inline mr-2" />
                      Clear All
                    </button>
                  </div>
                  <p class="text-xs text-gray-400 mt-3">
                    Maximum file size: 10MB per file
                  </p>
                </div>
              </div>
              <div v-if="uploadedFiles.length > 0" class="space-y-4 mb-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-900">
                    Uploaded Files ({{ uploadedFiles.length }})
                  </h3>
                  <div class="text-sm text-gray-500">
                    Total size: {{ formatFileSize(totalFileSize) }}
                  </div>
                </div>
                
                <div class="max-h-80 overflow-y-auto space-y-3 bg-gray-50 rounded-xl p-4">
                  <transition-group name="file-list" tag="div">
                    <div
                      v-for="(file, index) in uploadedFiles"
                      :key="file.name + index"
                      class="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                    >
                      <div class="flex items-center flex-1">
                        <div class="h-12 w-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                          <FileTextIcon class="h-6 w-6 text-white" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-semibold text-gray-900 truncate">
                            {{ file.name }}
                          </p>
                          <div class="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{{ formatFileSize(file.size) }}</span>
                            <span>{{ getFileType(file.name) }}</span>
                            <span class="flex items-center">
                              <ClockIcon class="h-3 w-3 mr-1" />
                              Just now
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span class="text-xs text-green-600 font-medium">Ready</span>
                        <button
                          @click="removeFile(index)"
                          class="ml-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                        >
                          <XIcon class="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </transition-group>
                </div>
              </div>
              <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Ready to Process</h3>
                    <p class="text-sm text-gray-600">
                      {{ uploadedFiles.length }} resume{{ uploadedFiles.length !== 1 ? 's' : '' }} will be analyzed against job requirements
                    </p>
                  </div>
                  <div v-if="processingProgress > 0" class="text-right">
                    <div class="text-2xl font-bold text-blue-600">{{ processingProgress }}%</div>
                    <div class="text-sm text-gray-500">Processing...</div>
                  </div>
                </div>

                <div v-if="processingProgress > 0" class="mb-4">
                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      class="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                      :style="{ width: processingProgress + '%' }"
                    ></div>
                  </div>
                </div>

                <div class="flex space-x-4">
                  <button
                    @click="processResumes"
                    :disabled="!canProcess || isProcessing"
                    class="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-bold shadow-lg"
                  >
                    <span v-if="!isProcessing" class="flex items-center justify-center">
                      <ZapIcon class="h-5 w-5 mr-2" />
                      Analyze {{ uploadedFiles.length }} Resume{{ uploadedFiles.length !== 1 ? 's' : '' }}
                    </span>
                    <span v-else class="flex items-center justify-center">
                      <LoaderIcon class="animate-spin h-5 w-5 mr-2" />
                      Processing... ({{ Math.round(processingProgress) }}%)
                    </span>
                  </button>
                  
                  <button
                    @click="previewAnalysis"
                    :disabled="uploadedFiles.length === 0"
                    class="bg-blue-100 text-blue-700 py-4 px-6 rounded-xl hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                  >
                    <EyeIcon class="h-5 w-5 inline mr-2" />
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isProcessing" class="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Processing Status</h3>
          <div class="text-sm text-gray-500">{{ currentProcessingFile }} of {{ uploadedFiles.length }}</div>
        </div>
        
        <div class="space-y-3">
          <div
            v-for="(file, index) in uploadedFiles"
            :key="index"
            class="flex items-center justify-between p-3 rounded-lg"
            :class="getProcessingStatus(index).bgClass"
          >
            <div class="flex items-center">
              <component 
                :is="getProcessingStatus(index).icon" 
                class="h-5 w-5 mr-3"
                :class="getProcessingStatus(index).iconClass"
              />
              <span class="text-sm font-medium">{{ file.name }}</span>
            </div>
            <span class="text-sm" :class="getProcessingStatus(index).textClass">
              {{ getProcessingStatus(index).status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { 
  BriefcaseIcon, 
  LogOutIcon, 
  CheckIcon,
  UploadIcon,
  BarChart3Icon,
  FileTextIcon, 
  UploadCloudIcon,
  FolderOpenIcon,
  TrashIcon,
  ClockIcon,
  XIcon,
  ZapIcon,
  LoaderIcon,
  EyeIcon,
  CheckCircleIcon
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const isDragging = ref(false)
const isProcessing = ref(false)
const processingProgress = ref(0)
const currentProcessingFile = ref(0)
const uploadedFiles = ref([])
const jobSaved = ref(false)
const currentStep = ref(1)
const router = useRouter()

const jobForm = reactive({
  title: '',
  department: '',
  experience: '',
  skills: '',
  description: ''
})

const isJobFormValid = computed(() => {
  return jobForm.title && jobForm.department && jobForm.experience && jobForm.description
})

const skillTags = computed(() => {
  return jobForm.skills ? jobForm.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : []
})

const totalFileSize = computed(() => {
  return uploadedFiles.value.reduce((total, file) => total + file.size, 0)
})

const canProcess = computed(() => {
  return jobSaved.value && uploadedFiles.value.length > 0 && !isProcessing.value
})

watch(() => jobForm, () => {
  if (isJobFormValid.value) {
    currentStep.value = Math.max(currentStep.value, 2)
  }
}, { deep: true })

watch(() => uploadedFiles.value.length, (newLength) => {
  if (newLength > 0 && jobSaved.value) {
    currentStep.value = Math.max(currentStep.value, 3)
  }
})

const saveJobDescription = () => {
  jobSaved.value = true
  currentStep.value = 2
  console.log('Job description saved:', jobForm)
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files)
  addFiles(files)
}

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  addFiles(files)
  e.target.value = '' // Reset input
}

const addFiles = (files) => {
  const validFiles = files.filter(file => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 10 * 1024 * 1024 // 10MB
    return validTypes.includes(file.type) && file.size <= maxSize
  })
  
  // Avoid duplicates
  const existingNames = uploadedFiles.value.map(f => f.name)
  const newFiles = validFiles.filter(file => !existingNames.includes(file.name))
  
  uploadedFiles.value.push(...newFiles)
  
  if (validFiles.length !== files.length) {
    alert('Some files were skipped (invalid format or too large)')
  }
}

const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1)
}

const clearAllFiles = () => {
  uploadedFiles.value = []
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileType = (filename) => {
  const ext = filename.split('.').pop().toUpperCase()
  return ext
}

const getProcessingStatus = (index) => {
  if (index < currentProcessingFile.value) {
    return {
      status: 'Completed',
      icon: CheckCircleIcon,
      iconClass: 'text-green-600',
      textClass: 'text-green-600',
      bgClass: 'bg-green-50'
    }
  } else if (index === currentProcessingFile.value && isProcessing.value) {
    return {
      status: 'Processing...',
      icon: LoaderIcon,
      iconClass: 'text-blue-600 animate-spin',
      textClass: 'text-blue-600',
      bgClass: 'bg-blue-50'
    }
  } else {
    return {
      status: 'Pending',
      icon: ClockIcon,
      iconClass: 'text-gray-400',
      textClass: 'text-gray-500',
      bgClass: 'bg-gray-50'
    }
  }
}

const processResumes = async () => {
  if (!canProcess.value) return
  
  isProcessing.value = true
  processingProgress.value = 0
  currentProcessingFile.value = 0
  
  // Simulate processing each file
  for (let i = 0; i < uploadedFiles.value.length; i++) {
    currentProcessingFile.value = i
    
    // Simulate processing time for each file
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      processingProgress.value = ((i * 100) + progress) / uploadedFiles.value.length
    }
  }
  
  currentProcessingFile.value = uploadedFiles.value.length
  processingProgress.value = 100
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  router.push('/ranking')
  isProcessing.value = false
}

const previewAnalysis = () => {
  console.log('Preview analysis for:', uploadedFiles.value)
  alert('Preview functionality - showing sample analysis results')
}
</script>

<style scoped>
.file-list-enter-active,
.file-list-leave-active {
  transition: all 0.3s ease;
}

.file-list-enter-from,
.file-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.border-3 {
  border-width: 3px;
}
</style>