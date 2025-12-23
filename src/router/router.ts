import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    isRedirect?: boolean;
    title?: string;
    icon?: string;
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    redirect: '/auth/login'
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('../pages/LoginPage.vue'),
    meta: { title: 'Login' }
  },
  {
    path: '/',
    component: () => import('../layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../pages/DashboardPage.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'inbox',
        name: 'Inbox',
        component: () => import('../pages/InboxPage.vue'),
        meta: { title: 'Inbox' }
      },
      {
        path: 'lesson',
        name: 'Lesson',
        component: () => import('../pages/LessonPage.vue'),
        meta: { title: 'Your Lessons' }
      },
      {
        path: 'task',
        name: 'Task',
        component: () => import('../pages/TaskPage.vue'),
        meta: { title: 'Tasks' }
      },
      {
        path: 'group',
        name: 'Group',
        component: () => import('../pages/GroupPage.vue'),
        meta: { title: 'Groups' }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../pages/SettingsPage.vue'),
        meta: { title: 'Settings' }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (_to, _from, next) => {
  next()
})

export default router
