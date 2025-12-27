<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import ThemePickerColor from '../ThemePickerColor.vue'
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()


const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [
    {
      label: 'Home',
      icon: 'i-lucide-home',
      to: '/'
    }
  ]

  const pathSegments = route.path.split('/').filter(Boolean)
  
  pathSegments.forEach((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/')
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    items.push({
      label,
      to: path
    })
  })

  return items
})
</script>

<template>
  <UDashboardNavbar icon="i-lucide-layout-dashboard">
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
        
        <!-- Notification buttons -->
        <div class="flex items-center gap-2">
          <UButton 
            color="neutral" 
            variant="ghost" 
            class="rounded-xl w-10 h-10 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 flex items-center justify-center"
          >
            <Icon icon="heroicons:envelope" class="w-5 h-5" />
          </UButton>
          
          <div class="relative">
            <UButton 
              color="neutral" 
              variant="ghost" 
              class="rounded-xl w-10 h-10 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 transition-colors flex items-center justify-center"
            >
              <Icon icon="heroicons:bell" class="w-5 h-5" />
            </UButton>
            <span class="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
          </div>
        </div>
        
        <!-- Divider -->
        <div class="hidden lg:block w-px h-8 bg-gray-200 dark:bg-slate-700"></div>

        <!-- User profile dropdown -->
        <div class="flex items-center gap-3 cursor-pointer group p-1 pr-3 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-700 shadow-sm hover:shadow">
          <UAvatar 
            src="https://randomuser.me/api/portraits/men/85.jpg" 
            size="md" 
            alt="Jason Ranti" 
            class="ring-2 ring-white dark:ring-slate-700 shadow-md group-hover:scale-105 transition-transform" 
          />
          <div class="text-left hidden lg:block">
            <div class="text-sm font-bold text-gray-800 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">
              Jason Ranti
            </div>
            <div class="text-xs text-gray-400">Student</div>
          </div>
          <Icon icon="heroicons:chevron-down" class="w-4 h-4 text-gray-400 group-hover:text-gray-600 hidden lg:block" />
        </div>
      </div>
    </template>
  </UDashboardNavbar>
</template>
