<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ApexOptions } from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts'
import { activeUsersData } from '@/mock/analytics'

const ApexChart = VueApexCharts

type ActiveUserPoint = {
  time: string
  users: number
  // OPTIONAL if you have real timestamp later:
  // ts?: string
}

// -------- Range (works if your data is date-parsable) ----------
type RangeValue = 'today' | '7d' | '30d'

const selectedRange = ref<RangeValue>('today')
const rangeItems = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' }
]

const raw = computed<ActiveUserPoint[]>(() => (activeUsersData as ActiveUserPoint[]) ?? [])

function parseDateMaybe(label: string) {
  const t = Date.parse(label)
  return Number.isNaN(t) ? null : new Date(t)
}

const canRangeFilter = computed(() => {
  // if your time is ISO date/time (or any Date.parse-able string), we can filter by last N days
  const sample = raw.value.slice(0, 5).map(d => parseDateMaybe(d.time)).filter(Boolean)
  return sample.length > 0
})

function rangeDays(r: RangeValue) {
  if (r === '7d') return 7
  if (r === '30d') return 30
  return 0
}

const filtered = computed<ActiveUserPoint[]>(() => {
  if (!raw.value.length) return []

  // If we can't parse date from `time`, fallback: show all (range becomes UI-only)
  if (!canRangeFilter.value) return raw.value

  const days = rangeDays(selectedRange.value)
  if (!days) {
    // "today" => keep only points from today's date if time is a date string;
    // if time is datetime, this still works.
    const now = new Date()
    const y = now.getFullYear(), m = now.getMonth(), d = now.getDate()
    return raw.value.filter((p) => {
      const dt = parseDateMaybe(p.time)
      return dt && dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d
    })
  }

  const now = new Date()
  const start = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000)
  start.setHours(0, 0, 0, 0)

  return raw.value.filter((p) => {
    const dt = parseDateMaybe(p.time)
    if (!dt) return true
    return dt >= start && dt <= now
  })
})

// -------- Stats ----------
const values = computed(() => filtered.value.map(d => Number(d.users) || 0))
const currentUsers = computed(() => (values.value.length ? values.value[values.value.length - 1] : 0)) as any;
const avgUsers = computed(() => {
  if (!values.value.length) return 0
  const sum = values.value.reduce((a, b) => a + b, 0)
  return Math.round(sum / values.value.length)
})

const maxUsers = computed(() => (values.value.length ? Math.max(...values.value) : 0))
const minUsers = computed(() => (values.value.length ? Math.min(...values.value) : 0))

const peakIndex = computed(() => {
  if (!values.value.length) return -1
  let idx = 0
  values.value.forEach((v, i) => { if (v > (values.value[idx] ?? Number.MIN_VALUE)) idx = i })
  return idx
})

const lowIndex = computed(() => {
  if (!values.value.length) return -1
  let idx = 0
  values.value.forEach((v, i) => { if (v < (values.value[idx] ?? Number.MAX_VALUE)) idx = i })
  return idx
})
const peakPoint = computed(() => (peakIndex.value >= 0 ? filtered.value[peakIndex.value] : null))
const lowPoint = computed(() => (lowIndex.value >= 0 ? filtered.value[lowIndex.value] : null))

const trendPct = computed(() => {
  // simple start->end change
  if (values.value.length < 2) return null
  const first = values.value[0]
  const last = values.value[values.value.length - 1] as any
  if (!first) return null
  return ((last - first) / first) * 100
})

function badgeFromTrend(pct: number | null) {
  if (pct === null) return { color: 'neutral' as const, label: '—', icon: 'i-lucide-minus' }
  const up = pct >= 0
  return {
    color: up ? ('success' as const) : ('error' as const),
    label: `${up ? '+' : '-'}${Math.abs(pct).toFixed(1)}%`,
    icon: up ? 'i-lucide-trending-up' : 'i-lucide-trending-down'
  }
}

const trendBadge = computed(() => badgeFromTrend(trendPct.value))

const pointsCountLabel = computed(() => `${filtered.value.length} points`)

// Top time slots (by users)
const topSlots = computed(() => {
  const list = filtered.value.map((p) => ({ ...p, users: Number(p.users) || 0 }))
  return list.sort((a, b) => b.users - a.users).slice(0, 6)
})

// -------- Chart ----------
const categories = computed(() => filtered.value.map(d => d.time))
const series = computed(() => [
  { name: 'Active users', data: filtered.value.map(d => Number(d.users) || 0) }
])

const chartKey = computed(() => `${selectedRange.value}-${filtered.value.length}-${maxUsers.value}`)

const usersChartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    zoom: { enabled: false },
    foreColor: '#6b7280'
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.28, opacityTo: 0.06, stops: [0, 100] }
  },
  xaxis: {
    categories: categories.value,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { rotate: -20 }
  },
  yaxis: {
    min: 0,
    max: Math.max(4, maxUsers.value),
    tickAmount: 4,
    labels: { formatter: (val: number) => `${Math.round(val)}` }
  },
  tooltip: { y: { formatter: (val: number) => `${val.toLocaleString()} users` } },
  grid: { borderColor: 'rgba(148, 163, 184, 0.25)', strokeDashArray: 4 },
  annotations: peakPoint.value
    ? {
        xaxis: [
          {
            x: peakPoint.value.time,
            borderColor: 'rgba(99, 102, 241, .55)',
            label: {
              text: `Peak: ${peakPoint.value.users}`,
              style: { fontSize: '11px' }
            }
          }
        ]
      }
    : undefined
}))
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Active users
            </h1>

            <UBadge :color="trendBadge.color" variant="soft" size="xs" class="whitespace-nowrap">
              <span class="flex items-center gap-1">
                <UIcon :name="trendBadge.icon" class="w-3.5 h-3.5" />
                <span>{{ trendBadge.label }}</span>
              </span>
            </UBadge>

            <UBadge v-if="!canRangeFilter" color="neutral" variant="soft" size="xs" class="whitespace-nowrap">
              Range is display-only
            </UBadge>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Monitor concurrent activity, identify peak hours, and spot low-traffic windows.
          </p>

          <div class="mt-3 flex flex-wrap items-center gap-2">
            <UBadge color="neutral" variant="soft" size="xs">{{ pointsCountLabel }}</UBadge>
            <UBadge color="neutral" variant="soft" size="xs">Peak: {{ maxUsers.toLocaleString() }}</UBadge>
            <UBadge color="neutral" variant="soft" size="xs">Avg: {{ avgUsers.toLocaleString() }}</UBadge>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center gap-2">
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
            icon="i-lucide-refresh-cw"
            class="w-full sm:w-auto justify-center"
            @click="$router.go(0)"
          >
            Refresh
          </UButton>
        </div>
      </div>

      <!-- Quick stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UCard class="p-4 bg-white/80 dark:bg-gray-900/60 ring-1 ring-gray-200/70 dark:ring-gray-800/60 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div class="flex items-start gap-3">
            <div class="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
              <UIcon name="i-heroicons-user-group" class="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Current</p>
              <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {{ currentUsers.toLocaleString() }}
              </p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Last point</p>
            </div>
          </div>
        </UCard>

        <UCard class="p-4 bg-white/80 dark:bg-gray-900/60 ring-1 ring-gray-200/70 dark:ring-gray-800/60 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div class="flex items-start gap-3">
            <div class="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
              <UIcon name="i-heroicons-fire" class="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Peak</p>
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

        <UCard class="p-4 bg-white/80 dark:bg-gray-900/60 ring-1 ring-gray-200/70 dark:ring-gray-800/60 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div class="flex items-start gap-3">
            <div class="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30">
              <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Average</p>
              <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {{ avgUsers.toLocaleString() }}
              </p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Across range</p>
            </div>
          </div>
        </UCard>

        <UCard class="p-4 bg-white/80 dark:bg-gray-900/60 ring-1 ring-gray-200/70 dark:ring-gray-800/60 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div class="flex items-start gap-3">
            <div class="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/30">
              <UIcon name="i-heroicons-moon" class="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Lowest</p>
              <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {{ lowPoint ? lowPoint.users.toLocaleString() : minUsers.toLocaleString() }}
              </p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span v-if="lowPoint">At {{ lowPoint.time }}</span>
                <span v-else>Quiet slot</span>
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Chart + Top slots -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UCard class="lg:col-span-2 bg-white dark:bg-gray-900/60 ring-1 ring-gray-200/70 dark:ring-gray-800/60 hover:shadow-md transition-shadow">
          <template #header>
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Active users over time</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Area chart of concurrent users across tracked intervals.
              </p>
            </div>
          </template>

          <div class="px-2 pb-4">
            <ApexChart
              :key="chartKey"
              type="area"
              height="320"
              :options="usersChartOptions"
              :series="series"
            />
          </div>
        </UCard>

        <UCard class="bg-white dark:bg-gray-900/60 ring-1 ring-gray-200/70 dark:ring-gray-800/60 hover:shadow-md transition-shadow">
          <template #header>
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Top time slots</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Highest concurrency points</p>
            </div>
          </template>

          <div class="space-y-3">
            <div
              v-for="(p, idx) in topSlots"
              :key="`${p.time}-${idx}`"
              class="flex items-center gap-3"
            >
              <div class="w-24 text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ p.time }}
              </div>

              <UProgress
                :model-value="maxUsers ? Math.round((p.users / maxUsers) * 100) : 0"
                :max="100"
                class="flex-1"
              />

              <div class="w-16 text-right text-xs font-semibold text-gray-900 dark:text-white">
                {{ p.users.toLocaleString() }}
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
