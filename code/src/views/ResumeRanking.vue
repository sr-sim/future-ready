<template>
  <div class="min-h-screen bg-gray-50"> 
    
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <TrendingUpIcon class="h-5 w-5 text-white" />
            </div>
            <h1 class="text-xl font-semibold text-gray-900">Resume Analysis Results</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200">
              Export Results
            </button>
            <button class="text-gray-400 hover:text-gray-600">
              <LogOutIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Job: {{ jobDetails.title }}</h2>
          <span class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
            {{ jobDetails.department }}
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ resumeResults.length }}</div>
            <div class="text-sm text-gray-600">Total Resumes</div>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ highMatchCount }}</div>
            <div class="text-sm text-gray-600">High Match (80%+)</div>
          </div>
          <div class="text-center p-4 bg-yellow-50 rounded-lg">
            <div class="text-2xl font-bold text-yellow-600">{{ mediumMatchCount }}</div>
            <div class="text-sm text-gray-600">Medium Match (60-79%)</div>
          </div>
        </div>
      </div>

       Filters and Search 
      <div class="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <SearchIcon class="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search candidates by name or skills..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div class="flex gap-2">
            <select
              v-model="selectedFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Matches</option>
              <option value="high">High Match (80%+)</option>
              <option value="medium">Medium Match (60-79%)</option>
              <option value="low">Low Match (<60%)</option>
            </select>
            <button
              @click="sortBy = sortBy === 'score' ? 'name' : 'score'"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
            >
              <ArrowUpDownIcon class="h-4 w-4 inline mr-1" />
              Sort by {{ sortBy === 'score' ? 'Name' : 'Score' }}
            </button>
          </div>
        </div>
      </div>

       Resume Results 
      <div class="space-y-4">
        <div
          v-for="(candidate, index) in filteredResults"
          :key="index"
          class="bg-white rounded-xl shadow-sm border hover:shadow-md transition duration-200"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <div class="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <UserIcon class="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ candidate.name }}</h3>
                  <p class="text-gray-600">{{ candidate.title }}</p>
                  <p class="text-sm text-gray-500">{{ candidate.experience }} years experience</p>
                </div>
              </div>
              <div class="text-right">
                <div class="flex items-center mb-2">
                  <div
                    class="text-2xl font-bold mr-2"
                    :class="getScoreColor(candidate.matchScore)"
                  >
                    {{ candidate.matchScore }}%
                  </div>
                  <div
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    :class="getMatchBadgeClass(candidate.matchScore)"
                  >
                    {{ getMatchLabel(candidate.matchScore) }}
                  </div>
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <ClockIcon class="h-4 w-4 mr-1" />
                  Processed {{ candidate.processedTime }}
                </div>
              </div>
            </div>

             Skills Match 
            <div class="mb-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Skills Match</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in candidate.matchedSkills"
                  :key="skill"
                  class="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
                >
                  {{ skill }}
                </span>
                <span
                  v-for="skill in candidate.missingSkills.slice(0, 3)"
                  :key="skill"
                  class="px-2 py-1 bg-red-100 text-red-800 rounded text-sm"
                >
                  {{ skill }} (missing)
                </span>
              </div>
            </div>

             Match Breakdown 
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div class="text-center">
                <div class="text-lg font-semibold text-gray-900">{{ candidate.skillsMatch }}%</div>
                <div class="text-xs text-gray-600">Skills</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-gray-900">{{ candidate.experienceMatch }}%</div>
                <div class="text-xs text-gray-600">Experience</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-gray-900">{{ candidate.educationMatch }}%</div>
                <div class="text-xs text-gray-600">Education</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-gray-900">{{ candidate.keywordsMatch }}%</div>
                <div class="text-xs text-gray-600">Keywords</div>
              </div>
            </div>

             Actions 
            <div class="flex justify-between items-center pt-4 border-t">
              <div class="flex space-x-2">
                <button class="flex items-center px-3 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition duration-200">
                  <EyeIcon class="h-4 w-4 mr-1" />
                  View Resume
                </button>
                <button class="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200">
                  <DownloadIcon class="h-4 w-4 mr-1" />
                  Download
                </button>
              </div>
              <div class="flex space-x-2">
                <button class="flex items-center px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200">
                  <CheckIcon class="h-4 w-4 mr-1" />
                  Shortlist
                </button>
                <button class="flex items-center px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200">
                  <XIcon class="h-4 w-4 mr-1" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-8">
        <div class="flex space-x-2">
          <button class="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
            Previous
          </button>
          <button class="px-3 py-2 bg-indigo-600 text-white rounded-lg">1</button>
          <button class="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
            2
          </button>
          <button class="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  TrendingUpIcon, 
  LogOutIcon, 
  SearchIcon, 
  ArrowUpDownIcon, 
  UserIcon, 
  ClockIcon, 
  EyeIcon, 
  DownloadIcon, 
  CheckIcon, 
  XIcon 
} from 'lucide-vue-next'

const searchQuery = ref('')
const selectedFilter = ref('all')
const sortBy = ref('score')

const jobDetails = {
  title: 'Senior Frontend Developer',
  department: 'Engineering'
}

const resumeResults = ref([
  {
    name: 'Sarah Johnson',
    title: 'Senior React Developer',
    experience: 6,
    matchScore: 92,
    skillsMatch: 95,
    experienceMatch: 90,
    educationMatch: 85,
    keywordsMatch: 98,
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
    missingSkills: ['Docker', 'Kubernetes'],
    processedTime: '2 min ago'
  },
  {
    name: 'Michael Chen',
    title: 'Frontend Engineer',
    experience: 4,
    matchScore: 87,
    skillsMatch: 88,
    experienceMatch: 85,
    educationMatch: 90,
    keywordsMatch: 85,
    matchedSkills: ['Vue.js', 'JavaScript', 'CSS', 'REST APIs'],
    missingSkills: ['React', 'TypeScript', 'GraphQL'],
    processedTime: '3 min ago'
  },
  {
    name: 'Emily Rodriguez',
    title: 'Full Stack Developer',
    experience: 5,
    matchScore: 78,
    skillsMatch: 75,
    experienceMatch: 80,
    educationMatch: 85,
    keywordsMatch: 72,
    matchedSkills: ['JavaScript', 'Python', 'React', 'MongoDB'],
    missingSkills: ['TypeScript', 'AWS', 'GraphQL'],
    processedTime: '5 min ago'
  },
  {
    name: 'David Kim',
    title: 'UI/UX Developer',
    experience: 3,
    matchScore: 65,
    skillsMatch: 60,
    experienceMatch: 65,
    educationMatch: 75,
    keywordsMatch: 70,
    matchedSkills: ['HTML', 'CSS', 'JavaScript', 'Figma'],
    missingSkills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    processedTime: '7 min ago'
  },
  {
    name: 'Lisa Wang',
    title: 'Software Engineer',
    experience: 2,
    matchScore: 58,
    skillsMatch: 55,
    experienceMatch: 50,
    educationMatch: 80,
    keywordsMatch: 65,
    matchedSkills: ['JavaScript', 'HTML', 'CSS'],
    missingSkills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
    processedTime: '10 min ago'
  }
])

const highMatchCount = computed(() => 
  resumeResults.value.filter(r => r.matchScore >= 80).length
)

const mediumMatchCount = computed(() => 
  resumeResults.value.filter(r => r.matchScore >= 60 && r.matchScore < 80).length
)

const filteredResults = computed(() => {
  let results = resumeResults.value

  // Filter by search query
  if (searchQuery.value) {
    results = results.filter(candidate => 
      candidate.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      candidate.matchedSkills.some(skill => 
        skill.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    )
  }

  // Filter by match level
  if (selectedFilter.value !== 'all') {
    results = results.filter(candidate => {
      if (selectedFilter.value === 'high') return candidate.matchScore >= 80
      if (selectedFilter.value === 'medium') return candidate.matchScore >= 60 && candidate.matchScore < 80
      if (selectedFilter.value === 'low') return candidate.matchScore < 60
      return true
    })
  }

  // Sort results
  results.sort((a, b) => {
    if (sortBy.value === 'score') {
      return b.matchScore - a.matchScore
    } else {
      return a.name.localeCompare(b.name)
    }
  })

  return results
})

const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const getMatchBadgeClass = (score) => {
  if (score >= 80) return 'bg-green-100 text-green-800'
  if (score >= 60) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

const getMatchLabel = (score) => {
  if (score >= 80) return 'High Match'
  if (score >= 60) return 'Medium Match'
  return 'Low Match'
}
</script>