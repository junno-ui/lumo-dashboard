<script setup lang="ts">
import { billingStats, monthlySpend, spendBreakdown } from '@/mock/billing'
const maxSpend = Math.max(...monthlySpend.map((m: { amount: number }) => m.amount))
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard class="p-4"><p class="text-sm text-gray-500">Current Balance</p><p class="text-2xl font-bold">{{ billingStats.currentBalance }}</p></UCard>
      <UCard class="p-4"><p class="text-sm text-gray-500">Next Invoice</p><p class="text-2xl font-bold">{{ billingStats.nextInvoice }}</p></UCard>
      <UCard class="p-4"><p class="text-sm text-gray-500">Next Invoice Date</p><p class="text-2xl font-bold">{{ billingStats.nextInvoiceDate }}</p></UCard>
      <UCard class="p-4"><p class="text-sm text-gray-500">Payment Method</p><p class="text-2xl font-bold">{{ billingStats.paymentMethod }}</p></UCard>
    </div>

    <UCard>
      <template #header><h3 class="text-base font-semibold">Monthly Spend</h3></template>
      <div class="h-64 flex items-end justify-between gap-2 px-4 pb-4">
        <div v-for="m in monthlySpend" :key="m.month" class="w-full bg-primary-100 dark:bg-primary-900/20 rounded-t-sm hover:bg-primary-500 transition-colors relative group" :style="{ height: `${(m.amount / maxSpend) * 80 + 20}%` }">
          <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            ${{ m.amount.toFixed(2) }}
          </div>
          <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500">{{ m.month }}</div>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header><h3 class="text-base font-semibold">Spend Breakdown</h3></template>
      <div class="p-4 space-y-3">
        <div v-for="b in spendBreakdown" :key="b.category" class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-chart-pie" class="text-primary-500" />
            <span class="font-medium">{{ b.category }}</span>
          </div>
          <span class="text-sm text-gray-600">${{ b.amount }}</span>
        </div>
      </div>
    </UCard>
  </div>
  </template>