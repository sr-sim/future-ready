<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
              <StarIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Shortlisted Candidates</h1>
              <p class="text-sm text-gray-500">Ready for Interview</p>
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
      <!-- Action Bar -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            :checked="allSelected"
            @change="toggleSelectAll"
            class="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span class="text-gray-700 font-medium text-sm">
            {{ selectedCandidates.length }} candidate{{ selectedCandidates.length !== 1 ? 's' : '' }} selected
          </span>
        </div>
        <div class="flex flex-wrap gap-3">
          <button
            @click="openBulkEmailModal"
            :disabled="selectedCandidates.length === 0"
            class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium shadow-md"
          >
            <MailIcon class="h-4 w-4 mr-2" />
            Bulk Email Interview
          </button>
          <button
            @click="removeSelected"
            :disabled="selectedCandidates.length === 0"
            class="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium shadow-md"
          >
            <TrashIcon class="h-4 w-4 mr-2" />
            Remove Selected
          </button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="mb-6 flex gap-3">
        <button
          v-for="filter in FILTERS"
          :key="filter.value"
          @click="selectedFilter = filter.value"
          :class="selectedFilter === filter.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'"
          class="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- Candidate List -->
      <div v-if="filteredCandidates.length > 0" class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="candidate in filteredCandidates"
          :key="candidate.id"
          class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200"
          :class="{ 'hover:shadow-2xl': true }"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <input
                  v-if="!candidate.sentEmail"
                  type="checkbox"
                  :value="candidate.id"
                  v-model="selectedCandidates"
                  class="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-4"
                />
                <div class="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <UserIcon class="h-7 w-7 text-gray-600" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ candidate.name }}</h3>
                  <p class="text-gray-600 text-sm">{{ candidate.title }}</p>
                  <p class="text-gray-500 text-xs">{{ candidate.experience }} years experience</p>
                </div>
              </div>
              <div class="text-right">
                <div class="flex items-center justify-end mb-1">
                  <div
                    class="text-xl font-bold mr-2"
                    :class="getScoreColor(candidate.matchScore)"
                  >
                    {{ candidate.matchScore }}%
                  </div>
                  <div
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    :class="getMatchBadgeClass(candidate.matchScore)"
                  >
                    {{ getMatchLabel(candidate.matchScore) }}
                  </div>
                </div>
                <p class="text-xs text-gray-500">Shortlisted: {{ candidate.shortlistedDate }}</p>
              </div>
            </div>

            <!-- Skills -->
            <div class="mb-4">
              <h4 class="text-sm font-semibold text-gray-700 mb-2">Key Skills</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in candidate.matchedSkills"
                  :key="skill"
                  class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                >
                  {{ skill }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                v-if="candidate.status === 'shortlisted'"
                @click="openEmailModal(candidate)"
                :disabled="candidate.sentEmail"
                :class="candidate.sentEmail ? 'bg-green-100 text-green-700 hover:bg-green-200 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 shadow-md'"
                class="flex items-center px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <span v-if="candidate.sentEmail" class="flex items-center">
                  <CheckCircleIcon class="h-4 w-4 mr-2" />
                  Email Sent
                </span>
                <span v-else class="flex items-center">
                  <MailIcon class="h-4 w-4 mr-2" />
                  Email for Interview
                </span>
              </button>
              <button
                v-if="candidate.status === 'emailSent'"
                @click="openResultModal(candidate, 'approve')"
                class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <CheckIcon class="h-4 w-4 mr-2" />
                Approve
              </button>
              <button
                v-if="candidate.status === 'emailSent'"
                @click="openResultModal(candidate, 'reject')"
                class="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                <XIcon class="h-4 w-4 mr-2" />
                Reject
              </button>
              <button
                @click="viewResume(candidate.id)"
                class="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <EyeIcon class="h-4 w-4 mr-2" />
                View Resume
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center text-gray-600">
        <InboxIcon class="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p class="text-xl font-semibold mb-2">No candidates shortlisted yet!</p>
        <p class="text-sm">Go back to the Resume Analysis page to shortlist candidates.</p>
        <button class="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md">
          <ArrowLeftIcon class="h-4 w-4 inline mr-2" />
          Go to Analysis
        </button>
      </div>
    </div>

    <!-- Email Interview Modal -->
    <div v-if="showEmailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
        <button @click="closeEmailModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XIcon class="h-6 w-6" />
        </button>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          Email Interview Invitation
        </h2>

        <form @submit.prevent="sendEmail" class="space-y-5">
          <div>
            <label for="to" class="block text-sm font-semibold text-gray-700 mb-2">To</label>
            <input
              id="to"
              type="text"
              v-model="emailForm.to"
              readonly
              class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
            />
          </div>
          <div>
            <label for="subject" class="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
            <input
              id="subject"
              type="text"
              v-model="emailForm.subject"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label for="body" class="block text-sm font-semibold text-gray-700 mb-2">Message</label>
            <textarea
              id="body"
              v-model="emailForm.body"
              rows="8"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-sm"
            ></textarea>
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeEmailModal"
              class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSendingEmail"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm shadow-md"
            >
              <span v-if="!isSendingEmail">Send Email</span>
              <span v-else class="flex items-center justify-center">
                <LoaderIcon class="animate-spin h-5 w-5 mr-2" />
                Sending...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Result Email Modal -->
    <div v-if="showResultModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
        <button @click="closeResultModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XIcon class="h-6 w-6" />
        </button>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          {{ resultForm.action === 'approve' ? 'Approve Candidate' : 'Reject Candidate' }}
        </h2>
        <form @submit.prevent="sendResultEmail" class="space-y-5">
          <div>
            <label for="result-to" class="block text-sm font-semibold text-gray-700 mb-2">To</label>
            <input
              id="result-to"
              type="text"
              v-model="resultForm.to"
              readonly
              class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
            />
          </div>
          <div>
            <label for="result-subject" class="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
            <input
              id="result-subject"
              type="text"
              v-model="resultForm.subject"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label for="result-body" class="block text-sm font-semibold text-gray-700 mb-2">Message</label>
            <textarea
              id="result-body"
              v-model="resultForm.body"
              rows="8"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-sm"
            ></textarea>
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeResultModal"
              class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSendingEmail"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm shadow-md"
            >
              <span v-if="!isSendingEmail">Send Email</span>
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
  StarIcon, 
  LogOutIcon, 
  MailIcon, 
  TrashIcon, 
  UserIcon, 
  EyeIcon, 
  XIcon, 
  LoaderIcon, 
  CheckIcon, 
  CheckCircleIcon,
  InboxIcon,
  ArrowLeftIcon
} from 'lucide-vue-next'

const FILTERS = [
  { label: 'Email Not Sent', value: 'shortlisted' },
  { label: 'Email Sent', value: 'emailSent' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Approved (Onboarding)', value: 'approved' }
]

const selectedFilter = ref('shortlisted')

// Add status property to candidates
const shortlistedCandidates = ref([
  {
    id: 'c1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    title: 'Senior React Developer',
    experience: 6,
    matchScore: 92,
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
    shortlistedDate: 'Aug 5, 2025',
    sentEmail: false,
    status: 'shortlisted'
  },
  {
    id: 'c2',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    title: 'Frontend Engineer',
    experience: 4,
    matchScore: 87,
    matchedSkills: ['Vue.js', 'JavaScript', 'CSS', 'REST APIs'],
    shortlistedDate: 'Aug 5, 2025',
    sentEmail: true,
    status: 'emailSent'
  },
  {
    id: 'c3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    title: 'Full Stack Developer',
    experience: 5,
    matchScore: 78,
    matchedSkills: ['JavaScript', 'Python', 'React', 'MongoDB'],
    shortlistedDate: 'Aug 6, 2025',
    sentEmail: false,
    status: 'shortlisted'
  },
  {
    id: 'c4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    title: 'UI/UX Developer',
    experience: 3,
    matchScore: 65,
    matchedSkills: ['HTML', 'CSS', 'JavaScript', 'Figma'],
    shortlistedDate: 'Aug 6, 2025',
    sentEmail: true,
    status: 'emailSent'
  },
  {
    id: 'c5',
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    title: 'Backend Engineer',
    experience: 7,
    matchScore: 85,
    matchedSkills: ['Node.js', 'Express', 'MongoDB', 'Docker'],
    shortlistedDate: 'Aug 7, 2025',
    sentEmail: true,
    status: 'approved'
  },
  {
    id: 'c6',
    name: 'John Doe',
    email: 'john.doe@example.com',
    title: 'DevOps Specialist',
    experience: 8,
    matchScore: 90,
    matchedSkills: ['AWS', 'Terraform', 'CI/CD', 'Kubernetes'],
    shortlistedDate: 'Aug 7, 2025',
    sentEmail: true,
    status: 'rejected'
  },
  {
    id: 'c7',
    name: 'Linda Park',
    email: 'linda.park@example.com',
    title: 'QA Engineer',
    experience: 5,
    matchScore: 70,
    matchedSkills: ['Selenium', 'Cypress', 'Jest', 'Postman'],
    shortlistedDate: 'Aug 8, 2025',
    sentEmail: false,
    status: 'shortlisted'
  },
  {
    id: 'c8',
    name: 'Carlos Mendez',
    email: 'carlos.mendez@example.com',
    title: 'Mobile App Developer',
    experience: 4,
    matchScore: 80,
    matchedSkills: ['Flutter', 'Dart', 'Firebase', 'REST APIs'],
    shortlistedDate: 'Aug 8, 2025',
    sentEmail: true,
    status: 'emailSent'
  }
])

const selectedCandidates = ref([])
const showEmailModal = ref(false)
const isSendingEmail = ref(false)
const emailForm = reactive({
  to: '',
  subject: 'Interview Invitation for [Job Title]',
  body: `Dear [Candidate Name],\n\nThank you for your interest in the [Job Title] position at [Company Name]. We were very impressed with your profile and would like to invite you for an interview.\n\nPlease let us know your availability in the coming days.\n\nBest regards,\n[Your Name]\n[Your Title]`
})

// Store the ID(s) of the candidate(s) for whom the email modal was opened
const currentEmailTargetIds = ref([]) 

const allSelected = computed(() => {
  const selectable = shortlistedCandidates.value.filter(c => !c.sentEmail)
  return selectedCandidates.value.length === selectable.length && selectable.length > 0
})


const toggleSelectAll = () => {
  const selectable = shortlistedCandidates.value.filter(c => !c.sentEmail)
  if (allSelected.value) {
    selectedCandidates.value = []
  } else {
    selectedCandidates.value = selectable.map(c => c.id)
  }
}


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

const openEmailModal = (candidate) => {
  currentEmailTargetIds.value = [candidate.id] // Set target to single candidate
  emailForm.to = candidate.email
  emailForm.subject = `Interview Invitation for ${candidate.title} at [Company Name]`
  emailForm.body = `Dear ${candidate.name},\n\nThank you for your interest in the ${candidate.title} position at [Company Name]. We were very impressed with your profile and would like to invite you for an interview.\n\nPlease let us know your availability in the coming days.\n\nBest regards,\n[Your Name]\n[Your Title]`
  showEmailModal.value = true
}

const openBulkEmailModal = () => {
  currentEmailTargetIds.value = selectedCandidates.value // Set target to selected candidates
  const selectedEmails = shortlistedCandidates.value
    .filter(c => selectedCandidates.value.includes(c.id))
    .map(c => c.email)
  
  emailForm.to = selectedEmails.join(', ')
  emailForm.subject = 'Interview Invitation for Multiple Candidates'
  emailForm.body = `Dear Candidate,\n\nThank you for your interest in a position at [Company Name]. We were very impressed with your profile and would like to invite you for an interview.\n\nPlease let us know your availability in the coming days.\n\nBest regards,\n[Your Name]\n[Your Title]`
  showEmailModal.value = true
}

const closeEmailModal = () => {
  showEmailModal.value = false
  currentEmailTargetIds.value = [] // Clear target IDs
  // Reset form for next use
  emailForm.to = ''
  emailForm.subject = 'Interview Invitation for [Job Title]'
  emailForm.body = `Dear [Candidate Name],\n\nThank you for your interest in the [Job Title] position at [Company Name]. We were very impressed with your profile and would like to invite you for an interview.\n\nPlease let us know your availability in the coming days.\n\nBest regards,\n[Your Name]\n[Your Title]`
}

const sendEmail = async () => {
  isSendingEmail.value = true
  // Simulate API call to send email
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  console.log('Sending email:', emailForm)
  alert('Email(s) sent successfully!')

  // Update sentEmail status for the targeted candidates
  currentEmailTargetIds.value.forEach(id => {
    const candidate = shortlistedCandidates.value.find(c => c.id === id)
    if (candidate) {
      candidate.sentEmail = true
    }
  })
  selectedCandidates.value = selectedCandidates.value.filter(
    id => !currentEmailTargetIds.value.includes(id)
  )
  isSendingEmail.value = false
  closeEmailModal()
}

const viewResume = (candidateId) => {
  alert(`Viewing resume for candidate ID: ${candidateId}`)
  // In a real app, this would navigate to a resume viewer or open a PDF
}

const removeSelected = () => {
  if (confirm(`Are you sure you want to remove ${selectedCandidates.value.length} selected candidate(s) from the shortlist?`)) {
    shortlistedCandidates.value = shortlistedCandidates.value.filter(
      c => !selectedCandidates.value.includes(c.id)
    )
    selectedCandidates.value = [] // Clear selection after removal
    alert('Selected candidates removed from shortlist.')
  }
}

const filteredCandidates = computed(() =>
  shortlistedCandidates.value.filter(c => c.status === selectedFilter.value)
)

// Result Email Modal
const showResultModal = ref(false)
const resultForm = reactive({
  to: '',
  subject: '',
  body: '',
  action: '' // 'approve' or 'reject'
})
const currentResultTargetId = ref(null)

const openResultModal = (candidate, action) => {
  currentResultTargetId.value = candidate.id
  resultForm.to = candidate.email
  resultForm.action = action
  resultForm.subject = action === 'approve'
    ? `Congratulations! You're Approved for Onboarding`
    : `Interview Result: Application Rejected`
  resultForm.body = action === 'approve'
    ? `Dear ${candidate.name},\n\nCongratulations! You have been approved for onboarding as ${candidate.title} at [Company Name].\n\n[AI-generated message or custom reason here]\n\nBest regards,\n[Your Name]\n[Your Title]`
    : `Dear ${candidate.name},\n\nThank you for interviewing for the ${candidate.title} position at [Company Name]. Unfortunately, we will not be moving forward with your application.\n\n[Reason or AI-generated feedback here]\n\nBest regards,\n[Your Name]\n[Your Title]`
  showResultModal.value = true
}

const closeResultModal = () => {
  showResultModal.value = false
  currentResultTargetId.value = null
  resultForm.to = ''
  resultForm.subject = ''
  resultForm.body = ''
  resultForm.action = ''
}

const sendResultEmail = async () => {
  isSendingEmail.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  alert('Result email sent!')
  // Update candidate status
  const candidate = shortlistedCandidates.value.find(c => c.id === currentResultTargetId.value)
  if (candidate) {
    candidate.status = resultForm.action === 'approve' ? 'approved' : 'rejected'
  }
  isSendingEmail.value = false
  closeResultModal()
}
</script>