<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { NavigationMenuItem } from '@nuxt/ui'

const links: NavigationMenuItem[] = [
  { label: 'Dashboard', icon: 'heroicons:squares-2x2', to: '/dashboard' },
  { 
    label: 'Analytics', 
    icon: 'heroicons:chart-bar', 
    children: [
      { label: 'Revenue', to: '/analytics/revenue' },
      { label: 'Usage', to: '/analytics/usage' },
      { label: 'Active Users', to: '/analytics/active-users' }
    ]
  },
  { 
    label: 'Subscriptions', 
    icon: 'heroicons:credit-card', 
    children: [
      { label: 'Plans', to: '/subscriptions/plans' },
      { label: 'User Subscriptions', to: '/subscriptions/user-subscriptions' },
      { label: 'Usage Limits', to: '/subscriptions/usage-limits' }
    ]
  },
  { 
    label: 'Billing', 
    icon: 'heroicons:banknotes', 
    children: [
      { label: 'Overview', to: '/billing/overview' },
      { label: 'Invoices', to: '/billing/invoices' },
      { label: 'Payment Methods', to: '/billing/payment-methods' }
    ]
  },
  { 
    label: 'Users', 
    icon: 'heroicons:users', 
    children: [
      { label: 'All Users', to: '/users/all' },
      { label: 'Roles', to: '/users/roles' },
      { label: 'Activity Log', to: '/users/activity-log' }
    ]
  },
  { 
    label: 'Settings', 
    icon: 'heroicons:cog-6-tooth', 
    children: [
      { label: 'Profile', to: '/settings/profile' },
      { label: 'Organization', to: '/settings/organization' },
      { label: 'Preferences', to: '/settings/preferences' },
      { label: 'Security', to: '/settings/security' }
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
  <!-- Expanded -->
  <div
    v-if="!collapsed"
    class="relative flex items-center gap-4 px-2 py-2"
  >
    <!-- Logo -->
    <div class="relative group">
      <div
        class="absolute inset-0 bg-blue-500/30 dark:bg-blue-400/20
               rounded-xl blur-lg opacity-0 group-hover:opacity-100
               transition-all duration-300"
      />
      <div
        class="relative h-10 w-10 rounded-xl bg-gradient-to-br
               from-blue-600 via-violet-600 to-fuchsia-600
               flex items-center justify-center text-white
               shadow-lg shadow-blue-500/20 ring-1 ring-white/20"
      >
        <Icon icon="solar:stars-bold-duotone" class="w-6 h-6" />
      </div>
    </div>

    <!-- Title -->
    <div class="flex flex-col">
      <span
        class="text-xl font-bold bg-clip-text text-transparent
               bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900
               dark:from-white dark:via-blue-100 dark:to-white"
      >
        Lumo
      </span>
      <span
        class="text-[10px] font-medium text-gray-500 dark:text-gray-400
               -mt-1 tracking-wider uppercase"
      >
        Dashboard
      </span>
    </div>

    <!-- 🔥 Collapse Button di POJOK -->
    <UDashboardSidebarCollapse
      class="absolute top-2 right-2
             rounded-lg p-1
             hover:bg-gray-100 dark:hover:bg-slate-800
             transition"
    />
  </div>

  <!-- Collapsed -->
  <div
    v-else
    class="relative flex justify-center py-2"
  >
    <!-- Icon only -->
    <div
      class="h-9 w-9 rounded-xl bg-gradient-to-br
             from-blue-600 via-violet-600 to-fuchsia-600
             flex items-center justify-center text-white
             shadow-lg shadow-blue-500/20 ring-1 ring-white/20"
    >
      <Icon icon="solar:stars-bold-duotone" class="w-5 h-5" />
    </div>

    <!-- 🔥 Collapse Button tetap di pojok -->
    <UDashboardSidebarCollapse
      class="absolute top-2 right-2
             rounded-lg p-1
             hover:bg-gray-100 dark:hover:bg-slate-800
             transition"
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
