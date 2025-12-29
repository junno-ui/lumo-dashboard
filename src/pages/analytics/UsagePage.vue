<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ApexOptions } from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts'
import { analyticsStats, usageDataNumeric } from '@/mock/analytics'

type UsagePoint = { date: string; requests: number; bandwidthGB: number }
const ud = usageDataNumeric as UsagePoint[]
const maxBandwidth = Math.max(...ud.map((d: UsagePoint) => d.bandwidthGB || 0))

const ApexChart = VueApexCharts

// Range selector (UI only for now)
const selectedRange = ref('7d')
const rangeOptions = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
]

const stats = [
  {
    label: 'Total Requests',
    value: analyticsStats.totalRequests.toLocaleString(),
    change: analyticsStats.requestsGrowth,
    trend: 'up',
    icon: 'i-heroicons-chart-bar',
  },
  {
    label: 'Active Users (now)',
    value: analyticsStats.activeUsersNow.toLocaleString(),
    change: analyticsStats.activeUsersGrowth,
    trend: 'up',
    icon: 'i-heroicons-user-group',
  },
  {
    label: 'Revenue',
    value: `$${analyticsStats.totalRevenue.toLocaleString()}`,
    change: analyticsStats.revenueGrowth,
    trend: 'up',
    icon: 'i-heroicons-banknotes',
  },
  {
    label: 'Peak Bandwidth',
    value: `${Math.round(maxBandwidth)} GB`,
    change: '+2.3%',
    trend: 'up',
    icon: 'i-heroicons-signal',
  },
]

// Apex: Requests & Bandwidth combo chart
const usageSeries = ref([
  {
    name: 'Requests',
    type: 'column',
    data: ud.map((d: UsagePoint) => d.requests),
  },
  {
    name: 'Bandwidth (GB)',
    type: 'line',
    data: ud.map((d: UsagePoint) => d.bandwidthGB),
  },
])

const usageChartOptions = ref<ApexOptions>({
  chart: {
    type: 'line',
    stacked: false,
    toolbar: { show: false },
    zoom: { enabled: false },
    foreColor: '#6b7280',
  },
  dataLabels: { enabled: false },
  stroke: {
    width: [0, 3],
    curve: 'smooth',
  },
  plotOptions: {
    bar: {
      columnWidth: '55%',
      borderRadius: 6,
    },
  },
  xaxis: {
    categories: ud.map((d: UsagePoint) =>
      new Date(d.date).toLocaleDateString(),
    ),
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: [
    {
      title: { text: 'Requests' },
      labels: {
        formatter: (val: number) => `${Math.round(val / 1000)}k`,
      },
    },
    {
      opposite: true,
      title: { text: 'Bandwidth (GB)' },
      labels: {
        formatter: (val: number) => `${val} GB`,
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: (val: number, opts: any) => {
        return opts.seriesIndex === 0
          ? `${val.toLocaleString()} req`
          : `${val} GB`
      },
    },
  },
  grid: {
    borderColor: 'rgba(148, 163, 184, 0.25)',
    strokeDashArray: 4,
  },
  colors: ['#3b82f6', '#22c55e'],
  legend: {
    position: 'top',
    fontSize: '12px',
  },
})

const bandwidthRows = computed(() =>
  ud.map((d: UsagePoint) => ({
    date: new Date(d.date).toLocaleDateString(),
    bandwidthGB: d.bandwidthGB,
    percent: Math.round((d.bandwidthGB / maxBandwidth) * 100),
  })),
)
</script>

<template>
  <div class="p-6 space-y-6 bg-white dark:bg-gray-950 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Usage analytics
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Track API requests and bandwidth consumption over time.
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
          class="min-w-[150px]"
        />
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard
        v-for="(stat, idx) in stats"
        :key="idx"
        class="p-4 border border-gray-100 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-primary-50 dark:bg-primary-900/20">
              <UIcon :name="stat.icon" class="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {{ stat.label }}
              </p>
              <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {{ stat.value }}
              </p>
            </div>
          </div>
          <UBadge
            :color="stat.trend === 'up' ? 'green' : 'red'"
            variant="soft"
            size="xs"
            class="whitespace-nowrap mt-1"
          >
            <span class="flex items-center gap-1">
              <UIcon
                :name="
                  stat.trend === 'up'
                    ? 'i-heroicons-arrow-trending-up'
                    : 'i-heroicons-arrow-trending-down'
                "
                class="w-3 h-3"
              />
              <span>{{ stat.change }}</span>
            </span>
          </UBadge>
        </div>
      </UCard>
    </div>

    <!-- Requests & Bandwidth Chart -->
    <UCard class="hover:shadow-md transition-shadow duration-200">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              Requests & bandwidth
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Combined view of total requests and bandwidth usage.
            </p>
          </div>
        </div>
      </template>
      <div class="px-2 pb-4">
        <ApexChart
          type="line"
          height="320"
          :options="usageChartOptions"
          :series="usageSeries"
        />
      </div>
    </UCard>

    <!-- Bandwidth details -->
    <UCard class="hover:shadow-md transition-shadow duration-200">
      <template #header>
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          Bandwidth by day
        </h3>
      </template>
      <div class="space-y-3 p-4">
        <div
          v-for="row in bandwidthRows"
          :key="row.date"
          class="flex items-center gap-3"
        >
          <div class="w-28 text-xs text-gray-500">
            {{ row.date }}
          </div>
          <UProgress
            class="flex-1"
            :value="row.percent"
          />
          <div class="w-20 text-xs text-gray-600 dark:text-gray-300 text-right">
            {{ row.bandwidthGB }} GB
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>