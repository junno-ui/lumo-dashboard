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

const friends = [
    { name: 'Bagas Mahpie', role: 'Friend', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { name: 'Sir Dandy', role: 'Old Friend', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
    { name: 'Jhon Tosan', role: 'Friend', avatar: 'https://randomuser.me/api/portraits/men/12.jpg' },
]
</script>

<template>
  <UDashboardSidebar 
    collapsible 
    resizable 
    :ui="{ footer: 'border-t border-gray-100 dark:border-slate-800' }"
  >
    <template #header="{ collapsed }">
      <div v-if="!collapsed" class="flex items-center gap-3 px-2">
         <div class="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Icon icon="heroicons:sparkles" class="w-5 h-5" />
         </div>
         <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Coursue</span>
      </div>
      <div v-else class="mx-auto">
         <div class="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <Icon icon="heroicons:sparkles" class="w-5 h-5" />
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

        <div v-show="!collapsed" class="mt-8 px-4">
             <div class="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-4 tracking-widest uppercase">Friends</div>
              <div class="space-y-3">
                <div v-for="friend in friends" :key="friend.name" class="flex items-center gap-3 group cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <UAvatar :src="friend.avatar" size="xs" :alt="friend.name" />
                    <div class="overflow-hidden">
                        <div class="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate group-hover:text-primary-600 transition-colors">{{ friend.name }}</div>
                        <div class="text-[10px] text-gray-400 truncate">{{ friend.role }}</div>
                    </div>
                </div>
             </div>
        </div>
    </template>

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

