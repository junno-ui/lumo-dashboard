<script setup lang="ts">
import { computed } from 'vue'
import { billingStats, monthlySpend, spendBreakdown } from '@/mock/billing'

/** ---------- Helpers ---------- */

function money2(n: number, currency = 'USD') {
  const locale = currency === 'IDR' ? 'id-ID' : 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(n)
}

const currency = computed(() => (billingStats as any)?.currency || 'USD')
/** ---------- Spend metrics ---------- */
const maxSpend = computed(() => Math.max(...monthlySpend.map((m: { amount: number }) => m.amount), 0))
const totalSpend = computed(() => monthlySpend.reduce((acc: number, m: { amount: number }) => acc + m.amount, 0))
const avgSpend = computed(() => (monthlySpend.length ? totalSpend.value / monthlySpend.length : 0))
const lastMonth = computed(() => monthlySpend[monthlySpend.length - 1]?.amount ?? 0)
const prevMonth = computed(() => monthlySpend[monthlySpend.length - 2]?.amount ?? 0)
const momDelta = computed(() => lastMonth.value - prevMonth.value)
const momPct = computed(() => {
  if (!prevMonth.value) return 0
  return (momDelta.value / prevMonth.value) * 100
})

/** ---------- Breakdown metrics ---------- */
const breakdownTotal = computed(() => spendBreakdown.reduce((acc: number, curr: { amount: number }) => acc + curr.amount, 0))
const topCategory = computed(() => {
  const sorted = [...spendBreakdown].sort((a: any, b: any) => (b.amount || 0) - (a.amount || 0))
  return sorted[0] || null
})
const activeCategories = computed(() =>
  [...spendBreakdown]
    .filter((x: any) => (x.amount || 0) > 0)
    .sort((a: any, b: any) => (b.amount || 0) - (a.amount || 0))
)

/** ---------- Quick insights ---------- */
const insights = computed(() => {
  const items: { icon: string; title: string; desc: string }[] = []

  if (topCategory.value) {
    const pct = breakdownTotal.value ? (topCategory.value.amount / breakdownTotal.value) * 100 : 0
    items.push({
      icon: 'i-lucide-sparkles',
      title: 'Top cost driver',
      desc: `${topCategory.value.category} is ${pct.toFixed(0)}% of total spend.`
    })
  }

  if (momDelta.value !== 0) {
    items.push({
      icon: momDelta.value > 0 ? 'i-lucide-trending-up' : 'i-lucide-trending-down',
      title: 'Month-over-month',
      desc: `${momDelta.value > 0 ? 'Up' : 'Down'} ${money2(Math.abs(momDelta.value), currency.value)} (${Math.abs(momPct.value).toFixed(1)}%).`
    })
  }

  items.push({
    icon: 'i-lucide-receipt',
    title: 'Next invoice',
    desc: `${billingStats.nextInvoice} due on ${billingStats.nextInvoiceDate}.`
  })

  return items.slice(0, 3)
})

/** ---------- UI labels ---------- */
const balanceTone = computed(() => {
  // simple heuristic: negative balance -> warning/error
  const raw = String(billingStats.currentBalance || '').replace(/[^0-9.-]/g, '')
  const n = Number(raw)
  if (!Number.isFinite(n)) return 'primary'
  if (n < 0) return 'error'
  if (n === 0) return 'neutral'
  return 'primary'
})

/** ---------- Actions ---------- */
function downloadReport() {
  // mock action
  // replace with real download endpoint later
  // eslint-disable-next-line no-console
  console.log('download report')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header / Context -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div class="space-y-1">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Billing overview</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Track spend, upcoming invoices, and where costs come from.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          size="sm"
          color="neutral"
          variant="outline"
          icon="i-lucide-download"
          @click="downloadReport"
        >
          Download report
        </UButton>

        <UButton
          size="sm"
          color="primary"
          icon="i-lucide-receipt"
          to="/billing/invoices"
        >
          View invoices
        </UButton>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard class="rounded-2xl" :ui="{ body: 'p-4' }">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Current balance</div>
            <div class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ billingStats.currentBalance }}
            </div>
            <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Available credits / outstanding amount.
            </div>
          </div>
          <UBadge :color="balanceTone" variant="soft" size="xs">Balance</UBadge>
        </div>
      </UCard>

      <UCard class="rounded-2xl" :ui="{ body: 'p-4' }">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Next invoice</div>
            <div class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ billingStats.nextInvoice }}
            </div>
            <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Estimated total for the next billing cycle.
            </div>
          </div>
          <UIcon name="i-lucide-file-text" class="size-5 text-gray-400" />
        </div>
      </UCard>

      <UCard class="rounded-2xl" :ui="{ body: 'p-4' }">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Invoice date</div>
            <div class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ billingStats.nextInvoiceDate }}
            </div>
            <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Your next charge will be processed on this date.
            </div>
          </div>
          <UIcon name="i-lucide-calendar" class="size-5 text-gray-400" />
        </div>
      </UCard>

      <UCard class="rounded-2xl" :ui="{ body: 'p-4' }">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Payment method</div>
            <div class="mt-1 text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-credit-card" class="size-4 text-gray-400" />
              <span class="truncate">{{ billingStats.paymentMethod }}</span>
            </div>
            <div class="mt-2">
              <UButton size="xs" color="neutral" variant="outline" to="/billing/payment-methods" icon="i-lucide-settings">
                Manage
              </UButton>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Insights -->
    <UCard class="rounded-2xl" :ui="{ body: 'p-4' }">
      <div class="flex items-center justify-between">
        <div class="text-sm font-semibold text-gray-900 dark:text-white">Quick insights</div>
        <UBadge color="neutral" variant="soft" size="xs">Auto</UBadge>
      </div>

      <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div
          v-for="(i, idx) in insights"
          :key="idx"
          class="rounded-xl border border-gray-200/70 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/30 p-3"
        >
          <div class="flex items-start gap-3">
            <div class="rounded-lg bg-gray-100 dark:bg-gray-900 p-2 ring-1 ring-gray-200/70 dark:ring-gray-800/60">
              <UIcon :name="i.icon" class="size-4 text-gray-500 dark:text-gray-300" />
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ i.title }}</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ i.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Charts / Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Monthly spend -->
      <UCard class="rounded-2xl lg:col-span-2" :ui="{ body: 'p-4' }">
        <template #header>
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 pb-0">
            <div>
              <div class="text-sm font-semibold text-gray-900 dark:text-white">Monthly spend</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Total: <span class="font-semibold text-gray-900 dark:text-white">{{ money2(totalSpend, currency) }}</span>
                • Avg: <span class="font-semibold text-gray-900 dark:text-white">{{ money2(avgSpend, currency) }}</span>
                • Max: <span class="font-semibold text-gray-900 dark:text-white">{{ money2(maxSpend, currency) }}</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <UBadge
                :color="momDelta >= 0 ? 'success' : 'warning'"
                variant="soft"
                size="xs"
              >
                MoM: {{ momDelta >= 0 ? '+' : '-' }}{{ money2(Math.abs(momDelta), currency) }}
                ({{ Math.abs(momPct).toFixed(1) }}%)
              </UBadge>
            </div>
          </div>
        </template>

        <!-- Bars -->
        <div class="mt-4">
          <div class="h-64 flex items-end gap-2">
            <div
              v-for="m in monthlySpend"
              :key="m.month"
              class="group relative flex-1"
            >
              <!-- tooltip -->
              <div class="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="rounded-lg bg-gray-900 text-white text-xs px-2 py-1 shadow-lg">
                  {{ m.month }} • {{ money2(m.amount, currency) }}
                </div>
              </div>

              <!-- bar -->
              <div
                class="w-full rounded-xl bg-primary-200/70 dark:bg-primary-900/25 ring-1 ring-primary-200/50 dark:ring-primary-900/30 hover:bg-primary-300/80 dark:hover:bg-primary-900/40 transition-colors"
                :style="{ height: `${maxSpend ? (m.amount / maxSpend) * 85 + 10 : 10}%` }"
              />

              <!-- label -->
              <div class="mt-2 text-[10px] text-gray-500 dark:text-gray-400 text-center font-semibold tracking-wide uppercase">
                {{ m.month }}
              </div>
            </div>
          </div>

          <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Hover bars to see exact values.
          </div>
        </div>
      </UCard>

      <!-- Spend breakdown -->
      <UCard class="rounded-2xl" :ui="{ body: 'p-4' }">
        <template #header>
          <div class="p-4 pb-0">
            <div class="text-sm font-semibold text-gray-900 dark:text-white">Spend breakdown</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              Total: <span class="font-semibold text-gray-900 dark:text-white">{{ money2(breakdownTotal, currency) }}</span>
              <span v-if="topCategory" class="ml-2">
                • Top: <span class="font-semibold text-gray-900 dark:text-white">{{ topCategory.category }}</span>
              </span>
            </div>
          </div>
        </template>

        <div class="mt-4 space-y-4">
          <div
            v-for="b in activeCategories"
            :key="b.category"
            class="space-y-2"
          >
            <div class="flex items-center justify-between">
              <div class="min-w-0">
                <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ b.category }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ breakdownTotal ? ((b.amount / breakdownTotal) * 100).toFixed(0) : 0 }}% of total
                </div>
              </div>

              <div class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ money2(b.amount, currency) }}
              </div>
            </div>

            <UProgress
              :model-value="breakdownTotal ? (b.amount / breakdownTotal) * 100 : 0"
              color="primary"
              size="sm"
            />
          </div>

          <div v-if="!activeCategories.length" class="text-sm text-gray-500 dark:text-gray-400">
            No breakdown data available.
          </div>

          <div class="pt-3 mt-3 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
            Tip: consider optimizing your top category first for the biggest impact.
          </div>
        </div>
      </UCard>
    </div>

    <!-- Optional: Helpful next steps -->
    <UCard class="rounded-2xl" :ui="{ body: 'p-4' }">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div class="text-sm font-semibold text-gray-900 dark:text-white">Next steps</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Manage invoices and payment methods from the Billing menu.
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <UButton color="neutral" variant="outline" size="sm" icon="i-lucide-receipt" to="/billing/invoices">
            Invoices
          </UButton>
          <UButton color="neutral" variant="outline" size="sm" icon="i-lucide-credit-card" to="/billing/payment-methods">
            Payment methods
          </UButton>
          <UButton color="primary" size="sm" icon="i-lucide-life-buoy">
            Contact support
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
