<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
              <UserPlusIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">KLMMS</h1>
              <p class="text-sm text-gray-500">Intelligent Talent Acquisition Platform</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Already have an account?</span>
            <button
              @click="showLoginModal = true"
              class="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Get Started Section -->
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-4xl font-bold text-gray-900 mb-6">
          Join <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">KLMMS</span>
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Choose your account type to get started with our intelligent talent acquisition platform
        </p>
      </div>

      <!-- Account Type Selection (Always visible) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <!-- Company Account -->
        <div
          @click="selectAccountType('company')"
          class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
        >
          <div class="text-center">
            <div class="h-20 w-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <BuildingIcon class="h-10 w-10 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Company Account</h3>
            <p class="text-gray-600 mb-6">
              Post jobs, manage applications, and find the perfect candidates for your organization
            </p>
            <div class="space-y-2 text-left">
              <div class="flex items-center text-sm text-gray-700">
                <CheckCircleIcon class="h-4 w-4 text-green-600 mr-2" />
                <span>Post unlimited job listings</span>
              </div>
              <div class="flex items-center text-sm text-gray-700">
                <CheckCircleIcon class="h-4 w-4 text-green-600 mr-2" />
                <span>AI-powered candidate matching</span>
              </div>
              <div class="flex items-center text-sm text-gray-700">
                <CheckCircleIcon class="h-4 w-4 text-green-600 mr-2" />
                <span>Resume analysis and ranking</span>
              </div>
              <div class="flex items-center text-sm text-gray-700">
                <CheckCircleIcon class="h-4 w-4 text-green-600 mr-2" />
                <span>Automated screening tools</span>
              </div>
              <div class="flex items-center text-sm text-gray-700">
                <CheckCircleIcon class="h-4 w-4 text-green-600 mr-2" />
                <span>Analytics dashboard</span>
              </div>
            </div>
            <div class="mt-6">
              <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold group-hover:from-purple-700 group-hover:to-pink-700 transition-all">
                Sign Up as Company
              </div>
            </div>
          </div>
        </div>

        <!-- Job Seeker Account -->
        <div
          @click="selectAccountType('jobseeker')"
          class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
        >
          <div class="text-center">
            <div class="h-20 w-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <UserIcon class="h-10 w-10 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Job Seeker Account</h3>
            <p class="text-gray-600 mb-6">
              Create your professional profile and discover amazing career opportunities
            </p>
            <div class="space-y-2 text-left">
              <div class="flex items-center text-sm text-gray-700">
                <CheckCircleIcon class="h-4 w-4 text-green-600 mr-2" />
                <span>AI-powered resume builder</span>
              </div>
              <div class="flex items-center text-sm text-gray-700">
                <CheckCircleIcon class="h-4 w-4 text-green-600 mr-2" />
                <span>Smart job matching</span>
              </div>
              <div class="flex items-center text-sm text-gray-700">
                <CheckCircleIcon class="h-4 w-4 text-green-600 mr-2" />
                <span>Application tracking</span>
              </div>
              <div class="flex items-center text-sm text-gray-700">
                <CheckCircleIcon class="h-4 w-4 text-green-600 mr-2" />
                <span>Career insights and tips</span>
              </div>
              <div class="flex items-center text-sm text-gray-700">
                <CheckCircleIcon class="h-4 w-4 text-green-600 mr-2" />
                <span>Real-time notifications</span>
              </div>
            </div>
            <div class="mt-6">
              <div class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold group-hover:from-green-700 group-hover:to-emerald-700 transition-all">
                Sign Up as Job Seeker
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Company Brief Section -->
      <div class="space-y-12">
        <!-- What We Do Section -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
            <div class="flex items-center text-white">
              <SparklesIcon class="h-6 w-6 mr-3" />
              <h3 class="text-xl font-bold">About KLMMS</h3>
            </div>
          </div>
          <div class="p-8">
            <div class="text-center mb-8">
              <h4 class="text-2xl font-bold text-gray-900 mb-4">
                Revolutionize Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Hiring Process</span>
              </h4>
              <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                KLMMS is an intelligent talent acquisition automation platform that streamlines recruitment 
                for companies and empowers job seekers to find their perfect career match using cutting-edge AI technology.
              </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- For Companies -->
              <div class="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div class="flex items-center mb-4">
                  <div class="h-10 w-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                    <BuildingIcon class="h-5 w-5 text-white" />
                  </div>
                  <h5 class="text-lg font-bold text-purple-900">For Companies</h5>
                </div>
                <div class="space-y-3">
                  <div class="flex items-start">
                    <ZapIcon class="h-4 w-4 text-purple-600 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p class="font-semibold text-purple-900 text-sm">Automated Resume Screening</p>
                      <p class="text-xs text-purple-700">AI analyzes and ranks resumes saving hours of manual review</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <TargetIcon class="h-4 w-4 text-purple-600 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p class="font-semibold text-purple-900 text-sm">Smart Candidate Matching</p>
                      <p class="text-xs text-purple-700">Advanced algorithms match candidates based on skills and fit</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <BarChartIcon class="h-4 w-4 text-purple-600 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p class="font-semibold text-purple-900 text-sm">Analytics & Insights</p>
                      <p class="text-xs text-purple-700">Track hiring metrics with comprehensive dashboards</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- For Job Seekers -->
              <div class="bg-green-50 rounded-xl p-6 border border-green-200">
                <div class="flex items-center mb-4">
                  <div class="h-10 w-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                    <UserIcon class="h-5 w-5 text-white" />
                  </div>
                  <h5 class="text-lg font-bold text-green-900">For Job Seekers</h5>
                </div>
                <div class="space-y-3">
                  <div class="flex items-start">
                    <FileTextIcon class="h-4 w-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p class="font-semibold text-green-900 text-sm">AI-Powered Resume Builder</p>
                      <p class="text-xs text-green-700">Create professional resumes with AI suggestions</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <SearchIcon class="h-4 w-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p class="font-semibold text-green-900 text-sm">Smart Job Matching</p>
                      <p class="text-xs text-green-700">Get matched with relevant positions automatically</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <TrendingUpIcon class="h-4 w-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p class="font-semibold text-green-900 text-sm">Career Insights</p>
                      <p class="text-xs text-green-700">Receive personalized career advice and market insights</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Key Features Section -->
        <div class="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl shadow-xl text-white p-8">
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold mb-2">Why Choose KLMMS?</h3>
            <p class="text-blue-200">Join thousands who have transformed their hiring experience</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="text-center">
              <div class="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BrainIcon class="h-6 w-6 text-white" />
              </div>
              <h4 class="font-bold text-white mb-2">AI-Powered</h4>
              <p class="text-xs text-blue-200">Advanced machine learning for precise matching</p>
            </div>
            <div class="text-center">
              <div class="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ClockIcon class="h-6 w-6 text-white" />
              </div>
              <h4 class="font-bold text-white mb-2">Time-Saving</h4>
              <p class="text-xs text-blue-200">Reduce hiring time by up to 70%</p>
            </div>
            <div class="text-center">
              <div class="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ShieldIcon class="h-6 w-6 text-white" />
              </div>
              <h4 class="font-bold text-white mb-2">Secure</h4>
              <p class="text-xs text-blue-200">Enterprise-grade security and privacy</p>
            </div>
            <div class="text-center">
              <div class="h-12 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <UsersIcon class="h-6 w-6 text-white" />
              </div>
              <h4 class="font-bold text-white mb-2">User-Friendly</h4>
              <p class="text-xs text-blue-200">Intuitive interface for everyone</p>
            </div>
          </div>
          
          <!-- Success Metrics -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 pt-8 border-t border-blue-800">
            <div class="text-center">
              <div class="text-3xl font-bold text-green-400 mb-1">500+</div>
              <p class="text-blue-200 text-sm">Companies Using Our Platform</p>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-400 mb-1">50K+</div>
              <p class="text-blue-200 text-sm">Successful Job Placements</p>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-400 mb-1">70%</div>
              <p class="text-blue-200 text-sm">Reduction in Hiring Time</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sign Up Form Modal -->
    <div
      v-if="selectedAccountType"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div 
          :class="[
            'px-6 py-4',
            selectedAccountType === 'company' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
              : 'bg-gradient-to-r from-green-600 to-emerald-600'
          ]"
        >
          <div class="flex items-center justify-between text-white">
            <div class="flex items-center">
              <component 
                :is="selectedAccountType === 'company' ? BuildingIcon : UserIcon" 
                class="h-6 w-6 mr-3" 
              />
              <h2 class="text-xl font-bold">
                {{ selectedAccountType === 'company' ? 'Company Registration' : 'Job Seeker Registration' }}
              </h2>
            </div>
            <button
              @click="selectedAccountType = null"
              class="text-white hover:text-gray-200 transition-colors"
            >
              <XIcon class="h-6 w-6" />
            </button>
          </div>
        </div>

        <form @submit.prevent="handleSignUp" class="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          <!-- Error Message -->
          <div
            v-if="signUpError"
            class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start text-sm"
          >
            <AlertCircleIcon class="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
            <p class="text-red-800">{{ signUpError }}</p>
          </div>
          
          <!-- Company-specific fields -->
          <div v-if="selectedAccountType === 'company'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Company Name *</label>
                <input
                  v-model="formData.companyName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Industry *</label>
                <select
                  v-model="formData.industry"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Company Size *</label>
                <select
                  v-model="formData.companySize"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                >
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-1000">201-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Website</label>
                <input
                  v-model="formData.website"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                  placeholder="https://company.com"
                />
              </div>
            </div>
            <!-- Company Address Field -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Company Address *</label>
              <input
                v-model="formData.companyAddress"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                placeholder="Enter company address"
              />
            </div>
          </div>

          <!-- Job Seeker-specific fields -->
          <div v-if="selectedAccountType === 'jobseeker'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                <input
                  v-model="formData.firstName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Last Name *</label>
                <input
                  v-model="formData.lastName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                <input
                  v-model="formData.phone"
                  type="tel"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Location *</label>
                <input
                  v-model="formData.location"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                  placeholder="City, State/Country"
                />
              </div>
            </div>
          </div>

          <!-- Common fields -->
          <div class="space-y-4 border-t border-gray-200 pt-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
              <input
                v-model="formData.email"
                type="email"
                required
                :class="[
                  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all text-sm',
                  selectedAccountType === 'company' ? 'focus:ring-purple-500' : 'focus:ring-green-500'
                ]"
                placeholder="your.email@example.com"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
                <input
                  v-model="formData.password"
                  type="password"
                  required
                  :class="[
                    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all text-sm',
                    selectedAccountType === 'company' ? 'focus:ring-purple-500' : 'focus:ring-green-500'
                  ]"
                  placeholder="Create password"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Confirm Password *</label>
                <input
                  v-model="formData.confirmPassword"
                  type="password"
                  required
                  :class="[
                    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all text-sm',
                    selectedAccountType === 'company' ? 'focus:ring-purple-500' : 'focus:ring-green-500'
                  ]"
                  placeholder="Confirm password"
                />
              </div>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start space-x-2 pt-2">
            <input
              v-model="formData.agreeToTerms"
              type="checkbox"
              required
              :class="[
                'mt-1 rounded border-gray-300 focus:ring-2 text-sm',
                selectedAccountType === 'company' 
                  ? 'text-purple-600 focus:ring-purple-500' 
                  : 'text-green-600 focus:ring-green-500'
              ]"
            />
            <label class="text-xs text-gray-700">
              I agree to the 
              <a href="#" class="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</a> 
              and 
              <a href="#" class="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>
            </label>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="isSubmitting"
              :class="[
                'w-full font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm',
                selectedAccountType === 'company'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
              ]"
            >
              <span v-if="!isSubmitting" class="flex items-center justify-center">
                <UserPlusIcon class="h-4 w-4 mr-2" />
                Create {{ selectedAccountType === 'company' ? 'Company' : 'Job Seeker' }} Account
              </span>
              <span v-else class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Login Modal -->
    <div
      v-if="showLoginModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div class="flex items-center justify-between text-white">
            <div class="flex items-center">
              <LogInIcon class="h-6 w-6 mr-3" />
              <h2 class="text-xl font-bold">Sign In</h2>
            </div>
            <button
              @click="showLoginModal = false"
              class="text-white hover:text-gray-200 transition-colors"
            >
              <XIcon class="h-6 w-6" />
            </button>
          </div>
        </div>

        <form @submit.prevent="handleLogin" class="p-6 space-y-4">
          <!-- Account Type Selection -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Account Type</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                @click="loginAccountType = 'company'"
                :class="[
                  'flex items-center justify-center px-3 py-2 rounded-lg border-2 transition-all font-medium text-sm',
                  loginAccountType === 'company'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300'
                ]"
              >
                <BuildingIcon class="h-4 w-4 mr-1" />
                Company
              </button>
              <button
                type="button"
                @click="loginAccountType = 'jobseeker'"
                :class="[
                  'flex items-center justify-center px-3 py-2 rounded-lg border-2 transition-all font-medium text-sm',
                  loginAccountType === 'jobseeker'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-green-300'
                ]"
              >
                <UserIcon class="h-4 w-4 mr-1" />
                Job Seeker
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="loginError"
            class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start text-sm"
          >
            <AlertCircleIcon class="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
            <p class="text-red-800">{{ loginError }}</p>
          </div>

          <!-- Email Field -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              v-model="loginData.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              placeholder="your.email@example.com"
            />
          </div>

          <!-- Password Field -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              v-model="loginData.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              placeholder="Enter your password"
            />
          </div>

          <!-- Demo Account Info -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p class="text-xs text-blue-800 font-medium mb-1">Demo Accounts:</p>
            <p class="text-xs text-blue-700">Company: company@demo.com / demo123</p>
            <p class="text-xs text-blue-700">Job Seeker: jobseeker@demo.com / demo123</p>
          </div>

          <!-- Sign In Button -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="isLoggingIn || !loginAccountType"
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <span v-if="!isLoggingIn" class="flex items-center justify-center">
                <LogInIcon class="h-4 w-4 mr-2" />
                Sign In
              </span>
              <span v-else class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing In...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Modal -->
    <div
      v-if="showSuccess"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
        <div class="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon class="h-8 w-8 text-green-600" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">
          {{ isLogin ? 'Welcome Back!' : 'Welcome to KLMMS!' }}
        </h3>
        <p class="text-gray-600 mb-6">
          {{ isLogin 
            ? `Successfully signed in to your ${loginAccountType} account.`
            : `Your ${selectedAccountType} account has been created successfully.`
          }}
        </p>
        <button
          @click="redirectToDashboard"
          class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
        >
          Get Started
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import {
  UserPlusIcon,
  BuildingIcon,
  UserIcon,
  CheckCircleIcon,
  XIcon,
  LogInIcon,
  AlertCircleIcon,
  SparklesIcon,
  ZapIcon,
  TargetIcon,
  BarChartIcon,
  FileTextIcon,
  SearchIcon,
  TrendingUpIcon,
  BrainIcon,
  ClockIcon,
  ShieldIcon,
  UsersIcon
} from 'lucide-vue-next'

const selectedAccountType = ref(null)
const showLoginModal = ref(false)
const isSubmitting = ref(false)
const isLoggingIn = ref(false)
const showSuccess = ref(false)
const isLogin = ref(false)
const loginError = ref('')
const signUpError = ref('')
const loginAccountType = ref('company')

const formData = ref({
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
  companyName: '',
  industry: '',
  companySize: '',
  website: '',
  companyAddress: '', // <-- add this line
  firstName: '',
  lastName: '',
  phone: '',
  location: ''
})

const loginData = ref({
  email: '',
  password: ''
})

const demoAccounts = {
  company: { email: 'company@demo.com', password: 'demo123' },
  jobseeker: { email: 'jobseeker@demo.com', password: 'demo123' }
}

const selectAccountType = (type) => {
  selectedAccountType.value = type
  formData.value = {
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    firstName: '',
    lastName: '',
    phone: '',
    location: ''
  }
}

const handleSignUp = async () => {
  // Clear previous errors
  signUpError.value = ''
  
  // Validate passwords match
  if (formData.value.password !== formData.value.confirmPassword) {
    signUpError.value = 'Passwords do not match!'
    return
  }

  // Validate password strength
  if (formData.value.password.length < 6) {
    signUpError.value = 'Password must be at least 6 characters long!'
    return
  }

  isSubmitting.value = true

  try {
    // Prepare user data for database
    const userData = {
      email: formData.value.email,
      password: formData.value.password, // Note: In production, this should be hashed
      account_type: selectedAccountType.value.toUpperCase(),
      email_verified: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Save user data to the users table
    const { data: userResult, error: userError } = await supabase
      .from('users')
      .insert([userData])
      .select()

    if (userError) {
      throw new Error(userError.message)
    }

    if (!userResult || userResult.length === 0) {
      throw new Error('Failed to create user account')
    }

    const createdUser = userResult[0]

    // If it's a job seeker account, create job seeker profile
    if (selectedAccountType.value === 'jobseeker') {
      const jobSeekerProfile = {
        user_id: createdUser.id,
        first_name: formData.value.firstName,
        last_name: formData.value.lastName,
        phone: formData.value.phone,
        location: formData.value.location,
        profile_visibility: 'PUBLIC',
        allow_recruiter_contact: true,
        email_notifications: true,
        sms_notifications: false,
        job_alerts: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error: profileError } = await supabase
        .from('job_seeker_profiles')
        .insert([jobSeekerProfile])

      if (profileError) {
        // If profile creation fails, delete the user
        await supabase
          .from('users')
          .delete()
          .eq('id', createdUser.id)
        throw new Error(profileError.message)
      }
    }

    // If it's a company account, create company profile
    if (selectedAccountType.value === 'company') {
      const companyProfile = {
        user_id: createdUser.id,
        company_name: formData.value.companyName,
        industry: formData.value.industry.toUpperCase(),
        company_size: formData.value.companySize,
        website: formData.value.website || null,
        contact_email: formData.value.email,
        contact_phone: null, // Can be added later
        address: formData.value.companyAddress,
        city: null, // Can be parsed from address later
        state: null, // Can be parsed from address later
        country: null, // Can be parsed from address later
        postal_code: null, // Can be parsed from address later
        founded_year: null, // Can be added later
        employee_count: null, // Can be added later
        company_type: null, // Can be added later
        logo: null, // Can be added later
        subscription_plan: 'FREE',
        subscription_expiry: null,
        features_enabled: null,
        auto_screening: true,
        email_notifications: true,
        sms_notifications: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error: profileError } = await supabase
        .from('company_profiles')
        .insert([companyProfile])

      if (profileError) {
        // If profile creation fails, delete the user
        await supabase
          .from('users')
          .delete()
          .eq('id', createdUser.id)
        throw new Error(profileError.message)
      }
    }

    // Save to localStorage for demo purposes
    localStorage.setItem('userData', JSON.stringify({
      accountType: selectedAccountType.value,
      ...formData.value,
      id: createdUser.id
    }))

    // Set current user for session management
    localStorage.setItem('currentUser', JSON.stringify({
      id: createdUser.id,
      email: formData.value.email,
      accountType: selectedAccountType.value,
      loginTime: new Date().toISOString()
    }))

    isSubmitting.value = false
    selectedAccountType.value = null
    isLogin.value = false
    showSuccess.value = true

  } catch (error) {
    console.error('Sign up error:', error)
    signUpError.value = error.message || 'Failed to create account. Please try again.'
    isSubmitting.value = false
  }
}

const handleLogin = async () => {
  loginError.value = ''
  isLoggingIn.value = true
  
  try {
    // First try to find user by email and verify password
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', loginData.value.email)
      .eq('is_active', true)
      .single()

    if (userError || !userData) {
      // Fallback to demo accounts for testing
      const demoAccount = demoAccounts[loginAccountType.value]
      if (loginData.value.email === demoAccount.email && loginData.value.password === demoAccount.password) {
        const userData = {
          accountType: loginAccountType.value,
          email: loginData.value.email,
          loginTime: new Date().toISOString()
        }
        localStorage.setItem('currentUser', JSON.stringify(userData))
        localStorage.setItem("role", loginAccountType.value)
        
        isLoggingIn.value = false
        showLoginModal.value = false
        isLogin.value = true
        showSuccess.value = true
        return
      } else {
        throw new Error('Invalid credentials. Use demo accounts shown above.')
      }
    }

    // Check if account is locked
    if (userData.locked_until && new Date(userData.locked_until) > new Date()) {
      throw new Error('Account is temporarily locked. Please try again later.')
    }

    // Verify password (in production, this should use proper password hashing)
    if (userData.password !== loginData.value.password) {
      // Increment login attempts
      const newLoginAttempts = (userData.login_attempts || 0) + 1
      const updateData = {
        login_attempts: newLoginAttempts,
        updated_at: new Date().toISOString()
      }

      // Lock account if too many failed attempts
      if (newLoginAttempts >= 5) {
        updateData.locked_until = new Date(Date.now() + 30 * 60 * 1000) // Lock for 30 minutes
      }

      await supabase
        .from('users')
        .update(updateData)
        .eq('id', userData.id)

      throw new Error('Invalid password.')
    }

    // Reset login attempts on successful login
    await supabase
      .from('users')
      .update({
        login_attempts: 0,
        last_login_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userData.id)

    // Set current user for session management
    localStorage.setItem('currentUser', JSON.stringify({
      id: userData.id,
      email: userData.email,
      accountType: userData.account_type.toLowerCase(),
      loginTime: new Date().toISOString()
    }))
    localStorage.setItem("role", userData.account_type.toLowerCase())
    
    isLoggingIn.value = false
    showLoginModal.value = false
    isLogin.value = true
    showSuccess.value = true

  } catch (error) {
    console.error('Login error:', error)
    loginError.value = error.message || 'Login failed. Please try again.'
    isLoggingIn.value = false
  }
}

const redirectToDashboard = () => {
  showSuccess.value = false
  const accountType = isLogin.value ? loginAccountType.value : selectedAccountType.value
  if (accountType === 'company') {
    window.location.href = '/hrhome'
  } else {
    window.location.href = '/jshome'
  }
}
</script>

<style scoped>
input:focus, textarea:focus, select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
