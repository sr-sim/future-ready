<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-3">
              <SparklesIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">AI Job Matching</h1>
              <p class="text-sm text-gray-500">Find your perfect career match</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              @click="goBack"
              class="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
            >
              <ArrowLeftIcon class="h-5 w-5 mr-1" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Start Matching Phase -->
      <div v-if="currentPhase === 'start'" class="max-w-4xl mx-auto">
        <!-- Welcome Section -->
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-8 text-white text-center">
          <div class="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BrainIcon class="h-10 w-10 text-white" />
          </div>
          <h2 class="text-3xl font-bold mb-4">AI-Powered Job Matching</h2>
          <p class="text-purple-100 text-lg mb-6">
            Our advanced AI will analyze your resume and match you with the best companies and positions
          </p>
          <div class="bg-white/10 rounded-xl p-4 mb-6">
            <p class="text-sm text-purple-100">
              ✨ Get personalized job recommendations based on your skills and experience<br>
              📊 Receive detailed resume scoring and improvement suggestions<br>
              🎯 Discover companies that are actively looking for your profile
            </p>
          </div>
        </div>

        <!-- Resume Status -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div class="flex items-center text-white">
              <FileTextIcon class="h-6 w-6 mr-3" />
              <h3 class="text-xl font-bold">Your Resume Status</h3>
            </div>
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <CheckCircleIcon class="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">Resume Ready for Analysis</h4>
                  <p class="text-sm text-gray-600">Last updated: {{ lastResumeUpdate }}</p>
                </div>
              </div>
              <button 
                @click="updateResume"
                class="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                Update Resume
              </button>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ resumeStats.experience }}</p>
                  <p class="text-sm text-gray-600">Years Experience</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ resumeStats.skills }}</p>
                  <p class="text-sm text-gray-600">Skills Listed</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ resumeStats.education }}</p>
                  <p class="text-sm text-gray-600">Education Level</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Start Matching Button -->
        <div class="text-center">
          <button
            @click="startMatching"
            :disabled="isMatching"
            class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span v-if="!isMatching" class="flex items-center">
              <SparklesIcon class="h-6 w-6 mr-3" />
              Start AI Matching
            </span>
            <span v-else class="flex items-center">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Analyzing Resume...
            </span>
          </button>
          <p class="text-gray-600 text-sm mt-4">
            This process typically takes 30-60 seconds
          </p>
        </div>
      </div>

      <!-- Matching Progress Phase -->
      <div v-if="currentPhase === 'matching'" class="max-w-4xl mx-auto">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
            <div class="flex items-center text-white">
              <BrainIcon class="h-6 w-6 mr-3" />
              <h3 class="text-xl font-bold">AI Analysis in Progress</h3>
            </div>
          </div>
          <div class="p-8">
            <div class="text-center mb-8">
              <div class="h-24 w-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
              </div>
              <h4 class="text-xl font-bold text-gray-900 mb-2">{{ currentStep.title }}</h4>
              <p class="text-gray-600">{{ currentStep.description }}</p>
            </div>

            <!-- Progress Steps -->
            <div class="space-y-4">
              <div 
                v-for="(step, index) in matchingSteps" 
                :key="index"
                class="flex items-center"
              >
                <div 
                  :class="[
                    'h-8 w-8 rounded-full flex items-center justify-center mr-4',
                    step.completed ? 'bg-green-500' : step.active ? 'bg-purple-600' : 'bg-gray-300'
                  ]"
                >
                  <CheckIcon v-if="step.completed" class="h-4 w-4 text-white" />
                  <div v-else-if="step.active" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span v-else class="text-white text-sm">{{ index + 1 }}</span>
                </div>
                <div class="flex-1">
                  <h5 class="font-semibold text-gray-900">{{ step.title }}</h5>
                  <p class="text-sm text-gray-600">{{ step.description }}</p>
                </div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mt-8">
              <div class="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{{ matchingProgress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div 
                  class="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
                  :style="{ width: `${matchingProgress}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Summary Phase -->
      <div v-if="currentPhase === 'summary'" class="max-w-4xl mx-auto">
        <!-- Results Summary -->
        <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 mb-8 text-white text-center">
          <div class="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon class="h-10 w-10 text-white" />
          </div>
          <h2 class="text-3xl font-bold mb-4">Analysis Complete!</h2>
          <p class="text-green-100 text-lg mb-6">
            We found {{ matchingResults.totalMatches }} companies that match your profile
          </p>
        </div>

        <!-- Resume Score -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div class="flex items-center text-white">
              <TrophyIcon class="h-6 w-6 mr-3" />
              <h3 class="text-xl font-bold">Your Resume Score</h3>
            </div>
          </div>
          <div class="p-6">
            <div class="flex items-center justify-center mb-6">
              <div class="relative">
                <div class="h-32 w-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-gray-900">{{ resumeScore.overall }}</div>
                    <div class="text-sm text-gray-600">/ 100</div>
                  </div>
                </div>
                <div 
                  class="absolute top-0 left-0 h-32 w-32 rounded-full border-8 border-transparent"
                  :style="{ 
                    borderTopColor: getScoreColor(resumeScore.overall),
                    borderRightColor: resumeScore.overall > 25 ? getScoreColor(resumeScore.overall) : 'transparent',
                    borderBottomColor: resumeScore.overall > 50 ? getScoreColor(resumeScore.overall) : 'transparent',
                    borderLeftColor: resumeScore.overall > 75 ? getScoreColor(resumeScore.overall) : 'transparent',
                    transform: `rotate(${(resumeScore.overall / 100) * 360}deg)`
                  }"
                ></div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center p-4 bg-gray-50 rounded-xl">
                <div class="text-2xl font-bold text-blue-600">{{ resumeScore.skills }}</div>
                <div class="text-sm text-gray-600">Skills Match</div>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-xl">
                <div class="text-2xl font-bold text-green-600">{{ resumeScore.experience }}</div>
                <div class="text-sm text-gray-600">Experience</div>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-xl">
                <div class="text-2xl font-bold text-purple-600">{{ resumeScore.presentation }}</div>
                <div class="text-sm text-gray-600">Presentation</div>
              </div>
            </div>

            <!-- Improvement Suggestions -->
            <div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div class="flex items-start">
                <LightbulbIcon class="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 class="font-semibold text-yellow-900 mb-2">Improvement Suggestions:</h4>
                  <ul class="text-sm text-yellow-800 space-y-1">
                    <li v-for="suggestion in resumeScore.suggestions" :key="suggestion">
                      • {{ suggestion }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div class="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BuildingIcon class="h-6 w-6 text-blue-600" />
            </div>
            <div class="text-2xl font-bold text-gray-900">{{ matchingResults.totalMatches }}</div>
            <div class="text-sm text-gray-600">Total Matches</div>
          </div>
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div class="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <StarIcon class="h-6 w-6 text-green-600" />
            </div>
            <div class="text-2xl font-bold text-gray-900">{{ matchingResults.highMatches }}</div>
            <div class="text-sm text-gray-600">High Matches (80%+)</div>
          </div>
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div class="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUpIcon class="h-6 w-6 text-purple-600" />
            </div>
            <div class="text-2xl font-bold text-gray-900">{{ matchingResults.averageScore }}%</div>
            <div class="text-sm text-gray-600">Average Match Score</div>
          </div>
        </div>

        <!-- View Results Button -->
        <div class="text-center">
          <button
            @click="viewResults"
            class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <span class="flex items-center">
              <EyeIcon class="h-6 w-6 mr-3" />
              View Detailed Results
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  SparklesIcon,
  ArrowLeftIcon,
  BrainIcon,
  FileTextIcon,
  CheckCircleIcon,
  CheckIcon,
  TrophyIcon,
  LightbulbIcon,
  BuildingIcon,
  StarIcon,
  TrendingUpIcon,
  EyeIcon
} from 'lucide-vue-next'

const currentPhase = ref('start') // 'start', 'matching', 'summary'
const isMatching = ref(false)
const matchingProgress = ref(0)

// Resume data
const lastResumeUpdate = ref('3 days ago')
const resumeStats = ref({
  experience: '5+',
  skills: 12,
  education: 'Bachelor\'s'
})

// Matching steps
const matchingSteps = ref([
  {
    title: 'Analyzing Resume Content',
    description: 'Extracting skills, experience, and qualifications',
    completed: false,
    active: false
  },
  {
    title: 'Scoring Profile Strength',
    description: 'Evaluating resume quality and completeness',
    completed: false,
    active: false
  },
  {
    title: 'Matching with Companies',
    description: 'Finding companies that match your profile',
    completed: false,
    active: false
  },
  {
    title: 'Ranking Results',
    description: 'Sorting matches by compatibility score',
    completed: false,
    active: false
  }
])

const currentStep = computed(() => {
  return matchingSteps.value.find(step => step.active) || matchingSteps.value[0]
})

// Resume score results
const resumeScore = ref({
  overall: 85,
  skills: 88,
  experience: 82,
  presentation: 85,
  suggestions: [
    'Add more quantified achievements to your experience section',
    'Include relevant certifications or courses',
    'Optimize keywords for your target industry',
    'Add a professional summary section'
  ]
})

// Matching results
const matchingResults = ref({
  totalMatches: 24,
  highMatches: 8,
  averageScore: 76
})

// Methods
const goBack = () => {
  // Navigate back to dashboard
  console.log('Navigate back to dashboard')
}

const updateResume = () => {
  // Navigate to resume update page
  console.log('Navigate to resume update')
}

const startMatching = async () => {
  isMatching.value = true
  currentPhase.value = 'matching'
  
  // Simulate AI matching process
  for (let i = 0; i < matchingSteps.value.length; i++) {
    // Set current step as active
    matchingSteps.value[i].active = true
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Complete current step
    matchingSteps.value[i].completed = true
    matchingSteps.value[i].active = false
    
    // Update progress
    matchingProgress.value = ((i + 1) / matchingSteps.value.length) * 100
  }
  
  // Show results summary
  setTimeout(() => {
    currentPhase.value = 'summary'
    isMatching.value = false
  }, 1000)
}

const viewResults = () => {
  // Navigate to results page
  window.location.href = '/matchedresult'
}

const getScoreColor = (score) => {
  if (score >= 80) return '#10b981' // green
  if (score >= 60) return '#3b82f6' // blue
  if (score >= 40) return '#f59e0b' // yellow
  return '#ef4444' // red
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Custom progress circle animation */
.progress-circle {
  transition: all 0.5s ease-in-out;
}
</style>
