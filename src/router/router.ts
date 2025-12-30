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
    component: () => import('../pages/auth/login.vue'),
    meta: { title: 'Login' }
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: () => import('../pages/auth/register.vue'),
    meta: { title: 'Register' }
  },
  {
    path: '/dashboard',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      // Redirect /dashboard to /dashboard/home
      { path: '', redirect: '/dashboard/home' },

      // Home dashboard page
      {
        path: 'home',
        name: 'DashboardHome',
        component: () => import('../pages/dashboard/index.vue'),
        meta: { title: 'Dashboard' }
      },

      // Inbox
      {
        path: 'inbox',
        name: 'Inbox',
        component: () => import('../pages/communication/inbox.vue'),
        meta: { title: 'Inbox' }
      },

      // Notifications
      {
        path: 'notifications',
        name: 'Notifications',
        component: () => import('../pages/communication/notifications.vue'),
        meta: { title: 'Notifications' }
      },

      // Analytics
      {
        path: 'analytics',
        redirect: '/dashboard/analytics/revenue',
        children: [
          { 
            path: 'revenue', 
            name: 'RevenueAnalytics',
            component: () => import('../pages/analytics/revenue.vue'), 
            meta: { title: 'Revenue Analytics' } 
          },
          { 
            path: 'usage', 
            name: 'UsageAnalytics',
            component: () => import('../pages/analytics/usage.vue'), 
            meta: { title: 'Usage Analytics' } 
          },
          { 
            path: 'active-users', 
            name: 'ActiveUsers',
            component: () => import('../pages/analytics/active-users.vue'), 
            meta: { title: 'Active Users' } 
          }
        ]
      },

      // Subscriptions
      {
        path: 'subscriptions',
        redirect: '/dashboard/subscriptions/plans',
        children: [
          { 
            path: 'plans', 
            name: 'Plans',
            component: () => import('../pages/subscriptions/plans.vue'), 
            meta: { title: 'Plans' } 
          },
          { 
            path: 'user-subscriptions', 
            name: 'UserSubscriptions',
            component: () => import('../pages/subscriptions/user-subscriptions.vue'), 
            meta: { title: 'User Subscriptions' } 
          },
          { 
            path: 'usage-limits', 
            name: 'UsageLimits',
            component: () => import('../pages/subscriptions/usage-limits.vue'), 
            meta: { title: 'Usage Limits' } 
          }
        ]
      },

      // Billing
      {
        path: 'billing',
        redirect: '/dashboard/billing/overview',
        children: [
          { 
            path: 'overview', 
            name: 'BillingOverview',
            component: () => import('../pages/billing/overview.vue'), 
            meta: { title: 'Billing Overview' } 
          },
          { 
            path: 'invoices', 
            name: 'Invoices',
            component: () => import('../pages/billing/invoices.vue'), 
            meta: { title: 'Invoices' } 
          },
          { 
            path: 'payment-methods', 
            name: 'PaymentMethods',
            component: () => import('../pages/billing/payment-methods.vue'), 
            meta: { title: 'Payment Methods' } 
          }
        ]
      },

      // Users
      {
        path: 'users',
        redirect: '/dashboard/users/all',
        children: [
          { 
            path: 'all', 
            name: 'AllUsers',
            component: () => import('../pages/users/all.vue'), 
            meta: { title: 'All Users' } 
          },
          { 
            path: 'roles', 
            name: 'Roles',
            component: () => import('../pages/users/roles.vue'), 
            meta: { title: 'Roles' } 
          },
          { 
            path: 'activity-log', 
            name: 'ActivityLog',
            component: () => import('../pages/users/activity-log.vue'), 
            meta: { title: 'Activity Log' } 
          }
        ]
      },

      // Settings
      {
        path: 'settings',
        redirect: '/dashboard/settings/profile',
        children: [
          { 
            path: 'profile', 
            name: 'ProfileSettings',
            component: () => import('../pages/settings/profile.vue'), 
            meta: { title: 'Profile Settings' } 
          },
          { 
            path: 'organization', 
            name: 'OrganizationSettings',
            component: () => import('../pages/settings/organization.vue'), 
            meta: { title: 'Organization Settings' } 
          },
          { 
            path: 'preferences', 
            name: 'Preferences',
            component: () => import('../pages/settings/preferences.vue'), 
            meta: { title: 'Preferences' } 
          },
          { 
            path: 'security', 
            name: 'SecuritySettings',
            component: () => import('../pages/settings/security.vue'), 
            meta: { title: 'Security Settings' } 
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (_to, _from, next) => {
  next()
})

export default router
