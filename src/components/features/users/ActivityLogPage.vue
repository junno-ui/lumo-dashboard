<script setup lang="ts">
import { activityLog } from '@/mock/users'
</script>

<template>
  <div class="p-6">
    <UCard>
      <template #header><h3 class="text-base font-semibold">Activity Log</h3></template>
      <div class="p-4 space-y-4">
        <div v-for="a in activityLog" :key="a.id" class="flex items-center gap-3">
          <UIcon :name="a.icon" class="w-5 h-5 text-primary-500" />
          <div class="flex-1">
            <div class="font-medium">{{ a.user }}</div>
            <div class="text-sm text-gray-600">{{ a.action }}</div>
          </div>
          <div class="text-xs text-gray-500">{{ a.time }}</div>
        </div>
      </div>
    </UCard>
  </div>
  </template>