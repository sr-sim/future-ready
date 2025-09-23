<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-3">
              <UsersIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Talent Pool</h1>
              <p class="text-sm text-gray-500">Browse all job seekers in the system</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
              <div class="h-2 w-2 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-700">HR Manager</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Search and Filter Bar -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div class="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div class="flex-1 w-full lg:w-auto">
            <div class="relative">
              <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name, skills, or experience..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div class="flex gap-3 flex-wrap">
            <select
              v-model="selectedExperienceLevel"
              class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Experience Levels</option>
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="mid">Mid Level (3-5 years)</option>
              <option value="senior">Senior Level (6+ years)</option>
            </select>
            <select
              v-model="selectedSkillFilter"
              class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Skills</option>
              <option value="React">React</option>
              <option value="Vue.js">Vue.js</option>
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Node.js">Node.js</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Stats Bar -->
      <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div class="flex items-center">
            <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <UsersIcon class="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ totalCandidates }}</p>
              <p class="text-sm text-gray-500">Total Candidates</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div class="flex items-center">
            <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <TrendingUpIcon class="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ filteredCandidates.length }}</p>
              <p class="text-sm text-gray-500">Matching Filters</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div class="flex items-center">
            <div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <MailIcon class="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ contactedCount }}</p>
              <p class="text-sm text-gray-500">Contacted This Month</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div class="flex items-center">
            <div class="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <StarIcon class="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ topTalentCount }}</p>
              <p class="text-sm text-gray-500">Top Talent</p>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Candidate Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div
          v-for="candidate in filteredCandidates"
          :key="candidate.id"
          class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200"
        >
          <div class="p-6">
            <!-- Candidate Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <div class="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                  <span class="text-white font-semibold text-lg">{{ candidate.initials }}</span>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ candidate.name }}</h3>
                  <p class="text-gray-600 font-medium">{{ candidate.title }}</p>
                  <p class="text-sm text-gray-500">{{ candidate.experience }} years experience</p>
                </div>
              </div>
              <div class="text-right">
                <div class="flex items-center justify-end mb-1">
                </div>
                <p class="text-xs text-gray-500">Last active: {{ candidate.lastActive }}</p>
              </div>
            </div>

            <!-- Skills -->
            <div class="mb-4">
              <h4 class="text-sm font-semibold text-gray-700 mb-2">Top Skills</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in candidate.topSkills.slice(0, 5)"
                  :key="skill"
                  class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                >
                  {{ skill }}
                </span>
                <span
                  v-if="candidate.topSkills.length > 5"
                  class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                >
                  +{{ candidate.topSkills.length - 5 }} more
                </span>
              </div>
            </div>

            <!-- Experience Summary -->
            <div class="mb-4 p-3 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-700">{{ candidate.summary }}</p>
            </div>

            <!-- Location and Availability -->
            <div class="flex items-center justify-between mb-4 text-sm text-gray-600">
              <div class="flex items-center">
                <MapPinIcon class="h-4 w-4 mr-1" />
                <span>{{ candidate.location }}</span>
              </div>
              <div class="flex items-center">
                <ClockIcon class="h-4 w-4 mr-1" />
                <span class="capitalize">{{ candidate.availability }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-between items-center pt-4 border-t border-gray-100">
              <div class="flex gap-2">
               
                <RouterLink
                  :to="{ name: 'ViewResume', query: { candidateId: candidate.id } }"
                  class="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  <FileTextIcon class="h-4 w-4 mr-1" />
                  Resume
                </RouterLink>
              </div>
              <button
                @click="openInterestModal(candidate)"
                :disabled="candidate.contacted"
                :class="candidate.contacted 
                  ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'"
                class="flex items-center px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <span v-if="candidate.contacted" class="flex items-center">
                  <CheckCircleIcon class="h-4 w-4 mr-2" />
                  Contacted
                </span>
                <span v-else class="flex items-center">
                  <MailIcon class="h-4 w-4 mr-2" />
                  Express Interest
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredCandidates.length === 0" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
        <SearchIcon class="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No candidates found</h3>
        <p class="text-gray-500">Try adjusting your search criteria or filters</p>
      </div>
    </div>

    <!-- Express Interest Modal -->
    <div v-if="showInterestModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
        <button @click="closeInterestModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XIcon class="h-6 w-6" />
        </button>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          Express Interest in Candidate
        </h2>

        <form @submit.prevent="sendInterestEmail" class="space-y-5">
          <div>
            <label for="candidate-name" class="block text-sm font-semibold text-gray-700 mb-2">Candidate</label>
            <input
              id="candidate-name"
              type="text"
              :value="selectedCandidate?.name"
              readonly
              class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
            />
          </div>
          <div>
            <label for="position" class="block text-sm font-semibold text-gray-700 mb-2">Position of Interest</label>
            <select
              id="position"
              v-model="interestForm.position"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              <option value="">Select a position</option>
              <option value="Senior Frontend Developer">Senior Frontend Developer</option>
              <option value="Backend Engineer">Backend Engineer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Data Scientist">Data Scientist</option>
            </select>
          </div>
          <div>
            <label for="interest-subject" class="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
            <input
              id="interest-subject"
              type="text"
              v-model="interestForm.subject"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label for="interest-body" class="block text-sm font-semibold text-gray-700 mb-2">Message</label>
            <textarea
              id="interest-body"
              v-model="interestForm.body"
              rows="8"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y text-sm"
            ></textarea>
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeInterestModal"
              class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSendingEmail"
              class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm shadow-md"
            >
              <span v-if="!isSendingEmail">Send Interest Email</span>
              <span v-else class="flex items-center justify-center">
                <LoaderIcon class="animate-spin h-5 w-5 mr-2" />
                Sending...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  UsersIcon,
  SearchIcon,
  TrendingUpIcon,
  MailIcon,
  StarIcon,
  EyeIcon,
  FileTextIcon,
  CheckCircleIcon,
  MapPinIcon,
  ClockIcon,
  XIcon,
  LoaderIcon
} from 'lucide-vue-next'

// Sample candidate data - in real app this would come from API
const allCandidates = ref([
  {
    id: 'js1',
    name: 'Sarah Johnson',
    initials: 'SJ',
    title: 'Senior React Developer',
    experience: 6,
    topSkills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker'],
    summary: 'Experienced frontend developer with expertise in React ecosystem and modern web technologies.',
    location: 'Kuala Lumpur, Malaysia',
    availability: 'available',
    lastActive: '2 days ago',
    talentScore: 95,
    contacted: false,
    email: 'sarah.johnson@example.com'
  },
  {
    id: 'js2',
    name: 'Michael Chen',
    initials: 'MC',
    title: 'Full Stack Engineer',
    experience: 4,
    topSkills: ['Vue.js', 'JavaScript', 'Python', 'Django', 'PostgreSQL'],
    summary: 'Versatile full-stack developer with strong problem-solving skills and experience in agile environments.',
    location: 'Kuala Lumpur, Malaysia',
    availability: 'open to offers',
    lastActive: '1 week ago',
    talentScore: 87,
    contacted: true,
    email: 'michael.chen@example.com'
  },
  {
    id: 'js3',
    name: 'Emily Rodriguez',
    initials: 'ER',
    title: 'Backend Developer',
    experience: 5,
    topSkills: ['Java', 'Spring Boot', 'Microservices', 'Kubernetes', 'MongoDB'],
    summary: 'Backend specialist focused on scalable architectures and cloud-native solutions.',
    location: 'Kuala Lumpur, Malaysia',
    availability: 'available',
    lastActive: '3 days ago',
    talentScore: 82,
    contacted: false,
    email: 'emily.rodriguez@example.com'
  },
  {
    id: 'js4',
    name: 'David Kim',
    initials: 'DK',
    title: 'DevOps Engineer',
    experience: 7,
    topSkills: ['AWS', 'Terraform', 'CI/CD', 'Kubernetes', 'Python', 'Monitoring'],
    summary: 'DevOps expert with extensive experience in cloud infrastructure and automation.',
    location: 'Kuala Lumpur, Malaysia',
    availability: 'not looking',
    lastActive: '5 days ago',
    talentScore: 91,
    contacted: false,
    email: 'david.kim@example.com'
  },
  {
    id: 'js5',
    name: 'Priya Singh',
    initials: 'PS',
    title: 'UI/UX Developer',
    experience: 3,
    topSkills: ['React', 'CSS', 'Figma', 'JavaScript', 'Design Systems'],
    summary: 'Creative developer bridging design and development with strong attention to user experience.',
    location: 'Kuala Lumpur, Malaysia',
    availability: 'available',
    lastActive: '1 day ago',
    talentScore: 78,
    contacted: false,
    email: 'priya.singh@example.com'
  },
  {
    id: 'js6',
    name: 'Alex Thompson',
    initials: 'AT',
    title: 'Data Scientist',
    experience: 4,
    topSkills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'R', 'Statistics'],
    summary: 'Data scientist with expertise in machine learning and statistical analysis for business insights.',
    location: 'Kuala Lumpur, Malaysia',
    availability: 'open to offers',
    lastActive: '4 days ago',
    talentScore: 85,
    contacted: true,
    email: 'alex.thompson@example.com'
  },
  {
    id: 'js7',
    name: 'Lisa Wang',
    initials: 'LW',
    title: 'Mobile Developer',
    experience: 5,
    topSkills: ['Flutter', 'React Native', 'iOS', 'Android', 'Firebase', 'REST APIs'],
    summary: 'Mobile development specialist with cross-platform expertise and strong app store presence.',
    location: 'Kuala Lumpur, Malaysia',
    availability: 'available',
    lastActive: '6 days ago',
    talentScore: 80,
    contacted: false,
    email: 'lisa.wang@example.com'
  },
  {
    id: 'js8',
    name: 'Carlos Mendez',
    initials: 'CM',
    title: 'QA Engineer',
    experience: 6,
    topSkills: ['Selenium', 'Cypress', 'Jest', 'API Testing', 'Performance Testing'],
    summary: 'Quality assurance expert with comprehensive testing strategies and automation expertise.',
    location: 'Kuala Lumpur, Malaysia',
    availability: 'not looking',
    lastActive: '1 week ago',
    talentScore: 75,
    contacted: false,
    email: 'carlos.mendez@example.com'
  }
])

// Search and filter states
const searchQuery = ref('')
const selectedExperienceLevel = ref('')
const selectedSkillFilter = ref('')

// Modal states
const showInterestModal = ref(false)
const selectedCandidate = ref(null)
const isSendingEmail = ref(false)

// Interest email form
const interestForm = reactive({
  position: '',
  subject: '',
  body: ''
})

// Computed properties
const totalCandidates = computed(() => allCandidates.value.length)
const contactedCount = computed(() => allCandidates.value.filter(c => c.contacted).length)
const topTalentCount = computed(() => allCandidates.value.filter(c => c.talentScore >= 85).length)

const filteredCandidates = computed(() => {
  let filtered = allCandidates.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(candidate =>
      candidate.name.toLowerCase().includes(query) ||
      candidate.title.toLowerCase().includes(query) ||
      candidate.topSkills.some(skill => skill.toLowerCase().includes(query))
    )
  }

  // Experience level filter
  if (selectedExperienceLevel.value) {
    filtered = filtered.filter(candidate => {
      switch (selectedExperienceLevel.value) {
        case 'entry':
          return candidate.experience <= 2
        case 'mid':
          return candidate.experience >= 3 && candidate.experience <= 5
        case 'senior':
          return candidate.experience >= 6
        default:
          return true
      }
    })
  }

  // Skill filter
  if (selectedSkillFilter.value) {
    filtered = filtered.filter(candidate =>
      candidate.topSkills.includes(selectedSkillFilter.value)
    )
  }

  return filtered
})

// Methods
const getTalentBadgeClass = (score) => {
  if (score >= 90) return 'bg-green-100 text-green-800'
  if (score >= 80) return 'bg-blue-100 text-blue-800'
  if (score >= 70) return 'bg-yellow-100 text-yellow-800'
  return 'bg-gray-100 text-gray-800'
}

const getTalentLabel = (score) => {
  if (score >= 90) return 'Top Talent'
  if (score >= 80) return 'High Potential'
  if (score >= 70) return 'Good Match'
  return 'Potential'
}

const viewProfile = (candidate) => {
  console.log('View profile for:', candidate.name)
  // Navigate to detailed profile view
}

const openInterestModal = (candidate) => {
  selectedCandidate.value = candidate
  interestForm.position = ''
  interestForm.subject = `Opportunity at [Company Name] - ${candidate.title} Position`
  interestForm.body = `Dear ${candidate.name},

I hope this message finds you well. I came across your profile and was impressed by your background in ${candidate.topSkills.slice(0, 3).join(', ')}.

We have an exciting opportunity for a ${candidate.title} position at [Company Name] that I believe would be a great fit for your skills and experience.

Would you be interested in learning more about this opportunity? I'd love to schedule a brief call to discuss the role and how it aligns with your career goals.

Best regards,
[Your Name]
[Your Title]
[Company Name]`
  showInterestModal.value = true
}

const closeInterestModal = () => {
  showInterestModal.value = false
  selectedCandidate.value = null
  interestForm.position = ''
  interestForm.subject = ''
  interestForm.body = ''
}

const sendInterestEmail = async () => {
  isSendingEmail.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  console.log('Sending interest email:', {
    candidate: selectedCandidate.value.name,
    position: interestForm.position,
    subject: interestForm.subject,
    body: interestForm.body
  })
  
  // Mark candidate as contacted
  selectedCandidate.value.contacted = true
  
  alert('Interest email sent successfully!')
  isSendingEmail.value = false
  closeInterestModal()
}
</script>