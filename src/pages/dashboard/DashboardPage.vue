<template>
  <div class="space-y-6 p-6">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Analytics</h1>
        <p class="text-gray-600 dark:text-gray-400">Kelola dan pantau data bisnis Anda secara real-time</p>
      </div>
      <div class="flex gap-2">
        <UButton 
          icon="i-heroicons-arrow-path" 
          color="gray" 
          variant="outline"
          @click="refreshData"
        >
          Refresh
        </UButton>
        <UButton 
          icon="i-heroicons-calendar" 
          color="gray" 
          variant="outline"
          @click="isDatePickerOpen = true"
        >
          {{ selectedDateRange }}
        </UButton>
      </div>
    </div>

    <!-- Key Metrics Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <UCard class="" >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue YTD</h3>
            <UBadge color="green">{{ revenueGrowth }}%</UBadge>
          </div>
        </template>
        <div class="space-y-2">
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            ${{ (totalRevenueYTD).toLocaleString() }}
          </p>
          <div class="flex items-center gap-2 text-sm">
            <UIcon name="i-heroicons-arrow-trending-up" class="w-4 h-4 text-green-500" />
            <span class="text-green-600 dark:text-green-400">↑ ${{ (totalRevenueYTD * 0.12).toLocaleString() }} this month</span>
          </div>
        </div>
      </UCard>

      <UCard class="" >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Profit</h3>
            <UBadge color="blue">+5.1%</UBadge>
          </div>
        </template>
        <div class="space-y-2">
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            ${{ (totalProfitYTD).toLocaleString() }}
          </p>
          <div class="flex items-center gap-2 text-sm">
            <UIcon name="i-heroicons-chart-bar" class="w-4 h-4 text-blue-500" />
            <span class="text-blue-600 dark:text-blue-400">Margin: 34.2%</span>
          </div>
        </div>
      </UCard>

      <UCard class="" >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</h3>
            <UBadge color="purple">{{ activeUsersGrowth }}%</UBadge>
          </div>
        </template>
        <div class="space-y-2">
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ (totalUsers).toLocaleString() }}
          </p>
          <div class="flex items-center gap-2 text-sm">
            <UIcon name="i-heroicons-user-group" class="w-4 h-4 text-purple-500" />
            <span class="text-purple-600 dark:text-purple-400">+{{ newUsersThisMonth }} new this month</span>
          </div>
        </div>
      </UCard>

      <UCard class="" >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">MRR</h3>
            <UBadge color="amber">{{ mrrGrowth }}%</UBadge>
          </div>
        </template>
        <div class="space-y-2">
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            ${{ (latestMRR).toLocaleString() }}
          </p>
          <div class="flex items-center gap-2 text-sm">
            <UIcon name="i-heroicons-currency-dollar" class="w-4 h-4 text-amber-500" />
            <span class="text-amber-600 dark:text-amber-400">Monthly Recurring</span>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Charts Section -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Revenue Chart -->
      <UCard >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h3>
            <USelectMenu 
              v-model="selectedChartPeriod" 
              :options="chartPeriods" 
              size="sm"
              color="gray"
            />
          </div>
        </template>
        <div class="h-64 flex items-end gap-2">
          <div 
            v-for="(bar, idx) in revenueBars" 
            :key="idx"
            class="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div 
              class="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:opacity-80 hover:shadow-lg"
              :style="{ height: bar.height }"
              @mouseenter="hoveredBar = idx"
              @mouseleave="hoveredBar = null"
            >
              <div v-if="hoveredBar === idx" class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                ${{ bar.value }}
              </div>
            </div>
            <span class="text-xs text-gray-600 dark:text-gray-400 text-center">{{ bar.label }}</span>
          </div>
        </div>
      </UCard>

      <!-- MRR & Churn Chart -->
      <UCard >
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">MRR vs Churn Rate</h3>
        </template>
        <div class="space-y-4">
          <div class="flex items-end gap-2 h-40">
            <div 
              v-for="(bar, idx) in mrrBars" 
              :key="`mrr-${idx}`"
              class="flex-1 flex flex-col items-center"
            >
              <div 
                class="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all hover:opacity-80"
                :style="{ height: bar.height }"
              />
              <span class="text-xs text-gray-600 dark:text-gray-400 mt-2">{{ bar.label }}</span>
            </div>
          </div>
          <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Churn Rate</p>
                <p class="text-2xl font-bold text-red-600">{{ latestChurn }}%</p>
              </div>
              <UBadge color="red" variant="soft">Declining ↓</UBadge>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Detailed Tables Section -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Recent Invoices -->
      <UCard >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Invoices</h3>
            <UButton variant="ghost" color="gray" size="sm" @click="isInvoiceModalOpen = true">
              View All →
            </UButton>
          </div>
        </template>
        <UTable 
          :data="recentInvoices"
          :columns="invoiceColumns"
          :ui="{ td: { base: 'py-3 px-4' }, th: { base: 'py-3 px-4' } }"
        >
          <template #status-data="{ row }">
            <UBadge :color="getStatusColor(row.status)" variant="soft">
              {{ row.status }}
            </UBadge>
          </template>
          <template #amount-data="{ row }">
            <span class="font-semibold text-gray-900 dark:text-white">${{ row.amount.toLocaleString() }}</span>
          </template>
          <template #actions-data="{ row }">
            <UDropdown :items="[
              [{ label: 'View', icon: 'i-heroicons-eye' }],
              [{ label: 'Download', icon: 'i-heroicons-arrow-down-tray' }]
            ]">
              <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-vertical-20-solid" />
            </UDropdown>
          </template>
        </UTable>
      </UCard>

      <!-- Top Products -->
      <UCard >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Top Products</h3>
            <UButton variant="ghost" color="gray" size="sm" @click="isProductModalOpen = true">
              View All →
            </UButton>
          </div>
        </template>
        <div class="space-y-4">
          <div 
            v-for="product in topProducts" 
            :key="product.id"
            class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white">{{ product.name }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ product.sales }} sales</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-900 dark:text-white">${{ product.revenue.toLocaleString() }}</p>
              <UBadge color="green" variant="subtle">{{ product.growth }}%</UBadge>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Additional Metrics -->
    <div class="grid gap-4 md:grid-cols-3">
      <UCard >
        <template #header>
          <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</h3>
        </template>
        <div class="space-y-2">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">3.24%</p>
          <UProgress :value="32.4" />
        </div>
      </UCard>

      <UCard >
        <template #header>
          <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">ARPU</h3>
        </template>
        <div class="space-y-2">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ latestARPU.toFixed(2) }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">+0.3% from last month</p>
        </div>
      </UCard>

      <UCard >
        <template #header>
          <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Methods</h3>
        </template>
        <div class="space-y-2">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalPaymentMethods }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Linked accounts</p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Data
const totalRevenueYTD = ref(127450)
const totalProfitYTD = ref(43543)
const latestMRR = ref(12450)
const latestChurn = ref(2.3)
const latestARPU = ref(156.25)
const totalInvoices = ref(248)
const totalPaymentMethods = ref(5)
const totalUsers = ref(1243)
const revenueGrowth = ref(12)
const activeUsersGrowth = ref(8.2)
const mrrGrowth = ref(5.3)
const newUsersThisMonth = ref(127)

// UI State
const isDatePickerOpen = ref(false)
const isInvoiceModalOpen = ref(false)
const isProductModalOpen = ref(false)
const hoveredBar = ref<number | null>(null)
const selectedChartPeriod = ref('6M')
const selectedDateRange = ref('Last 30 days')

const chartPeriods = ['1M', '3M', '6M', '1Y']

// Revenue data
const revenueData = [
  { month: 'Jan', revenue: 12500 },
  { month: 'Feb', revenue: 14200 },
  { month: 'Mar', revenue: 13800 },
  { month: 'Apr', revenue: 16900 },
  { month: 'May', revenue: 18200 },
  { month: 'Jun', revenue: 19500 }
]

const revenueMax = computed(() => Math.max(...revenueData.map(d => d.revenue)))
const revenueBars = computed(() => 
  revenueData.map(d => ({
    label: d.month,
    height: `${(d.revenue / revenueMax.value) * 100}%`,
    value: d.revenue.toLocaleString()
  }))
)

// MRR data
const mrrData = [
  { month: 'Jan', mrr: 8200 },
  { month: 'Feb', mrr: 8900 },
  { month: 'Mar', mrr: 9200 },
  { month: 'Apr', mrr: 10100 },
  { month: 'May', mrr: 11200 },
  { month: 'Jun', mrr: 12450 }
]

const mrrMax = computed(() => Math.max(...mrrData.map(d => d.mrr)))
const mrrBars = computed(() => 
  mrrData.map(d => ({
    label: d.month,
    height: `${(d.mrr / mrrMax.value) * 100}%`
  }))
)

// Invoice columns
const invoiceColumns = [
  { key: 'id', id: 'id', label: 'Invoice ID', sortable: true },
  { key: 'customer', id: 'customer', label: 'Customer', sortable: true },
  { key: 'amount', id: 'amount', label: 'Amount', sortable: true },
  { key: 'status', id: 'status', label: 'Status' },
  { key: 'date', id: 'date', label: 'Date', sortable: true },
  { key: 'actions', id: 'actions', label: 'Actions' }
]

// Recent invoices
const recentInvoices = [
  { id: 'INV-001', customer: 'Acme Corp', amount: 5200, status: 'Paid', date: '2024-01-15' },
  { id: 'INV-002', customer: 'Tech Solutions', amount: 3800, status: 'Pending', date: '2024-01-14' },
  { id: 'INV-003', customer: 'Global Industries', amount: 7500, status: 'Paid', date: '2024-01-13' },
  { id: 'INV-004', customer: 'Innovation Labs', amount: 2900, status: 'Overdue', date: '2024-01-12' },
  { id: 'INV-005', customer: 'Enterprise Inc', amount: 6300, status: 'Paid', date: '2024-01-11' }
]

// Top products
const topProducts = [
  { id: 1, name: 'Premium Plan', sales: 342, revenue: 51300, growth: 12.5 },
  { id: 2, name: 'Pro Package', sales: 198, revenue: 29700, growth: 8.2 },
  { id: 3, name: 'Starter Pack', sales: 1205, revenue: 24100, growth: 15.3 }
]

// Helper functions
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Paid': 'green',
    'Pending': 'yellow',
    'Overdue': 'red',
    'Draft': 'gray'
  }
  return colors[status] || 'gray'
}

const refreshData = () => {
  console.log('Data refreshed')
}
</script>