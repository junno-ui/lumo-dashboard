<script setup lang="ts">
import { profileSettings } from '@/mock/settings'

type MenuItem = {
  label: string
  icon?: string
  to?: string
  color?: 'red' | 'primary' | 'neutral' | string
  onSelect?: () => void
}

const logout = async () => {
  // TODO: replace with your real logout logic
  // await $fetch('/api/logout', { method: 'POST' })
  // await navigateTo('/login')
}

const items: MenuItem[][] = [
  [
    { label: 'Profile', icon: 'i-heroicons-user-circle', to: '/dashboard/settings/profile' },
    { label: 'Preferences', icon: 'i-heroicons-adjustments-horizontal', to: '/dashboard/settings/preferences' }
  ],
  [
    { label: 'Billing', icon: 'i-heroicons-credit-card', to: '/dashboard/billing/overview' }
  ],
  [
    { label: 'Logout', icon: 'i-heroicons-arrow-left-on-rectangle', color: 'red', onSelect: logout }
  ]
]
</script>

<template>
  <UDropdownMenu
    :items="items"
    :ui="{
      content: 'w-64',
    }"
  >
    <UButton
      color="neutral"
      variant="ghost"
      class="p-1.5 pr-2 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800 shadow-sm hover:shadow transition"
      :ui="{ base: 'justify-start w-full' }"
    >
      <UAvatar
        :src="profileSettings.avatar"
        :alt="profileSettings.name"
        size="md"
        class="ring-2 ring-white dark:ring-slate-700 shadow-sm"
      />

      <span class="ml-3 text-left hidden lg:block leading-tight">
        <span class="block text-sm font-semibold text-gray-800 dark:text-white">
          {{ profileSettings.name }}
        </span>
        <span class="block text-xs text-gray-400 truncate max-w-xl">
          {{ profileSettings.bio }}
        </span>
      </span>

      <UIcon
        name="i-heroicons-chevron-down"
        class="ml-auto w-4 h-4 text-gray-400 hidden lg:block"
      />
    </UButton>
  </UDropdownMenu>
</template>
