<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-3">
              <BriefcaseIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Job Management</h1>
              <p class="text-sm text-gray-500">Post and manage your job listings</p>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex items-center space-x-4">
            <button
              @click="showCreateModal = true"
              class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-xl font-semibold transition-all flex items-center"
            >
              <PlusIcon class="h-5 w-5 mr-2" />
              Post New Job
            </button>
                      <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
              <div class="h-2 w-2 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-700">HR Manager</span>
            </div>
          </div>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Jobs</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalJobs }}</p>
            </div>
            <div class="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BriefcaseIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Jobs</p>
              <p class="text-2xl font-bold text-gray-900">{{ activeJobs }}</p>
            </div>
            <div class="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircleIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Applications</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalApplications }}</p>
            </div>
            <div class="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <UsersIcon class="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Avg. Match Score</p>
              <p class="text-2xl font-bold text-gray-900">{{ avgMatchScore }}%</p>
            </div>
            <div class="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUpIcon class="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div class="flex items-center text-white">
            <FilterIcon class="h-6 w-6 mr-3" />
            <h2 class="text-xl font-bold">Filter Jobs</h2>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                v-model="filters.status"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Department</label>
              <select
                v-model="filters.department"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
              <select
                v-model="filters.jobType"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <div class="relative">
                <input
                  v-model="searchQuery"
                  @input="applyFilters"
                  type="text"
                  placeholder="Search jobs..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Job Listings -->
      <div class="space-y-6">
        <div
          v-for="job in filteredJobs"
          :key="job.id"
          class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <div class="h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                  <BriefcaseIcon class="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">{{ job.title }}</h3>
                  <p class="text-gray-600">{{ job.department }} • {{ job.location }}</p>
                  <div class="flex items-center mt-1 text-sm text-gray-500">
                    <CalendarIcon class="h-4 w-4 mr-1" />
                    Posted {{ job.postedDate }}
                    <span class="mx-2">•</span>
                    <ClockIcon class="h-4 w-4 mr-1" />
                    {{ job.jobType }}
                  </div>
                </div>
              </div>
              <div class="text-right">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    getStatusColor(job.status)
                  ]"
                >
                  {{ job.status.charAt(0).toUpperCase() + job.status.slice(1) }}
                </span>
                <div class="mt-2 text-sm text-gray-600">
                  {{ job.applications }} applications
                </div>
              </div>
            </div>

            <!-- Job Details -->
            <div class="mb-4">
              <p class="text-gray-700 mb-3">{{ job.description }}</p>
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-600">
                  <span class="font-semibold">Salary:</span> {{ job.salary }}
                </div>
                <div class="text-sm text-gray-600">
                  <span class="font-semibold">Experience:</span> {{ job.experience }}
                </div>
              </div>
            </div>

            <!-- Required Skills -->
            <div class="mb-4">
              <h5 class="text-sm font-semibold text-gray-700 mb-2">Required Skills:</h5>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in job.requiredSkills"
                  :key="skill"
                  class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                >
                  {{ skill }}
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <div class="flex items-center space-x-4">
                <button 
                  @click="toggleApplicationsDropdown(job.id)"
                  class="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors flex items-center"
                >
                  <UsersIcon class="h-4 w-4 mr-1" />
                  View Applications ({{ job.applications }})
                  <ChevronDownIcon class="h-4 w-4 ml-1" :class="{ 'rotate-180': activeDropdowns.applications === job.id }" />
                </button>

                <button 
                  @click="toggleAIMatchDropdown(job.id)"
                  class="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors flex items-center"
                >
                  <TargetIcon class="h-4 w-4 mr-1" />
                  AI Matches
                  <ChevronDownIcon class="h-4 w-4 ml-1" :class="{ 'rotate-180': activeDropdowns.aiMatch === job.id }" />
                </button>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="duplicateJob(job)"
                  class="text-gray-600 hover:text-gray-700 font-medium text-sm transition-colors flex items-center px-3 py-1 hover:bg-gray-50 rounded-lg"
                >
                  <CopyIcon class="h-4 w-4 mr-1" />
                  Duplicate
                </button>
                <button
                  @click="editJob(job)"
                  class="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors flex items-center px-3 py-1 hover:bg-blue-50 rounded-lg"
                >
                  <EditIcon class="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  @click="confirmDeleteJob(job)"
                  class="text-red-600 hover:text-red-700 font-medium text-sm transition-colors flex items-center px-3 py-1 hover:bg-red-50 rounded-lg"
                >
                  <TrashIcon class="h-4 w-4 mr-1" />
                  Delete
                </button>
                <button
                  @click="toggleJobStatus(job)"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium text-sm transition-all',
                    job.status === 'active' 
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  ]"
                >
                  {{ job.status === 'active' ? 'Pause' : 'Activate' }}
                </button>
              </div>
            </div>

            <!-- Applications Dropdown -->
            <div
              v-if="activeDropdowns.applications === job.id"
              class="border-t border-gray-200 bg-gray-50 transition-all duration-300"
            >
              <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-semibold text-gray-900">Recent Applications</h4>
                  <span class="text-sm text-gray-500">{{ job.applications }} total</span>
                </div>
                <div class="space-y-3 max-h-64 overflow-y-auto">
                  <div
                    v-for="application in getJobApplications(job.id)"
                    :key="application.id"
                    class="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <div class="flex items-center">
                      <div class="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                        <span class="text-white text-xs font-semibold">{{ application.initials }}</span>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 text-sm">{{ application.name }}</p>
                        <p class="text-xs text-gray-500">{{ application.appliedDate }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-4 pt-3 border-t border-gray-200">
                  <button class="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2 hover:bg-blue-50 rounded-lg transition-colors">
                    View All Applications
                  </button>
                </div>
              </div>
            </div>

            <!-- AI Match Dropdown -->
            <div
              v-if="activeDropdowns.aiMatch === job.id"
              class="border-t border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 transition-all duration-300"
            >
              <div class="p-6">
                <!-- Initial State - Start Matching -->
                <div v-if="!aiMatchingState[job.id]" class="text-center">
                  <div class="h-16 w-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TargetIcon class="h-8 w-8 text-white" />
                  </div>
                  <h4 class="font-semibold text-gray-900 mb-2">AI Candidate Matching</h4>
                  <p class="text-sm text-gray-600 mb-4">Use AI to find the best candidates for this position</p>
                  <button
                    @click="startHRAIMatching(job.id)"
                    class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Start AI Matching
                  </button>
                </div>

                <!-- Matching Progress State -->
                <div v-else-if="aiMatchingState[job.id]?.phase === 'matching'" class="space-y-6">
                  <div class="text-center">
                    <div class="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div class="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
                    </div>
                    <h4 class="font-semibold text-gray-900 mb-2">{{ aiMatchingState[job.id]?.currentStep?.title }}</h4>
                    <p class="text-sm text-gray-600">{{ aiMatchingState[job.id]?.currentStep?.description }}</p>
                  </div>

                  <!-- Progress Steps -->
                  <div class="space-y-3">
                    <div 
                      v-for="(step, index) in aiMatchingState[job.id]?.steps" 
                      :key="index"
                      class="flex items-center"
                    >
                      <div 
                        :class="[
                          'h-6 w-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0',
                          step.completed ? 'bg-green-500' : step.active ? 'bg-purple-600' : 'bg-gray-300'
                        ]"
                      >
                        <CheckIcon v-if="step.completed" class="h-3 w-3 text-white" />
                        <div v-else-if="step.active" class="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                        <span v-else class="text-white text-xs">{{ index + 1 }}</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <h5 class="font-medium text-gray-900 text-sm">{{ step.title }}</h5>
                        <p class="text-xs text-gray-600 truncate">{{ step.description }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Progress Bar -->
                  <div>
                    <div class="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{{ aiMatchingState[job.id]?.progress }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                        :style="{ width: `${aiMatchingState[job.id]?.progress}%` }"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Completion State -->
                <div v-else-if="aiMatchingState[job.id]?.phase === 'complete'" class="text-center">
                  <div class="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon class="h-8 w-8 text-green-600" />
                  </div>
                  <h4 class="font-semibold text-gray-900 mb-2">Analysis Complete!</h4>
                  <p class="text-sm text-gray-600 mb-4">Found {{ aiMatchingState[job.id]?.results?.totalCandidates }} potential candidates</p>
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="bg-white rounded-lg p-3 text-center">
                      <div class="text-lg font-bold text-green-600">{{ aiMatchingState[job.id]?.results?.highMatches }}</div>
                      <div class="text-xs text-gray-600">High Matches</div>
                    </div>
                    <div class="bg-white rounded-lg p-3 text-center">
                      <div class="text-lg font-bold text-blue-600">{{ aiMatchingState[job.id]?.results?.avgScore }}%</div>
                      <div class="text-xs text-gray-600">Avg Score</div>
                    </div>
                  </div>
                  <button
                    @click="redirectToJobResults(job.id)"
                    class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    View Detailed Results
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <div class="flex items-center space-x-2">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon class="h-4 w-4" />
          </button>
          
          <span 
            v-for="page in visiblePages" 
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-2 rounded-lg cursor-pointer transition-colors',
              page === currentPage 
                ? 'bg-blue-600 text-white' 
                : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </span>
          
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRightIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Job Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
          <div class="flex items-center justify-between text-white">
            <div class="flex items-center">
              <PlusIcon class="h-6 w-6 mr-3" />
              <h2 class="text-xl font-bold">{{ editingJob ? 'Edit Job' : 'Post New Job' }}</h2>
            </div>
            <button
              @click="closeModal"
              class="text-white hover:text-gray-200 transition-colors"
            >
              <XIcon class="h-6 w-6" />
            </button>
          </div>
        </div>

        <form @submit.prevent="saveJob" class="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <!-- Updated form structure for new job posting requirements -->
          
          <!-- Job Title -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
            <input
              v-model="jobForm.title"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>

          <!-- Job Scope -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Job Scope *</label>
            <textarea
              v-model="jobForm.scope"
              required
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe the overall scope of this position, key responsibilities, and what the role entails..."
            ></textarea>
          </div>

          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Department *</label>
              <select
                v-model="jobForm.department"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
              <input
                v-model="jobForm.location"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g. San Francisco, CA or Remote"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Job Type *</label>
              <select
                v-model="jobForm.jobType"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Salary Range *</label>
              <input
                v-model="jobForm.salary"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g. RM8000 - RM12000"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Experience Level *</label>
              <select
                v-model="jobForm.experience"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select Experience</option>
                <option value="Entry Level">Entry Level (0-2 years)</option>
                <option value="Mid Level">Mid Level (3-5 years)</option>
                <option value="Senior Level">Senior Level (5+ years)</option>
                <option value="Executive">Executive (10+ years)</option>
              </select>
            </div>
          </div>

          <!-- Added Requirements with Scoring System -->
          <!-- Requirements with Scoring -->
          <div class="bg-gray-50 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Requirements & Scoring</h3>
              <button
                type="button"
                @click="addRequirement"
                class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center"
              >
                <PlusIcon class="h-4 w-4 mr-1" />
                Add Requirement
              </button>
            </div>
            <p class="text-sm text-gray-600 mb-4">Define the skills and qualifications needed for this role. Each requirement will be scored for resume matching.</p>
            
            <div class="space-y-4">
              <div
                v-for="(requirement, index) in jobForm.requirements"
                :key="index"
                class="bg-white rounded-lg p-4 border border-gray-200"
              >
                <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div class="md:col-span-5">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Skill/Qualification *</label>
                    <input
                      v-model="requirement.skill"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="e.g. JavaScript, React, Project Management"
                    />
                  </div>
                  <div class="md:col-span-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input
                      v-model="requirement.description"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Brief description or level required"
                    />
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Score Weight *</label>
                    <select
                      v-model="requirement.score"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">Score</option>
                      <option value="5">5 - Critical</option>
                      <option value="4">4 - Important</option>
                      <option value="3">3 - Moderate</option>
                      <option value="2">2 - Nice to have</option>
                      <option value="1">1 - Optional</option>
                    </select>
                  </div>
                  <div class="md:col-span-1 flex items-end">
                    <button
                      type="button"
                      @click="removeRequirement(index)"
                      class="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      :disabled="jobForm.requirements.length === 1"
                    >
                      <XIcon class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Score Display -->
            <div class="mt-4 p-3 bg-purple-50 rounded-lg">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-purple-700">Total Score Weight:</span>
                <span class="text-lg font-bold text-purple-800">{{ totalScore }} points</span>
              </div>
              <p class="text-xs text-purple-600 mt-1">This will be used for resume matching and candidate ranking</p>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSaving || !isFormValid"
              class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
            >
              {{ isSaving ? 'Saving...' : (editingJob ? 'Update Job' : 'Post Job') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl max-w-md w-full">
        <div class="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
          <div class="flex items-center text-white">
            <TrashIcon class="h-6 w-6 mr-3" />
            <h2 class="text-xl font-bold">Delete Job</h2>
          </div>
        </div>
        
        <div class="p-6">
          <p class="text-gray-700 mb-4">
            Are you sure you want to delete <strong>"{{ jobToDelete?.title }}"</strong>? 
            This action cannot be undone and will remove all associated applications.
          </p>
          
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div class="flex items-center">
              <AlertTriangleIcon class="h-5 w-5 text-red-600 mr-2" />
              <span class="text-red-800 font-medium">Warning</span>
            </div>
            <p class="text-red-700 text-sm mt-1">
              This will permanently delete {{ jobToDelete?.applications || 0 }} applications associated with this job.
            </p>
          </div>
          
          <div class="flex justify-end space-x-4">
            <button
              @click="cancelDelete"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              @click="deleteJob"
              :disabled="isDeleting"
              class="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all disabled:opacity-50"
            >
              {{ isDeleting ? 'Deleting...' : 'Delete Job' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  BriefcaseIcon,
  PlusIcon,
  CheckCircleIcon,
  UsersIcon,
  TrendingUpIcon,
  FilterIcon,
  SearchIcon,
  CalendarIcon,
  ClockIcon,
  TargetIcon,
  EditIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  StarIcon,
  CopyIcon,
  TrashIcon,
  AlertTriangleIcon,
  CheckIcon
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'

// User data
const userName = ref('John Smith')
const userInitials = computed(() => userName.value.split(' ').map(n => n[0]).join(''))

// Modal state
const showCreateModal = ref(false)
const editingJob = ref(null)
const isSaving = ref(false)

// Delete modal state
const showDeleteModal = ref(false)
const jobToDelete = ref(null)
const isDeleting = ref(false)

// Job form
const jobForm = ref({
  title: '',
  scope: '',
  department: '',
  location: '',
  jobType: '',
  salary: '',
  experience: '',
  requirements: [
    { skill: '', description: '', score: '' }
  ]
})

// Computed properties for form validation
const totalScore = computed(() => {
  return jobForm.value.requirements.reduce((sum, req) => {
    return sum + (parseInt(req.score) || 0)
  }, 0)
})

const isFormValid = computed(() => {
  return jobForm.value.title && 
         jobForm.value.scope && 
         jobForm.value.department && 
         jobForm.value.location && 
         jobForm.value.jobType && 
         jobForm.value.salary && 
         jobForm.value.experience &&
         jobForm.value.requirements.every(req => req.skill && req.score)
})

// Sample job data
const allJobs = ref([
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Puchong, Selangor',
    jobType: 'Full-time',
    salary: 'RM8000 - RM15000',
    experience: 'Senior Level',
    description: 'We are looking for a Senior Frontend Developer to join our innovative team building next-generation web applications.',
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js'],
    status: 'active',
    applications: 24,
    postedDate: '3 days ago'
  },
  {
    id: 2,
    title: 'Product Marketing Manager',
    department: 'Marketing',
    location: 'Johor Bahru, Johor',
    jobType: 'Full-time',
    salary: 'RM9000 - RM12000',
    experience: 'Mid Level',
    description: 'Join our marketing team to drive product adoption and create compelling marketing campaigns.',
    requiredSkills: ['Marketing Strategy', 'Analytics', 'Content Creation', 'SEO'],
    status: 'active',
    applications: 18,
    postedDate: '1 week ago'
  },
  {
    id: 3,
    title: 'Data Scientist',
    department: 'Engineering',
    location: 'Remote',
    jobType: 'Full-time',
    salary: 'RM11000 - RM14000',
    experience: 'Mid Level',
    description: 'Analyze complex data sets and build machine learning models to drive business insights.',
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'TensorFlow'],
    status: 'paused',
    applications: 31,
    postedDate: '2 weeks ago'
  },
  {
    id: 4,
    title: 'UX Designer',
    department: 'Engineering',
    location: 'Bukit Jalil, Kuala Lumpur',
    jobType: 'Contract',
    salary: 'RM7000 - RM9000',
    experience: 'Mid Level',
    description: 'Create intuitive and beautiful user experiences for our web and mobile applications.',
    requiredSkills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    status: 'active',
    applications: 12,
    postedDate: '5 days ago'
  },
  {
    id: 5,
    title: 'Sales Development Representative',
    department: 'Sales',
    location: 'Damansara, Selangor',
    jobType: 'Full-time',
    salary: 'RM5000 - RM7000',
    experience: 'Entry Level',
    description: 'Generate new business opportunities and qualify leads for our sales team.',
    requiredSkills: ['Sales', 'Communication', 'CRM', 'Lead Generation'],
    status: 'closed',
    applications: 45,
    postedDate: '1 month ago'
  }
])

// Dropdown state management
const activeDropdowns = ref({
  applications: null,
  aiMatch: null
})

// AI matching progress state
const aiMatchingProgress = ref({})

// Sample application data
const sampleApplications = ref({
  1: [
    { id: 1, name: 'Sarah Johnson', initials: 'SJ', appliedDate: '2 days ago', status: 'new' },
    { id: 2, name: 'Mike Chen', initials: 'MC', appliedDate: '3 days ago', status: 'reviewed' },
    { id: 3, name: 'Emily Davis', initials: 'ED', appliedDate: '1 week ago', status: 'interviewed' },
    { id: 4, name: 'Alex Rodriguez', initials: 'AR', appliedDate: '1 week ago', status: 'rejected' }
  ],
  2: [
    { id: 5, name: 'Jessica Wong', initials: 'JW', appliedDate: '1 day ago', status: 'new' },
    { id: 6, name: 'David Kim', initials: 'DK', appliedDate: '4 days ago', status: 'reviewed' },
    { id: 7, name: 'Lisa Thompson', initials: 'LT', appliedDate: '5 days ago', status: 'interviewed' }
  ]
})

// Sample AI match data
const sampleAIMatches = ref({
  1: [
    { id: 1, name: 'John Smith', initials: 'JS', experience: '5+ years React', score: 95 },
    { id: 2, name: 'Maria Garcia', initials: 'MG', experience: '4 years Frontend', score: 88 },
    { id: 3, name: 'Tom Wilson', initials: 'TW', experience: '6 years Full-stack', score: 82 },
    { id: 4, name: 'Anna Lee', initials: 'AL', experience: '3 years TypeScript', score: 76 }
  ],
  2: [
    { id: 5, name: 'Robert Brown', initials: 'RB', experience: '7 years Marketing', score: 92 },
    { id: 6, name: 'Sophie Miller', initials: 'SM', experience: '5 years Product Marketing', score: 85 },
    { id: 7, name: 'James Taylor', initials: 'JT', experience: '4 years Digital Marketing', score: 79 }
  ]
})

// AI matching progress state and steps for HR
const aiMatchingState = ref({})
const aiMatchingSteps = [
  {
    title: 'Analyzing Job Requirements',
    description: 'Processing job description, skills, and qualifications',
    completed: false,
    active: false
  },
  {
    title: 'Scanning Candidate Database',
    description: 'Searching through available candidate profiles',
    completed: false,
    active: false
  },
  {
    title: 'Calculating Match Scores',
    description: 'Evaluating candidate compatibility with job requirements',
    completed: false,
    active: false
  },
  {
    title: 'Ranking Candidates',
    description: 'Sorting candidates by match score and relevance',
    completed: false,
    active: false
  }
]

// Filters and search query
const filters = ref({
  status: '',
  department: '',
  jobType: ''
})
const searchQuery = ref('')

// Pagination variables
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Computed properties
const filteredJobs = computed(() => {
  let filtered = [...allJobs.value]

  if (filters.value.status) {
    filtered = filtered.filter(job => job.status === filters.value.status)
  }
  if (filters.value.department) {
    filtered = filtered.filter(job => job.department === filters.value.department)
  }
  if (filters.value.jobType) {
    filtered = filtered.filter(job => job.jobType === filters.value.jobType)
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(job => 
      job.title.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query) ||
      job.requiredSkills.some(skill => skill.toLowerCase().includes(query))
    )
  }

  return filtered
})

const totalJobs = computed(() => allJobs.value.length)
const activeJobs = computed(() => allJobs.value.filter(job => job.status === 'active').length)
const totalApplications = computed(() => allJobs.value.reduce((sum, job) => sum + job.applications, 0))
const avgMatchScore = computed(() => 78) // Mock average

const totalPages = computed(() => Math.ceil(filteredJobs.value.length / itemsPerPage.value))
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1, '...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    }
  }
  
  return pages
})

// Methods
const applyFilters = () => {
  currentPage.value = 1
}

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'paused':
      return 'bg-yellow-100 text-yellow-800'
    case 'closed':
      return 'bg-red-100 text-red-800'
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getJobApplications = (jobId) => {
  return sampleApplications.value[jobId] || []
}

const getAIMatches = (jobId) => {
  return sampleAIMatches.value[jobId] || []
}

const getApplicationStatusColor = (status) => {
  switch (status) {
    case 'new':
      return 'bg-blue-100 text-blue-800'
    case 'reviewed':
      return 'bg-yellow-100 text-yellow-800'
    case 'interviewed':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getMatchScoreColor = (score) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 80) return 'text-blue-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

const startAIMatching = (jobId) => {
  aiMatchingProgress.value[jobId] = 0
  
  const interval = setInterval(() => {
    aiMatchingProgress.value[jobId] += 10
    
    if (aiMatchingProgress.value[jobId] >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        delete aiMatchingProgress.value[jobId]
      }, 1000)
    }
  }, 200)
}

const toggleApplicationsDropdown = (jobId) => {
  if (activeDropdowns.value.applications === jobId) {
    activeDropdowns.value.applications = null
  } else {
    activeDropdowns.value.applications = jobId
    activeDropdowns.value.aiMatch = null
  }
}

const toggleAIMatchDropdown = (jobId) => {
  if (activeDropdowns.value.aiMatch === jobId) {
    activeDropdowns.value.aiMatch = null
  } else {
    activeDropdowns.value.aiMatch = jobId
    activeDropdowns.value.applications = null
  }
}

const editJob = (job) => {
  editingJob.value = job
  jobForm.value = {
    title: job.title,
    scope: job.description, // Assuming description maps to scope
    department: job.department,
    location: job.location,
    jobType: job.jobType,
    salary: job.salary,
    experience: job.experience,
    requirements: job.requiredSkills.map(skill => ({ skill: skill, description: '', score: '3' })) // Default score
  }
  showCreateModal.value = true
}

const toggleJobStatus = (job) => {
  if (job.status === 'active') {
    job.status = 'paused'
  } else if (job.status === 'paused') {
    job.status = 'active'
  }
}

// Methods for managing requirements
const addRequirement = () => {
  jobForm.value.requirements.push({ skill: '', description: '', score: '' })
}

const removeRequirement = (index) => {
  if (jobForm.value.requirements.length > 1) {
    jobForm.value.requirements.splice(index, 1)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingJob.value = null
  jobForm.value = {
    title: '',
    scope: '',
    department: '',
    location: '',
    jobType: '',
    salary: '',
    experience: '',
    requirements: [
      { skill: '', description: '', score: '' }
    ]
  }
}

const saveJob = async () => {
  isSaving.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const newJobData = {
    ...jobForm.value,
    totalScore: totalScore.value,
    requiredSkills: jobForm.value.requirements.map(req => req.skill).filter(skill => skill)
  }

  if (editingJob.value) {
    const index = allJobs.value.findIndex(job => job.id === editingJob.value.id)
    if (index !== -1) {
      allJobs.value[index] = {
        ...allJobs.value[index],
        title: newJobData.title,
        department: newJobData.department,
        location: newJobData.location,
        jobType: newJobData.jobType,
        salary: newJobData.salary,
        experience: newJobData.experience,
        description: newJobData.scope,
        requiredSkills: newJobData.requiredSkills,
        totalScore: newJobData.totalScore,
        requirements: newJobData.requirements
      }
    }
  } else {
    const newJob = {
      id: Date.now(),
      title: newJobData.title,
      department: newJobData.department,
      location: newJobData.location,
      jobType: newJobData.jobType,
      salary: newJobData.salary,
      experience: newJobData.experience,
      description: newJobData.scope,
      requiredSkills: newJobData.requiredSkills,
      totalScore: newJobData.totalScore,
      requirements: newJobData.requirements,
      status: 'active',
      applications: 0,
      postedDate: 'Just now'
    }
    allJobs.value.unshift(newJob)
  }
  
  isSaving.value = false
  closeModal()
}

const duplicateJob = (job) => {
  const duplicatedJob = {
    id: Date.now(),
    ...job,
    title: `${job.title} (Copy)`,
    status: 'draft',
    applications: 0,
    postedDate: 'Just now'
  }
  allJobs.value.unshift(duplicatedJob)
}

const confirmDeleteJob = (job) => {
  jobToDelete.value = job
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  jobToDelete.value = null
}

const deleteJob = async () => {
  if (!jobToDelete.value) return
  
  isDeleting.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const index = allJobs.value.findIndex(job => job.id === jobToDelete.value.id)
  if (index !== -1) {
    allJobs.value.splice(index, 1)
  }
  
  isDeleting.value = false
  showDeleteModal.value = false
  jobToDelete.value = null
}

const router = useRouter()

const redirectToJobResults = (jobId) => {
  activeDropdowns.value.aiMatch = null
  router.push({ name: 'results', params: { jobId } })
}

// HR AI matching functionality
const startHRAIMatching = async (jobId) => {
  // Initialize matching state
  aiMatchingState.value[jobId] = {
    phase: 'matching',
    progress: 0,
    steps: [...aiMatchingSteps.map(step => ({ ...step }))],
    currentStep: null,
    results: null
  }

  // Start the matching process
  for (let i = 0; i < aiMatchingState.value[jobId].steps.length; i++) {
    // Set current step as active
    aiMatchingState.value[jobId].steps[i].active = true
    aiMatchingState.value[jobId].currentStep = aiMatchingState.value[jobId].steps[i]
    
    // Simulate processing time (2 seconds per step)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Complete current step
    aiMatchingState.value[jobId].steps[i].completed = true
    aiMatchingState.value[jobId].steps[i].active = false
    
    // Update progress
    aiMatchingState.value[jobId].progress = ((i + 1) / aiMatchingState.value[jobId].steps.length) * 100
  }

  // Show completion state
  setTimeout(() => {
    aiMatchingState.value[jobId].phase = 'complete'
    aiMatchingState.value[jobId].results = {
      totalCandidates: Math.floor(Math.random() * 20) + 15, // 15-35 candidates
      highMatches: Math.floor(Math.random() * 8) + 5, // 5-12 high matches
      avgScore: Math.floor(Math.random() * 20) + 70 // 70-90% average score
    }
  }, 1000)
}
</script>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>