<script setup lang="ts">
import { computed, h, ref, resolveComponent, watch } from 'vue'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import { useClipboard } from '@vueuse/core'
import { invoices as initialInvoices } from '@/modules/billing/data/billing'
import PageHeader from '@/shared/components/page/PageHeader.vue'
import BaseDataTable from '@/shared/components/data-table/BaseDataTable.vue'
import TableActionsDropdown from '@/shared/components/data-table/TableActionsDropdown.vue'

const UBadge = resolveComponent('UBadge')
const UIcon = resolveComponent('UIcon')

const toast = useToast()
const { copy } = useClipboard()

type InvoiceStatus = 'Paid' | 'Pending' | 'Refunded' | 'Failed' | 'Overdue'
type Invoice = {
  id: string
  date: string
  amount: string | number
  status: InvoiceStatus | string
  customer?: string
  email?: string
}

const invoices = ref<Invoice[]>(
  (Array.isArray(initialInvoices) ? initialInvoices : []).map((invoice: any) => ({
    ...invoice,
    id: String(invoice.id),
    status: String(invoice.status || 'Pending')
  }))
)

function statusTone(status: string) {
  const normalized = status.toLowerCase()
  if (normalized === 'paid') return { color: 'success' as const, icon: 'i-lucide-check-circle' }
  if (normalized === 'refunded') return { color: 'warning' as const, icon: 'i-lucide-rotate-ccw' }
  if (normalized === 'failed') return { color: 'error' as const, icon: 'i-lucide-x-circle' }
  if (normalized === 'overdue') return { color: 'error' as const, icon: 'i-lucide-alert-triangle' }
  return { color: 'neutral' as const, icon: 'i-lucide-clock-3' }
}

function formatDate(input: string) {
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) return input
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

function formatAmount(value: string | number) {
  if (typeof value === 'string') return value
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

const query = ref('')
const statusFilter = ref<'all' | 'Paid' | 'Pending' | 'Refunded' | 'Failed' | 'Overdue'>('all')
const sortKey = ref<'date' | 'amount' | 'status'>('date')
const sortDir = ref<'asc' | 'desc'>('desc')
const page = ref(1)
const pageSize = ref(10)

watch([query, statusFilter, sortKey, sortDir, pageSize], () => {
  page.value = 1
})

const filtered = computed(() => {
  const search = query.value.trim().toLowerCase()
  let rows = [...invoices.value]

  if (statusFilter.value !== 'all') rows = rows.filter((invoice) => invoice.status === statusFilter.value)

  if (search) {
    rows = rows.filter((invoice) =>
      `${invoice.id} ${invoice.status} ${invoice.date} ${invoice.amount} ${invoice.customer || ''} ${invoice.email || ''}`.toLowerCase().includes(search)
    )
  }

  const dir = sortDir.value === 'asc' ? 1 : -1
  rows.sort((a, b) => {
    if (sortKey.value === 'date') {
      return dir * ((new Date(a.date).getTime() || 0) - (new Date(b.date).getTime() || 0))
    }
    if (sortKey.value === 'amount') {
      const aNumber = typeof a.amount === 'number' ? a.amount : Number(String(a.amount).replace(/[^0-9.-]/g, '')) || 0
      const bNumber = typeof b.amount === 'number' ? b.amount : Number(String(b.amount).replace(/[^0-9.-]/g, '')) || 0
      return dir * (aNumber - bNumber)
    }
    return dir * String(a.status).localeCompare(String(b.status))
  })

  return rows
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
const paginated = computed(() => {
  const currentPage = Math.max(1, Math.min(page.value, totalPages.value))
  const start = (currentPage - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

const stats = computed(() => {
  const all = invoices.value.length
  const paid = invoices.value.filter((invoice) => String(invoice.status).toLowerCase() === 'paid').length
  const pending = invoices.value.filter((invoice) => String(invoice.status).toLowerCase() === 'pending').length
  const refunded = invoices.value.filter((invoice) => String(invoice.status).toLowerCase() === 'refunded').length
  return { all, paid, pending, refunded }
})

const headerMetrics = computed(() => [
  { label: 'All', value: stats.value.all },
  { label: 'Paid', value: stats.value.paid },
  { label: 'Pending', value: stats.value.pending },
  { label: 'Refunded', value: stats.value.refunded }
])

function exportCsv() {
  const rows = filtered.value
  const header = ['id', 'date', 'amount', 'status']
  const csv = [
    header.join(','),
    ...rows.map((row) => [row.id, row.date, String(row.amount).replace(/,/g, ''), row.status].join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `invoices-${new Date().toISOString().slice(0, 10)}.csv`
  anchor.click()
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

const columns = computed<TableColumn<Invoice>[]>(() => [
  {
    accessorKey: 'id',
    header: 'Invoice',
    cell: ({ row }: any) =>
      h('div', { class: 'min-w-0' }, [
        h('div', { class: 'truncate font-medium text-white' }, `#${row.original.id}`),
        h('div', { class: 'truncate text-xs text-zinc-500' }, row.original.customer || 'Subscription payment')
      ])
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }: any) => h('div', { class: 'text-sm text-zinc-400' }, formatDate(String(row.original.date)))
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: ({ row }: any) =>
      h('div', { class: 'text-right font-medium tabular-nums text-white' }, formatAmount(row.original.amount))
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const status = String(row.original.status)
      const tone = statusTone(status)
      return h(
        UBadge as any,
        { color: tone.color, variant: 'soft', size: 'xs', class: 'gap-1' },
        () => [h(UIcon as any, { name: tone.icon, class: 'size-3.5' }), status]
      )
    }
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }: any) =>
      h('div', { class: 'flex justify-end' }, h(TableActionsDropdown, { items: rowMenuItems(row.original), label: 'Invoice actions' }))
  }
])
</script>

<template>
  <div class="page-frame page-stack">
    <PageHeader
      eyebrow="Revenue operations"
      title="Invoices"
      description="Track billing activity in a cleaner finance surface with direct export and focused row actions."
      :metrics="headerMetrics"
    >
      <template #actions>
        <UButton
          size="sm"
          color="neutral"
          variant="outline"
          class="rounded-xl border-white/8 bg-white/[0.03] hover:bg-white/[0.06]"
          icon="i-lucide-download"
          @click="exportCsv"
        >
          Export CSV
        </UButton>

        <UButton
          size="sm"
          color="primary"
          class="rounded-xl bg-white text-black hover:bg-zinc-200"
          icon="i-lucide-credit-card"
          to="/dashboard/billing/payment-methods"
        >
          Payment methods
        </UButton>
      </template>
    </PageHeader>

    <BaseDataTable
      v-model:search="query"
      v-model:page="page"
      v-model:page-size="pageSize"
      title="Invoice ledger"
      description="Review invoices, switch sorting quickly, and trigger export or row actions from one place."
      :data="paginated"
      :columns="columns"
      :total-items="filtered.length"
      :total-pages="totalPages"
      search-placeholder="Search invoice id, status, or amount..."
      :page-size-options="[10, 15, 25].map((value) => ({ label: `${value} / page`, value }))"
      :empty-state="{ icon: 'i-lucide-receipt-text', label: 'No invoices found.', description: 'Try changing the filters or search query.' }"
    >
      <template #filters>
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
          class="rounded-xl border-white/8 bg-white/[0.03] hover:bg-white/[0.06]"
          :icon="sortDir === 'desc' ? 'i-lucide-arrow-down' : 'i-lucide-arrow-up'"
          aria-label="Toggle sort direction"
          @click="sortDir = sortDir === 'desc' ? 'asc' : 'desc'"
        />
      </template>
    </BaseDataTable>
  </div>
</template>
