<script setup lang="ts">
import { ref, computed, watch, h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { useClipboard } from '@vueuse/core'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UCheckbox = resolveComponent('UCheckbox')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const { copy } = useClipboard()

type PaymentStatus = 'paid' | 'failed' | 'refunded'

type Payment = {
  id: string
  date: string // ISO string
  status: PaymentStatus
  email: string
  amount: number
}

const payments = ref<Payment[]>([
  { id: '4600', date: '2024-03-11T15:30:00', status: 'paid', email: 'james.anderson@example.com', amount: 594 },
  { id: '4599', date: '2024-03-11T10:10:00', status: 'failed', email: 'mia.white@example.com', amount: 276 },
  { id: '4598', date: '2024-03-11T08:50:00', status: 'refunded', email: 'william.brown@example.com', amount: 315 },
  { id: '4597', date: '2024-03-10T19:45:00', status: 'paid', email: 'emma.davis@example.com', amount: 529 },
  { id: '4596', date: '2024-03-10T15:55:00', status: 'paid', email: 'ethan.harris@example.com', amount: 639 },
  { id: '4595', date: '2024-03-10T13:40:00', status: 'refunded', email: 'ava.thomas@example.com', amount: 428 },
  { id: '4594', date: '2024-03-10T09:15:00', status: 'paid', email: 'michael.wilson@example.com', amount: 683 },
  { id: '4593', date: '2024-03-09T20:25:00', status: 'failed', email: 'olivia.taylor@example.com', amount: 947 },
  { id: '4592', date: '2024-03-09T18:45:00', status: 'paid', email: 'benjamin.jackson@example.com', amount: 851 },
  { id: '4591', date: '2024-03-09T16:05:00', status: 'paid', email: 'sophia.miller@example.com', amount: 762 },
  { id: '4590', date: '2024-03-09T14:20:00', status: 'paid', email: 'noah.clark@example.com', amount: 573 },
  { id: '4589', date: '2024-03-09T11:35:00', status: 'failed', email: 'isabella.lee@example.com', amount: 389 }
])

// IMPORTANT: table ref for tableApi (keep it any to avoid TS friction)
const table = ref<any>(null)

// Table states (Nuxt UI bindings)
const rowSelection = ref<Record<string, boolean>>({})
const columnVisibility = ref<Record<string, boolean>>({})
const sorting = ref([{ id: 'date', desc: true }])
const pagination = ref({ pageIndex: 0, pageSize: 6 })
const globalFilter = ref('')

// Extra filters (we apply via columnFilters)
const columnFilters = ref<any[]>([])
const statusFilter = ref<PaymentStatus | 'all'>('all')
const dateFrom = ref<string>('') // yyyy-mm-dd
const dateTo = ref<string>('')   // yyyy-mm-dd

const selectedCount = computed(() => table.value?.tableApi?.getFilteredSelectedRowModel().rows.length ?? 0)
const visibleCount = computed(() => table.value?.tableApi?.getFilteredRowModel().rows.length ?? 0)

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

function formatMoneyEUR(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(v)
}

function clearSelection() {
  // reset by tableApi (if available) + local model
  table.value?.tableApi?.resetRowSelection?.()
  rowSelection.value = {}
}

function randomize() {
  // FIX: must stay an array (bug in your code was `data.value = [.data.value]`) :contentReference[oaicite:5]{index=5}
  const arr = [...payments.value]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
  payments.value = arr
  pagination.value.pageIndex = 0
  clearSelection()
}

function getRowItems(row: Row<Payment>) {
  return [
    [{ label: 'Actions', type: 'label' }],
    [
      {
        label: 'Copy payment ID',
        icon: 'i-lucide-copy',
        onSelect: () => {
          copy(row.original.id)
          toast.add({ title: 'Copied', description: 'Payment ID copied to clipboard.', color: 'success', icon: 'i-lucide-circle-check' })
        }
      }
    ],
    [{ type: 'separator' }],
    [
      { label: 'View customer', icon: 'i-lucide-user' },
      { label: 'View payment details', icon: 'i-lucide-receipt' }
    ]
  ]
}

// Keep column filters in sync with toolbar filters
watch([statusFilter, dateFrom, dateTo], () => {
  const next: any[] = []

  if (statusFilter.value !== 'all') {
    next.push({ id: 'status', value: statusFilter.value })
  }

  if (dateFrom.value || dateTo.value) {
    next.push({
      id: 'date',
      value: { from: dateFrom.value || null, to: dateTo.value || null }
    })
  }

  columnFilters.value = next
  pagination.value.pageIndex = 0
})

const columns: TableColumn<Payment>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'aria-label': 'Select all rows on page',
        checked: table.getIsAllPageRowsSelected(),
        indeterminate: table.getIsSomePageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value)
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'aria-label': `Select row ${row.original.id}`,
        checked: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value)
      }),
    meta: { class: { th: 'w-10', td: 'w-10' } }
  },
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) =>
      h(
        'div',
        { class: 'flex items-center gap-2' },
        [
          h('span', { class: 'font-medium text-highlighted' }, `#${row.getValue('id')}`),
          h(UButton, {
            icon: 'i-lucide-copy',
            color: 'neutral',
            variant: 'ghost',
            size: 'xs',
            class: 'opacity-0 group-hover:opacity-100 transition-opacity',
            'aria-label': 'Copy payment ID',
            onClick: () => {
              copy(row.original.id)
              toast.add({ title: 'Copied', color: 'success', icon: 'i-lucide-circle-check' })
            }
          })
        ]
      ),
    meta: { class: { td: 'whitespace-nowrap' } }
  },
  {
    accessorKey: 'date',
    header: 'Date',
    // date range filter support
    filterFn: (row, columnId, value: { from: string | null; to: string | null }) => {
      const raw = row.getValue(columnId) as string
      const t = new Date(raw).getTime()

      const fromOk = value?.from ? t >= new Date(`${value.from}T00:00:00`).getTime() : true
      const toOk = value?.to ? t <= new Date(`${value.to}T23:59:59`).getTime() : true
      return fromOk && toOk
    },
    cell: ({ row }) => formatDateTime(row.getValue('date')),
    meta: { class: { td: 'whitespace-nowrap text-muted' } }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const s = row.getValue('status') as PaymentStatus
      const color = ({ paid: 'success', failed: 'error', refunded: 'neutral' } as const)[s]
      const icon = ({ paid: 'i-lucide-circle-check', failed: 'i-lucide-circle-x', refunded: 'i-lucide-rotate-ccw' } as const)[s]

      return h(
        UBadge,
        { class: 'capitalize gap-1', variant: 'subtle', color, icon },
        () => s
      )
    },
    meta: { class: { td: 'whitespace-nowrap' } }
  },
  {
    accessorKey: 'email',
    header: 'Email',
    meta: { class: { td: 'min-w-[260px]' } }
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: ({ row }) => h('div', { class: 'text-right font-medium tabular-nums' }, formatMoneyEUR(Number(row.getValue('amount')))),
    meta: { class: { td: 'whitespace-nowrap' } }
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) =>
      h('div', { class: 'text-right' },
        h(
          UDropdownMenu,
          { items: getRowItems(row), content: { align: 'end' }, 'aria-label': 'Actions menu' },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              'aria-label': 'Actions'
            })
        )
      ),
    meta: { class: { th: 'w-10', td: 'w-10' } }
  }
]

// Column visibility dropdown (keep menu open when toggling)
const columnsMenuItems = computed(() => {
  const api = table.value?.tableApi
  const all = api?.getAllColumns?.() ?? []
  return all
    .filter((c: any) => c.getCanHide?.())
    .map((c: any) => ({
      label: c.id,
      type: 'checkbox',
      checked: c.getIsVisible?.(),
      onUpdateChecked(checked: boolean) {
        c.toggleVisibility?.(checked)
      },
      onSelect(e: Event) {
        e.preventDefault()
      }
    }))
})
</script>

<template>
  <UCard class="w-full" :ui="{ body: 'p-0 sm:p-0' }">
    <!-- Header / Toolbar -->
    <div class="p-4 sm:p-5 border-b border-default">
      <div class="flex flex-col gap-3">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="text-base font-semibold text-highlighted">Transactions</div>
            <div class="text-sm text-muted">
              {{ selectedCount }} selected • {{ visibleCount }} shown
            </div>
          </div>

          <div class="flex items-center gap-2">
            <UButton
              icon="i-lucide-shuffle"
              label="Randomize"
              color="neutral"
              variant="soft"
              @click="randomize"
            />
            <UButton
              v-if="selectedCount"
              icon="i-lucide-x"
              label="Clear selection"
              color="neutral"
              variant="ghost"
              @click="clearSelection"
            />
            <UDropdownMenu :items="[columnsMenuItems]">
              <UButton icon="i-lucide-columns-2" label="Columns" color="neutral" variant="ghost" />
            </UDropdownMenu>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row lg:items-center gap-2">
          <UInput
            v-model="globalFilter"
            icon="i-lucide-search"
            placeholder="Search id, email, status…"
            class="w-full lg:max-w-md"
          />

          <div class="flex flex-wrap items-center gap-2">
            <USelect
              v-model="statusFilter"
              :items="[
                { label: 'All status', value: 'all' },
                { label: 'Paid', value: 'paid' },
                { label: 'Failed', value: 'failed' },
                { label: 'Refunded', value: 'refunded' }
              ]"
              option-attribute="label"
              value-attribute="value"
              class="w-44"
            />

            <div class="flex items-center gap-2">
              <UInput v-model="dateFrom" type="date" class="w-[150px]" />
              <span class="text-sm text-muted">to</span>
              <UInput v-model="dateTo" type="date" class="w-[150px]" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="p-4 sm:p-5">
      <UTable
        ref="table"
        v-model:row-selection="rowSelection"
        v-model:column-visibility="columnVisibility"
        v-model:sorting="sorting"
        v-model:pagination="pagination"
        v-model:global-filter="globalFilter"
        v-model:column-filters="columnFilters"
        :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        :data="payments"
        :columns="columns"
        sticky="header"
        class="w-full"
        :ui="{
          base: 'border border-default rounded-xl overflow-hidden',
          thead: 'bg-default',
          tr: 'group hover:bg-muted/40 transition-colors',
          td: 'align-middle'
        }"
      />
    </div>

    <!-- Footer -->
    <div class="p-4 sm:p-5 border-t border-default flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="text-sm text-muted">
        {{ selectedCount }} of {{ visibleCount }} row(s) selected.
      </div>

      <div class="flex justify-end">
        <UPagination
          :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length || 0"
          @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </div>
  </UCard>
</template>
