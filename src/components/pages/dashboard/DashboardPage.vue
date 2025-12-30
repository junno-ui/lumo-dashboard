<script setup lang="ts">
  import { ref, computed } from 'vue'
  import VueApexCharts from 'vue3-apexcharts'
  import type { ApexOptions } from 'apexcharts'

  // Local component registration for ApexCharts
  const ApexChart = VueApexCharts
  
  // User Data
  const userName = ref('Oripio')
  
  // Date Range
  const selectedDateRange = ref('30d')
  const dateRangeOptions = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'Last 6 months', value: '6m' },
    { label: 'Last year', value: '1y' }
  ]
  
  // Chart Periods
  const mrrChartPeriod = ref('6m')
  const revenueChartPeriod = ref('6m')
  const chartPeriodOptions = [
    { label: '3M', value: '3m' },
    { label: '6M', value: '6m' },
    { label: '1Y', value: '1y' },
    { label: 'All', value: 'all' }
  ]
  
  // Key SaaS Metrics
  const mrr = ref(124500)
  const mrrGrowth = ref(5.3)
  const arr = ref(1494000)
  const arrGrowth = ref(12.5)
  const activeCustomers = ref(3420)
  const newCustomersThisMonth = ref(127)
  const churnRate = ref(2.3)
  const churnRateChange = ref(-0.5)
  
  // Secondary Metrics
  const ltv = ref(12500)
  const cac = ref(850)
  const ltvCacRatio = computed(() => Math.round(ltv.value / cac.value))
  const nrr = ref(108)
  const arpu = ref(156.25)
  const trialConversionRate = ref(24.5)
  
  // Sample Data
  const mrrData = [
    { month: 'Jan', mrr: 82000 },
    { month: 'Feb', mrr: 89000 },
    { month: 'Mar', mrr: 92000 },
    { month: 'Apr', mrr: 101000 },
    { month: 'May', mrr: 112000 },
    { month: 'Jun', mrr: 124500 }
  ]
  
  const revenueExpenseData = [
    { month: 'Jan', revenue: 125000, expenses: 95000 },
    { month: 'Feb', revenue: 142000, expenses: 102000 },
    { month: 'Mar', revenue: 138000, expenses: 98000 },
    { month: 'Apr', revenue: 169000, expenses: 115000 },
    { month: 'May', revenue: 182000, expenses: 125000 },
    { month: 'Jun', revenue: 195000, expenses: 132000 }
  ]
  
  const customerGrowthData = [
    { month: 'Jan', new: 85, churned: 12 },
    { month: 'Feb', new: 92, churned: 15 },
    { month: 'Mar', new: 105, churned: 18 },
    { month: 'Apr', new: 118, churned: 20 },
    { month: 'May', new: 127, churned: 22 },
    { month: 'Jun', new: 135, churned: 25 }
  ]
  
  const planDistributionData = [
    { plan: 'Starter', customers: 1205, revenue: 24100 },
    { plan: 'Professional', customers: 198, revenue: 29700 },
    { plan: 'Enterprise', customers: 342, revenue: 51300 }
  ]
  
  const revenueSourceData = [
    { source: 'Organic', revenue: 45000 },
    { source: 'Paid Ads', revenue: 38000 },
    { source: 'Referrals', revenue: 28000 },
    { source: 'Partnerships', revenue: 13500 }
  ]
  
  const topCustomers = ref([
    { id: 1, name: 'Acme Corporation', plan: 'Enterprise', users: 250, mrr: 12500, status: 'Active' },
    { id: 2, name: 'Tech Solutions Inc', plan: 'Enterprise', users: 180, mrr: 9000, status: 'Active' },
    { id: 3, name: 'Global Industries', plan: 'Professional', users: 95, mrr: 4750, status: 'Active' },
    { id: 4, name: 'Innovation Labs', plan: 'Enterprise', users: 120, mrr: 6000, status: 'Active' },
    { id: 5, name: 'Digital Ventures', plan: 'Professional', users: 75, mrr: 3750, status: 'Active' }
  ])
  
  const recentTransactions = ref([
    { id: 'TXN-001', customer: 'Acme Corp', amount: 12500, status: 'Completed', date: '2 hours ago' },
    { id: 'TXN-002', customer: 'Tech Solutions', amount: 9000, status: 'Completed', date: '5 hours ago' },
    { id: 'TXN-003', customer: 'Global Industries', amount: 4750, status: 'Pending', date: '1 day ago' },
    { id: 'TXN-004', customer: 'Innovation Labs', amount: 6000, status: 'Completed', date: '1 day ago' },
    { id: 'TXN-005', customer: 'Digital Ventures', amount: 3750, status: 'Failed', date: '2 days ago' }
  ])
  
  const recentActivities = ref([
    { id: 1, user: 'John Doe', action: 'upgraded to Enterprise plan', type: 'upgrade', time: '5 minutes ago' },
    { id: 2, user: 'Jane Smith', action: 'completed payment', type: 'payment', time: '15 minutes ago' },
    { id: 3, user: 'Bob Johnson', action: 'started free trial', type: 'trial', time: '1 hour ago' },
    { id: 4, user: 'Alice Williams', action: 'cancelled subscription', type: 'cancel', time: '2 hours ago' },
    { id: 5, user: 'Charlie Brown', action: 'added 10 team members', type: 'team', time: '3 hours ago' }
  ])
  
  const transactionColumns = [
    { accessorKey: 'id', header: 'Transaction ID' },
    { accessorKey: 'customer', header: 'Customer' },
    { accessorKey: 'amount', header: 'Amount' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'date', header: 'Date' }
  ]

  // ApexCharts: series & options
  const mrrChartSeries = ref([
    {
      name: 'MRR',
      data: mrrData.map(d => d.mrr),
    },
  ])

  const mrrChartOptions = ref<ApexOptions>({
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: '#6b7280',
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: mrrData.map(d => d.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `$${(val / 1000).toFixed(0)}k`,
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `$${val.toLocaleString()}`,
      },
    },
    colors: ['#3b82f6'],
  })

  const revenueChartSeries = ref([
    {
      name: 'Revenue',
      data: revenueExpenseData.map(d => d.revenue),
    },
    {
      name: 'Expenses',
      data: revenueExpenseData.map(d => d.expenses),
    },
  ])

  const revenueChartOptions = ref<ApexOptions>({
    chart: {
      type: 'bar',
      stacked: false,
      toolbar: { show: false },
      foreColor: '#6b7280',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: revenueExpenseData.map(d => d.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `$${(val / 1000).toFixed(0)}k`,
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `$${val.toLocaleString()}`,
      },
    },
    colors: ['#22c55e', '#ef4444'],
    legend: {
      position: 'top',
      fontSize: '12px',
    },
    grid: {
      borderColor: 'rgba(148, 163, 184, 0.25)',
      strokeDashArray: 4,
    },
  })

  const customerGrowthSeries = ref([
    {
      name: 'New Customers',
      data: customerGrowthData.map(d => d.new),
    },
    {
      name: 'Churned',
      data: customerGrowthData.map(d => d.churned),
    },
  ])

  const customerGrowthOptions = ref<ApexOptions>({
    chart: {
      type: 'bar',
      toolbar: { show: false },
      foreColor: '#6b7280',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: customerGrowthData.map(d => d.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${val}`,
      },
    },
    colors: ['#22c55e', '#ef4444'],
    legend: {
      position: 'top',
      fontSize: '12px',
    },
    grid: {
      borderColor: 'rgba(148, 163, 184, 0.25)',
      strokeDashArray: 4,
    },
  })

  const planDistributionSeries = ref(planDistributionData.map(d => d.customers))

  const planDistributionOptions = ref<ApexOptions>({
    chart: {
      type: 'donut',
      foreColor: '#6b7280',
    },
    labels: planDistributionData.map(d => d.plan),
    dataLabels: { enabled: false },
    legend: {
      position: 'bottom',
      fontSize: '12px',
    },
    colors: ['#3b82f6', '#a855f7', '#22c55e'],
  })

  const revenueSourceSeries = ref(revenueSourceData.map(d => d.revenue))

  const revenueSourceOptions = ref<ApexOptions>({
    chart: {
      type: 'donut',
      foreColor: '#6b7280',
    },
    labels: revenueSourceData.map(d => d.source),
    dataLabels: { enabled: false },
    legend: {
      position: 'bottom',
      fontSize: '12px',
    },
    colors: ['#3b82f6', '#a855f7', '#22c55e', '#f59e0b'],
  })
  
  // Computed
  const getGreeting = computed(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'morning'
    if (hour < 18) return 'afternoon'
    return 'evening'
  })
  
  // Helper Functions
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }
  
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }
  
  const getTransactionStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Completed': 'green',
      'Pending': 'yellow',
      'Failed': 'red',
      'Refunded': 'gray'
    }
    return colors[status] || 'gray'
  }
  
  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      'upgrade': 'i-heroicons-arrow-trending-up',
      'payment': 'i-heroicons-credit-card',
      'trial': 'i-heroicons-sparkles',
      'cancel': 'i-heroicons-x-circle',
      'team': 'i-heroicons-user-plus'
    }
    return icons[type] || 'i-heroicons-bell'
  }
  
  const getActivityIconBg = (type: string) => {
    const colors: Record<string, string> = {
      'upgrade': 'bg-green-100 dark:bg-green-900/30',
      'payment': 'bg-blue-100 dark:bg-blue-900/30',
      'trial': 'bg-purple-100 dark:bg-purple-900/30',
      'cancel': 'bg-red-100 dark:bg-red-900/30',
      'team': 'bg-amber-100 dark:bg-amber-900/30'
    }
    return colors[type] || 'bg-gray-100 dark:bg-gray-800'
  }
  
  const getActivityIconColor = (type: string) => {
    const colors: Record<string, string> = {
      'upgrade': 'text-green-600 dark:text-green-400',
      'payment': 'text-blue-600 dark:text-blue-400',
      'trial': 'text-purple-600 dark:text-purple-400',
      'cancel': 'text-red-600 dark:text-red-400',
      'team': 'text-amber-600 dark:text-amber-400'
    }
    return colors[type] || 'text-gray-600 dark:text-gray-400'
  }
  

  
  </script>
  

<template>
  <div class="space-y-6 p-6 bg-white dark:bg-gray-900 min-h-screen">
    <!-- Header Section with Date Range Picker -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Good {{ getGreeting }}, {{ userName }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Here's what's happening with your SaaS business today
        </p>
      </div>
      <div class="flex gap-2">
        <USelectMenu 
          v-model="selectedDateRange" 
          :options="dateRangeOptions"
          size="md"
          color="gray"
          variant="outline"
          class="min-w-xl"
        />
      </div>
    </div>

    <!-- Key SaaS Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- MRR Card -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">MRR</span>
            </div>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              ${{ formatCurrency(mrr) }}
            </p>
            <div class="flex items-center gap-1 text-sm">
              <UIcon 
                :name="mrrGrowth >= 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'" 
                :class="mrrGrowth >= 0 ? 'text-green-500' : 'text-red-500'"
                class="w-4 h-4" 
              />
              <span :class="mrrGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ Math.abs(mrrGrowth) }}% vs last month
              </span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- ARR Card -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <UIcon name="i-heroicons-chart-bar-square" class="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">ARR</span>
            </div>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              ${{ formatCurrency(arr) }}
            </p>
            <div class="flex items-center gap-1 text-sm">
              <UIcon 
                :name="arrGrowth >= 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'" 
                :class="arrGrowth >= 0 ? 'text-green-500' : 'text-red-500'"
                class="w-4 h-4" 
              />
              <span :class="arrGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ Math.abs(arrGrowth) }}% YoY
              </span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Active Customers -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <UIcon name="i-heroicons-user-group" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Customers</span>
            </div>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {{ formatNumber(activeCustomers) }}
            </p>
            <div class="flex items-center gap-1 text-sm">
              <UIcon 
                name="i-heroicons-arrow-trending-up" 
                class="w-4 h-4 text-green-500" 
              />
              <span class="text-green-600 dark:text-green-400">
                +{{ newCustomersThisMonth }} this month
              </span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Churn Rate -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <UIcon name="i-heroicons-arrow-trending-down" class="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Churn Rate</span>
            </div>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {{ churnRate }}%
            </p>
            <div class="flex items-center gap-1 text-sm">
              <UIcon 
                :name="churnRateChange <= 0 ? 'i-heroicons-arrow-trending-down' : 'i-heroicons-arrow-trending-up'" 
                :class="churnRateChange <= 0 ? 'text-green-500' : 'text-red-500'"
                class="w-4 h-4" 
              />
              <span :class="churnRateChange <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ churnRateChange > 0 ? '+' : '' }}{{ churnRateChange }}% vs last month
              </span>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Secondary Metrics Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <UCard class="hover:shadow-md transition-shadow duration-200">
        <div class="text-center">
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">LTV</p>
          <p class="text-xl font-bold text-gray-900 dark:text-white">${{ formatCurrency(ltv) }}</p>
        </div>
      </UCard>
      <UCard class="hover:shadow-md transition-shadow duration-200">
        <div class="text-center">
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">CAC</p>
          <p class="text-xl font-bold text-gray-900 dark:text-white">${{ formatCurrency(cac) }}</p>
        </div>
      </UCard>
      <UCard class="hover:shadow-md transition-shadow duration-200">
        <div class="text-center">
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">LTV:CAC</p>
          <p class="text-xl font-bold text-gray-900 dark:text-white">{{ ltvCacRatio }}:1</p>
        </div>
      </UCard>
      <UCard class="hover:shadow-md transition-shadow duration-200">
        <div class="text-center">
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">NRR</p>
          <p class="text-xl font-bold text-gray-900 dark:text-white">{{ nrr }}%</p>
        </div>
      </UCard>
      <UCard class="hover:shadow-md transition-shadow duration-200">
        <div class="text-center">
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">ARPU</p>
          <p class="text-xl font-bold text-gray-900 dark:text-white">${{ formatCurrency(arpu) }}</p>
        </div>
      </UCard>
      <UCard class="hover:shadow-md transition-shadow duration-200">
        <div class="text-center">
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Trial Conv.</p>
          <p class="text-xl font-bold text-gray-900 dark:text-white">{{ trialConversionRate }}%</p>
        </div>
      </UCard>
    </div>

    <!-- Charts Section -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- MRR Growth Chart -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">MRR Growth</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Monthly recurring revenue trend</p>
            </div>
            <USelectMenu 
              v-model="mrrChartPeriod" 
              :options="chartPeriodOptions"
              size="sm"
              color="gray"
              variant="ghost"
            />
          </div>
        </template>
        <ApexChart
          type="line"
          height="320"
          :options="mrrChartOptions"
          :series="mrrChartSeries"
        />
      </UCard>

      <!-- Revenue vs Expenses -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Revenue vs Expenses</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Profit and loss overview</p>
            </div>
            <USelectMenu 
              v-model="revenueChartPeriod" 
              :options="chartPeriodOptions"
              size="sm"
              color="gray"
              variant="ghost"
            />
          </div>
        </template>
        <ApexChart
          type="bar"
          height="320"
          :options="revenueChartOptions"
          :series="revenueChartSeries"
        />
      </UCard>
    </div>

    <!-- Customer Metrics Charts -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Customer Growth -->
      <UCard class="lg:col-span-2 hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Customer Growth</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">New vs churned customers</p>
            </div>
          </div>
        </template>
        <ApexChart
          type="bar"
          height="320"
          :options="customerGrowthOptions"
          :series="customerGrowthSeries"
        />
      </UCard>

      <!-- Plan Distribution -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Plan Distribution</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">By subscription tier</p>
          </div>
        </template>
        <ApexChart
          type="donut"
          height="320"
          :options="planDistributionOptions"
          :series="planDistributionSeries"
        />
      </UCard>
    </div>

    <!-- Revenue by Source and Top Customers -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Revenue by Source -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Revenue by Source</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Breakdown by acquisition channel</p>
          </div>
        </template>
        <ApexChart
          type="donut"
          height="320"
          :options="revenueSourceOptions"
          :series="revenueSourceSeries"
        />
      </UCard>

      <!-- Top Customers -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Top Customers</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">By monthly revenue</p>
            </div>
            <UButton variant="ghost" color="gray" size="sm">
              View All →
            </UButton>
          </div>
        </template>
        <div class="space-y-4">
          <div 
            v-for="(customer, idx) in topCustomers" 
            :key="customer.id || idx"
            class="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="flex items-center gap-3 flex-1">
              <div class="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                {{ customer.name.charAt(0) }}
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-900 dark:text-white">{{ customer.name }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ customer.plan }} • {{ customer.users }} users</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-gray-900 dark:text-white">${{ formatCurrency(customer.mrr) }}/mo</p>
              <UBadge :color="customer.status === 'Active' ? 'green' : 'gray'" variant="soft" size="xs">
                {{ customer.status }}
              </UBadge>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Recent Transactions and Activity Feed -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Recent Transactions -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Latest payment activity</p>
            </div>
            <UButton variant="ghost" color="gray" size="sm">
              View All →
            </UButton>
          </div>
        </template>
        <UTable 
          :data="recentTransactions"
          :columns="transactionColumns"
        >
          <template #id-data="{ row }">
            <span class="font-mono text-sm text-gray-900 dark:text-white">{{ (row as any).id }}</span>
          </template>
          <template #customer-data="{ row }">
            <span class="text-gray-900 dark:text-white">{{ (row as any).customer }}</span>
          </template>
          <template #amount-data="{ row }">
            <span class="font-semibold text-gray-900 dark:text-white">${{ formatCurrency((row as any).amount) }}</span>
          </template>
          <template #status-data="{ row }">
            <UBadge :color="getTransactionStatusColor((row as any).status)" variant="soft" size="xs">
              {{ (row as any).status }}
            </UBadge>
          </template>
          <template #date-data="{ row }">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ (row as any).date }}</span>
          </template>
        </UTable>
      </UCard>

      <!-- Activity Feed -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Activity Feed</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Recent system events</p>
          </div>
        </template>
        <div class="space-y-4">
          <div 
            v-for="activity in recentActivities" 
            :key="activity.id"
            class="flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div class="shrink-0">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center"
                :class="getActivityIconBg(activity.type)"
              >
                <UIcon 
                  :name="getActivityIcon(activity.type)" 
                  class="w-4 h-4"
                  :class="getActivityIconColor(activity.type)"
                />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white">
                <span class="font-semibold">{{ activity.user }}</span> {{ activity.action }}
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

