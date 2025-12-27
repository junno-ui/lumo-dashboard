<script setup lang="ts">
import { preferences } from '@/mock/settings'
</script>

<template>
  <div class="p-6 space-y-6">
    <UCard class="p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div><p class="text-sm text-gray-500">Theme</p><p class="text-lg font-semibold">{{ preferences.theme }}</p></div>
        <div><p class="text-sm text-gray-500">Language</p><p class="text-lg font-semibold">{{ preferences.language }}</p></div>
        <div>
          <p class="text-sm text-gray-500 mb-1">Notifications</p>
          <div class="space-y-1 text-sm">
            <div>Email: {{ preferences.notifications.email ? 'On' : 'Off' }}</div>
            <div>Push: {{ preferences.notifications.push ? 'On' : 'Off' }}</div>
            <div>Desktop: {{ preferences.notifications.desktop ? 'On' : 'Off' }}</div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
  </template>