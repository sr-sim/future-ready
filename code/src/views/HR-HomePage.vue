<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <header class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
              <BarChart3Icon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">HR Dashboard</h1>
              <p class="text-sm text-gray-500">Talent Acquisition Overview</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
              <div class="h-2 w-2 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-700">HR Manager</span>
            </div>
            <button class="text-gray-400 hover:text-gray-600 transition-colors">
              <BellIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-3xl font-bold mb-2">Welcome back, HR Manager!</h2>
            <p class="text-blue-100 text-lg">Here's what's happening with your talent acquisition today.</p>
          </div>
          <div class="hidden md:block">
            <div class="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center">
              <UserIcon class="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="h-12 w-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
              <UsersIcon class="h-6 w-6 text-white" />
            </div>
            <span class="text-green-600 text-sm font-medium bg-green-100 px-2 py-1 rounded-full">+12%</span>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ stats.totalCandidates }}</h3>
          <p class="text-gray-600 text-sm">Total Candidates</p>
        </div>

        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="h-12 w-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
              <StarIcon class="h-6 w-6 text-white" />
            </div>
            <span class="text-blue-600 text-sm font-medium bg-blue-100 px-2 py-1 rounded-full">+8%</span>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ stats.shortlisted }}</h3>
          <p class="text-gray-600 text-sm">Shortlisted</p>
        </div>

        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="h-12 w-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
              <CalendarIcon class="h-6 w-6 text-white" />
            </div>
            <span class="text-purple-600 text-sm font-medium bg-purple-100 px-2 py-1 rounded-full">+5%</span>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ stats.interviews }}</h3>
          <p class="text-gray-600 text-sm">Interviews Scheduled</p>
        </div>

        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="h-12 w-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
              <BriefcaseIcon class="h-6 w-6 text-white" />
            </div>
            <span class="text-orange-600 text-sm font-medium bg-orange-100 px-2 py-1 rounded-full">+3%</span>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ stats.activeJobs }}</h3>
          <p class="text-gray-600 text-sm">Active Job Postings</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div class="flex items-center text-white">
                <ActivityIcon class="h-6 w-6 mr-3" />
                <h2 class="text-xl font-bold">Recent Activity</h2>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-for="activity in recentActivities"
                  :key="activity.id"
                  class="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div class="h-10 w-10 rounded-full flex items-center justify-center mr-4"
                       :class="activity.iconBg">
                    <component :is="activity.icon" class="h-5 w-5 text-white" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                    <p class="text-xs text-gray-500">{{ activity.description }}</p>
                  </div>
                  <div class="text-xs text-gray-400">{{ activity.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <div class="flex items-center text-white">
                <ZapIcon class="h-6 w-6 mr-3" />
                <h2 class="text-xl font-bold">Quick Actions</h2>
              </div>
            </div>
            <div class="p-6 space-y-3">
              <router-link
                to="/upload"
                class="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 group"
              >
                <div class="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4">
                  <UploadCloudIcon class="h-5 w-5 text-white" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900 group-hover:text-blue-700">Upload Resumes</p>
                  <p class="text-xs text-gray-500">Add new candidates</p>
                </div>
                <ChevronRightIcon class="h-4 w-4 text-gray-400 ml-auto group-hover:text-blue-500" />
              </router-link>

              <router-link
                to="/ranking"
                class="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200 group"
              >
                <div class="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                  <BarChart3Icon class="h-5 w-5 text-white" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900 group-hover:text-purple-700">Analyze Resumes</p>
                  <p class="text-xs text-gray-500">Review candidates</p>
                </div>
                <ChevronRightIcon class="h-4 w-4 text-gray-400 ml-auto group-hover:text-purple-500" />
              </router-link>

              <router-link
                to="/shortlist"
                class="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 group"
              >
                <div class="h-10 w-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
                  <StarIcon class="h-5 w-5 text-white" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900 group-hover:text-green-700">View Shortlist</p>
                  <p class="text-xs text-gray-500">Manage candidates</p>
                </div>
                <ChevronRightIcon class="h-4 w-4 text-gray-400 ml-auto group-hover:text-green-500" />
              </router-link>
            </div>
          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  BarChart3Icon,
  BellIcon,
  UserIcon,
  UsersIcon,
  StarIcon,
  CalendarIcon,
  BriefcaseIcon,
  ActivityIcon,
  ZapIcon,
  UploadCloudIcon,
  ChevronRightIcon,
  TrophyIcon,
  MailIcon,
  CheckCircleIcon,
  FileTextIcon
} from 'lucide-vue-next'

const stats = ref({
  totalCandidates: 247,
  shortlisted: 32,
  interviews: 18,
  activeJobs: 12
})

const recentActivities = ref([
  {
    id: 1,
    title: 'New candidate applied',
    description: 'Sarah Johnson applied for Senior React Developer',
    time: '2 min ago',
    icon: UserIcon,
    iconBg: 'bg-gradient-to-r from-blue-500 to-indigo-500'
  },
  {
    id: 2,
    title: 'Interview scheduled',
    description: 'Michael Chen - Frontend Engineer interview at 2:00 PM',
    time: '15 min ago',
    icon: CalendarIcon,
    iconBg: 'bg-gradient-to-r from-green-500 to-emerald-500'
  },
  {
    id: 3,
    title: 'Resume analyzed',
    description: '5 new resumes processed for Data Scientist position',
    time: '1 hour ago',
    icon: FileTextIcon,
    iconBg: 'bg-gradient-to-r from-purple-500 to-pink-500'
  },
  {
    id: 4,
    title: 'Email sent',
    description: 'Interview invitation sent to 3 candidates',
    time: '2 hours ago',
    icon: MailIcon,
    iconBg: 'bg-gradient-to-r from-orange-500 to-red-500'
  },
  {
    id: 5,
    title: 'Candidate shortlisted',
    description: 'Emily Rodriguez added to shortlist',
    time: '3 hours ago',
    icon: CheckCircleIcon,
    iconBg: 'bg-gradient-to-r from-green-500 to-emerald-500'
  }
])

const topCandidates = ref([
  { id: 1, name: 'Sarah Johnson', position: 'Senior React Developer', score: 92 },
  { id: 2, name: 'Michael Chen', position: 'Frontend Engineer', score: 87 },
  { id: 3, name: 'Emily Rodriguez', position: 'Full Stack Developer', score: 78 },
  { id: 4, name: 'David Kim', position: 'UI/UX Developer', score: 65 },
  { id: 5, name: 'Lisa Wang', position: 'Software Engineer', score: 58 }
])

const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>