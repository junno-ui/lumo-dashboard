<script setup lang="ts">
import { plans } from '@/mock/subscriptions'
</script>

<template>
  <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <UCard v-for="plan in plans" :key="plan.id" class="p-4">
      <div class="flex items-center justify-between mb-3">
        <div class="text-xl font-bold">{{ plan.name }}</div>
        <UBadge :color="plan.popular ? 'blue' : 'gray'">{{ plan.popular ? 'Popular' : 'Standard' }}</UBadge>
      </div>
      <p class="text-3xl font-semibold">{{ plan.price }}<span class="text-sm">/{{ plan.interval }}</span></p>
      <ul class="mt-4 space-y-2">
        <li v-for="f in plan.features" :key="f" class="flex items-center gap-2 text-sm">
          <UIcon name="i-heroicons-check-circle" class="text-green-500" /> {{ f }}
        </li>
      </ul>
      <div class="mt-6">
        <UButton color="black" label="Choose Plan" block />
      </div>
    </UCard>
  </div>
  </template>