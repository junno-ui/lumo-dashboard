<script setup lang="ts">
import { computed, h, ref, resolveComponent, shallowRef, watch } from 'vue'
import type { TableColumn, TabsItem } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { useClipboard } from '@vueuse/core'
import { CalendarDate, DateFormatter, getLocalTimeZone, today } from '@internationalized/date'

/**
 * Nuxt UI (resolved for render functions)
 */
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UAvatar = resolveComponent('UAvatar')
const UCheckbox = resolveComponent('UCheckbox')
const UProgress = resolveComponent('UProgress')

const toast = useToast()
const { copy } = useClipboard()

/**
 * Types
 */
type LimitMode = 'hard' | 'soft'
type MemberStatus = 'Active' | 'Invited' | 'Suspended'
type MemberRole = 'Owner' | 'Admin' | 'Member' | 'Viewer'

type MemberOverride = {
  enabled: boolean
  mode: LimitMode
  notifyAtPct: number
  requests?: number // cap for selected range
  bandwidthGB?: number // cap for selected range
  storageGB?: number // cap for selected range
}

type Member = {
  id: number
  name: string
  email: string
  role: MemberRole
  status: MemberStatus
  lastActiveISO: string
  // simple mock: daily usage rate, then multiplied by range days
  daily: {
    requests: number
    bandwidthGB: number
    storageGB: number
  }
  override?: MemberOverride | null
}

type WorkspaceLimits = {
  mode: LimitMode
  allowOverage: boolean
  notifyAtPct: number
  resetDayOfMonth: number
  // caps (monthly-ish, but we display vs selected range for UX)
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

/**
 * Date range (Preset + Custom Calendar)
 */
const tz = getLocalTimeZone()
const df = new DateFormatter('en-US', { dateStyle: 'medium' })
const datePopoverOpen = ref(false)

const presetItems = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Year to date', value: 'ytd' },
  { label: 'Custom', value: 'custom' }
] as const

type PresetValue = (typeof presetItems)[number]['value']
const selectedPreset = ref<PresetValue>('30d')

const rangeModel = shallowRef<{ start: CalendarDate | null; end: CalendarDate | null }>({
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

  switch (p) {
    case '7d':
      start = end.subtract({ days: 6 })
      break
    case '30d':
      start = end.subtract({ days: 29 })
      break
    case '90d':
      start = end.subtract({ days: 89 })
      break
    case 'ytd':
      start = new CalendarDate(end.year, 1, 1)
      break
  }

  rangeModel.value = { start, end }
}

watch(selectedPreset, (p) => applyPreset(p))

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

/**
 * Workspace + Members (mock)
 */
const workspace = ref({
  name: 'Lumo',
  plan: 'Pro',
  seatsUsed: 12
})

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
  {
    id: 1,
    name: 'James Anderson',
    email: 'james.anderson@example.com',
    role: 'Owner',
    status: 'Active',
    lastActiveISO: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    daily: { requests: 12000, bandwidthGB: 2.1, storageGB: 0.2 },
    override: null
  },
  {
    id: 2,
    name: 'Mia White',
    email: 'mia.white@example.com',
    role: 'Admin',
    status: 'Active',
    lastActiveISO: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    daily: { requests: 9000, bandwidthGB: 1.4, storageGB: 0.15 },
    override: { enabled: true, mode: 'soft', notifyAtPct: 80, requests: 220_000, bandwidthGB: 70, storageGB: 18 }
  },
  {
    id: 3,
    name: 'William Brown',
    email: 'william.brown@example.com',
    role: 'Member',
    status: 'Active',
    lastActiveISO: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    daily: { requests: 4500, bandwidthGB: 0.9, storageGB: 0.08 },
    override: null
  },
  {
    id: 4,
    name: 'Emma Davis',
    email: 'emma.davis@example.com',
    role: 'Viewer',
    status: 'Invited',
    lastActiveISO: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    daily: { requests: 0, bandwidthGB: 0, storageGB: 0 },
    override: null
  },
  {
    id: 5,
    name: 'Ethan Harris',
    email: 'ethan.harris@example.com',
    role: 'Member',
    status: 'Suspended',
    lastActiveISO: new Date(Date.now() - 1000 * 60 * 60 * 200).toISOString(),
    daily: { requests: 1500, bandwidthGB: 0.35, storageGB: 0.03 },
    override: null
  }
])

/**
 * Helpers
 */
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
  const v = Math.max(0, n)
  return `${Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(v)} GB`
}
function toneFromPct(p: number) {
  if (p >= 90) return { badge: 'error' as const, ring: 'ring-red-200 dark:ring-red-900/40', icon: 'i-lucide-alert-triangle' }
  if (p >= 75) return { badge: 'warning' as const, ring: 'ring-amber-200 dark:ring-amber-900/40', icon: 'i-lucide-alert-circle' }
  return { badge: 'success' as const, ring: 'ring-emerald-200 dark:ring-emerald-900/40', icon: 'i-lucide-circle-check' }
}
function relativeTime(iso: string) {
  const t = new Date(iso).getTime()
  const d = Date.now() - t
  const m = Math.round(d / (1000 * 60))
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  const days = Math.round(h / 24)
  return `${days}d ago`
}
function nextResetDate(resetDay: number) {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const candidate = new Date(y, m, resetDay, 0, 0, 0, 0)
  if (candidate.getTime() > now.getTime()) return candidate
  return new Date(y, m + 1, resetDay, 0, 0, 0, 0)
}

/**
 * Build rows (range aware)
 */
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
  const usedRequests = rows.reduce((a, r) => a + r.usedRequests, 0)
  const usedBandwidthGB = rows.reduce((a, r) => a + r.usedBandwidthGB, 0)
  // storage: treat as usage in the selected range (for display)
  const usedStorageGB = rows.reduce((a, r) => a + r.usedStorageGB, 0)

  return { usedRequests, usedBandwidthGB, usedStorageGB }
})

/**
 * Tabs
 */
const activeTab = ref<'workspace' | 'members'>('workspace')
const tabItems = [
  { label: 'Workspace', icon: 'i-lucide-gauge', slot: 'workspace' },
  { label: 'Per member', icon: 'i-lucide-users', slot: 'members' }
] satisfies TabsItem[]

/**
 * Workspace cards
 */
const workspaceCards = computed(() => {
  const limits = workspaceLimits.value
  const used = workspaceUsed.value

  const reqPct = pct(used.usedRequests, limits.requests)
  const bwPct = pct(used.usedBandwidthGB, limits.bandwidthGB)
  const stPct = pct(used.usedStorageGB, limits.storageGB)
  const seatsPct = pct(workspace.value.seatsUsed, limits.seats)

  return [
    {
      key: 'requests',
      label: 'Requests',
      icon: 'i-lucide-activity',
      used: formatInt(used.usedRequests),
      limit: formatInt(limits.requests),
      pct: reqPct,
      tone: toneFromPct(reqPct)
    },
    {
      key: 'bandwidth',
      label: 'Bandwidth',
      icon: 'i-lucide-wifi',
      used: formatGB(used.usedBandwidthGB),
      limit: formatGB(limits.bandwidthGB),
      pct: bwPct,
      tone: toneFromPct(bwPct)
    },
    {
      key: 'storage',
      label: 'Storage',
      icon: 'i-lucide-database',
      used: formatGB(used.usedStorageGB),
      limit: formatGB(limits.storageGB),
      pct: stPct,
      tone: toneFromPct(stPct)
    },
    {
      key: 'seats',
      label: 'Seats',
      icon: 'i-lucide-users',
      used: `${workspace.value.seatsUsed}`,
      limit: `${limits.seats}`,
      pct: seatsPct,
      tone: toneFromPct(seatsPct)
    }
  ]
})

/**
 * Members filters
 */
const query = ref('')
const roleFilter = ref<MemberRole | 'all'>('all')
const statusFilter = ref<MemberStatus | 'all'>('all')
const onlyOverrides = ref(false)

const roleItems = ['all', 'Owner', 'Admin', 'Member', 'Viewer'] as const
const statusItems = ['all', 'Active', 'Invited', 'Suspended'] as const

const filteredMemberRows = computed(() => {
  const q = query.value.trim().toLowerCase()
  return memberRows.value.filter((r) => {
    const matchesQ = !q || `${r.name} ${r.email}`.toLowerCase().includes(q)
    const matchesRole = roleFilter.value === 'all' || r.role === roleFilter.value
    const matchesStatus = statusFilter.value === 'all' || r.status === statusFilter.value
    const matchesOverride = !onlyOverrides.value || r.hasOverride
    return matchesQ && matchesRole && matchesStatus && matchesOverride
  })
})

/**
 * Selected member preview
 */
const selectedMemberId = ref<number | null>(members.value[0]?.id ?? null)

watch(
  filteredMemberRows,
  (rows) => {
    if (!rows.length) {
      selectedMemberId.value = null
      return
    }
    const exists = rows.some((r) => r.id === selectedMemberId.value)
    if (!exists) selectedMemberId.value = rows[0]?.id ?? null
  },
  { immediate: true }
)

const selectedMember = computed(() => {
  const id = selectedMemberId.value
  if (id == null) return null
  return members.value.find((m) => m.id === id) ?? null
})

const selectedRow = computed(() => {
  const id = selectedMemberId.value
  if (id == null) return null
  return filteredMemberRows.value.find((r) => r.id === id) ?? null
})

function selectMember(id: number) {
  selectedMemberId.value = id
}

/**
 * Table selection + bulk operations (use UTable's tanstack selection)
 */
const tableRef = ref<any>(null)

const selectedIds = computed<number[]>(() => {
  const api = tableRef.value?.tableApi
  const rows = api?.getFilteredSelectedRowModel?.().rows ?? []
  return rows.map((r: any) => Number(r.original?.id)).filter((v: number) => Number.isFinite(v))
})

const selectedCount = computed(() => selectedIds.value.length)

/**
 * Modals
 */
const workspaceModalOpen = ref(false)
const memberModalOpen = ref(false)

const workspaceForm = ref<WorkspaceLimits>({ ...workspaceLimits.value })

watch(workspaceModalOpen, (open) => {
  if (open) workspaceForm.value = { ...workspaceLimits.value }
})

function saveWorkspaceLimits() {
  workspaceLimits.value = { ...workspaceForm.value }
  workspaceModalOpen.value = false
  toast.add({ title: 'Workspace limits updated', icon: 'i-lucide-circle-check', color: 'success' })
}

/**
 * Member override form (single / bulk)
 */
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

  // Seed from first member if exists
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

function disableOverrides(ids: number[]) {
  for (const id of ids) {
    const m = members.value.find((x) => x.id === id)
    if (m) m.override = null
  }
  toast.add({ title: 'Overrides cleared', icon: 'i-lucide-rotate-ccw', color: 'neutral' })
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
  toast.add({
    title: applyToMultiple.value ? `Override applied to ${ids.length} members` : 'Member override updated',
    icon: 'i-lucide-circle-check',
    color: 'success'
  })
}

/**
 * Dropdown actions (row + bulk)
 */
function getRowItems(row: Row<MemberRow>) {
  const id = row.original.id
  const email = row.original.email

  return [
    { type: 'label', label: 'Actions' },
    {
      label: 'Preview',
      icon: 'i-lucide-eye',
      onSelect() {
        selectMember(id)
      }
    },
    {
      label: 'Edit override',
      icon: 'i-lucide-sliders',
      onSelect() {
        openMemberOverride([id])
      }
    },
    {
      label: 'Copy email',
      icon: 'i-lucide-copy',
      onSelect() {
        copy(email)
        toast.add({ title: 'Copied', description: email, icon: 'i-lucide-copy', color: 'success' })
      }
    },
    { type: 'separator' },
    {
      label: 'Clear override',
      icon: 'i-lucide-rotate-ccw',
      onSelect() {
        disableOverrides([id])
      }
    }
  ]
}

const bulkItems = computed(() => [
  { type: 'label', label: `Selected (${selectedCount.value})` },
  {
    label: 'Apply override',
    icon: 'i-lucide-sliders',
    disabled: selectedCount.value === 0,
    onSelect() {
      if (!selectedIds.value.length) return
      openMemberOverride(selectedIds.value)
    }
  },
  {
    label: 'Clear overrides',
    icon: 'i-lucide-rotate-ccw',
    disabled: selectedCount.value === 0,
    onSelect() {
      if (!selectedIds.value.length) return
      disableOverrides(selectedIds.value)
    }
  }
])

/**
 * Columns
 */
const columns = computed<TableColumn<MemberRow>[]>(() => [
  {
    id: 'select',
    header: ({ table }: any) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (v: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!v),
        'aria-label': 'Select all'
      }),
    cell: ({ row }: any) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (v: boolean | 'indeterminate') => row.toggleSelected(!!v),
        'aria-label': 'Select row'
      }),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'Member',
    cell: ({ row }: any) => {
      const r = row.original as MemberRow
      const isActive = r.id === selectedMemberId.value
      return h(
        'button',
        {
          class:
            'w-full text-left flex items-center gap-3 rounded-xl px-2 py-1.5 transition ' +
            (isActive
              ? 'bg-primary-50 dark:bg-primary-950/30 ring-1 ring-primary-200/60 dark:ring-primary-900/50'
              : 'hover:bg-gray-50 dark:hover:bg-gray-900/40'),
          onClick: () => selectMember(r.id)
        },
        [
          h(UAvatar, { alt: r.name, size: 'sm', class: 'shrink-0' }),
          h('div', { class: 'min-w-0 flex-1' }, [
            h('div', { class: 'text-sm font-semibold text-gray-900 dark:text-white truncate' }, r.name),
            h('div', { class: 'text-xs text-gray-500 dark:text-gray-400 truncate' }, r.email)
          ])
        ]
      )
    }
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }: any) => {
      const role = String(row.getValue('role'))
      const color =
        role === 'Owner' ? ('primary' as const) : role === 'Admin' ? ('warning' as const) : ('neutral' as const)
      return h(UBadge, { color, variant: 'subtle', size: 'xs' }, () => role)
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const st = String(row.getValue('status'))
      const color = st === 'Active' ? ('success' as const) : st === 'Invited' ? ('neutral' as const) : ('error' as const)
      return h(UBadge, { color, variant: 'subtle', size: 'xs' }, () => st)
    }
  },
  {
    accessorKey: 'usedRequests',
    header: () => h('div', { class: 'text-right' }, 'Requests'),
    cell: ({ row }: any) => h('div', { class: 'text-right font-medium tabular-nums' }, formatInt(row.getValue('usedRequests')))
  },
  {
    accessorKey: 'usedBandwidthGB',
    header: () => h('div', { class: 'text-right' }, 'Bandwidth'),
    cell: ({ row }: any) => h('div', { class: 'text-right font-medium tabular-nums' }, formatGB(row.getValue('usedBandwidthGB')))
  },
  {
    accessorKey: 'usedStorageGB',
    header: () => h('div', { class: 'text-right' }, 'Storage'),
    cell: ({ row }: any) => h('div', { class: 'text-right font-medium tabular-nums' }, formatGB(row.getValue('usedStorageGB')))
  },
  {
    accessorKey: 'hasOverride',
    header: 'Override',
    cell: ({ row }: any) => {
      const has = Boolean(row.getValue('hasOverride'))
      return has
        ? h(UBadge, { color: 'primary', variant: 'soft', size: 'xs' }, () => 'Custom')
        : h(UBadge, { color: 'neutral', variant: 'soft', size: 'xs' }, () => 'Default')
    }
  },
  {
    accessorKey: 'lastActiveISO',
    header: 'Last active',
    cell: ({ row }: any) =>
      h('div', { class: 'text-xs text-gray-600 dark:text-gray-400' }, relativeTime(String(row.getValue('lastActiveISO'))))
  },
  {
    id: 'actions',
    enableHiding: false,
    header: () => h('div', { class: 'text-right' }, ''),
    cell: ({ row }: any) =>
      h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          { items: getRowItems(row), content: { align: 'end' }, 'aria-label': 'Actions dropdown' },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
              'aria-label': 'Actions dropdown'
            })
        )
      )
  }
])

/**
 * Preview stats (selected member)
 */
const selectedPreview = computed(() => {
  const r = selectedRow.value
  const m = selectedMember.value
  if (!r || !m) return null

  const limits = workspaceLimits.value
  const ov = m.override?.enabled ? m.override : null

  // Use override caps if enabled, otherwise show workspace as reference
  const capRequests = ov?.requests ?? limits.requests
  const capBandwidth = ov?.bandwidthGB ?? limits.bandwidthGB
  const capStorage = ov?.storageGB ?? limits.storageGB

  const pReq = pct(r.usedRequests, capRequests)
  const pBw = pct(r.usedBandwidthGB, capBandwidth)
  const pSt = pct(r.usedStorageGB, capStorage)

  return {
    member: m,
    row: r,
    caps: { capRequests, capBandwidth, capStorage },
    pct: { pReq, pBw, pSt },
    tone: {
      req: toneFromPct(pReq),
      bw: toneFromPct(pBw),
      st: toneFromPct(pSt)
    }
  }
})

/**
 * Workspace policy toggles
 */
const policyModeItems = [
  { label: 'Hard cap (block)', value: 'hard' },
  { label: 'Soft cap (warn)', value: 'soft' }
] as const

type PolicyModeItem = (typeof policyModeItems)[number]
const policyMode = computed<PolicyModeItem>({
  get: () => policyModeItems.find((x) => x.value === workspaceLimits.value.mode) ?? policyModeItems[0],
  set: (v) => (workspaceLimits.value.mode = v.value)
})

const resetInfo = computed(() => {
  const d = nextResetDate(workspaceLimits.value.resetDayOfMonth)
  return df.format(d)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 class="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
            Usage limits
          </h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage workspace caps and per-member overrides. Range affects usage calculations for clearer reviews.
          </p>

          <div class="mt-3 flex flex-wrap items-center gap-2">
            <UBadge color="neutral" variant="soft" size="xs">
              Workspace: <span class="ml-1 font-semibold">{{ workspace.name }}</span>
            </UBadge>
            <UBadge color="primary" variant="soft" size="xs">
              Plan: <span class="ml-1 font-semibold">{{ workspace.plan }}</span>
            </UBadge>
            <UBadge color="neutral" variant="soft" size="xs">
              Reset: <span class="ml-1 font-semibold">{{ resetInfo }}</span>
            </UBadge>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
          <!-- Preset -->
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

          <!-- Calendar range -->
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

                <UCalendar v-model="rangeModel" range :number-of-months="2" class="p-2" />

                <div class="mt-2 flex items-center justify-between gap-2">
                  <div class="text-xs text-gray-600 dark:text-gray-400 truncate">
                    Selected: <span class="font-medium text-gray-900 dark:text-white">{{ rangeLabel }}</span>
                    <span class="ml-2">({{ rangeDays }} days)</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <UButton size="sm" color="neutral" variant="outline" @click="rangeModel = { start: null, end: null }">
                      Clear
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

          <UButton size="sm" color="primary" variant="solid" icon="i-lucide-sliders" class="w-full sm:w-auto justify-center" @click="workspaceModalOpen = true">
            Edit limits
          </UButton>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mt-5">
        <UTabs
          v-model="activeTab"
          :items="tabItems"
          color="primary"
          variant="link"
          :unmount-on-hide="false"
          class="w-full"
          :ui="{ trigger: 'grow' }"
        >
          <!-- ===================== WORKSPACE ===================== -->
          <template #workspace>
            <div class="mt-5 space-y-6">
              <!-- Cards -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <UCard
                  v-for="c in workspaceCards"
                  :key="c.key"
                  class="hover:shadow-lg transition-shadow duration-200"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <div
                          class="p-2 rounded-xl ring-1"
                          :class="c.tone.ring"
                        >
                          <UIcon :name="c.icon" class="w-5 h-5 text-gray-900 dark:text-white/90" />
                        </div>
                        <div class="min-w-0">
                          <div class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ c.label }}</div>
                          <div class="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {{ c.used }} / {{ c.limit }}
                          </div>
                        </div>
                      </div>

                      <div class="mt-4">
                        <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>Usage</span>
                          <span class="font-semibold text-gray-900 dark:text-white tabular-nums">{{ c.pct }}%</span>
                        </div>
                        <component :is="UProgress" class="mt-2" :value="c.pct" />
                      </div>
                    </div>

                    <UBadge :color="c.tone.badge" variant="soft" size="xs" class="shrink-0">
                      <UIcon :name="c.tone.icon" class="w-3.5 h-3.5 mr-1" />
                      {{ c.pct >= 90 ? 'Critical' : c.pct >= 75 ? 'Watch' : 'OK' }}
                    </UBadge>
                  </div>

                  <div class="mt-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 p-3 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-gray-600 dark:text-gray-400">Mode</span>
                      <span class="font-semibold text-gray-900 dark:text-white capitalize">{{ workspaceLimits.mode }}</span>
                    </div>
                    <div class="mt-1 flex items-center justify-between text-xs">
                      <span class="text-gray-600 dark:text-gray-400">Notify at</span>
                      <span class="font-semibold text-gray-900 dark:text-white tabular-nums">{{ workspaceLimits.notifyAtPct }}%</span>
                    </div>
                  </div>
                </UCard>
              </div>

              <!-- Policy + Notes -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <UCard class="lg:col-span-2 hover:shadow-md transition-shadow">
                  <template #header>
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <h3 class="text-base font-semibold text-gray-900 dark:text-white">Policy</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Configure how limits behave and when to alert admins.
                        </p>
                      </div>
                      <UBadge color="neutral" variant="soft" size="xs">
                        {{ rangeDays }}-day view
                      </UBadge>
                    </div>
                  </template>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="rounded-2xl bg-gray-50 dark:bg-gray-900/40 p-4 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
                      <div class="text-xs text-gray-600 dark:text-gray-400">Limit mode</div>
                      <div class="mt-2">
                        <USelectMenu
                          v-model="policyMode"
                          :items="policyModeItems"
                          value-key="value"
                          label-key="label"
                          size="sm"
                          color="neutral"
                          variant="outline"
                          class="w-full"
                        />
                      </div>
                      <div class="mt-3 text-xs text-gray-600 dark:text-gray-400">
                        <span class="font-semibold text-gray-900 dark:text-white">Hard</span> blocks when exceeded.
                        <span class="font-semibold text-gray-900 dark:text-white">Soft</span> warns but continues.
                      </div>
                    </div>

                    <div class="rounded-2xl bg-gray-50 dark:bg-gray-900/40 p-4 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
                      <div class="text-xs text-gray-600 dark:text-gray-400">Alerts</div>
                      <div class="mt-2 flex items-center justify-between">
                        <div class="text-sm font-semibold text-gray-900 dark:text-white">
                          Notify at {{ workspaceLimits.notifyAtPct }}%
                        </div>
                        <UBadge color="primary" variant="soft" size="xs">Email</UBadge>
                      </div>
                      <div class="mt-3">
                        <UInput
                          v-model.number="workspaceLimits.notifyAtPct"
                          type="number"
                          min="1"
                          max="99"
                          size="sm"
                          color="neutral"
                          variant="outline"
                          placeholder="85"
                        />
                        <div class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                          Recommended: 80–90% so you have time to react.
                        </div>
                      </div>
                    </div>

                    <div class="rounded-2xl bg-gray-50 dark:bg-gray-900/40 p-4 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
                      <div class="text-xs text-gray-600 dark:text-gray-400">Overage</div>
                      <div class="mt-2 flex items-center justify-between">
                        <div class="text-sm font-semibold text-gray-900 dark:text-white">
                          Allow overage
                        </div>
                        <USwitch v-model="workspaceLimits.allowOverage" />
                      </div>
                      <div class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        When enabled, requests can continue (recommended only for enterprise).
                      </div>
                    </div>

                    <div class="rounded-2xl bg-gray-50 dark:bg-gray-900/40 p-4 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
                      <div class="text-xs text-gray-600 dark:text-gray-400">Reset cycle</div>
                      <div class="mt-2 flex items-center gap-2">
                        <UInput
                          v-model.number="workspaceLimits.resetDayOfMonth"
                          type="number"
                          min="1"
                          max="28"
                          size="sm"
                          color="neutral"
                          variant="outline"
                          class="w-28"
                        />
                        <div class="text-sm font-semibold text-gray-900 dark:text-white">
                          Next reset: {{ resetInfo }}
                        </div>
                      </div>
                      <div class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        Use 1–28 to avoid invalid dates (Feb).
                      </div>
                    </div>
                  </div>
                </UCard>

                <UCard class="hover:shadow-md transition-shadow">
                  <template #header>
                    <div>
                      <h3 class="text-base font-semibold text-gray-900 dark:text-white">Recommendations</h3>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Better control with less friction</p>
                    </div>
                  </template>

                  <div class="space-y-3 text-sm">
                    <div class="rounded-xl p-3 bg-gray-50 dark:bg-gray-900/40 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
                      <div class="font-semibold text-gray-900 dark:text-white">Use per-member overrides</div>
                      <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Great for heavy users without increasing global caps.
                      </div>
                    </div>

                    <div class="rounded-xl p-3 bg-gray-50 dark:bg-gray-900/40 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
                      <div class="font-semibold text-gray-900 dark:text-white">Keep alerts at 80–90%</div>
                      <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Prevents surprises near the end of the cycle.
                      </div>
                    </div>

                    <div class="rounded-xl p-3 bg-gray-50 dark:bg-gray-900/40 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
                      <div class="font-semibold text-gray-900 dark:text-white">Soft cap for dev/staging</div>
                      <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Keeps UX smooth while still surfacing warnings.
                      </div>
                    </div>
                  </div>
                </UCard>
              </div>
            </div>
          </template>

          <!-- ===================== MEMBERS ===================== -->
          <template #members>
            <div class="mt-5">
              <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <!-- List -->
                <UCard class="lg:col-span-3 hover:shadow-md transition-shadow">
                  <template #header>
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h3 class="text-base font-semibold text-gray-900 dark:text-white">Members usage</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Filter, select members, then apply overrides in bulk.
                        </p>
                      </div>

                      <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <UInput
                          v-model="query"
                          icon="i-lucide-search"
                          placeholder="Search name or email…"
                          size="sm"
                          class="w-full sm:w-64"
                        />

                        <USelectMenu
                          v-model="roleFilter"
                          :items="roleItems"
                          size="sm"
                          color="neutral"
                          variant="outline"
                          class="w-full sm:w-32"
                        />

                        <USelectMenu
                          v-model="statusFilter"
                          :items="statusItems"
                          size="sm"
                          color="neutral"
                          variant="outline"
                          class="w-full sm:w-36"
                        />

                        <div class="flex items-center gap-2">
                          <USwitch v-model="onlyOverrides" />
                          <span class="text-xs text-gray-600 dark:text-gray-400">Overrides</span>
                        </div>
                      </div>
                    </div>
                  </template>

                  <!-- Bulk bar -->
                  <div
                    v-if="selectedCount > 0"
                    class="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-primary-50 dark:bg-primary-950/30 p-3
                           ring-1 ring-primary-200/60 dark:ring-primary-900/40"
                  >
                    <div class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ selectedCount }} selected
                      <span class="ml-2 text-xs font-normal text-gray-600 dark:text-gray-400">
                        (Apply override or clear overrides)
                      </span>
                    </div>

                    <div class="flex items-center gap-2">
                      <UDropdownMenu :items="bulkItems" :content="{ align: 'end' }">
                        <UButton size="sm" color="primary" variant="solid" icon="i-lucide-zap">
                          Bulk actions
                        </UButton>
                      </UDropdownMenu>

                      <UButton
                        size="sm"
                        color="neutral"
                        variant="outline"
                        icon="i-lucide-x"
                        @click="tableRef?.tableApi?.resetRowSelection?.()"
                      >
                        Clear selection
                      </UButton>
                    </div>
                  </div>

                  <div class="overflow-hidden rounded-2xl ring-1 ring-gray-200/60 dark:ring-gray-800/60">
                    <UTable
                      ref="tableRef"
                      :data="filteredMemberRows"
                      :columns="columns"
                      class="w-full"
                      :ui="{
                        thead: 'sticky top-0 z-10 bg-white dark:bg-gray-950',
                        td: 'align-middle'
                      }"
                    />
                  </div>

                  <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <UBadge color="neutral" variant="soft" size="xs">
                      Rows: <span class="ml-1 font-semibold">{{ filteredMemberRows.length }}</span>
                    </UBadge>
                    <UBadge color="primary" variant="soft" size="xs">
                      Range: <span class="ml-1 font-semibold">{{ rangeDays }} days</span>
                    </UBadge>
                  </div>
                </UCard>

                <!-- Preview -->
                <UCard class="lg:col-span-2 hover:shadow-md transition-shadow">
                  <template #header>
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <h3 class="text-base font-semibold text-gray-900 dark:text-white">Member preview</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Usage and cap comparison</p>
                      </div>

                      <UButton
                        size="sm"
                        color="primary"
                        variant="soft"
                        icon="i-lucide-sliders"
                        :disabled="!selectedMember"
                        @click="selectedMember && openMemberOverride([selectedMember.id])"
                      >
                        Edit override
                      </UButton>
                    </div>
                  </template>

                  <div v-if="!selectedPreview" class="py-16 text-center text-sm text-gray-600 dark:text-gray-400">
                    Select a member to preview usage.
                  </div>

                  <div v-else class="space-y-5">
                    <div class="flex items-center gap-3">
                      <UAvatar :alt="selectedPreview.member.name" size="md" />
                      <div class="min-w-0">
                        <div class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {{ selectedPreview.member.name }}
                        </div>
                        <div class="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {{ selectedPreview.member.email }}
                        </div>
                        <div class="mt-1 flex items-center gap-2">
                          <UBadge color="neutral" variant="soft" size="xs">{{ selectedPreview.member.role }}</UBadge>
                          <UBadge
                            :color="selectedPreview.member.status === 'Active' ? 'success' : selectedPreview.member.status === 'Invited' ? 'neutral' : 'error'"
                            variant="soft"
                            size="xs"
                          >
                            {{ selectedPreview.member.status }}
                          </UBadge>
                          <span class="text-xs text-gray-500 dark:text-gray-400">
                            · {{ relativeTime(selectedPreview.member.lastActiveISO) }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="rounded-2xl bg-gray-50 dark:bg-gray-900/40 p-4 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
                      <div class="flex items-center justify-between">
                        <div class="text-sm font-semibold text-gray-900 dark:text-white">Limits</div>
                        <UBadge :color="selectedPreview.member.override?.enabled ? 'primary' : 'neutral'" variant="soft" size="xs">
                          {{ selectedPreview.member.override?.enabled ? 'Custom' : 'Workspace default' }}
                        </UBadge>
                      </div>

                      <div class="mt-4 space-y-3">
                        <!-- Requests -->
                        <div>
                          <div class="flex items-center justify-between text-xs">
                            <span class="text-gray-600 dark:text-gray-400">Requests</span>
                            <span class="font-semibold text-gray-900 dark:text-white tabular-nums">
                              {{ formatInt(selectedPreview.row.usedRequests) }} / {{ formatInt(selectedPreview.caps.capRequests) }}
                            </span>
                          </div>
                          <component :is="UProgress" class="mt-2" :value="selectedPreview.pct.pReq" />
                          <div class="mt-1 text-xs text-gray-600 dark:text-gray-400">
                            <UBadge :color="selectedPreview.tone.req.badge" variant="soft" size="xs">{{ selectedPreview.pct.pReq }}%</UBadge>
                            <span class="ml-2">Mode: <span class="font-semibold capitalize">{{ selectedPreview.member.override?.mode ?? workspaceLimits.mode }}</span></span>
                          </div>
                        </div>

                        <!-- Bandwidth -->
                        <div>
                          <div class="flex items-center justify-between text-xs">
                            <span class="text-gray-600 dark:text-gray-400">Bandwidth</span>
                            <span class="font-semibold text-gray-900 dark:text-white tabular-nums">
                              {{ formatGB(selectedPreview.row.usedBandwidthGB) }} / {{ formatGB(selectedPreview.caps.capBandwidth) }}
                            </span>
                          </div>
                          <component :is="UProgress" class="mt-2" :value="selectedPreview.pct.pBw" />
                          <div class="mt-1 text-xs text-gray-600 dark:text-gray-400">
                            <UBadge :color="selectedPreview.tone.bw.badge" variant="soft" size="xs">{{ selectedPreview.pct.pBw }}%</UBadge>
                            <span class="ml-2">Notify at {{ selectedPreview.member.override?.notifyAtPct ?? workspaceLimits.notifyAtPct }}%</span>
                          </div>
                        </div>

                        <!-- Storage -->
                        <div>
                          <div class="flex items-center justify-between text-xs">
                            <span class="text-gray-600 dark:text-gray-400">Storage</span>
                            <span class="font-semibold text-gray-900 dark:text-white tabular-nums">
                              {{ formatGB(selectedPreview.row.usedStorageGB) }} / {{ formatGB(selectedPreview.caps.capStorage) }}
                            </span>
                          </div>
                          <component :is="UProgress" class="mt-2" :value="selectedPreview.pct.pSt" />
                          <div class="mt-1 text-xs text-gray-600 dark:text-gray-400">
                            <UBadge :color="selectedPreview.tone.st.badge" variant="soft" size="xs">{{ selectedPreview.pct.pSt }}%</UBadge>
                            <span class="ml-2">Range: {{ rangeDays }} days</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center justify-end gap-2">
                      <UButton
                        size="sm"
                        color="neutral"
                        variant="outline"
                        icon="i-lucide-rotate-ccw"
                        :disabled="!selectedPreview.member.override?.enabled"
                        @click="selectedPreview.member && disableOverrides([selectedPreview.member.id])"
                      >
                        Clear override
                      </UButton>
                      <UButton
                        size="sm"
                        color="primary"
                        variant="solid"
                        icon="i-lucide-sliders"
                        @click="selectedPreview.member && openMemberOverride([selectedPreview.member.id])"
                      >
                        Edit override
                      </UButton>
                    </div>
                  </div>
                </UCard>
              </div>
            </div>
          </template>
        </UTabs>
      </div>
    </div>

    <!-- ===================== MODAL: WORKSPACE LIMITS ===================== -->
    <UModal v-model:open="workspaceModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-base font-semibold text-gray-900 dark:text-white">Edit workspace limits</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Applies to the whole workspace</div>
            </div>
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" class="-my-1" @click="workspaceModalOpen = false" />
          </div>
        </template>

        <div class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormGroup label="Requests cap" name="requests">
              <UInput v-model.number="workspaceForm.requests" type="number" min="0" placeholder="1200000" />
            </UFormGroup>

            <UFormGroup label="Bandwidth cap (GB)" name="bandwidthGB">
              <UInput v-model.number="workspaceForm.bandwidthGB" type="number" min="0" placeholder="800" />
            </UFormGroup>

            <UFormGroup label="Storage cap (GB)" name="storageGB">
              <UInput v-model.number="workspaceForm.storageGB" type="number" min="0" placeholder="250" />
            </UFormGroup>

            <UFormGroup label="Seats cap" name="seats">
              <UInput v-model.number="workspaceForm.seats" type="number" min="1" placeholder="20" />
            </UFormGroup>

            <UFormGroup label="Notify at (%)" name="notifyAtPct">
              <UInput v-model.number="workspaceForm.notifyAtPct" type="number" min="1" max="99" placeholder="85" />
            </UFormGroup>

            <UFormGroup label="Reset day (1–28)" name="resetDayOfMonth">
              <UInput v-model.number="workspaceForm.resetDayOfMonth" type="number" min="1" max="28" placeholder="1" />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormGroup label="Limit mode" name="mode">
              <USelectMenu
                v-model="workspaceForm.mode"
                :items="['hard', 'soft']"
                size="sm"
                color="neutral"
                variant="outline"
              />
            </UFormGroup>

            <div class="rounded-2xl bg-gray-50 dark:bg-gray-900/40 p-4 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm font-semibold text-gray-900 dark:text-white">Allow overage</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">Continue after reaching the cap</div>
                </div>
                <USwitch v-model="workspaceForm.allowOverage" />
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <UButton label="Cancel" color="neutral" variant="ghost" @click="workspaceModalOpen = false" />
            <UButton label="Save changes" color="primary" @click="saveWorkspaceLimits" />
          </div>
        </div>
      </UCard>
    </UModal>

    <!-- ===================== MODAL: MEMBER OVERRIDE (single / bulk) ===================== -->
    <UModal v-model:open="memberModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-base font-semibold text-gray-900 dark:text-white">
                {{ applyToMultiple ? `Apply override (${editTargetIds.length} members)` : 'Edit member override' }}
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400">
                Caps are compared against usage in the selected range ({{ rangeDays }} days).
              </div>
            </div>
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" class="-my-1" @click="memberModalOpen = false" />
          </div>
        </template>

        <div class="space-y-4">
          <div class="rounded-2xl bg-gray-50 dark:bg-gray-900/40 p-4 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-semibold text-gray-900 dark:text-white">Enable override</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">
                  If disabled, member will use workspace defaults.
                </div>
              </div>
              <USwitch v-model="memberForm.enabled" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormGroup label="Mode" name="mode">
              <USelectMenu
                v-model="memberForm.mode"
                :items="[
                  { label: 'Hard cap (block)', value: 'hard' },
                  { label: 'Soft cap (warn)', value: 'soft' }
                ]"
                value-key="value"
                label-key="label"
                size="sm"
                color="neutral"
                variant="outline"
              />
            </UFormGroup>

            <UFormGroup label="Notify at (%)" name="notifyAtPct">
              <UInput v-model.number="memberForm.notifyAtPct" type="number" min="1" max="99" placeholder="85" />
            </UFormGroup>

            <UFormGroup label="Requests cap" name="requests">
              <UInput v-model.number="memberForm.requests" type="number" min="0" placeholder="200000" :disabled="!memberForm.enabled" />
            </UFormGroup>

            <UFormGroup label="Bandwidth cap (GB)" name="bandwidthGB">
              <UInput v-model.number="memberForm.bandwidthGB" type="number" min="0" placeholder="60" :disabled="!memberForm.enabled" />
            </UFormGroup>

            <UFormGroup label="Storage cap (GB)" name="storageGB">
              <UInput v-model.number="memberForm.storageGB" type="number" min="0" placeholder="15" :disabled="!memberForm.enabled" />
            </UFormGroup>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <UButton label="Cancel" color="neutral" variant="ghost" @click="memberModalOpen = false" />
            <UButton
              :label="applyToMultiple ? 'Apply' : 'Save'"
              color="primary"
              @click="saveMemberOverride"
            />
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>
