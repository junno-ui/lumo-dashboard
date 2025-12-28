<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import ThemePickerColor from '../ThemePickerColor.vue'
import NotificationMenu from './NotificationMenu.vue'
import MailMenu from './MailMenu.vue'
import ProfileMenu from './ProfileMenu.vue'
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [
    { label: 'Home', icon: 'i-lucide-home', to: '/' }
  ]
  const pathSegments = route.path.split('/').filter(Boolean)
  pathSegments.forEach((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/')
    const label = segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    items.push({ label, to: path })
  })
  return items
})
</script>

<template>
  <UDashboardNavbar 
    :ui="{ 
      wrapper: 'border-b border-primary-100 dark:border-primary-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50',
      container: 'max-w-(--breakpoint-2xl) mx-auto px-4 sm:px-6 lg:px-8 h-16'
    }"
  >
    <!-- Leading slot: Mobile toggle and breadcrumb -->
    <template #leading>
      <div class="flex items-center gap-4">
        <UDashboardSidebarCollapse class="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors" />
        
        <!-- Breadcrumb for desktop -->
        <div class="hidden lg:block">
          <UBreadcrumb 
            :items="breadcrumbItems" 
            separator-icon="i-lucide-chevron-right"
            :ui="{ 
              ol: 'gap-1',
              li: 'text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400',
              active: 'text-gray-900 dark:text-white font-bold',
              inactive: 'text-gray-400 dark:text-gray-500'
            }"
          />
        </div>
      </div>
    </template>

    <!-- Default slot: Search bar for desktop -->
    <template #default>
      <div class="hidden lg:flex flex-1 justify-center max-w-xl mx-auto px-8">
        <UInput 
          placeholder="Quick search... (Alt + K)" 
          class="w-full transition-all duration-300 focus-within:scale-[1.02]"
          :ui="{ 
            rounded: 'rounded-2xl', 
            base: 'bg-gray-100/50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-primary-500/20 focus:shadow-xl transition-all pl-11 pr-4' 
          }"
          size="md"
          variant="none"
        >
          <template #leading>
            <Icon icon="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </template>
        </UInput>
      </div>
    </template>

    <!-- Right slot: Actions and user profile -->
    <template #right>
      <div class="flex items-center gap-2 sm:gap-4">
        <ThemePickerColor />
        <div class="flex items-center gap-1 sm:gap-2">
          <MailMenu />
          <NotificationMenu />
        </div>
        <div class="hidden sm:block w-px h-6 bg-gray-200 dark:bg-slate-700 mx-1"></div>
        <ProfileMenu />
      </div>
    </template>
  </UDashboardNavbar>
</template>
