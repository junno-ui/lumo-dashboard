<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import BaseDataTable from '@/components/common/BaseDataTable.vue'
import { invoices } from '@/mock/billing'
const UBadge = resolveComponent('UBadge')

const columns = [
  { accessorKey: 'id', header: 'Invoice' },
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'amount', header: 'Amount' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const s = row.getValue('status')
      const color = s === 'Paid' ? 'green' : s === 'Refunded' ? 'yellow' : 'orange'
      return h(UBadge, { color, variant: 'solid', size: 'xs' }, () => s)
    }
  }
]
</script>

<template>
  <div class="p-6">
    <BaseDataTable title="Invoices" :data="invoices" :columns="columns" search-placeholder="Search invoices..." />
  </div>
  </template>