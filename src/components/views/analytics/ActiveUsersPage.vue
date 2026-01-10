<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ApexOptions } from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts'
import { activeUsersData } from '@/mock/analytics'
import { useColorMode } from '@vueuse/core'

const ApexChart = VueApexCharts
const toast = useToast()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

type ActiveUserPoint = { time: string; users: number }

// -------- Range ----------
type RangeValue = 'today' | '7d' | '30d'
const selectedRange = ref<RangeValue>('today')

const rangeItems = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' }
]

const raw = computed<ActiveUserPoint[]>(() => (activeUsersData as ActiveUserPoint[]) ?? [])

/**
 * Robust date parsing:
 * - Accept ISO / Date.parse-able string
 * - If not parseable => range filter becomes display-only
 */
function parseDateMaybe(label: string) {
  const t = Date.parse(label)
  return Number.isNaN(t) ? null : new Date(t)
}

const canRangeFilter = computed(() => {
  const sample = raw.value.slice(0, 8).map(d => parseDateMaybe(d.time)).filter(Boolean)
  return sample.length > 0
})

function rangeDays(r: RangeValue) {
  if (r === '7d') return 7
  if (r === '30d') return 30
  return 0
}

const filtered = computed<ActiveUserPoint[]>(() => {
  if (!raw.value.length) return []
  if (!canRangeFilter.value) return raw.value

  const days = rangeDays(selectedRange.value)
  const now = new Date()

  if (!days) {
    // today
    const y = now.getFullYear(), m = now.getMonth(), d = now.getDate()
    return raw.value.filter((p) => {
      const dt = parseDateMaybe(p.time)
      return dt && dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d
    })
  }

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
const currentUsers = computed(() => (values.value.length ? values.value[values.value.length - 1] : 0))
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
  if (values.value.length < 2) return null
  const first = values.value[0]
  const last = values.value[values.value.length - 1]
  if (!first || !last) return null
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

// Top slots
const topSlots = computed(() => {
  const list = filtered.value.map((p) => ({ ...p, users: Number(p.users) || 0 }))
  return list.sort((a, b) => b.users - a.users).slice(0, 6)
})

// -------- Chart ----------
const categories = computed(() => filtered.value.map(d => d.time))
const series = computed(() => [{ name: 'Active users', data: filtered.value.map(d => Number(d.users) || 0) }])

/**
 * Dark/light Apex theming
 */
const chartText = computed(() => (isDark.value ? '#cbd5e1' : '#64748b'))
const chartGrid = computed(() => (isDark.value ? 'rgba(148,163,184,.18)' : 'rgba(148,163,184,.26)'))
const tooltipTheme = computed(() => (isDark.value ? 'dark' : 'light'))

const chartKey = computed(() => `${selectedRange.value}-${filtered.value.length}-${maxUsers.value}-${isDark.value ? 'd' : 'l'}`)

const usersChartOptions = computed<ApexOptions>(() => ({
  theme: { mode: isDark.value ? 'dark' : 'light' },
  chart: {
    type: 'area',
    background: 'transparent',
    toolbar: { show: false },
    zoom: { enabled: false },
    foreColor: chartText.value,
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
  },
  colors: ['#3b82f6'],
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
    labels: { rotate: -20, style: { colors: chartText.value } }
  },
  yaxis: {
    min: 0,
    max: Math.max(4, maxUsers.value),
    tickAmount: 4,
    labels: { style: { colors: chartText.value }, formatter: (val: number) => `${Math.round(val)}` }
  },
  tooltip: {
    theme: tooltipTheme.value as any,
    y: { formatter: (val: number) => `${val.toLocaleString()} users` }
  },
  grid: { borderColor: chartGrid.value, strokeDashArray: 4 },
  annotations: peakPoint.value
    ? {
        xaxis: [
          {
            x: peakPoint.value.time,
            borderColor: isDark.value ? 'rgba(59, 130, 246, .45)' : 'rgba(59, 130, 246, .55)',
            label: {
              text: `Peak: ${peakPoint.value.users}`,
              style: { 
                fontSize: '11px',
                color: isDark.value ? '#cbd5e1' : '#64748b',
                background: isDark.value ? '#1e293b' : '#f1f5f9'
              }
            }
          }
        ]
      }
    : undefined
}))

const statCards = computed(() => [
  {
    label: 'Current',
    value: currentUsers?.value?.toLocaleString(),
    sub: 'Last point',
    icon: 'i-heroicons-user-group',
    tint: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500',
  },
  {
    label: 'Peak',
    value: (peakPoint.value?.users ?? maxUsers.value).toLocaleString(),
    sub: peakPoint.value ? `At ${peakPoint.value.time}` : 'No data',
    icon: 'i-heroicons-fire',
    tint: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500',
  },
  {
    label: 'Average',
    value: avgUsers.value.toLocaleString(),
    sub: 'Across range',
    icon: 'i-heroicons-chart-bar',
    tint: 'bg-amber-50 dark:bg-amber-900/30 text-amber-500',
  },
  {
    label: 'Lowest',
    value: (lowPoint.value?.users ?? minUsers.value).toLocaleString(),
    sub: lowPoint.value ? `At ${lowPoint.value.time}` : 'Quiet slot',
    icon: 'i-heroicons-moon',
    tint: 'bg-rose-50 dark:bg-rose-900/30 text-rose-500',
  }
])

const hasData = computed(() => filtered.value.length > 0)

function refresh() {
  // if later you fetch API data, place it here
  toast.add({ title: 'Refreshed', color: 'success', icon: 'i-lucide-refresh-cw' })
}
</script>

<template>
  <div class="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-950 transition-colors">
    <div class=" px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Header (glass) -->
      <UCard
        class="rounded-3xl border border-gray-200/70 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/40 backdrop-blur"
        :ui="{ body: 'p-5' }"
      >
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
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
              class="w-full sm:w-48"
            />

            <UButton
              size="sm"
              color="neutral"
              variant="soft"
              icon="i-lucide-refresh-cw"
              class="w-full sm:w-auto justify-center"
              @click="refresh"
            >
              Refresh
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Quick stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UCard
          v-for="(c, i) in statCards"
          :key="i"
          class="rounded-3xl hover:shadow-md hover:-translate-y-0.5 transition-all"
          :ui="{ body: 'p-5' }"
        >
          <div class="flex items-start gap-3">
            <div class="p-2 rounded-2xl" :class="c.tint">
              <UIcon :name="c.icon" class="w-5 h-5" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {{ c.label }}
              </p>
              <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white truncate">
                {{ c.value }}
              </p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ c.sub }}
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Chart + Top slots -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UCard class="rounded-3xl lg:col-span-2 hover:shadow-md transition-shadow" :ui="{ body: 'p-4' }">
          <template #header>
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Active users over time</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Area chart of concurrent users across tracked intervals. Theme follows dark/light mode.
              </p>
            </div>
          </template>

          <div v-if="!hasData" class="py-16 text-center text-sm text-gray-600 dark:text-gray-400">
            No data available for this range.
          </div>

          <div v-else class="px-2 pb-4">
            <ApexChart
              :key="chartKey"
              type="area"
              height="320"
              :options="usersChartOptions"
              :series="series"
            />
          </div>
        </UCard>

        <UCard class="rounded-3xl hover:shadow-md transition-shadow" :ui="{ body: 'p-5' }">
          <template #header>
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Top time slots</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Highest concurrency points</p>
            </div>
          </template>

          <div v-if="!hasData" class="py-10 text-center text-sm text-gray-600 dark:text-gray-400">
            No points to rank.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(p, idx) in topSlots"
              :key="`${p.time}-${idx}`"
              class="flex items-center gap-3"
            >
              <div class="w-28 text-xs text-gray-500 dark:text-gray-400 truncate">
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

          <div class="mt-4 rounded-2xl bg-gray-50 dark:bg-gray-900/40 p-3 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
            <div class="text-xs text-gray-600 dark:text-gray-400">
              Tip: Use this list to schedule maintenance or batch jobs during low concurrency.
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
