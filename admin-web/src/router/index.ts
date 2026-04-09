import { createRouter, createWebHistory, type Router, type RouterHistory, type RouteRecordRaw } from 'vue-router'
import type { Pinia } from 'pinia'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import PostEditorView from '../views/PostEditorView.vue'
import PostListView from '../views/PostListView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'post-list' },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/posts',
    name: 'post-list',
    component: PostListView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/posts/new',
    name: 'post-create',
    component: PostEditorView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/posts/:id/edit',
    name: 'post-edit',
    component: PostEditorView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

export function createAdminRouter(options: { history?: RouterHistory; pinia?: Pinia } = {}): Router {
  const router = createRouter({
    history: options.history ?? createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior() {
      return { top: 0 }
    },
  })

  router.beforeEach((to) => {
    const authStore = options.pinia ? useAuthStore(options.pinia) : useAuthStore()
    authStore.hydrate()

    if (to.name === 'login' && authStore.isAuthenticated) {
      return { name: 'post-list' }
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return {
        name: 'login',
        query: { redirect: to.fullPath },
      }
    }

    return true
  })

  return router
}

export default createAdminRouter()
