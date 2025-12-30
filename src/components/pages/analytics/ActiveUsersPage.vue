<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ApexOptions } from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts'
import { activeUsersData } from '@/mock/analytics'

const ApexChart = VueApexCharts

// Basic stats
const maxUsers =
  activeUsersData.length > 0
    ? Math.max(...activeUsersData.map(d => d.users))
    : 0
const avgUsers =
  activeUsersData.length > 0
    ? Math.round(
        activeUsersData.reduce((sum, d) => sum + d.users, 0) /
          activeUsersData.length,
      )
    : 0

// Simple time range filter (UI only)
const selectedRange = ref('today')
const rangeOptions = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
]

// Apex series & options
const usersSeries = ref([
  {
    name: 'Active users',
    data: activeUsersData.map(d => d.users),
  },
])

const usersChartOptions = ref<ApexOptions>({
  chart: {
    type: 'area',
    toolbar: { show: false },
    zoom: { enabled: false },
    foreColor: '#6b7280',
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.35,
      opacityTo: 0.05,
      stops: [0, 100],
    },
  },
  xaxis: {
    categories: activeUsersData.map(d => d.time),
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    min: 0,
    max: maxUsers,
    tickAmount: 4,
    labels: {
      formatter: (val: number) => `${Math.round(val)}`,
    },
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val.toLocaleString()} users`,
    },
  },
  grid: {
    borderColor: 'rgba(148, 163, 184, 0.25)',
    strokeDashArray: 4,
  },
  colors: ['#6366f1'],
})

const peakPoint = computed(() => {
  if (!activeUsersData.length) return null
  return activeUsersData.slice(1).reduce((currentMax, d) => {
    // currentMax is always defined because we seeded reduce with the first element
    return d.users > (currentMax as (typeof activeUsersData)[number]).users
      ? d
      : currentMax
  }, activeUsersData[0] as (typeof activeUsersData)[number])
})
</script>

<template>
  <div class="p-6 space-y-6 bg-white dark:bg-gray-950 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Active users
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          See how many users are active throughout the day and identify peak times.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500 dark:text-gray-400">Range</span>
        <USelectMenu
          v-model="selectedRange"
          :options="rangeOptions"
          size="sm"
          color="gray"
          variant="outline"
          class="min-w-xl"
        />
      </div>
    </div>

    <!-- Quick stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UCard
        class="p-4 border border-gray-100 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
            <UIcon
              name="i-heroicons-fire"
              class="w-5 h-5 text-emerald-500"
            />
          </div>
          <div>
            <p
              class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
            >
              Peak users
            </p>
            <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ peakPoint ? peakPoint.users.toLocaleString() : '—' }}
            </p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span v-if="peakPoint">At {{ peakPoint.time }}</span>
              <span v-else>No data</span>
            </p>
          </div>
        </div>
      </UCard>

      <UCard
        class="p-4 border border-gray-100 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
            <UIcon
              name="i-heroicons-user-group"
              class="w-5 h-5 text-indigo-500"
            />
          </div>
          <div>
            <p
              class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
            >
              Average active users
            </p>
            <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ avgUsers.toLocaleString() }}
            </p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Across all time slots
            </p>
          </div>
        </div>
      </UCard>

      <UCard
        class="p-4 border border-gray-100 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30">
            <UIcon
              name="i-heroicons-clock"
              class="w-5 h-5 text-amber-500"
            />
          </div>
          <div>
            <p
              class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
            >
              Time slots tracked
            </p>
            <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ activeUsersData.length }}
            </p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Points in the current range
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Active users chart -->
    <UCard class="hover:shadow-md transition-shadow duration-200">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              Active users by time
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Area chart of concurrent users across your tracked time intervals.
            </p>
          </div>
        </div>
      </template>
      <div class="px-2 pb-4">
        <ApexChart
          type="area"
          height="320"
          :options="usersChartOptions"
          :series="usersSeries"
        />
      </div>
    </UCard>
  </div>
</template>