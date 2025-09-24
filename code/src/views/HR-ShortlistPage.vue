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
              <span class="text-sm text-gray-700">{{ displayName }}</span>
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
                  <p class="text-gray-500 text-xs">Shortlisted: {{ candidate.shortlistedDate }}</p>
                </div>
              </div>
              <div class="text-right"></div>
            </div>

            <!-- Skills -->
            <div class="mb-4">
              <h4 class="text-sm font-semibold text-gray-700 mb-2">Key Skills</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in candidate.skills"
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
                @click="approveOnboarding(candidate)"
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
              <!-- <button
                @click="viewResume(candidate.id)"
                class="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <EyeIcon class="h-4 w-4 mr-2" />
                View Resume
              </button> -->
              <RouterLink
  :to="{ name: 'ViewResume', query: { candidateId: candidate.candidateId } }"
  class="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
>
  <EyeIcon class="h-4 w-4 mr-2" />
  View Resume
</RouterLink>
              <button
                v-if="candidate.status === 'emailSent' || candidate.status === 'shortlisted_sent'"
                @click="approveOnboarding(candidate)"
                class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <CheckIcon class="h-4 w-4 mr-2" />
                Approve
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ensureHrSession } from '../services/session'
import { supabase } from '../lib/supabase'
import { JobSeekerService } from '../services/jobSeekerService'
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
  { label: 'Email Not Sent', value: 'shortlisted_not_sent' },
  { label: 'Email Sent', value: 'shortlisted_sent' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Approved (Onboarding)', value: 'approved' }
]

const selectedFilter = ref('shortlisted_not_sent')

// Loaded from DB
const shortlistedCandidates = ref([])

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
    selectedCandidates.value = selectable.map(c => c.applicationId)
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
  currentEmailTargetIds.value = [candidate.applicationId] // Set target to single application
  emailForm.to = candidate.email
  emailForm.subject = `Interview Invitation for ${candidate.title} at [Company Name]`
  emailForm.body = `Dear ${candidate.name},\n\nThank you for your interest in the ${candidate.title} position at [Company Name]. We were very impressed with your profile and would like to invite you for an interview.\n\nPlease let us know your availability in the coming days.\n\nBest regards,\n[Your Name]\n[Your Title]`
  showEmailModal.value = true
}

const openBulkEmailModal = () => {
  currentEmailTargetIds.value = selectedCandidates.value // Set target to selected applications
  const selectedEmails = shortlistedCandidates.value
    .filter(c => selectedCandidates.value.includes(c.applicationId))
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

  // Update email_status in DB and local state
  try {
    const { error } = await supabase
      .from('applications')
      .update({ email_status: 'SENT', updated_at: new Date().toISOString() })
      .in('id', currentEmailTargetIds.value)
    if (error) console.error('Email status update failed:', error)
  } catch (e) { console.error(e) }
  shortlistedCandidates.value = shortlistedCandidates.value.map(c =>
    currentEmailTargetIds.value.includes(c.applicationId) ? { ...c, sentEmail: true, status: 'shortlisted_sent' } : c
  )
  selectedCandidates.value = selectedCandidates.value.filter(
    id => !currentEmailTargetIds.value.includes(id)
  )
  isSendingEmail.value = false
  closeEmailModal()
}

const viewResume = (candidateId) => {
  alert(`Viewing resume for candidate ID: ${candidateId}`)
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
  shortlistedCandidates.value.filter(c => {
    if (selectedFilter.value === 'shortlisted_not_sent') return c.status === 'shortlisted' && !c.sentEmail
    if (selectedFilter.value === 'shortlisted_sent') return c.status === 'shortlisted_sent' || (c.status === 'shortlisted' && c.sentEmail)
    if (selectedFilter.value === 'rejected') return c.status === 'rejected'
    if (selectedFilter.value === 'approved') return c.status === 'approved'
    return false
  })
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
  currentResultTargetId.value = candidate.applicationId
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
  try {
    isSendingEmail.value = true
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update application status in DB
    try {
      const newStatus = resultForm.action === 'approve' ? 'APPROVED' : 'REJECTED'
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', currentResultTargetId.value)
      if (error) throw error
    } catch (e) {
      console.error('Failed to update application status:', e)
    }

    // Update candidate status locally
    const candidate = shortlistedCandidates.value.find(c => c.applicationId === currentResultTargetId.value)
    if (candidate) {
      candidate.status = resultForm.action === 'approve' ? 'approved' : 'rejected'
      
      // If approved, assign job seeker to company
      if (resultForm.action === 'approve') {
        try {
          // Get current user's company ID
          const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
          const { data: companyProfile } = await supabase
            .from('company_profiles')
            .select('id')
            .eq('user_id', currentUser.id)
            .single()
          
          if (companyProfile) {
            // Assign job seeker to company
            await JobSeekerService.assignToCompany(candidate.candidateId, companyProfile.id)
            alert('Candidate approved and assigned to company! They can now access company documents.')
          }
        } catch (error) {
          console.error('Error assigning candidate to company:', error)
          alert('Email sent, but there was an issue assigning the candidate to the company.')
        }
      }
    }
    
    alert('Result email sent!')
  } catch (error) {
    console.error('Error sending result email:', error)
    alert('Error sending email. Please try again.')
  } finally {
    isSendingEmail.value = false
    closeResultModal()
  }
}

// Direct approve to ONBOARDING from Email Sent section
const approveOnboarding = async (candidate) => {
  try {
    const applicationId = candidate.applicationId
    const companyId = localStorage.getItem('companyId')

    // 1) Mark application as HIRED
    const { error } = await supabase
      .from('applications')
      .update({ status: 'HIRED', updated_at: new Date().toISOString() })
      .eq('id', applicationId)
    if (error) throw error

    // 2) Assign candidate to company in job_seeker_profiles
    if (companyId && candidate.candidateId) {
      const { error: profErr } = await supabase
        .from('job_seeker_profiles')
        .update({ company_id: companyId, updated_at: new Date().toISOString() })
        .eq('id', candidate.candidateId)
      if (profErr) throw profErr
    }

    // Update UI immediately
    shortlistedCandidates.value = shortlistedCandidates.value.map(c =>
      c.applicationId === applicationId ? { ...c, status: 'approved' } : c
    )
  } catch (e) {
    console.error('Failed to approve onboarding:', e)
    alert('Failed to approve candidate for onboarding.')
  }
}

// Company display name
const companyProfile = ref(null)
const profileError = ref('')
const displayName = computed(() => {
  if (companyProfile.value?.company_name) return companyProfile.value.company_name
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  return currentUser?.email || 'HR Manager'
})

const loadHRCompanyProfile = async () => {
  try {
    profileError.value = ''
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (!currentUser.id) throw new Error('User session not found')
    const { data, error } = await supabase
      .from('company_profiles')
      .select('*')
      .eq('user_id', currentUser.id)
      .single()
    if (error || !data) throw new Error('Failed to load company profile')
    companyProfile.value = data
    if (data.id) localStorage.setItem('companyId', data.id)
  } catch (e) {
    console.error('HR profile load error:', e)
    profileError.value = 'Failed to load user profile. Please try again.'
  }
}

onMounted(async () => {
  try {
    await ensureHrSession()
    await loadHRCompanyProfile()
    // Fetch shortlisted applications for this company from DB
    const companyId = localStorage.getItem('companyId') || companyProfile.value?.id
    if (companyId) {
      const { data: apps } = await supabase
        .from('applications')
        .select('id, job_posting_id, job_seeker_id, status, email_status, updated_at, job_seeker_profiles ( id, first_name, last_name, skills )')
        .eq('company_id', companyId)
        .order('updated_at', { ascending: false })

      const mapped = (apps || []).map(a => {
        const first = a.job_seeker_profiles?.first_name || ''
        const last = a.job_seeker_profiles?.last_name || ''
        const name = `${first} ${last}`.trim() || 'Candidate'
        const sent = (a.email_status || '').toUpperCase() === 'SENT'
        let uiStatus = 'shortlisted'
        const s = (a.status || '').toUpperCase()
        if (s === 'REJECTED') uiStatus = 'rejected'
        else if (s === 'APPROVED') uiStatus = 'approved'
        else if (s === 'SHORTLISTED') uiStatus = sent ? 'shortlisted_sent' : 'shortlisted'
        // Extract top skills (flatten JSON array if needed)
        let skills = []
        const rawSkills = a.job_seeker_profiles?.skills
        if (Array.isArray(rawSkills)) {
          skills = rawSkills.map(s => typeof s === 'string' ? s : (s?.name || s?.skill || '')).filter(Boolean)
        } else if (rawSkills && typeof rawSkills === 'object') {
          skills = Object.values(rawSkills).map(s => typeof s === 'string' ? s : (s?.name || s?.skill || '')).filter(Boolean)
        }

        return {
          applicationId: a.id,
          candidateId: a.job_seeker_id,
          name,
      email: '',
      title: '',
      experience: '',
          skills,
          shortlistedDate: new Date(a.updated_at).toLocaleDateString(),
          sentEmail: sent,
          status: uiStatus
        }
      })
      shortlistedCandidates.value = mapped
    }
  } catch (e) {}
})
</script>