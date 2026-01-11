<script setup lang="ts">
import { computed, h, ref, resolveComponent, watch } from 'vue'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import { useClipboard } from '@vueuse/core'
import { invoices as initialInvoices } from '@/data/billing'

/** Nuxt UI resolved components for h() */
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const { copy } = useClipboard()

/** Types (adjust if your mock differs) */
type InvoiceStatus = 'Paid' | 'Pending' | 'Refunded' | 'Failed' | 'Overdue'
type Invoice = {
  id: string
  date: string // string date (e.g. 2025-11-15) or readable
  amount: string | number // "$120.00" or 120
  status: InvoiceStatus | string
  customer?: string
  email?: string
}

/** Data */
const invoices = ref<Invoice[]>(
  (Array.isArray(initialInvoices) ? initialInvoices : []).map((x: any) => ({
    ...x,
    id: String(x.id),
    status: String(x.status || 'Pending')
  }))
)

/** Helpers */
function statusTone(status: string) {
  const s = status.toLowerCase()
  if (s === 'paid') return { color: 'success' as const, icon: 'i-lucide-check-circle' }
  if (s === 'refunded') return { color: 'warning' as const, icon: 'i-lucide-rotate-ccw' }
  if (s === 'failed') return { color: 'error' as const, icon: 'i-lucide-x-circle' }
  if (s === 'overdue') return { color: 'error' as const, icon: 'i-lucide-alert-triangle' }
  return { color: 'neutral' as const, icon: 'i-lucide-clock' } // pending
}

function formatDate(input: string) {
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return input
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

function formatAmount(v: string | number) {
  if (typeof v === 'string') return v
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
}

/** Toolbar state */
const query = ref('')
const statusFilter = ref<'all' | 'Paid' | 'Pending' | 'Refunded' | 'Failed' | 'Overdue'>('all')
const sortKey = ref<'date' | 'amount' | 'status'>('date')
const sortDir = ref<'asc' | 'desc'>('desc')

/** Pagination */
const page = ref(1)
const pageSize = ref(10)

watch([query, statusFilter, sortKey, sortDir, pageSize], () => (page.value = 1))

/** Derived */
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  let rows = [...invoices.value]

  if (statusFilter.value !== 'all') rows = rows.filter((i) => i.status === statusFilter.value)

  if (q) {
    rows = rows.filter((i) => {
      const hay = `${i.id} ${i.status} ${i.date} ${i.amount} ${i.customer || ''} ${i.email || ''}`.toLowerCase()
      return hay.includes(q)
    })
  }

  const dir = sortDir.value === 'asc' ? 1 : -1
  rows.sort((a, b) => {
    if (sortKey.value === 'date') {
      const ad = new Date(a.date).getTime()
      const bd = new Date(b.date).getTime()
      return dir * ((ad || 0) - (bd || 0))
    }
    if (sortKey.value === 'amount') {
      const an = typeof a.amount === 'number' ? a.amount : Number(String(a.amount).replace(/[^0-9.-]/g, '')) || 0
      const bn = typeof b.amount === 'number' ? b.amount : Number(String(b.amount).replace(/[^0-9.-]/g, '')) || 0
      return dir * (an - bn)
    }
    // status
    return dir * String(a.status).localeCompare(String(b.status))
  })

  return rows
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
const paginated = computed(() => {
  const p = Math.max(1, Math.min(page.value, totalPages.value))
  const start = (p - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

const stats = computed(() => {
  const all = invoices.value.length
  const paid = invoices.value.filter((x) => String(x.status).toLowerCase() === 'paid').length
  const pending = invoices.value.filter((x) => String(x.status).toLowerCase() === 'pending').length
  const refunded = invoices.value.filter((x) => String(x.status).toLowerCase() === 'refunded').length
  return { all, paid, pending, refunded }
})

/** Actions */
function exportCsv() {
  // mock export (client-side)
  const rows = filtered.value
  const header = ['id', 'date', 'amount', 'status']
  const csv = [
    header.join(','),
    ...rows.map((r) => [r.id, r.date, String(r.amount).replace(/,/g, ''), r.status].join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `invoices-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)

  toast.add({ title: 'Exported CSV', color: 'success', icon: 'i-lucide-download' })
}

function viewInvoice(id: string) {
  toast.add({ title: 'View invoice', description: `Open invoice ${id}`, color: 'neutral', icon: 'i-lucide-eye' })
}

function downloadInvoice(id: string) {
  toast.add({ title: 'Download started', description: `Invoice ${id}`, color: 'success', icon: 'i-lucide-download' })
}

function rowMenuItems(row: Invoice): DropdownMenuItem[][] {
  return [
    [{ type: 'label', label: `Invoice ${row.id}` }],
    [
      { label: 'View', icon: 'i-lucide-eye', onSelect: () => viewInvoice(row.id) },
      { label: 'Download PDF', icon: 'i-lucide-download', onSelect: () => downloadInvoice(row.id) }
    ],
    [
      {
        label: 'Copy invoice ID',
        icon: 'i-lucide-copy',
        onSelect: () => {
          copy(row.id)
          toast.add({ title: 'Copied', description: row.id, color: 'success', icon: 'i-lucide-copy' })
        }
      }
    ]
  ]
}

/** Table columns */
const columns = computed<TableColumn<Invoice>[]>(() => [
  {
    accessorKey: 'id',
    header: 'Invoice',
    cell: ({ row }: any) => {
      const id = String(row.original.id)
      return h(
        'div',
        { class: 'min-w-0' },
        h('div', { class: 'font-semibold text-gray-900 dark:text-white truncate' }, `#${id}`)
      )
    }
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }: any) =>
      h('div', { class: 'text-sm text-gray-700 dark:text-gray-200' }, formatDate(String(row.original.date)))
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: ({ row }: any) =>
      h('div', { class: 'text-right font-semibold text-gray-900 dark:text-white tabular-nums' }, formatAmount(row.original.amount))
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const s = String(row.original.status)
      const tone = statusTone(s)
      return h(
        UBadge as any,
        { color: tone.color, variant: 'soft', size: 'xs', class: 'gap-1' },
        () => [h(resolveComponent('UIcon') as any, { name: tone.icon, class: 'size-3.5' }), s]
      )
    }
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-right' }, ''),
    cell: ({ row }: any) =>
      h(
        'div',
        { class: 'flex justify-end' },
        h(
          UDropdownMenu as any,
          { items: rowMenuItems(row.original), content: { align: 'end' } },
          () =>
            h(UButton as any, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              size: 'sm',
              'aria-label': 'Invoice actions'
            })
        )
      )
  }
])
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <div class=" px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Invoices</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Search, filter, and download invoices. Export is available for reporting.
          </p>

          <div class="flex flex-wrap items-center gap-2 pt-2">
            <UBadge color="neutral" variant="soft" size="xs">All: <span class="ml-1 font-semibold">{{ stats.all }}</span></UBadge>
            <UBadge color="success" variant="soft" size="xs">Paid: <span class="ml-1 font-semibold">{{ stats.paid }}</span></UBadge>
            <UBadge color="neutral" variant="soft" size="xs">Pending: <span class="ml-1 font-semibold">{{ stats.pending }}</span></UBadge>
            <UBadge color="warning" variant="soft" size="xs">Refunded: <span class="ml-1 font-semibold">{{ stats.refunded }}</span></UBadge>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-download" @click="exportCsv">
            Export CSV
          </UButton>
          <UButton size="sm" color="primary" icon="i-lucide-credit-card" to="/billing/payment-methods">
            Payment methods
          </UButton>
        </div>
      </div>

      <!-- Controls -->
      <UCard class="rounded-2xl" :ui="{ body: 'p-4' }">
        <div class="flex flex-col lg:flex-row lg:items-center gap-3">
          <UInput
            v-model="query"
            size="sm"
            icon="i-lucide-search"
            placeholder="Search by invoice id, status, date, amount…"
            class="w-full lg:w-96"
          />

          <USelectMenu
            v-model="statusFilter"
            size="sm"
            color="neutral"
            variant="outline"
            class="w-full sm:w-48"
            :items="[
              { label: 'All statuses', value: 'all' },
              { label: 'Paid', value: 'Paid' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Refunded', value: 'Refunded' },
              { label: 'Failed', value: 'Failed' },
              { label: 'Overdue', value: 'Overdue' }
            ]"
            value-key="value"
            label-key="label"
          />

          <USelectMenu
            v-model="sortKey"
            size="sm"
            color="neutral"
            variant="outline"
            class="w-full sm:w-44"
            :items="[
              { label: 'Sort: Date', value: 'date' },
              { label: 'Sort: Amount', value: 'amount' },
              { label: 'Sort: Status', value: 'status' }
            ]"
            value-key="value"
            label-key="label"
          />

          <UButton
            size="sm"
            color="neutral"
            variant="outline"
            :icon="sortDir === 'desc' ? 'i-lucide-arrow-down' : 'i-lucide-arrow-up'"
            aria-label="Toggle sort direction"
            @click="sortDir = sortDir === 'desc' ? 'asc' : 'desc'"
          />

          <div class="flex-1" />

          <USelectMenu
            v-model="pageSize"
            size="sm"
            color="neutral"
            variant="outline"
            class="w-full sm:w-32"
            :items="[10, 15, 25].map(v => ({ label: `${v}/page`, value: v }))"
            value-key="value"
            label-key="label"
          />
        </div>

        <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Showing <span class="font-semibold text-gray-900 dark:text-white">{{ paginated.length }}</span>
          of <span class="font-semibold text-gray-900 dark:text-white">{{ filtered.length }}</span> results •
          Page <span class="font-semibold text-gray-900 dark:text-white">{{ page }}</span> /
          <span class="font-semibold text-gray-900 dark:text-white">{{ totalPages }}</span>
        </div>
      </UCard>

      <!-- Table -->
      <UCard class="rounded-2xl" :ui="{ body: 'p-0' }">
        <div class="overflow-hidden rounded-2xl ring-1 ring-gray-200/70 dark:ring-gray-800/60">
          <UTable
            :data="paginated"
            :columns="columns"
            :ui="{
              thead: 'bg-white dark:bg-gray-950',
              th: 'text-xs font-semibold text-gray-600 dark:text-gray-300',
              tr: 'hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors',
              td: 'py-4 align-middle'
            }"
            :empty-state="{ icon: 'i-lucide-inbox', label: 'No invoices found.' }"
          />
        </div>

        <!-- Pagination -->
        <div class="p-4 flex items-center justify-between gap-3">
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
            Page <span class="font-semibold text-gray-900 dark:text-white">{{ page }}</span>
            of <span class="font-semibold text-gray-900 dark:text-white">{{ totalPages }}</span>
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
      </UCard>
    </div>
  </div>
</template>
