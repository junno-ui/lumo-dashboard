<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import ThemePickerColor from '@/components/views/theme/ThemePickerColor.vue'
import NotificationMenu from '@/components/layout/NotificationMenu.vue'
import MailMenu from '@/components/layout/MailMenu.vue'
import ProfileMenu from '@/components/layout/ProfileMenu.vue'
import type { BreadcrumbItem } from '@nuxt/ui'
import { SEGMENT_ICON } from '@/mock/icons'

const route = useRoute()

// Simple breadcrumb generation for static template
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
        icon: SEGMENT_ICON[seg] ?? 'i-lucide-chevron-right',
        to: path
      })
    })

    return items
  }

  const items: BreadcrumbItem[] = [
    { label: 'Dashboard', icon: SEGMENT_ICON.dashboard, to: '/dashboard' }
  ]

  const cleaned = segments.slice(1).filter(seg => seg !== 'home')

  cleaned.forEach((seg, idx) => {
    const path = '/dashboard/' + cleaned.slice(0, idx + 1).join('/')
    items.push({
      label: toTitle(seg),
      icon: SEGMENT_ICON[seg] ?? 'i-lucide-folder',
      to: path
    })
  })

  return items
})
</script>

<template>
  <UDashboardNavbar class="dark:bg-gray-950" :ui="{
    wrapper: 'sticky top-0 z-50 border-b border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl transition-colors duration-200',
    container: 'max-w-(--breakpoint-2xl) mx-auto px-4 sm:px-6 lg:px-8 h-16'
  }">
    <!-- LEFT -->
    <template #leading>
      <div class="flex items-center gap-4">
        <!-- Mobile sidebar toggle -->
        <UTooltip text="Toggle sidebar" placement="bottom">
          <UDashboardSidebarCollapse class="lg:hidden p-2 rounded-xl
                   hover:bg-gray-100 dark:hover:bg-gray-800
                   transition" />
        </UTooltip>

        <!-- Breadcrumb -->
        <div class="hidden lg:block">
          <UBreadcrumb :items="breadcrumbItems" separator-icon="iconamoon:sign-division-slash"
            class="text-xs leading-none [&_a]:py-0 [&_a]:px-1 [&_svg]:h-3 [&_svg]:w-3 [&_li]:gap-1" />
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

        <div class="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 transition-colors duration-200"></div>

        <UTooltip text="Account">
          <ProfileMenu />
        </UTooltip>
      </div>
    </template>
  </UDashboardNavbar>
</template>
