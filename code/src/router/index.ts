import { createRouter, createWebHistory } from 'vue-router'

// Import your views
import Login from '../views/Login.vue'
import JobUpload from '../views/JobUpload.vue'
import ResumeRanking from '../views/ResumeRanking.vue'
import shortlist from '../views/ShortlistPage.vue'
import Dashboard from '../views/Dashboard.vue'
import resume from '../views/User-ResumeForm.vue'  

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/upload', name: 'JobUpload', component: JobUpload },
  { path: '/ranking', name: 'ResumeRanking', component: ResumeRanking },
  { path: '/shortlist', name: 'Shortlist', component: shortlist },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/resume', name: 'ResumeForm', component: resume },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
