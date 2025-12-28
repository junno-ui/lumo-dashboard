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
  <UDashboardNavbar icon="i-lucide-layout-dashboard" >
    <!-- Leading slot: Mobile toggle and breadcrumb -->
    <template #leading>
      <UDashboardSidebarCollapse class="lg:hidden" />
      
      <!-- Breadcrumb for desktop -->
      <div class="hidden lg:block">
        <UBreadcrumb :items="breadcrumbItems" separator-icon="i-lucide-chevron-right" />
      </div>
    </template>

    <!-- Trailing slot: Badge or additional info next to title -->
    <template #trailing>
      <!-- You can add badges or additional info here if needed -->
    </template>

    <!-- Default slot: Search bar for desktop -->
    <template #default>
      <div class="hidden lg:flex flex-1 justify-center max-w-2xl mx-auto">
        <UInput 
          placeholder="Search for courses, mentors, or tasks..." 
          class="w-full transition-all duration-300 focus-within:ring-2 focus-within:ring-primary-500/20"
          :ui="{ 
            rounded: 'rounded-2xl', 
            base: 'bg-gray-100/50 dark:bg-slate-800/50 border-0 focus:ring-0 focus:shadow-lg pl-11' 
          }"
          size="lg"
          variant="none"
        >
          <template #leading>
            <Icon icon="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400" />
          </template>
        </UInput>
      </div>
    </template>

    <!-- Right slot: Actions and user profile -->
    <template #right>
      <div class="flex items-center gap-3">
        <ThemePickerColor />
        <div class="flex items-center gap-2">
          <MailMenu />
          <NotificationMenu />
        </div>
        <div class="hidden lg:block w-px h-8 bg-gray-200 dark:bg-slate-700"></div>
        <ProfileMenu />
      </div>
    </template>
  </UDashboardNavbar>
</template>
