import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '../services/auth'
import AdminPanel from '../views/AdminPanel.vue'
import HomeworkPage from '../views/HomeworkPage.vue'
import Login from '../views/Login.vue'

const routes = [
  { 
    path: '/admin', 
    component: AdminPanel,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  { 
    path: '/homework', 
    component: HomeworkPage,
    meta: { requiresAuth: true }
  },
  { 
    path: '/login', 
    component: Login,
    meta: { requiresGuest: true }
  },
  { 
    path: '/', 
    redirect: '/homework' 
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const user = authService.getCurrentUser()
  
  if (to.meta.requiresAuth && !user) {
    next('/login')
  } else if (to.meta.requiresGuest && user) {
    next('/homework')
  } else if (to.meta.requiresAdmin && (!user || !authService.isAdmin(user))) {
    next('/homework')
  } else {
    next()
  }
})

export default router