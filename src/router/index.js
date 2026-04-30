import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import LawDetail from '../views/LawDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/law/:slug',
    name: 'LawDetail',
    component: LawDetail
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
