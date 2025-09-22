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
          Back to Candidates
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
              Work Experience
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
                <p class="text-gray-700 leading-relaxed" v-if="exp.description">{{ exp.description }}</p>
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

// Sample resume data - in real app, this would come from props, route params, or API
const resumeData = ref({
  personalInfo: {
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+60 12-345 6789',
    location: ' kuala lumpur, malaysia',
    linkedin: 'linkedin.com/in/sarahjohnson'
  },
  currentTitle: 'Senior React Developer',
  summary: 'Experienced React Developer with 6+ years of expertise in building scalable web applications. Proven track record of leading development teams and delivering high-quality software solutions. Passionate about modern web technologies and best practices.',
  skills: 'React, TypeScript, Node.js, GraphQL, AWS, Docker, Jest, MongoDB, Express.js, Git, Agile, Scrum',
  experience: [
    {
      title: 'Senior React Developer',
      company: 'Tech Solutions Inc.',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description: 'Lead development of customer-facing web applications using React and TypeScript. Mentored junior developers and implemented best practices for code quality and testing.'
    },
    {
      title: 'Frontend Developer',
      company: 'Digital Agency Co.',
      startDate: '2020-03',
      endDate: '2021-12',
      current: false,
      description: 'Developed responsive web applications for various clients using React, Vue.js, and modern CSS frameworks. Collaborated with design teams to implement pixel-perfect UI components.'
    },
    {
      title: 'Junior Web Developer',
      company: 'StartUp Ventures',
      startDate: '2018-06',
      endDate: '2020-02',
      current: false,
      description: 'Built and maintained company website and internal tools. Gained experience in full-stack development using JavaScript, Node.js, and MongoDB.'
    }
  ],
  education: [
    {
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      institution: 'University of California, Berkeley',
      year: '2018',
      gpa: '3.8'
    }
  ],
  matchScore: 92,
  languages: 'English (Native), Spanish (Conversational)',
  certifications: 'AWS Certified Developer, React Professional Certificate'
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
// Load resume data on mount (in real app, fetch from API based on candidate ID)
onMounted(() => {
  const candidateId = route.params.id || route.query.candidateId
  if (candidateId) {
    // In real app: fetchResumeData(candidateId)
    console.log('Loading resume for candidate:', candidateId)
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