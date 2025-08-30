<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <header class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-3">
              <TargetIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Job Results</h1>
              <p class="text-sm text-gray-500">{{ selectedJob?.title || 'View applicants and AI matches' }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="relative">
              <button
                @click="toggleAIHistoryDropdown"
                class="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <BrainIcon class="h-4 w-4" />
                <span class="text-sm font-medium">AI Match History</span>
                <ChevronDownIcon class="h-4 w-4" />
              </button>
      
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
          
            <div class="flex items-center space-x-2">
              <div class="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-semibold">{{ userInitials }}</span>
              </div>
              <span class="text-gray-700 font-medium">{{ userName }}</span>
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
      <div v-if="selectedJob" class="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div class="flex items-center justify-between text-white">
            <div class="flex items-center">
              <BriefcaseIcon class="h-6 w-6 mr-3" />
              <div>
                <h2 class="text-xl font-bold">{{ selectedJob.title }}</h2>
                <p class="text-blue-100">{{ selectedJob.department }} • {{ selectedJob.location }}</p>
              </div>
            </div>
            <div class="text-right">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  getStatusColor(selectedJob.status)
                ]"
              >
                {{ selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1) }}
              </span>
              <div class="mt-1 text-blue-100 text-sm">
                {{ selectedJob.applications }} applications
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p class="text-sm font-semibold text-gray-700 mb-1">Job Type</p>
              <p class="text-gray-900">{{ selectedJob.jobType }}</p>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-700 mb-1">Salary Range</p>
              <p class="text-gray-900">{{ selectedJob.salary }}</p>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-700 mb-1">Experience Level</p>
              <p class="text-gray-900">{{ selectedJob.experience }}</p>
            </div>
          </div>
          
          <div class="mt-4">
            <p class="text-sm font-semibold text-gray-700 mb-2">Required Skills</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in selectedJob.requiredSkills"
                :key="skill"
                class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
          <div class="flex items-center justify-between text-white">
            <div class="flex items-center">
              <UsersIcon class="h-6 w-6 mr-3" />
              <h3 class="text-lg font-bold">Applicant Rankings & Match Analysis</h3>
            </div>
            <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
              {{ applicants.length }} candidates
            </span>
          </div>
        </div>
        
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <label class="text-sm font-semibold text-gray-700">Sort by:</label>
              <select
                v-model="sortBy"
                @change="sortApplicants"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
              >
                <option value="score">Match Score</option>
                <option value="date">Application Date</option>
                <option value="name">Name</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="toggleSortOrder"
                class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowUpDownIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
          <div class="space-y-6">
            <div
              v-for="(applicant, index) in sortedApplicants"
              :key="applicant.id"
              class="border border-gray-700 rounded-xl hover:bg-gray-50 transition-colors overflow-hidden"
            >
              <div class="flex items-center justify-between p-6">
                <div class="flex items-center">
                  <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-bold text-lg mr-4">
                    {{ index + 1 }}
                  </div>
                  <div class="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-6">
                    <span class="text-white font-semibold text-lg">{{ applicant.initials }}</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-xl text-gray-900">{{ applicant.name }}</h4>
                    <p class="text-gray-600 font-medium">{{ applicant.experience }}</p>
                    <p class="text-sm text-gray-500">Applied {{ applicant.appliedDate }}</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-6">
                  <div class="text-right">
                    <div class="flex items-center justify-end mb-1">
                      <StarIcon class="h-5 w-5 text-yellow-500 mr-2" />
                      <span class="font-bold text-2xl" :class="getScoreColor(applicant.matchScore)">
                        {{ applicant.matchScore }}%
                      </span>
                    </div>
                    <p class="text-sm text-gray-500">Overall Match Score</p>
                    <div class="w-24 bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        class="h-2 rounded-full transition-all duration-300"
                        :class="getScoreBarColor(applicant.matchScore)"
                        :style="{ width: applicant.matchScore + '%' }"
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <span
                      :class="[
                        'px-4 py-2 rounded-full text-sm font-medium',
                        getApplicationStatusColor(applicant.status)
                      ]"
                    >
                      {{ applicant.status }}
                    </span>
                  </div>
                  
                  <div class="flex items-center space-x-3">
                    <button
                      @click="viewApplicant(applicant)"
                      class="text-blue-600 hover:text-blue-700 text-sm font-medium px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      View Resume
                    </button>
                    <button
                      @click="shortlistApplicant(applicant)"
                      :class="[
                        'text-sm font-medium px-4 py-2 rounded-lg transition-colors',
                        applicant.shortlisted 
                          ? 'text-green-700 bg-green-100 hover:bg-green-200' 
                          : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                      ]"
                    >
                      {{ applicant.shortlisted ? 'Shortlisted' : 'Shortlist' }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="px-6 pb-6 border-t border-gray-100 bg-gray-50">
                <div class="pt-4">
                  <h5 class="font-semibold text-gray-900 mb-4">Match Analysis & Score Breakdown</h5>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div class="bg-white p-4 rounded-lg border border-gray-200">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Skills Match</span>
                        <span class="font-bold" :class="getScoreColor(applicant.skillsScore)">
                          {{ applicant.skillsScore }}%
                        </span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div
                          class="h-2 rounded-full transition-all duration-300"
                          :class="getScoreBarColor(applicant.skillsScore)"
                          :style="{ width: applicant.skillsScore + '%' }"
                        ></div>
                      </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg border border-gray-200">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Experience Level</span>
                        <span class="font-bold" :class="getScoreColor(applicant.experienceScore)">
                          {{ applicant.experienceScore }}%
                        </span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div
                          class="h-2 rounded-full transition-all duration-300"
                          :class="getScoreBarColor(applicant.experienceScore)"
                          :style="{ width: applicant.experienceScore + '%' }"
                        ></div>
                      </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg border border-gray-200">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Education</span>
                        <span class="font-bold" :class="getScoreColor(applicant.educationScore)">
                          {{ applicant.educationScore }}%
                        </span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div
                          class="h-2 rounded-full transition-all duration-300"
                          :class="getScoreBarColor(applicant.educationScore)"
                          :style="{ width: applicant.educationScore + '%' }"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex items-start space-x-3">
                      <div class="flex-shrink-0 w-2 h-2 rounded-full mt-2" :class="getScoreIndicator(applicant.matchScore)"></div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ getScoreExplanation(applicant) }}</p>
                        <p class="text-xs text-gray-600 mt-1">{{ getDetailedAnalysis(applicant) }}</p>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h6 class="text-sm font-semibold text-green-700 mb-2">Strengths</h6>
                        <ul class="text-xs text-gray-600 space-y-1">
                          <li v-for="strength in applicant.strengths" :key="strength" class="flex items-center">
                            <div class="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                            {{ strength }}
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h6 class="text-sm font-semibold text-orange-700 mb-2">Areas for Improvement</h6>
                        <ul class="text-xs text-gray-600 space-y-1">
                          <li v-for="weakness in applicant.weaknesses" :key="weakness" class="flex items-center">
                            <div class="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                            {{ weakness }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-8 pt-6 border-t border-gray-200 text-center">
            <button class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all">
              Export All Results
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
  ArrowLeftIcon,
  TargetIcon,
  BriefcaseIcon,
  UsersIcon,
  StarIcon,
  ArrowUpDownIcon,
  BrainIcon,
  ChevronDownIcon
} from 'lucide-vue-next'

// User data
const userName = ref('John Smith')
const userInitials = computed(() => userName.value.split(' ').map(n => n[0]).join(''))

// Job data (would come from props or route params in real app)
const selectedJob = ref({
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
})

// Applicant data with rankings and scores
const applicants = ref([
  {
    id: 1,
    name: 'Sarah Johnson',
    initials: 'SJ',
    experience: '6 years React/TypeScript',
    appliedDate: '2 days ago',
    status: 'new',
    matchScore: 95,
    skillsScore: 98,
    experienceScore: 95,
    educationScore: 92,
    shortlisted: false,
    strengths: [
      'Expert in React and TypeScript',
      'Strong component architecture skills',
      'Experience with modern testing frameworks',
      'Excellent problem-solving abilities'
    ],
    weaknesses: [
      'Limited backend experience',
      'No experience with our specific tech stack'
    ]
  },
  {
    id: 2,
    name: 'Mike Chen',
    initials: 'MC',
    experience: '5 years Frontend Development',
    appliedDate: '3 days ago',
    status: 'reviewed',
    matchScore: 88,
    skillsScore: 90,
    experienceScore: 85,
    educationScore: 88,
    shortlisted: true,
    strengths: [
      'Solid JavaScript fundamentals',
      'Good CSS and responsive design skills',
      'Team collaboration experience',
      'Continuous learning mindset'
    ],
    weaknesses: [
      'Limited TypeScript experience',
      'Needs more senior-level project experience',
      'No leadership experience'
    ]
  },
  {
    id: 3,
    name: 'Emily Davis',
    initials: 'ED',
    experience: '4 years Full-stack',
    appliedDate: '1 week ago',
    status: 'interviewed',
    matchScore: 82,
    skillsScore: 85,
    experienceScore: 78,
    educationScore: 85,
    shortlisted: true,
    strengths: [
      'Full-stack development experience',
      'Good understanding of databases',
      'Strong communication skills',
      'Adaptable to new technologies'
    ],
    weaknesses: [
      'Less specialized in frontend',
      'Limited experience with large-scale applications',
      'Needs more React ecosystem knowledge'
    ]
  },
  {
    id: 4,
    name: 'Alex Rodriguez',
    initials: 'AR',
    experience: '3 years JavaScript',
    appliedDate: '1 week ago',
    status: 'rejected',
    matchScore: 65,
    skillsScore: 70,
    experienceScore: 55,
    educationScore: 70,
    shortlisted: false,
    strengths: [
      'Basic JavaScript knowledge',
      'Eager to learn',
      'Good work ethic'
    ],
    weaknesses: [
      'Insufficient experience for senior role',
      'Limited React knowledge',
      'No TypeScript experience',
      'Lacks complex project experience'
    ]
  },
  {
    id: 5,
    name: 'Jessica Wong',
    initials: 'JW',
    experience: '7 years React/Node.js',
    appliedDate: '4 days ago',
    status: 'new',
    matchScore: 92,
    skillsScore: 95,
    experienceScore: 90,
    educationScore: 90,
    shortlisted: false,
    strengths: [
      'Extensive React experience',
      'Full-stack capabilities',
      'Leadership experience',
      'Strong technical architecture skills'
    ],
    weaknesses: [
      'May be overqualified',
      'Limited TypeScript in recent projects'
    ]
  },
  {
    id: 6,
    name: 'David Kim',
    initials: 'DK',
    experience: '5 years TypeScript/CSS',
    appliedDate: '5 days ago',
    status: 'reviewed',
    matchScore: 78,
    skillsScore: 82,
    experienceScore: 75,
    educationScore: 78,
    shortlisted: false,
    strengths: [
      'Strong TypeScript skills',
      'Excellent CSS and design sense',
      'Good debugging abilities'
    ],
    weaknesses: [
      'Limited React experience',
      'No experience with testing frameworks',
      'Needs more complex project experience'
    ]
  }
])

// AI Candidate data
const aiCandidates = ref([])

// Sorting and filtering
const sortBy = ref('score')
const sortOrder = ref('desc')

// AI Screening state
const isScreening = ref(false)
const screeningProgress = ref(0)
const screeningStatus = ref('')

// Sample AI candidates data
const sampleAICandidates = [
  {
    id: 101,
    name: 'John Smith',
    initials: 'JS',
    experience: '8 years React/TypeScript',
    topSkills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    aiScore: 96
  },
  {
    id: 102,
    name: 'Maria Garcia',
    initials: 'MG',
    experience: '6 years Frontend Architecture',
    topSkills: ['JavaScript', 'CSS', 'Vue.js', 'React'],
    aiScore: 89
  },
  {
    id: 103,
    name: 'Tom Wilson',
    initials: 'TW',
    experience: '7 years Full-stack Development',
    topSkills: ['React', 'Node.js', 'MongoDB', 'AWS'],
    aiScore: 85
  },
  {
    id: 104,
    name: 'Anna Lee',
    initials: 'AL',
    experience: '5 years UI/UX Development',
    topSkills: ['TypeScript', 'CSS', 'Figma', 'React'],
    aiScore: 81
  }
]

// AI Match History data
const aiMatchHistory = ref([
  {
    id: 1,
    title: 'Senior Backend Developer',
    department: 'Engineering',
    matchedDate: '2 days ago',
    totalCandidates: 18,
    topMatchScore: 94
  },
  {
    id: 2,
    title: 'Product Manager',
    department: 'Product',
    matchedDate: '1 week ago',
    totalCandidates: 25,
    topMatchScore: 89
  },
  {
    id: 3,
    title: 'UX Designer',
    department: 'Design',
    matchedDate: '2 weeks ago',
    totalCandidates: 12,
    topMatchScore: 92
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    department: 'Engineering',
    matchedDate: '3 weeks ago',
    totalCandidates: 8,
    topMatchScore: 87
  }
])

// Computed properties
const sortedApplicants = computed(() => {
  const sorted = [...applicants.value].sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy.value) {
      case 'score':
        aValue = a.matchScore
        bValue = b.matchScore
        break
      case 'date':
        aValue = new Date(a.appliedDate)
        bValue = new Date(b.appliedDate)
        break
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'status':
        aValue = a.status
        bValue = b.status
        break
      default:
        aValue = a.matchScore
        bValue = b.matchScore
    }
    
    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
  
  return sorted
})

// Methods
const goBack = () => {
  // Navigate back to job management dashboard
  console.log('Navigate back to job management')
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

const getApplicationStatusColor = (status) => {
  switch (status) {
    case 'new':
      return 'bg-blue-100 text-blue-800'
    case 'reviewed':
      return 'bg-yellow-100 text-yellow-800'
    case 'interviewed':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 80) return 'text-blue-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

const getScoreBarColor = (score) => {
  if (score >= 90) return 'bg-green-500'
  if (score >= 80) return 'bg-blue-500'
  if (score >= 70) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getScoreIndicator = (score) => {
  if (score >= 90) return 'bg-green-500'
  if (score >= 80) return 'bg-blue-500'
  if (score >= 70) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getScoreExplanation = (applicant) => {
  if (applicant.matchScore >= 90) {
    return 'Excellent match - This candidate strongly aligns with job requirements'
  } else if (applicant.matchScore >= 80) {
    return 'Good match - This candidate meets most requirements with minor gaps'
  } else if (applicant.matchScore >= 70) {
    return 'Moderate match - This candidate has potential but needs development in key areas'
  } else {
    return 'Low match - This candidate lacks several key requirements for this role'
  }
}

const getDetailedAnalysis = (applicant) => {
  const skillsLevel = applicant.skillsScore >= 85 ? 'strong' : applicant.skillsScore >= 70 ? 'adequate' : 'weak'
  const expLevel = applicant.experienceScore >= 85 ? 'extensive' : applicant.experienceScore >= 70 ? 'sufficient' : 'limited'
  
  return `Skills assessment: ${skillsLevel} technical abilities. Experience level: ${expLevel} relevant background. Overall recommendation: ${applicant.matchScore >= 80 ? 'Proceed with interview' : applicant.matchScore >= 70 ? 'Consider for phone screening' : 'Not recommended for this role'}.`
}

const sortApplicants = () => {
  // Sorting is handled by computed property
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

const viewApplicant = (applicant) => {
  console.log('View applicant:', applicant.name)
}

const shortlistApplicant = (applicant) => {
  applicant.shortlisted = !applicant.shortlisted
  console.log('Shortlist status changed for:', applicant.name)
}

const startAIScreening = async () => {
  isScreening.value = true
  screeningProgress.value = 0
  aiCandidates.value = []
  
  const steps = [
    'Analyzing job requirements...',
    'Scanning candidate database...',
    'Matching skills and experience...',
    'Calculating compatibility scores...',
    'Ranking potential candidates...'
  ]
  
  for (let i = 0; i < steps.length; i++) {
    screeningStatus.value = steps[i]
    
    // Simulate progress
    const targetProgress = ((i + 1) / steps.length) * 100
    while (screeningProgress.value < targetProgress) {
      await new Promise(resolve => setTimeout(resolve, 50))
      screeningProgress.value += 2
    }
  }
  
  // Add AI candidates
  aiCandidates.value = sampleAICandidates
  isScreening.value = false
  screeningStatus.value = 'Screening complete!'
}

const viewCandidate = (candidate) => {
  console.log('View AI candidate:', candidate.name)
}

const inviteCandidate = (candidate) => {
  console.log('Invite candidate:', candidate.name)
}

const showAIHistoryDropdown = ref(false)

const toggleAIHistoryDropdown = () => {
  showAIHistoryDropdown.value = !showAIHistoryDropdown.value
}

const viewAIMatchHistory = (job) => {
  console.log('View AI match history for:', job.title)
  showAIHistoryDropdown.value = false
  // Navigate to specific job results or load different data
}

// Initialize component
onMounted(() => {
  // Component initialization
})
</script>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}
</style>
