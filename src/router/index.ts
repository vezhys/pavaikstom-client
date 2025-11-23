import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '../services/authService'

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/routes',
    name: 'Routes',
    component: () => import('@/views/Items.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/points-of-interest',
    name: 'PointsOfInterest',
    component: () => import('@/views/PointsOfInterest.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/information-cards',
    name: 'InformationCards',
    component: () => import('@/views/InformationCards.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/Users.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  try {
    if (to.meta.requiresAuth && !authService.IsAuthenticated()) {
      next('/login')
    } else if (to.path === '/login' && authService.IsAuthenticated()) {
      next('/')
    } else {
      next()
    }
  } catch (error) {
    console.error('Router guard error:', error)
    next()
  }
})

export default router
