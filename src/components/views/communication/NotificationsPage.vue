<script setup lang="ts">
import { notifications } from '@/mock/notifications'
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold">Notifications</h3>
          <UBadge color="red">{{ notifications.filter(n => n.unread).length }}</UBadge>
        </div>
      </template>
      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <div v-for="n in notifications" :key="n.id" class="flex items-start gap-3 px-3 py-3">
          <UIcon :name="n.icon" class="w-5 h-5 text-primary-500" />
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium">{{ n.title }}</span>
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400">{{ n.description }}</div>
            <div class="text-xs text-gray-400">{{ n.time }}</div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>