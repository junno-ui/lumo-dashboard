<script setup lang="ts">
import { billingStats, monthlySpend, spendBreakdown } from '@/mock/billing'
const maxSpend = Math.max(...monthlySpend.map((m: { amount: number }) => m.amount))
// Calculate total spend for progress bars since it's not in the mock
const total = spendBreakdown.reduce((acc, curr) => acc + curr.amount, 0)
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard class="shadow-sm border-0 bg-white dark:bg-slate-800/50">
        <p class="text-sm text-gray-500 dark:text-gray-400">Current Balance</p>
        <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ billingStats.currentBalance }}</p>
      </UCard>
      <UCard class="shadow-sm border-0 bg-white dark:bg-slate-800/50">
        <p class="text-sm text-gray-500 dark:text-gray-400">Next Invoice</p>
        <p class="text-2xl font-bold">{{ billingStats.nextInvoice }}</p>
      </UCard>
      <UCard class="shadow-sm border-0 bg-white dark:bg-slate-800/50">
        <p class="text-sm text-gray-500 dark:text-gray-400">Next Invoice Date</p>
        <p class="text-2xl font-bold text-orange-500">{{ billingStats.nextInvoiceDate }}</p>
      </UCard>
      <UCard class="shadow-sm border-0 bg-white dark:bg-slate-800/50">
        <p class="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
        <p class="text-lg font-bold flex items-center gap-2">
          <UIcon name="i-heroicons-credit-card" />
          {{ billingStats.paymentMethod }}
        </p>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold">Monthly Spend</h3>
            <UButton label="Download Report" color="gray" variant="ghost" size="xs" icon="i-heroicons-arrow-down-tray" />
          </div>
        </template>
        <div class="h-64 flex items-end justify-between gap-2 px-4 pb-4">
          <div 
            v-for="m in monthlySpend" 
            :key="m.month" 
            class="w-full bg-primary-100 dark:bg-primary-900/20 rounded-t-sm hover:bg-primary-500 transition-colors relative group" 
            :style="{ height: `${(m.amount / maxSpend) * 80 + 20}%` }"
          >
            <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg">
              ${{ m.amount.toFixed(2) }}
            </div>
            <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 uppercase tracking-wider font-bold">{{ m.month }}</div>
          </div>
        </div>
      </UCard>

      <UCard class="lg:col-span-1">
        <template #header>
          <h3 class="text-base font-semibold">Spend Breakdown</h3>
        </template>
        <div class="p-4 space-y-4">
          <div v-for="b in spendBreakdown" :key="b.category" class="space-y-1">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-primary-500"></div>
                <span class="text-sm font-medium">{{ b.category }}</span>
              </div>
              <span class="text-sm font-bold text-gray-600 dark:text-gray-400">${{ b.amount }}</span>
            </div>
            <UProgress :value="(b.amount / total) * 100" color="primary" size="sm" />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>