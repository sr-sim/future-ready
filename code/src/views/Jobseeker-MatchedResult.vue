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


    <!-- Existing Results Content (only show if matching completed) -->
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
                <option value="Kuala Lumpur">Kuala Lumpur</option>
                <option value="Johor Bahru">Johor Bahru</option>
                <option value="Sarawak">Sarawak</option>
                <option value="Sabah">Sabah</option>
                <option value="Remote">Remote</option>
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

            <!-- Matched Skills -->
            <div class="mb-4">
              <h5 class="text-sm font-semibold text-gray-700 mb-2">Matched Skills:</h5>
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
                :disabled="isApplied(company.id)"
                :class="[
                  'px-6 py-2 rounded-xl font-semibold transition-all flex items-center',
                  isApplied(company.id)
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                ]"
              >
                <SendIcon class="h-4 w-4 mr-2" />
                <span v-if="!isApplied(company.id)">Apply Now</span>
                <span v-else>Applied</span>
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
import { AIMatchingService } from '../services/aiMatchingService'
import { supabase } from '../lib/supabase'
import { ensureJobSeekerSession } from '../services/session'
import { useRouter } from 'vue-router'
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

const router = useRouter()

// Filters
const filters = ref({
  location: '',
  minScore: 0,
  companySize: '',
  sortBy: 'score'
})

const userName = ref('')
const userInitials = computed(() => {
  if (!userName.value) return ''
  return userName.value.split(' ').map(n => n[0]).join('')
})
// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(5)

// Modal
const showApplicationModal = ref(false)
const selectedCompany = ref(null)
const appliedJobIds = ref(new Set())

const isApplied = (jobId) => {
  return appliedJobIds.value.has(jobId)
}

// Matching status
const hasCompletedMatching = ref(false)

// Actual matching results from AI
const allCompanies = ref([])
const matchingData = ref(null)

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
    router.push('/jobmatch')
  } else {
    router.push('/jshome')
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
  if (isApplied(company.id)) return
  selectedCompany.value = company
  showApplicationModal.value = true
}

const confirmApplication = async () => {
  try {
    if (!selectedCompany.value || !matchingData.value?.profile) return
    const jobPostingId = selectedCompany.value.id
    const companyId = selectedCompany.value.companyId
    const jobSeekerId = matchingData.value.profile.id
    const payload = {
      job_posting_id: jobPostingId,
      job_seeker_id: jobSeekerId,
      company_id: companyId
    }

    const { error } = await supabase.from('applications').insert(payload)
    if (error) {
      // Unique constraint (already applied)
      const msg = (error.message || '').toLowerCase()
      if (msg.includes('duplicate') || msg.includes('unique')) {
        alert('You have already applied to this job.')
      } else {
        alert(`Failed to submit application: ${error.message}`)
      }
      return
    }

    // Mark as applied in UI
    appliedJobIds.value.add(jobPostingId)
    alert(`Application submitted to ${selectedCompany.value.name}!`)
  } catch (e) {
    alert(`Failed to submit application: ${e?.message || 'Unknown error'}`)
  } finally {
    showApplicationModal.value = false
    selectedCompany.value = null
  }
}

const goToMatching = () => {
  router.push('/jobmatch')
}

const loadMatchingResults = async () => {
  try {
    const savedResults = localStorage.getItem('aiMatchingResults')
    if (savedResults) {
      const results = JSON.parse(savedResults)
      matchingData.value = results
      
      // Load user name from profile
      if (results.profile) {
        userName.value = `${results.profile.first_name} ${results.profile.last_name}`
      }
      
      // Enrich and format matches via service (adds company info and percent scores)
      if (results.matches && Array.isArray(results.matches)) {
        const formatted = await AIMatchingService.formatJobMatches(results.matches, results.profile)
        allCompanies.value = formatted.map(match => ({
          id: match.id,
          companyId: match.companyId,
          name: match.name,
          industry: match.industry,
          location: match.location,
          size: match.size,
          position: match.position,
          jobType: match.jobType,
          jobDescription: match.jobDescription,
          salaryRange: match.salaryRange,
          postedDate: match.postedDate,
          matchScore: match.matchScore,
          matchingSkills: match.matchingSkills,
          description: match.description,
          requirements: match.requirements,
          responsibilities: match.responsibilities,
          experienceLevel: match.experienceLevel
        }))

        // Load already applied applications for this seeker and mark buttons
        const { data: apps, error: appsErr } = await supabase
          .from('applications')
          .select('job_posting_id')
          .eq('job_seeker_id', results.profile.id)
        if (!appsErr && Array.isArray(apps)) {
          appliedJobIds.value = new Set(apps.map(a => a.job_posting_id))
        }
      }
      
      hasCompletedMatching.value = true
    } else {
      hasCompletedMatching.value = false
    }
  } catch (error) {
    console.error('Error loading matching results:', error)
    hasCompletedMatching.value = false
  }
}

const checkMatchingStatus = () => {
  // Check if user has completed AI matching
  const matchingCompleted = localStorage.getItem('aiMatchingCompleted')
  hasCompletedMatching.value = matchingCompleted === 'true'
}

onMounted(async () => {
  try { await ensureJobSeekerSession() } catch (e) { return }
  checkMatchingStatus()
  loadMatchingResults()
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