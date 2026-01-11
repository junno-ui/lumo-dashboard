<script setup lang="ts">
import { computed, h, ref, resolveComponent, shallowRef, watch } from 'vue'
import type { ApexOptions } from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { useClipboard, useColorMode } from '@vueuse/core'
import { CalendarDate, DateFormatter, getLocalTimeZone, today } from '@internationalized/date'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { 
  revenueData as mockRevenueData, 
  analyticsStats, 
  revenueSources as mockRevenueSources, 
  payments as mockPayments 
} from '@/mock/analytics'

/**
 * ======================================================
 * Resolved components (used in table cells with h())
 * ======================================================
 */
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UIcon = resolveComponent('UIcon')
const UAvatar = resolveComponent('UAvatar')
const ApexChart = VueApexCharts

const toast = useToast()
const { copy } = useClipboard()

/**
 * ======================================================
 * Dark mode aware chart styles (Apex)
 * ======================================================
 */
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// Readable in both themes
const chartText = computed(() => (isDark.value ? '#cbd5e1' : '#64748b')) // slate-300 / slate-500
const chartGrid = computed(() => (isDark.value ? 'rgba(148,163,184,.18)' : 'rgba(148,163,184,.28)'))
const chartStrokeBg = computed(() => (isDark.value ? '#0b1220' : '#ffffff')) // donut stroke
const chartTooltipTheme = computed(() => (isDark.value ? 'dark' : 'light'))

function baseApexOptions(extra: ApexOptions): ApexOptions {
  return {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: chartText.value,
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
    },
    grid: { borderColor: chartGrid.value, strokeDashArray: 4 },
    legend: {
      position: 'top',
      fontSize: '12px',
      labels: { colors: chartText.value },
    },
    tooltip: { theme: chartTooltipTheme.value as any },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: chartText.value } }
    },
    yaxis: { labels: { style: { colors: chartText.value } } },
    ...extra
  }
}

/**
 * ======================================================
 * SAMPLE DATA
 * ======================================================
 */
const revenueData = ref(mockRevenueData)
const revenueSources = ref(mockRevenueSources)

type PaymentStatus = 'paid' | 'failed' | 'refunded'
type Payment = {
  id: string
  date: string // ISO datetime
  status: PaymentStatus
  email: string
  amount: number
  currency?: string
}

const payments = ref<Payment[]>(mockPayments as Payment[])

/**
 * ======================================================
 * Date range (All time default)
 * ======================================================
 */
const tz = getLocalTimeZone()
const df = new DateFormatter('en-US', { dateStyle: 'medium' })
const datePopoverOpen = ref(false)

const presetItems = [
  { label: 'All time', value: 'all' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Year to date', value: 'ytd' },
  { label: 'Custom', value: 'custom' }
]
type PresetValue = (typeof presetItems)[number]['value']
const selectedPreset = ref<PresetValue>('all')

const rangeModel = shallowRef<{ start: CalendarDate | null | any; end: CalendarDate | null | any }>({
  start: null,
  end: null
})

const rangeLabel = computed(() => {
  const s = rangeModel.value.start
  const e = rangeModel.value.end
  if (!s && !e) return 'All time'
  if (s && !e) return df.format(s.toDate(tz))
  if (s && e) return `${df.format(s.toDate(tz))} - ${df.format(e.toDate(tz))}`
  return 'Pick a date'
})

function applyPreset(p: PresetValue) {
  if (p === 'custom') return

  if (p === 'all') {
    rangeModel.value = { start: null, end: null }
    return
  }

  const end = today(tz)
  let start = end

  switch (p) {
    case '7d': start = end.subtract({ days: 6 }); break
    case '30d': start = end.subtract({ days: 29 }); break
    case '90d': start = end.subtract({ days: 89 }); break
    case 'ytd': start = new CalendarDate(end.year, 1, 1); break
  }

  rangeModel.value = { start, end }
}

watch(selectedPreset, (p) => applyPreset(p), { immediate: true })

function setAllTime() {
  selectedPreset.value = 'all'
  rangeModel.value = { start: null, end: null }
}

function setRangeToData() {
  const dates = payments.value
    .map((p) => new Date(p.date))
    .filter((d) => !Number.isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime())

  if (!dates.length) return

  const min = dates.length ? dates[0] : undefined;
const max = dates.length ? dates[dates.length - 1] : undefined;

  if (min !== undefined && max !== undefined) {
  rangeModel.value = {
    start: new CalendarDate(min.getFullYear(), min.getMonth() + 1, min.getDate()),
    end: new CalendarDate(max.getFullYear(), max.getMonth() + 1, max.getDate())
  };
  selectedPreset.value = 'custom';
}
}

/**
 * ======================================================
 * Formatting helpers
 * ======================================================
 */
const formatCurrency = (v: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v)
const formatMoney = (v: number, currency = 'EUR') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(v)

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

function statusMeta(status: PaymentStatus) {
  if (status === 'paid') return { label: 'Paid', color: 'success' as const, icon: 'i-lucide-check-circle' }
  if (status === 'failed') return { label: 'Failed', color: 'error' as const, icon: 'i-lucide-x-circle' }
  return { label: 'Refunded', color: 'neutral' as const, icon: 'i-lucide-rotate-ccw' }
}

function initials(email: string) {
  const name = email.split('@')[0] || ''
  const parts = name.split(/[._-]/).filter(Boolean)
  const a = (parts[0]?.[0] || 'U').toUpperCase()
  const b = (parts[1]?.[0] || parts[0]?.[1] || '').toUpperCase()
  return (a + b).trim()
}

/**
 * ======================================================
 * KPIs
 * ======================================================
 */
const revenueTotal = computed(() => revenueData.value.reduce((a, b) => a + (b.revenue || 0), 0))
const profitTotal = computed(() => revenueData.value.reduce((a, b) => a + (b.profit || 0), 0))
const expensesTotal = computed(() => Math.max(revenueTotal.value - profitTotal.value, 0))
const grossMarginPct = computed(() => {
  const rev = revenueTotal.value || 1
  return Math.round((profitTotal.value / rev) * 1000) / 10
})

const refundsEstimate = computed(() => Math.round(revenueTotal.value * 0.025))
const netRevenue = computed(() => Math.max(revenueTotal.value - refundsEstimate.value, 0))

const stats = computed(() => ([
  { label: 'Total Revenue', value: `$${formatCurrency(revenueTotal.value)}`, sub: 'Gross', change: analyticsStats.revenueGrowth, icon: 'i-heroicons-currency-dollar' },
  { label: 'Net Revenue', value: `$${formatCurrency(netRevenue.value)}`, sub: `Refunds est. $${formatCurrency(refundsEstimate.value)}`, change: '+2.1%', icon: 'i-heroicons-receipt-percent' },
  { label: 'Profit', value: `$${formatCurrency(profitTotal.value)}`, sub: `Expenses $${formatCurrency(expensesTotal.value)}`, change: '+5.1%', icon: 'i-heroicons-banknotes' },
  { label: 'Gross Margin', value: `${grossMarginPct.value}%`, sub: 'Margin health', change: '+0.8%', icon: 'i-heroicons-chart-pie' },
  { label: 'Total Requests', value: formatCurrency(analyticsStats.totalRequests), sub: 'API usage', change: analyticsStats.requestsGrowth, icon: 'i-heroicons-chart-bar' },
  { label: 'Active Users (Now)', value: formatCurrency(analyticsStats.activeUsersNow), sub: 'Realtime', change: analyticsStats.activeUsersGrowth, icon: 'i-heroicons-user-group' }
]))

/**
 * ======================================================
 * Charts (dark-mode ready)
 * ======================================================
 */
const revenueTrendSeries = computed(() => ([
  { name: 'Revenue', data: revenueData.value.map(d => d.revenue) },
  { name: 'Profit', data: revenueData.value.map(d => d.profit || 0) },
  { name: 'Expenses', data: revenueData.value.map(d => Math.max((d.revenue || 0) - (d.profit || 0), 0)) }
]))

const revenueTrendOptions = computed<ApexOptions>(() =>
  baseApexOptions({
    chart: { type: 'area' },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.28, opacityTo: 0.06, stops: [0, 100] }
    },
    colors: ['#3b82f6', '#22c55e', '#ef4444'],
    xaxis: { categories: revenueData.value.map(d => d.month) },
    yaxis: {
      labels: {
        style: { colors: chartText.value },
        formatter: (val: number) => `$${(val / 1000).toFixed(0)}k`
      }
    },
    tooltip: { theme: chartTooltipTheme.value as any, y: { formatter: (val: number) => `$${val.toLocaleString()}` } }
  })
)

const sourceSeries = computed(() => revenueSources.value.map(s => s.revenue))
const sourceOptions = computed<ApexOptions>(() =>
  baseApexOptions({
    chart: { type: 'donut' },
    labels: revenueSources.value.map(s => s.source),
    dataLabels: { enabled: false },
    legend: { position: 'bottom', fontSize: '12px', labels: { colors: chartText.value } },
    stroke: { colors: [chartStrokeBg.value] },
    plotOptions: { pie: { donut: { size: '72%' } } }
  })
)

/**
 * ======================================================
 * Transactions: filters + pagination
 * ======================================================
 */
const query = ref('')
const statusFilter = ref<'all' | PaymentStatus>('all')
const sortKey = ref<'date' | 'amount'>('date')
const sortDir = ref<'asc' | 'desc'>('desc')

const page = ref(1)
const pageSize = ref(8)

const filteredPayments = computed(() => {
  const q = query.value.trim().toLowerCase()
  const s = rangeModel.value.start?.toDate(tz)
  const e = rangeModel.value.end?.toDate(tz)

  let rows = payments.value.filter((p) => {
    if (statusFilter.value !== 'all' && p.status !== statusFilter.value) return false

    // date filter active only if BOTH start & end exist
    if (s && e) {
      const d = new Date(p.date)
      if (d < s) return false
      if (d > e) return false
    }

    if (!q) return true
    return p.id.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.status.toLowerCase().includes(q)
  })

  rows = rows.sort((a, b) => {
    const dir = sortDir.value === 'asc' ? 1 : -1
    if (sortKey.value === 'amount') return (a.amount - b.amount) * dir
    return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir
  })

  return rows
})

watch([filteredPayments, pageSize], () => { page.value = 1 })

const paginatedPayments = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredPayments.value.slice(start, start + pageSize.value)
})

const paymentCounts = computed(() => {
  const list = filteredPayments.value
  return {
    all: list.length,
    paid: list.filter(x => x.status === 'paid').length,
    failed: list.filter(x => x.status === 'failed').length,
    refunded: list.filter(x => x.status === 'refunded').length
  }
})

/**
 * Dropdown items (onSelect)
 */
function getRowItems(row: Row<Payment>) {
  const p = row.original
  return [
    { type: 'label', label: 'Actions' },
    {
      label: 'Copy payment ID',
      icon: 'i-lucide-copy',
      onSelect() {
        copy(p.id)
        toast.add({ title: 'Payment ID copied!', color: 'success', icon: 'i-lucide-circle-check' })
      }
    },
    { type: 'separator' },
    { label: 'View customer', icon: 'i-lucide-user', onSelect: () => console.log('customer', p.email) },
    { label: 'View payment details', icon: 'i-lucide-eye', onSelect: () => console.log('details', p.id) }
  ]
}

/**
 * Table columns
 */
const columns: TableColumn<Payment>[] = [
  {
    accessorKey: 'id',
    header: '#',
    meta: { class: { th: 'w-28', td: 'align-middle' } },
    cell: ({ row }) => {
      const id = String(row.getValue('id'))

      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'font-mono text-sm font-semibold text-gray-900 dark:text-white' }, `#${id}`),
        h(UButton as any, {
          icon: 'i-lucide-copy',
          color: 'neutral',
          variant: 'ghost',
          size: 'xs',
          class: 'opacity-0 group-hover:opacity-100 transition-opacity',
          'aria-label': 'Copy payment ID',
          onClick: () => {
            copy(id)
            toast.add({ title: 'Copied!', description: `#${id}`, color: 'success', icon: 'i-lucide-circle-check' })
          }
        })
      ])
    }
  },
  {
    accessorKey: 'date',
    header: 'Date',
    meta: { class: { th: 'w-56', td: 'align-middle' } },
    cell: ({ row }) => h('div', { class: 'text-sm text-gray-700 dark:text-gray-300' }, formatDateTime(String(row.getValue('date'))))
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: { class: { th: 'w-40', td: 'align-middle' } },
    cell: ({ row }) => {
      const s = row.getValue('status') as PaymentStatus
      const meta = statusMeta(s)

      return h(
        UBadge,
        { class: 'capitalize gap-1', variant: 'subtle', color: meta.color },
        () => [h(UIcon as any, { name: meta.icon, class: 'w-3.5 h-3.5' }), meta.label]
      )
    }
  },
  {
    accessorKey: 'email',
    header: 'Customer',
    meta: { class: { th: 'min-w-[280px]', td: 'align-middle' } },
    cell: ({ row }) => {
      const email = String(row.getValue('email'))

      return h('div', { class: 'flex items-center gap-3 min-w-0' }, [
        h(UAvatar as any, { size: 'sm', text: initials(email), class: 'shrink-0' }),
        h('div', { class: 'min-w-0' }, [
          h('div', { class: 'truncate text-sm font-semibold text-gray-900 dark:text-white' }, email.split('@')[0]),
          h('div', { class: 'truncate text-xs text-gray-500 dark:text-gray-400' }, email)
        ])
      ])
    }
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    meta: { class: { th: 'w-44 text-right', td: 'align-middle text-right' } },
    cell: ({ row }) => {
      const p = row.original as Payment
      return h('div', { class: 'text-right' }, [
        h('div', { class: 'font-semibold text-gray-900 dark:text-white' }, formatMoney(p.amount, p.currency || 'EUR')),
        h('div', { class: 'text-[11px] text-gray-500 dark:text-gray-400' }, p.currency || 'EUR')
      ])
    }
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-right' }, ''),
    meta: { class: { th: 'w-14 text-right', td: 'align-middle text-right' } },
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu as any,
          { content: { align: 'end' }, items: getRowItems(row as unknown as Row<Payment>), 'aria-label': 'Actions dropdown' },
          () =>
            h(UButton as any, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              size: 'sm',
              class: 'ml-auto',
              'aria-label': 'Actions dropdown'
            })
        )
      )
    }
  }
]
</script>

<template>
  <div class="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-950 transition-colors">
    <div class=" px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Header / Toolbar -->
      <div class="rounded-3xl border border-gray-200/70 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/40 backdrop-blur p-4 sm:p-5">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div class="min-w-0">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Revenue analytics
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Revenue performance, margin health, source mix, and payment activity.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-2">
            <USelectMenu
              v-model="selectedPreset"
              :items="presetItems"
              value-key="value"
              label-key="label"
              size="sm"
              color="neutral"
              variant="outline"
              class="w-full sm:w-44"
            />

            <UPopover v-model:open="datePopoverOpen">
              <UButton
                size="sm"
                color="primary"
                variant="soft"
                icon="i-lucide-calendar"
                class="w-full sm:w-auto justify-center"
                @click="selectedPreset = 'custom'"
              >
                {{ rangeLabel }}
              </UButton>

              <template #content>
                <div class="p-3 w-[min(720px,92vw)]">
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <div class="text-sm font-semibold text-gray-900 dark:text-white">Custom date range</div>
                    <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-x" @click="datePopoverOpen = false" />
                  </div>

                  <div class="rounded-2xl ring-1 ring-gray-200/60 dark:ring-gray-800/60 bg-white/70 dark:bg-gray-950/30 p-2">
                    <UCalendar v-model="rangeModel" range :number-of-months="2" class="p-2" />
                  </div>

                  <div class="mt-3 flex items-center justify-between gap-2">
                    <div class="text-xs text-gray-600 dark:text-gray-400 truncate">
                      Selected: <span class="font-medium text-gray-900 dark:text-white">{{ rangeLabel }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UButton size="sm" color="neutral" variant="outline" @click="setAllTime()">
                        All time
                      </UButton>
                      <UButton size="sm" color="primary" variant="solid" @click="datePopoverOpen = false">
                        Apply
                      </UButton>
                    </div>
                  </div>
                </div>
              </template>
            </UPopover>

            <UButton size="sm" color="neutral" variant="soft" icon="i-lucide-download" class="w-full sm:w-auto justify-center">
              Export
            </UButton>
          </div>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <UCard
          v-for="(stat, idx) in stats"
          :key="idx"
          class="rounded-3xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          :ui="{ body: 'p-5' }"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="p-2 rounded-2xl bg-gray-50 dark:bg-gray-900/50 ring-1 ring-gray-200/70 dark:ring-gray-800/60">
                <UIcon :name="stat.icon" class="w-5 h-5 text-primary-500" />
              </div>
              <div class="min-w-0">
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {{ stat.label }}
                </p>
                <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white truncate">
                  {{ stat.value }}
                </p>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ stat.sub }}
                </p>
              </div>
            </div>

            <UBadge color="success" variant="subtle" size="xs" class="whitespace-nowrap">
              <span class="flex items-center gap-1">
                <UIcon name="i-heroicons-arrow-trending-up" class="w-3 h-3" />
                <span>{{ stat.change }}</span>
              </span>
            </UBadge>
          </div>

          <div v-if="stat.label === 'Gross Margin'" class="mt-4">
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Margin health</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ grossMarginPct }}%</span>
            </div>
            <UProgress :model-value="grossMarginPct" class="mt-2" />
          </div>
        </UCard>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UCard class="rounded-3xl lg:col-span-2 hover:shadow-md transition-shadow" :ui="{ body: 'p-0' }">
          <template #header>
            <div class="p-5">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Revenue, Profit & Expenses</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Trend over time</p>
            </div>
          </template>

          <div class="px-5 pb-5">
            <div class="rounded-2xl ring-1 ring-gray-200/60 dark:ring-gray-800/60 bg-white/70 dark:bg-gray-950/30 p-2">
              <ApexChart type="area" height="330" :options="revenueTrendOptions" :series="revenueTrendSeries" />
            </div>
          </div>
        </UCard>

        <UCard class="rounded-3xl hover:shadow-md transition-shadow" :ui="{ body: 'p-0' }">
          <template #header>
            <div class="p-5">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Revenue Sources</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Channel mix</p>
            </div>
          </template>

          <div class="px-5 pb-5">
            <div class="rounded-2xl ring-1 ring-gray-200/60 dark:ring-gray-800/60 bg-white/70 dark:bg-gray-950/30 p-2">
              <ApexChart type="donut" height="330" :options="sourceOptions" :series="sourceSeries" />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Transactions -->
      <UCard class="rounded-3xl hover:shadow-md transition-shadow" :ui="{ body: 'p-5' }">
        <template #header>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between p-5 pb-0">
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Transactions</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Search, filter by status, sort, and paginate. Date range follows the top filter.
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
              <UInput
                v-model="query"
                icon="i-lucide-search"
                placeholder="Search invoice, email, status..."
                size="sm"
                class="w-full sm:w-72"
              />
              <UButton size="sm" color="primary" variant="soft" icon="i-lucide-plus" class="w-full sm:w-auto justify-center">
                New invoice
              </UButton>
            </div>
          </div>
        </template>

        <!-- Filter Bar -->
        <div
          class="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-gray-50 dark:bg-gray-900/35 p-2
                 ring-1 ring-gray-200/60 dark:ring-gray-800/60"
        >
          <UButton size="xs" :variant="statusFilter === 'all' ? 'solid' : 'soft'" :color="statusFilter === 'all' ? 'primary' : 'neutral'" @click="statusFilter = 'all'">
            All ({{ paymentCounts.all }})
          </UButton>
          <UButton size="xs" :variant="statusFilter === 'paid' ? 'solid' : 'soft'" :color="statusFilter === 'paid' ? 'success' : 'neutral'" @click="statusFilter = 'paid'">
            Paid ({{ paymentCounts.paid }})
          </UButton>
          <UButton size="xs" :variant="statusFilter === 'failed' ? 'solid' : 'soft'" :color="statusFilter === 'failed' ? 'error' : 'neutral'" @click="statusFilter = 'failed'">
            Failed ({{ paymentCounts.failed }})
          </UButton>
          <UButton size="xs" :variant="statusFilter === 'refunded' ? 'solid' : 'soft'" color="neutral" @click="statusFilter = 'refunded'">
            Refunded ({{ paymentCounts.refunded }})
          </UButton>

          <div class="ml-auto flex flex-wrap items-center gap-2">
            <USelectMenu
              v-model="sortKey"
              :items="[
                { label: 'Sort by date', value: 'date' },
                { label: 'Sort by amount', value: 'amount' }
              ]"
              value-key="value"
              label-key="label"
              size="sm"
              color="neutral"
              variant="ghost"
              class="w-36"
            />
            <UButton
              size="sm"
              color="neutral"
              variant="ghost"
              :icon="sortDir === 'desc' ? 'i-lucide-arrow-down' : 'i-lucide-arrow-up'"
              @click="sortDir = sortDir === 'desc' ? 'asc' : 'desc'"
              aria-label="Toggle sort direction"
            />
            <USelectMenu
              v-model="pageSize"
              :items="[8, 12, 20].map(v => ({ label: `${v}/page`, value: v }))"
              value-key="value"
              label-key="label"
              size="sm"
              color="neutral"
              variant="ghost"
              class="w-28"
            />
          </div>
        </div>

        <!-- Empty helper -->
        <div
          v-if="filteredPayments.length === 0"
          class="mt-4 rounded-2xl p-4 bg-white/70 dark:bg-gray-950/40 backdrop-blur ring-1 ring-gray-200/60 dark:ring-gray-800/60"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div class="font-semibold text-gray-900 dark:text-white">No transactions found</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Most likely your date range doesn’t match the transaction dates.
              </div>
            </div>
            <div class="flex items-center gap-2">
              <UButton size="sm" color="neutral" variant="outline" @click="setRangeToData()">
                Use data range
              </UButton>
              <UButton size="sm" color="primary" variant="solid" @click="setAllTime()">
                Show all time
              </UButton>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="mt-4 rounded-2xl overflow-hidden ring-1 ring-gray-200/60 dark:ring-gray-800/60">
          <UTable
            :data="paginatedPayments"
            :columns="columns"
            :ui="{
              thead: 'bg-white dark:bg-gray-900/60',
              th: 'text-xs font-semibold text-gray-600 dark:text-gray-300',
              tr: 'group hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors',
              td: 'py-4'
            }"
          />
        </div>

        <!-- Pagination -->
        <div class="mt-4 flex items-center justify-between gap-3">
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Showing
            <span class="font-medium text-gray-900 dark:text-white">{{ paginatedPayments.length }}</span>
            of
            <span class="font-medium text-gray-900 dark:text-white">{{ filteredPayments.length }}</span>
            results
          </div>

          <UPagination
            v-model:page="page"
            :total="filteredPayments.length"
            :items-per-page="pageSize"
            size="sm"
          />
        </div>
      </UCard>
    </div>
  </div>
</template>
