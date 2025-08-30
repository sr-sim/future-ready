<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Fixed Progress Bar -->
    <div class=" bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="h-8 w-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
              <UserPlusIcon class="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 class="text-lg font-bold text-gray-900">Job Application</h1>
            </div>
          </div>
          
          <!-- Progress Section -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-3">
              <span class="text-sm font-medium text-gray-600">Progress:</span>
              <div class="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
                  :style="{ width: `${progress}%` }"
                ></div>
              </div>
              <span class="text-sm font-semibold text-gray-700">{{ Math.round(progress) }}%</span>
            </div>

                      <!-- User Profile -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-semibold">{{ userInitials }}</span>
              </div>
              <span class="text-gray-700 font-medium">{{ userName }}</span>
            </div>
          </div>
            
            <!-- Save Button -->
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content with top padding for fixed header -->
    <div class="pt-20 max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Welcome Section -->
      <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <div class="text-center">
          <h2 class="text-3xl font-bold mb-2">Build Your Professional Profile</h2>
          <p class="text-green-100 text-lg">Create your resume and discover matching opportunities</p>
        </div>
      </div>

      <!-- Tips Section -->
      <!-- <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div class="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
          <div class="flex items-center text-white">
            <LightbulbIcon class="h-6 w-6 mr-3" />
            <h2 class="text-xl font-bold">Pro Tips for a Great Application</h2>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div class="flex items-start">
                <div class="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <UserIcon class="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-blue-900 mb-1">Personal Info</h3>
                  <p class="text-sm text-blue-700">Use a professional email address and ensure your phone number is current.</p>
                </div>
              </div>
            </div>
            
            <div class="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <div class="flex items-start">
                <div class="h-8 w-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <FileTextIcon class="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-purple-900 mb-1">Summary</h3>
                  <p class="text-sm text-purple-700">Write 3-4 sentences highlighting your key achievements and career goals.</p>
                </div>
              </div>
            </div>
            
            <div class="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <div class="flex items-start">
                <div class="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <BriefcaseIcon class="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-orange-900 mb-1">Experience</h3>
                  <p class="text-sm text-orange-700">Focus on achievements and quantify results with numbers when possible.</p>
                </div>
              </div>
            </div>
            
            <div class="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
              <div class="flex items-start">
                <div class="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <GraduationCapIcon class="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-indigo-900 mb-1">Education</h3>
                  <p class="text-sm text-indigo-700">Include relevant coursework, honors, or academic projects if recent graduate.</p>
                </div>
              </div>
            </div>
            
            <div class="bg-green-50 rounded-xl p-4 border border-green-200">
              <div class="flex items-start">
                <div class="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <CodeIcon class="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-green-900 mb-1">Skills</h3>
                  <p class="text-sm text-green-700">List both technical and soft skills. Be specific about your proficiency level.</p>
                </div>
              </div>
            </div>
            
            <div class="bg-pink-50 rounded-xl p-4 border border-pink-200">
              <div class="flex items-start">
                <div class="h-8 w-8 bg-pink-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <StarIcon class="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-pink-900 mb-1">General Tips</h3>
                  <p class="text-sm text-pink-700">Proofread everything, use action verbs, and tailor content to the job you want.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Validation Error Message -->
      <div
        v-if="showValidationError"
        class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start"
      >
        <AlertCircleIcon class="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <p class="text-red-800 font-medium">Please complete the following required fields:</p>
          <p class="text-red-600 text-sm mt-1 whitespace-pre-line">{{ validationMessage }}</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          @click="loadSavedResume"
          class="bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all duration-200 text-left"
        >
          <div class="flex items-center mb-2">
            <FolderOpenIcon class="h-5 w-5 text-blue-600 mr-2" />
            <span class="font-semibold text-gray-900">Load Saved Resume</span>
          </div>
          <p class="text-sm text-gray-600">Continue with your previously saved resume</p>
        </button>

        <button
          @click="clearForm"
          class="bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all duration-200 text-left"
        >
          <div class="flex items-center mb-2">
            <RefreshCwIcon class="h-5 w-5 text-orange-600 mr-2" />
            <span class="font-semibold text-gray-900">Start Fresh</span>
          </div>
          <p class="text-sm text-gray-600">Clear all fields and start over</p>
        </button>

        <!-- <button
          @click="handleFindMatches"
          :disabled="!isFormComplete"
          :class="[
            'rounded-xl shadow-lg border border-gray-100 p-4 transition-all duration-200 text-left',
            isFormComplete 
              ? 'bg-white hover:shadow-xl cursor-pointer' 
              : 'bg-gray-100 cursor-not-allowed opacity-60'
          ]"
        >
          <div class="flex items-center mb-2">
            <SearchIcon class="h-5 w-5 text-purple-600 mr-2" />
            <span class="font-semibold text-gray-900">Find Job Matches</span>
          </div>
          <p class="text-sm text-gray-600">
            {{ isFormComplete ? 'Discover matching companies' : 'Complete all required fields first' }}
          </p>
        </button> -->
      </div>

      <!-- Application Form -->
      <div class="space-y-6">
        <!-- Personal Information -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div class="flex items-center text-white">
              <UserIcon class="h-6 w-6 mr-3" />
              <h2 class="text-xl font-bold">Personal Information</h2>
            </div>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <input
                v-model="formData.personalInfo.fullName"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
              <input
                v-model="formData.personalInfo.email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
              <input
                v-model="formData.personalInfo.phone"
                type="tel"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input
                v-model="formData.personalInfo.location"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="City, State/Country"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">LinkedIn Profile</label>
              <input
                v-model="formData.personalInfo.linkedin"
                type="url"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>
        </div>

        <!-- Professional Summary -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
            <div class="flex items-center text-white">
              <FileTextIcon class="h-6 w-6 mr-3" />
              <h2 class="text-xl font-bold">Professional Summary</h2>
            </div>
          </div>
          <div class="p-6">
            <div class="mb-4 bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div class="flex items-start">
                <InfoIcon class="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 class="font-semibold text-purple-900 mb-1">Writing Tips:</h4>
                  <ul class="text-sm text-purple-700 space-y-1">
                    <li>• Start with your years of experience and main expertise</li>
                    <li>• Mention 2-3 key achievements or skills</li>
                    <li>• End with your career objective or what you're seeking</li>
                    <li>• Keep it concise: 3-4 sentences maximum</li>
                  </ul>
                </div>
              </div>
            </div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Summary *</label>
            <textarea
              v-model="formData.summary"
              required
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="Example: Experienced software engineer with 5+ years developing web applications. Proven track record of leading cross-functional teams and delivering projects 20% ahead of schedule. Seeking a senior role where I can leverage my expertise in React and Node.js to drive innovation."
            ></textarea>
            <div class="mt-2 text-xs text-gray-500">
              Character count: {{ formData.summary.length }} | Recommended: 200-400 characters
            </div>
          </div>
        </div>

        <!-- Work Experience -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
            <div class="flex items-center justify-between text-white">
              <div class="flex items-center">
                <BriefcaseIcon class="h-6 w-6 mr-3" />
                <h2 class="text-xl font-bold">Work Experience</h2>
              </div>
              <button
                type="button"
                @click="addExperience"
                class="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              >
                + Add Experience
              </button>
            </div>
          </div>
          <div class="p-6">
            <div class="mb-4 bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div class="flex items-start">
                <InfoIcon class="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 class="font-semibold text-orange-900 mb-1">Experience Tips:</h4>
                  <ul class="text-sm text-orange-700 space-y-1">
                    <li>• Use action verbs: "Led", "Developed", "Improved", "Managed"</li>
                    <li>• Quantify achievements: "Increased sales by 25%", "Managed team of 8"</li>
                    <li>• Focus on results and impact, not just responsibilities</li>
                    <li>• List experiences in reverse chronological order (most recent first)</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <div
                v-for="(exp, index) in formData.experience"
                :key="index"
                class="border border-gray-200 rounded-xl p-4 relative"
              >
                <button
                  v-if="formData.experience.length > 1"
                  type="button"
                  @click="removeExperience(index)"
                  class="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <XIcon class="h-5 w-5" />
                </button>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
                    <input
                      v-model="exp.title"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Company *</label>
                    <input
                      v-model="exp.company"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                    <input
                      v-model="exp.startDate"
                      type="month"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                    <input
                      v-model="exp.endDate"
                      type="month"
                      :disabled="exp.current"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:bg-gray-100"
                    />
                    <label class="flex items-center mt-2">
                      <input
                        v-model="exp.current"
                        type="checkbox"
                        class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span class="ml-2 text-sm text-gray-600">Currently working here</span>
                    </label>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      v-model="exp.description"
                      rows="3"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                      placeholder="Example: • Led development of e-commerce platform serving 10K+ users daily • Improved application performance by 40% through code optimization • Mentored 3 junior developers and conducted code reviews"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Education -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <div class="flex items-center justify-between text-white">
              <div class="flex items-center">
                <GraduationCapIcon class="h-6 w-6 mr-3" />
                <h2 class="text-xl font-bold">Education</h2>
              </div>
              <button
                type="button"
                @click="addEducation"
                class="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              >
                + Add Education
              </button>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div
              v-for="(edu, index) in formData.education"
              :key="index"
              class="border border-gray-200 rounded-xl p-4 relative"
            >
              <button
                v-if="formData.education.length > 1"
                type="button"
                @click="removeEducation(index)"
                class="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
              >
                <XIcon class="h-5 w-5" />
              </button>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Degree *</label>
                  <input
                    v-model="edu.degree"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="e.g. Bachelor of Science"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Field of Study *</label>
                  <input
                    v-model="edu.field"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Institution *</label>
                  <input
                    v-model="edu.institution"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="University/College Name"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Graduation Year *</label>
                  <input
                    v-model="edu.year"
                    type="number"
                    required
                    min="1950"
                    max="2030"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="2023"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">GPA (Optional)</label>
                  <input
                    v-model="edu.gpa"
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="3.8/4.0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
            <div class="flex items-center text-white">
              <CodeIcon class="h-6 w-6 mr-3" />
              <h2 class="text-xl font-bold">Skills & Technologies</h2>
            </div>
          </div>
          <div class="p-6">
            <div class="mb-4 bg-green-50 border border-green-200 rounded-xl p-4">
              <div class="flex items-start">
                <InfoIcon class="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 class="font-semibold text-green-900 mb-1">Skills Tips:</h4>
                  <ul class="text-sm text-green-700 space-y-1">
                    <li>• Include both technical and soft skills</li>
                    <li>• List skills relevant to your target job first</li>
                    <li>• Be specific: "React.js" instead of just "JavaScript frameworks"</li>
                    <li>• Include proficiency levels if relevant: "Python (Advanced)", "Spanish (Conversational)"</li>
                  </ul>
                </div>
              </div>
            </div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Skills (comma-separated) *</label>
            <textarea
              v-model="formData.skills"
              required
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              placeholder="Example: JavaScript, React.js, Node.js, Python, SQL, Git, AWS, Project Management, Team Leadership, Problem Solving, Communication"
            ></textarea>
            <div class="mt-2 flex justify-between text-xs text-gray-500">
              <span>Separate each skill with a comma</span>
              <span>Skills listed: {{ formData.skills ? formData.skills.split(',').filter(s => s.trim()).length : 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Save Resume Button -->
        <div class="flex justify-center pt-6 pb-8">
          <button
            @click="saveResume"
            :disabled="isSaving || !isFormComplete"
            :class="[
              'font-bold py-4 px-12 rounded-2xl shadow-xl transition-all duration-200 transform',
              isFormComplete && !isSaving
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            <span v-if="!isSaving" class="flex items-center">
              <SaveIcon class="h-5 w-5 mr-2" />
              {{ isFormComplete ? 'Save Resume' : 'Complete Required Fields First' }}
            </span>
            <span v-else class="flex items-center">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Saving Resume...
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Company Matching Modal -->
    <div
      v-if="showMatching"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
          <div class="flex items-center justify-between text-white">
            <div class="flex items-center">
              <SearchIcon class="h-6 w-6 mr-3" />
              <h2 class="text-xl font-bold">Matching Companies</h2>
            </div>
            <button
              @click="showMatching = false"
              class="text-white hover:text-gray-200 transition-colors"
            >
              <XIcon class="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div class="mb-6">
            <p class="text-gray-600 mb-4">Based on your profile, we found {{ matchingCompanies.length }} companies that match your skills and experience:</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="company in matchingCompanies"
                :key="company.id"
                class="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center">
                    <div class="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                      <BuildingIcon class="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 class="font-bold text-gray-900">{{ company.name }}</h3>
                      <p class="text-sm text-gray-600">{{ company.industry }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold" :class="getMatchColor(company.matchScore)">
                      {{ company.matchScore }}%
                    </div>
                    <div class="text-xs text-gray-500">Match</div>
                  </div>
                </div>
                
                <div class="mb-3">
                  <h4 class="font-semibold text-gray-900 mb-1">{{ company.position }}</h4>
                  <p class="text-sm text-gray-600 mb-2">{{ company.location }}</p>
                  <p class="text-sm text-gray-700">{{ company.description }}</p>
                </div>
                
                <div class="mb-3">
                  <h5 class="text-sm font-semibold text-gray-700 mb-1">Matching Skills:</h5>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="skill in company.matchingSkills"
                      :key="skill"
                      class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                    >
                      {{ skill }}
                    </span>
                  </div>
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="text-sm text-gray-600">
                    <span class="font-semibold">Salary:</span> {{ company.salary }}
                  </div>
                  <button class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Success Modal -->
    <div
      v-if="showSaveSuccess"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
        <div class="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon class="h-8 w-8 text-green-600" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Resume Saved Successfully!</h3>
        <p class="text-gray-600 mb-6">Your resume has been saved and is ready for job matching. You can continue editing or start finding opportunities.</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            @click="handleFindMatches"
            class="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Find Job Matches
          </button>
          <button
            @click="showSaveSuccess = false"
            class="bg-gray-100 text-gray-700 font-semibold py-2 px-6 rounded-xl hover:bg-gray-200 transition-all"
          >
            Continue Editing
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { supabase } from '../lib/supabase'
import {
  UserPlusIcon,
  UserIcon,
  FileTextIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  CodeIcon,
  SaveIcon,
  CheckCircleIcon,
  XIcon,
  FolderOpenIcon,
  RefreshCwIcon,
  SearchIcon,
  BuildingIcon,
  AlertCircleIcon,
  LightbulbIcon,
  InfoIcon,
  StarIcon
} from 'lucide-vue-next'

const isSaving = ref(false)
const showSaveSuccess = ref(false)
const showMatching = ref(false)
const showValidationError = ref(false)
const validationMessage = ref('')

const formData = ref({
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: ''
  },
  summary: '',
  experience: [
    {
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
  ],
  education: [
    {
      degree: '',
      field: '',
      institution: '',
      year: '',
      gpa: ''
    }
  ],
  skills: ''
})
const userName = ref('Sarah Johnson')
const userInitials = computed(() => userName.value.split(' ').map(n => n[0]).join(''))
// Sample matching companies data
const matchingCompanies = ref([
  {
    id: 1,
    name: 'TechCorp Solutions',
    industry: 'Software Development',
    position: 'Senior Frontend Developer',
    location: 'Puchong, Selangor',
    description: 'Join our innovative team building next-generation web applications.',
    matchScore: 92,
    salary: 'RM12000 - RM15000',
    matchingSkills: ['JavaScript', 'React', 'Node.js']
  },
  {
    id: 2,
    name: 'DataFlow Inc',
    industry: 'Data Analytics',
    position: 'Full Stack Engineer',
    location: 'Johor Bahru, Johor',
    description: 'Work on cutting-edge data visualization and analytics platforms.',
    matchScore: 87,
    salary: 'RM11000 - RM14000',
    matchingSkills: ['Python', 'SQL', 'React']
  },
  {
    id: 3,
    name: 'CloudTech Systems',
    industry: 'Cloud Computing',
    position: 'Software Engineer',
    location: 'Bukit Jalil, Kuala Lumpur',
    description: 'Build scalable cloud infrastructure and microservices.',
    matchScore: 78,
    salary: 'RM10000 - RM13000',
    matchingSkills: ['AWS', 'Node.js', 'Git']
  },
  {
    id: 4,
    name: 'StartupX',
    industry: 'Fintech',
    position: 'Frontend Developer',
    location: 'Damansara, Selangor',
    description: 'Help revolutionize financial services with modern web technologies.',
    matchScore: 73,
    salary: 'RM9000 - RM12000',
    matchingSkills: ['JavaScript', 'React', 'Git']
  }
])

// Validation functions
const validateRequiredFields = () => {
  const errors = []
  
  // Personal Info validation
  if (!formData.value.personalInfo.fullName.trim()) {
    errors.push('Full Name is required')
  }
  if (!formData.value.personalInfo.email.trim()) {
    errors.push('Email Address is required')
  }
  if (!formData.value.personalInfo.phone.trim()) {
    errors.push('Phone Number is required')
  }
  if (!formData.value.personalInfo.location.trim()) {
    errors.push('Location is required')
  }
  
  // Summary validation
  if (!formData.value.summary.trim()) {
    errors.push('Professional Summary is required')
  }
  
  // Experience validation (at least first entry)
  const firstExp = formData.value.experience[0]
  if (!firstExp.title.trim()) {
    errors.push('Job Title is required in Work Experience')
  }
  if (!firstExp.company.trim()) {
    errors.push('Company is required in Work Experience')
  }
  if (!firstExp.startDate.trim()) {
    errors.push('Start Date is required in Work Experience')
  }
  
  // Education validation (at least first entry)
  const firstEdu = formData.value.education[0]
  if (!firstEdu.degree.trim()) {
    errors.push('Degree is required in Education')
  }
  if (!firstEdu.field.trim()) {
    errors.push('Field of Study is required in Education')
  }
  if (!firstEdu.institution.trim()) {
    errors.push('Institution is required in Education')
  }
  if (!firstEdu.year.toString().trim()) {
    errors.push('Graduation Year is required in Education')
  }
  
  // Skills validation
  if (!formData.value.skills.trim()) {
    errors.push('Skills are required')
  }
  
  return errors
}

// Check if all required fields are completed
const isFormComplete = computed(() => {
  const errors = validateRequiredFields()
  return errors.length === 0
})

// Calculate form completion progress
const progress = computed(() => {
  let totalFields = 0
  let filledFields = 0

  // Personal info (4 required fields)
  totalFields += 4
  if (formData.value.personalInfo.fullName.trim()) filledFields++
  if (formData.value.personalInfo.email.trim()) filledFields++
  if (formData.value.personalInfo.phone.trim()) filledFields++
  if (formData.value.personalInfo.location.trim()) filledFields++

  // Summary (1 field)
  totalFields += 1
  if (formData.value.summary.trim()) filledFields++

  // Experience (at least first entry, 3 required fields)
  totalFields += 3
  const firstExp = formData.value.experience[0]
  if (firstExp.title.trim()) filledFields++
  if (firstExp.company.trim()) filledFields++
  if (firstExp.startDate.trim()) filledFields++

  // Education (at least first entry, 4 required fields)
  totalFields += 4
  const firstEdu = formData.value.education[0]
  if (firstEdu.degree.trim()) filledFields++
  if (firstEdu.field.trim()) filledFields++
  if (firstEdu.institution.trim()) filledFields++
  if (firstEdu.year.toString().trim()) filledFields++

  // Skills (1 field)
  totalFields += 1
  if (formData.value.skills.trim()) filledFields++

  return (filledFields / totalFields) * 100
})

// Watch for current job checkbox
watch(() => formData.value.experience, (newExp) => {
  newExp.forEach(exp => {
    if (exp.current) {
      exp.endDate = ''
    }
  })
}, { deep: true })

const showValidationAlert = (message) => {
  validationMessage.value = message
  showValidationError.value = true
  setTimeout(() => {
    showValidationError.value = false
  }, 4000)
}

const saveResume = async () => {
  if (!isFormComplete.value) {
    const errors = validateRequiredFields()
    showValidationAlert(`Please complete all required fields:\n• ${errors.join('\n• ')}`)
    return
  }
  
  isSaving.value = true
  
  try {
    // Get current user from localStorage (from login)
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    
    // For demo purposes, we'll save without user_id
    // In a real app, you'd have proper user authentication
    // Prepare data for Supabase
    const resumeData = {
      // user_id will be NULL for demo purposes
      first_name: formData.value.personalInfo.fullName.split(' ')[0] || '',
      last_name: formData.value.personalInfo.fullName.split(' ').slice(1).join(' ') || '',
      phone: formData.value.personalInfo.phone,
      location: formData.value.personalInfo.location,
      professional_title: formData.value.experience[0]?.title || '',
      summary: formData.value.summary,
      skills: formData.value.skills.split(',').map(skill => skill.trim()).filter(Boolean),
      experience: formData.value.experience,
      education: formData.value.education,
      profile_visibility: 'PUBLIC'
    }
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('job_seeker_profiles')
      .upsert([resumeData], { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      })
    
    if (error) {
      throw error
    }
    
    // Also save to localStorage as backup
    localStorage.setItem('savedResume', JSON.stringify(formData.value))
    
    // Generate embeddings for the saved profile (if data exists)
    if (data && data.length > 0) {
      await generateEmbeddings(data[0].id)
    }
    
    isSaving.value = false
    showSaveSuccess.value = true
    
    console.log('Resume saved successfully:', data)
    
  } catch (error) {
    console.error('Error saving resume:', error)
    isSaving.value = false
    showValidationAlert(`Error saving resume: ${error.message}`)
  }
}

const loadSavedResume = async () => {
  try {
    // Get current user from localStorage (from login)
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    
    // For demo purposes, we'll just use localStorage since we can't match by user_id
    // In a real app, you'd have proper user authentication with UUIDs
    if (!currentUser.email) {
      // Fallback to localStorage if no user ID
      const saved = localStorage.getItem('savedResume')
      if (saved) {
        formData.value = JSON.parse(saved)
        return
      } else {
        showValidationAlert('No saved resume found. Please fill out the form first.')
        return
      }
    }
    
    // For demo purposes, just use localStorage
    // In a real app, you'd load from Supabase using user authentication
    const saved = localStorage.getItem('savedResume')
    if (saved) {
      formData.value = JSON.parse(saved)
    } else {
      showValidationAlert('No saved resume found. Please fill out the form first.')
    }
    return
    
  } catch (error) {
    console.error('Error loading resume:', error)
    showValidationAlert(`Error loading resume: ${error.message}`)
  }
}

const clearForm = () => {
  if (confirm('Are you sure you want to clear all form data?')) {
    formData.value = {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: ''
      },
      summary: '',
      experience: [
        {
          title: '',
          company: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        }
      ],
      education: [
        {
          degree: '',
          field: '',
          institution: '',
          year: '',
          gpa: ''
        }
      ],
      skills: ''
    }
  }
}

const handleFindMatches = () => {
  if (!isFormComplete.value) {
    const errors = validateRequiredFields()
    showValidationAlert(`Please complete all required fields before finding matches:\n• ${errors.join('\n• ')}`)
    return
  }
  showMatching.value = true
}

const getMatchColor = (score) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const addExperience = () => {
  formData.value.experience.push({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  })
}

const removeExperience = (index) => {
  formData.value.experience.splice(index, 1)
}

const addEducation = () => {
  formData.value.education.push({
    degree: '',
    field: '',
    institution: '',
    year: '',
    gpa: ''
  })
}

const removeEducation = (index) => {
  formData.value.education.splice(index, 1)
}

// Function to generate embeddings for the profile
const generateEmbeddings = async (profileId) => {
  if (!profileId) return
  
  try {
    // Call the backend script to generate embeddings
    // This would typically be done via an API endpoint
    // For now, we'll just log that embeddings should be generated
    console.log('Generating embeddings for profile:', profileId)
    
    // In a real implementation, you'd call your backend API here
    // const response = await fetch('/api/generate-embeddings', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ profileId })
    // })
    
  } catch (error) {
    console.error('Error generating embeddings:', error)
  }
}
</script>

<style scoped>
/* Custom styles for form elements */
input:focus, textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
