<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import type { TabsItem } from '@nuxt/ui'
import { CalendarDate, DateFormatter, getLocalTimeZone, today } from '@internationalized/date'
import DashboardHeader from './components/DashboardHeader.vue'
import DashboardStats from './components/DashboardStats.vue'

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
const dateOpen = ref(false)

const datePresets = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 6 months', 'Last year', 'Custom'] as const
type DatePreset = typeof datePresets[number]
const selectedPreset = ref<DatePreset>('Last 7 days')

const modelValue = shallowRef<{ start: CalendarDate | null | any; end: CalendarDate | null | any}>({
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
 * ====== Key SaaS Metrics ======
 */
const mrr = ref(124500)
const mrrGrowth = ref(5.3)
const arr = ref(1494000)
const arrGrowth = ref(12.5)
const activeCustomers = ref(3420)
const newCustomersThisMonth = ref(127)
const churnRate = ref(2.3)
const churnRateChange = ref(-0.5)

/**
 * ====== Secondary Metrics ======
 */
const ltv = ref(12500)
const cac = ref(850)
const ltvCacRatio = computed(() => Math.round(ltv.value / cac.value))
const nrr = ref(108)
const arpu = ref(156.25)
const trialConversionRate = ref(24.5)

/**
 * ====== Sample Data ======
 */
const mrrData = [
  { month: 'Jan', mrr: 82000 },
  { month: 'Feb', mrr: 89000 },
  { month: 'Mar', mrr: 92000 },
  { month: 'Apr', mrr: 101000 },
  { month: 'May', mrr: 112000 },
  { month: 'Jun', mrr: 124500 }
]

const revenueExpenseData = [
  { month: 'Jan', revenue: 125000, expenses: 95000 },
  { month: 'Feb', revenue: 142000, expenses: 102000 },
  { month: 'Mar', revenue: 138000, expenses: 98000 },
  { month: 'Apr', revenue: 169000, expenses: 115000 },
  { month: 'May', revenue: 182000, expenses: 125000 },
  { month: 'Jun', revenue: 195000, expenses: 132000 }
]

const customerGrowthData = [
  { month: 'Jan', new: 85, churned: 12 },
  { month: 'Feb', new: 92, churned: 15 },
  { month: 'Mar', new: 105, churned: 18 },
  { month: 'Apr', new: 118, churned: 20 },
  { month: 'May', new: 127, churned: 22 },
  { month: 'Jun', new: 135, churned: 25 }
]

const planDistributionData = [
  { plan: 'Starter', customers: 1205, revenue: 24100 },
  { plan: 'Professional', customers: 198, revenue: 29700 },
  { plan: 'Enterprise', customers: 342, revenue: 51300 }
]

const revenueSourceData = [
  { source: 'Organic', revenue: 45000 },
  { source: 'Paid Ads', revenue: 38000 },
  { source: 'Referrals', revenue: 28000 },
  { source: 'Partnerships', revenue: 13500 }
]

const topCustomers = ref([
  { id: 1, name: 'Acme Corporation', plan: 'Enterprise', users: 250, mrr: 12500, status: 'Active' },
  { id: 2, name: 'Tech Solutions Inc', plan: 'Enterprise', users: 180, mrr: 9000, status: 'Active' },
  { id: 3, name: 'Global Industries', plan: 'Professional', users: 95, mrr: 4750, status: 'Active' },
  { id: 4, name: 'Innovation Labs', plan: 'Enterprise', users: 120, mrr: 6000, status: 'Active' },
  { id: 5, name: 'Digital Ventures', plan: 'Professional', users: 75, mrr: 3750, status: 'Active' }
])

const recentTransactions = ref([
  { id: 'TXN-001', customer: 'Acme Corp', amount: 12500, status: 'Completed', date: '2 hours ago' },
  { id: 'TXN-002', customer: 'Tech Solutions', amount: 9000, status: 'Completed', date: '5 hours ago' },
  { id: 'TXN-003', customer: 'Global Industries', amount: 4750, status: 'Pending', date: '1 day ago' },
  { id: 'TXN-004', customer: 'Innovation Labs', amount: 6000, status: 'Completed', date: '1 day ago' },
  { id: 'TXN-005', customer: 'Digital Ventures', amount: 3750, status: 'Failed', date: '2 days ago' }
])

const recentActivities = ref([
  { id: 1, user: 'John Doe', action: 'upgraded to Enterprise plan', type: 'upgrade', time: '5 minutes ago' },
  { id: 2, user: 'Jane Smith', action: 'completed payment', type: 'payment', time: '15 minutes ago' },
  { id: 3, user: 'Bob Johnson', action: 'started free trial', type: 'trial', time: '1 hour ago' },
  { id: 4, user: 'Alice Williams', action: 'cancelled subscription', type: 'cancel', time: '2 hours ago' },
  { id: 5, user: 'Charlie Brown', action: 'added 10 team members', type: 'team', time: '3 hours ago' }
])

const transactionColumns = [
  { accessorKey: 'id', header: 'Transaction ID' },
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'amount', header: 'Amount' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'date', header: 'Date' }
]

/**
 * ====== Charts ======
 */
const mrrChartSeries = computed(() => [{ name: 'MRR', data: mrrData.map(d => d.mrr) }])
const mrrChartOptions = computed<ApexOptions>(() => ({
  chart: { toolbar: { show: false }, zoom: { enabled: false }, foreColor: '#6b7280' },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 100] } },
  xaxis: { categories: mrrData.map(d => d.month), axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { labels: { formatter: (val: number) => `$${(val / 1000).toFixed(0)}k` } },
  tooltip: { y: { formatter: (val: number) => `$${val.toLocaleString()}` } },
  colors: ['#3b82f6']
}))

const revenueChartSeries = computed(() => [
  { name: 'Revenue', data: revenueExpenseData.map(d => d.revenue) },
  { name: 'Expenses', data: revenueExpenseData.map(d => d.expenses) }
])
const revenueChartOptions = computed<ApexOptions>(() => ({
  chart: { type: 'bar', stacked: false, toolbar: { show: false }, foreColor: '#6b7280' },
  plotOptions: { bar: { horizontal: false, columnWidth: '45%', borderRadius: 6 } },
  dataLabels: { enabled: false },
  xaxis: { categories: revenueExpenseData.map(d => d.month), axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { labels: { formatter: (val: number) => `$${(val / 1000).toFixed(0)}k` } },
  tooltip: { y: { formatter: (val: number) => `$${val.toLocaleString()}` } },
  colors: ['#22c55e', '#ef4444'],
  legend: { position: 'top', fontSize: '12px' },
  grid: { borderColor: 'rgba(148, 163, 184, 0.25)', strokeDashArray: 4 }
}))

const customerGrowthSeries = computed(() => [
  { name: 'New Customers', data: customerGrowthData.map(d => d.new) },
  { name: 'Churned', data: customerGrowthData.map(d => d.churned) }
])
const customerGrowthOptions = computed<ApexOptions>(() => ({
  chart: { type: 'bar', toolbar: { show: false }, foreColor: '#6b7280' },
  plotOptions: { bar: { horizontal: false, columnWidth: '45%', borderRadius: 6 } },
  dataLabels: { enabled: false },
  xaxis: { categories: customerGrowthData.map(d => d.month), axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { labels: { formatter: (val: number) => `${val}` } },
  colors: ['#22c55e', '#ef4444'],
  legend: { position: 'top', fontSize: '12px' },
  grid: { borderColor: 'rgba(148, 163, 184, 0.25)', strokeDashArray: 4 }
}))

const planDistributionSeries = computed(() => planDistributionData.map(d => d.customers))
const planDistributionOptions = computed<ApexOptions>(() => ({
  chart: { type: 'donut', foreColor: '#6b7280' },
  labels: planDistributionData.map(d => d.plan),
  dataLabels: { enabled: false },
  legend: { position: 'bottom', fontSize: '12px' },
  colors: ['#3b82f6', '#a855f7', '#22c55e']
}))

const revenueSourceSeries = computed(() => revenueSourceData.map(d => d.revenue))
const revenueSourceOptions = computed<ApexOptions>(() => ({
  chart: { type: 'donut', foreColor: '#6b7280' },
  labels: revenueSourceData.map(d => d.source),
  dataLabels: { enabled: false },
  legend: { position: 'bottom', fontSize: '12px' },
  colors: ['#3b82f6', '#a855f7', '#22c55e', '#f59e0b']
}))

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
  const colors: Record<string, string> = { Completed: 'green', Pending: 'yellow', Failed: 'red', Refunded: 'gray' }
  return colors[status] || 'gray'
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

/**
 * Cards config
 */
const keyCards = computed(() => ([
  {
    label: 'MRR',
    value: `$${formatCurrency(mrr.value)}`,
    delta: mrrGrowth.value,
    deltaLabel: 'vs last month',
    icon: 'i-heroicons-currency-dollar',
    toneBg: 'bg-blue-100 dark:bg-blue-900/30',
    toneText: 'text-blue-600 dark:text-blue-400'
  },
  {
    label: 'ARR',
    value: `$${formatCurrency(arr.value)}`,
    delta: arrGrowth.value,
    deltaLabel: 'YoY',
    icon: 'i-heroicons-chart-bar-square',
    toneBg: 'bg-green-100 dark:bg-green-900/30',
    toneText: 'text-green-600 dark:text-green-400'
  },
  {
    label: 'Customers',
    value: `${formatNumber(activeCustomers.value)}`,
    delta: newCustomersThisMonth.value,
    deltaLabel: 'this month',
    icon: 'i-heroicons-user-group',
    toneBg: 'bg-purple-100 dark:bg-purple-900/30',
    toneText: 'text-purple-600 dark:text-purple-400',
    isAbsoluteDelta: true
  },
  {
    label: 'Churn Rate',
    value: `${churnRate.value}%`,
    delta: churnRateChange.value,
    deltaLabel: 'vs last month',
    icon: 'i-heroicons-arrow-trending-down',
    toneBg: 'bg-red-100 dark:bg-red-900/30',
    toneText: 'text-red-600 dark:text-red-400'
  }
]))

const secondaryCards = computed(() => ([
  { label: 'LTV', value: `$${formatCurrency(ltv.value)}` },
  { label: 'CAC', value: `$${formatCurrency(cac.value)}` },
  { label: 'LTV:CAC', value: `${ltvCacRatio.value}:1` },
  { label: 'NRR', value: `${nrr.value}%` },
  { label: 'ARPU', value: `$${formatCurrency(arpu.value)}` },
  { label: 'Trial Conv.', value: `${trialConversionRate.value}%` }
]))
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Page container -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <!-- Top toolbar (more user-friendly) -->
      <DashboardHeader
        :user="userName"
        :greeting="getGreeting"
        v-model="modelValue"
        v-model:preset="selectedPreset"
        :presets="datePresets"
        :date-label="dateLabel"
      />

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
            list: 'p-1 bg-white dark:bg-gray-900 rounded-2xl ring-1 ring-gray-200/60 dark:ring-gray-800/60',
            trigger: 'px-3 py-2'
          }"
        >
          <!-- ===================== OVERVIEW ===================== -->
          <template #overview>
            <div class="mt-5 space-y-6">
              <!-- Key Metrics -->
              <!-- Key Metrics -->
              <DashboardStats :cards="keyCards" />

              <!-- Secondary Metrics -->
              <UCard :ui="{ body: 'p-5' }">
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div
                    v-for="m in secondaryCards"
                    :key="m.label"
                    class="rounded-xl bg-gray-50 dark:bg-gray-900/40 p-4 text-center
                           hover:bg-gray-100 dark:hover:bg-gray-900/60 transition-colors"
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

              <!-- Charts -->
              <div class="grid gap-6 lg:grid-cols-2">
                <UCard class="hover:shadow-lg transition-shadow duration-200">
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
                        variant="ghost"
                        class="w-20"
                      />
                    </div>
                  </template>
                  <VueApexCharts type="line" height="320" :options="mrrChartOptions" :series="mrrChartSeries" />
                </UCard>

                <UCard class="hover:shadow-lg transition-shadow duration-200">
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
                        variant="ghost"
                        class="w-20"
                      />
                    </div>
                  </template>
                  <VueApexCharts type="bar" height="320" :options="revenueChartOptions" :series="revenueChartSeries" />
                </UCard>
              </div>
            </div>
          </template>

          <!-- ===================== REVENUE ===================== -->
          <template #revenue>
            <div class="mt-5 space-y-6">
              <div class="grid gap-6 lg:grid-cols-2">
                <UCard class="hover:shadow-lg transition-shadow duration-200">
                  <template #header>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Revenue vs Expenses</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Profit and loss overview</p>
                    </div>
                  </template>
                  <VueApexCharts type="bar" height="320" :options="revenueChartOptions" :series="revenueChartSeries" />
                </UCard>

                <UCard class="hover:shadow-lg transition-shadow duration-200">
                  <template #header>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Revenue by Source</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Breakdown by acquisition channel</p>
                    </div>
                  </template>
                  <VueApexCharts type="donut" height="320" :options="revenueSourceOptions" :series="revenueSourceSeries" />
                </UCard>
              </div>

              <UCard class="hover:shadow-lg transition-shadow duration-200">
                <template #header>
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Latest payment activity</p>
                    </div>
                    <UButton variant="ghost" color="neutral" size="sm">View All →</UButton>
                  </div>
                </template>

                <UTable :data="recentTransactions" :columns="transactionColumns">
                  <template #id-data="{ row }">
                    <span class="font-mono text-sm text-gray-900 dark:text-white">{{ (row as any).id }}</span>
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
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ (row as any).date }}</span>
                  </template>
                </UTable>
              </UCard>
            </div>
          </template>

          <!-- ===================== CUSTOMERS ===================== -->
          <template #customers>
            <div class="mt-5 space-y-6">
              <div class="grid gap-6 lg:grid-cols-3">
                <UCard class="lg:col-span-2 hover:shadow-lg transition-shadow duration-200">
                  <template #header>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Customer Growth</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">New vs churned customers</p>
                    </div>
                  </template>
                  <VueApexCharts type="bar" height="320" :options="customerGrowthOptions" :series="customerGrowthSeries" />
                </UCard>

                <UCard class="hover:shadow-lg transition-shadow duration-200">
                  <template #header>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Plan Distribution</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">By subscription tier</p>
                    </div>
                  </template>
                  <VueApexCharts type="donut" height="320" :options="planDistributionOptions" :series="planDistributionSeries" />
                </UCard>
              </div>

              <UCard class="hover:shadow-lg transition-shadow duration-200">
                <template #header>
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Top Customers</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">By monthly revenue</p>
                    </div>
                    <UButton variant="ghost" color="neutral" size="sm">View All →</UButton>
                  </div>
                </template>

                <div class="space-y-3">
                  <div
                    v-for="(customer, idx) in topCustomers"
                    :key="customer.id || idx"
                    class="flex items-center justify-between gap-4 p-4 rounded-xl
                           bg-gray-50 dark:bg-gray-900/40
                           hover:bg-gray-100 dark:hover:bg-gray-900/60 transition-colors"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {{ customer.name.charAt(0) }}
                      </div>
                      <div class="min-w-0">
                        <p class="font-semibold text-gray-900 dark:text-white truncate">{{ customer.name }}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {{ customer.plan }} • {{ customer.users }} users
                        </p>
                      </div>
                    </div>

                    <div class="text-right shrink-0">
                      <p class="font-semibold text-gray-900 dark:text-white">${{ formatCurrency(customer.mrr) }}/mo</p>
                      <UBadge :color="customer.status === 'Active' ? 'green' : 'gray'" variant="soft" size="xs">
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
              <UCard class="hover:shadow-lg transition-shadow duration-200">
                <template #header>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Activity Feed</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Recent system events</p>
                  </div>
                </template>

                <div class="space-y-3">
                  <div
                    v-for="activity in recentActivities"
                    :key="activity.id"
                    class="flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <div class="shrink-0">
                      <div class="w-9 h-9 rounded-full flex items-center justify-center" :class="getActivityIconBg(activity.type)">
                        <UIcon :name="getActivityIcon(activity.type)" class="w-4 h-4" :class="getActivityIconColor(activity.type)" />
                      </div>
                    </div>

                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-gray-900 dark:text-white">
                        <span class="font-semibold">{{ activity.user }}</span> {{ activity.action }}
                      </p>
                      <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ activity.time }}</p>
                    </div>
                  </div>
                </div>
              </UCard>

              <UCard class="hover:shadow-lg transition-shadow duration-200">
                <template #header>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Stats</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">At a glance</p>
                  </div>
                </template>

                <div class="grid grid-cols-2 gap-4">
                  <UCard class="hover:shadow-md transition-shadow" :ui="{ body: 'p-4' }">
                    <div class="text-xs text-gray-600 dark:text-gray-400">Date range</div>
                    <div class="mt-1 font-semibold text-gray-900 dark:text-white truncate">{{ dateLabel }}</div>
                  </UCard>
                  <UCard class="hover:shadow-md transition-shadow" :ui="{ body: 'p-4' }">
                    <div class="text-xs text-gray-600 dark:text-gray-400">Active tab</div>
                    <div class="mt-1 font-semibold text-gray-900 dark:text-white capitalize truncate">{{ String(activeTab) }}</div>
                  </UCard>
                  <UCard class="hover:shadow-md transition-shadow" :ui="{ body: 'p-4' }">
                    <div class="text-xs text-gray-600 dark:text-gray-400">Customers</div>
                    <div class="mt-1 font-semibold text-gray-900 dark:text-white">{{ formatNumber(activeCustomers) }}</div>
                  </UCard>
                  <UCard class="hover:shadow-md transition-shadow" :ui="{ body: 'p-4' }">
                    <div class="text-xs text-gray-600 dark:text-gray-400">Churn</div>
                    <div class="mt-1 font-semibold text-gray-900 dark:text-white">{{ churnRate }}%</div>
                  </UCard>
                </div>
              </UCard>
            </div>
          </template>
        </UTabs>
      </div>
    </div>
  </div>
</template>
