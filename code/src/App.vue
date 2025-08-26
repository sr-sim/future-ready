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
          <!-- Close button -->
          <button
           v-if="$route.path !== '/'"
            class="text-gray-400 hover:text-white"
            @click="sidebarOpen = false"
            aria-label="Close sidebar"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"/> <!-- hamburger for close -->
            </svg>
          </button>
        </div>
        <nav class="flex-1 p-4 space-y-2">
          <router-link
            to="/dashboard"
            @click="sidebarOpen = false"
            class="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            active-class="bg-blue-600 text-white"
          >
            <HomeIcon class="h-5 w-5 mr-3" />
            Dashboard 
          </router-link>
          <router-link
            to="/upload"
            @click="sidebarOpen = false"
            class="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            active-class="bg-blue-600 text-white"
          >
            <UploadCloudIcon class="h-5 w-5 mr-3" />
            Job & Resumes
          </router-link>
          <router-link
            to="/ranking"
            @click="sidebarOpen = false"
            class="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            active-class="bg-blue-600 text-white"
          >
            <BarChart3Icon class="h-5 w-5 mr-3" />
            Resume Analysis
          </router-link>
          <router-link
            to="/shortlist"
            @click="sidebarOpen = false"
            class="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            active-class="bg-blue-600 text-white"
          >
            <StarIcon class="h-5 w-5 mr-3" />
            Shortlist
          </router-link>
          <router-link
            to="/resume"
            @click="sidebarOpen = false"
            class="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            active-class="bg-blue-600 text-white"
          >
            <StarIcon class="h-5 w-5 mr-3" />
            Resume
          </router-link>
        </nav>
        <div class="p-4 border-t border-gray-700 text-sm text-gray-400">
          <p>&copy; 2025 Talent Automation</p>
        </div>
      </aside>
      <!-- Sidebar open button (hamburger) -->
      <button
        class="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 bg-opacity-70 text-gray-200 shadow-md hover:bg-opacity-90 hover:bg-gray-900"
        @click="sidebarOpen = true"
        aria-label="Open sidebar"
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

<script setup>
import { ref } from 'vue'
import { HomeIcon, UploadCloudIcon, BarChart3Icon, StarIcon } from 'lucide-vue-next';

const sidebarOpen = ref(true)
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content {
  min-height: 100vh;
  overflow-y: auto;
  transition: padding-left 0.3s;
}
</style>