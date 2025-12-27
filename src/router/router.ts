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
          {
            path: 'inbox',
            name: 'Inbox',
            component: () => import('../pages/InboxPage.vue'),
            meta: { title: 'Inbox' }
          },
          {
            path: 'notifications',
            name: 'Notifications',
            component: () => import('../pages/NotificationsPage.vue'),
            meta: { title: 'Notifications' }
          },
      // Analytics
      {
        path: 'analytics',
        redirect: '/analytics/revenue',
        children: [
          { path: 'revenue', component: () => import('../pages/analytics/RevenuePage.vue'), meta: { title: 'Revenue Analytics' } },
          { path: 'usage', component: () => import('../pages/analytics/UsagePage.vue'), meta: { title: 'Usage Analytics' } },
          { path: 'active-users', component: () => import('../pages/analytics/ActiveUsersPage.vue'), meta: { title: 'Active Users' } }
        ]
      },
      // Subscriptions
      {
        path: 'subscriptions',
        redirect: '/subscriptions/plans',
        children: [
          { path: 'plans', component: () => import('../pages/subscriptions/PlansPage.vue'), meta: { title: 'Plans' } },
          { path: 'user-subscriptions', component: () => import('../pages/subscriptions/UserSubscriptionsPage.vue'), meta: { title: 'User Subscriptions' } },
          { path: 'usage-limits', component: () => import('../pages/subscriptions/UsageLimitsPage.vue'), meta: { title: 'Usage Limits' } }
        ]
      },
      // Billing
      {
        path: 'billing',
        redirect: '/billing/overview',
        children: [
          { path: 'overview', component: () => import('../pages/billing/OverviewPage.vue'), meta: { title: 'Billing Overview' } },
          { path: 'invoices', component: () => import('../pages/billing/InvoicesPage.vue'), meta: { title: 'Invoices' } },
          { path: 'payment-methods', component: () => import('../pages/billing/PaymentMethodsPage.vue'), meta: { title: 'Payment Methods' } }
        ]
      },
      // Users
      {
        path: 'users',
        redirect: '/users/all',
        children: [
          { path: 'all', component: () => import('../pages/users/UsersPage.vue'), meta: { title: 'All Users' } },
          { path: 'roles', component: () => import('../pages/users/RolesPage.vue'), meta: { title: 'Roles' } },
          { path: 'activity-log', component: () => import('../pages/users/ActivityLogPage.vue'), meta: { title: 'Activity Log' } }
        ]
      },
      // Settings
      {
        path: 'settings',
        redirect: '/settings/profile',
        children: [
          { path: 'profile', component: () => import('../pages/settings/ProfilePage.vue'), meta: { title: 'Profile Settings' } },
          { path: 'organization', component: () => import('../pages/settings/OrganizationPage.vue'), meta: { title: 'Organization Settings' } },
          { path: 'preferences', component: () => import('../pages/settings/PreferencesPage.vue'), meta: { title: 'Preferences' } },
          { path: 'security', component: () => import('../pages/settings/SecurityPage.vue'), meta: { title: 'Security Settings' } }
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
