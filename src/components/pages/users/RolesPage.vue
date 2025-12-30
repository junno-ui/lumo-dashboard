<script setup lang="ts">
import { roles } from '@/mock/users'
</script>

<template>
  <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <UCard v-for="r in roles" :key="r.id" class="p-4">
      <div class="flex items-center justify-between">
        <div class="text-lg font-semibold">{{ r.name }}</div>
        <UBadge color="gray">{{ r.users }} users</UBadge>
      </div>
      <ul class="mt-3 space-y-1">
        <li v-for="p in r.permissions" :key="p" class="flex items-center gap-2 text-sm">
          <UIcon name="i-heroicons-lock-closed" class="text-primary-500" /> {{ p }}
        </li>
      </ul>
    </UCard>
  </div>
  </template>