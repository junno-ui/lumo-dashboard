<script setup lang="ts">
import { profileSettings } from '@/mock/settings'

const items = [
  [
    { label: 'Profile', icon: 'i-heroicons-user-circle', to: '/settings/profile' },
    { label: 'Preferences', icon: 'i-heroicons-adjustments-horizontal', to: '/settings/preferences' }
  ],
  [
    { label: 'Billing', icon: 'i-heroicons-credit-card', to: '/billing/overview' }
  ],
  [
    { label: 'Logout', icon: 'i-heroicons-arrow-left-on-rectangle', color: 'red', to: '/login' }
  ]
]
</script>

<template>
  <UDropdownMenu :items="items">
    <div class="flex items-center gap-3 cursor-pointer group p-1 pr-3 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-700 shadow-sm hover:shadow relative">
      <UAvatar :src="profileSettings.avatar" size="md" :alt="profileSettings.name" class="ring-2 ring-white dark:ring-slate-700 shadow-md group-hover:scale-105 transition-transform" />
      <span class="absolute top-1 left-9">
        <span class="absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75 animate-ping"></span>
        <span class="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
      </span>
      <div class="text-left hidden lg:block">
        <div class="text-sm font-bold text-gray-800 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">{{ profileSettings.name }}</div>
        <div class="text-xs text-gray-400">{{ profileSettings.bio }}</div>
      </div>
      <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 text-gray-400 group-hover:text-gray-600 hidden lg:block" />
    </div>
  </UDropdownMenu>
</template>