<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
              <UserIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Onboarding Management</h1>
              <p class="text-sm text-gray-500">Manage New Employees</p>
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
            {{ selectedEmployees.length }} employee{{ selectedEmployees.length !== 1 ? 's' : '' }} selected
          </span>
        </div>
        <div class="flex flex-wrap gap-3">
          <button
            @click="openAddEmployeeModal"
            class="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-md"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Add Employee
          </button>
          <button
            @click="removeSelected"
            :disabled="selectedEmployees.length === 0"
            class="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium shadow-md"
          >
            <TrashIcon class="h-4 w-4 mr-2" />
            Remove Selected
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Employees</p>
              <p class="text-2xl font-bold text-gray-900">{{ onboardingEmployees.length }}</p>
            </div>
            <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active</p>
              <p class="text-2xl font-bold text-green-600">{{ activeEmployees }}</p>
            </div>
            <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">In Progress</p>
              <p class="text-2xl font-bold text-yellow-600">{{ inProgressEmployees }}</p>
            </div>
            <div class="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Pending</p>
              <p class="text-2xl font-bold text-orange-600">{{ pendingEmployees }}</p>
            </div>
            <div class="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircleIcon class="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div> -->

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

      <!-- Employee List -->
      <div v-if="filteredEmployees.length > 0" class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="employee in filteredEmployees"
          :key="employee.id"
          class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-2xl"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :value="employee.id"
                  v-model="selectedEmployees"
                  class="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-4"
                />
                <div class="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <UserIcon class="h-7 w-7 text-gray-600" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ employee.name }}</h3>
                  <p class="text-gray-600 text-sm">{{ employee.position }}</p>
                  <p class="text-gray-500 text-xs">{{ employee.department }}</p>
                </div>
              </div>
              <div class="text-right">
                <div
                  class="px-5 py-1 rounded-full text-xs font-medium mb-2"
                  :class="getStatusBadgeClass(employee.status)"
                >
                  {{ getStatusLabel(employee.status) }}
                </div>
                <p class="text-xs text-gray-500">Started: {{ employee.startDate }}</p>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <h4 class="text-sm font-semibold text-gray-700">Onboarding Progress</h4>
                <span class="text-sm text-gray-600">{{ employee.progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: employee.progress + '%' }"
                ></div>
              </div>
            </div>

            <!-- Tasks -->
            <div class="mb-4">
              <h4 class="text-sm font-semibold text-gray-700 mb-2">Completed Tasks</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="task in employee.completedTasks"
                  :key="task"
                  class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                >
                  {{ task }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                @click="removeEmployee(employee.id)"
                class="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                <TrashIcon class="h-4 w-4 mr-2" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center text-gray-600">
        <UserIcon class="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p class="text-xl font-semibold mb-2">No employees found!</p>
        <p class="text-sm">Add new employees to start the onboarding process.</p>
        <button 
          @click="openAddEmployeeModal"
          class="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
        >
          <PlusIcon class="h-4 w-4 inline mr-2" />
          Add Employee
        </button>
      </div>
    </div>

    <!-- Add Employee Modal -->
    <div v-if="showAddEmployeeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
        <button @click="closeAddEmployeeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XIcon class="h-6 w-6" />
        </button>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          Add New Employee
        </h2>

        <form @submit.prevent="addEmployee" class="space-y-5">
          <div>
            <label for="search" class="block text-sm font-semibold text-gray-700 mb-2">Search by Email or Username</label>
            <div class="relative">
              <input
                id="search"
                type="text"
                v-model="searchQuery"
                @input="searchUsers"
                placeholder="Enter email or username..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <SearchIcon class="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <!-- Search Results -->
          <div v-if="searchResults.length > 0" class="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
            <div
              v-for="user in searchResults"
              :key="user.id"
              @click="selectUser(user)"
              class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div class="flex items-center">
                <div class="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <UserIcon class="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ user.name }}</p>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedUser">
            <label for="position" class="block text-sm font-semibold text-gray-700 mb-2">Position</label>
            <input
              id="position"
              type="text"
              v-model="newEmployeeForm.position"
              required
              placeholder="e.g., Software Engineer"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div v-if="selectedUser">
            <label for="department" class="block text-sm font-semibold text-gray-700 mb-2">Department</label>
            <select
              id="department"
              v-model="newEmployeeForm.department"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          <div v-if="selectedUser">
            <label for="startDate" class="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
            <input
              id="startDate"
              type="date"
              v-model="newEmployeeForm.startDate"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeAddEmployeeModal"
              class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!selectedUser || isAddingEmployee"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm shadow-md"
            >
              <span v-if="!isAddingEmployee">Add Employee</span>
              <span v-else class="flex items-center justify-center">
                <LoaderIcon class="animate-spin h-5 w-5 mr-2" />
                Adding...
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
  UserIcon, 
  TrashIcon, 
  PlusIcon,
  EyeIcon, 
  XIcon, 
  LoaderIcon, 
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  SearchIcon
} from 'lucide-vue-next'

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'Completed' }
]

const selectedFilter = ref('all')

const onboardingEmployees = ref([
  {
    id: 'e1',
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    position: 'Frontend Developer',
    department: 'Engineering',
    status: 'Completed',
    progress: 100,
    startDate: 'Aug 1, 2025',
    completedTasks: ['Documentation', 'IT Setup', 'Team Introduction', 'Training']
  },
  {
    id: 'e2',
    name: 'Bob Smith',
    email: 'bob.smith@company.com',
    position: 'Product Manager',
    department: 'Product',
    status: 'in-progress',
    progress: 75,
    startDate: 'Aug 5, 2025',
    completedTasks: ['Documentation', 'IT Setup', 'Team Introduction']
  },
  {
    id: 'e3',
    name: 'Carol Davis',
    email: 'carol.davis@company.com',
    position: 'UX Designer',
    department: 'Design',
    status: 'in-progress',
    progress: 50,
    startDate: 'Aug 8, 2025',
    completedTasks: ['Documentation', 'IT Setup']
  },
  {
    id: 'e4',
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    position: 'Backend Engineer',
    department: 'Engineering',
    status: 'in-progress',
    progress: 25,
    startDate: 'Aug 10, 2025',
    completedTasks: ['Documentation']
  }
])

const selectedEmployees = ref([])
const showAddEmployeeModal = ref(false)
const isAddingEmployee = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const selectedUser = ref(null)

const newEmployeeForm = reactive({
  position: '',
  department: '',
  startDate: ''
})

// Mock user database for search
const mockUsers = [
  { id: 'u1', name: 'John Doe', email: 'john.doe@example.com' },
  { id: 'u2', name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: 'u3', name: 'Mike Johnson', email: 'mike.johnson@example.com' },
  { id: 'u4', name: 'Sarah Wilson', email: 'sarah.wilson@example.com' },
  { id: 'u5', name: 'Tom Brown', email: 'tom.brown@example.com' }
]

const allSelected = computed(() => {
  return selectedEmployees.value.length === onboardingEmployees.value.length && onboardingEmployees.value.length > 0
})

const activeEmployees = computed(() => 
  onboardingEmployees.value.filter(e => e.status === 'Completed').length
)

const inProgressEmployees = computed(() => 
  onboardingEmployees.value.filter(e => e.status === 'in-progress').length
)


const filteredEmployees = computed(() => {
  if (selectedFilter.value === 'all') {
    return onboardingEmployees.value
  }
  return onboardingEmployees.value.filter(e => e.status === selectedFilter.value)
})

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedEmployees.value = []
  } else {
    selectedEmployees.value = onboardingEmployees.value.map(e => e.id)
  }
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-800'
    case 'in-progress': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'Completed': return 'Completed'
    case 'in-progress': return 'In Progress'
    default: return 'Unknown'
  }
}

const openAddEmployeeModal = () => {
  showAddEmployeeModal.value = true
}

const closeAddEmployeeModal = () => {
  showAddEmployeeModal.value = false
  searchQuery.value = ''
  searchResults.value = []
  selectedUser.value = null
  newEmployeeForm.position = ''
  newEmployeeForm.department = ''
  newEmployeeForm.startDate = ''
}

const searchUsers = () => {
  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }
  
  searchResults.value = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
}

const selectUser = (user) => {
  selectedUser.value = user
  searchQuery.value = `${user.name} (${user.email})`
  searchResults.value = []
}

const addEmployee = async () => {
  if (!selectedUser.value) return
  
  isAddingEmployee.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const newEmployee = {
    id: 'e' + (onboardingEmployees.value.length + 1),
    name: selectedUser.value.name,
    email: selectedUser.value.email,
    position: newEmployeeForm.position,
    department: newEmployeeForm.department,
    progress: 0,
    startDate: new Date(newEmployeeForm.startDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    completedTasks: []
  }
  
  onboardingEmployees.value.push(newEmployee)
  alert('Employee added successfully!')
  
  isAddingEmployee.value = false
  closeAddEmployeeModal()
}

const removeEmployee = (employeeId) => {
  if (confirm('Are you sure you want to remove this employee from onboarding?')) {
    onboardingEmployees.value = onboardingEmployees.value.filter(e => e.id !== employeeId)
    selectedEmployees.value = selectedEmployees.value.filter(id => id !== employeeId)
    alert('Employee removed from onboarding.')
  }
}

const removeSelected = () => {
  if (confirm(`Are you sure you want to remove ${selectedEmployees.value.length} selected employee(s) from onboarding?`)) {
    onboardingEmployees.value = onboardingEmployees.value.filter(
      e => !selectedEmployees.value.includes(e.id)
    )
    selectedEmployees.value = []
    alert('Selected employees removed from onboarding.')
  }
}

const viewProgress = (employee) => {
  alert(`Viewing detailed progress for ${employee.name}`)
  // In a real app, this would navigate to a detailed progress page
}
</script>