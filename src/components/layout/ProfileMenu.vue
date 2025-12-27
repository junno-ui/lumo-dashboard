<script setup lang="ts">
import { resolveComponent } from 'vue'
import { useRouter } from 'vue-router'
const UDropdownMenu = resolveComponent('UDropdownMenu')
const router = useRouter()
const items = [
  [
    { label: 'Profile', icon: 'i-heroicons-user-circle', click: () => router.push('/settings/profile') },
    { label: 'Preferences', icon: 'i-heroicons-adjustments-horizontal', click: () => router.push('/settings/preferences') }
  ],
  [
    { label: 'Billing', icon: 'i-heroicons-credit-card', click: () => router.push('/billing/overview') }
  ],
  [
    { label: 'Logout', icon: 'i-heroicons-arrow-left-on-rectangle', color: 'red', click: () => router.push('/login') }
  ]
]
</script>

<template>
  <UDropdownMenu :items="items">
    <div class="flex items-center gap-3 cursor-pointer group p-1 pr-3 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-700 shadow-sm hover:shadow relative">
      <UAvatar src="https://randomuser.me/api/portraits/men/85.jpg" size="md" alt="User" class="ring-2 ring-white dark:ring-slate-700 shadow-md group-hover:scale-105 transition-transform" />
      <span class="absolute top-1 left-9">
        <span class="absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75 animate-ping"></span>
        <span class="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
      </span>
      <div class="text-left hidden lg:block">
        <div class="text-sm font-bold text-gray-800 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">Jason Ranti</div>
        <div class="text-xs text-gray-400">Student</div>
      </div>
      <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 text-gray-400 group-hover:text-gray-600 hidden lg:block" />
    </div>
  </UDropdownMenu>
</template>