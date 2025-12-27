<script setup lang="ts">
import { ref, h, resolveComponent } from 'vue'
import BaseDataTable from '../../components/common/BaseDataTable.vue'

const UBadge = resolveComponent('UBadge')

// Stats Data
const stats = [
  { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', trend: 'up', icon: 'i-heroicons-currency-dollar' },
  { label: 'Subscriptions', value: '+2350', change: '+180.1%', trend: 'up', icon: 'i-heroicons-users' },
  { label: 'Active Sessions', value: '+12,234', change: '+19%', trend: 'up', icon: 'i-heroicons-chart-bar' },
  { label: 'Bounce Rate', value: '24.57%', change: '-3.2%', trend: 'down', icon: 'i-heroicons-arrow-trending-down' } // down is good for bounce rate? Let's assume neutral color logic handles it.
]

// Transactions Data
const transactions = ref([
    { id: 'INV001', date: '2025-05-01', customer: 'Spotify', amount: '$4,500.00', status: 'Paid' },
    { id: 'INV002', date: '2025-05-02', customer: 'Netflix', amount: '$12,000.00', status: 'Paid' },
    { id: 'INV003', date: '2025-05-03', customer: 'Amazon', amount: '$3,200.00', status: 'Pending' },
    { id: 'INV004', date: '2025-05-04', customer: 'Google', amount: '$8,000.00', status: 'Paid' },
    { id: 'INV005', date: '2025-05-05', customer: 'Microsoft', amount: '$5,400.00', status: 'Failed' },
])

const columns = [
  { accessorKey: 'id', header: 'Invoice' },
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'amount', header: 'Amount' },
  { 
    accessorKey: 'status', 
    header: 'Status',
    cell: ({ row }: any) => {
      const status = row.getValue('status') as string
      const color = status === 'Paid' ? 'green' : status === 'Pending' ? 'orange' : 'red'
      return h(UBadge, { color, variant: 'subtle' }, () => status)
    }
  }
]
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard v-for="(stat, index) in stats" :key="index" class="p-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                     <UIcon :name="stat.icon" class="w-6 h-6 text-primary-500" />
                </div>
                <div>
                     <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ stat.label }}</p>
                     <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
                </div>
            </div>
            <div :class="stat.trend === 'up' ? 'text-green-500' : 'text-red-500'" class="flex items-center text-sm font-medium">
                {{ stat.change }}
                <UIcon :name="stat.trend === 'up' ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'" class="w-4 h-4 ml-1" />
            </div>
        </div>
      </UCard>
    </div>

    <!-- Chart Placeholder -->
    <UCard>
        <template #header>
            <h3 class="text-base font-semibold">Revenue Overview</h3>
        </template>
        <div class="h-64 flex items-end justify-between gap-2 px-4 pb-4">
             <!-- Simulated CSS Bar Chart -->
             <div v-for="i in 12" :key="i" 
                  class="w-full bg-primary-100 dark:bg-primary-900/20 rounded-t-sm hover:bg-primary-500 transition-colors relative group"
                  :style="{ height: `${Math.random() * 80 + 20}%` }">
                  <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ${{ Math.floor(Math.random() * 10000) }}
                  </div>
             </div>
        </div>
    </UCard>

    <!-- Recent Transactions -->
    <BaseDataTable
       title="Recent Transactions"
       :data="transactions"
       :columns="columns"
       search-placeholder="Search invoices..."
    />
  </div>
</template>
