<script setup lang="ts">
import { computed } from 'vue'
import { analyticsStats, usageDataNumeric } from '@/mock/analytics'

type UsagePoint = { date: string; requests: number; bandwidthGB: number }
const ud = usageDataNumeric as UsagePoint[]
const maxRequests = Math.max(...ud.map((d: UsagePoint) => d.requests || 0))
const maxBandwidth = Math.max(...ud.map((d: UsagePoint) => d.bandwidthGB || 0))

const bars = computed(() =>
  ud.map((d: UsagePoint) => ({
    date: d.date,
    height: `${(d.requests / maxRequests) * 80 + 20}%`,
    tooltip: `${d.requests.toLocaleString()} req • ${d.bandwidthGB} GB`
  }))
)
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard v-for="(stat, idx) in [
        { label: 'Total Requests', value: analyticsStats.totalRequests, change: analyticsStats.requestsGrowth, trend: 'up', icon: 'i-heroicons-chart-bar' },
        { label: 'Active Users', value: analyticsStats.activeUsersNow, change: analyticsStats.activeUsersGrowth, trend: 'up', icon: 'i-heroicons-user-group' },
        { label: 'Revenue', value: analyticsStats.totalRevenue, change: analyticsStats.revenueGrowth, trend: 'up', icon: 'i-heroicons-banknotes' },
        { label: 'Bandwidth', value: Math.round(maxBandwidth) + ' GB', change: '+2.3%', trend: 'up', icon: 'i-heroicons-signal' }
      ]" :key="idx" class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <UIcon :name="stat.icon" class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ stat.label }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
            </div>
          </div>
          <div :class="stat.trend === 'up' ? 'text-green-500' : 'text-red-500'" class="flex items-center text-sm font-medium">
            {{ stat.change }}
            <UIcon :name="stat.trend === 'up' ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'" class="w-4 h-4 ml-1" />
          </div>
        </div>
      </UCard>
    </div>

    <UCard>
      <template #header><h3 class="text-base font-semibold">Requests (Last 7 days)</h3></template>
      <div class="h-64 flex items-end justify-between gap-2 px-4 pb-4">
        <div v-for="b in bars" :key="b.date" class="w-full bg-primary-100 dark:bg-primary-900/20 rounded-t-sm hover:bg-primary-500 transition-colors relative group" :style="{ height: b.height }">
          <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {{ b.tooltip }}
          </div>
          <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500">{{ new Date(b.date).toLocaleDateString() }}</div>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header><h3 class="text-base font-semibold">Bandwidth</h3></template>
      <div class="space-y-3 p-4">
        <div v-for="d in usageDataNumeric" :key="d.date" class="flex items-center gap-3">
          <div class="w-28 text-xs text-gray-500">{{ new Date(d.date).toLocaleDateString() }}</div>
          <UProgress :value="Math.round((d.bandwidthGB / maxBandwidth) * 100)" />
          <div class="w-20 text-xs text-gray-600 text-right">{{ d.bandwidthGB }} GB</div>
        </div>
      </div>
    </UCard>
  </div>
  </template>