<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const links: NavigationMenuItem[] = [
  { label: 'Dashboard', icon: 'heroicons:squares-2x2', to: '/dashboard' }, // atau '/dashboard/home' kalau kamu pakai home

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


</script>

<template>
  <UDashboardSidebar
    collapsible
    resizable
    :min-size="12"
    class="bg-gray-50 dark:bg-gray-950 backdrop-blur-xl transition-colors duration-200"
    :ui="{
      footer: 'border-t border-gray-200 dark:border-gray-800/50',
      border: 'border-r border-gray-200 dark:border-gray-800/50'
    }"
  >
    <!-- ================= HEADER ================= -->
    <template #header="{ collapsed }">
      <div class="px-2 py-4">
        <div
          v-if="!collapsed"
          class="flex items-center h-10 px-3 rounded-xl
                 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <UIcon
            name="duo-icons:dashboard"
            class="w-6 h-6 text-primary-500"
          />
          <span class="ml-2.5 text-xs font-semibold  text-gray-900 dark:text-white whitespace-nowrap">
            Lumo Dashboard
          </span>
        </div>

        <div v-else class="flex justify-start">
          <UTooltip text="Lumo Dashboard" placement="right">
          <UAvatar src="https://github.com/nuxt.png" size="xs" class="ring-0" />
          </UTooltip>
        </div>
      </div>
    </template>

    <template #default="{ collapsed }">


      <!-- Navigation -->
      <UNavigationMenu
        :collapsed="collapsed"
        :items="links"
        orientation="vertical"
      />
    </template>

    <template #footer="{ collapsed }">
      <div class="px-2 py-3">
        <div class="flex" :class="collapsed ? 'justify-center' : 'justify-end'">
            <UDashboardSidebarCollapse :label="collapsed ? '' : 'Collapse'" class="w-full" />
        </div>
      </div>
    </template>
  </UDashboardSidebar>
</template>
