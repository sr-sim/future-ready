<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Actions -->
      <div class="flex justify-between items-center mb-8">
        <button
          @click="goBack"
          class="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeftIcon class="h-5 w-5 mr-2" />
          Back
        </button>
        <div class="flex gap-3">
          <button
            @click="downloadPDF"
            class="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
          >
            <DownloadIcon class="h-5 w-5 mr-2" />
            Download PDF
          </button>
          <!-- <button
            @click="printResume"
            class="flex items-center px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-md"
          >
            <PrinterIcon class="h-5 w-5 mr-2" />
            Print
          </button> -->
        </div>
      </div>

      <!-- Resume Container -->
      <div 
        id="resume-content"
        class="bg-white shadow-xl rounded-lg overflow-hidden print:shadow-none print:rounded-none"
      >
        <!-- Resume Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-3xl font-bold mb-2">{{ resumeData.personalInfo.fullName }}</h1>
              <p class="text-blue-100 text-lg mb-4">{{ resumeData.currentTitle || 'Professional' }}</p>
              <div class="flex flex-wrap gap-4 text-sm">
                <div class="flex items-center" v-if="resumeData.personalInfo.email">
                  <MailIcon class="h-4 w-4 mr-2" />
                  {{ resumeData.personalInfo.email }}
                </div>
                <div class="flex items-center" v-if="resumeData.personalInfo.phone">
                  <PhoneIcon class="h-4 w-4 mr-2" />
                  {{ resumeData.personalInfo.phone }}
                </div>
                <div class="flex items-center" v-if="resumeData.personalInfo.location">
                  <MapPinIcon class="h-4 w-4 mr-2" />
                  {{ resumeData.personalInfo.location }}
                </div>
                <div class="flex items-center" v-if="resumeData.personalInfo.linkedin">
                  <LinkedinIcon class="h-4 w-4 mr-2" />
                  LinkedIn Profile
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-8">
          <!-- Professional Summary -->
          <section v-if="resumeData.summary" class="mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              Professional Summary
            </h2>
            <p class="text-gray-700 leading-relaxed">{{ resumeData.summary }}</p>
          </section>

          <!-- Skills -->
          <section v-if="resumeData.skills" class="mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              Core Skills
            </h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in skillsList"
                :key="skill"
                class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {{ skill }}
              </span>
            </div>
          </section>

          <!-- Work Experience -->
          <section v-if="resumeData.experience && resumeData.experience.length > 0" class="mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              Working Experience
            </h2>
            <div class="space-y-6">
              <div
                v-for="(exp, index) in resumeData.experience"
                :key="index"
                class="border-l-4 border-blue-200 pl-6 relative"
              >
                <div class="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">{{ exp.title }}</h3>
                    <p class="text-blue-600 font-medium">{{ exp.company }}</p>
                  </div>
                  <div class="text-sm text-gray-500 text-right">
                    {{ formatDate(exp.startDate) }} - {{ exp.current ? 'Present' : formatDate(exp.endDate) }}
                  </div>
                </div>
                <div v-if="exp.description">
                  <ul
                    v-if="parseDescription(exp.description).length > 1"
                    class="list-disc pl-5 text-gray-700 leading-relaxed"
                  >
                    <li v-for="(item, i) in parseDescription(exp.description)" :key="i">
                      {{ item }}
                    </li>
                  </ul>
                  <p v-else class="text-gray-700 leading-relaxed whitespace-pre-line">{{ exp.description }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Education -->
          <section v-if="resumeData.education && resumeData.education.length > 0" class="mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              Education
            </h2>
            <div class="space-y-4">
              <div
                v-for="(edu, index) in resumeData.education"
                :key="index"
                class="border-l-4 border-green-200 pl-6 relative"
              >
                <div class="absolute -left-2 top-0 w-4 h-4 bg-green-600 rounded-full"></div>
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">{{ edu.degree }}</h3>
                    <p class="text-green-600 font-medium">{{ edu.field }}</p>
                    <p class="text-gray-600">{{ edu.institution }}</p>
                  </div>
                  <div class="text-right text-sm text-gray-500">
                    <div>{{ edu.year }}</div>
                    <div v-if="edu.gpa" class="font-medium">GPA: {{ edu.gpa }}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Additional Information -->
          <section v-if="resumeData.additionalInfo" class="mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              Additional Information
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-if="resumeData.languages">
                <h3 class="font-semibold text-gray-700 mb-2">Languages</h3>
                <p class="text-gray-600">{{ resumeData.languages }}</p>
              </div>
              <div v-if="resumeData.certifications">
                <h3 class="font-semibold text-gray-700 mb-2">Certifications</h3>
                <p class="text-gray-600">{{ resumeData.certifications }}</p>
              </div>
            </div>
          </section>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-8 py-4 border-t">
          <div class="flex justify-between items-center text-sm text-gray-500">
            <div>Generated on {{ new Date().toLocaleDateString() }}</div>
            <div>Professional Resume</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { 
  ArrowLeftIcon, 
  DownloadIcon, 
  PrinterIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  LinkedinIcon
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// Reactive resume data loaded from database
const resumeData = ref({
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: ''
  },
  currentTitle: '',
  summary: '',
  skills: '',
  experience: [],
  education: [],
  languages: '',
  certifications: ''
})

// Computed property to parse skills string into array
const skillsList = computed(() => {
  if (!resumeData.value.skills) return []
  return resumeData.value.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
})

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

// Convert description string into bullet items
// Accepts either multi-line text or inline ' - ' bullets
const parseDescription = (text) => {
  if (!text) return []
  // Prioritize newlines
  const byLine = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  if (byLine.length > 1) return byLine
  // Fallback: split by a dash bullet pattern
  const byDash = text
    .split(/\s+-\s+/)
    .map(s => s.replace(/^[-•\s]+/, '').trim())
    .filter(Boolean)
  return byDash.length > 1 ? byDash : [text.trim()]
}

// Navigation
const goBack = () => {
  router.go(-1) // Go back to previous page
}

// Print functionality
const printResume = () => {
  window.print()
}
// const downloadPDF = async () => {
//   try {
//     const sourceEl = document.getElementById('resume-content');
//     if (!sourceEl) throw new Error('Resume element not found');

//     const resumeContent = sourceEl.outerHTML;

//     const printWindow = window.open('', '_blank');

//     // Build the full HTML in one go
//     const html = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="utf-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Resume - ${resumeData.value.personalInfo.fullName}</title>
//           <!-- ✅ Use Tailwind CSS link for static build -->
//           <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
//           <style>
//             @media print {
//               body { margin: 0; }
//               button, .no-print { display: none !important; }
//               .print\\:shadow-none { box-shadow: none !important; }
//               .print\\:rounded-none { border-radius: 0 !important; }
//               .min-h-screen { min-height: auto !important; }
//             }
//           </style>
//         </head>
//         <body class="bg-white">
//           ${resumeContent}
//         </body>
//       </html>
//     `;

//     printWindow.document.open();
//     printWindow.document.write(html);
//     printWindow.document.close();

//     // Wait a short time to ensure CSS is applied
//     printWindow.onload = () => {
//       setTimeout(() => {
//         printWindow.focus();
//         printWindow.print();
//         printWindow.close();
//       }, 300); // small delay ensures styles load
//     };
//   } catch (err) {
//     console.error('Error generating PDF:', err);
//     alert('Failed to generate PDF. Please try again.');
//   }
// };
const downloadPDF = () => {
  try {
    const sourceEl = document.getElementById('resume-content');
    if (!sourceEl) throw new Error('Resume element not found');


    const opt = {
      margin:       0,
      filename:     `Resume-${resumeData.value.personalInfo.fullName}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(sourceEl).save();
  } catch (err) {
    console.error('Error generating PDF:', err);
    alert('Failed to generate PDF. Please try again.');
  }
};
// Load resume data from Supabase based on the current user or a provided candidateId
onMounted(async () => {
  try {
    const candidateId = route.params.id || route.query.candidateId
    let profile
    if (candidateId) {
      const { data, error } = await supabase
        .from('job_seeker_profiles')
        .select('*')
        .eq('id', candidateId)
        .single()
      if (error) throw error
      profile = data
    } else {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      if (!currentUser.id) throw new Error('User session not found')
      const { data, error } = await supabase
        .from('job_seeker_profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single()
      if (error) throw error
      profile = data
    }

    if (profile) {
      resumeData.value = {
        personalInfo: {
          fullName: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
          email: JSON.parse(localStorage.getItem('currentUser') || '{}').email || '',
          phone: profile.phone || '',
          location: profile.location || '',
          linkedin: profile.linkedin_url || ''
        },
        currentTitle: profile.experience && Array.isArray(profile.experience) && profile.experience[0]?.title ? profile.experience[0].title : '',
        summary: profile.summary || '',
        skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : (profile.skills || ''),
        experience: Array.isArray(profile.experience) ? profile.experience : [],
        education: Array.isArray(profile.education) ? profile.education : [],
        languages: profile.languages || '',
        certifications: profile.certifications || ''
      }
    }
  } catch (e) {
    console.error('Failed to load resume:', e)
  }
})
</script>

<style scoped>
@media print {
  .min-h-screen {
    min-height: auto;
  }
  
  button {
    display: none !important;
  }
  
  .shadow-xl {
    box-shadow: none !important;
  }
}
</style>