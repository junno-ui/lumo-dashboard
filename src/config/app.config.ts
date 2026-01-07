import type { NavigationMenuItem } from '@nuxt/ui'

export const appConfig = {
  name: 'Vue Starter',
  subtitle: 'Insights at a Glance',
  icon: 'duo-icons:dashboard',
  logo: {
    alt: 'Vue Starter Logo',
    light: '/logo-light.svg',
    dark: '/logo-dark.svg'
  },
  theme: {
    customizable: true,
    defaultColor: 'green'
  }
}

export const navigationMenu: NavigationMenuItem[] = [
  { label: 'Dashboard', icon: 'heroicons:squares-2x2', to: '/dashboard/home' },

  {
    label: 'Analytics',
    icon: 'heroicons:chart-bar',
    children: [ 
      { label: 'Revenue', to: '/dashboard/analytics/revenue', icon: 'heroicons:banknotes' },
      { label: 'Usage', to: '/dashboard/analytics/usage', icon: 'heroicons:chart-bar' },
      { label: 'Active Users', to: '/dashboard/analytics/active-users', icon: 'heroicons:user-group' }
    ]
  },

  {
    label: 'Subscriptions',
    icon: 'heroicons:credit-card',
    children: [
      { label: 'Plans', to: '/dashboard/subscriptions/plans', icon: 'heroicons:rectangle-stack' },
      { label: 'User Subscriptions', to: '/dashboard/subscriptions/user-subscriptions', icon: 'heroicons:user-group' },
      { label: 'Usage Limits', to: '/dashboard/subscriptions/usage-limits', icon: 'heroicons:chart-pie' }
    ]
  },

  {
    label: 'Billing',
    icon: 'heroicons:banknotes',
    children: [
      { label: 'Overview', to: '/dashboard/billing/overview', icon: 'heroicons:document-chart-bar' },
      { label: 'Invoices', to: '/dashboard/billing/invoices', icon: 'heroicons:document-text' },
      { label: 'Payment Methods', to: '/dashboard/billing/payment-methods', icon: 'heroicons:credit-card' }
    ]
  },

  {
    label: 'Users',
    icon: 'heroicons:users',
    children: [
      { label: 'All Users', to: '/dashboard/users/all', icon: 'heroicons:users' },
      { label: 'Roles', to: '/dashboard/users/roles', icon: 'heroicons:shield-check' },
      { label: 'Activity Log', to: '/dashboard/users/activity-log', icon: 'heroicons:clock' }
    ]
  },

  {
    label: 'Settings',
    icon: 'heroicons:cog-6-tooth',
    children: [
      { label: 'Profile', to: '/dashboard/settings/profile', icon: 'heroicons:user-circle' },
      { label: 'Organization', to: '/dashboard/settings/organization', icon: 'heroicons:building-office' },
      { label: 'Preferences', to: '/dashboard/settings/preferences', icon: 'heroicons:adjustments-horizontal' },
      { label: 'Security', to: '/dashboard/settings/security', icon: 'heroicons:lock-closed' }
    ]
  }
]
