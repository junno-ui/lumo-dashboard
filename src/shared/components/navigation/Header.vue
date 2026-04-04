<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import NotificationMenu from './NotificationMenu.vue'
import MailMenu from './MailMenu.vue'
import ProfileMenu from './ProfileMenu.vue'
import type { BreadcrumbItem } from '@nuxt/ui'
import { SEGMENT_ICON } from '@/shared/config/icons'

const route = useRoute()

const toTitle = (segment: string) =>
  segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const segments = route.path.split('/').filter(Boolean)

  if (segments[0] !== 'dashboard') {
    const items: BreadcrumbItem[] = [{ label: 'Home', icon: 'i-lucide-home', to: '/' }]

    segments.forEach((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/')
      items.push({
        label: toTitle(segment),
        icon: SEGMENT_ICON[segment] ?? 'i-lucide-chevron-right',
        to: path
      })
    })

    return items
  }

  const items: BreadcrumbItem[] = [
    { label: 'Dashboard', icon: SEGMENT_ICON.dashboard, to: '/dashboard/home' }
  ]

  const cleaned = segments.slice(1).filter((segment) => segment !== 'home')

  cleaned.forEach((segment, index) => {
    const path = '/dashboard/' + cleaned.slice(0, index + 1).join('/')
    items.push({
      label: toTitle(segment),
      icon: SEGMENT_ICON[segment] ?? 'i-lucide-folder',
      to: path
    })
  })

  return items
})
</script>

<template>
  <UDashboardNavbar
    :ui="{
      wrapper: 'sticky top-0 z-50 border-b border-white/8 bg-black/55 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/45',
      container: 'mx-auto h-16 max-w-[1440px] px-4 sm:px-6 lg:px-8'
    }"
  >
    <template #leading>
      <div class="flex items-center gap-4">
        <UDashboardSidebarCollapse class="rounded-xl border border-white/8 bg-white/[0.03] p-2 text-zinc-300 transition hover:bg-white/[0.08] lg:hidden" />

        <div class="hidden lg:block">
          <UBreadcrumb
            :items="breadcrumbItems"
            separator-icon="iconamoon:sign-division-slash"
            class="text-xs leading-none [&_a]:px-1 [&_a]:py-0 [&_a]:text-zinc-500 [&_a:hover]:text-white [&_svg]:h-3 [&_svg]:w-3 [&_svg]:text-zinc-700 [&_li]:gap-1"
          />
        </div>
      </div>
    </template>

    <template #right>
      <div class="flex items-center gap-2 sm:gap-3">
        <UTooltip text="Inbox">
          <MailMenu />
        </UTooltip>

        <UTooltip text="Notifications">
          <NotificationMenu />
        </UTooltip>

        <div class="mx-1 hidden h-6 w-px bg-white/8 sm:block"></div>

        <UTooltip text="Account">
          <ProfileMenu />
        </UTooltip>
      </div>
    </template>
  </UDashboardNavbar>
</template>
