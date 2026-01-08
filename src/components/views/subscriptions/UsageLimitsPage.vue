<script setup lang="ts">
import { computed, h, ref, resolveComponent, shallowRef, watch } from 'vue'
import type { TableColumn, TabsItem } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { useClipboard, useColorMode } from '@vueuse/core'
import { CalendarDate, DateFormatter, getLocalTimeZone, today } from '@internationalized/date'

import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UAvatar = resolveComponent('UAvatar')
const UProgress = resolveComponent('UProgress')

const ApexChart = VueApexCharts

const toast = useToast()
const { copy } = useClipboard()

/** ===== chart theme (kept) ===== */
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const chartText = computed(() => (isDark.value ? '#cbd5e1' : '#64748b'))
const chartTitle = computed(() => (isDark.value ? '#e2e8f0' : '#0f172a'))
const chartGrid = computed(() => (isDark.value ? 'rgba(148,163,184,.18)' : 'rgba(148,163,184,.28)'))
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
    tooltip: { theme: chartTooltipTheme.value as any },
    ...extra
  }
}

/** ===== types ===== */
type LimitMode = 'hard' | 'soft'
type MemberStatus = 'Active' | 'Invited' | 'Suspended'
type MemberRole = 'Owner' | 'Admin' | 'Member' | 'Viewer'

type MemberOverride = {
  enabled: boolean
  mode: LimitMode
  notifyAtPct: number
  requests?: number
  bandwidthGB?: number
  storageGB?: number
}
type Member = {
  id: number
  name: string
  email: string
  role: MemberRole
  status: MemberStatus
  lastActiveISO: string
  daily: { requests: number; bandwidthGB: number; storageGB: number }
  override?: MemberOverride | null
}
type WorkspaceLimits = {
  mode: LimitMode
  allowOverage: boolean
  notifyAtPct: number
  resetDayOfMonth: number
  requests: number
  bandwidthGB: number
  storageGB: number
  seats: number
}
type MemberRow = {
  id: number
  name: string
  email: string
  role: MemberRole
  status: MemberStatus
  lastActiveISO: string
  usedRequests: number
  usedBandwidthGB: number
  usedStorageGB: number
  hasOverride: boolean
}

/** ===== date range ===== */
const tz = getLocalTimeZone()
const df = new DateFormatter('en-US', { dateStyle: 'medium' })
const datePopoverOpen = ref(false)

const presetItems = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Year to date', value: 'ytd' },
  { label: 'Custom', value: 'custom' }
] 
type PresetValue = (typeof presetItems)[number]['value']
const selectedPreset = ref<PresetValue>('30d')

const rangeModel = shallowRef<{ start: CalendarDate | null | any; end: CalendarDate | null | any }>({
  start: today(tz).subtract({ days: 29 }),
  end: today(tz)
})

const rangeLabel = computed(() => {
  const s = rangeModel.value.start
  const e = rangeModel.value.end
  if (!s && !e) return 'Pick a date'
  if (s && !e) return df.format(s.toDate(tz))
  if (s && e) return `${df.format(s.toDate(tz))} - ${df.format(e.toDate(tz))}`
  return 'Pick a date'
})

function applyPreset(p: PresetValue) {
  if (p === 'custom') return
  const end = today(tz)
  let start = end
  if (p === '7d') start = end.subtract({ days: 6 })
  if (p === '30d') start = end.subtract({ days: 29 })
  if (p === '90d') start = end.subtract({ days: 89 })
  if (p === 'ytd') start = new CalendarDate(end.year, 1, 1)
  rangeModel.value = { start, end }
}
watch(selectedPreset, (p) => applyPreset(p), { immediate: true })

function diffDaysInclusive(a: Date, b: Date) {
  const ms = 1000 * 60 * 60 * 24
  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime()
  const end = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime()
  return Math.max(1, Math.round((end - start) / ms) + 1)
}
const rangeDays = computed(() => {
  const s = rangeModel.value.start?.toDate(tz)
  const e = rangeModel.value.end?.toDate(tz)
  if (!s || !e) return 30
  return diffDaysInclusive(s, e)
})

/** ===== mock data ===== */
const workspace = ref({ name: 'Lumo', plan: 'Pro', seatsUsed: 12 })

const workspaceLimits = ref<WorkspaceLimits>({
  mode: 'hard',
  allowOverage: false,
  notifyAtPct: 85,
  resetDayOfMonth: 1,
  requests: 1_200_000,
  bandwidthGB: 800,
  storageGB: 250,
  seats: 20
})

const members = ref<Member[]>([
  { id: 1, name: 'James Anderson', email: 'james.anderson@example.com', role: 'Owner', status: 'Active', lastActiveISO: new Date(Date.now() - 1000 * 60 * 10).toISOString(), daily: { requests: 12000, bandwidthGB: 2.1, storageGB: 0.2 }, override: null },
  { id: 2, name: 'Mia White', email: 'mia.white@example.com', role: 'Admin', status: 'Active', lastActiveISO: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), daily: { requests: 9000, bandwidthGB: 1.4, storageGB: 0.15 }, override: { enabled: true, mode: 'soft', notifyAtPct: 80, requests: 220_000, bandwidthGB: 70, storageGB: 18 } },
  { id: 3, name: 'William Brown', email: 'william.brown@example.com', role: 'Member', status: 'Active', lastActiveISO: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), daily: { requests: 4500, bandwidthGB: 0.9, storageGB: 0.08 }, override: null },
  { id: 4, name: 'Emma Davis', email: 'emma.davis@example.com', role: 'Viewer', status: 'Invited', lastActiveISO: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), daily: { requests: 0, bandwidthGB: 0, storageGB: 0 }, override: null },
  { id: 5, name: 'Ethan Harris', email: 'ethan.harris@example.com', role: 'Member', status: 'Suspended', lastActiveISO: new Date(Date.now() - 1000 * 60 * 60 * 200).toISOString(), daily: { requests: 1500, bandwidthGB: 0.35, storageGB: 0.03 }, override: null }
])

/** ===== helpers ===== */
function clampPct(v: number) {
  return Math.max(0, Math.min(100, Math.round(v)))
}
function pct(used: number, limit: number) {
  if (!limit || limit <= 0) return 0
  return clampPct((used / limit) * 100)
}
function formatInt(n: number) {
  return Intl.NumberFormat('en-US').format(Math.round(n))
}
function formatGB(n: number) {
  return `${Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(Math.max(0, n))} GB`
}
function relativeTime(iso: string) {
  const t = new Date(iso).getTime()
  const d = Date.now() - t
  const m = Math.round(d / (1000 * 60))
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.round(h / 24)}d ago`
}
function nextResetDate(resetDay: number) {
  const now = new Date()
  const candidate = new Date(now.getFullYear(), now.getMonth(), resetDay, 0, 0, 0, 0)
  if (candidate.getTime() > now.getTime()) return candidate
  return new Date(now.getFullYear(), now.getMonth() + 1, resetDay, 0, 0, 0, 0)
}
const resetInfo = computed(() => df.format(nextResetDate(workspaceLimits.value.resetDayOfMonth)))

/** ===== rows ===== */
const memberRows = computed<MemberRow[]>(() => {
  const days = rangeDays.value
  return members.value.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    role: m.role,
    status: m.status,
    lastActiveISO: m.lastActiveISO,
    usedRequests: m.daily.requests * days,
    usedBandwidthGB: m.daily.bandwidthGB * days,
    usedStorageGB: m.daily.storageGB * days,
    hasOverride: !!m.override?.enabled
  }))
})

const workspaceUsed = computed(() => {
  const rows = memberRows.value
  return {
    usedRequests: rows.reduce((a, r) => a + r.usedRequests, 0),
    usedBandwidthGB: rows.reduce((a, r) => a + r.usedBandwidthGB, 0),
    usedStorageGB: rows.reduce((a, r) => a + r.usedStorageGB, 0)
  }
})

const workspaceCards = computed(() => {
  const limits = workspaceLimits.value
  const used = workspaceUsed.value
  return [
    { key: 'requests', label: 'Requests', used: used.usedRequests, limit: limits.requests },
    { key: 'bandwidth', label: 'Bandwidth', used: used.usedBandwidthGB, limit: limits.bandwidthGB, format: 'gb' },
    { key: 'storage', label: 'Storage', used: used.usedStorageGB, limit: limits.storageGB, format: 'gb' },
    { key: 'seats', label: 'Seats', used: workspace.value.seatsUsed, limit: limits.seats }
  ].map((c) => ({
    ...c,
    pct: pct(c.used as number, c.limit as number)
  }))
})

/** ===== tabs ===== */
const activeTab = ref<'workspace' | 'members'>('workspace')
const tabItems = [
  { label: 'Workspace', value: 'workspace', slot: 'workspace' },
  { label: 'Members', value: 'members', slot: 'members' }
] satisfies TabsItem[]

/** ===== members filters ===== */
const query = ref('')
const roleFilter = ref<MemberRole | 'all'>('all')
const statusFilter = ref<MemberStatus | 'all'>('all')

const roleItems = ['all', 'Owner', 'Admin', 'Member', 'Viewer']
const statusItems = ['all', 'Active', 'Invited', 'Suspended']

const filteredMemberRows = computed(() => {
  const q = query.value.trim().toLowerCase()
  return memberRows.value.filter((r) => {
    const matchesQ = !q || `${r.name} ${r.email}`.toLowerCase().includes(q)
    const matchesRole = roleFilter.value === 'all' || r.role === roleFilter.value
    const matchesStatus = statusFilter.value === 'all' || r.status === statusFilter.value
    return matchesQ && matchesRole && matchesStatus
  })
})

/** ===== selection + preview ===== */
const selectedMemberId = ref<number | null | any>(members.value[0]?.id ?? null)
watch(
  filteredMemberRows,
  (rows) => {
    if (!rows.length) return (selectedMemberId.value = null)
    if (!rows.some((r) => r.id === selectedMemberId.value)) selectedMemberId.value = rows[0]?.id
  },
  { immediate: true }
)

const selectedMember = computed(() => members.value.find((m) => m.id === selectedMemberId.value) ?? null)
const selectedRow = computed(() => filteredMemberRows.value.find((r) => r.id === selectedMemberId.value) ?? null)

function selectMember(id: number) {
  selectedMemberId.value = id
}

/** ===== modals (fixed as per Nuxt UI docs) ===== */
const workspaceModalOpen = ref(false)
const memberModalOpen = ref(false)

const workspaceForm = ref<WorkspaceLimits>({ ...workspaceLimits.value })
watch(workspaceModalOpen, (open) => {
  if (open) workspaceForm.value = { ...workspaceLimits.value }
})
function saveWorkspaceLimits() {
  workspaceLimits.value = { ...workspaceForm.value }
  workspaceModalOpen.value = false
  toast.add({ title: 'Workspace limits updated', color: 'success' })
}

const editTargetIds = ref<number[]>([])
const memberForm = ref<MemberOverride>({
  enabled: true,
  mode: 'hard',
  notifyAtPct: 85,
  requests: 200_000,
  bandwidthGB: 60,
  storageGB: 15
})

const applyToMultiple = computed(() => editTargetIds.value.length > 1)

function openMemberOverride(ids: number[]) {
  editTargetIds.value = ids
  const first = members.value.find((m) => m.id === ids[0]) ?? null
  const seeded = first?.override?.enabled ? first.override : null

  memberForm.value = {
    enabled: true,
    mode: seeded?.mode ?? 'hard',
    notifyAtPct: seeded?.notifyAtPct ?? workspaceLimits.value.notifyAtPct,
    requests: seeded?.requests ?? 200_000,
    bandwidthGB: seeded?.bandwidthGB ?? 60,
    storageGB: seeded?.storageGB ?? 15
  }
  memberModalOpen.value = true
}

function saveMemberOverride() {
  const ids = editTargetIds.value
  if (!ids.length) return
  for (const id of ids) {
    const m = members.value.find((x) => x.id === id)
    if (!m) continue
    m.override = memberForm.value.enabled ? { ...memberForm.value } : null
  }
  memberModalOpen.value = false
  toast.add({ title: applyToMultiple.value ? `Applied to ${ids.length} members` : 'Member override updated', color: 'success' })
}

/** ===== table columns (simplified) ===== */
function getRowItems(row: Row<MemberRow>) {
  const id = row.original.id
  const email = row.original.email
  return [
    { label: 'Preview', onSelect: () => selectMember(id) },
    { label: 'Edit override', onSelect: () => openMemberOverride([id]) },
    {
      label: 'Copy email',
      onSelect() {
        copy(email)
        toast.add({ title: 'Copied', description: email, color: 'success' })
      }
    }
  ]
}

const columns = computed<TableColumn<MemberRow>[]>(() => [
  {
    accessorKey: 'name',
    header: 'Member',
    cell: ({ row }: any) => {
      const r = row.original as MemberRow
      const active = r.id === selectedMemberId.value
      return h(
        'button',
        {
          class:
            'w-full text-left flex items-center gap-2 rounded-lg px-2 py-2 ' +
            (active ? 'bg-gray-100 dark:bg-gray-900' : 'hover:bg-gray-50 dark:hover:bg-gray-900/60'),
          onClick: () => selectMember(r.id)
        },
        [
          h(UAvatar as any, { alt: r.name, size: 'xs' }),
          h('div', { class: 'min-w-0' }, [
            h('div', { class: 'text-sm font-medium truncate text-gray-900 dark:text-white' }, r.name),
            h('div', { class: 'text-xs truncate text-gray-500 dark:text-gray-400' }, r.email)
          ])
        ]
      )
    }
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }: any) => h(UBadge as any, { size: 'xs', variant: 'soft', color: 'neutral' }, () => row.getValue('role'))
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const st = String(row.getValue('status'))
      const color = st === 'Active' ? 'success' : st === 'Invited' ? 'neutral' : 'error'
      return h(UBadge as any, { size: 'xs', variant: 'soft', color }, () => st)
    }
  },
  {
    accessorKey: 'usedRequests',
    header: () => h('div', { class: 'text-right' }, 'Requests'),
    cell: ({ row }: any) => h('div', { class: 'text-right tabular-nums text-sm text-gray-900 dark:text-white' }, formatInt(row.getValue('usedRequests')))
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }: any) =>
      h(
        'div',
        { class: 'flex justify-end' },
        h(
          UDropdownMenu as any,
          { items: getRowItems(row), content: { align: 'end' } },
          () => h(UButton as any, { icon: 'i-lucide-more-vertical', size: 'xs', color: 'neutral', variant: 'ghost' })
        )
      )
  }
])

/** ===== charts (simple) ===== */
const workspaceChartSeries = computed(() => workspaceCards.value.map((c) => c.pct))

const workspaceChartColors = computed(() => {
  const base = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
  if (isDark.value) return base.map((c) => c)
  // softer for light mode
  return ['rgba(59,130,246,0.95)', 'rgba(16,185,129,0.95)', 'rgba(245,158,11,0.95)', 'rgba(239,68,68,0.95)']
})

const workspaceChartOptions = computed<ApexOptions>(() =>
  baseApexOptions({
    chart: { type: 'radialBar' },
    colors: workspaceChartColors.value,
    labels: workspaceCards.value.map((c) => c.label),
    stroke: { lineCap: 'round' },
    legend: { show: true, position: 'bottom', labels: { colors: chartText.value } },
    tooltip: {
      y: {
        formatter: (val: any, opts?: any) => {
          const idx = opts?.seriesIndex ?? 0
          const card = workspaceCards.value[idx]
          if (!card) return `${Math.round(Number(val))}%`
          const used = card.format === 'gb' ? formatGB(card.used as number) : formatInt(card.used as number)
        const limit = card.format === 'gb' ? formatGB(card.limit as number) : formatInt(card.limit as number)
          return `${Math.round(Number(val))}% — ${used} / ${limit}`
        }
      }
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '30%', background: isDark.value ? '#0b1220' : '#ffffff' },
        track: { background: isDark.value ? 'rgba(255,255,255,0.03)' : '#f1f5f9', margin: 6 },
        dataLabels: {
          name: { fontSize: '12px', color: chartText.value },
          value: { fontSize: '14px', color: chartTitle.value, formatter: (v: any) => `${Math.round(Number(v))}%` }
        }
      }
    },
    grid: { show: false }
  })
)
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <!-- Header (simple) -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Usage limits</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Workspace caps & per-member overrides.
          </p>
          <div class="mt-2 flex flex-wrap gap-2">
            <UBadge size="xs" variant="soft" color="neutral">Workspace: <span class="ml-1 font-medium">{{ workspace.name }}</span></UBadge>
            <UBadge size="xs" variant="soft" color="neutral">Reset: <span class="ml-1 font-medium">{{ resetInfo }}</span></UBadge>
            <UBadge size="xs" variant="soft" color="primary">Range: <span class="ml-1 font-medium">{{ rangeDays }} days</span></UBadge>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-2">
          <USelectMenu v-model="selectedPreset" :items="presetItems" value-key="value" label-key="label" size="sm" variant="outline" class="sm:w-44" />

          <UPopover v-model:open="datePopoverOpen">
            <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-calendar" class="justify-center" @click="selectedPreset = 'custom'">
              {{ rangeLabel }}
            </UButton>

            <template #content>
              <div class="p-3 w-[min(720px,92vw)]">
                <UCalendar v-model="rangeModel" range :number-of-months="2" class="p-2" />
                <div class="mt-3 flex items-center justify-end gap-2">
                  <UButton size="sm" color="neutral" variant="outline" @click="rangeModel = { start: null, end: null }">Clear</UButton>
                  <UButton size="sm" color="primary" variant="solid" @click="datePopoverOpen = false">Apply</UButton>
                </div>
              </div>
            </template>
          </UPopover>

          <UButton size="sm" color="primary" variant="solid" @click="workspaceModalOpen = true">
            Edit limits
          </UButton>
        </div>
      </div>

      <!-- Tabs -->
      <UTabs v-model="activeTab" :items="tabItems" variant="link" class="w-full" />

      <!-- WORKSPACE -->
      <div v-if="activeTab === 'workspace'" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <UCard class="lg:col-span-2">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="text-sm font-semibold text-gray-900 dark:text-white">Workspace usage</div>
              <UBadge size="xs" variant="soft" color="neutral">{{ workspace.plan }}</UBadge>
            </div>
          </template>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="c in workspaceCards" :key="c.key" class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ c.label }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400 tabular-nums">
                  <span v-if="c.format === 'gb'">{{ formatGB(c.used as number) }} / {{ formatGB(c.limit as number) }}</span>
                  <span v-else>{{ formatInt(c.used as number) }} / {{ formatInt(c.limit as number) }}</span>
                </div>
              </div>
              <UProgress :model-value="c.pct" />
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="text-sm font-semibold text-gray-900 dark:text-white">Health</div>
          </template>

          <ApexChart type="radialBar" height="280" :options="workspaceChartOptions" :series="workspaceChartSeries" />
        </UCard>
      </div>

      <!-- MEMBERS -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <UCard class="lg:col-span-2">
          <template #header>
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div class="text-sm font-semibold text-gray-900 dark:text-white">Members</div>
              <div class="flex flex-col sm:flex-row gap-2">
                <UInput v-model="query" placeholder="Search…" size="sm" class="sm:w-56" />
                <USelectMenu v-model="roleFilter" :items="roleItems" size="sm" variant="outline" class="sm:w-32" />
                <USelectMenu v-model="statusFilter" :items="statusItems" size="sm" variant="outline" class="sm:w-36" />
              </div>
            </div>
          </template>

          <UTable :data="filteredMemberRows" :columns="columns" />
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="text-sm font-semibold text-gray-900 dark:text-white">Preview</div>
              <UButton size="xs" color="primary" variant="soft" :disabled="!selectedMember" @click="selectedMember && openMemberOverride([selectedMember.id])">
                Override
              </UButton>
            </div>
          </template>

          <div v-if="!selectedMember || !selectedRow" class="text-sm text-gray-600 dark:text-gray-400">
            Select a member.
          </div>

          <div v-else class="space-y-3">
            <div class="flex items-center gap-2">
              <UAvatar :alt="selectedMember.name" size="sm" />
              <div class="min-w-0">
                <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ selectedMember.name }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400 truncate">{{ selectedMember.email }}</div>
              </div>
            </div>

            <UBadge size="xs" variant="soft" color="neutral">Last active: {{ relativeTime(selectedMember.lastActiveISO) }}</UBadge>

            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600 dark:text-gray-400">Requests</span>
                <span class="tabular-nums text-gray-900 dark:text-white">{{ formatInt(selectedRow.usedRequests) }}</span>
              </div>
              <UProgress :model-value="pct(selectedRow.usedRequests, (selectedMember.override?.requests ?? workspaceLimits.requests))" />
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- ✅ MODAL (Workspace) - fixed to Nuxt UI docs -->
    <UModal
      v-model:open="workspaceModalOpen"
      title="Edit workspace limits"
      description="Applies to the whole workspace."
      :ui="{ content: 'max-w-2xl' }"
    >
      <template #body>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <UFormGroup label="Requests cap">
            <UInput v-model.number="workspaceForm.requests" type="number" min="0" />
          </UFormGroup>

          <UFormGroup label="Seats cap">
            <UInput v-model.number="workspaceForm.seats" type="number" min="1" />
          </UFormGroup>

          <UFormGroup label="Bandwidth (GB)">
            <UInput v-model.number="workspaceForm.bandwidthGB" type="number" min="0" />
          </UFormGroup>

          <UFormGroup label="Storage (GB)">
            <UInput v-model.number="workspaceForm.storageGB" type="number" min="0" />
          </UFormGroup>

          <UFormGroup label="Notify at (%)">
            <UInput v-model.number="workspaceForm.notifyAtPct" type="number" min="1" max="99" />
          </UFormGroup>

          <UFormGroup label="Reset day (1–28)">
            <UInput v-model.number="workspaceForm.resetDayOfMonth" type="number" min="1" max="28" />
          </UFormGroup>

          <UFormGroup label="Limit mode">
            <USelectMenu v-model="workspaceForm.mode" :items="['hard', 'soft']" size="sm" variant="outline" />
          </UFormGroup>

          <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-3 flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">Allow overage</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Continue after reaching cap</div>
            </div>
            <USwitch v-model="workspaceForm.allowOverage" />
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex justify-end gap-2 w-full">
          <UButton color="neutral" variant="outline" @click="close()">Cancel</UButton>
          <UButton color="primary" @click="saveWorkspaceLimits()">Save</UButton>
        </div>
      </template>
    </UModal>

    <!-- ✅ MODAL (Member override) - fixed to Nuxt UI docs -->
    <UModal
      v-model:open="memberModalOpen"
      :title="applyToMultiple ? `Apply override (${editTargetIds.length} members)` : 'Edit member override'"
      :description="`Compared against ${rangeDays} days usage.`"
      :ui="{ content: 'max-w-2xl' }"
    >
      <template #body>
        <div class="space-y-3">
          <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-3 flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">Enable override</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">If off, uses workspace defaults.</div>
            </div>
            <USwitch v-model="memberForm.enabled" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <UFormGroup label="Mode">
              <USelectMenu
                v-model="memberForm.mode"
                :items="[
                  { label: 'Hard cap (block)', value: 'hard' },
                  { label: 'Soft cap (warn)', value: 'soft' }
                ]"
                value-key="value"
                label-key="label"
                size="sm"
                variant="outline"
              />
            </UFormGroup>

            <UFormGroup label="Notify at (%)">
              <UInput v-model.number="memberForm.notifyAtPct" type="number" min="1" max="99" />
            </UFormGroup>

            <UFormGroup label="Requests cap">
              <UInput v-model.number="memberForm.requests" type="number" min="0" :disabled="!memberForm.enabled" />
            </UFormGroup>

            <UFormGroup label="Bandwidth (GB)">
              <UInput v-model.number="memberForm.bandwidthGB" type="number" min="0" :disabled="!memberForm.enabled" />
            </UFormGroup>

            <UFormGroup label="Storage (GB)">
              <UInput v-model.number="memberForm.storageGB" type="number" min="0" :disabled="!memberForm.enabled" />
            </UFormGroup>
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex justify-end gap-2 w-full">
          <UButton color="neutral" variant="outline" @click="close()">Cancel</UButton>
          <UButton color="primary" @click="saveMemberOverride()">Save</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
