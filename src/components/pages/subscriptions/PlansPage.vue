<script setup lang="ts">
import { computed, h, reactive, ref, resolveComponent, watch } from 'vue'
import type { DropdownMenuItem, FormSubmitEvent, TableColumn, TabsItem } from '@nuxt/ui'
import * as yup from 'yup'
import { plans as initialPlans } from '@/mock/subscriptions'

/** =========================
 * Types
 * ========================= */
type TabValue = 'list' | 'preview'
type BillingPeriod = 'monthly' | 'yearly'
type Interval = 'month' | 'year'
type UiColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
type Currency = 'USD' | 'IDR' | 'EUR'

type RawPlan = {
  id: number
  name: string
  price: string | number
  interval: Interval
  features: string[]
  popular: boolean
  color?: string
  description?: string
}

type Plan = {
  id: number
  name: string
  price: number
  interval: Interval
  features: string[]
  popular: boolean
  color: UiColor
  description: string
  archived: boolean

  // extra admin metrics (mock-friendly)
  customers: number
  updatedAt: string // ISO date
}

type PlanRow = {
  id: number
  name: string
  description: string
  priceView: string
  interval: Interval
  status: 'active' | 'archived'
  popular: boolean
  isDefault: boolean
  isSelected: boolean
  customers: number
  mrr: string
  updatedAt: string
  color: UiColor
}

/** =========================
 * Nuxt UI resolved components for h()
 * ========================= */
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()

/** =========================
 * Helpers
 * ========================= */
function parsePrice(input: string | number): number {
  if (typeof input === 'number') return Number.isFinite(input) ? input : 0
  const cleaned = String(input).replace(/[^0-9.]/g, '')
  const n = Number.parseFloat(cleaned)
  return Number.isFinite(n) ? n : 0
}

function normalizeColor(input?: string): UiColor {
  const v = (input || '').toLowerCase()
  const allowed: UiColor[] = ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral']
  return allowed.includes(v as UiColor) ? (v as UiColor) : 'neutral'
}

function formatMoney(value: number, currency: Currency) {
  return new Intl.NumberFormat(currency === 'IDR' ? 'id-ID' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(value))
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function nowIso() {
  return new Date().toISOString()
}

function niceDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

/** =========================
 * State
 * ========================= */
const tabs = [
  { label: 'List', icon: 'i-lucide-layout-list', value: 'list' },
  { label: 'Customer preview', icon: 'i-lucide-eye', value: 'preview' }
] satisfies TabsItem[]

const activeTab = ref<TabValue>('list')

const plans = ref<Plan[]>(
  (Array.isArray(initialPlans) ? (initialPlans as RawPlan[]) : []).map((p, idx) => ({
    id: p.id,
    name: p.name,
    price: parsePrice(p.price),
    interval: p.interval,
    features: Array.isArray(p.features) ? p.features : [],
    popular: !!p.popular,
    color: normalizeColor(p.color),
    description: p.description || '',
    archived: false,

    // extra metrics (mock)
    customers: 50 + idx * 23,
    updatedAt: nowIso()
  }))
)

const defaultPlanId = ref<number>(plans.value[0]?.id ?? 1)
const selectedPlanId = ref<number | null>(plans.value[0]?.id ?? null)

/** Toolbar */
const billingPeriod = ref<BillingPeriod>('monthly')
const currency = ref<Currency>('USD')

const query = ref('')
const statusFilter = ref<'all' | 'active' | 'archived'>('active')
const intervalFilter = ref<'all' | Interval>('all')

const sortKey = ref<'recommended' | 'name' | 'price' | 'customers' | 'updatedAt'>('recommended')
const sortDir = ref<'asc' | 'desc'>('desc')

/** Pagination */
const page = ref(1)
const pageSize = ref(10)

/** Selection (bulk) */
const selectedIds = ref<Set<number>>(new Set())

/** Customer preview simulation */
const seatCount = ref(10)
const includeTax = ref(false)
const taxRate = ref(11) // %
const coupon = ref('')
const discountPct = computed(() => {
  const c = coupon.value.trim().toUpperCase()
  if (!c) return 0
  if (c === 'LUMO10') return 10
  if (c === 'LUMO25') return 25
  return 0
})

/** =========================
 * Derived
 * ========================= */
const stats = computed(() => {
  const total = plans.value.length
  const archived = plans.value.filter(p => p.archived).length
  const active = total - archived
  const popular = plans.value.filter(p => p.popular && !p.archived).length
  return { total, active, archived, popular }
})

function viewCycleLabel() {
  return billingPeriod.value === 'monthly' ? '/month' : '/year'
}

/** convert stored plan price (month/year) to current view (monthly/yearly) */
function viewPrice(plan: Plan) {
  const monthlyEq = plan.interval === 'year' ? plan.price / 12 : plan.price
  return billingPeriod.value === 'monthly' ? monthlyEq : monthlyEq * 12
}

function estimateMrr(plan: Plan) {
  // monthly equivalent * customers
  const monthlyEq = plan.interval === 'year' ? plan.price / 12 : plan.price
  return monthlyEq * (plan.customers || 0)
}

const filteredPlans = computed<Plan[]>(() => {
  const q = query.value.trim().toLowerCase()

  let rows = [...plans.value]

  // status filter
  if (statusFilter.value === 'active') rows = rows.filter(p => !p.archived)
  if (statusFilter.value === 'archived') rows = rows.filter(p => p.archived)

  // interval filter
  if (intervalFilter.value !== 'all') rows = rows.filter(p => p.interval === intervalFilter.value)

  // search
  if (q) {
    rows = rows.filter(p => {
      const hay = `${p.name} ${p.description} ${p.features.join(' ')}`.toLowerCase()
      return hay.includes(q)
    })
  }

  // sorting
  const dir = sortDir.value === 'asc' ? 1 : -1
  if (sortKey.value === 'recommended') {
    rows.sort((a, b) => {
      const aScore =
        (a.id === defaultPlanId.value ? 100 : 0) +
        (a.popular ? 10 : 0) +
        (!a.archived ? 5 : -1000)
      const bScore =
        (b.id === defaultPlanId.value ? 100 : 0) +
        (b.popular ? 10 : 0) +
        (!b.archived ? 5 : -1000)
      return (bScore - aScore) // fixed: recommended always "best first"
    })
  } else if (sortKey.value === 'name') {
    rows.sort((a, b) => dir * a.name.localeCompare(b.name))
  } else if (sortKey.value === 'price') {
    rows.sort((a, b) => dir * (viewPrice(a) - viewPrice(b)))
  } else if (sortKey.value === 'customers') {
    rows.sort((a, b) => dir * ((a.customers || 0) - (b.customers || 0)))
  } else if (sortKey.value === 'updatedAt') {
    rows.sort((a, b) => dir * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()))
  }

  return rows
})

watch([query, statusFilter, intervalFilter, sortKey, sortDir, pageSize], () => {
  page.value = 1
})

const tableRowsAll = computed<PlanRow[]>(() => {
  const selected = selectedPlanId.value
  return filteredPlans.value.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    priceView: formatMoney(viewPrice(p), currency.value),
    interval: p.interval,
    status: p.archived ? 'archived' : 'active',
    popular: p.popular,
    isDefault: p.id === defaultPlanId.value,
    isSelected: selected != null && p.id === selected,
    customers: p.customers || 0,
    mrr: formatMoney(estimateMrr(p), currency.value),
    updatedAt: p.updatedAt,
    color: p.color
  }))
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(tableRowsAll.value.length / pageSize.value))
})

const paginatedRows = computed(() => {
  const p = clamp(page.value, 1, totalPages.value)
  const start = (p - 1) * pageSize.value
  const end = start + pageSize.value
  return tableRowsAll.value.slice(start, end)
})

const selectedPlan = computed<Plan | null>(() => {
  const id = selectedPlanId.value
  if (id == null) return null
  return plans.value.find(p => p.id === id) ?? null
})

/** Bulk helpers */
const allVisibleIds = computed(() => paginatedRows.value.map(r => r.id))
const isAllChecked = computed(() => {
  const ids = allVisibleIds.value
  if (!ids.length) return false
  return ids.every(id => selectedIds.value.has(id))
})
const isSomeChecked = computed(() => {
  const ids = allVisibleIds.value
  return ids.some(id => selectedIds.value.has(id)) && !isAllChecked.value
})
function toggleSelectAll(checked: boolean) {
  const next = new Set(selectedIds.value)
  for (const id of allVisibleIds.value) {
    if (checked) next.add(id)
    else next.delete(id)
  }
  selectedIds.value = next
}
function toggleRow(id: number, checked: boolean) {
  const next = new Set(selectedIds.value)
  if (checked) next.add(id)
  else next.delete(id)
  selectedIds.value = next
}
function clearSelection() {
  selectedIds.value = new Set()
}

/** =========================
 * Actions
 * ========================= */
function selectPlan(id: number) {
  selectedPlanId.value = id
}

function setDefault(planId: number) {
  const p = plans.value.find(x => x.id === planId)
  if (!p || p.archived) return

  defaultPlanId.value = planId
  toast.add({ title: 'Default plan updated', color: 'success', icon: 'i-lucide-circle-check' })
}

function duplicatePlan(planId: number) {
  const p = plans.value.find(x => x.id === planId)
  if (!p) return

  const nextId = plans.value.length ? Math.max(...plans.value.map(x => x.id)) + 1 : 1
  plans.value.unshift({
    ...JSON.parse(JSON.stringify(p)),
    id: nextId,
    name: `${p.name} (Copy)`,
    updatedAt: nowIso()
  })

  toast.add({ title: 'Plan duplicated', description: `Created “${p.name} (Copy)”.`, color: 'success', icon: 'i-lucide-copy' })
}

function toggleArchive(planId: number) {
  const idx = plans.value.findIndex(x => x.id === planId)
  if (idx === -1) return

  plans.value[idx].archived = !plans.value[idx].archived
  plans.value[idx].updatedAt = nowIso()

  // if archived plan was default, move default to the first active plan
  if (plans.value[idx].archived && defaultPlanId.value === planId) {
    const next = plans.value.find(p => !p.archived && p.id !== planId)
    if (next) defaultPlanId.value = next.id
  }

  toast.add({
    title: plans.value[idx].archived ? 'Plan archived' : 'Plan restored',
    color: 'neutral',
    icon: plans.value[idx].archived ? 'i-lucide-archive' : 'i-lucide-rotate-ccw'
  })
}

/** Bulk actions */
function bulkArchive() {
  if (!selectedIds.value.size) return
  for (const id of selectedIds.value) {
    const idx = plans.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      plans.value[idx].archived = true
      plans.value[idx].updatedAt = nowIso()
    }
  }
  clearSelection()
  toast.add({ title: 'Plans archived', color: 'neutral', icon: 'i-lucide-archive' })
}
function bulkRestore() {
  if (!selectedIds.value.size) return
  for (const id of selectedIds.value) {
    const idx = plans.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      plans.value[idx].archived = false
      plans.value[idx].updatedAt = nowIso()
    }
  }
  clearSelection()
  toast.add({ title: 'Plans restored', color: 'success', icon: 'i-lucide-rotate-ccw' })
}

/** =========================
 * Row menu
 * ========================= */
function planMenuItems(planId: number): DropdownMenuItem[][] {
  const p = plans.value.find(x => x.id === planId)
  const isArchived = !!p?.archived
  const isDefault = defaultPlanId.value === planId

  return [
    [
      { label: 'Select', icon: 'i-lucide-target', onSelect: () => selectPlan(planId) },
      { label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => openEdit(planId) },
      { label: 'Duplicate', icon: 'i-lucide-copy', onSelect: () => duplicatePlan(planId) }
    ],
    [
      {
        label: isDefault ? 'Default (selected)' : 'Set as default',
        icon: 'i-lucide-star',
        disabled: isDefault || isArchived,
        onSelect: () => setDefault(planId)
      }
    ],
    [
      {
        label: isArchived ? 'Restore' : 'Archive',
        icon: isArchived ? 'i-lucide-rotate-ccw' : 'i-lucide-archive',
        onSelect: () => toggleArchive(planId)
      }
    ],
    [
      { label: 'Delete', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => askDelete(planId) }
    ]
  ]
}

/** =========================
 * Table columns
 * ========================= */
const columns: TableColumn<PlanRow>[] = [
  {
    id: 'select',
    header: () => {
      return h('div', { class: 'flex justify-center' }, [
        h(UCheckbox as any, {
          modelValue: isAllChecked.value,
          indeterminate: isSomeChecked.value,
          'onUpdate:modelValue': (v: boolean) => toggleSelectAll(v),
          'aria-label': 'Select all'
        })
      ])
    },
    cell: ({ row }) => {
      const id = row.original.id
      return h('div', { class: 'flex justify-center' }, [
        h(UCheckbox as any, {
          modelValue: selectedIds.value.has(id),
          'onUpdate:modelValue': (v: boolean) => toggleRow(id, v),
          'aria-label': 'Select row'
        })
      ])
    },
    meta: { class: { th: 'w-12', td: 'w-12 align-middle' } }
  },
  {
    accessorKey: 'name',
    header: 'Plan',
    cell: ({ row }) => {
      const r = row.original
      const badges = [
        r.isDefault ? h(UBadge as any, { color: 'primary', variant: 'soft', size: 'xs' }, () => 'Default') : null,
        r.popular && r.status === 'active'
          ? h(UBadge as any, { color: 'success', variant: 'soft', size: 'xs' }, () => 'Popular')
          : null,
        r.status === 'archived' ? h(UBadge as any, { color: 'neutral', variant: 'soft', size: 'xs' }, () => 'Archived') : null
      ].filter(Boolean)

      const rowStyle =
        'w-full text-left rounded-xl px-2 py-1 -mx-2 transition-colors ' +
        (r.isSelected
          ? 'bg-primary-50 dark:bg-primary-950/30'
          : 'hover:bg-gray-50 dark:hover:bg-gray-900/40')

      return h(
        'button',
        { type: 'button', class: rowStyle, onClick: () => selectPlan(r.id) },
        [
          h('div', { class: 'flex items-center gap-2 min-w-0' }, [
            h('div', { class: 'font-semibold text-gray-900 dark:text-white truncate' }, r.name),
            ...badges
          ]),
          h('div', { class: 'mt-0.5 text-xs text-gray-500 dark:text-gray-400 truncate' }, r.description || '—')
        ]
      )
    }
  },
  {
    accessorKey: 'priceView',
    header: 'Price',
    meta: { class: { th: 'w-44', td: 'align-middle' } },
    cell: ({ row }) =>
      h('div', { class: 'space-y-0.5' }, [
        h('div', { class: 'font-semibold text-gray-900 dark:text-white' }, `${row.original.priceView} ${viewCycleLabel()}`),
        h('div', { class: 'text-xs text-gray-500 dark:text-gray-400' }, row.original.interval === 'year' ? 'Stored yearly' : 'Stored monthly')
      ])
  },
  {
    accessorKey: 'customers',
    header: () => h('div', { class: 'text-right' }, 'Customers'),
    meta: { class: { th: 'w-28 text-right', td: 'text-right align-middle' } },
    cell: ({ row }) =>
      h('div', { class: 'font-medium text-gray-900 dark:text-white' }, row.original.customers.toLocaleString())
  },
  {
    accessorKey: 'mrr',
    header: () => h('div', { class: 'text-right' }, 'Est. MRR'),
    meta: { class: { th: 'w-28 text-right', td: 'text-right align-middle' } },
    cell: ({ row }) =>
      h('div', { class: 'font-semibold text-gray-900 dark:text-white' }, row.original.mrr)
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
    meta: { class: { th: 'w-32', td: 'align-middle' } },
    cell: ({ row }) => h('div', { class: 'text-sm text-gray-700 dark:text-gray-200' }, niceDate(row.original.updatedAt))
  },
  {
    id: 'actions',
    header: '',
    meta: { class: { th: 'w-16 text-right', td: 'text-right align-middle' } },
    cell: ({ row }) =>
      h(
        'div',
        { class: 'flex justify-end' },
        h(
          UDropdownMenu as any,
          { items: planMenuItems(row.original.id), content: { align: 'end' } },
          () =>
            h(UButton as any, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              size: 'sm',
              'aria-label': 'Plan actions'
            })
        )
      )
  }
]

/** =========================
 * Delete flow
 * ========================= */
const isDeleteOpen = ref(false)
const deletingId = ref<number | null>(null)

const deletingName = computed(() => {
  const id = deletingId.value
  if (id == null) return ''
  return plans.value.find(p => p.id === id)?.name ?? ''
})

function askDelete(planId: number) {
  deletingId.value = planId
  isDeleteOpen.value = true
}

function confirmDelete() {
  const id = deletingId.value
  if (id == null) return

  plans.value = plans.value.filter(p => p.id !== id)

  if (defaultPlanId.value === id) {
    const next = plans.value.find(p => !p.archived)
    if (next) defaultPlanId.value = next.id
  }
  if (selectedPlanId.value === id) {
    selectedPlanId.value = plans.value.find(p => !p.archived)?.id ?? plans.value[0]?.id ?? null
  }

  toast.add({ title: 'Plan deleted', color: 'success', icon: 'i-lucide-trash-2' })
  isDeleteOpen.value = false
  deletingId.value = null
}

/** =========================
 * Create / Edit modal + form
 * ========================= */
const isModalOpen = ref(false)
const editingId = ref<number | null>(null)
const isSaving = ref(false)

const schema = yup.object({
  name: yup.string().required('Plan name is required'),
  description: yup.string().max(160, 'Max 160 chars').default(''),
  price: yup.number().min(0, 'Price must be >= 0').required('Price is required'),
  interval: yup.mixed<Interval>().oneOf(['month', 'year']).required(),
  color: yup.mixed<UiColor>().oneOf(['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral']).required(),
  popular: yup.boolean().required(),
  archived: yup.boolean().required(),
  customers: yup.number().min(0).required(),
  features: yup.array().of(yup.string().trim().min(1)).min(1, 'Add at least 1 feature').required()
})
type FormShape = yup.InferType<typeof schema>

const form = reactive<FormShape>({
  name: '',
  description: '',
  price: 0,
  interval: 'month',
  color: 'neutral',
  popular: false,
  archived: false,
  customers: 0,
  features: []
})

function openCreate() {
  editingId.value = null
  Object.assign(form, {
    name: '',
    description: '',
    price: 0,
    interval: 'month',
    color: 'neutral',
    popular: false,
    archived: false,
    customers: 0,
    features: []
  })
  isModalOpen.value = true
}

function openEdit(planId: number) {
  const p = plans.value.find(x => x.id === planId)
  if (!p) return
  editingId.value = planId

  Object.assign(form, {
    name: p.name,
    description: p.description,
    price: p.price,
    interval: p.interval,
    color: p.color,
    popular: p.popular,
    archived: p.archived,
    customers: p.customers || 0,
    features: [...(p.features || [])] // ✅ fixed
  })

  isModalOpen.value = true
}

async function onSubmit(e: FormSubmitEvent<FormShape>) {
  isSaving.value = true
  try {
    const payload = e.data

    if (editingId.value != null) {
      const idx = plans.value.findIndex(p => p.id === editingId.value)
      if (idx !== -1) {
        plans.value[idx] = {
          ...plans.value[idx], // ✅ fixed
          name: payload.name,
          description: payload.description ?? '',
          price: Number(payload.price) || 0,
          interval: payload.interval,
          color: payload.color,
          popular: payload.popular,
          archived: payload.archived,
          customers: Number(payload.customers) || 0,
          features: payload.features ?? [],
          updatedAt: nowIso()
        }
      }
      toast.add({ title: 'Plan updated', color: 'success', icon: 'i-lucide-circle-check' })
    } else {
      const nextId = plans.value.length ? Math.max(...plans.value.map(p => p.id)) + 1 : 1
      plans.value.unshift({
        id: nextId,
        name: payload.name,
        description: payload.description ?? '',
        price: Number(payload.price) || 0,
        interval: payload.interval,
        color: payload.color,
        popular: payload.popular,
        archived: payload.archived,
        customers: Number(payload.customers) || 0,
        features: payload.features ?? [],
        updatedAt: nowIso()
      })
      toast.add({ title: 'Plan created', color: 'success', icon: 'i-lucide-plus' })
    }

    isModalOpen.value = false
    editingId.value = null
  } finally {
    isSaving.value = false
  }
}

/** =========================
 * Customer preview (pricing calc)
 * ========================= */
const previewCandidates = computed(() => {
  // preview should not include archived, unless user explicitly filters archived on list;
  // in preview we hide archived but show badge if selected is archived
  return plans.value.filter(p => !p.archived)
})

const previewSelectedPlanId = ref<number | null>(selectedPlanId.value)
watch(selectedPlanId, (id) => {
  if (id != null) previewSelectedPlanId.value = id
})

const previewSelectedPlan = computed<Plan | null>(() => {
  const id = previewSelectedPlanId.value
  if (id == null) return null
  return plans.value.find(p => p.id === id) ?? null
})

const perSeatMultiplier = computed(() => {
  // simple complexity: seat pricing curve (volume discount)
  const s = seatCount.value
  if (s <= 10) return 1
  if (s <= 25) return 0.92
  if (s <= 50) return 0.85
  return 0.8
})

const previewSubtotal = computed(() => {
  const p = previewSelectedPlan.value
  if (!p) return 0
  const base = viewPrice(p)
  return base * seatCount.value * perSeatMultiplier.value
})

const previewDiscount = computed(() => previewSubtotal.value * (discountPct.value / 100))
const previewTax = computed(() => (includeTax.value ? (previewSubtotal.value - previewDiscount.value) * (taxRate.value / 100) : 0))
const previewTotal = computed(() => previewSubtotal.value - previewDiscount.value + previewTax.value)

/** =========================
 * Bulk dropdown items
 * ========================= */
const bulkItems = computed<DropdownMenuItem[][]>(() => [
  [
    { label: `Selected: ${selectedIds.value.size}`, type: 'label' }
  ],
  [
    { label: 'Archive selected', icon: 'i-lucide-archive', onSelect: bulkArchive, disabled: selectedIds.value.size === 0 },
    { label: 'Restore selected', icon: 'i-lucide-rotate-ccw', onSelect: bulkRestore, disabled: selectedIds.value.size === 0 }
  ],
  [
    { label: 'Clear selection', icon: 'i-lucide-x', onSelect: clearSelection, disabled: selectedIds.value.size === 0 }
  ]
])

/** =========================
 * UI lists
 * ========================= */
const sortItems = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Name', value: 'name' },
  { label: 'Price', value: 'price' },
  { label: 'Customers', value: 'customers' },
  { label: 'Updated', value: 'updatedAt' }
]
const statusItems = [
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
  { label: 'All', value: 'all' }
]
const intervalItems = [
  { label: 'All', value: 'all' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' }
]
const currencyItems = [
  { label: 'USD', value: 'USD' },
  { label: 'IDR', value: 'IDR' },
  { label: 'EUR', value: 'EUR' }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-1">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Subscription plans</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Manage your tiers and preview customer pricing with real-world simulation.
          </p>

          <div class="flex flex-wrap items-center gap-2 pt-2">
            <UBadge color="neutral" variant="soft" size="xs">Total: <span class="ml-1 font-semibold">{{ stats.total }}</span></UBadge>
            <UBadge color="success" variant="soft" size="xs">Active: <span class="ml-1 font-semibold">{{ stats.active }}</span></UBadge>
            <UBadge color="warning" variant="soft" size="xs">Archived: <span class="ml-1 font-semibold">{{ stats.archived }}</span></UBadge>
            <UBadge color="info" variant="soft" size="xs">Popular: <span class="ml-1 font-semibold">{{ stats.popular }}</span></UBadge>
          </div>
        </div>

        <!-- Global controls -->
        <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
          <UInput v-model="query" icon="i-lucide-search" placeholder="Search plans…" size="sm" class="w-full sm:w-64" />

          <USelectMenu
            v-model="statusFilter"
            :items="statusItems"
            value-key="value"
            label-key="label"
            size="sm"
            color="neutral"
            variant="outline"
            class="w-full sm:w-32"
          />

          <USelectMenu
            v-model="intervalFilter"
            :items="intervalItems"
            value-key="value"
            label-key="label"
            size="sm"
            color="neutral"
            variant="outline"
            class="w-full sm:w-28"
          />

          <USelectMenu
            v-model="sortKey"
            :items="sortItems"
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
            variant="outline"
            :icon="sortDir === 'desc' ? 'i-lucide-arrow-down' : 'i-lucide-arrow-up'"
            @click="sortDir = sortDir === 'desc' ? 'asc' : 'desc'"
            aria-label="Toggle sort direction"
          />

          <USelectMenu
            v-model="currency"
            :items="currencyItems"
            value-key="value"
            label-key="label"
            size="sm"
            color="neutral"
            variant="outline"
            class="w-full sm:w-24"
          />

          <div class="flex items-center rounded-full border border-gray-200 dark:border-gray-800 p-1 bg-white/70 dark:bg-gray-900/40">
            <UButton size="xs" :variant="billingPeriod === 'monthly' ? 'solid' : 'ghost'" color="neutral" class="px-3 rounded-full" @click="billingPeriod = 'monthly'">
              Monthly
            </UButton>
            <UButton size="xs" :variant="billingPeriod === 'yearly' ? 'solid' : 'ghost'" color="neutral" class="px-3 rounded-full" @click="billingPeriod = 'yearly'">
              Yearly
            </UButton>
          </div>

          <UButton icon="i-lucide-plus" color="primary" size="sm" class="justify-center" @click="openCreate">
            New plan
          </UButton>
        </div>
      </div>

      <!-- Tabs: List + Customer preview only -->
      <UTabs v-model="activeTab" :items="tabs" class="w-full">
        <template #content="{ item }">
          <!-- LIST -->
          <div v-if="item.value === 'list'" class="space-y-4">
            <!-- Bulk bar -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Showing
                <span class="font-semibold text-gray-900 dark:text-white">{{ paginatedRows.length }}</span>
                of
                <span class="font-semibold text-gray-900 dark:text-white">{{ tableRowsAll.length }}</span>
                results • Page
                <span class="font-semibold text-gray-900 dark:text-white">{{ page }}</span>
                /
                <span class="font-semibold text-gray-900 dark:text-white">{{ totalPages }}</span>
              </div>

              <div class="flex items-center gap-2">
                <UDropdownMenu :items="bulkItems" :content="{ align: 'end' }">
                  <UButton
                    size="sm"
                    color="neutral"
                    variant="outline"
                    icon="i-lucide-layers"
                    :disabled="selectedIds.size === 0"
                  >
                    Bulk actions
                  </UButton>
                </UDropdownMenu>

                <USelectMenu
                  v-model="pageSize"
                  :items="[10, 15, 25].map(v => ({ label: `${v}/page`, value: v }))"
                  value-key="value"
                  label-key="label"
                  size="sm"
                  color="neutral"
                  variant="outline"
                  class="w-28"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Table -->
              <UCard class="lg:col-span-2" :ui="{ body: 'p-0' }">
                <template #header>
                  <div class="p-5 flex items-start justify-between gap-3">
                    <div>
                      <h3 class="text-base font-semibold text-gray-900 dark:text-white">Plan list</h3>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Select a plan to see details and manage quickly.</p>
                    </div>
                    <UBadge color="neutral" variant="soft" size="xs">{{ tableRowsAll.length }} results</UBadge>
                  </div>
                </template>

                <div class="px-5 pb-5">
                  <div class="rounded-2xl overflow-hidden ring-1 ring-gray-200/70 dark:ring-gray-800/60">
                    <UTable
                      :data="paginatedRows"
                      :columns="columns"
                      :ui="{
                        thead: 'bg-white dark:bg-gray-900/60',
                        th: 'text-xs font-semibold text-gray-600 dark:text-gray-300',
                        tr: 'group hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors',
                        td: 'py-4'
                      }"
                      :empty-state="{ icon: 'i-lucide-inbox', label: 'No plans found.' }"
                    />
                  </div>

                  <div v-if="tableRowsAll.length === 0" class="py-14 text-center">
                    <div class="mx-auto w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <UIcon name="i-lucide-layers" class="w-6 h-6 text-gray-500" />
                    </div>
                    <div class="mt-3 font-semibold text-gray-900 dark:text-white">No plans found</div>
                    <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">Try another search or create a new plan.</div>
                    <div class="mt-5">
                      <UButton color="primary" @click="openCreate">Create plan</UButton>
                    </div>
                  </div>

                  <!-- Pagination -->
                  <div v-if="tableRowsAll.length > 0" class="mt-4 flex items-center justify-between gap-3">
                    <UButton
                      size="sm"
                      color="neutral"
                      variant="outline"
                      icon="i-lucide-chevron-left"
                      :disabled="page <= 1"
                      @click="page = Math.max(1, page - 1)"
                    >
                      Prev
                    </UButton>

                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      Page <span class="font-semibold text-gray-900 dark:text-white">{{ page }}</span> of
                      <span class="font-semibold text-gray-900 dark:text-white">{{ totalPages }}</span>
                    </div>

                    <UButton
                      size="sm"
                      color="neutral"
                      variant="outline"
                      trailing-icon="i-lucide-chevron-right"
                      :disabled="page >= totalPages"
                      @click="page = Math.min(totalPages, page + 1)"
                    >
                      Next
                    </UButton>
                  </div>
                </div>
              </UCard>

              <!-- Details panel -->
              <UCard>
                <template #header>
                  <div>
                    <h3 class="text-base font-semibold text-gray-900 dark:text-white">Quick details</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">For the currently selected plan</p>
                  </div>
                </template>

                <div v-if="selectedPlan" class="space-y-4">
                  <div class="rounded-2xl ring-1 ring-gray-200/70 dark:ring-gray-800/60 p-4 bg-white/60 dark:bg-gray-900/30">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <div class="flex items-center gap-2 min-w-0">
                          <div class="text-base font-semibold text-gray-900 dark:text-white truncate">{{ selectedPlan.name }}</div>
                          <UBadge v-if="selectedPlan.id === defaultPlanId" color="primary" variant="soft" size="xs">Default</UBadge>
                          <UBadge v-if="selectedPlan.popular && !selectedPlan.archived" color="success" variant="soft" size="xs">Popular</UBadge>
                          <UBadge v-if="selectedPlan.archived" color="neutral" variant="soft" size="xs">Archived</UBadge>
                        </div>
                        <div class="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {{ selectedPlan.description || '—' }}
                        </div>
                      </div>
                    </div>

                    <div class="mt-3 grid grid-cols-2 gap-3">
                      <div class="rounded-xl p-3 bg-gray-50 dark:bg-gray-900/40">
                        <div class="text-xs text-gray-500 dark:text-gray-400">Price</div>
                        <div class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                          {{ formatMoney(viewPrice(selectedPlan), currency) }} {{ viewCycleLabel() }}
                        </div>
                      </div>
                      <div class="rounded-xl p-3 bg-gray-50 dark:bg-gray-900/40">
                        <div class="text-xs text-gray-500 dark:text-gray-400">Customers</div>
                        <div class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                          {{ selectedPlan.customers.toLocaleString() }}
                        </div>
                      </div>
                    </div>

                    <div class="mt-4 flex flex-wrap gap-2">
                      <UButton size="sm" color="primary" variant="soft" icon="i-lucide-pencil" @click="openEdit(selectedPlan.id)">Edit</UButton>
                      <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-copy" @click="duplicatePlan(selectedPlan.id)">Duplicate</UButton>
                      <UButton
                        size="sm"
                        color="neutral"
                        variant="outline"
                        icon="i-lucide-star"
                        :disabled="selectedPlan.archived || selectedPlan.id === defaultPlanId"
                        @click="setDefault(selectedPlan.id)"
                      >
                        Set default
                      </UButton>
                      <UButton
                        size="sm"
                        color="neutral"
                        variant="ghost"
                        :icon="selectedPlan.archived ? 'i-lucide-rotate-ccw' : 'i-lucide-archive'"
                        @click="toggleArchive(selectedPlan.id)"
                      >
                        {{ selectedPlan.archived ? 'Restore' : 'Archive' }}
                      </UButton>
                    </div>
                  </div>

                  <div class="rounded-2xl p-4 ring-1 ring-gray-200/70 dark:ring-gray-800/60">
                    <div class="flex items-center justify-between">
                      <div class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Features</div>
                      <UBadge color="neutral" variant="soft" size="xs">{{ selectedPlan.features.length }}</UBadge>
                    </div>

                    <ul class="mt-3 space-y-2">
                      <li v-for="(f, i) in selectedPlan.features.slice(0, 7)" :key="i" class="flex items-start gap-2">
                        <UIcon name="i-lucide-check" class="w-4 h-4 text-primary-500 mt-0.5" />
                        <span class="text-sm text-gray-700 dark:text-gray-200">{{ f }}</span>
                      </li>
                    </ul>

                    <div v-if="selectedPlan.features.length > 7" class="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      +{{ selectedPlan.features.length - 7 }} more…
                    </div>
                  </div>

                  <UButton
                    color="primary"
                    variant="solid"
                    class="w-full rounded-xl"
                    icon="i-lucide-eye"
                    @click="activeTab = 'preview'"
                  >
                    Open customer preview
                  </UButton>
                </div>

                <div v-else class="text-sm text-gray-600 dark:text-gray-400">
                  Select a plan in the table.
                </div>
              </UCard>
            </div>
          </div>

          <!-- CUSTOMER PREVIEW -->
          <div v-else class="space-y-4">
            <UCard>
              <template #header>
                <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                  <div>
                    <h3 class="text-base font-semibold text-gray-900 dark:text-white">Customer preview</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Simulate checkout with seats, coupons, and tax.</p>
                  </div>

                  <div class="flex items-center gap-2">
                    <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-arrow-left" @click="activeTab = 'list'">
                      Back to list
                    </UButton>
                  </div>
                </div>
              </template>

              <!-- Preview controls -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div class="lg:col-span-2 space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <UFormField label="Choose plan">
                      <USelectMenu
                        v-model="previewSelectedPlanId"
                        :items="previewCandidates.map(p => ({ label: p.name, value: p.id }))"
                        value-key="value"
                        label-key="label"
                        color="neutral"
                        variant="outline"
                      />
                    </UFormField>

                    <UFormField label="Seats">
                      <div class="flex items-center gap-3">
                        <UInputNumber v-model="seatCount" :min="1" :max="500" />
                        <div class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          multiplier: <span class="font-semibold text-gray-900 dark:text-white">{{ perSeatMultiplier.toFixed(2) }}x</span>
                        </div>
                      </div>
                    </UFormField>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <UFormField label="Coupon (try LUMO10 / LUMO25)">
                      <UInput v-model="coupon" placeholder="Enter coupon" icon="i-lucide-ticket" />
                    </UFormField>

                    <UFormField label="Tax">
                      <div class="flex items-center gap-3 h-10">
                        <USwitch v-model="includeTax" />
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ includeTax ? `${taxRate}%` : 'Off' }}
                        </div>
                      </div>
                    </UFormField>

                    <UFormField label="Tax rate (%)">
                      <UInputNumber v-model="taxRate" :min="0" :max="50" :disabled="!includeTax" />
                    </UFormField>
                  </div>

                  <!-- Plans grid preview (simple compare feel) -->
                  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <UCard
                      v-for="p in previewCandidates"
                      :key="p.id"
                      class="rounded-2xl"
                      :ui="{ body: 'space-y-4' }"
                    >
                      <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                          <div class="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {{ p.name }}
                          </div>
                          <div class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {{ p.description || (p.popular ? 'Great for growing teams.' : 'A solid starting point.') }}
                          </div>
                        </div>

                        <div class="flex items-center gap-2">
                          <UBadge v-if="p.id === defaultPlanId" color="primary" variant="soft" size="xs">Default</UBadge>
                          <UBadge v-else-if="p.popular" :color="p.color" variant="subtle" size="xs">Best value</UBadge>
                        </div>
                      </div>

                      <div class="flex items-baseline gap-2">
                        <div class="text-2xl font-bold text-gray-900 dark:text-white">
                          {{ formatMoney(viewPrice(p), currency) }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ viewCycleLabel() }}</div>
                      </div>

                      <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                        <li v-for="(f, i) in p.features.slice(0, 4)" :key="i" class="flex gap-2">
                          <UIcon name="i-lucide-check" class="size-4 mt-0.5 text-primary" />
                          <span class="line-clamp-1">{{ f }}</span>
                        </li>
                      </ul>

                      <UButton
                        :variant="previewSelectedPlanId === p.id ? 'solid' : 'soft'"
                        :color="previewSelectedPlanId === p.id ? 'primary' : 'neutral'"
                        class="w-full rounded-xl"
                        :icon="previewSelectedPlanId === p.id ? 'i-lucide-check-circle' : 'i-lucide-mouse-pointer-click'"
                        @click="previewSelectedPlanId = p.id"
                      >
                        {{ previewSelectedPlanId === p.id ? 'Selected' : 'Select plan' }}
                      </UButton>
                    </UCard>
                  </div>
                </div>

                <!-- Checkout summary -->
                <UCard class="rounded-2xl">
                  <template #header>
                    <div>
                      <h4 class="text-base font-semibold text-gray-900 dark:text-white">Checkout summary</h4>
                      <p class="text-xs text-gray-500 dark:text-gray-400">What the customer will pay.</p>
                    </div>
                  </template>

                  <div class="space-y-4">
                    <div class="rounded-2xl p-4 ring-1 ring-gray-200/70 dark:ring-gray-800/60 bg-white/60 dark:bg-gray-900/30">
                      <div class="text-xs text-gray-500 dark:text-gray-400">Plan</div>
                      <div class="mt-1 font-semibold text-gray-900 dark:text-white">
                        {{ previewSelectedPlan?.name || '—' }}
                      </div>
                      <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {{ seatCount }} seats • {{ billingPeriod }} • {{ currency }}
                      </div>
                    </div>

                    <div class="space-y-2 text-sm">
                      <div class="flex items-center justify-between">
                        <span class="text-gray-600 dark:text-gray-300">Subtotal</span>
                        <span class="font-semibold text-gray-900 dark:text-white">{{ formatMoney(previewSubtotal, currency) }}</span>
                      </div>

                      <div class="flex items-center justify-between" v-if="discountPct">
                        <span class="text-gray-600 dark:text-gray-300">Discount ({{ discountPct }}%)</span>
                        <span class="font-semibold text-gray-900 dark:text-white">-{{ formatMoney(previewDiscount, currency) }}</span>
                      </div>

                      <div class="flex items-center justify-between" v-if="includeTax">
                        <span class="text-gray-600 dark:text-gray-300">Tax ({{ taxRate }}%)</span>
                        <span class="font-semibold text-gray-900 dark:text-white">{{ formatMoney(previewTax, currency) }}</span>
                      </div>

                      <div class="pt-3 mt-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <span class="text-gray-600 dark:text-gray-300">Total</span>
                        <span class="text-xl font-bold text-gray-900 dark:text-white">{{ formatMoney(previewTotal, currency) }}</span>
                      </div>
                    </div>

                    <UButton color="primary" class="w-full rounded-xl" icon="i-lucide-credit-card" :disabled="!previewSelectedPlan">
                      Continue to payment
                    </UButton>

                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      Tip: volume discount applies automatically (seat multiplier: <span class="font-semibold text-gray-900 dark:text-white">{{ perSeatMultiplier.toFixed(2) }}x</span>)
                    </div>
                  </div>
                </UCard>
              </div>
            </UCard>
          </div>
        </template>
      </UTabs>

      <!-- Create/Edit Modal -->
      <UModal v-model:open="isModalOpen" :ui="{ content: 'sm:max-w-2xl' }">
        <template #header>
          <div class="space-y-1">
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ editingId ? 'Edit plan' : 'Create new plan' }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Update pricing, interval, features, and metrics.</div>
          </div>
        </template>

        <template #body>
          <UForm id="plan-form" :schema="schema" :state="form" class="space-y-4" @submit="onSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Plan name" name="name" required>
                <UInput v-model="form.name" placeholder="e.g. Starter, Pro, Enterprise" icon="i-lucide-tag" />
              </UFormField>

              <UFormField label="Price (stored by interval below)" name="price" required>
                <UInputNumber v-model="form.price" :min="0" :step="1" />
              </UFormField>
            </div>

            <UFormField label="Description" name="description">
              <UTextarea v-model="form.description" :rows="2" placeholder="Short description shown under the plan title." />
            </UFormField>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UFormField label="Billing interval" name="interval" required>
                <USelectMenu
                  v-model="form.interval"
                  :items="[
                    { label: 'Monthly', value: 'month' },
                    { label: 'Yearly', value: 'year' }
                  ]"
                  value-key="value"
                  label-key="label"
                />
              </UFormField>

              <UFormField label="Accent color" name="color" required>
                <USelectMenu
                  v-model="form.color"
                  :items="[
                    { label: 'Neutral', value: 'neutral' },
                    { label: 'Primary', value: 'primary' },
                    { label: 'Success', value: 'success' },
                    { label: 'Info', value: 'info' },
                    { label: 'Warning', value: 'warning' },
                    { label: 'Error', value: 'error' },
                    { label: 'Secondary', value: 'secondary' }
                  ]"
                  value-key="value"
                  label-key="label"
                />
              </UFormField>

              <UFormField label="Customers (metric)" name="customers" required>
                <UInputNumber v-model="form.customers" :min="0" :step="1" />
              </UFormField>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Popular" name="popular">
                <div class="h-10 flex items-center">
                  <USwitch v-model="form.popular" />
                </div>
              </UFormField>

              <UFormField label="Archived" name="archived">
                <div class="h-10 flex items-center">
                  <USwitch v-model="form.archived" />
                </div>
              </UFormField>
            </div>

            <UFormField label="Features" name="features" required>
              <UInputTags v-model="form.features" placeholder="Type and press Enter…" />
            </UFormField>
          </UForm>
        </template>

        <template #footer>
          <div class="flex items-center justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="isModalOpen = false">Cancel</UButton>
            <UButton color="primary" :loading="isSaving" type="submit" form="plan-form">Save</UButton>
          </div>
        </template>
      </UModal>

      <!-- Delete confirm modal -->
      <UModal v-model:open="isDeleteOpen" :ui="{ content: 'sm:max-w-md' }">
        <template #header>
          <div class="text-lg font-semibold text-gray-900 dark:text-white">Delete plan?</div>
        </template>
        <template #body>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            You’re about to delete
            <span class="font-semibold text-gray-900 dark:text-white">{{ deletingName || 'this plan' }}</span>.
            This action cannot be undone.
          </div>
        </template>
        <template #footer>
          <div class="flex items-center justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="isDeleteOpen = false">Cancel</UButton>
            <UButton color="error" @click="confirmDelete">Delete</UButton>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>
