<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
              <BriefcaseIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Browse All Jobs</h1>
              <p class="text-sm text-gray-500">
                {{ filteredJobs.length }} jobs available across all companies
              </p>
            </div>
          </div>
          <!-- User Profile -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-semibold">{{ userInitials }}</span>
              </div>
              <span class="text-gray-700 font-medium">{{ userName }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Filters Section -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div class="flex items-center text-white">
            <FilterIcon class="h-6 w-6 mr-3" />
            <h2 class="text-xl font-bold">Filter Jobs</h2>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <!-- Search -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <input
                v-model="filters.search"
                @input="applyFilters"
                type="text"
                placeholder="Job title, company..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Location Filter -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <select
                v-model="filters.location"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Locations</option>
                <option value="Kuala Lumpur">Kuala Lumpur</option>
                <option value="Johor Bahru">Johor Bahru</option>
                <option value="Sarawak">Sarawak</option>
                <option value="Sabah">Sabah</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <!-- Job Type Filter -->
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
                <option value="Internship">Internship</option>
              </select>
            </div>

            <!-- Experience Level Filter -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
              <select
                v-model="filters.experienceLevel"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Any Level</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <!-- Sort By -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <select
                v-model="filters.sortBy"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="salary">Salary Range</option>
                <option value="company">Company Name</option>
                <option value="location">Location</option>
              </select>
            </div>
          </div>

          <!-- Active Filters Display -->
          <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap gap-2">
            <span class="text-sm font-medium text-gray-700 mr-2">Active Filters:</span>
            <span 
              v-if="filters.search"
              class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center"
            >
              Search: "{{ filters.search }}"
              <button @click="clearFilter('search')" class="ml-2 text-blue-600 hover:text-blue-800">
                <XIcon class="h-3 w-3" />
              </button>
            </span>
            <span 
              v-if="filters.location"
              class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center"
            >
              {{ filters.location }}
              <button @click="clearFilter('location')" class="ml-2 text-green-600 hover:text-green-800">
                <XIcon class="h-3 w-3" />
              </button>
            </span>
            <span 
              v-if="filters.jobType"
              class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium flex items-center"
            >
              {{ filters.jobType }}
              <button @click="clearFilter('jobType')" class="ml-2 text-purple-600 hover:text-purple-800">
                <XIcon class="h-3 w-3" />
              </button>
            </span>
            <span 
              v-if="filters.experienceLevel"
              class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium flex items-center"
            >
              {{ filters.experienceLevel }}
              <button @click="clearFilter('experienceLevel')" class="ml-2 text-orange-600 hover:text-orange-800">
                <XIcon class="h-3 w-3" />
              </button>
            </span>
            <button 
              @click="clearAllFilters"
              class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      <!-- Results Summary -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold mb-2">{{ filteredJobs.length }} Available Jobs</h3>
            <p class="text-blue-100">
              {{ newJobsCount }} new jobs this week • 
              {{ remoteJobsCount }} remote positions available
            </p>
          </div>
          <div class="hidden md:block">
            <div class="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
              <BriefcaseIcon class="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Job Results -->
      <div class="space-y-6">
        <div 
          v-for="job in paginatedJobs" 
          :key="job.id"
          class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <div class="h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                  <BuildingIcon class="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">{{ job.position }}</h3>
                  <p class="text-gray-600">{{ job.company }}</p>
                  <div class="flex items-center mt-1 text-sm text-gray-500">
                    <MapPinIcon class="h-4 w-4 mr-1" />
                    {{ job.location }}
                    <span class="mx-2">•</span>
                    <ClockIcon class="h-4 w-4 mr-1" />
                    {{ job.postedDate }}
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-gray-900">
                  {{ job.salaryRange }}
                </div>
                <div class="text-sm text-gray-500">{{ job.jobType }}</div>
                <span 
                  :class="[
                    'inline-block px-2 py-1 rounded-full text-xs font-medium mt-1',
                    job.isNew ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  ]"
                >
                  {{ job.isNew ? 'New' : job.experienceLevel }}
                </span>
              </div>
            </div>

            <!-- Job Description -->
            <div class="mb-4 bg-gray-50 rounded-xl p-4">
              <p class="text-sm text-gray-700 mb-3">{{ job.description }}</p>
              <div class="flex items-center justify-between text-sm text-gray-600">
                <div>
                  <span class="font-semibold">Department:</span> {{ job.department }}
                </div>
                <div>
                  <span class="font-semibold">Experience:</span> {{ job.experienceLevel }}
                </div>
              </div>
            </div>

            <!-- Required Skills -->
            <div class="mb-4">
              <h5 class="text-sm font-semibold text-gray-700 mb-2">Required Skills (Hover the skills to know more):</h5>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="s in job.requiredSkills"
                  :key="typeof s === 'string' ? s : s.name"
                  class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                  :title="typeof s === 'string' ? '' : s.description"
                >
                  {{ typeof s === 'string' ? s : s.name }}
                </span>
              </div>
            </div>

            <!-- Company Info -->
            <div class="mb-4 text-sm text-gray-600">
              <p><span class="font-semibold">About {{ job.company }}:</span> {{ job.companyDescription }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <div class="flex items-center space-x-4">
                <button 
                  @click="viewJobDetails(job.id)"
                  class="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors flex items-center"
                >
                  <EyeIcon class="h-4 w-4 mr-1" />
                  View Details
                </button>
                <button 
                  @click="saveJob(job.id)"
                  class="text-gray-600 hover:text-gray-700 font-medium text-sm transition-colors flex items-center"
                >
                  <BookmarkIcon class="h-4 w-4 mr-1" />
                  Save Job
                </button>
              </div>
              <button 
                @click="applyToJob(job)"
                class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl font-semibold transition-all flex items-center"
              >
                <SendIcon class="h-4 w-4 mr-2" />
                Apply Now
              </button>
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

    <!-- Application Modal -->
    <div
      v-if="showApplicationModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl max-w-md w-full">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-2xl">
          <div class="flex items-center justify-between text-white">
            <div class="flex items-center">
              <SendIcon class="h-6 w-6 mr-3" />
              <h3 class="text-xl font-bold">Apply to Job</h3>
            </div>
            <button
              @click="showApplicationModal = false"
              class="text-white hover:text-gray-200 transition-colors"
            >
              <XIcon class="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div v-if="selectedJob" class="mb-4">
            <h4 class="font-bold text-gray-900">{{ selectedJob.position }}</h4>
            <p class="text-gray-600">{{ selectedJob.company }}</p>
          </div>
          
          <p class="text-gray-700 mb-6">
            You're about to apply for this position. Your current resume and profile will be submitted to the company.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="confirmApplication"
              class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Confirm Application
            </button>
            <button
              @click="showApplicationModal = false"
              class="flex-1 bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ensureJobSeekerSession } from '../services/session'
import { supabase } from '../lib/supabase'
import {
  BriefcaseIcon,
  FilterIcon,
  XIcon,
  BuildingIcon,
  MapPinIcon,
  ClockIcon,
  EyeIcon,
  BookmarkIcon,
  SendIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from 'lucide-vue-next'

// User data
const userName = ref('')
const userInitials = computed(() => {
  if (!userName.value) return ''
  return userName.value.split(' ').map(n => n[0]).join('')
})

// Filters
const filters = ref({
  search: '',
  location: '',
  jobType: '',
  experienceLevel: '',
  sortBy: 'newest'
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(5)

// Modal
const showApplicationModal = ref(false)
const selectedJob = ref(null)

const allJobs = ref([])

const humanizeJobType = (value) => {
  const v = String(value || '').toUpperCase()
  switch (v) {
    case 'FULL_TIME': return 'Full-time'
    case 'PART_TIME': return 'Part-time'
    case 'CONTRACT': return 'Contract'
    case 'INTERNSHIP': return 'Internship'
    case 'REMOTE': return 'Remote'
    default: return value || ''
  }
}

const humanizeExperience = (value) => {
  const v = String(value || '').toUpperCase()
  switch (v) {
    case 'ENTRY_LEVEL': return 'Entry Level'
    case 'MID_LEVEL': return 'Mid Level'
    case 'SENIOR_LEVEL': return 'Senior Level'
    case 'EXECUTIVE': return 'Executive'
    default: return value || ''
  }
}

const formatSalaryRange = (currency, min, max) => {
  const prefix = currency === 'MYR' ? 'RM '
    : ''
  return `${prefix}${min} - ${prefix}${max}`
}

const isRecent = (createdAt) => {
  const created = new Date(createdAt)
  const diffDays = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays <= 3
}

const loadPublishedJobs = async () => {
  const { data, error } = await supabase
    .from('job_postings')
    .select('id, title, department, location, job_type, experience_level, salary_min, salary_max, currency, created_at, scope, company_id, company_profiles ( company_name )')
    .eq('status', 'PUBLISHED')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('Failed to load jobs:', error)
    allJobs.value = []
    return
  }

  const jobs = data || []
  const jobIds = jobs.map(j => j.id)
  let jobIdToSkills = {}
  if (jobIds.length > 0) {
    const { data: reqs, error: reqErr } = await supabase
      .from('job_posting_requirements')
      .select('job_posting_id, skill, description')
      .in('job_posting_id', jobIds)
    if (!reqErr) {
      jobIdToSkills = (reqs || []).reduce((acc, r) => {
        if (!acc[r.job_posting_id]) acc[r.job_posting_id] = []
        acc[r.job_posting_id].push({ name: r.skill, description: r.description || '' })
        return acc
      }, {})
    }
  }

  allJobs.value = jobs.map(row => ({
    id: row.id,
    position: row.title,
    company: row.company_profiles?.company_name || 'Company',
    location: row.location,
    jobType: humanizeJobType(row.job_type),
    experienceLevel: humanizeExperience(row.experience_level),
    salaryRange: formatSalaryRange(row.currency, row.salary_min, row.salary_max),
    postedDate: new Date(row.created_at).toLocaleDateString(),
    isNew: isRecent(row.created_at),
    department: row.department,
    description: row.scope,
    companyDescription: '',
    requiredSkills: jobIdToSkills[row.id] || []
  }))
}

// Computed properties
const filteredJobs = computed(() => {
  let filtered = [...allJobs.value]

  // Apply search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(job => 
      job.position.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm) ||
      job.description.toLowerCase().includes(searchTerm)
    )
  }

  // Apply other filters
  if (filters.value.location) {
    filtered = filtered.filter(job => job.location === filters.value.location)
  }
  
  if (filters.value.jobType) {
    filtered = filtered.filter(job => job.jobType === filters.value.jobType)
  }
  
  if (filters.value.experienceLevel) {
    filtered = filtered.filter(job => job.experienceLevel === filters.value.experienceLevel)
  }

  // Apply sorting
  switch (filters.value.sortBy) {
    case 'newest':
      filtered.sort((a, b) => {
        const aDate = new Date(a.postedDate.replace(' ago', ''))
        const bDate = new Date(b.postedDate.replace(' ago', ''))
        return bDate - aDate
      })
      break
    case 'salary':
      filtered.sort((a, b) => {
        const aMax = parseInt(a.salaryRange.split(' - ')[1].replace(/[^0-9]/g, ''))
        const bMax = parseInt(b.salaryRange.split(' - ')[1].replace(/[^0-9]/g, ''))
        return bMax - aMax
      })
      break
    case 'company':
      filtered.sort((a, b) => a.company.localeCompare(b.company))
      break
    case 'location':
      filtered.sort((a, b) => a.location.localeCompare(b.location))
      break
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredJobs.value.length / itemsPerPage.value)
})

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredJobs.value.slice(start, end)
})

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

const newJobsCount = computed(() => {
  return allJobs.value.filter(job => job.isNew).length
})

const remoteJobsCount = computed(() => {
  return allJobs.value.filter(job => job.location === 'Remote').length
})

const hasActiveFilters = computed(() => {
  return filters.value.search || filters.value.location || filters.value.jobType || filters.value.experienceLevel
})

// Methods
const applyFilters = () => {
  currentPage.value = 1 // Reset to first page when filters change
}

const clearFilter = (filterName) => {
  filters.value[filterName] = ''
  applyFilters()
}

const clearAllFilters = () => {
  filters.value = {
    search: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    sortBy: 'newest'
  }
  applyFilters()
}

const viewJobDetails = (jobId) => {
  console.log('View job details:', jobId)
  // Navigate to job details page
}

const saveJob = (jobId) => {
  console.log('Save job:', jobId)
  // Add to saved jobs
}

const applyToJob = (job) => {
  selectedJob.value = job
  showApplicationModal.value = true
}

const confirmApplication = () => {
  console.log('Apply to:', selectedJob.value.company)
  // Submit application
  showApplicationModal.value = false
  
  // Show success message
  alert(`Application submitted to ${selectedJob.value?.company}!`)
  selectedJob.value = null
}

onMounted(async () => {
  try {
    await ensureJobSeekerSession()
  } catch (e) {
    return
  }
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  if (currentUser.id) {
    try {
      const { data: profile } = await (await import('../lib/supabase')).supabase
        .from('job_seeker_profiles')
        .select('first_name, last_name')
        .eq('user_id', currentUser.id)
        .single()
      if (profile) userName.value = `${profile.first_name} ${profile.last_name}`.trim()
    } catch {}
  }
  await loadPublishedJobs()
})
</script>

<style scoped>
/* Custom transitions and animations */
.transition-all {
  transition: all 0.3s ease;
}

/* Hover effects */
.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
