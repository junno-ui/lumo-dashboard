<script setup lang="ts">
import { organizationSettings } from '@/mock/settings'
</script>

<template>
  <div class="p-6">
    <UCard class="p-4">
      <div class="flex items-center gap-4">
        <UAvatar :src="organizationSettings.logo" size="lg" />
        <div>
          <div class="text-xl font-bold">{{ organizationSettings.name }}</div>
          <div class="text-sm text-gray-600">Domain: {{ organizationSettings.domain }}</div>
        </div>
      </div>
      <div class="mt-4 text-sm">Members: {{ organizationSettings.members }}</div>
      <div class="mt-6"><UButton label="Manage" color="black" /></div>
    </UCard>
  </div>
  </template>