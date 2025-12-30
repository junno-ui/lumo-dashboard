<script setup lang="ts">
import { ref, h, resolveComponent } from 'vue'
import type { ApexOptions } from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts'
import BaseDataTable from '@/components/global/common/BaseDataTable.vue'
import { analyticsStats, revenueData } from '@/mock/analytics'

const UBadge = resolveComponent('UBadge')
const ApexChart = VueApexCharts

// Simple range selector for UX (doesn't change data yet)
const selectedRange = ref('30d')
const rangeOptions = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Year to date', value: 'ytd' },
]

const stats = [
  { label: 'Total Revenue', value: analyticsStats.totalRevenue, change: analyticsStats.revenueGrowth, trend: 'up', icon: 'i-heroicons-currency-dollar' },
  { label: 'Total Requests', value: analyticsStats.totalRequests, change: analyticsStats.requestsGrowth, trend: 'up', icon: 'i-heroicons-chart-bar' },
  { label: 'Active Users', value: String(analyticsStats.activeUsersNow), change: analyticsStats.activeUsersGrowth, trend: 'up', icon: 'i-heroicons-user-group' },
  { label: 'Profit', value: `$${revenueData.reduce((a, b) => a + (b.profit || 0), 0).toLocaleString()}` , change: '+5.1%', trend: 'up', icon: 'i-heroicons-banknotes' }
]

// ApexCharts: Revenue line/area chart
const revenueSeries = ref([
  {
    name: 'Revenue',
    data: revenueData.map(d => d.revenue),
  },
])

const revenueChartOptions = ref<ApexOptions>({
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
    categories: revenueData.map(d => d.month),
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      formatter: (val: number) => `$${(val / 1000).toFixed(0)}k`,
    },
  },
  tooltip: {
    y: {
      formatter: (val: number) => `$${val.toLocaleString()}`,
    },
  },
  grid: {
    borderColor: 'rgba(148, 163, 184, 0.25)',
    strokeDashArray: 4,
  },
  colors: ['#22c55e'],
})

const transactions = ref([
  { id: 'INV001', date: '2025-05-01', customer: 'Spotify', amount: '$4,500.00', status: 'Paid' },
  { id: 'INV002', date: '2025-05-02', customer: 'Netflix', amount: '$12,000.00', status: 'Paid' },
  { id: 'INV003', date: '2025-05-03', customer: 'Amazon', amount: '$3,200.00', status: 'Pending' },
  { id: 'INV004', date: '2025-05-04', customer: 'Google', amount: '$8,000.00', status: 'Paid' },
  { id: 'INV005', date: '2025-05-05', customer: 'Microsoft', amount: '$5,400.00', status: 'Failed' },
])

const columns = [
  { accessorKey: 'id', header: 'Invoice' },
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'amount', header: 'Amount' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const status = row.getValue('status') as string
      const color = status === 'Paid' ? 'green' : status === 'Pending' ? 'orange' : 'red'
      return h(UBadge, { color, variant: 'subtle' }, () => status)
    },
  },
]
</script>

<template>
  <div class="p-6 space-y-6 bg-white dark:bg-gray-950 min-h-screen">
    <!-- Page Header -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Revenue analytics
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Monitor revenue performance, usage, and recent billing activity in one place.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500 dark:text-gray-400">Showing</span>
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

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard
        v-for="(stat, index) in stats"
        :key="index"
        class="p-4 border border-gray-100 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div
              class="p-2 rounded-xl"
              :class="[
                index === 0
                  ? 'bg-emerald-50 dark:bg-emerald-900/20'
                  : 'bg-primary-50 dark:bg-primary-900/20',
              ]"
            >
              <UIcon
                :name="stat.icon"
                class="w-5 h-5"
                :class="index === 0 ? 'text-emerald-500' : 'text-primary-500'"
              />
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

    <!-- Revenue Overview Chart -->
    <UCard class="hover:shadow-md transition-shadow duration-200">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              Revenue Overview
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Monthly revenue trend based on your analytics data
            </p>
          </div>
        </div>
      </template>
      <div class="px-2 pb-4">
        <ApexChart
          type="area"
          height="320"
          :options="revenueChartOptions"
          :series="revenueSeries"
        />
      </div>
    </UCard>

    <!-- Recent Transactions -->
    <BaseDataTable
      title="Recent Transactions"
      :data="transactions"
      :columns="columns"
      search-placeholder="Search invoices..."
    />
  </div>
</template>
