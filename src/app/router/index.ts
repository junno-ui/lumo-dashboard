import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    isRedirect?: boolean
    title?: string
    icon?: string
  }
}

const analyticsRoutes: RouteRecordRaw[] = [
  {
    path: 'revenue',
    name: 'RevenueAnalytics',
    component: () => import('@/modules/analytics/pages/RevenuePage.vue'),
    meta: { title: 'Revenue Analytics' }
  },
  {
    path: 'usage',
    name: 'UsageAnalytics',
    component: () => import('@/modules/analytics/pages/UsagePage.vue'),
    meta: { title: 'Usage Analytics' }
  },
  {
    path: 'active-users',
    name: 'ActiveUsers',
    component: () => import('@/modules/analytics/pages/ActiveUsersPage.vue'),
    meta: { title: 'Active Users' }
  }
]

const subscriptionRoutes: RouteRecordRaw[] = [
  {
    path: 'plans',
    name: 'Plans',
    component: () => import('@/modules/subscriptions/pages/PlansPage.vue'),
    meta: { title: 'Plans' }
  },
  {
    path: 'user-subscriptions',
    name: 'UserSubscriptions',
    component: () => import('@/modules/subscriptions/pages/UserSubscriptionsPage.vue'),
    meta: { title: 'User Subscriptions' }
  },
  {
    path: 'usage-limits',
    name: 'UsageLimits',
    component: () => import('@/modules/subscriptions/pages/UsageLimitsPage.vue'),
    meta: { title: 'Usage Limits' }
  }
]

const billingRoutes: RouteRecordRaw[] = [
  {
    path: 'overview',
    name: 'BillingOverview',
    component: () => import('@/modules/billing/pages/OverviewPage.vue'),
    meta: { title: 'Billing Overview' }
  },
  {
    path: 'invoices',
    name: 'Invoices',
    component: () => import('@/modules/billing/pages/InvoicesPage.vue'),
    meta: { title: 'Invoices' }
  },
  {
    path: 'payment-methods',
    name: 'PaymentMethods',
    component: () => import('@/modules/billing/pages/PaymentMethodsPage.vue'),
    meta: { title: 'Payment Methods' }
  }
]

const userRoutes: RouteRecordRaw[] = [
  {
    path: 'all',
    name: 'AllUsers',
    component: () => import('@/modules/users/pages/UsersPage.vue'),
    meta: { title: 'All Users' }
  },
  {
    path: 'roles',
    name: 'Roles',
    component: () => import('@/modules/users/pages/RolesPage.vue'),
    meta: { title: 'Roles' }
  },
  {
    path: 'activity-log',
    name: 'ActivityLog',
    component: () => import('@/modules/users/pages/ActivityLogPage.vue'),
    meta: { title: 'Activity Log' }
  }
]

const settingsRoutes: RouteRecordRaw[] = [
  {
    path: 'profile',
    name: 'ProfileSettings',
    component: () => import('@/modules/settings/pages/ProfilePage.vue'),
    meta: { title: 'Profile Settings' }
  },
  {
    path: 'organization',
    name: 'OrganizationSettings',
    component: () => import('@/modules/settings/pages/OrganizationPage.vue'),
    meta: { title: 'Organization Settings' }
  },
  {
    path: 'preferences',
    name: 'Preferences',
    component: () => import('@/modules/settings/pages/PreferencesPage.vue'),
    meta: { title: 'Preferences' }
  },
  {
    path: 'security',
    name: 'SecuritySettings',
    component: () => import('@/modules/settings/pages/SecurityPage.vue'),
    meta: { title: 'Security Settings' }
  }
]

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/auth/login'
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/modules/auth/pages/LoginPage.vue'),
    meta: { title: 'Login' }
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: () => import('@/modules/auth/pages/RegisterPage.vue'),
    meta: { title: 'Register' }
  },
  {
    path: '/dashboard',
    component: () => import('@/app/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard/home' },
      {
        path: 'home',
        name: 'DashboardHome',
        component: () => import('@/modules/dashboard/pages/DashboardOverviewPage.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'inbox',
        name: 'Inbox',
        component: () => import('@/modules/communication/pages/InboxPage.vue'),
        meta: { title: 'Inbox' }
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: () => import('@/modules/communication/pages/NotificationsPage.vue'),
        meta: { title: 'Notifications' }
      },
      {
        path: 'analytics',
        redirect: '/dashboard/analytics/revenue',
        children: analyticsRoutes
      },
      {
        path: 'subscriptions',
        redirect: '/dashboard/subscriptions/plans',
        children: subscriptionRoutes
      },
      {
        path: 'billing',
        redirect: '/dashboard/billing/overview',
        children: billingRoutes
      },
      {
        path: 'users',
        redirect: '/dashboard/users/all',
        children: userRoutes
      },
      {
        path: 'settings',
        redirect: '/dashboard/settings/profile',
        children: settingsRoutes
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/app/pages/NotFoundPage.vue'),
    meta: { title: '404 Not Found' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (_to, _from, next) => {
  next()
})

export default router
