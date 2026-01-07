<script setup lang="ts">
import { computed, h, ref, resolveComponent } from 'vue'
import { securitySettings, loginAttempts, auditEvents } from '@/mock/settings'

type EventSeverity = 'low' | 'medium' | 'high'

const toast = useToast()

// --- Derived
const maxLogin = Math.max(
  1,
  ...loginAttempts.map((l: { success: number; fail: number }) => l.success + l.fail)
)

const total7d = computed(() => {
  const success = loginAttempts.reduce((a: number, b: any) => a + (b.success || 0), 0)
  const fail = loginAttempts.reduce((a: number, b: any) => a + (b.fail || 0), 0)
  return { success, fail, total: success + fail }
})

const failRate = computed(() => {
  const t = total7d.value.total
  return t === 0 ? 0 : Math.round((total7d.value.fail / t) * 100)
})

const risk = computed(() => {
  if (!securitySettings.mfaEnabled) return { label: 'Elevated', color: 'warning' as const, hint: 'Enable MFA to reduce risk.' }
  if (failRate.value >= 30) return { label: 'Watch', color: 'warning' as const, hint: 'High failed-login rate detected.' }
  return { label: 'Good', color: 'success' as const, hint: 'No unusual activity detected.' }
})

function fmtDate(d: string) {
  const dt = new Date(d)
  return Number.isNaN(dt.getTime()) ? d : dt.toLocaleDateString(undefined, { month: 'short', day: '2-digit' })
}

function fmtDateTime(d: string) {
  const dt = new Date(d)
  return Number.isNaN(dt.getTime())
    ? d
    : dt.toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

// --- Events UI
const query = ref('')
const severity = ref<'all' | EventSeverity>('all')

function guessSeverity(action: string): EventSeverity {
  const a = action.toLowerCase()
  if (a.includes('failed') || a.includes('denied') || a.includes('blocked')) return 'high'
  if (a.includes('password') || a.includes('mfa') || a.includes('2fa')) return 'medium'
  return 'low'
}

const filteredEvents = computed(() => {
  const q = query.value.trim().toLowerCase()
  return (auditEvents as any[]).filter((e) => {
    const sev = (e.severity as EventSeverity) || guessSeverity(e.action || '')
    const matchSev = severity.value === 'all' ? true : sev === severity.value
    const hay = `${e.action || ''} ${e.actor || ''} ${e.ip || ''} ${e.device || ''}`.toLowerCase()
    const matchQ = q ? hay.includes(q) : true
    return matchSev && matchQ
  })
})

const severityItems = [
  { label: 'All', value: 'all' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
]

// --- Actions (mock)
function toggleMfa() {
  toast.add({
    title: securitySettings.mfaEnabled ? 'MFA settings' : 'Enable MFA',
    description: 'Hook this action to your backend (mock).',
    color: 'primary',
    icon: 'i-lucide-shield-check'
  })
}
function changePassword() {
  toast.add({
    title: 'Change password',
    description: 'Open change password flow (mock).',
    color: 'neutral',
    icon: 'i-lucide-key-round'
  })
}
function signOutAll() {
  toast.add({
    title: 'Signed out from all sessions',
    description: 'Invalidate all tokens/sessions on server (mock).',
    color: 'warning',
    icon: 'i-lucide-log-out'
  })
}

// --- Table columns (optional, but makes it cleaner)
const eventColumns = [
  {
    accessorKey: 'action',
    header: 'Event',
    cell: ({ row }: any) => {
      const e = row.original
      const sev = (e.severity as EventSeverity) || guessSeverity(e.action || '')
      const color =
        sev === 'high' ? 'error' : sev === 'medium' ? 'warning' : 'neutral'

      return h('div', { class: 'min-w-0' }, [
        h('div', { class: 'flex items-center gap-2 min-w-0' }, [
          h(resolveComponent('UBadge') as any, { color, variant: 'soft', size: 'xs', class: 'shrink-0 capitalize' }, () => sev),
          h('div', { class: 'font-medium text-gray-900 dark:text-white truncate' }, e.action || '—')
        ]),
        h('div', { class: 'mt-0.5 text-xs text-gray-500 dark:text-gray-400 truncate' }, `${e.actor || 'Unknown'} • ${fmtDateTime(e.date)}`)
      ])
    }
  },
  {
    accessorKey: 'meta',
    header: 'Meta',
    cell: ({ row }: any) => {
      const e = row.original
      const meta = [e.ip ? `IP: ${e.ip}` : null, e.device ? e.device : null].filter(Boolean).join(' • ')
      return h('div', { class: 'text-sm text-gray-700 dark:text-gray-200' }, meta || '—')
    }
  }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      <!-- Header -->
      <div class="rounded-3xl border border-gray-200/70 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/50 backdrop-blur p-5 sm:p-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Security</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Monitor logins, protect your account, and review security events.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <UButton color="neutral" variant="outline" icon="i-lucide-key-round" @click="changePassword">
              Change password
            </UButton>
            <UButton color="primary" icon="i-lucide-shield-check" @click="toggleMfa">
              {{ securitySettings.mfaEnabled ? 'Manage MFA' : 'Enable MFA' }}
            </UButton>
          </div>
        </div>
      </div>

      <!-- Overview cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <UCard class="rounded-2xl" :ui="{ body: 'p-5' }">
          <div class="flex items-start justify-between">
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Risk level</div>
              <div class="mt-1 flex items-center gap-2">
                <div class="text-xl font-semibold text-gray-900 dark:text-white">{{ risk.label }}</div>
                <UBadge :color="risk.color" variant="soft" size="xs">Status</UBadge>
              </div>
              <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">{{ risk.hint }}</div>
            </div>
            <div class="h-10 w-10 rounded-2xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center">
              <UIcon name="i-lucide-shield" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </UCard>

        <UCard class="rounded-2xl" :ui="{ body: 'p-5' }">
          <div class="flex items-start justify-between">
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400">MFA</div>
              <div class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                {{ securitySettings.mfaEnabled ? 'Enabled' : 'Disabled' }}
              </div>

              <div class="mt-3">
                <UProgress :model-value="securitySettings.mfaEnabled ? 100 : 40" size="sm" color="primary" />
                <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {{ securitySettings.mfaEnabled ? 'Your account is protected with MFA.' : 'Enable MFA to improve security.' }}
                </div>
              </div>
            </div>
            <div class="h-10 w-10 rounded-2xl bg-gray-100 dark:bg-gray-900/40 flex items-center justify-center">
              <UIcon name="i-lucide-fingerprint" class="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </div>
          </div>
        </UCard>

        <UCard class="rounded-2xl" :ui="{ body: 'p-5' }">
          <div class="flex items-start justify-between">
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Last login</div>
              <div class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{{ securitySettings.lastLogin }}</div>
              <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">Recent access timestamp (mock).</div>
            </div>
            <div class="h-10 w-10 rounded-2xl bg-gray-100 dark:bg-gray-900/40 flex items-center justify-center">
              <UIcon name="i-lucide-clock" class="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </div>
          </div>
        </UCard>

        <UCard class="rounded-2xl" :ui="{ body: 'p-5' }">
          <div class="flex items-start justify-between">
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Active sessions</div>
              <div class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{{ securitySettings.activeSessions }}</div>
              <div class="mt-3">
                <UButton size="xs" color="warning" variant="soft" icon="i-lucide-log-out" @click="signOutAll">
                  Sign out all
                </UButton>
              </div>
            </div>
            <div class="h-10 w-10 rounded-2xl bg-gray-100 dark:bg-gray-900/40 flex items-center justify-center">
              <UIcon name="i-lucide-monitor" class="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Login attempts -->
      <UCard class="rounded-3xl" :ui="{ body: 'p-0' }">
        <template #header>
          <div class="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Login attempts (last 7 days)</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Success: <span class="font-semibold text-gray-900 dark:text-white">{{ total7d.success }}</span>
                • Fail: <span class="font-semibold text-gray-900 dark:text-white">{{ total7d.fail }}</span>
                • Fail rate: <span class="font-semibold text-gray-900 dark:text-white">{{ failRate }}%</span>
              </p>
            </div>

            <div class="flex items-center gap-2">
              <UBadge color="success" variant="soft" size="xs">Success</UBadge>
              <UBadge color="error" variant="soft" size="xs">Fail</UBadge>
            </div>
          </div>
        </template>

        <div class="px-5 pb-6">
          <div class="rounded-2xl ring-1 ring-gray-200/70 dark:ring-gray-800/60 bg-white/60 dark:bg-gray-950/30 p-4">
            <div class="h-56 flex items-end justify-between gap-2">
              <div
                v-for="l in loginAttempts"
                :key="l.date"
                class="group w-full"
              >
                <!-- bar container -->
                <div class="relative h-44 rounded-xl bg-gray-100 dark:bg-gray-900/40 overflow-hidden ring-1 ring-gray-200/60 dark:ring-gray-800/60">
                  <!-- total bar -->
                  <div
                    class="absolute bottom-0 left-0 right-0 bg-primary-200 dark:bg-primary-900/25"
                    :style="{ height: `${((l.success + l.fail) / maxLogin) * 100}%` }"
                  />

                  <!-- success overlay -->
                  <div
                    class="absolute bottom-0 left-0 right-0 bg-success-500/50"
                    :style="{ height: `${(l.success / maxLogin) * 100}%` }"
                  />

                  <!-- tooltip -->
                  <div class="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div class="rounded-xl bg-gray-900 text-white text-[11px] px-2.5 py-1.5 shadow-lg whitespace-nowrap">
                      {{ fmtDate(l.date) }} • {{ l.success }} ✓ / {{ l.fail }} ✗
                    </div>
                  </div>
                </div>

                <div class="mt-2 text-[11px] text-gray-500 dark:text-gray-400 text-center">
                  {{ fmtDate(l.date) }}
                </div>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 p-3 bg-white/70 dark:bg-gray-950/30">
                <div class="text-xs text-gray-500 dark:text-gray-400">Most recent day</div>
                <div class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                  22/10/2025
                </div>
              </div>
              <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 p-3 bg-white/70 dark:bg-gray-950/30">
                <div class="text-xs text-gray-500 dark:text-gray-400">Total attempts</div>
                <div class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{{ total7d.total }}</div>
              </div>
              <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 p-3 bg-white/70 dark:bg-gray-950/30">
                <div class="text-xs text-gray-500 dark:text-gray-400">Fail rate</div>
                <div class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{{ failRate }}%</div>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Events -->
      <UCard class="rounded-3xl" :ui="{ body: 'p-0' }">
        <template #header>
          <div class="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Recent security events</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Audit trail for important security-related actions.</p>
            </div>

            <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
              <UInput v-model="query" size="sm" icon="i-lucide-search" placeholder="Search events…" class="w-full sm:w-72" />
              <USelectMenu
                v-model="severity"
                :items="severityItems"
                value-key="value"
                label-key="label"
                size="sm"
                color="neutral"
                variant="outline"
                class="w-full sm:w-40"
              />
            </div>
          </div>
        </template>

        <div class="px-5 pb-6">
          <div class="rounded-2xl overflow-hidden ring-1 ring-gray-200/70 dark:ring-gray-800/60">
            <UTable
              :data="filteredEvents"
              :columns="eventColumns"
              :ui="{
                thead: 'bg-white dark:bg-gray-900/60',
                th: 'text-xs font-semibold text-gray-600 dark:text-gray-300',
                tr: 'hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors',
                td: 'py-4'
              }"
              :empty-state="{
                icon: 'i-lucide-shield-alert',
                label: 'No events found',
                description: 'Try changing filters or search keywords.'
              }"
            />
          </div>

          <div class="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div>
              Showing <span class="font-semibold text-gray-900 dark:text-white">{{ filteredEvents.length }}</span> events
            </div>
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              :disabled="!query && severity === 'all'"
              @click="() => { query = ''; severity = 'all' }"
            >
              Reset filters
            </UButton>
          </div>
        </div>
      </UCard>

    </div>
  </div>
</template>
