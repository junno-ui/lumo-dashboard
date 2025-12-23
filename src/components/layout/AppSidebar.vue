<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const sidebarLinks = [
  { label: 'Dashboard', icon: 'i-heroicons-squares-2x2', to: '/dashboard' },
  { label: 'Inbox', icon: 'i-heroicons-inbox', to: '/inbox' },
  { label: 'Lesson', icon: 'i-heroicons-book-open', to: '/lesson' },
  { label: 'Task', icon: 'i-heroicons-clipboard-document-list', to: '/task' },
  { label: 'Group', icon: 'i-heroicons-user-group', to: '/group' },
]

const friends = [
    { name: 'Bagas Mahpie', role: 'Friend', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { name: 'Sir Dandy', role: 'Old Friend', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
    { name: 'Jhon Tosan', role: 'Friend', avatar: 'https://randomuser.me/api/portraits/men/12.jpg' },
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <aside class="w-72 flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-gray-100 dark:border-slate-800 flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-300">
      <div class="p-8 flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white transform hover:rotate-12 transition-transform duration-300">
          <UIcon name="i-heroicons-sparkles" class="w-6 h-6" />
        </div>
        <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Coursue</span>
      </div>

      <div class="px-6 flex-1 overflow-y-auto no-scrollbar">
        <div class="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-4 px-4 tracking-widest uppercase">Overview</div>
        <nav class="space-y-2 mb-10">
          <RouterLink v-for="link in sidebarLinks" :key="link.label" :to="link.to"
            #default="{ isActive: isLinkActive }"
            :class="[
              'group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 relative overflow-hidden',
              isLinkActive 
                ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
            <div v-if="isLinkActive" class="absolute left-0 w-1 h-8 bg-primary-500 rounded-r-full"></div>
            <UIcon :name="link.icon" :class="['w-6 h-6 transition-transform duration-300 group-hover:scale-110', isLinkActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300']" />
            {{ link.label }}
          </RouterLink>
        </nav>

        <div class="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-4 px-4 tracking-widest uppercase">Friends</div>
        <div class="space-y-4 px-2 mb-10">
          <div v-for="friend in friends" :key="friend.name" class="flex items-center gap-4 group cursor-pointer p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <UAvatar :src="friend.avatar" size="md" :alt="friend.name" class="ring-2 ring-white dark:ring-slate-800 group-hover:scale-105 transition-transform" />
             <div>
               <div class="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary-600 transition-colors">{{ friend.name }}</div>
               <div class="text-xs text-gray-400">{{ friend.role }}</div>
             </div>
          </div>
        </div>
      </div>

       <div class="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div class="space-y-2">
            <RouterLink to="/settings" class="flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm hover:shadow">
              <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
              Settings
            </RouterLink>
            <RouterLink to="/login" class="flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-all">
              <UIcon name="i-heroicons-arrow-left-on-rectangle" class="w-5 h-5" />
              Logout
            </RouterLink>
          </div>
       </div>
    </aside>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
