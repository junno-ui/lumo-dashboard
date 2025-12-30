<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import ThemePickerColor from '../ThemePickerColor.vue'
import NotificationMenu from './NotificationMenu.vue'
import MailMenu from './MailMenu.vue'
import ProfileMenu from './ProfileMenu.vue'
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()

const toTitle = (seg: string) =>
  seg
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const segments = route.path.split('/').filter(Boolean)

  if (segments[0] !== 'dashboard') {
    const items: BreadcrumbItem[] = [{ label: 'Home', icon: 'i-lucide-home', to: '/' }]

    segments.forEach((seg, idx) => {
      const path = '/' + segments.slice(0, idx + 1).join('/')
      items.push({
        label: toTitle(seg),
        to: path
      })
    })

    return items
  }

  const items: BreadcrumbItem[] = [
    { label: 'Dashboard', icon: 'i-lucide-home', to: '/dashboard' }
  ]

  const cleaned = segments.slice(1).filter(seg => seg !== 'home') // remove base + default

  cleaned.forEach((seg, idx) => {
    const path = '/dashboard/' + cleaned.slice(0, idx + 1).join('/')
    items.push({
      label: toTitle(seg),
      to: path
    })
  })

  return items
})


</script>

<template>
  <UDashboardNavbar
    :ui="{
      wrapper: 'sticky top-0 z-50 border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl',
      container: 'max-w-(--breakpoint-2xl) mx-auto px-4 sm:px-6 lg:px-8 h-16'
    }"
  >
    <!-- LEFT -->
    <template #leading>
      <div class="flex items-center gap-4">
        <!-- Mobile sidebar toggle -->
        <UTooltip text="Toggle sidebar" placement="bottom">
          <UDashboardSidebarCollapse
            class="lg:hidden p-2 rounded-xl
                   hover:bg-neutral-100 dark:hover:bg-neutral-800
                   transition"
          />
        </UTooltip>

        <!-- Breadcrumb -->
        <div class="hidden lg:block">
          <UBreadcrumb
            :items="breadcrumbItems"
            separator-icon="tabler:slash"
            :ui="{
              ol: 'gap-1',
              li: 'text-sm font-medium text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400',
              active: 'text-neutral-900 dark:text-white font-semibold',
              inactive: 'text-neutral-400 dark:text-neutral-500'
            }"
          />
        </div>
      </div>
    </template>

    <!-- RIGHT ACTIONS -->
    <template #right>
      <div class="flex items-center gap-2 sm:gap-3">
        <UTooltip text="Theme settings">
          <ThemePickerColor />
        </UTooltip>

        <UTooltip text="Inbox">
          <MailMenu />
        </UTooltip>

        <UTooltip text="Notifications">
          <NotificationMenu />
        </UTooltip>

        <div class="hidden sm:block w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1"></div>

        <UTooltip text="Account">
          <ProfileMenu />
        </UTooltip>
      </div>
    </template>
  </UDashboardNavbar>
</template>
