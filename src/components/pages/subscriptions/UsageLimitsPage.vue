<script setup lang="ts">
import { usageLimits } from '@/mock/subscriptions'
</script>

<template>
  <div class="p-6 space-y-4">
    <UCard>
      <template #header><h3 class="text-base font-semibold">Usage Limits</h3></template>
      <div class="p-4 space-y-4">
        <div v-for="u in usageLimits" :key="u.resource" class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="font-medium">{{ u.resource }}</span>
            <span class="text-gray-500">{{ u.used }} / {{ u.total }} {{ u.unit }}</span>
          </div>
          <UProgress :value="u.percentage" />
        </div>
      </div>
    </UCard>
  </div>
  </template>