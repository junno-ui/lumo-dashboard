<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const links: NavigationMenuItem[] = [
  { label: 'Dashboard', icon: 'heroicons:squares-2x2', to: '/dashboard' },
  {
    label: 'Analytics',
    icon: 'heroicons:chart-bar',
    children: [
      { label: 'Revenue', to: '/analytics/revenue', icon: 'heroicons:banknotes' },
      { label: 'Usage', to: '/analytics/usage', icon: 'heroicons:chart-bar' },
      { label: 'Active Users', to: '/analytics/active-users', icon: 'heroicons:user-group' }
    ]
  },
  {
    label: 'Subscriptions',
    icon: 'heroicons:credit-card',
    children: [
      { label: 'Plans', to: '/subscriptions/plans', icon: 'heroicons:rectangle-stack' },
      { label: 'User Subscriptions', to: '/subscriptions/user-subscriptions', icon: 'heroicons:user-group' },
      { label: 'Usage Limits', to: '/subscriptions/usage-limits', icon: 'heroicons:chart-pie' }
    ]
  },
  {
    label: 'Billing',
    icon: 'heroicons:banknotes',
    children: [
      { label: 'Overview', to: '/billing/overview', icon: 'heroicons:document-chart-bar' },
      { label: 'Invoices', to: '/billing/invoices', icon: 'heroicons:document-text' },
      { label: 'Payment Methods', to: '/billing/payment-methods', icon: 'heroicons:credit-card' }
    ]
  },
  {
    label: 'Users',
    icon: 'heroicons:users',
    children: [
      { label: 'All Users', to: '/users/all', icon: 'heroicons:users' },
      { label: 'Roles', to: '/users/roles', icon: 'heroicons:shield-check' },
      { label: 'Activity Log', to: '/users/activity-log', icon: 'heroicons:clock' }
    ]
  },
  {
    label: 'Settings',
    icon: 'heroicons:cog-6-tooth',
    children: [
      { label: 'Profile', to: '/settings/profile', icon: 'heroicons:user-circle' },
      { label: 'Organization', to: '/settings/organization', icon: 'heroicons:building-office' },
      { label: 'Preferences', to: '/settings/preferences', icon: 'heroicons:adjustments-horizontal' },
      { label: 'Security', to: '/settings/security', icon: 'heroicons:lock-closed' }
    ]
  }
]
</script>

<template>
  <UDashboardSidebar
    collapsible
    resizable
    :min-size="12"
    class="bg-neutral-50 dark:bg-neutral-950/50 backdrop-blur-xl"
    :ui="{
      footer: 'border-t border-primary-100 dark:border-primary-800/50',
      border: 'border-r border-primary-100 dark:border-primary-800/50'
    }"
  >
    <!-- ================= HEADER ================= -->
    <template #header="{ collapsed }">
      <div class="px-2 py-4">
        <div
          v-if="!collapsed"
          class="flex items-center h-10 px-3 rounded-xl
                 hover:bg-white/60 dark:hover:bg-white/5 transition-colors"
        >
          <UAvatar
            src="https://github.com/nuxt.png"
            size="sm"
            class="shrink-0 ring-1 ring-primary-100/60 dark:ring-primary-900/50"
          />
          <span class="ml-3 font-bold tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
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

    <!-- ================= FOOTER ================= -->
    <template #footer="{ collapsed }">
      <!-- Logout dihapus. Footer hanya collapse button -->
      <div class="px-2 py-3">
        <div class="flex" :class="collapsed ? 'justify-center' : 'justify-end'">
            <UDashboardSidebarCollapse :label="collapsed ? '' : 'Collapse'" class="w-full" />
        </div>
      </div>
    </template>
  </UDashboardSidebar>
</template>
