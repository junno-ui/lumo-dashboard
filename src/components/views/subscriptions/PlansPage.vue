<script setup lang="ts">
import { computed, reactive, ref, h, resolveComponent, watch } from 'vue'
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import { plans as initialPlans } from '@/mock/subscriptions'

type Interval = 'month' | 'year'
type Currency = 'USD' | 'IDR' | 'EUR'

type Plan = {
  id: number
  name: string
  price: number
  interval: Interval
  features: string[]
  popular: boolean
  color?: string
  active: boolean
}

const toast = useToast()

/** Nuxt UI resolved components (for table cells) */
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

/** Helpers */
function parsePrice(price: string | number) {
  if (typeof price === 'number') return price
  const n = Number(String(price).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function formatMoney(n: number, currency: Currency) {
  const locale = currency === 'IDR' ? 'id-ID' : 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(Math.round(n))
}

function nextId(list: { id: number }[]) {
  return list.length ? Math.max(...list.map(i => i.id)) + 1 : 1
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function planTone(p: Plan) {
  if (!p.active) return { badgeColor: 'neutral' as const, badgeText: 'Disabled' }
  if (p.popular) return { badgeColor: 'success' as const, badgeText: 'Popular' }
  return { badgeColor: 'neutral' as const, badgeText: 'Active' }
}

/** State */
const currency = ref<Currency>('USD')
const billingView = ref<'monthly' | 'yearly'>('monthly')

const viewMode = ref<'cards' | 'table'>('cards')

const plans = ref<Plan[]>(
  (initialPlans || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    price: parsePrice(p.price),
    interval: p.interval as Interval,
    features: Array.isArray(p.features) ? p.features : [],
    popular: !!p.popular,
    color: p.color,
    active: true
  }))
)

const query = ref('')
const status = ref<'all' | 'active' | 'disabled'>('all')
const sortKey = ref<'recommended' | 'name' | 'price'>('recommended')
const sortDir = ref<'asc' | 'desc'>('desc')

/** Pagination (for table) */
const page = ref(1)
const pageSize = ref(10)
watch([query, status, sortKey, sortDir, pageSize], () => (page.value = 1))

/** Pricing view */
function viewPrice(p: Plan) {
  const monthlyEq = p.interval === 'year' ? p.price / 12 : p.price
  return billingView.value === 'monthly' ? monthlyEq : monthlyEq * 12
}
function viewCycleLabel() {
  return billingView.value === 'monthly' ? '/month' : '/year'
}

/** Derived */
const stats = computed(() => {
  const total = plans.value.length
  const active = plans.value.filter(p => p.active).length
  const disabled = total - active
  const popular = plans.value.filter(p => p.active && p.popular).length
  return { total, active, disabled, popular }
})

const filteredPlans = computed(() => {
  const q = query.value.trim().toLowerCase()
  let rows = [...plans.value]

  if (status.value === 'active') rows = rows.filter(p => p.active)
  if (status.value === 'disabled') rows = rows.filter(p => !p.active)

  if (q) {
    rows = rows.filter(p => {
      const hay = `${p.name} ${p.features.join(' ')}`.toLowerCase()
      return hay.includes(q)
    })
  }

  const dir = sortDir.value === 'asc' ? 1 : -1
  if (sortKey.value === 'recommended') {
    rows.sort((a, b) => {
      const aScore = (a.popular ? 100 : 0) + (a.active ? 10 : -1000) + a.price
      const bScore = (b.popular ? 100 : 0) + (b.active ? 10 : -1000) + b.price
      return dir === 1 ? aScore - bScore : bScore - aScore
    })
  } else if (sortKey.value === 'name') {
    rows.sort((a, b) => dir * a.name.localeCompare(b.name))
  } else {
    rows.sort((a, b) => dir * (viewPrice(a) - viewPrice(b)))
  }

  return rows
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPlans.value.length / pageSize.value)))
const paginatedPlans = computed(() => {
  const p = clamp(page.value, 1, totalPages.value)
  const start = (p - 1) * pageSize.value
  return filteredPlans.value.slice(start, start + pageSize.value)
})

/** Actions */
function toggleActive(id: number) {
  const idx = plans.value.findIndex(x => x.id === id)
  if (idx === -1) return
  const plan = plans.value[idx]
  if (!plan) return
  plan.active = !plan.active
  toast.add({ title: plan.active ? 'Plan enabled' : 'Plan disabled', color: 'neutral' })
}
function togglePopular(id: number) {
  const idx = plans.value.findIndex(x => x.id === id)
  if (idx === -1) return
  const plan = plans.value[idx]
  if (!plan) return
  plan.popular = !plan.popular
  toast.add({ title: plan.popular ? 'Marked as Popular' : 'Removed Popular', color: 'neutral' })
}

function duplicatePlan(id: number) {
  const p = plans.value.find(x => x.id === id)
  if (!p) return
  const copied = JSON.parse(JSON.stringify(p))
  copied.id = nextId(plans.value)
  copied.name = `${p.name} (Copy)`
  plans.value.unshift(copied)
  toast.add({ title: 'Plan duplicated', color: 'success', icon: 'i-lucide-copy' })
}

/** Menus */
function planMenuItems(id: number): DropdownMenuItem[][] {
  const p = plans.value.find(x => x.id === id)
  const isActive = !!p?.active
  const isPopular = !!p?.popular
  return [
    [
      { label: 'View details', icon: 'i-lucide-eye', onSelect: () => openDetails(id) },
      { label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => openEdit(id) }
    ],
    [
      { label: isPopular ? 'Unmark Popular' : 'Mark Popular', icon: 'i-lucide-sparkles', onSelect: () => togglePopular(id) },
      { label: isActive ? 'Disable' : 'Enable', icon: isActive ? 'i-lucide-eye-off' : 'i-lucide-eye', onSelect: () => toggleActive(id) }
    ],
    [{ label: 'Duplicate', icon: 'i-lucide-copy', onSelect: () => duplicatePlan(id) }]
  ]
}

/** Table */
type PlanRow = {
  id: number
  name: string
  price: string
  status: 'Active' | 'Disabled'
  popular: boolean
  featuresCount: number
  interval: Interval
}

const tableData = computed<PlanRow[]>(() =>
  paginatedPlans.value.map(p => ({
    id: p.id,
    name: p.name,
    price: `${formatMoney(viewPrice(p), currency.value)} ${viewCycleLabel()}`,
    status: p.active ? 'Active' : 'Disabled',
    popular: p.popular,
    featuresCount: p.features.length,
    interval: p.interval
  }))
)

const columns: TableColumn<PlanRow>[] = [
  {
    accessorKey: 'name',
    header: 'Plan',
    cell: ({ row }) => {
      const p = plans.value.find(x => x.id === row.original.id)
      const tone = p ? planTone(p) : { badgeColor: 'neutral' as const, badgeText: '—' }
      return h('button', { class: 'text-left w-full', onClick: () => openDetails(row.original.id) }, [
        h('div', { class: 'flex items-center gap-2 min-w-0' }, [
          h('div', { class: 'font-medium text-gray-900 dark:text-white truncate' }, row.original.name),
          h(UBadge as any, { color: tone.badgeColor, variant: 'soft', size: 'xs' }, () => tone.badgeText),
          row.original.popular
            ? h(UBadge as any, { color: 'success', variant: 'soft', size: 'xs' }, () => 'Best value')
            : null
        ]),
        h('div', { class: 'text-xs text-gray-500 dark:text-gray-400 mt-1' }, `${row.original.featuresCount} features`)
      ])
    }
  },
  { accessorKey: 'price', header: 'Price', meta: { class: { th: 'w-56' } } },
  {
    accessorKey: 'interval',
    header: 'Stored',
    meta: { class: { th: 'w-28' } },
    cell: ({ row }) => h('div', { class: 'text-sm text-gray-700 dark:text-gray-200' }, row.original.interval === 'month' ? 'Monthly' : 'Yearly')
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: { class: { th: 'w-32' } },
    cell: ({ row }) =>
      h(
        UBadge as any,
        { color: row.original.status === 'Active' ? 'success' : 'neutral', variant: 'soft', size: 'xs' },
        () => row.original.status
      )
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

/** Details modal */
const detailsOpen = ref(false)
const detailsId = ref<number | null>(null)
const detailsPlan = computed(() => plans.value.find(p => p.id === detailsId.value) ?? null)

function openDetails(id: number) {
  detailsId.value = id
  detailsOpen.value = true
}

/** Create/Edit modal (simple) */
const modalOpen = ref(false)
const editingId = ref<number | null>(null)
const draft = reactive<Plan>({
  id: 0,
  name: '',
  price: 0,
  interval: 'month',
  features: [],
  popular: false,
  color: 'gray',
  active: true
})

const modalTitle = computed(() => (editingId.value ? 'Edit plan' : 'Create plan'))
const modalDesc = computed(() => (editingId.value ? 'Update plan name, pricing, and features.' : 'Create a new subscription tier.'))

function openCreate() {
  editingId.value = null
  Object.assign(draft, { id: 0, name: '', price: 0, interval: 'month', features: [], popular: false, color: 'gray', active: true })
  modalOpen.value = true
}

function openEdit(id: number) {
  const p = plans.value.find(x => x.id === id)
  if (!p) return
  editingId.value = id
  Object.assign(draft, JSON.parse(JSON.stringify(p)))
  modalOpen.value = true
}

function save(close?: () => void) {
  if (!draft.name.trim()) return toast.add({ title: 'Plan name is required', color: 'warning' })
  if (draft.price < 0) return toast.add({ title: 'Price must be >= 0', color: 'warning' })
  if (!draft.features.length) return toast.add({ title: 'Add at least 1 feature', color: 'warning' })

  if (editingId.value) {
    const idx = plans.value.findIndex(x => x.id === editingId.value)
    if (idx !== -1) plans.value[idx] = { ...plans.value[idx], ...JSON.parse(JSON.stringify(draft)) }
    toast.add({ title: 'Plan updated', color: 'success', icon: 'i-lucide-circle-check' })
  } else {
    plans.value.unshift({ ...JSON.parse(JSON.stringify(draft)), id: nextId(plans.value) })
    toast.add({ title: 'Plan created', color: 'success', icon: 'i-lucide-plus' })
  }

  modalOpen.value = false
  editingId.value = null
  close?.()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class=" px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      <!-- Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Plans</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Create, edit, and maintain your subscription tiers. Keep it simple and conversion-friendly.
          </p>

          <div class="flex flex-wrap gap-2 pt-2">
            <UBadge color="neutral" variant="soft" size="xs">Total: <span class="ml-1 font-semibold">{{ stats.total }}</span></UBadge>
            <UBadge color="success" variant="soft" size="xs">Active: <span class="ml-1 font-semibold">{{ stats.active }}</span></UBadge>
            <UBadge color="neutral" variant="soft" size="xs">Disabled: <span class="ml-1 font-semibold">{{ stats.disabled }}</span></UBadge>
            <UBadge color="success" variant="soft" size="xs">Popular: <span class="ml-1 font-semibold">{{ stats.popular }}</span></UBadge>
          </div>
        </div>

        <div class="flex flex-col sm:items-end gap-2">
          <div class="flex items-center gap-2">
            <USelectMenu
              v-model="currency"
              :items="[
                { label: 'USD', value: 'USD' },
                { label: 'IDR', value: 'IDR' },
                { label: 'EUR', value: 'EUR' }
              ]"
              value-key="value"
              label-key="label"
              size="sm"
              color="neutral"
              variant="outline"
              class="w-28"
            />

            <div class="flex items-center rounded-full border border-gray-200 dark:border-gray-800 p-1 bg-white/70 dark:bg-gray-900/40">
              <UButton size="xs" :variant="billingView === 'monthly' ? 'solid' : 'ghost'" color="neutral" class="px-3 rounded-full" @click="billingView = 'monthly'">
                Monthly
              </UButton>
              <UButton size="xs" :variant="billingView === 'yearly' ? 'solid' : 'ghost'" color="neutral" class="px-3 rounded-full" @click="billingView = 'yearly'">
                Yearly
              </UButton>
            </div>

            <UButton color="primary" icon="i-lucide-plus" @click="openCreate">New plan</UButton>
          </div>

          <div class="flex items-center gap-2">
            <UButton
              size="sm"
              color="neutral"
              variant="outline"
              :icon="viewMode === 'cards' ? 'i-lucide-layout-grid' : 'i-lucide-table'"
              @click="viewMode = viewMode === 'cards' ? 'table' : 'cards'"
            >
              {{ viewMode === 'cards' ? 'Cards' : 'Table' }}
            </UButton>
          </div>
        </div>
      </div>

      <!-- Toolbar -->
      <UCard class="rounded-2xl" :ui="{ body: 'p-4' }">
        <div class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div class="flex flex-col sm:flex-row gap-2 sm:items-center w-full">
            <UInput v-model="query" icon="i-lucide-search" placeholder="Search plan name or features…" class="w-full sm:w-80" />

            <USelectMenu
              v-model="status"
              :items="[
                { label: 'All', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Disabled', value: 'disabled' }
              ]"
              value-key="value"
              label-key="label"
              size="sm"
              color="neutral"
              variant="outline"
              class="w-full sm:w-40"
            />

            <USelectMenu
              v-model="sortKey"
              :items="[
                { label: 'Recommended', value: 'recommended' },
                { label: 'Name', value: 'name' },
                { label: 'Price', value: 'price' }
              ]"
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
          </div>

          <div class="text-xs text-gray-500 dark:text-gray-400">
            Showing <span class="font-semibold text-gray-900 dark:text-white">{{ filteredPlans.length }}</span> result(s)
          </div>
        </div>
      </UCard>

      <!-- Empty state -->
      <UCard v-if="!filteredPlans.length" class="rounded-2xl" :ui="{ body: 'p-8' }">
        <div class="text-center space-y-3">
          <UIcon name="i-lucide-inbox" class="size-8 mx-auto text-gray-400" />
          <div class="text-base font-semibold text-gray-900 dark:text-white">No plans found</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Try changing filters or create a new plan.</div>
          <div class="flex justify-center gap-2">
            <UButton color="neutral" variant="outline" @click="query = ''; status = 'all'">Reset filters</UButton>
            <UButton color="primary" icon="i-lucide-plus" @click="openCreate">Create plan</UButton>
          </div>
        </div>
      </UCard>

      <!-- CARDS VIEW -->
      <div v-else-if="viewMode === 'cards'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <UCard v-for="p in filteredPlans" :key="p.id" class="rounded-2xl" :ui="{ body: 'p-4 space-y-4' }">
          <div class="flex items-start justify-between gap-3">
            <button class="min-w-0 text-left" @click="openDetails(p.id)">
              <div class="flex items-center gap-2">
                <div class="text-base font-semibold text-gray-900 dark:text-white truncate">{{ p.name }}</div>
                <UBadge :color="planTone(p).badgeColor" variant="soft" size="xs">{{ planTone(p).badgeText }}</UBadge>
                <UBadge v-if="p.popular && p.active" color="success" variant="soft" size="xs">Best value</UBadge>
              </div>
              <div class="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                {{ p.features?.[0] ? `Includes: ${p.features[0]}` : 'Add features to clarify benefits.' }}
              </div>
            </button>

            <UDropdownMenu :items="planMenuItems(p.id)" :content="{ align: 'end' }">
              <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="sm" aria-label="Plan menu" />
            </UDropdownMenu>
          </div>

          <div class="flex items-baseline gap-2">
            <div class="text-2xl font-semibold text-gray-900 dark:text-white">{{ formatMoney(viewPrice(p), currency) }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ viewCycleLabel() }}</div>
          </div>

          <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/30 p-3">
            <div class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-2">Top features</div>
            <ul class="space-y-2">
              <li v-for="(f, i) in p.features.slice(0, 4)" :key="i" class="flex gap-2 text-sm text-gray-700 dark:text-gray-200">
                <UIcon name="i-lucide-check" class="size-4 mt-0.5 text-primary" />
                <span class="line-clamp-1">{{ f }}</span>
              </li>
              <li v-if="p.features.length > 4" class="text-xs text-gray-500 dark:text-gray-400">
                +{{ p.features.length - 4 }} more…
              </li>
            </ul>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <UButton color="neutral" variant="outline" icon="i-lucide-pencil" @click="openEdit(p.id)">Edit</UButton>
            <UButton color="primary" icon="i-lucide-eye" @click="openDetails(p.id)">Preview</UButton>
          </div>

          <div class="pt-1 text-xs text-gray-500 dark:text-gray-400">
            Stored: <span class="font-semibold text-gray-900 dark:text-white">{{ p.interval === 'month' ? 'Monthly' : 'Yearly' }}</span>
            <span class="mx-2">•</span>
            Tips: keep 3–6 features max for readability.
          </div>
        </UCard>
      </div>

      <!-- TABLE VIEW -->
      <UCard v-else class="rounded-2xl" :ui="{ body: 'p-0' }">
        <template #header>
          <div class="p-4 flex items-center justify-between">
            <div>
              <div class="text-sm font-semibold text-gray-900 dark:text-white">Plan table</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Use table mode for fast scanning & actions.</div>
            </div>

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
        </template>

        <div class="p-4 pt-0">
          <div class="rounded-xl overflow-hidden ring-1 ring-gray-200/70 dark:ring-gray-800/60">
            <UTable
              :data="tableData"
              :columns="columns"
              :ui="{
                thead: 'bg-white dark:bg-gray-900/60',
                th: 'text-xs font-semibold text-gray-600 dark:text-gray-300',
                tr: 'hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors',
                td: 'py-4'
              }"
            />
          </div>

          <div class="mt-4 flex items-center justify-between gap-3">
            <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-chevron-left" :disabled="page <= 1" @click="page = Math.max(1, page - 1)">
              Prev
            </UButton>

            <div class="text-xs text-gray-500 dark:text-gray-400">
              Page <span class="font-semibold text-gray-900 dark:text-white">{{ page }}</span> of
              <span class="font-semibold text-gray-900 dark:text-white">{{ totalPages }}</span>
            </div>

            <UButton size="sm" color="neutral" variant="outline" trailing-icon="i-lucide-chevron-right" :disabled="page >= totalPages" @click="page = Math.min(totalPages, page + 1)">
              Next
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- DETAILS MODAL -->
      <UModal v-model:open="detailsOpen" title="Plan preview" description="Customer-facing preview + quick admin actions." :ui="{ content: 'sm:max-w-3xl' }">
        <template #body>
          <div v-if="detailsPlan" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2 rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/30 p-4">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <div class="text-lg font-semibold text-gray-900 dark:text-white truncate">{{ detailsPlan.name }}</div>
                    <UBadge :color="planTone(detailsPlan).badgeColor" variant="soft" size="xs">{{ planTone(detailsPlan).badgeText }}</UBadge>
                    <UBadge v-if="detailsPlan.popular && detailsPlan.active" color="success" variant="soft" size="xs">Best value</UBadge>
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Keep features benefit-driven and consistent across tiers.
                  </div>
                </div>
              </div>

              <div class="mt-4 flex items-baseline gap-2">
                <div class="text-3xl font-semibold text-gray-900 dark:text-white">
                  {{ formatMoney(viewPrice(detailsPlan), currency) }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ viewCycleLabel() }}</div>
              </div>

              <div class="mt-4">
                <div class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-2">Included</div>
                <ul class="space-y-2">
                  <li v-for="(f, i) in detailsPlan.features" :key="i" class="flex gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <UIcon name="i-lucide-check" class="size-4 mt-0.5 text-primary" />
                    <span>{{ f }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/30 p-4 space-y-3">
              <div class="text-sm font-semibold text-gray-900 dark:text-white">Quick actions</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                These actions affect the storefront display.
              </div>

              <div class="space-y-2">
                <UButton class="w-full" color="primary" icon="i-lucide-pencil" @click="openEdit(detailsPlan.id)">
                  Edit plan
                </UButton>

                <UButton class="w-full" color="neutral" variant="outline" icon="i-lucide-sparkles" @click="togglePopular(detailsPlan.id)">
                  {{ detailsPlan.popular ? 'Unmark Popular' : 'Mark Popular' }}
                </UButton>

                <UButton class="w-full" color="neutral" variant="outline" :icon="detailsPlan.active ? 'i-lucide-eye-off' : 'i-lucide-eye'" @click="toggleActive(detailsPlan.id)">
                  {{ detailsPlan.active ? 'Disable plan' : 'Enable plan' }}
                </UButton>

                <UButton class="w-full" color="neutral" variant="outline" icon="i-lucide-copy" @click="duplicatePlan(detailsPlan.id)">
                  Duplicate
                </UButton>
              </div>

              <div class="pt-2 text-xs text-gray-500 dark:text-gray-400">
                Tip: keep exactly <span class="font-semibold text-gray-900 dark:text-white">one</span> plan marked as Popular.
              </div>
            </div>
          </div>

          <div v-else class="text-sm text-gray-500 dark:text-gray-400">No plan selected.</div>
        </template>

        <template #footer="{ close }">
          <div class="flex justify-end gap-2 w-full">
            <UButton color="neutral" variant="outline" @click="close()">Close</UButton>
          </div>
        </template>
      </UModal>

      <!-- CREATE/EDIT MODAL -->
      <UModal v-model:open="modalOpen" :title="modalTitle" :description="modalDesc" :ui="{ content: 'sm:max-w-2xl' }">
        <template #body>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <UFormField label="Plan name" required>
              <UInput v-model="draft.name" placeholder="Starter / Pro / Enterprise" icon="i-lucide-tag" />
            </UFormField>

            <UFormField :label="`Price (${currency})`" required>
              <UInputNumber v-model="draft.price" :min="0" :step="1" />
            </UFormField>

            <UFormField label="Stored billing interval" required help="This is how the plan is stored. View toggle only affects display.">
              <USelectMenu
                v-model="draft.interval"
                :items="[
                  { label: 'Monthly', value: 'month' },
                  { label: 'Yearly', value: 'year' }
                ]"
                value-key="value"
                label-key="label"
                color="neutral"
                variant="outline"
              />
            </UFormField>

            <UFormField label="Popular (Best value)">
              <div class="h-10 flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 px-3 bg-white/60 dark:bg-gray-900/30">
                <div class="text-sm text-gray-700 dark:text-gray-200">Highlight this plan</div>
                <USwitch v-model="draft.popular" />
              </div>
            </UFormField>

            <div class="sm:col-span-2">
              <UFormField label="Features" required help="Type and press Enter. Keep it short: 3–6 items is ideal.">
                <UInputTags v-model="draft.features" placeholder="Unlimited projects" />
              </UFormField>
            </div>

            <div class="sm:col-span-2">
              <UFormField label="Active">
                <div class="h-10 flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 px-3 bg-white/60 dark:bg-gray-900/30">
                  <div class="text-sm text-gray-700 dark:text-gray-200">Visible on storefront</div>
                  <USwitch v-model="draft.active" />
                </div>
              </UFormField>
            </div>

            <div class="sm:col-span-2 rounded-xl border border-gray-200/70 dark:border-gray-800/60 p-3 bg-gray-50/60 dark:bg-gray-900/30">
              <div class="text-xs text-gray-500 dark:text-gray-400">Preview</div>
              <div class="mt-1 flex items-baseline justify-between gap-2">
                <div class="min-w-0">
                  <div class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ draft.name || 'Plan name' }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ draft.features?.[0] ? `Includes: ${draft.features[0]}` : 'Add features to clarify value.' }}
                  </div>
                </div>
                <div class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatMoney(viewPrice(draft), currency) }}
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ viewCycleLabel() }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #footer="{ close }">
          <div class="flex justify-end gap-2 w-full">
            <UButton color="neutral" variant="outline" @click="close()">Cancel</UButton>
            <UButton color="primary" icon="i-lucide-save" @click="save(close)">Save</UButton>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>
