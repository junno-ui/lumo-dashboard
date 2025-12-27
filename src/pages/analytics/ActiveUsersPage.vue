<script setup lang="ts">
import { activeUsersData } from '@/mock/analytics'
const maxUsers = Math.max(...activeUsersData.map(d => d.users))
</script>

<template>
  <div class="p-6 space-y-6">
    <UCard>
      <template #header><h3 class="text-base font-semibold">Active Users by Time</h3></template>
      <div class="h-64 flex items-end justify-between gap-2 px-4 pb-4">
        <div v-for="d in activeUsersData" :key="d.time" class="w-full bg-primary-100 dark:bg-primary-900/20 rounded-t-sm hover:bg-primary-500 transition-colors relative group" :style="{ height: `${(d.users / maxUsers) * 80 + 20}%` }">
          <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {{ d.users }} users
          </div>
          <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500">{{ d.time }}</div>
        </div>
      </div>
    </UCard>
  </div>
  </template>