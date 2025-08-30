<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-3">
              <BriefcaseIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Job Management</h1>
              <p class="text-sm text-gray-500">Post and manage your job listings</p>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex items-center space-x-4">
            <button
              @click="showCreateModal = true"
              class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-xl font-semibold transition-all flex items-center"
            >
              <PlusIcon class="h-5 w-5 mr-2" />
              Post New Job
            </button>
            <div class="flex items-center space-x-2">
              <div class="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-semibold">{{ userInitials }}</span>
              </div>
              <span class="text-gray-700 font-medium">{{ userName }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Jobs</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalJobs }}</p>
            </div>
            <div class="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BriefcaseIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Jobs</p>
              <p class="text-2xl font-bold text-gray-900">{{ activeJobs }}</p>
            </div>
            <div class="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircleIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Applications</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalApplications }}</p>
            </div>
            <div class="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <UsersIcon class="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Avg. Match Score</p>
              <p class="text-2xl font-bold text-gray-900">{{ avgMatchScore }}%</p>
            </div>
            <div class="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUpIcon class="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div class="flex items-center text-white">
            <FilterIcon class="h-6 w-6 mr-3" />
            <h2 class="text-xl font-bold">Filter Jobs</h2>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                v-model="filters.status"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Department</label>
              <select
                v-model="filters.department"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
              <select
                v-model="filters.jobType"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <div class="relative">
                <input
                  v-model="searchQuery"
                  @input="applyFilters"
                  type="text"
                  placeholder="Search jobs..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Job Listings -->
      <div class="space-y-6">
        <div
          v-for="job in filteredJobs"
          :key="job.id"
          class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <div class="h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                  <BriefcaseIcon class="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">{{ job.title }}</h3>
                  <p class="text-gray-600">{{ job.department }} • {{ job.location }}</p>
                  <div class="flex items-center mt-1 text-sm text-gray-500">
                    <CalendarIcon class="h-4 w-4 mr-1" />
                    Posted {{ job.postedDate }}
                    <span class="mx-2">•</span>
                    <ClockIcon class="h-4 w-4 mr-1" />
                    {{ job.jobType }}
                  </div>
                </div>
              </div>
              <div class="text-right">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    getStatusColor(job.status)
                  ]"
                >
                  {{ job.status.charAt(0).toUpperCase() + job.status.slice(1) }}
                </span>
                <div class="mt-2 text-sm text-gray-600">
                  {{ job.applications }} applications
                </div>
              </div>
            </div>

            <!-- Job Details -->
            <div class="mb-4">
              <p class="text-gray-700 mb-3">{{ job.description }}</p>
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-600">
                  <span class="font-semibold">Salary:</span> {{ job.salary }}
                </div>
                <div class="text-sm text-gray-600">
                  <span class="font-semibold">Experience:</span> {{ job.experience }}
                </div>
              </div>
            </div>

            <!-- Required Skills -->
            <div class="mb-4">
              <h5 class="text-sm font-semibold text-gray-700 mb-2">Required Skills:</h5>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in job.requiredSkills"
                  :key="skill"
                  class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                >
                  {{ skill }}
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <div class="flex items-center space-x-4">
                <button 
                  @click="viewApplications(job.id)"
                  class="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors flex items-center"
                >
                  <UsersIcon class="h-4 w-4 mr-1" />
                  View Applications ({{ job.applications }})
                </button>
                <button 
                  @click="viewMatches(job.id)"
                  class="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors flex items-center"
                >
                  <TargetIcon class="h-4 w-4 mr-1" />
                  AI Matches
                </button>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="editJob(job)"
                  class="text-gray-600 hover:text-gray-700 font-medium text-sm transition-colors flex items-center"
                >
                  <EditIcon class="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  @click="toggleJobStatus(job)"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium text-sm transition-all',
                    job.status === 'active' 
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  ]"
                >
                  {{ job.status === 'active' ? 'Pause' : 'Activate' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <div class="flex items-center space-x-2">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon class="h-4 w-4" />
          </button>
          
          <span 
            v-for="page in visiblePages" 
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-2 rounded-lg cursor-pointer transition-colors',
              page === currentPage 
                ? 'bg-blue-600 text-white' 
                : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </span>
          
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRightIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Job Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
          <div class="flex items-center justify-between text-white">
            <div class="flex items-center">
              <PlusIcon class="h-6 w-6 mr-3" />
              <h2 class="text-xl font-bold">{{ editingJob ? 'Edit Job' : 'Post New Job' }}</h2>
            </div>
            <button
              @click="closeModal"
              class="text-white hover:text-gray-200 transition-colors"
            >
              <XIcon class="h-6 w-6" />
            </button>
          </div>
        </div>

        <form @submit.prevent="saveJob" class="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
              <input
                v-model="jobForm.title"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Department *</label>
              <select
                v-model="jobForm.department"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
              <input
                v-model="jobForm.location"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g. San Francisco, CA or Remote"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Job Type *</label>
              <select
                v-model="jobForm.jobType"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Salary Range *</label>
              <input
                v-model="jobForm.salary"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g. $80k - $120k"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Experience Level *</label>
              <select
                v-model="jobForm.experience"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select Experience</option>
                <option value="Entry Level">Entry Level (0-2 years)</option>
                <option value="Mid Level">Mid Level (3-5 years)</option>
                <option value="Senior Level">Senior Level (5+ years)</option>
                <option value="Executive">Executive (10+ years)</option>
              </select>
            </div>
          </div>

          <!-- Job Description -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Job Description *</label>
            <textarea
              v-model="jobForm.description"
              required
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
            ></textarea>
          </div>

          <!-- Required Skills -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Required Skills *</label>
            <textarea
              v-model="jobForm.requiredSkillsText"
              required
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="Enter skills separated by commas (e.g. JavaScript, React, Node.js, Python)"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">Separate each skill with a comma</p>
          </div>

          <!-- Submit Buttons -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
            >
              {{ isSaving ? 'Saving...' : (editingJob ? 'Update Job' : 'Post Job') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  BriefcaseIcon,
  PlusIcon,
  CheckCircleIcon,
  UsersIcon,
  TrendingUpIcon,
  FilterIcon,
  SearchIcon,
  CalendarIcon,
  ClockIcon,
  TargetIcon,
  EditIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from 'lucide-vue-next'

// User data
const userName = ref('John Smith')
const userInitials = computed(() => userName.value.split(' ').map(n => n[0]).join(''))

// Modal state
const showCreateModal = ref(false)
const editingJob = ref(null)
const isSaving = ref(false)

// Filters and pagination
const filters = ref({
  status: '',
  department: '',
  jobType: '',
})
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)

// Job form
const jobForm = ref({
  title: '',
  department: '',
  location: '',
  jobType: '',
  salary: '',
  experience: '',
  description: '',
  requiredSkillsText: ''
})

// Sample job data
const allJobs = ref([
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    salary: '$120k - $150k',
    experience: 'Senior Level',
    description: 'We are looking for a Senior Frontend Developer to join our innovative team building next-generation web applications.',
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js'],
    status: 'active',
    applications: 24,
    postedDate: '3 days ago'
  },
  {
    id: 2,
    title: 'Product Marketing Manager',
    department: 'Marketing',
    location: 'New York, NY',
    jobType: 'Full-time',
    salary: '$90k - $120k',
    experience: 'Mid Level',
    description: 'Join our marketing team to drive product adoption and create compelling marketing campaigns.',
    requiredSkills: ['Marketing Strategy', 'Analytics', 'Content Creation', 'SEO'],
    status: 'active',
    applications: 18,
    postedDate: '1 week ago'
  },
  {
    id: 3,
    title: 'Data Scientist',
    department: 'Engineering',
    location: 'Remote',
    jobType: 'Full-time',
    salary: '$110k - $140k',
    experience: 'Mid Level',
    description: 'Analyze complex data sets and build machine learning models to drive business insights.',
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'TensorFlow'],
    status: 'paused',
    applications: 31,
    postedDate: '2 weeks ago'
  },
  {
    id: 4,
    title: 'UX Designer',
    department: 'Engineering',
    location: 'Austin, TX',
    jobType: 'Contract',
    salary: '$70k - $90k',
    experience: 'Mid Level',
    description: 'Create intuitive and beautiful user experiences for our web and mobile applications.',
    requiredSkills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    status: 'active',
    applications: 12,
    postedDate: '5 days ago'
  },
  {
    id: 5,
    title: 'Sales Development Representative',
    department: 'Sales',
    location: 'Boston, MA',
    jobType: 'Full-time',
    salary: '$50k - $70k',
    experience: 'Entry Level',
    description: 'Generate new business opportunities and qualify leads for our sales team.',
    requiredSkills: ['Sales', 'Communication', 'CRM', 'Lead Generation'],
    status: 'closed',
    applications: 45,
    postedDate: '1 month ago'
  }
])

// Computed properties
const filteredJobs = computed(() => {
  let filtered = [...allJobs.value]

  if (filters.value.status) {
    filtered = filtered.filter(job => job.status === filters.value.status)
  }
  if (filters.value.department) {
    filtered = filtered.filter(job => job.department === filters.value.department)
  }
  if (filters.value.jobType) {
    filtered = filtered.filter(job => job.jobType === filters.value.jobType)
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(job => 
      job.title.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query) ||
      job.requiredSkills.some(skill => skill.toLowerCase().includes(query))
    )
  }

  return filtered
})

const totalJobs = computed(() => allJobs.value.length)
const activeJobs = computed(() => allJobs.value.filter(job => job.status === 'active').length)
const totalApplications = computed(() => allJobs.value.reduce((sum, job) => sum + job.applications, 0))
const avgMatchScore = computed(() => 78) // Mock average

const totalPages = computed(() => Math.ceil(filteredJobs.value.length / itemsPerPage.value))
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1, '...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    }
  }
  
  return pages
})

// Methods
const applyFilters = () => {
  currentPage.value = 1
}

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'paused':
      return 'bg-yellow-100 text-yellow-800'
    case 'closed':
      return 'bg-red-100 text-red-800'
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const viewApplications = (jobId) => {
  console.log('View applications for job:', jobId)
  // Navigate to applications page
}

const viewMatches = (jobId) => {
  console.log('View AI matches for job:', jobId)
  // Navigate to AI matching page
  window.location.href = `/ai-matching?jobId=${jobId}`
}

const editJob = (job) => {
  editingJob.value = job
  jobForm.value = {
    title: job.title,
    department: job.department,
    location: job.location,
    jobType: job.jobType,
    salary: job.salary,
    experience: job.experience,
    description: job.description,
    requiredSkillsText: job.requiredSkills.join(', ')
  }
  showCreateModal.value = true
}

const toggleJobStatus = (job) => {
  if (job.status === 'active') {
    job.status = 'paused'
  } else if (job.status === 'paused') {
    job.status = 'active'
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingJob.value = null
  jobForm.value = {
    title: '',
    department: '',
    location: '',
    jobType: '',
    salary: '',
    experience: '',
    description: '',
    requiredSkillsText: ''
  }
}

const saveJob = async () => {
  isSaving.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const skillsArray = jobForm.value.requiredSkillsText
    .split(',')
    .map(skill => skill.trim())
    .filter(skill => skill)

  if (editingJob.value) {
    // Update existing job
    const index = allJobs.value.findIndex(job => job.id === editingJob.value.id)
    if (index !== -1) {
      allJobs.value[index] = {
        ...allJobs.value[index],
        ...jobForm.value,
        requiredSkills: skillsArray
      }
    }
  } else {
    // Create new job
    const newJob = {
      id: Date.now(),
      ...jobForm.value,
      requiredSkills: skillsArray,
      status: 'active',
      applications: 0,
      postedDate: 'Just now'
    }
    allJobs.value.unshift(newJob)
  }
  
  isSaving.value = false
  closeModal()
}
</script>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}
</style>
