import { createRouter, createWebHistory } from 'vue-router'

// Import your views
import Login from '../views/Login.vue'
import JobUpload from '../views/JobUpload.vue'
import ResumeRanking from '../views/ResumeRanking.vue'
import shortlist from '../views/ShortlistPage.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/upload', name: 'JobUpload', component: JobUpload },
  { path: '/ranking', name: 'ResumeRanking', component: ResumeRanking },
  { path: '/shortlist', name: 'Shortlist', component: shortlist },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
