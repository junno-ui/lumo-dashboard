<script setup lang="ts">
import { profileSettings } from '@/mock/settings'
</script>

<template>
  <div class="p-6">
    <UCard class="p-4">
      <div class="flex items-center gap-4">
        <UAvatar :src="profileSettings.avatar" size="lg" />
        <div>
          <div class="text-xl font-bold">{{ profileSettings.name }}</div>
          <div class="text-sm text-gray-600">{{ profileSettings.email }}</div>
        </div>
      </div>
      <p class="mt-4 text-gray-700 dark:text-gray-300">{{ profileSettings.bio }}</p>
      <div class="mt-6"><UButton label="Edit Profile" color="black" /></div>
    </UCard>
  </div>
  </template>