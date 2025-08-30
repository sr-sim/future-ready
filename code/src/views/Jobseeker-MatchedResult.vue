<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
              <TargetIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Job Matching Results</h1>
              <p class="text-sm text-gray-500">
                {{ hasCompletedMatching ? `${filteredCompanies.length} companies match your profile` : 'Complete AI matching to see results' }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
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

    <!-- No Matching Completed State -->
    <div v-if="!hasCompletedMatching" class="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <!-- Icon -->
        <div class="h-24 w-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <SparklesIcon class="h-12 w-12 text-purple-600" />
        </div>
        
        <!-- Title and Description -->
        <h2 class="text-3xl font-bold text-gray-900 mb-4">AI Matching Required</h2>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          You need to complete the AI matching process first to see your personalized job recommendations and company matches.
        </p>
        
        <!-- Features List -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8 max-w-2xl mx-auto">
          <h3 class="text-lg font-bold text-gray-900 mb-6">What you'll get after AI matching:</h3>
          <div class="space-y-4 text-left">
            <div class="flex items-center">
              <div class="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <CheckCircleIcon class="h-4 w-4 text-green-600" />
              </div>
              <span class="text-gray-700">Personalized job recommendations based on your skills</span>
            </div>
            <div class="flex items-center">
              <div class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <CheckCircleIcon class="h-4 w-4 text-blue-600" />
              </div>
              <span class="text-gray-700">Resume scoring and improvement suggestions</span>
            </div>
            <div class="flex items-center">
              <div class="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <CheckCircleIcon class="h-4 w-4 text-purple-600" />
              </div>
              <span class="text-gray-700">Companies actively looking for your profile</span>
            </div>
            <div class="flex items-center">
              <div class="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <CheckCircleIcon class="h-4 w-4 text-orange-600" />
              </div>
              <span class="text-gray-700">Match scores and compatibility ratings</span>
            </div>
          </div>
        </div>
        
        <!-- Action Button -->
        <button
          @click="goToMatching"
          class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <span class="flex items-center">
            <SparklesIcon class="h-6 w-6 mr-3" />
            Start AI Matching
          </span>
        </button>
        
        <p class="text-gray-500 text-sm mt-4">
          The AI matching process takes about 1-2 minutes to complete
        </p>
      </div>
    </div>

    <!-- Existing Results Content (only show if matching completed) -->
    <div v-else class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Filters Section -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div class="flex items-center text-white">
            <FilterIcon class="h-6 w-6 mr-3" />
            <h2 class="text-xl font-bold">Filter Results</h2>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Location Filter -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <select
                v-model="filters.location"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Locations</option>
                <option value="San Francisco, CA">San Francisco, CA</option>
                <option value="New York, NY">New York, NY</option>
                <option value="Seattle, WA">Seattle, WA</option>
                <option value="Austin, TX">Austin, TX</option>
                <option value="Remote">Remote</option>
                <option value="Boston, MA">Boston, MA</option>
              </select>
            </div>

            <!-- Score Filter -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Minimum Score</label>
              <select
                v-model="filters.minScore"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="0">Any Score</option>
                <option value="60">60% and above</option>
                <option value="70">70% and above</option>
                <option value="80">80% and above</option>
                <option value="90">90% and above</option>
              </select>
            </div>

            <!-- Company Size Filter -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Company Size</label>
              <select
                v-model="filters.companySize"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Any Size</option>
                <option value="Startup">Startup (1-50)</option>
                <option value="Medium">Medium (51-500)</option>
                <option value="Large">Large (500+)</option>
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
                <option value="score">Match Score</option>
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
              v-if="filters.location"
              class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center"
            >
              {{ filters.location }}
              <button @click="clearFilter('location')" class="ml-2 text-blue-600 hover:text-blue-800">
                <XIcon class="h-3 w-3" />
              </button>
            </span>
            <span 
              v-if="filters.minScore > 0"
              class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center"
            >
              Score: {{ filters.minScore }}%+
              <button @click="clearFilter('minScore')" class="ml-2 text-green-600 hover:text-green-800">
                <XIcon class="h-3 w-3" />
              </button>
            </span>
            <span 
              v-if="filters.companySize"
              class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium flex items-center"
            >
              {{ filters.companySize }}
              <button @click="clearFilter('companySize')" class="ml-2 text-purple-600 hover:text-purple-800">
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
      <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold mb-2">{{ filteredCompanies.length }} Matching Companies</h3>
            <p class="text-green-100">
              Average match score: {{ averageScore }}% • 
              {{ highScoreCount }} companies with 80%+ match
            </p>
          </div>
          <div class="hidden md:block">
            <div class="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
              <TrophyIcon class="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Company Results -->
      <div class="space-y-6">
        <div 
          v-for="company in paginatedCompanies" 
          :key="company.id"
          class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <div class="h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                  <BuildingIcon class="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">{{ company.name }}</h3>
                  <p class="text-gray-600">{{ company.industry }}</p>
                  <div class="flex items-center mt-1 text-sm text-gray-500">
                    <MapPinIcon class="h-4 w-4 mr-1" />
                    {{ company.location }}
                    <span class="mx-2">•</span>
                    <UsersIcon class="h-4 w-4 mr-1" />
                    {{ company.size }}
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold" :class="getScoreColor(company.matchScore)">
                  {{ company.matchScore }}%
                </div>
                <div class="text-sm text-gray-500">Match Score</div>
                <div class="flex items-center mt-1">
                  <StarIcon 
                    v-for="star in 5" 
                    :key="star"
                    :class="[
                      'h-4 w-4',
                      star <= getStarRating(company.matchScore) ? 'text-yellow-400' : 'text-gray-300'
                    ]"
                    fill="currentColor"
                  />
                </div>
              </div>
            </div>

            <!-- Job Position -->
            <div class="mb-4 bg-gray-50 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold text-gray-900">{{ company.position }}</h4>
                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {{ company.jobType }}
                </span>
              </div>
              <p class="text-sm text-gray-700 mb-3">{{ company.jobDescription }}</p>
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-600">
                  <span class="font-semibold">Salary:</span> {{ company.salaryRange }}
                </div>
                <div class="text-sm text-gray-600">
                  <span class="font-semibold">Posted:</span> {{ company.postedDate }}
                </div>
              </div>
            </div>

            <!-- Matching Skills -->
            <div class="mb-4">
              <h5 class="text-sm font-semibold text-gray-700 mb-2">Matching Skills:</h5>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in company.matchingSkills"
                  :key="skill"
                  class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium"
                >
                  {{ skill }}
                </span>
              </div>
            </div>

            <!-- Company Info -->
            <div class="mb-4 text-sm text-gray-600">
              <p>{{ company.description }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <div class="flex items-center space-x-4">
                <button 
                  @click="viewCompanyDetails(company.id)"
                  class="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors flex items-center"
                >
                  <EyeIcon class="h-4 w-4 mr-1" />
                  View Details
                </button>
                <button 
                  @click="saveJob(company.id)"
                  class="text-gray-600 hover:text-gray-700 font-medium text-sm transition-colors flex items-center"
                >
                  <BookmarkIcon class="h-4 w-4 mr-1" />
                  Save Job
                </button>
              </div>
              <button 
                @click="applyToJob(company)"
                class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-xl font-semibold transition-all flex items-center"
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
        <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 rounded-t-2xl">
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
          <div v-if="selectedCompany" class="mb-4">
            <h4 class="font-bold text-gray-900">{{ selectedCompany.position }}</h4>
            <p class="text-gray-600">{{ selectedCompany.name }}</p>
          </div>
          
          <p class="text-gray-700 mb-6">
            You're about to apply for this position. Your current resume and profile will be submitted to the company.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="confirmApplication"
              class="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-2 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
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
  TargetIcon,
  ArrowLeftIcon,
  FilterIcon,
  XIcon,
  TrophyIcon,
  BuildingIcon,
  MapPinIcon,
  UsersIcon,
  StarIcon,
  EyeIcon,
  BookmarkIcon,
  SendIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  CheckCircleIcon
} from 'lucide-vue-next'

// Filters
const filters = ref({
  location: '',
  minScore: 0,
  companySize: '',
  sortBy: 'score'
})
const userName = ref('Sarah Johnson')
const userInitials = computed(() => userName.value.split(' ').map(n => n[0]).join(''))
// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(5)

// Modal
const showApplicationModal = ref(false)
const selectedCompany = ref(null)

// Matching status
const hasCompletedMatching = ref(false)

// Sample company data
const allCompanies = ref([
  {
    id: 1,
    name: 'TechCorp Solutions',
    industry: 'Software Development',
    location: 'San Francisco, CA',
    size: 'Large',
    position: 'Senior Frontend Developer',
    jobType: 'Full-time',
    jobDescription: 'Join our innovative team building next-generation web applications with React, TypeScript, and modern development practices.',
    salaryRange: '$120k - $150k',
    postedDate: '2 days ago',
    matchScore: 95,
    matchingSkills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js', 'Git'],
    description: 'Leading technology company focused on innovative web solutions and digital transformation.'
  },
  {
    id: 2,
    name: 'DataFlow Inc',
    industry: 'Data Analytics',
    location: 'New York, NY',
    size: 'Medium',
    position: 'Full Stack Engineer',
    jobType: 'Full-time',
    jobDescription: 'Work on cutting-edge data visualization and analytics platforms using React, Python, and cloud technologies.',
    salaryRange: '$110k - $140k',
    postedDate: '1 week ago',
    matchScore: 88,
    matchingSkills: ['Python', 'React', 'SQL', 'AWS', 'JavaScript'],
    description: 'Data analytics company helping businesses make data-driven decisions with advanced visualization tools.'
  },
  {
    id: 3,
    name: 'CloudTech Systems',
    industry: 'Cloud Computing',
    location: 'Seattle, WA',
    size: 'Large',
    position: 'Software Engineer',
    jobType: 'Full-time',
    jobDescription: 'Build scalable cloud infrastructure and microservices using modern technologies and DevOps practices.',
    salaryRange: '$100k - $130k',
    postedDate: '3 days ago',
    matchScore: 82,
    matchingSkills: ['AWS', 'Node.js', 'Docker', 'Kubernetes', 'Git'],
    description: 'Cloud infrastructure company providing scalable solutions for enterprise clients worldwide.'
  },
  {
    id: 4,
    name: 'StartupX',
    industry: 'Fintech',
    location: 'Austin, TX',
    size: 'Startup',
    position: 'Frontend Developer',
    jobType: 'Full-time',
    jobDescription: 'Help revolutionize financial services with modern web technologies and user-centric design.',
    salaryRange: '$90k - $120k',
    postedDate: '5 days ago',
    matchScore: 78,
    matchingSkills: ['React', 'JavaScript', 'CSS', 'Git'],
    description: 'Innovative fintech startup disrupting traditional banking with mobile-first solutions.'
  },
  {
    id: 5,
    name: 'DesignStudio Pro',
    industry: 'Design & Creative',
    location: 'Remote',
    size: 'Medium',
    position: 'UI/UX Developer',
    jobType: 'Contract',
    jobDescription: 'Create beautiful and intuitive user interfaces for web and mobile applications.',
    salaryRange: '$80k - $100k',
    postedDate: '1 week ago',
    matchScore: 75,
    matchingSkills: ['React', 'CSS', 'Figma', 'JavaScript'],
    description: 'Creative design studio specializing in user experience and interface design for digital products.'
  },
  {
    id: 6,
    name: 'AI Innovations',
    industry: 'Artificial Intelligence',
    location: 'Boston, MA',
    size: 'Medium',
    position: 'Machine Learning Engineer',
    jobType: 'Full-time',
    jobDescription: 'Develop AI-powered applications and machine learning models for various industries.',
    salaryRange: '$130k - $160k',
    postedDate: '4 days ago',
    matchScore: 72,
    matchingSkills: ['Python', 'TensorFlow', 'JavaScript', 'SQL'],
    description: 'AI research company developing cutting-edge machine learning solutions for enterprise clients.'
  }
])

// Computed properties
const filteredCompanies = computed(() => {
  let filtered = [...allCompanies.value]

  // Apply filters
  if (filters.value.location) {
    filtered = filtered.filter(company => company.location === filters.value.location)
  }
  
  if (filters.value.minScore > 0) {
    filtered = filtered.filter(company => company.matchScore >= filters.value.minScore)
  }
  
  if (filters.value.companySize) {
    filtered = filtered.filter(company => company.size === filters.value.companySize)
  }

  // Apply sorting
  switch (filters.value.sortBy) {
    case 'score':
      filtered.sort((a, b) => b.matchScore - a.matchScore)
      break
    case 'salary':
      filtered.sort((a, b) => {
        const aMax = parseInt(a.salaryRange.split(' - ')[1].replace(/[^0-9]/g, ''))
        const bMax = parseInt(b.salaryRange.split(' - ')[1].replace(/[^0-9]/g, ''))
        return bMax - aMax
      })
      break
    case 'company':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'location':
      filtered.sort((a, b) => a.location.localeCompare(b.location))
      break
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredCompanies.value.length / itemsPerPage.value)
})

const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredCompanies.value.slice(start, end)
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

const averageScore = computed(() => {
  if (filteredCompanies.value.length === 0) return 0
  const sum = filteredCompanies.value.reduce((acc, company) => acc + company.matchScore, 0)
  return Math.round(sum / filteredCompanies.value.length)
})

const highScoreCount = computed(() => {
  return filteredCompanies.value.filter(company => company.matchScore >= 80).length
})

const hasActiveFilters = computed(() => {
  return filters.value.location || filters.value.minScore > 0 || filters.value.companySize
})

// Methods
const goBack = () => {
  if (hasCompletedMatching.value) {
    window.location.href = '/jobmatch'
  } else {
    window.location.href = '/jshome' // or wherever the dashboard is
  }
}

const applyFilters = () => {
  currentPage.value = 1 // Reset to first page when filters change
}

const clearFilter = (filterName) => {
  if (filterName === 'minScore') {
    filters.value[filterName] = 0
  } else {
    filters.value[filterName] = ''
  }
  applyFilters()
}

const clearAllFilters = () => {
  filters.value = {
    location: '',
    minScore: 0,
    companySize: '',
    sortBy: 'score'
  }
  applyFilters()
}

const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 80) return 'text-blue-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-gray-600'
}

const getStarRating = (score) => {
  return Math.round((score / 100) * 5)
}

const viewCompanyDetails = (companyId) => {
  console.log('View company details:', companyId)
  // Navigate to company details page
}

const saveJob = (companyId) => {
  console.log('Save job:', companyId)
  // Add to saved jobs
}

const applyToJob = (company) => {
  selectedCompany.value = company
  showApplicationModal.value = true
}

const confirmApplication = () => {
  console.log('Apply to:', selectedCompany.value.name)
  // Submit application
  showApplicationModal.value = false
  selectedCompany.value = null
  
  // Show success message (you could add a toast notification here)
  alert(`Application submitted to ${selectedCompany.value?.name}!`)
}

const goToMatching = () => {
  window.location.href = '/jobmatch'
}

const checkMatchingStatus = () => {
  // Check if user has completed AI matching (you can store this in localStorage or get from API)
  const matchingCompleted = localStorage.getItem('aiMatchingCompleted')
  hasCompletedMatching.value = matchingCompleted === 'true'
}

onMounted(() => {
  checkMatchingStatus()
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

/* Filter animations */
.filter-enter-active, .filter-leave-active {
  transition: all 0.3s ease;
}

.filter-enter-from, .filter-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
