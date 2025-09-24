import { createRouter, createWebHistory } from 'vue-router'

// Import your views
import Login from '../views/Login.vue'
import JobUpload from '../views/HR-JobUpload.vue'
import results from '../views/HR-MatchedResult.vue'
import shortlist from '../views/HR-ShortlistPage.vue'
import hrhome from '../views/HR-HomePage.vue'
import resume from '../views/Jobseeker-ResumeForm.vue'  
import jshome from '../views/Jobseeker-HomePage.vue'
import jobmatch from '../views/Jobseeker-JobMatching.vue'
import matchedresult from '../views/Jobseeker-MatchedResult.vue'
import oboardingDashboard from '../views/Jobseeker-Onboarding.vue'
import material from '../views/HR-material.vue'
import ViewResume from '../views/ViewResume.vue'
import talentpool from '../views/HR-TalentPool.vue'
import onboardingmanagement from '../views/HR-OnboardingManagement.vue' 
import jobbrowse from '../views/Jobseeker-JobBrowse.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/upload', name: 'JobUpload', component: JobUpload },
  { path: '/results', name: 'results', component: results },
  { path: '/shortlist', name: 'Shortlist', component: shortlist },
  { path: '/hrhome', name: 'HRHome', component: hrhome },
  { path: '/resume', name: 'ResumeForm', component: resume },
  { path: '/jshome', name: 'JobSeekerHome', component: jshome },
  { path: '/jobmatch', name: 'JobMatching', component: jobmatch },
  { path: '/matchedresult', name: 'MatchedResult', component: matchedresult },
  { path: '/onboarding', name: 'Onboarding', component: oboardingDashboard },
  { path: '/material', name: 'Material', component: material },
  { path: '/view-resume', name: 'ViewResume', component: ViewResume },
  { path: '/talentpool', name: 'TalentPool', component: talentpool },
  { path: '/onboarding-management', name: 'OnboardingManagement', component: onboardingmanagement },
  { path: '/jobbrowse', name: 'JobBrowse', component: jobbrowse }

]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Prevent navigating to Onboarding when not enrolled to a company
router.beforeEach(async (to, from, next) => {
  if (to.name !== 'Onboarding') return next()
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    const supabaseUrl = localStorage.getItem('supabaseUrl') || import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = localStorage.getItem('supabaseKey') || import.meta.env.VITE_SUPABASE_ANON_KEY
    if (!currentUser?.id || !supabaseUrl || !supabaseKey) return next()
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(supabaseUrl, supabaseKey)
    const { data: profile } = await sb
      .from('job_seeker_profiles')
      .select('company_id')
      .eq('user_id', currentUser.id)
      .single()
    if (!profile?.company_id) {
      sessionStorage.setItem('showOnboardingAccessModal', '1')
      return next({ name: 'JobSeekerHome' })
    }
    return next()
  } catch (e) {
    return next()
  }
})

export default router
