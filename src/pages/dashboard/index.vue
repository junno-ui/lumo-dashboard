<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import type { TabsItem } from '@nuxt/ui'
import { CalendarDate, DateFormatter, getLocalTimeZone, today } from '@internationalized/date'
import DashboardHeader from './DashboardHeader.vue'
import DashboardStats from './DashboardStats.vue'
import { useColorMode } from '@vueuse/core'
import {
  dashboardStats,
  mrrData,
  revenueExpenseData,
  customerGrowthData,
  planDistributionData,
  revenueSourceData,
  topCustomers,
  recentTransactions,
  recentActivities
} from '@/mock/dashboard'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const chartTextColor = computed(() => (isDark.value ? '#cbd5e1' : '#64748b')) 
const chartGridColor = computed(() => (isDark.value ? 'rgba(148, 163, 184, 0.18)' : 'rgba(148, 163, 184, 0.28)'))
const chartTooltipTheme = computed(() => (isDark.value ? 'dark' : 'light'))

function withBaseChartOptions(extra: ApexOptions): ApexOptions {
  return {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: chartTextColor.value,
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
    },
    grid: {
      borderColor: chartGridColor.value,
      strokeDashArray: 4
    },
    legend: {
      position: 'top',
      fontSize: '12px',
      labels: { colors: chartTextColor.value }
    },
    tooltip: {
      theme: chartTooltipTheme.value as any
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: chartTextColor.value } }
    },
    yaxis: {
      labels: { style: { colors: chartTextColor.value } }
    },
    ...extra
  }
}

/**
 * ====== Tabs ======
 */
const tabItems = [
  { label: 'Overview', icon: 'i-lucide-layout-dashboard', slot: 'overview' as const, value: 'overview' },
  { label: 'Revenue', icon: 'i-lucide-dollar-sign', slot: 'revenue' as const, value: 'revenue' },
  { label: 'Customers', icon: 'i-lucide-users', slot: 'customers' as const, value: 'customers' },
  { label: 'Activity', icon: 'i-lucide-activity', slot: 'activity' as const, value: 'activity' }
] satisfies TabsItem[]

const activeTab = ref<string | number>('overview')

/**
 * ====== Date Range UX (Preset + Calendar) ======
 */
const tz = getLocalTimeZone()
const df = new DateFormatter('en-US', { dateStyle: 'medium' })

const datePresets = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 6 months', 'Last year', 'Custom'] as const
type DatePreset = typeof datePresets[number]
const selectedPreset = ref<DatePreset>('Last 7 days')

const modelValue = shallowRef<{ start: CalendarDate | null | any; end: CalendarDate | null | any }>({
  start: today(tz).subtract({ days: 6 }),
  end: today(tz)
})

const dateLabel = computed(() => {
  const s = modelValue.value.start
  const e = modelValue.value.end
  if (!s && !e) return 'Pick a date'
  if (s && !e) return df.format(s.toDate(tz))
  if (s && e) return `${df.format(s.toDate(tz))} - ${df.format(e.toDate(tz))}`
  return 'Pick a date'
})

function applyPreset(preset: DatePreset) {
  if (preset === 'Custom') return
  const end = today(tz)
  let start = end

  switch (preset) {
    case 'Last 7 days':
      start = end.subtract({ days: 6 })
      break
    case 'Last 30 days':
      start = end.subtract({ days: 29 })
      break
    case 'Last 90 days':
      start = end.subtract({ days: 89 })
      break
    case 'Last 6 months':
      start = end.subtract({ months: 6 })
      break
    case 'Last year':
      start = end.subtract({ years: 1 })
      break
  }

  modelValue.value = { start, end }
}

watch(selectedPreset, (p) => applyPreset(p))

/**
 * ====== User Data ======
 */
const userName = ref('John Doe')

/**
 * ====== Chart Period Filters ======
 */
const periodItems = ['3M', '6M', '1Y', 'All']
const mrrChartPeriod = ref(periodItems[1])
const revenueChartPeriod = ref(periodItems[1])

/**
 * ====== Key Cards ======
 */
const keyCards = [
  {
    label: 'MRR',
    value: `$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(dashboardStats.mrr)}`,
    delta: dashboardStats.mrrGrowth,
    deltaLabel: 'vs last month',
    icon: 'i-heroicons-currency-dollar',
    toneBg: 'bg-blue-100 dark:bg-blue-900/30',
    toneText: 'text-blue-600 dark:text-blue-400'
  },
  {
    label: 'ARR',
    value: `$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(dashboardStats.arr)}`,
    delta: dashboardStats.arrGrowth,
    deltaLabel: 'YoY',
    icon: 'i-heroicons-chart-bar-square',
    toneBg: 'bg-green-100 dark:bg-green-900/30',
    toneText: 'text-green-600 dark:text-green-400'
  },
  {
    label: 'Customers',
    value: `${new Intl.NumberFormat('en-US').format(dashboardStats.activeCustomers)}`,
    delta: dashboardStats.newCustomersThisMonth,
    deltaLabel: 'this month',
    icon: 'i-heroicons-user-group',
    toneBg: 'bg-purple-100 dark:bg-purple-900/30',
    toneText: 'text-purple-600 dark:text-purple-400',
    isAbsoluteDelta: true
  },
  {
    label: 'Churn Rate',
    value: `${dashboardStats.churnRate}%`,
    delta: dashboardStats.churnRateChange,
    deltaLabel: 'vs last month',
    icon: 'i-heroicons-arrow-trending-down',
    toneBg: 'bg-red-100 dark:bg-red-900/30',
    toneText: 'text-red-600 dark:text-red-400'
  }
]

const secondaryCards = [
  { label: 'LTV', value: `$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(dashboardStats.ltv)}` },
  { label: 'CAC', value: `$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(dashboardStats.cac)}` },
  { label: 'LTV:CAC', value: `${Math.round(dashboardStats.ltv / dashboardStats.cac)}:1` },
  { label: 'NRR', value: `${dashboardStats.nrr}%` },
  { label: 'ARPU', value: `$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(dashboardStats.arpu)}` },
  { label: 'Trial Conv.', value: `${dashboardStats.trialConversionRate}%` }
]

/**
 * ====== Sample Data ======
 */
// Data removed (imported from mock)

const transactionColumns = [
  { accessorKey: 'id', header: 'Transaction ID' },
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'amount', header: 'Amount' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'date', header: 'Date' }
]

/**
 * ====== Charts (dark-mode friendly labels/legend) ======
 */
const mrrChartSeries = computed(() => [{ name: 'MRR', data: mrrData.map(d => d.mrr) }])
const mrrChartOptions = computed<ApexOptions>(() =>
  withBaseChartOptions({
    chart: { type: 'area' },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.06, stops: [0, 100] }
    },
    xaxis: { ...((withBaseChartOptions({}).xaxis as any) || {}), categories: mrrData.map(d => d.month) },
    yaxis: {
      labels: {
        style: { colors: chartTextColor.value },
        formatter: (val: number) => `$${(val / 1000).toFixed(0)}k`
      }
    },
    tooltip: { theme: chartTooltipTheme.value as any, y: { formatter: (val: number) => `$${val.toLocaleString()}` } },
    colors: ['#3b82f6']
  })
)

const revenueChartSeries = computed(() => [
  { name: 'Revenue', data: revenueExpenseData.map(d => d.revenue) },
  { name: 'Expenses', data: revenueExpenseData.map(d => d.expenses) }
])
const revenueChartOptions = computed<ApexOptions>(() =>
  withBaseChartOptions({
    chart: { type: 'bar', stacked: false },
    plotOptions: { bar: { horizontal: false, columnWidth: '45%', borderRadius: 8 } },
    dataLabels: { enabled: false },
    xaxis: { ...((withBaseChartOptions({}).xaxis as any) || {}), categories: revenueExpenseData.map(d => d.month) },
    yaxis: {
      labels: {
        style: { colors: chartTextColor.value },
        formatter: (val: number) => `$${(val / 1000).toFixed(0)}k`
      }
    },
    tooltip: { theme: chartTooltipTheme.value as any, y: { formatter: (val: number) => `$${val.toLocaleString()}` } },
    colors: ['#22c55e', '#ef4444'],
    grid: { borderColor: chartGridColor.value, strokeDashArray: 4 }
  })
)

const customerGrowthSeries = computed(() => [
  { name: 'New Customers', data: customerGrowthData.map(d => d.new) },
  { name: 'Churned', data: customerGrowthData.map(d => d.churned) }
])
const customerGrowthOptions = computed<ApexOptions>(() =>
  withBaseChartOptions({
    chart: { type: 'bar' },
    plotOptions: { bar: { horizontal: false, columnWidth: '45%', borderRadius: 8 } },
    dataLabels: { enabled: false },
    xaxis: { ...((withBaseChartOptions({}).xaxis as any) || {}), categories: customerGrowthData.map(d => d.month) },
    yaxis: { labels: { style: { colors: chartTextColor.value }, formatter: (val: number) => `${val}` } },
    colors: ['#22c55e', '#ef4444'],
    grid: { borderColor: chartGridColor.value, strokeDashArray: 4 }
  })
)

const planDistributionSeries = computed(() => planDistributionData.map(d => d.customers))
const planDistributionOptions = computed<ApexOptions>(() =>
  withBaseChartOptions({
    chart: { type: 'donut' },
    labels: planDistributionData.map(d => d.plan),
    dataLabels: { enabled: false },
    legend: { position: 'bottom', fontSize: '12px', labels: { colors: chartTextColor.value } },
    stroke: { colors: [isDark.value ? '#0b1220' : '#ffffff'] },
    plotOptions: { pie: { donut: { size: '72%' } } },
    colors: ['#3b82f6', '#a855f7', '#22c55e']
  })
)

const revenueSourceSeries = computed(() => revenueSourceData.map(d => d.revenue))
const revenueSourceOptions = computed<ApexOptions>(() =>
  withBaseChartOptions({
    chart: { type: 'donut' },
    labels: revenueSourceData.map(d => d.source),
    dataLabels: { enabled: false },
    legend: { position: 'bottom', fontSize: '12px', labels: { colors: chartTextColor.value } },
    stroke: { colors: [isDark.value ? '#0b1220' : '#ffffff'] },
    plotOptions: { pie: { donut: { size: '72%' } } },
    colors: ['#3b82f6', '#a855f7', '#22c55e', '#f59e0b']
  })
)

/**
 * ====== Helpers ======
 */
const getGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
})

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)

const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value)

const getTransactionStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Completed: 'success',
    Pending: 'warning',
    Failed: 'error',
    Refunded: 'neutral'
  }
  return colors[status] || 'neutral'
}

const getActivityIcon = (type: string) => {
  const icons: Record<string, string> = {
    upgrade: 'i-heroicons-arrow-trending-up',
    payment: 'i-heroicons-credit-card',
    trial: 'i-heroicons-sparkles',
    cancel: 'i-heroicons-x-circle',
    team: 'i-heroicons-user-plus'
  }
  return icons[type] || 'i-heroicons-bell'
}

const getActivityIconBg = (type: string) => {
  const colors: Record<string, string> = {
    upgrade: 'bg-green-100 dark:bg-green-900/30',
    payment: 'bg-blue-100 dark:bg-blue-900/30',
    trial: 'bg-purple-100 dark:bg-purple-900/30',
    cancel: 'bg-red-100 dark:bg-red-900/30',
    team: 'bg-amber-100 dark:bg-amber-900/30'
  }
  return colors[type] || 'bg-gray-100 dark:bg-gray-800'
}

const getActivityIconColor = (type: string) => {
  const colors: Record<string, string> = {
    upgrade: 'text-green-600 dark:text-green-400',
    payment: 'text-blue-600 dark:text-blue-400',
    trial: 'text-purple-600 dark:text-purple-400',
    cancel: 'text-red-600 dark:text-red-400',
    team: 'text-amber-600 dark:text-amber-400'
  }
  return colors[type] || 'text-gray-600 dark:text-gray-400'
}


// Computed cards removed (already defined above)
</script>

<template>
  <div class="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-950">
    <div class="px-4 sm:px-6 lg:px-8 py-6">
      <!-- Top toolbar -->
      <div class="rounded-3xl border border-gray-200/70 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/50 backdrop-blur p-4 sm:p-5">
        <DashboardHeader
          :user="userName"
          :greeting="getGreeting"
          v-model="modelValue"
          v-model:preset="selectedPreset"
          :presets="datePresets"
          :date-label="dateLabel"
        />
      </div>

      <!-- Tabs -->
      <div class="mt-5">
        <UTabs
          v-model="activeTab"
          :items="tabItems"
          color="primary"
          variant="link"
          size="sm"
          :unmount-on-hide="false"
          class="w-full"
          :ui="{
            list: 'p-1 bg-white/80 dark:bg-gray-950/40 backdrop-blur rounded-2xl ring-1 ring-gray-200/60 dark:ring-gray-800/60',
            trigger: 'px-3 py-2 rounded-xl data-[state=active]:bg-gray-50 dark:data-[state=active]:bg-gray-900/50'
          }"
        >
          <template #overview>
            <div class="mt-5 space-y-6">
              <!-- Key Metrics -->
              <DashboardStats :cards="keyCards" />

              <!-- Secondary Metrics -->
              <UCard class="rounded-3xl" :ui="{ body: 'p-5' }">
                <div class="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 class="text-base font-semibold text-gray-900 dark:text-white">Health metrics</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Secondary indicators for the current period</p>
                  </div>
                  <UBadge color="neutral" variant="soft" size="xs">
                    {{ dateLabel }}
                  </UBadge>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div
                    v-for="m in secondaryCards"
                    :key="m.label"
                    class="rounded-2xl bg-gray-50 dark:bg-gray-900/35 p-4 text-center
                           ring-1 ring-gray-200/60 dark:ring-gray-800/60
                           hover:bg-gray-100/70 dark:hover:bg-gray-900/55 transition"
                  >
                    <div class="text-xs text-gray-600 dark:text-gray-400">
                      {{ m.label }}
                    </div>
                    <div class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                      {{ m.value }}
                    </div>
                  </div>
                </div>
              </UCard>

              <div class="grid gap-6 lg:grid-cols-2">
                <UCard class="rounded-3xl hover:shadow-lg transition-shadow duration-200">
                  <template #header>
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">MRR Growth</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Monthly recurring revenue trend</p>
                      </div>
                      <USelectMenu
                        v-model="mrrChartPeriod"
                        :items="periodItems"
                        size="sm"
                        color="neutral"
                        variant="soft"
                        class="w-24"
                      />
                    </div>
                  </template>

                  <div class="rounded-2xl ring-1 ring-gray-200/60 dark:ring-gray-800/60 bg-white/70 dark:bg-gray-950/30 p-2">
                    <VueApexCharts type="area" height="320" :options="mrrChartOptions" :series="mrrChartSeries" />
                  </div>
                </UCard>

                <UCard class="rounded-3xl hover:shadow-lg transition-shadow duration-200">
                  <template #header>
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Revenue vs Expenses</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Profit and loss overview</p>
                      </div>
                      <USelectMenu
                        v-model="revenueChartPeriod"
                        :items="periodItems"
                        size="sm"
                        color="neutral"
                        variant="soft"
                        class="w-24"
                      />
                    </div>
                  </template>

                  <div class="rounded-2xl ring-1 ring-gray-200/60 dark:ring-gray-800/60 bg-white/70 dark:bg-gray-950/30 p-2">
                    <VueApexCharts type="bar" height="320" :options="revenueChartOptions" :series="revenueChartSeries" />
                  </div>
                </UCard>
              </div>
            </div>
          </template>

          <template #revenue>
            <div class="mt-5 space-y-6">
              <div class="grid gap-6 lg:grid-cols-2">
                <UCard class="rounded-3xl hover:shadow-lg transition-shadow duration-200">
                  <template #header>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Revenue vs Expenses</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Profit and loss overview</p>
                    </div>
                  </template>

                  <div class="rounded-2xl ring-1 ring-gray-200/60 dark:ring-gray-800/60 bg-white/70 dark:bg-gray-950/30 p-2">
                    <VueApexCharts type="bar" height="320" :options="revenueChartOptions" :series="revenueChartSeries" />
                  </div>
                </UCard>

                <UCard class="rounded-3xl hover:shadow-lg transition-shadow duration-200">
                  <template #header>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Revenue by Source</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Breakdown by acquisition channel</p>
                    </div>
                  </template>

                  <div class="rounded-2xl ring-1 ring-gray-200/60 dark:ring-gray-800/60 bg-white/70 dark:bg-gray-950/30 p-2">
                    <VueApexCharts type="donut" height="320" :options="revenueSourceOptions" :series="revenueSourceSeries" />
                  </div>
                </UCard>
              </div>

              <UCard class="rounded-3xl hover:shadow-lg transition-shadow duration-200" :ui="{ body: 'p-0' }">
                <template #header>
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Latest payment activity</p>
                    </div>
                    <UButton variant="soft" color="neutral" size="sm" icon="i-lucide-arrow-right">
                      View All
                    </UButton>
                  </div>
                </template>

                <div class="p-4 sm:p-5">
                  <div class="rounded-2xl overflow-hidden ring-1 ring-gray-200/60 dark:ring-gray-800/60">
                    <UTable
                      :data="recentTransactions"
                      :columns="transactionColumns"
                      :ui="{
                        thead: 'bg-white dark:bg-gray-950/30',
                        th: 'text-xs font-semibold text-gray-600 dark:text-gray-300',
                        tr: 'hover:bg-gray-50 dark:hover:bg-gray-900/40 transition',
                        td: 'py-4'
                      }"
                    >
                      <template #id-data="{ row }">
                        <span class="font-mono text-xs sm:text-sm text-gray-900 dark:text-white">
                          {{ (row as any).id }}
                        </span>
                      </template>
                      <template #customer-data="{ row }">
                        <span class="text-gray-900 dark:text-white">{{ (row as any).customer }}</span>
                      </template>
                      <template #amount-data="{ row }">
                        <span class="font-semibold text-gray-900 dark:text-white">
                          ${{ formatCurrency((row as any).amount) }}
                        </span>
                      </template>
                      <template #status-data="{ row }">
                        <UBadge :color="getTransactionStatusColor((row as any).status)" variant="soft" size="xs">
                          {{ (row as any).status }}
                        </UBadge>
                      </template>
                      <template #date-data="{ row }">
                        <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{{ (row as any).date }}</span>
                      </template>
                    </UTable>
                  </div>
                </div>
              </UCard>
            </div>
          </template>

          <!-- ===================== CUSTOMERS ===================== -->
          <template #customers>
            <div class="mt-5 space-y-6">
              <div class="grid gap-6 lg:grid-cols-3">
                <UCard class="lg:col-span-2 rounded-3xl hover:shadow-lg transition-shadow duration-200">
                  <template #header>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Customer Growth</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">New vs churned customers</p>
                    </div>
                  </template>

                  <div class="rounded-2xl ring-1 ring-gray-200/60 dark:ring-gray-800/60 bg-white/70 dark:bg-gray-950/30 p-2">
                    <VueApexCharts type="bar" height="320" :options="customerGrowthOptions" :series="customerGrowthSeries" />
                  </div>
                </UCard>

                <UCard class="rounded-3xl hover:shadow-lg transition-shadow duration-200">
                  <template #header>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Plan Distribution</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">By subscription tier</p>
                    </div>
                  </template>

                  <div class="rounded-2xl ring-1 ring-gray-200/60 dark:ring-gray-800/60 bg-white/70 dark:bg-gray-950/30 p-2">
                    <VueApexCharts type="donut" height="320" :options="planDistributionOptions" :series="planDistributionSeries" />
                  </div>
                </UCard>
              </div>

              <UCard class="rounded-3xl hover:shadow-lg transition-shadow duration-200">
                <template #header>
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Top Customers</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">By monthly revenue</p>
                    </div>
                    <UButton variant="soft" color="neutral" size="sm" icon="i-lucide-arrow-right">
                      View All
                    </UButton>
                  </div>
                </template>

                <div class="space-y-3">
                  <div
                    v-for="(customer, idx) in topCustomers"
                    :key="customer.id || idx"
                    class="flex items-center justify-between gap-4 p-4 rounded-2xl
                           bg-gray-50 dark:bg-gray-900/35
                           ring-1 ring-gray-200/60 dark:ring-gray-800/60
                           hover:bg-gray-100/70 dark:hover:bg-gray-900/55 transition"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <UAvatar :alt="customer.name" size="md" :text="customer.name?.charAt(0)" />
                      <div class="min-w-0">
                        <p class="font-semibold text-gray-900 dark:text-white truncate">{{ customer.name }}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {{ customer.plan }} • {{ customer.users }} users
                        </p>
                      </div>
                    </div>

                    <div class="text-right shrink-0">
                      <p class="font-semibold text-gray-900 dark:text-white">
                        ${{ formatCurrency(customer.mrr) }}/mo
                      </p>
                      <UBadge :color="customer.status === 'Active' ? 'success' : 'neutral'" variant="soft" size="xs">
                        {{ customer.status }}
                      </UBadge>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </template>

          <!-- ===================== ACTIVITY ===================== -->
          <template #activity>
            <div class="mt-5 grid gap-6 lg:grid-cols-2">
              <UCard class="rounded-3xl hover:shadow-lg transition-shadow duration-200">
                <template #header>
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Activity Feed</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Recent system events</p>
                    </div>
                    <UBadge color="neutral" variant="soft" size="xs">
                      {{ recentActivities.length }} events
                    </UBadge>
                  </div>
                </template>

                <div class="space-y-2">
                  <div
                    v-for="activity in recentActivities"
                    :key="activity.id"
                    class="flex gap-3 p-3 rounded-2xl
                           hover:bg-gray-50 dark:hover:bg-gray-900/40 transition"
                  >
                    <div class="shrink-0">
                      <div class="w-10 h-10 rounded-2xl flex items-center justify-center ring-1 ring-gray-200/60 dark:ring-gray-800/60" :class="getActivityIconBg(activity.type)">
                        <UIcon :name="getActivityIcon(activity.type)" class="w-4 h-4" :class="getActivityIconColor(activity.type)" />
                      </div>
                    </div>

                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-gray-900 dark:text-white">
                        <span class="font-semibold">{{ activity.user }}</span>
                        <span class="text-gray-700 dark:text-gray-200"> {{ activity.action }}</span>
                      </p>
                      <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                        <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
                        {{ activity.time }}
                      </p>
                    </div>
                  </div>
                </div>
              </UCard>

              <UCard class="rounded-3xl hover:shadow-lg transition-shadow duration-200">
                <template #header>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Stats</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">At a glance</p>
                  </div>
                </template>

                <div class="grid grid-cols-2 gap-4">
                  <div class="rounded-2xl p-4 bg-gray-50 dark:bg-gray-900/35 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
                    <div class="text-xs text-gray-600 dark:text-gray-400">Date range</div>
                    <div class="mt-1 font-semibold text-gray-900 dark:text-white truncate">{{ dateLabel }}</div>
                  </div>

                  <div class="rounded-2xl p-4 bg-gray-50 dark:bg-gray-900/35 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
                    <div class="text-xs text-gray-600 dark:text-gray-400">Active tab</div>
                    <div class="mt-1 font-semibold text-gray-900 dark:text-white capitalize truncate">{{ String(activeTab) }}</div>
                  </div>

                  <div class="rounded-2xl p-4 bg-gray-50 dark:bg-gray-900/35 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
                    <div class="text-xs text-gray-600 dark:text-gray-400">Customers</div>
                    <div class="mt-1 font-semibold text-gray-900 dark:text-white">{{ formatNumber(dashboardStats.activeCustomers) }}</div>
                  </div>

                  <div class="rounded-2xl p-4 bg-gray-50 dark:bg-gray-900/35 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
                    <div class="text-xs text-gray-600 dark:text-gray-400">Churn</div>
                    <div class="mt-1 font-semibold text-gray-900 dark:text-white">{{ dashboardStats.churnRate }}%</div>
                  </div>
                </div>

                <div class="mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <UIcon name="i-lucide-info" class="w-4 h-4" />
                  <span>Chart labels and legends automatically adapt to dark mode.</span>
                </div>
              </UCard>
            </div>
          </template>
        </UTabs>
      </div>
    </div>
  </div>
</template>
