<template>
  <div id="app" class="font-sans flex flex-col min-h-screen">
    <div class="flex flex-1">
      <aside class="w-64 bg-gray-800 text-white flex flex-col shadow-lg">
        <div class="p-4 border-b border-gray-700">
          <h2 class="text-2xl font-bold text-blue-400">HR Hub</h2>
          <p class="text-sm text-gray-400">Talent Automation</p>
        </div>
        <nav class="flex-1 p-4 space-y-2">
          <router-link
            to="/dashboard"
            class="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            active-class="bg-blue-600 text-white"
          >
            <HomeIcon class="h-5 w-5 mr-3" />
            Dashboard 
          </router-link>
          <router-link
            to="/"
            class="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            active-class="bg-blue-600 text-white"
          >
            <UserIcon class="h-5 w-5 mr-3" />
            HR Login
          </router-link>
          <router-link
            to="/upload"
            class="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            active-class="bg-blue-600 text-white"
          >
            <UploadCloudIcon class="h-5 w-5 mr-3" />
            Job & Resumes
          </router-link>
          <router-link
            to="/ranking"
            class="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            active-class="bg-blue-600 text-white"
          >
            <BarChart3Icon class="h-5 w-5 mr-3" />
            Resume Analysis
          </router-link>
          <router-link
            to="/shortlist"
            class="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            active-class="bg-blue-600 text-white"
          >
            <StarIcon class="h-5 w-5 mr-3" />
            Shortlist
          </router-link>
        </nav>
        <div class="p-4 border-t border-gray-700 text-sm text-gray-400">
          <p>&copy; 2025 Talent Automation</p>
        </div>
      </aside>
      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>

  </div>
</template>

<script setup>
import { HomeIcon, UserIcon, UploadCloudIcon, BarChart3Icon, StarIcon } from 'lucide-vue-next';
</script>

<style>
/* You can put global styles here if needed */
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
</style>