<script setup lang="ts">
import { computed } from 'vue'
import { analyticsStats, revenueData } from '@/mock/analytics'
import { mrrData, churnData, arpuData } from '@/mock/subscriptions'
import { invoices, paymentMethods } from '@/mock/billing'
import { users } from '@/mock/users'

const totalRevenueYTD = revenueData.reduce((a: number, b: any) => a + (b.revenue || 0), 0)
const totalProfitYTD = revenueData.reduce((a: number, b: any) => a + (b.profit || 0), 0)

const latestMRR = mrrData[mrrData.length - 1]?.mrr || 0
const latestChurn = churnData[churnData.length - 1]?.churnRate || 0
const latestARPU = arpuData[arpuData.length - 1]?.arpu || 0

const totalInvoices = invoices.length
const totalPaymentMethods = paymentMethods.length
const totalUsers = users.length

const mrrMax = Math.max(...mrrData.map((d: any) => d.mrr))
const mrrBars = computed(() => mrrData.map((d: any) => ({ label: d.month, height: `${(d.mrr / mrrMax) * 80 + 20}%` })))

const revenueMax = Math.max(...revenueData.map((d: any) => d.revenue))
const revenueBars = computed(() => revenueData.slice(-6).map((d: any) => ({ label: d.month, height: `${(d.revenue / revenueMax) * 80 + 20}%` })))
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <UIcon name="i-heroicons-banknotes" class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Revenue YTD</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ totalRevenueYTD.toLocaleString() }}</p>
            </div>
          </div>
          <div class="text-green-500 text-sm font-medium">{{ analyticsStats.revenueGrowth }}</div>
        </div>
      </UCard>

      <UCard class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <UIcon name="i-heroicons-currency-dollar" class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Profit YTD</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ totalProfitYTD.toLocaleString() }}</p>
            </div>
          </div>
          <div class="text-green-500 text-sm font-medium">+5.1%</div>
        </div>
      </UCard>

      <UCard class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Requests</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ analyticsStats.totalRequests }}</p>
            </div>
          </div>
          <div class="text-green-500 text-sm font-medium">{{ analyticsStats.requestsGrowth }}</div>
        </div>
      </UCard>

      <UCard class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <UIcon name="i-heroicons-user-group" class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Users</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ analyticsStats.activeUsersNow }}</p>
            </div>
          </div>
          <div class="text-green-500 text-sm font-medium">{{ analyticsStats.activeUsersGrowth }}</div>
        </div>
      </UCard>

      <UCard class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <UIcon name="i-heroicons-rectangle-stack" class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">MRR</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ latestMRR.toLocaleString() }}</p>
            </div>
          </div>
          <div class="flex items-end gap-1 h-10">
            <div v-for="b in mrrBars" :key="b.label" class="w-2 bg-primary-100 dark:bg-primary-900/20 rounded-t-sm" :style="{ height: b.height }" />
          </div>
        </div>
      </UCard>

      <UCard class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Churn Rate</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ latestChurn }}%</p>
            </div>
          </div>
          <div class="text-red-500 text-sm font-medium">-0.2%</div>
        </div>
      </UCard>

      <UCard class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <UIcon name="i-heroicons-chart-pie" class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">ARPU</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ latestARPU.toFixed(2) }}</p>
            </div>
          </div>
          <div class="text-green-500 text-sm font-medium">+0.3%</div>
        </div>
      </UCard>

      <UCard class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Invoices</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalInvoices }}</p>
            </div>
          </div>
          <div class="text-gray-500 text-sm font-medium">All time</div>
        </div>
      </UCard>

      <UCard class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <UIcon name="i-heroicons-credit-card" class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Payment Methods</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalPaymentMethods }}</p>
            </div>
          </div>
          <div class="text-gray-500 text-sm font-medium">Linked</div>
        </div>
      </UCard>

      <UCard class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <UIcon name="i-heroicons-users" class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Users</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalUsers }}</p>
            </div>
          </div>
          <div class="flex items-end gap-1 h-10">
            <div v-for="b in revenueBars" :key="b.label" class="w-2 bg-primary-100 dark:bg-primary-900/20 rounded-t-sm" :style="{ height: b.height }" />
          </div>
        </div>
      </UCard>
    </div>

    <UCard>
      <div class="flex flex-wrap items-center gap-2">
        <UButton label="Analytics" color="black" to="/analytics/revenue" />
        <UButton label="Subscriptions" color="black" to="/subscriptions/plans" />
        <UButton label="Billing" color="black" to="/billing/overview" />
        <UButton label="Users" color="black" to="/users/all" />
        <UButton label="Settings" color="black" to="/settings/profile" />
      </div>
    </UCard>
  </div>
</template>