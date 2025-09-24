<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
              <UserIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">
                Welcome back, {{ isLoading ? 'Loading...' : userName }}!
              </h1>
              <p class="text-sm text-gray-500">Find your dream job today</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button class="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <BellIcon class="h-6 w-6" />
              <span class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">3</span>
            </button>
                      <!-- User Profile -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-semibold">{{ userInitials }}</span>
              </div>
              <span class="text-gray-700 font-medium">{{ isLoading ? 'Loading...' : userName }}</span>
            </div>
          </div>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start"
      >
        <div class="flex-1">
          <p class="text-red-800 font-medium">{{ errorMessage }}</p>
          <button
            @click="fetchUserProfile"
            class="mt-2 text-red-600 hover:text-red-700 text-sm font-medium underline"
          >
            Try again
          </button>
        </div>
        <button
          @click="errorMessage = ''"
          class="text-red-400 hover:text-red-600"
        >
          ×
        </button>
      </div>

      <!-- Welcome Banner -->
      <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-3xl font-bold mb-2">Your Career Journey Starts Here</h2>
            <p class="text-green-100 text-lg mb-4">Discover opportunities that match your skills and aspirations</p>
            <div class="flex items-center space-x-4">
              <button 
                @click="navigateToJobSearch"
                class="bg-white text-green-600 px-6 py-2 rounded-xl font-semibold hover:bg-green-50 transition-colors"
              >
                Browse Jobs
              </button>
            </div>
          </div>
          <div class="hidden lg:block">
            <div class="h-32 w-32 bg-white/20 rounded-full flex items-center justify-center">
              <SearchIcon class="h-16 w-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Profile Completion</p>
              <p class="text-2xl font-bold text-gray-900">{{ profileCompletion }}%</p>
            </div>
            <div class="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <UserCheckIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div class="mt-4">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-500"
                :style="{ width: `${profileCompletion}%` }"
              ></div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Applications Sent</p>
              <p class="text-2xl font-bold text-gray-900">{{ applicationsSent }}</p>
            </div>
            <div class="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
              <SendIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">{{ newApplicationsThisWeek }} this week</p>
        </div>



        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Job Matches</p>
              <p class="text-2xl font-bold text-gray-900">{{ jobMatches }}</p>
            </div>
            <div class="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TargetIcon class="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">{{ newMatchesToday }} new today</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Job Recommendations -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div class="flex items-center justify-between text-white">
                <div class="flex items-center">
                  <SparklesIcon class="h-6 w-6 mr-3" />
                  <h2 class="text-xl font-bold">Recommended Jobs</h2>
                </div>
                <button 
                  @click="navigateToJobSearch"
                  class="text-blue-100 hover:text-white text-sm font-medium transition-colors"
                >
                  View All
                </button>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div 
                  v-for="job in recommendedJobs" 
                  :key="job.id"
                  class="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  @click="viewJobDetails(job.id)"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center">
                      <div class="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                        <BuildingIcon class="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 class="font-bold text-gray-900">{{ job.title }}</h3>
                        <p class="text-sm text-gray-600">{{ job.company }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-lg font-bold" :class="getMatchColor(job.matchScore)">
                        {{ job.matchScore }}%
                      </div>
                      <div class="text-xs text-gray-500">Match</div>
                    </div>
                  </div>
                  
                  <div class="mb-3">
                    <p class="text-sm text-gray-600 mb-2">{{ job.location }} • {{ job.type }}</p>
                    <p class="text-sm text-gray-700">{{ job.description }}</p>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="skill in job.matchingSkills.slice(0, 3)"
                        :key="skill"
                        class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                      >
                        {{ skill }}
                      </span>
                      <span 
                        v-if="job.matchingSkills.length > 3"
                        class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                      >
                        +{{ job.matchingSkills.length - 3 }} more
                      </span>
                    </div>
                    <div class="text-sm font-semibold text-gray-900">
                      {{ job.salary }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Applications -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <div class="flex items-center justify-between text-white">
                <div class="flex items-center">
                  <FileTextIcon class="h-6 w-6 mr-3" />
                  <h2 class="text-xl font-bold">Recent Applications</h2>
                </div>
                <button 
                  @click="navigateToApplications"
                  class="text-green-100 hover:text-white text-sm font-medium transition-colors"
                >
                  View All
                </button>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div 
                  v-for="application in recentApplications" 
                  :key="application.id"
                  class="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200"
                >
                  <div class="flex items-center">
                    <div class="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                      <BriefcaseIcon class="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900">{{ application.jobTitle }}</h3>
                      <p class="text-sm text-gray-600">{{ application.company }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <div 
                      :class="getStatusColor(application.status)"
                      class="px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {{ application.status }}
                    </div>
                    <p class="text-xs text-gray-500 mt-1">{{ application.appliedDate }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-8">
          <!-- Quick Actions -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <div class="flex items-center text-white">
                <ZapIcon class="h-6 w-6 mr-3" />
                <h2 class="text-xl font-bold">Quick Actions</h2>
              </div>
            </div>
            <div class="p-6 space-y-4">
              <button 
                @click="navigateToJobSearch"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center"
              >
                <SearchIcon class="h-5 w-5 mr-2" />
                Search Jobs
              </button>
              <button 
                @click="navigateToProfile"
                class="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center"
              >
                <UserIcon class="h-5 w-5 mr-2" />
                Update Profile
              </button>
              <button 
                @click="navigateToApplications"
                class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center"
              >
                <FileTextIcon class="h-5 w-5 mr-2" />
                My Applications
              </button>
            </div>
          </div>

          <!-- Career Tips -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
              <div class="flex items-center text-white">
                <LightbulbIcon class="h-6 w-6 mr-3" />
                <h2 class="text-xl font-bold">Career Tips</h2>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div 
                  v-for="tip in careerTips" 
                  :key="tip.id"
                  class="border-l-4 border-yellow-400 pl-4 py-2"
                >
                  <h3 class="font-semibold text-gray-900 text-sm">{{ tip.title }}</h3>
                  <p class="text-xs text-gray-600 mt-1">{{ tip.description }}</p>
                </div>
              </div>
              <button class="w-full mt-4 text-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                View More Tips
              </button>
            </div>
          </div>

          <!-- Upcoming Events -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div class="flex items-center text-white">
                <CalendarIcon class="h-6 w-6 mr-3" />
                <h2 class="text-xl font-bold">Upcoming Events</h2>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div 
                  v-for="event in upcomingEvents" 
                  :key="event.id"
                  class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <div class="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CalendarIcon class="h-5 w-5 text-indigo-600" />
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 text-sm">{{ event.title }}</h3>
                    <p class="text-xs text-gray-600">{{ event.date }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ event.type }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { ensureJobSeekerSession } from '../services/session'
import {
  UserIcon,
  BellIcon,
  ChevronDownIcon,
  SearchIcon,
  UserCheckIcon,
  SendIcon,
  CalendarIcon,
  TargetIcon,
  SparklesIcon,
  BuildingIcon,
  FileTextIcon,
  BriefcaseIcon,
  ZapIcon,
  LightbulbIcon
} from 'lucide-vue-next'

// User data
const userName = ref('')
const userProfile = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')

const userInitials = computed(() => {
  if (!userName.value) return ''
  return userName.value.split(' ').map(n => n[0]).join('')
})

// Fetch user profile data
const fetchUserProfile = async () => {
  try {
    isLoading.value = true
    
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    
    if (!currentUser.id) {
      console.error('No user ID found')
      errorMessage.value = 'User session not found. Please log in again.'
      return
    }

    // Fetch user profile from job_seeker_profiles table
    const { data: profile, error } = await supabase
      .from('job_seeker_profiles')
      .select('*')
      .eq('user_id', currentUser.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      errorMessage.value = 'Failed to load user profile. Please try again.'
      return
    }

    if (profile) {
      userProfile.value = profile
      userName.value = `${profile.first_name} ${profile.last_name}`
    } else {
      console.log('No profile found for user')
      // Fallback to demo data if no profile exists
      userName.value = 'Demo User'
    }

  } catch (error) {
    console.error('Error in fetchUserProfile:', error)
    // Fallback to demo data on error
    userName.value = 'Demo User'
  } finally {
    isLoading.value = false
  }
}

// Load user profile when component mounts
onMounted(async () => {
  try {
    await ensureJobSeekerSession()
  } catch (e) {
    return
  }
  fetchUserProfile()
  // If redirected from onboarding block, show modal
  try {
    if (sessionStorage.getItem('showOnboardingAccessModal') === '1') {
      sessionStorage.removeItem('showOnboardingAccessModal')
      alert('Sorry, this feature is only available after you have been enrolled to a company. As per checking, currently you are not being enrolled in any company. Please contact the admin if there is any error.\nadmin@klmms.com')
    }
  } catch {}
})

// Dashboard stats
const profileCompletion = ref(85)
const applicationsSent = ref(12)
const newApplicationsThisWeek = ref(3)
const jobMatches = ref(28)
const newMatchesToday = ref(5)

// Recommended jobs data
const recommendedJobs = ref([
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp Solutions',
    location: 'Puchong, Selangor',
    type: 'Full-time',
    description: 'Join our innovative team building next-generation web applications with React and TypeScript.',
    matchScore: 95,
    salary: 'RM8000 - RM15000',
    matchingSkills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js']
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'DataFlow Inc',
    location: 'Johor Bahru, Johor',
    type: 'Full-time',
    description: 'Work on cutting-edge data visualization and analytics platforms using modern technologies.',
    matchScore: 88,
    salary: 'RM11000 - RM14000',
    matchingSkills: ['JavaScript', 'Python', 'React', 'SQL']
  },
  {
    id: 3,
    title: 'UI/UX Developer',
    company: 'DesignStudio Pro',
    location: 'Remote',
    type: 'Contract',
    description: 'Create beautiful and intuitive user interfaces for web and mobile applications.',
    matchScore: 82,
    salary: 'RM8000 - RM10000',
    matchingSkills: ['React', 'CSS', 'Figma', 'JavaScript']
  }
])

// Recent applications data
const recentApplications = ref([
  {
    id: 1,
    jobTitle: 'Senior React Developer',
    company: 'InnovateTech',
    status: 'Under Review',
    appliedDate: '2 days ago'
  },
  {
    id: 3,
    jobTitle: 'Web Developer',
    company: 'WebSolutions',
    status: 'Applied',
    appliedDate: '1 week ago'
  },
  {
    id: 4,
    jobTitle: 'JavaScript Developer',
    company: 'CodeCraft',
    status: 'Rejected',
    appliedDate: '2 weeks ago'
  }
])

// Career tips data
const careerTips = ref([
  {
    id: 1,
    title: 'Optimize Your LinkedIn Profile',
    description: 'Keep your profile updated with latest skills and achievements to attract recruiters.'
  },
  {
    id: 3,
    title: 'Network Actively',
    description: 'Attend industry events and connect with professionals in your field.'
  },
  {
    id: 4,
    title: 'Customize Your Applications',
    description: 'Tailor your resume and cover letter for each specific job application.'
  }
])

// Upcoming events data
const upcomingEvents = ref([
  {
    id: 2,
    title: 'JavaScript Meetup',
    date: 'Friday, 6:00 PM',
    type: 'Networking'
  },
  {
    id: 3,
    title: 'Career Fair - Tech Companies',
    date: 'Next Monday, 10:00 AM',
    type: 'Job Fair'
  }
])

// Helper functions
const getMatchColor = (score) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 80) return 'text-blue-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-gray-600'
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Interview Scheduled':
      return 'bg-blue-100 text-blue-800'
    case 'Under Review':
      return 'bg-yellow-100 text-yellow-800'
    case 'Applied':
      return 'bg-gray-100 text-gray-800'
    case 'Rejected':
      return 'bg-red-100 text-red-800'
    case 'Hired':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
import { useRouter } from 'vue-router'
const router = useRouter()

// Navigation functions
const navigateToJobSearch = () => {
  console.log('Navigate to job search')
  router.push('/jobbrowse')
}

const navigateToProfile = () => {
  console.log('Navigate to profile')
  // router.push('/application-form')
}

const navigateToApplications = () => {
  console.log('Navigate to applications')
  // router.push('/applications')
}


const viewJobDetails = (jobId) => {
  console.log('View job details:', jobId)
  // router.push(`/jobs/${jobId}`)
}
</script>

<style scoped>
/* Custom animations and transitions */
.transition-all {
  transition: all 0.3s ease;
}

/* Hover effects for cards */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Progress bar animation */
.bg-blue-600 {
  transition: width 0.5s ease-in-out;
}
</style>
