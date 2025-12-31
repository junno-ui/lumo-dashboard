<script setup lang="ts">
import { computed, h, ref, resolveComponent, watch } from 'vue'
import type { ApexOptions } from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts'
import type { TableColumn } from '@nuxt/ui'
import { analyticsStats, usageDataNumeric } from '@/mock/analytics'

/**
 * Resolved components (for h() in table cells)
 */
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UIcon = resolveComponent('UIcon')

type UsagePoint = { date: string; requests: number; bandwidthGB: number }
type UsageRow = { date: string; dateLabel: string; requests: number; bandwidthGB: number; percent: number }

const ApexChart = VueApexCharts

/**
 * -----------------------------
 * Range selector (REAL filtering)
 * -----------------------------
 */
type RangeValue = '7d' | '30d' | '90d' | 'all'

const selectedRange = ref<RangeValue>('7d')

const rangeItems = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'All time', value: 'all' }
]

const udAll = (usageDataNumeric as UsagePoint[]).slice()

const sortedUd = computed(() => {
  return [...udAll].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

const windowSize = computed(() => {
  if (selectedRange.value === '7d') return 7
  if (selectedRange.value === '30d') return 30
  if (selectedRange.value === '90d') return 90
  return 0 // all
})

function sliceWindow<T>(arr: T[], size: number, offsetFromEnd: number) {
  // offsetFromEnd: 0 => latest window, 1 => previous window
  if (size <= 0) return arr
  const end = arr.length - offsetFromEnd * size
  const start = Math.max(0, end - size)
  return arr.slice(start, Math.max(start, end))
}

const udCurrent = computed(() => sliceWindow(sortedUd.value, windowSize.value, 0))
const udPrev = computed(() => sliceWindow(sortedUd.value, windowSize.value, 1))

/**
 * -----------------------------
 * Metrics helpers
 * -----------------------------
 */
const sum = (arr: UsagePoint[], key: keyof UsagePoint) =>
  arr.reduce((a, b) => a + (Number(b[key]) || 0), 0)

const max = (arr: UsagePoint[], key: keyof UsagePoint) =>
  arr.reduce((m, x) => Math.max(m, Number(x[key]) || 0), 0)

function pctChange(prev: number, curr: number) {
  if (!prev) return null
  return ((curr - prev) / prev) * 100
}

const currentRequests = computed(() => sum(udCurrent.value, 'requests'))
const prevRequests = computed(() => sum(udPrev.value, 'requests'))
const requestsDelta = computed(() => pctChange(prevRequests.value, currentRequests.value))

const currentBandwidth = computed(() => sum(udCurrent.value, 'bandwidthGB'))
const prevBandwidth = computed(() => sum(udPrev.value, 'bandwidthGB'))
const bandwidthDelta = computed(() => pctChange(prevBandwidth.value, currentBandwidth.value))

const avgRequests = computed(() => {
  const n = udCurrent.value.length || 1
  return Math.round(currentRequests.value / n)
})

const avgBandwidth = computed(() => {
  const n = udCurrent.value.length || 1
  return Math.round((currentBandwidth.value / n) * 10) / 10
})

const peakRequests = computed(() => max(udCurrent.value, 'requests'))
const peakBandwidth = computed(() => max(udCurrent.value, 'bandwidthGB'))

const maxBandwidth = computed(() => Math.max(0, peakBandwidth.value))

const lastDateLabel = computed(() => {
  
  const last = udCurrent.value.slice(-1)[0]?.date || sortedUd.value.slice(-1)[0]?.date;
  return last ? new Date(last).toLocaleDateString() : '-'
})

const pointsLabel = computed(() => `${udCurrent.value.length} pts`)

const formatCompact = (n: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

const formatNumber = (n: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)

const formatGB = (n: number) =>
  `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(n)} GB`

const deltaBadge = (delta: number | null) => {
  if (delta === null) return { color: 'neutral' as const, label: '—' }
  const up = delta >= 0
  return {
    color: up ? ('success' as const) : ('error' as const),
    label: `${up ? '+' : '-'}${Math.abs(delta).toFixed(1)}%`
  }
}

/**
 * -----------------------------
 * KPI cards (more informative)
 * -----------------------------
 */
const statCards = computed(() => {
  const reqB = deltaBadge(requestsDelta.value)
  const bwB = deltaBadge(bandwidthDelta.value)

  return [
    {
      label: 'Requests',
      value: formatCompact(currentRequests.value),
      sub: `Avg ${formatCompact(avgRequests.value)}/day`,
      badge: reqB,
      icon: 'i-heroicons-chart-bar'
    },
    {
      label: 'Bandwidth',
      value: formatGB(currentBandwidth.value),
      sub: `Avg ${formatGB(avgBandwidth.value)}/day`,
      badge: bwB,
      icon: 'i-heroicons-signal'
    },
    {
      label: 'Peak Requests',
      value: formatCompact(peakRequests.value),
      sub: `Last updated ${lastDateLabel.value}`,
      badge: { color: 'neutral' as const, label: pointsLabel.value },
      icon: 'i-heroicons-bolt'
    },
    {
      label: 'Active Users (now)',
      value: formatCompact(Number(analyticsStats.activeUsersNow || 0)),
      sub: 'Realtime',
      badge: { color: 'success' as const, label: String(analyticsStats.activeUsersGrowth || '+0%') },
      icon: 'i-heroicons-user-group'
    }
  ]
})

/**
 * -----------------------------
 * Chart: Requests (bar) + Bandwidth (line)
 * -----------------------------
 * Use computed so it updates with selectedRange.
 * Add :key to force Apex to re-render cleanly.
 */
const chartKey = computed(() => `${selectedRange.value}-${udCurrent.value.length}-${lastDateLabel.value}`)

const usageSeries = computed(() => ([
  {
    name: 'Requests',
    type: 'column',
    data: udCurrent.value.map((d) => d.requests)
  },
  {
    name: 'Bandwidth (GB)',
    type: 'line',
    data: udCurrent.value.map((d) => d.bandwidthGB)
  }
]))

const usageChartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'line',
    stacked: false,
    toolbar: { show: false },
    zoom: { enabled: false },
    foreColor: '#6b7280'
  },
  dataLabels: { enabled: false },
  stroke: { width: [0, 3], curve: 'smooth' },
  plotOptions: { bar: { columnWidth: '55%', borderRadius: 8 } },
  xaxis: {
    categories: udCurrent.value.map((d) => new Date(d.date).toLocaleDateString()),
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: [
    {
      title: { text: 'Requests' },
      labels: { formatter: (val: number) => formatCompact(val) }
    },
    {
      opposite: true,
      title: { text: 'Bandwidth (GB)' },
      labels: { formatter: (val: number) => `${val} GB` }
    }
  ],
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: (val: number, opts: any) => {
        return opts.seriesIndex === 0
          ? `${formatNumber(val)} req`
          : `${val} GB`
      }
    }
  },
  grid: {
    borderColor: 'rgba(148, 163, 184, 0.22)',
    strokeDashArray: 4
  },
  legend: { position: 'top', fontSize: '12px' }
}))

/**
 * -----------------------------
 * Bandwidth rows + Table
 * -----------------------------
 */
const bandwidthRows = computed<UsageRow[]>(() => {
  const mb = maxBandwidth.value || 1
  return udCurrent.value.map((d) => ({
    date: d.date,
    dateLabel: new Date(d.date).toLocaleDateString(),
    requests: d.requests,
    bandwidthGB: d.bandwidthGB,
    percent: Math.round((d.bandwidthGB / mb) * 100)
  }))
})

const topBandwidthRows = computed(() => {
  // show top 10 days by bandwidth
  return [...bandwidthRows.value]
    .sort((a, b) => (b.bandwidthGB || 0) - (a.bandwidthGB || 0))
    .slice(0, 10)
})

const columns: TableColumn<UsageRow>[] = [
  {
    accessorKey: 'dateLabel',
    header: 'Date',
    meta: { class: { th: 'w-40', td: 'align-middle' } }
  },
  {
    accessorKey: 'requests',
    header: 'Requests',
    meta: { class: { th: 'w-40', td: 'align-middle' } },
    cell: ({ row }) => h('div', { class: 'font-medium text-gray-900 dark:text-white' }, formatNumber(row.getValue('requests')))
  },
  {
    accessorKey: 'bandwidthGB',
    header: 'Bandwidth',
    meta: { class: { th: 'w-40', td: 'align-middle' } },
    cell: ({ row }) => h('div', { class: 'font-medium text-gray-900 dark:text-white' }, formatGB(Number(row.getValue('bandwidthGB'))))
  },
  {
    id: 'share',
    header: 'Share',
    cell: ({ row }) => {
      const p = Number(row.original.percent || 0)
      return h('div', { class: 'flex items-center gap-2' }, [
        h('div', { class: 'h-2.5 flex-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden' }, [
          h('div', {
            class: 'h-full rounded-full bg-primary-500/80',
            style: `width:${Math.max(0, Math.min(100, p))}%`
          })
        ]),
        h('div', { class: 'w-12 text-right text-xs text-gray-600 dark:text-gray-300' }, `${p}%`)
      ])
    }
  },
  {
    id: 'actions',
    header: '',
    meta: { class: { th: 'w-16 text-right', td: 'text-right' } },
    cell: ({ row }) => {
      return h(
        UDropdownMenu as any,
        {
          items: [
            { type: 'label', label: 'Actions' },
            {
              label: 'Copy date',
              icon: 'i-lucide-copy',
              onSelect: async () => {
                await navigator.clipboard.writeText(row.original.dateLabel)
              }
            },
            { type: 'separator' },
            { label: 'View details', icon: 'i-lucide-eye', onSelect: () => console.log('details', row.original) }
          ],
          content: { align: 'end' }
        },
        () =>
          h(UButton as any, {
            icon: 'i-lucide-ellipsis-vertical',
            color: 'neutral',
            variant: 'ghost',
            size: 'sm',
            'aria-label': 'Actions'
          })
      )
    }
  }
]

/**
 * optional: keep layout consistent when range changes
 */
watch(selectedRange, () => {
  // no-op (placeholder) – but useful hook if later you fetch API data per range
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Usage analytics
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track API requests and bandwidth consumption over time.
          </p>

          <div class="mt-3 flex flex-wrap items-center gap-2">
            <UBadge color="neutral" variant="soft" size="xs">
              Range: {{ rangeItems.find(i => i.value === selectedRange)?.label }}
            </UBadge>
            <UBadge color="neutral" variant="soft" size="xs">
              Data: {{ pointsLabel }}
            </UBadge>
            <UBadge color="neutral" variant="soft" size="xs">
              Last: {{ lastDateLabel }}
            </UBadge>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
          <!-- IMPORTANT: Nuxt UI v3 uses :items -->
          <USelectMenu
            v-model="selectedRange"
            :items="rangeItems"
            value-key="value"
            label-key="label"
            size="sm"
            color="neutral"
            variant="outline"
            class="w-full sm:w-44"
          />

          <UButton
            size="sm"
            color="neutral"
            variant="soft"
            icon="i-lucide-download"
            class="w-full sm:w-auto justify-center"
            @click="console.log('export')"
          >
            Export
          </UButton>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <UCard
          v-for="(s, idx) in statCards"
          :key="idx"
          class="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          :ui="{ body: 'p-5' }"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="p-2 rounded-xl bg-gray-50 dark:bg-gray-900/50 ring-1 ring-gray-200/70 dark:ring-gray-800/60">
                <UIcon :name="s.icon" class="w-5 h-5 text-primary-500" />
              </div>
              <div class="min-w-0">
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {{ s.label }}
                </p>
                <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white truncate">
                  {{ s.value }}
                </p>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ s.sub }}
                </p>
              </div>
            </div>

            <UBadge :color="s.badge.color" variant="soft" size="xs" class="whitespace-nowrap">
              <span class="flex items-center gap-1">
                <UIcon
                  v-if="s.badge.label !== '—'"
                  :name="(s.badge.color === 'success') ? 'i-heroicons-arrow-trending-up' : (s.badge.color === 'error' ? 'i-heroicons-arrow-trending-down' : 'i-heroicons-minus')"
                  class="w-3 h-3"
                />
                <span>{{ s.badge.label }}</span>
              </span>
            </UBadge>
          </div>
        </UCard>
      </div>

      <!-- Main row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Chart -->
        <UCard class="lg:col-span-2 hover:shadow-md transition-shadow" :ui="{ body: 'p-4' }">
          <template #header>
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                  Requests & bandwidth
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Bar = requests, Line = bandwidth (GB) — updates with selected range.
                </p>
              </div>
              <UBadge color="neutral" variant="soft" size="xs">
                Total req: {{ formatCompact(currentRequests) }} • Total bw: {{ formatGB(currentBandwidth) }}
              </UBadge>
            </div>
          </template>

          <div class="px-1 pb-3">
            <ApexChart
              :key="chartKey"
              type="line"
              height="340"
              :options="usageChartOptions"
              :series="usageSeries"
            />
          </div>
        </UCard>

        <!-- Insights -->
        <UCard class="hover:shadow-md transition-shadow" :ui="{ body: 'p-5' }">
          <template #header>
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                Insights
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Quick interpretation for the selected window.
              </p>
            </div>
          </template>

          <div class="space-y-4">
            <div class="rounded-2xl bg-gray-50 dark:bg-gray-900/40 p-4 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-600 dark:text-gray-400">Requests</div>
                <div class="font-semibold text-gray-900 dark:text-white">{{ formatCompact(currentRequests) }}</div>
              </div>
              <div class="mt-2 flex items-center justify-between">
                <div class="text-xs text-gray-600 dark:text-gray-400">Bandwidth</div>
                <div class="font-semibold text-gray-900 dark:text-white">{{ formatGB(currentBandwidth) }}</div>
              </div>
              <div class="mt-3 h-px bg-gray-200/70 dark:bg-gray-800/70" />
              <div class="mt-3 flex items-center justify-between">
                <div class="text-xs text-gray-600 dark:text-gray-400">Avg / day</div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatCompact(avgRequests) }} req • {{ formatGB(avgBandwidth) }}
                </div>
              </div>
            </div>

            <div class="rounded-2xl p-4 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">Peak bandwidth day</div>
                  <div class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                    {{ formatGB(peakBandwidth) }}
                  </div>
                </div>
                <UIcon name="i-heroicons-signal" class="w-6 h-6 text-primary-500" />
              </div>

              <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Tip: if peak keeps rising, consider caching and gzip/brotli on your edge.
              </div>
            </div>

            <div class="flex gap-2">
              <UButton
                size="sm"
                color="primary"
                variant="soft"
                icon="i-lucide-refresh-cw"
                class="flex-1 justify-center"
                @click="console.log('refresh')"
              >
                Refresh
              </UButton>
              <UButton
                size="sm"
                color="neutral"
                variant="outline"
                icon="i-lucide-settings"
                class="flex-1 justify-center"
                @click="console.log('settings')"
              >
                Settings
              </UButton>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Details row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Bandwidth by day (top list) -->
        <UCard class="hover:shadow-md transition-shadow" :ui="{ body: 'p-5' }">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">Top bandwidth days</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Highest bandwidth days in this range</p>
              </div>
              <UBadge color="neutral" variant="soft" size="xs">
                Max: {{ formatGB(maxBandwidth) }}
              </UBadge>
            </div>
          </template>

          <div class="space-y-3">
            <div
              v-for="row in topBandwidthRows"
              :key="row.date"
              class="flex items-center gap-3"
            >
              <div class="w-28 text-xs text-gray-500 dark:text-gray-400">
                {{ row.dateLabel }}
              </div>

              <UProgress class="flex-1" :value="row.percent" />

              <div class="w-24 text-right">
                <div class="text-xs font-medium text-gray-900 dark:text-white">
                  {{ formatGB(row.bandwidthGB) }}
                </div>
                <div class="text-[11px] text-gray-500 dark:text-gray-400">
                  {{ formatCompact(row.requests) }} req
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Daily table -->
        <UCard class="hover:shadow-md transition-shadow" :ui="{ body: 'p-0' }">
          <template #header>
            <div class="p-5">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Daily usage</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Full breakdown for the selected range.
              </p>
            </div>
          </template>

          <div class="rounded-2xl overflow-hidden ring-1 ring-gray-200/60 dark:ring-gray-800/60 mx-5 mb-5">
            <UTable
              :data="bandwidthRows"
              :columns="columns"
              :ui="{
                thead: 'bg-white dark:bg-gray-900/60',
                th: 'text-xs font-semibold text-gray-600 dark:text-gray-300',
                tr: 'hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors',
                td: 'py-4'
              }"
            />
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
