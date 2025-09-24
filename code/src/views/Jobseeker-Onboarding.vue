<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header with Navigation -->
    <header class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
              <GraduationCapIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Employee Onboarding</h1>
              <p class="text-sm text-gray-500">Welcome to {{ companyName }}</p>
            </div>
          </div>
          
          <!-- Navigation Menu -->
          <nav class="hidden md:flex items-center space-x-8">
            <div class="relative" @mouseenter="openDropdown('onboarding')" @mouseleave="closeDropdown">
              <button
                @click="toggleDropdown('onboarding')"
                :class="[
                  'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeMenu === 'onboarding' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
                ]"
              >
                <BookOpenIcon class="h-4 w-4 mr-2" />
                Onboarding
                <ChevronDownIcon class="h-4 w-4 ml-1" />
              </button>
              
              <!-- Onboarding Dropdown -->
              <div
              @mouseenter="openDropdown('onboarding')" @mouseleave="closeDropdown"
                v-if="dropdownOpen === 'onboarding'"
                class="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
              >
                <button
                  @click="setActiveSection('overview')"
                  :class="[
                    'w-full text-left px-4 py-2 text-sm transition-colors flex items-center',
                    activeSection === 'overview' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <HomeIcon class="h-4 w-4 mr-3" />
                  Overview
                </button>
                <button
                  @click="setActiveSection('documents')"
                  :class="[
                    'w-full text-left px-4 py-2 text-sm transition-colors flex items-center',
                    activeSection === 'documents' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <FileTextIcon class="h-4 w-4 mr-3" />
                  Document Search & Analysis
                </button>
                <button
                  @click="setActiveSection('chatbot')"
                  :class="[
                    'w-full text-left px-4 py-2 text-sm transition-colors flex items-center',
                    activeSection === 'chatbot' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <MessageCircleIcon class="h-4 w-4 mr-3" />
                  AI Assistant
                </button>
                <button
                  @click="setActiveSection('progress')"
                  :class="[
                    'w-full text-left px-4 py-2 text-sm transition-colors flex items-center',
                    activeSection === 'progress' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <TrendingUpIcon class="h-4 w-4 mr-3" />
                  Progress Tracking
                </button>
              </div>
            </div>
            
            <button class="text-gray-700 hover:text-blue-700 font-medium text-sm transition-colors">
              Help & Support
            </button>
          </nav>

          <!-- User Profile -->
          <div class="flex items-center space-x-4">
            <button class="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <BellIcon class="h-6 w-6" />
              <span class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">2</span>
            </button>
            <div class="flex items-center space-x-2">
              <div class="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-semibold">{{ userInitials }}</span>
              </div>
              <span class="text-gray-700 font-medium">{{ userName }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Overview Section -->
      <div v-if="activeSection === 'overview'">
        <!-- Welcome Banner -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-3xl font-bold mb-2">Welcome to {{ companyName }}!</h2>
              <p class="text-blue-100 text-lg mb-4">Let's get you started with your onboarding journey</p>
              <div class="flex items-center space-x-4">
                <div class="bg-white/20 rounded-lg px-4 py-2">
                  <span class="text-sm font-medium">Progress: {{ overallProgress }}%</span>
                </div>
                <div class="bg-white/20 rounded-lg px-4 py-2">
                  <span class="text-sm font-medium">{{ completedTasks }}/{{ totalTasks }} Tasks</span>
                </div>
              </div>
            </div>
            <div class="hidden lg:block">
              <div class="h-32 w-32 bg-white/20 rounded-full flex items-center justify-center">
                <GraduationCapIcon class="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            @click="setActiveSection('documents')"
            class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 text-left group"
          >
            <div class="flex items-center mb-4">
              <div class="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                <SearchIcon class="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 class="font-bold text-gray-900">Document Library</h3>
                <p class="text-sm text-gray-600">{{ companyDocuments.length }} documents available</p>
              </div>
            </div>
            <p class="text-sm text-gray-700">Browse and search through company documents with AI-powered summaries</p>
          </button>

          <button
            @click="setActiveSection('chatbot')"
            class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 text-left group"
          >
            <div class="flex items-center mb-4">
              <div class="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                <BotIcon class="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 class="font-bold text-gray-900">AI Assistant</h3>
                <p class="text-sm text-gray-600">Get instant answers</p>
              </div>
            </div>
            <p class="text-sm text-gray-700">Chat with our AI assistant for questions about company policies and procedures</p>
          </button>

          <button
            @click="setActiveSection('progress')"
            class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 text-left group"
          >
            <div class="flex items-center mb-4">
              <div class="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-orange-200 transition-colors">
                <TrendingUpIcon class="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 class="font-bold text-gray-900">Track Progress</h3>
                <p class="text-sm text-gray-600">Monitor your onboarding</p>
              </div>
            </div>
            <p class="text-sm text-gray-700">View your onboarding progress and upcoming tasks</p>
          </button>
        </div>

        <!-- Onboarding Tasks -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
            <div class="flex items-center text-white">
              <CheckCircleIcon class="h-6 w-6 mr-3" />
              <h3 class="text-xl font-bold">Onboarding Checklist</h3>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="task in onboardingTasks"
                :key="task.id"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200"
              >
                <div class="flex items-center">
                  <div
                    :class="[
                      'h-6 w-6 rounded-full flex items-center justify-center mr-4',
                      task.completed ? 'bg-green-500' : 'bg-gray-300'
                    ]"
                  >
                    <CheckIcon v-if="task.completed" class="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">{{ task.title }}</h4>
                    <p class="text-sm text-gray-600">{{ task.description }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      task.completed 
                        ? 'bg-green-100 text-green-800' 
                        : task.priority === 'high' 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    ]"
                  >
                    {{ task.completed ? 'Completed' : task.priority === 'high' ? 'High Priority' : 'Medium Priority' }}
                  </span>
                  <button
                    v-if="!task.completed"
                    @click="completeTask(task.id)"
                    class="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Document Library Section -->
      <div v-if="activeSection === 'documents'">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Document Library & Search -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Document Library Header -->
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                <div class="flex items-center justify-between text-white">
                  <div class="flex items-center">
                    <FolderIcon class="h-6 w-6 mr-3" />
                    <div>
                      <h3 class="text-xl font-bold">Company Document Library</h3>
                      <p class="text-purple-100 text-sm">{{ companyDocuments.length }} documents uploaded by HR</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl font-bold">{{ analyzedDocuments }}</div>
                    <div class="text-purple-200 text-sm">Analyzed</div>
                  </div>
                </div>
              </div>
              
              <!-- Document Grid -->
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="document in companyDocuments"
                    :key="document.id"
                    class="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    @click="selectDocument(document)"
                  >
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex items-center">
                        <div 
                          :class="[
                            'h-12 w-12 rounded-lg flex items-center justify-center mr-3',
                            getDocumentTypeColor(document.file_type)
                          ]"
                        >
                          <FileTextIcon class="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{{ document.title }}</h4>
                          <p class="text-sm text-gray-600">{{ document.category }}</p>
                          <p class="text-xs text-gray-500">{{ formatFileSize(document.file_size) }} • {{ document.file_type }}</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <span
                          :class="[
                            'px-2 py-1 rounded-full text-xs font-medium',
                            document.is_analyzed 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          ]"
                        >
                          {{ document.is_analyzed ? 'Analyzed' : 'Pending' }}
                        </span>
                      </div>
                    </div>
                    
                    <div class="mb-3">
                      <p class="text-sm text-gray-700">{{ document.description }}</p>
                    </div>
                    
                    <div class="flex items-center justify-between text-xs text-gray-500">
                      <span>{{ formatFileSize(document.file_size) }} • {{ document.file_type }}</span>
                      <span>Uploaded {{ formatDate(document.created_at) }}</span>
                    </div>
                    
                    <div class="mt-3 flex items-center space-x-2">
                      <button
                        @click.stop="viewDocument(document)"
                        class="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <EyeIcon class="h-4 w-4 inline mr-1" />
                        View
                      </button>
                      <button
                        @click.stop="viewSummary(document)"
                        :disabled="!document.is_analyzed"
                        class="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SparklesIcon class="h-4 w-4 inline mr-1" />
                        Summary
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Search & Results -->

          </div>

          <!-- Document Summary Sidebar -->
          <div class="space-y-6">
            <!-- AI Summary -->
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <div class="flex items-center text-white">
                  <SparklesIcon class="h-6 w-6 mr-3" />
                  <h3 class="text-lg font-bold">AI Summary</h3>
                </div>
              </div>
              <div class="p-6">
                <div v-if="selectedDocumentSummary" class="space-y-4">
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-2">{{ selectedDocumentSummary.title }}</h4>
                    <p class="text-sm text-gray-600 mb-3">Generated by Xenova/distilbart-cnn-12-6</p>
                  </div>
                  <div class="bg-green-50 border border-green-200 rounded-lg p-4 h-48 overflow-y-auto">
                    <p class="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{{ selectedDocumentSummary.content }}</p>
                  </div>
                  
                </div>
                <div v-else class="text-center py-8">
                  <div class="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileTextIcon class="h-6 w-6 text-green-600" />
                  </div>
                  <p class="text-gray-600 text-sm">Select a document to view AI-generated summary</p>
                </div>
              </div>
            </div>



            <!-- Quick Actions -->
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                <div class="flex items-center text-white">
                  <ZapIcon class="h-6 w-6 mr-3" />
                  <h3 class="text-lg font-bold">Quick Actions</h3>
                </div>
              </div>
              <div class="p-6 space-y-3">
                <button
                  @click="setActiveSection('chatbot')"
                  class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center"
                >
                  <MessageCircleIcon class="h-5 w-5 mr-2" />
                  Ask AI Assistant
                </button>
                <button
                  @click="exportSummary"
                  :disabled="!selectedDocumentSummary"
                  class="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <DownloadIcon class="h-5 w-5 mr-2" />
                  Export Summary
                </button>
                <button
                  @click="bookmarkDocument"
                  :disabled="!selectedDocumentSummary"
                  class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BookmarkIcon class="h-5 w-5 mr-2" />
                  Bookmark
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Chatbot Section -->
      <div v-if="activeSection === 'chatbot'" class="max-w-4xl mx-auto">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden h-[600px] flex flex-col">
          <!-- Chat Header -->
          <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
            <div class="flex items-center justify-between text-white">
              <div class="flex items-center">
                <BotIcon class="h-6 w-6 mr-3" />
                                  <div>
                    <h3 class="text-xl font-bold">AI Assistant</h3>
                    <p class="text-green-100 text-sm">Powered by AI Model</p>
                  </div>
              </div>
              <div class="flex items-center space-x-2">
                <span class="bg-green-500 h-2 w-2 rounded-full"></span>
                <span class="text-sm">Online</span>
              </div>
            </div>
          </div>

          <!-- Prompt Suggestions -->
          <div class="px-6 pt-4">
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p class="text-xs font-semibold text-blue-800 mb-2">You can ask questions like:</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="p in suggestedPrompts"
                  :key="p"
                  @click="usePrompt(p)"
                  class="text-xs px-3 py-1 rounded-full bg-white text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  {{ p }}
                </button>
              </div>
            </div>
          </div>

          <!-- Chat Messages -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4" ref="chatContainer">
            <div
              v-for="message in chatMessages"
              :key="message.id"
              :class="[
                'flex',
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              ]"
            >
              <div
                :class="[
                  'max-w-xs lg:max-w-md px-4 py-2 rounded-2xl',
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.isError
                    ? 'bg-red-100 text-red-900 border border-red-200'
                    : message.isInfo
                    ? 'bg-blue-100 text-blue-900 border border-blue-200'
                    : 'bg-gray-100 text-gray-900'
                ]"
              >
                <div v-if="message.sender === 'bot'" class="flex items-start space-x-2">
                  <div 
                    :class="[
                      'h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1',
                      message.isError ? 'bg-red-200' : message.isInfo ? 'bg-blue-200' : 'bg-green-100'
                    ]"
                  >
                    <BotIcon 
                      :class="[
                        'h-4 w-4',
                        message.isError ? 'text-red-600' : message.isInfo ? 'text-blue-600' : 'text-green-600'
                      ]" 
                    />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm">{{ message.content }}</p>
                    
                    
                    
                    
                    
                    <p class="text-xs text-gray-500 mt-2">{{ message.timestamp }}</p>
                  </div>
                </div>
                <div v-else>
                  <p class="text-sm">{{ message.content }}</p>
                  <p class="text-xs text-blue-200 mt-1">{{ message.timestamp }}</p>
                </div>
              </div>
            </div>

            <!-- Typing Indicator -->
            <div v-if="isTyping" class="flex justify-start">
              <div class="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-2xl">
                <div class="flex items-center space-x-2">
                  <div class="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                    <BotIcon class="h-4 w-4 text-green-600" />
                  </div>
                  <div class="flex space-x-1">
                    <div class="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat Input -->
          <div class="border-t border-gray-200 p-4">
            <div class="flex items-center space-x-4">
              <div class="flex-1 relative">
                <input
                  v-model="chatInput"
                  @keyup.enter="sendMessage"
                  type="text"
                  placeholder="Ask me anything about your company documents..."
                  class="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <button
                  @click="sendMessage"
                  :disabled="!chatInput.trim() || isTyping"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <SendIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
            <div class="flex items-center justify-end mt-2">
              <p class="text-xs text-gray-500">Press Enter to send</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Tracking Section -->
      <div v-if="activeSection === 'progress'">
        <div class="space-y-8">
          <!-- Progress Overview -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-3xl font-bold mb-2">Onboarding Progress</h2>
                <p class="text-blue-100 text-lg">{{ completedTasks }} of {{ totalTasks }} tasks completed</p>
              </div>
              <div class="text-right">
                <div class="text-4xl font-bold">{{ overallProgress }}%</div>
                <div class="text-blue-200">Complete</div>
              </div>
            </div>
            <div class="mt-6">
              <div class="w-full bg-blue-500/30 rounded-full h-3">
                <div 
                  class="bg-white h-3 rounded-full transition-all duration-500"
                  :style="{ width: `${overallProgress}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Detailed Progress -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Task Categories -->
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <div class="flex items-center text-white">
                  <ListIcon class="h-6 w-6 mr-3" />
                  <h3 class="text-xl font-bold">Task Categories</h3>
                </div>
              </div>
              <div class="p-6 space-y-4">
                <div
                  v-for="category in taskCategories"
                  :key="category.name"
                  class="border border-gray-200 rounded-xl p-4"
                >
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="font-semibold text-gray-900">{{ category.name }}</h4>
                    <span class="text-sm text-gray-600">{{ category.completed }}/{{ category.total }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      :class="[
                        'h-2 rounded-full transition-all duration-500',
                        category.color
                      ]"
                      :style="{ width: `${(category.completed / category.total) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Timeline -->
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                <div class="flex items-center text-white">
                  <ClockIcon class="h-6 w-6 mr-3" />
                  <h3 class="text-xl font-bold">Timeline</h3>
                </div>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div
                    v-for="event in timelineEvents"
                    :key="event.id"
                    class="flex items-start space-x-4"
                  >
                    <div
                      :class="[
                        'h-3 w-3 rounded-full mt-2 flex-shrink-0',
                        event.completed ? 'bg-green-500' : 'bg-gray-300'
                      ]"
                    ></div>
                    <div class="flex-1">
                      <h5 class="font-medium text-gray-900">{{ event.title }}</h5>
                      <p class="text-sm text-gray-600">{{ event.description }}</p>
                      <p class="text-xs text-gray-500 mt-1">{{ event.date }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Access Restriction Modal -->
  <div v-if="showAccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl p-6 max-w-lg mx-4">
      <h3 class="text-lg font-bold text-gray-900 mb-3">Access Restricted</h3>
      <p class="text-gray-700 text-sm whitespace-pre-line">
        Sorry, this feature is only available after you have been enrolled to a company. As per checking, currently you are not being enrolled in any company. Please contact the admin if there is any error.
        \nadmin@klmms.com
      </p>
      <div class="mt-4 flex justify-end">
        <button @click="showAccessModal = false" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">OK</button>
      </div>
    </div>
  </div>
  <!-- Document Viewer Modal -->
  <div v-if="showDocumentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-5/6 flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center">
          <div 
            :class="[
              'h-10 w-10 rounded-lg flex items-center justify-center mr-3',
              getDocumentTypeColor(selectedDocument?.file_type)
            ]"
          >
            <FileTextIcon class="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">{{ selectedDocument?.title }}</h2>
            <p class="text-sm text-gray-600">{{ selectedDocument?.category }}</p>
          </div>
        </div>
        <button 
          @click="closeDocumentModal" 
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XIcon class="h-6 w-6" />
        </button>
      </div>
      
      <!-- Modal Content -->
      <div class="flex-1 p-6 overflow-hidden">
        <div v-if="selectedDocument?.file_url" class="h-full">
          <!-- PDF Viewer -->
          <iframe 
            v-if="selectedDocument.file_type === '.pdf'"
            :src="selectedDocument.file_url"
            class="w-full h-full border-0 rounded-lg"
            title="Document Viewer"
          ></iframe>

          <!-- DOCX Viewer via server-side HTML preview -->
          <iframe
            v-else-if="selectedDocument.file_type === '.docx'"
            :src="getDocxPreviewUrl(selectedDocument)"
            class="w-full h-full border-0 rounded-lg bg-white"
            title="Document Viewer"
          ></iframe>
          
          <!-- Image Viewer -->
          <div v-else-if="['.jpg', '.jpeg', '.png'].includes(selectedDocument.file_type)" class="h-full flex items-center justify-center">
            <img 
              :src="selectedDocument.file_url" 
              :alt="selectedDocument.title"
              class="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
          
          <!-- Other file types - show download link -->
          <div v-else class="h-full flex items-center justify-center">
            <div class="text-center">
              <FileTextIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Document Preview Not Available</h3>
              <p class="text-gray-600 mb-4">This file type cannot be previewed in the browser.</p>
              <a 
                :href="selectedDocument.file_url" 
                target="_blank"
                class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Download Document
              </a>
            </div>
          </div>
        </div>
        
        <div v-else class="h-full flex items-center justify-center">
          <div class="text-center">
            <FileTextIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Document Not Available</h3>
            <p class="text-gray-600">The document file could not be loaded.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ensureJobSeekerSession } from '../services/session'
import { supabase } from '../lib/supabase'
import { DocumentService } from '../services/documentService'
import EnhancedDocumentService from '../services/enhancedDocumentService.js'
import {
  GraduationCapIcon,
  BookOpenIcon,
  ChevronDownIcon,
  HomeIcon,
  FileTextIcon,
  MessageCircleIcon,
  TrendingUpIcon,
  BellIcon,
  SearchIcon,
  BotIcon,
  CheckCircleIcon,
  CheckIcon,
  FolderIcon,
  SparklesIcon,
  ZapIcon,
  DownloadIcon,
  BookmarkIcon,
  SendIcon,
  ListIcon,
  ClockIcon,
  EyeIcon,
  InfoIcon,
  XIcon
} from 'lucide-vue-next'

// User and company data
const userName = ref('')
const userInitials = computed(() => {
  if (!userName.value) return ''
  return userName.value.split(' ').map(n => n[0]).join('')
})
const companyName = ref('TechCorp Solutions')
const router = useRouter()
const isAssignedToCompany = ref(false)
const showAccessModal = ref(false)

// Navigation state
const activeMenu = ref('onboarding')
const activeSection = ref('overview')
const dropdownOpen = ref(null)

// Progress data
const completedTasks = ref(8)
const totalTasks = ref(12)
const overallProgress = computed(() => Math.round((completedTasks.value / totalTasks.value) * 100))

// Company documents (will be loaded from database)
const companyDocuments = ref([])
const isLoadingDocuments = ref(false)
const documentError = ref('')

// Document viewer modal
const showDocumentModal = ref(false)
const selectedDocument = ref(null)

const analyzedDocuments = computed(() => 
  companyDocuments.value.filter(doc => doc.is_analyzed).length
)

// Document categories
const documentCategories = ref([
  { name: 'HR Policies', count: 2, color: 'bg-blue-500' },
  { name: 'Benefits', count: 1, color: 'bg-green-500' },
  { name: 'IT & Security', count: 1, color: 'bg-red-500' },
  { name: 'Compliance', count: 1, color: 'bg-purple-500' },
  { name: 'Safety', count: 1, color: 'bg-orange-500' }
])

// Search state
const searchQuery = ref('')
const isSearching = ref(false)
const hasSearched = ref(false)
const searchResults = ref([
  {
    id: 1,
    title: 'Remote Work Policy',
    document: 'Employee Handbook.pdf',
    excerpt: 'Employees may work remotely up to 3 days per week with manager approval. Remote work arrangements must be documented and reviewed quarterly.',
    page: 15,
    relevance: 95,
    documentId: 1
  },
  {
    id: 2,
    title: 'Vacation Time Accrual',
    document: 'Employee Handbook.pdf',
    excerpt: 'Full-time employees accrue vacation time at a rate of 1.25 days per month during their first year of employment.',
    page: 8,
    relevance: 88,
    documentId: 1
  }
])

// Selected document summary
const selectedDocumentSummary = ref(null)

// Document summaries (generated by Flan-T5-Base)
const documentSummaries = {
  1: {
    title: 'Employee Handbook Summary',
    content: 'This comprehensive employee handbook covers company policies, procedures, and guidelines for all staff members. Key areas include remote work policies, vacation accrual, performance reviews, and professional development opportunities. The document emphasizes the company\'s commitment to work-life balance and employee growth.',
    keyPoints: [
      'Remote work allowed up to 3 days per week with approval',
      'Vacation time accrues at 1.25 days per month for new employees',
      'Annual performance reviews conducted in Q4',
      'Professional development budget of $2,000 per employee',
      'Flexible working hours between 7 AM - 7 PM'
    ],
    confidence: 94
  },
  2: {
    title: 'IT Security Guidelines Summary',
    content: 'Comprehensive security protocols designed to protect company data and systems. Covers password requirements, multi-factor authentication, data handling procedures, and incident reporting. Emphasizes employee responsibility in maintaining security standards.',
    keyPoints: [
      'Passwords must be at least 12 characters with complexity requirements',
      'Multi-factor authentication required for all systems',
      'Data encryption mandatory for sensitive information',
      'Security incidents must be reported within 1 hour',
      'Regular security training required quarterly'
    ],
    confidence: 96
  },
  3: {
    title: 'Benefits Enrollment Guide Summary',
    content: 'Detailed overview of employee benefits including health insurance options, retirement plans, and additional perks. Provides enrollment deadlines, coverage details, and contact information for benefits administration.',
    keyPoints: [
      'Multiple health insurance plans available with company contribution',
      '401(k) plan with 6% company matching',
      'Dental and vision coverage included',
      'Life insurance provided at 2x annual salary',
      'Enrollment period: November 1-30 annually'
    ],
    confidence: 92
  }
}

// Chat state
const chatInput = ref('')
const isTyping = ref(false)
const chatContainer = ref(null)
const chatMessages = ref([
  {
    id: 1,
    sender: 'bot',
    content: 'Hello! I\'m your AI assistant. I can help you understand company policies, procedures, and answer questions about the documents uploaded by HR. I can read through your company documents and provide accurate answers based on the content. What would you like to know?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
])


// Suggested prompts for AI assistant
const suggestedPrompts = ref([
  'What is the remote work policy?',
  'How much vacation time do I get?',
  'Summarize the IT security guidelines',
  'Where can I find the onboarding checklist?',
  'What benefits are available to me?'
])

const usePrompt = (text) => {
  chatInput.value = text
  sendMessage()
}



// Onboarding tasks
const onboardingTasks = ref([
  {
    id: 1,
    title: 'Complete Profile Setup',
    description: 'Fill out your personal and professional information',
    completed: true,
    priority: 'high'
  },
  {
    id: 2,
    title: 'Read Employee Handbook',
    description: 'Review company policies and procedures',
    completed: true,
    priority: 'high'
  },
  {
    id: 3,
    title: 'IT Setup & Security Training',
    description: 'Complete security awareness training and set up accounts',
    completed: true,
    priority: 'high'
  },
  {
    id: 4,
    title: 'Meet Your Team',
    description: 'Schedule introductory meetings with team members',
    completed: true,
    priority: 'medium'
  },
  {
    id: 5,
    title: 'Benefits Enrollment',
    description: 'Choose your health insurance and retirement plans',
    completed: true,
    priority: 'high'
  },
  {
    id: 6,
    title: 'Department Orientation',
    description: 'Attend department-specific orientation session',
    completed: true,
    priority: 'medium'
  },
  {
    id: 7,
    title: 'Project Assignment',
    description: 'Receive your first project assignment and goals',
    completed: true,
    priority: 'high'
  },
  {
    id: 8,
    title: 'Workspace Setup',
    description: 'Set up your physical or remote workspace',
    completed: true,
    priority: 'medium'
  },
  {
    id: 9,
    title: 'Compliance Training',
    description: 'Complete required compliance and safety training',
    completed: false,
    priority: 'high'
  },
  {
    id: 10,
    title: 'Mentor Assignment',
    description: 'Meet with your assigned mentor for the first time',
    completed: false,
    priority: 'medium'
  },
  {
    id: 11,
    title: '30-Day Check-in',
    description: 'Schedule your 30-day progress review with manager',
    completed: false,
    priority: 'medium'
  },
  {
    id: 12,
    title: 'Feedback Survey',
    description: 'Complete onboarding experience feedback survey',
    completed: false,
    priority: 'medium'
  }
])

// Task categories for progress tracking
const taskCategories = ref([
  {
    name: 'Administrative',
    completed: 5,
    total: 6,
    color: 'bg-blue-500'
  },
  {
    name: 'Training',
    completed: 2,
    total: 3,
    color: 'bg-green-500'
  },
  {
    name: 'Social Integration',
    completed: 1,
    total: 2,
    color: 'bg-purple-500'
  },
  {
    name: 'Performance Setup',
    completed: 0,
    total: 1,
    color: 'bg-orange-500'
  }
])

// Timeline events
const timelineEvents = ref([
  {
    id: 1,
    title: 'First Day',
    description: 'Welcome meeting and initial setup',
    date: 'Day 1',
    completed: true
  },
  {
    id: 2,
    title: 'Week 1 Milestone',
    description: 'Complete basic training and documentation',
    date: 'Day 7',
    completed: true
  },
  {
    id: 3,
    title: '30-Day Review',
    description: 'Progress review with manager',
    date: 'Day 30',
    completed: false
  },
  {
    id: 4,
    title: '90-Day Evaluation',
    description: 'Comprehensive performance evaluation',
    date: 'Day 90',
    completed: false
  }
])

// Methods
const openDropdown = (menu) => {
  dropdownOpen.value = menu
  activeMenu.value = menu
}

const toggleDropdown = (menu) => {
  dropdownOpen.value = dropdownOpen.value === menu ? null : menu
  activeMenu.value = menu
}

const closeDropdown = () => {
  setTimeout(() => {
    dropdownOpen.value = null
  }, 200)
}

const setActiveSection = (section) => {
  if (!isAssignedToCompany.value) {
    showAccessModal.value = true
    dropdownOpen.value = null
    return
  }
  activeSection.value = section
  dropdownOpen.value = null
}



const selectDocument = async (document) => {
  try {
    selectedDocumentSummary.value = null
    if (!document.is_analyzed) {
      return
    }
    const { data, error } = await supabase
      .from('company_documents')
      .select('title, document_summary')
      .eq('id', document.id)
      .single()

    if (error) throw error

    const content = data?.document_summary || 'No summary available.'
    selectedDocumentSummary.value = {
      title: `${data?.title || document.title} Summary`,
      content
    }
  } catch (e) {
    console.error('Error fetching document summary:', e)
    selectedDocumentSummary.value = {
      title: `${document.title} Summary`,
      content: 'Failed to load summary. Please try again later.'
    }
  }
}

const viewDocument = (document) => {
  console.log('View document:', document.title)
  
  // Check if document has a file URL
  if (document.file_url) {
    selectedDocument.value = document
    showDocumentModal.value = true
  } else {
    alert('Document file not available')
  }
}

const viewSummary = async (document) => {
  await selectDocument(document)
}

const closeDocumentModal = () => {
  showDocumentModal.value = false
  selectedDocument.value = null
}

  selectedDocumentSummary.value = {
    title: document.title + ' Summary',
    content: 'The document covers key company policies, onboarding steps, and important guidelines for new employees.',
    keyPoints: [
      'Covers remote work and vacation policies',
      'Explains onboarding steps and timelines',
      'Highlights compliance and safety requirements',
      'Lists available employee benefits',
      'Provides contact info for HR support'
    ],
    confidence: 95
  }
  // Optionally scroll to the AI Summary sidebar
  nextTick(() => {
    const summarySidebar = document.querySelector('.bg-white.rounded-2xl.shadow-xl.border.border-gray-100.overflow-hidden')
    if (summarySidebar) {
      summarySidebar.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })

const searchDocuments = async () => {
  if (!searchQuery.value.trim()) return
  
  isSearching.value = true
  hasSearched.value = true
  
  // Simulate search
  setTimeout(() => {
    isSearching.value = false
    // searchResults already populated for demo
  }, 1500)
}

const filterByCategory = (categoryName) => {
  console.log('Filter by category:', categoryName)
  // Implement category filtering
}

// Build preview URL for DOCX via server endpoint
const getDocxPreviewUrl = (doc) => {
  if (!doc || !doc.id) return ''
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('supabaseUrl') || ''
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('supabaseKey') || ''
  const params = new URLSearchParams({
    supabaseUrl: supabaseUrl,
    supabaseKey: supabaseKey
  })
  return `/api/preview-docx/${doc.id}?${params.toString()}`
}

const sendMessage = async () => {
  if (!chatInput.value.trim() || isTyping.value) return
  
  const userMessage = {
    id: Date.now(),
    sender: 'user',
    content: chatInput.value,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  chatMessages.value.push(userMessage)
  const query = chatInput.value
  chatInput.value = ''
  
  // Scroll to bottom
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
  
  // Send to AI service
  isTyping.value = true
  
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (!currentUser.id) {
      throw new Error('User session not found')
    }
    
    // Get job seeker's company assignment
    const { data: jobSeekerProfile, error: profileError } = await supabase
      .from('job_seeker_profiles')
      .select('company_id, first_name, last_name')
      .eq('user_id', currentUser.id)
      .single()
    
    if (profileError || !jobSeekerProfile) {
      throw new Error('Job seeker profile not found')
    }
    
    if (!jobSeekerProfile.company_id) {
      const noCompanyMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        content: "I can't access company documents yet because you haven't been assigned to a company. Once you're hired and assigned to a company, I'll be able to help you with questions about company policies and documents.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isInfo: true
      }
      chatMessages.value.push(noCompanyMessage)
      return
    }
    
    // Get Supabase credentials
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('supabaseUrl')
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('supabaseKey')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not found')
    }
    
    // Send question to enhanced AI service
    const response = await EnhancedDocumentService.smartChat(
      query,
      jobSeekerProfile.company_id,
      currentUser.id,
      supabaseUrl,
      supabaseKey
    )
    
    const botMessage = {
      id: Date.now() + 1,
      sender: 'bot',
      content: response.answer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      
    }
    
    chatMessages.value.push(botMessage)
    
  } catch (error) {
    console.error('Error sending message:', error)
    const errorMessage = {
      id: Date.now() + 1,
      sender: 'bot',
      content: "I'm sorry, I couldn't process your question at the moment. Please make sure the document processing service is running and try again later.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isError: true
    }
    chatMessages.value.push(errorMessage)
  } finally {
    isTyping.value = false
    
    // Scroll to bottom
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    })
  }
}

const generateBotResponse = (query) => {
  const responses = {
    'remote work': 'Based on the Employee Handbook, you can work remotely up to 3 days per week with manager approval. Remote work arrangements must be documented and reviewed quarterly.',
    'vacation': 'According to company policy, full-time employees accrue vacation time at 1.25 days per month during their first year. This increases to 1.67 days per month after one year of service.',
    'security': 'Per the IT Security Guidelines, all employees must use passwords with at least 12 characters, enable multi-factor authentication, and report security incidents within 1 hour.',
    'benefits': 'The Benefits Enrollment Guide shows we offer multiple health insurance plans with company contribution, 401(k) with 6% matching, and dental/vision coverage. Enrollment is November 1-30.',
    'default': 'I can help you find information in the company documents uploaded by HR. Could you be more specific about what you\'re looking for? I have access to the Employee Handbook, IT Security Guidelines, Benefits Guide, and other company documents.'
  }
  
  const lowerQuery = query.toLowerCase()
  for (const [key, response] of Object.entries(responses)) {
    if (lowerQuery.includes(key)) {
      return response
    }
  }
  
  return responses.default
}

const completeTask = (taskId) => {
  const task = onboardingTasks.value.find(t => t.id === taskId)
  if (task) {
    task.completed = true
    completedTasks.value++
  }
}

const viewFullDocument = (documentId) => {
  console.log('View document:', documentId)
}

const exportSummary = () => {
  if (selectedDocumentSummary.value) {
    console.log('Export summary:', selectedDocumentSummary.value.title)
  }
}

const bookmarkDocument = () => {
  if (selectedDocumentSummary.value) {
    console.log('Bookmark document:', selectedDocumentSummary.value.title)
  }
}

// Load user profile data
const loadUserProfile = async () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    
    if (currentUser.id) {
      const { data: profile, error } = await supabase
        .from('job_seeker_profiles')
        .select('first_name, last_name')
        .eq('user_id', currentUser.id)
        .single()
      
      if (!error && profile) {
        userName.value = `${profile.first_name} ${profile.last_name}`.trim()
      }
    }
  } catch (error) {
    console.error('Error loading user profile:', error)
  }
}

// Load company documents
const loadCompanyDocuments = async () => {
  try {
    isLoadingDocuments.value = true
    documentError.value = ''
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (!currentUser.id) {
      throw new Error('User session not found')
    }
    
    // Get job seeker profile to find which company they belong to
    const { data: jobSeekerProfile, error: profileError } = await supabase
      .from('job_seeker_profiles')
      .select('company_id, first_name, last_name')
      .eq('user_id', currentUser.id)
      .single()
    
    if (profileError || !jobSeekerProfile) {
      throw new Error('Job seeker profile not found')
    }
    
    // Check if job seeker is assigned to a company
    if (!jobSeekerProfile.company_id) {
      isAssignedToCompany.value = false
      documentError.value = 'You are not yet assigned to a company. Please wait for your hiring confirmation.'
      companyDocuments.value = []
      return
    }
    isAssignedToCompany.value = true

    // Get company name for display
    const { data: companyProfile, error: companyError } = await supabase
      .from('company_profiles')
      .select('company_name')
      .eq('id', jobSeekerProfile.company_id)
      .single()
    
    if (companyError || !companyProfile) {
      throw new Error('Company profile not found')
    }
    
    // Update company name for display
    companyName.value = companyProfile.company_name
    
    // Fetch documents directly from the database
    const { data: documents, error: fetchError } = await supabase
      .from('company_documents')
      .select('*')
      .eq('company_id', jobSeekerProfile.company_id)
      .order('created_at', { ascending: false })
    
    if (fetchError) {
      throw new Error(`Failed to fetch documents: ${fetchError.message}`)
    }
    
    companyDocuments.value = documents || []
    
  } catch (error) {
    console.error('Error loading company documents:', error)
    documentError.value = error.message
    companyDocuments.value = []
  } finally {
    isLoadingDocuments.value = false
  }
}

// Helper functions
const formatFileSize = (bytes) => {
  if (!bytes) return 'Unknown size'
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getDocumentTypeColor = (type) => {
  // Handle file extensions (e.g., '.pdf', '.docx')
  const fileType = type ? type.replace('.', '').toUpperCase() : 'UNKNOWN'
  const colors = { 
    PDF: 'bg-red-500', 
    DOCX: 'bg-blue-500', 
    DOC: 'bg-blue-600',
    TXT: 'bg-gray-500',
    JPG: 'bg-green-500',
    JPEG: 'bg-green-500',
    PNG: 'bg-green-600'
  }
  return colors[fileType] || 'bg-gray-500'
}

// Load chat history for the user
const loadChatHistory = async () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (!currentUser.id) return
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('supabaseUrl')
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('supabaseKey')
    
    if (!supabaseUrl || !supabaseKey) return
    
    const history = await DocumentService.getChatHistory(currentUser.id, supabaseUrl, supabaseKey)
    
    if (history && history.history && history.history.length > 0) {
      // Convert history to chat messages format
      const historyMessages = history.history.map((item, index) => ({
        id: `history-${index}`,
        sender: 'user',
        content: item.question,
        timestamp: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
      
      const botMessages = history.history.map((item, index) => ({
        id: `history-bot-${index}`,
        sender: 'bot',
        content: item.answer,
        timestamp: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: item.confidence_score,
        sources: item.source_documents,
        hasSources: item.source_documents && item.source_documents.length > 0
      }))
      
      // Interleave user and bot messages
      const allMessages = []
      for (let i = 0; i < Math.max(historyMessages.length, botMessages.length); i++) {
        if (historyMessages[i]) allMessages.push(historyMessages[i])
        if (botMessages[i]) allMessages.push(botMessages[i])
      }
      
      // Add to existing messages (after the welcome message)
      chatMessages.value.push(...allMessages)
    }
  } catch (error) {
    console.error('Error loading chat history:', error)
  }
}

// Load user profile when component mounts
onMounted(async () => {
  try { await ensureJobSeekerSession() } catch (e) { return }
  await loadUserProfile()
  await loadCompanyDocuments()
  if (!isAssignedToCompany.value) {
    showAccessModal.value = true
    // optionally redirect away from onboarding after showing modal briefly
    // setTimeout(() => router.push('/jshome'), 2000)
    return
  }
  await loadChatHistory()
})
</script>

<style scoped>
.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
  }
  40%, 43% {
    transform: translateY(-8px);
  }
  70% {
    transform: translateY(-4px);
  }
  90% {
    transform: translateY(-2px);
  }
}

/* Custom scrollbar for chat */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
