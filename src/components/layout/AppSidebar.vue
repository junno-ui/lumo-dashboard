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

const footerLinks: NavigationMenuItem[] = [
  {
    label: 'Logout',
    icon: 'heroicons:arrow-left-on-rectangle',
    to: '/login',
    iconClass: 'text-red-500 group-hover:text-red-600',
    labelClass: 'text-red-500 group-hover:text-red-600'
  }
]
</script>

<template>
  <UDashboardSidebar
    collapsible
    resizable
    class="bg-primary-50 dark:bg-primary-950/50 backdrop-blur-xl"
    :ui="{
      footer: 'border-t border-primary-100 dark:border-primary-800/50',
      border: 'border-r border-primary-100 dark:border-primary-800/50'
    }"
  >
    <template #header="{ collapsed }">
      <div 
        class="flex items-center px-3 py-4 w-full group/header transition-all duration-300 relative"
        :class="[collapsed ? 'flex-col justify-center gap-3' : 'flex-row justify-between gap-2']"
      >
        <div class="flex items-center overflow-visible">
          <UBadge
            :avatar="{
              src: 'https://github.com/nuxt.png'
            }"
            size="lg"
            variant="soft"
            class="flex-shrink-0 !rounded-xl ring-1 ring-primary-100/50 dark:ring-primary-900/50 shadow-sm transition-all duration-300"
            :class="[collapsed ? 'w-10 h-10 flex items-center justify-center p-0 pt-5 ' : 'px-3 py-1.5']"
          >
            <span v-if="!collapsed" class="font-bold tracking-tight text-gray-900 dark:text-white ml-2 whitespace-nowrap">Lumo Dashboard</span>
          </UBadge>
        </div>

        <UDashboardSidebarCollapse
          class="shrink-0 p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-slate-700 transition-all"
          :class="[collapsed ? 'opacity-100' : 'opacity-0 group-hover/header:opacity-100']"
        />
      </div>
    </template>


    <!-- ================= CONTENT ================= -->
    <template #default="{ collapsed }">
      <!-- Search -->
      <div v-show="!collapsed" class="px-2 mb-2">
        <UButton
          label="Search..."
          icon="i-heroicons-magnifying-glass"
          color="gray"
          variant="ghost"
          block
          class="justify-start text-gray-400"
        >
          <template #trailing>
            <div class="flex items-center gap-0.5 ms-auto">
              <UKbd value="Ctrl" size="xs" />
              <UKbd value="K" size="xs" />
            </div>
          </template>
        </UButton>
      </div>

      <!-- Navigation -->
      <UNavigationMenu
        :collapsed="collapsed"
        :items="links"
        orientation="vertical"
        :ui="{ wrapper: 'px-2 space-y-1' }"
      />
    </template>

    <!-- ================= FOOTER ================= -->
    <template #footer="{ collapsed }">
      <UNavigationMenu
        :collapsed="collapsed"
        :items="footerLinks"
        orientation="vertical"
        :ui="{ wrapper: 'px-2' }"
      />
    </template>
  </UDashboardSidebar>
</template>
