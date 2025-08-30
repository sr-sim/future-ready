<script setup>
import { ref, computed } from 'vue'
import { HomeIcon, UploadCloudIcon, BarChart3Icon, StarIcon } from 'lucide-vue-next'

// Sidebar state
const sidebarOpen = ref(true)

// Fake: get role (in real app, you’d fetch from auth store or localStorage)
const role = ref(localStorage.getItem("role") || "jobseeker")

// Define menus
const menus = {
  jobseeker: [
    { name: "Home", to: "/jshome", icon: HomeIcon },
    { name: "Resume", to: "/resume", icon: StarIcon },
    { name: "AI Resume Matching", to: "/jobmatch", icon: BarChart3Icon },
    { name: "Matching Result", to: "/matchedresult", icon: BarChart3Icon },
    { name: "Onboarding Training", to: "/onboarding", icon: UploadCloudIcon },
  ],
  company: [
    { name: "Home", to: "/hrhome", icon: HomeIcon },
    { name: "Post a Job", to: "/upload", icon: UploadCloudIcon },
    { name: "AI matching", to: "/ranking", icon: UploadCloudIcon },
    { name: "Shortlist", to: "/shortlist", icon: StarIcon },
  ]
}

// Pick correct menu
const currentMenu = computed(() => menus[role.value] || [])
</script>

<template>
  <div id="app" class="font-sans flex flex-col min-h-screen">
    <div class="flex flex-1">
      <!-- Sidebar -->
      <aside
        v-if="$route.path !== '/'"
        class="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white flex flex-col shadow-lg z-40 transition-transform duration-300"
        :class="{
          '-translate-x-full': !sidebarOpen,
          'translate-x-0': sidebarOpen
        }"
      >
        <div class="p-4 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-blue-400">KLMMS Hub</h2>
            <p class="text-sm text-gray-400">Talent Automation</p>
          </div>
          <button
            class="text-gray-400 hover:text-white"
            @click="sidebarOpen = false"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>

        <!-- Dynamic menu -->
        <nav class="flex-1 p-4 space-y-2">
          <router-link
            v-for="item in currentMenu"
            :key="item.to"
            :to="item.to"
            @click="sidebarOpen = false"
            class="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            active-class="bg-blue-600 text-white"
          >
            <component :is="item.icon" class="h-5 w-5 mr-3" />
            {{ item.name }}
          </router-link>
        </nav>
        <!-- Logout -->
        <div class="p-4 border-t border-gray-700">
          <button
            @click="logout"
            class="w-full flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V7"/>
            </svg>
            Logout
          </button>
        </div>

        <div class="p-4 border-t border-gray-700 text-sm text-gray-400">
          <p>&copy; 2025 Talent Automation</p>
        </div>
      </aside>

      <!-- Sidebar open button -->
      <button
        class="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 bg-opacity-70 text-gray-200 shadow-md hover:bg-opacity-90 hover:bg-gray-900"
        @click="sidebarOpen = true"
        v-if="!sidebarOpen"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <div
        class="main-content flex-1 transition-all duration-300"
        :class="{
          'pl-64': sidebarOpen && $route.path !== '/',
          'pl-0': !sidebarOpen || $route.path === '/'
        }"
      >
        <router-view />
      </div>
    </div>
  </div>
</template>
