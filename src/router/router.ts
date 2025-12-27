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
    path: '/auth/register',
    name: 'Register',
    component: () => import('../pages/RegisterPage.vue'),
    meta: { title: 'Register' }
  },
  {
    path: '/',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../pages/DashboardPage.vue'),
        meta: { title: 'Dashboard' }
      },
      // Analytics
      {
        path: 'analytics',
        redirect: '/analytics/revenue',
        children: [
          { path: 'revenue', component: () => import('../pages/analytics/RevenuePage.vue'), meta: { title: 'Revenue Analytics' } },
          { path: 'usage', component: () => import('../pages/PlaceholderPage.vue'), meta: { title: 'Usage Analytics' } },
          { path: 'active-users', component: () => import('../pages/PlaceholderPage.vue'), meta: { title: 'Active Users' } }
        ]
      },
      // Subscriptions
      {
        path: 'subscriptions',
        redirect: '/subscriptions/plans',
        children: [
          { path: 'plans', component: () => import('../pages/PlaceholderPage.vue'), meta: { title: 'Plans' } },
          { path: 'user-subscriptions', component: () => import('../pages/PlaceholderPage.vue'), meta: { title: 'User Subscriptions' } },
          { path: 'usage-limits', component: () => import('../pages/PlaceholderPage.vue'), meta: { title: 'Usage Limits' } }
        ]
      },
      // Billing
      {
        path: 'billing',
        redirect: '/billing/overview',
        children: [
          { path: 'overview', component: () => import('../pages/PlaceholderPage.vue'), meta: { title: 'Billing Overview' } },
          { path: 'invoices', component: () => import('../pages/PlaceholderPage.vue'), meta: { title: 'Invoices' } },
          { path: 'payment-methods', component: () => import('../pages/PlaceholderPage.vue'), meta: { title: 'Payment Methods' } }
        ]
      },
      // Users
      {
        path: 'users',
        redirect: '/users/all',
        children: [
          { path: 'all', component: () => import('../pages/users/UsersPage.vue'), meta: { title: 'All Users' } },
          { path: 'roles', component: () => import('../pages/PlaceholderPage.vue'), meta: { title: 'Roles' } },
          { path: 'activity-log', component: () => import('../pages/PlaceholderPage.vue'), meta: { title: 'Activity Log' } }
        ]
      },
      // Settings
      {
        path: 'settings',
        redirect: '/settings/profile',
        children: [
          { path: 'profile', component: () => import('../pages/PlaceholderPage.vue'), meta: { title: 'Profile Settings' } },
          { path: 'organization', component: () => import('../pages/PlaceholderPage.vue'), meta: { title: 'Organization Settings' } },
          { path: 'preferences', component: () => import('../pages/PlaceholderPage.vue'), meta: { title: 'Preferences' } },
          { path: 'security', component: () => import('../pages/PlaceholderPage.vue'), meta: { title: 'Security Settings' } }
        ]
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
