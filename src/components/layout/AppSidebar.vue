<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { NavigationMenuItem } from '@nuxt/ui'

const links: NavigationMenuItem[] = [
  { label: 'Dashboard', icon: 'heroicons:squares-2x2', to: '/dashboard' },
  { label: 'Inbox', icon: 'heroicons:inbox', to: '/inbox', badge: 'New' },
  { label: 'Lesson', icon: 'heroicons:book-open', to: '/lesson' },
  { label: 'Task', icon: 'heroicons:clipboard-document-list', to: '/task' },
  { label: 'Group', icon: 'heroicons:user-group', to: '/group' },
]

const footerLinks: NavigationMenuItem[] = [
  { label: 'Settings', icon: 'heroicons:cog-6-tooth', to: '/settings' },
  { label: 'Logout', icon: 'heroicons:arrow-left-on-rectangle', to: '/login', iconClass: 'text-red-500 group-hover:text-red-600', labelClass: 'text-red-500 group-hover:text-red-600' }
]

</script>

<template>
  <UDashboardSidebar 
    collapsible 
    resizable 
    class="bg-gray-50/50 dark:bg-gray-950/50 backdrop-blur-xl"
    :ui="{ 
      footer: 'border-t border-gray-100 dark:border-gray-800/50',
      border: 'border-r border-gray-100 dark:border-gray-800/50'
    }"
  >
    <template #header="{ collapsed }">
      <div v-if="!collapsed" class="flex items-center gap-4 px-2 py-2">
         <div class="relative group">
            <div class="absolute inset-0 bg-blue-500/30 dark:bg-blue-400/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div class="relative h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
              <Icon icon="solar:stars-bold-duotone" class="w-6 h-6 animate-pulse-slow" />
            </div>
         </div>
         <div class="flex flex-col">
            <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 dark:from-white dark:via-blue-100 dark:to-white">Nova</span>
            <span class="text-[10px] font-medium text-gray-500 dark:text-gray-400 -mt-1 tracking-wider uppercase">Dashboard</span>
         </div>
      </div>
      <div v-else class="mx-auto py-2">
         <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 via-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
            <Icon icon="solar:stars-bold-duotone" class="w-5 h-5" />
         </div>
      </div>
    </template>

    <template #default="{ collapsed }">
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

        <UNavigationMenu
            :collapsed="collapsed"
            :items="links"
            orientation="vertical"
            :ui="{
                wrapper: 'px-2 space-y-1'
            }"
        />
    </template>

    <template #footer="{ collapsed }">
        <UDashboardSidebarCollapse />

        <div class="h-px bg-gray-200 dark:bg-gray-800/50 my-2 mx-2"></div>

        <UNavigationMenu
            :collapsed="collapsed"
            :items="footerLinks"
            orientation="vertical"
             :ui="{ wrapper: 'px-2' }"
        />
    </template>
  </UDashboardSidebar>
</template>

