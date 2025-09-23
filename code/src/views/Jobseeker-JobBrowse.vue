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
const userName = ref('John Doe')
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

// Sample job data - replace with actual API call
const allJobs = ref([
  {
    id: 1,
    position: 'Senior Software Engineer',
    company: 'TechCorp Malaysia',
    location: 'Kuala Lumpur',
    jobType: 'Full-time',
    experienceLevel: 'Senior Level',
    salaryRange: 'RM 8,000 - RM 12,000',
    postedDate: '2 days ago',
    isNew: true,
    department: 'Engineering',
    description: 'We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for developing scalable web applications and mentoring junior developers.',
    companyDescription: 'Leading technology company specializing in fintech solutions.',
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB']
  },
  {
    id: 2,
    position: 'Digital Marketing Manager',
    company: 'Creative Agency KL',
    location: 'Kuala Lumpur',
    jobType: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: 'RM 5,000 - RM 7,500',
    postedDate: '1 week ago',
    isNew: false,
    department: 'Marketing',
    description: 'Lead our digital marketing initiatives and develop comprehensive marketing strategies to drive brand awareness and customer acquisition.',
    companyDescription: 'Award-winning creative agency serving clients across Southeast Asia.',
    requiredSkills: ['Digital Marketing', 'SEO', 'Google Ads', 'Social Media', 'Analytics']
  },
  {
    id: 3,
    position: 'UX/UI Designer',
    company: 'Design Studio',
    location: 'Remote',
    jobType: 'Contract',
    experienceLevel: 'Mid Level',
    salaryRange: 'RM 4,500 - RM 6,500',
    postedDate: '3 days ago',
    isNew: true,
    department: 'Design',
    description: 'Create intuitive and engaging user experiences for our mobile and web applications. Collaborate with product teams to deliver exceptional designs.',
    companyDescription: 'Boutique design studio focused on user-centered design solutions.',
    requiredSkills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Wireframing']
  },
  {
    id: 4,
    position: 'Data Analyst',
    company: 'Analytics Pro',
    location: 'Johor Bahru',
    jobType: 'Full-time',
    experienceLevel: 'Entry Level',
    salaryRange: 'RM 3,500 - RM 5,000',
    postedDate: '5 days ago',
    isNew: false,
    department: 'Data Science',
    description: 'Analyze complex datasets to provide actionable insights for business decision-making. Work with cross-functional teams to identify trends and opportunities.',
    companyDescription: 'Data analytics consultancy helping businesses make data-driven decisions.',
    requiredSkills: ['Python', 'SQL', 'Tableau', 'Excel', 'Statistics']
  },
  {
    id: 5,
    position: 'Product Manager',
    company: 'StartupXYZ',
    location: 'Kuala Lumpur',
    jobType: 'Full-time',
    experienceLevel: 'Senior Level',
    salaryRange: 'RM 9,000 - RM 13,000',
    postedDate: '1 day ago',
    isNew: true,
    department: 'Product',
    description: 'Drive product strategy and roadmap for our SaaS platform. Work closely with engineering and design teams to deliver innovative solutions.',
    companyDescription: 'Fast-growing startup revolutionizing the e-commerce industry.',
    requiredSkills: ['Product Strategy', 'Agile', 'User Stories', 'Market Research', 'Analytics']
  },
  {
    id: 6,
    position: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: 'RM 7,000 - RM 10,000',
    postedDate: '4 days ago',
    isNew: false,
    department: 'Infrastructure',
    description: 'Manage and optimize our cloud infrastructure. Implement CI/CD pipelines and ensure system reliability and scalability.',
    companyDescription: 'Cloud infrastructure provider serving enterprise clients.',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform']
  }
])

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

onMounted(() => {
  // Load user data from localStorage or API
  const userData = localStorage.getItem('userData')
  if (userData) {
    const user = JSON.parse(userData)
    userName.value = `${user.firstName} ${user.lastName}`
  }
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
