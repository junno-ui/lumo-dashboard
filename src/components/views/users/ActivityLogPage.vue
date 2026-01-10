<script setup lang="ts">
import { computed, h, ref, resolveComponent, watch } from 'vue'
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import { activityLog as mockActivityLog } from '@/mock/users'

type Activity = {
  id: number | string
  user: string
  action: string
  time: string
  icon?: string

  // optional extras (safe to ignore if not in mock)
  type?: string          // e.g. "users" | "billing" | "security"
  status?: string        // e.g. "success" | "warning" | "error"
  ip?: string
  target?: string
  meta?: Record<string, any>
}

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UIcon = resolveComponent('UIcon')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()

/** -----------------------
 * Normalize mock data (safe)
 * ---------------------- */
const logs = ref<Activity[]>(
  (Array.isArray(mockActivityLog) ? (mockActivityLog as any[]) : []).map((a: any) => ({
    id: a.id ?? crypto?.randomUUID?.() ?? Date.now(),
    user: String(a.user ?? 'Unknown'),
    action: String(a.action ?? ''),
    time: String(a.time ?? ''),
    icon: a.icon ? String(a.icon) : 'i-lucide-activity',
    type: a.type ? String(a.type) : guessType(String(a.action ?? '')),
    status: a.status ? String(a.status) : guessStatus(String(a.action ?? '')),
    ip: a.ip ? String(a.ip) : undefined,
    target: a.target ? String(a.target) : undefined,
    meta: a.meta && typeof a.meta === 'object' ? a.meta : undefined
  }))
)

/** -----------------------
 * Helpers (simple + readable)
 * ---------------------- */
function guessType(action: string) {
  const a = action.toLowerCase()
  if (a.includes('role') || a.includes('permission')) return 'access'
  if (a.includes('login') || a.includes('password') || a.includes('security')) return 'security'
  if (a.includes('invoice') || a.includes('payment') || a.includes('billing')) return 'billing'
  if (a.includes('user') || a.includes('member')) return 'users'
  return 'general'
}

function guessStatus(action: string) {
  const a = action.toLowerCase()
  if (a.includes('failed') || a.includes('denied') || a.includes('error')) return 'error'
  if (a.includes('warning') || a.includes('past due')) return 'warning'
  return 'success'
}

function badgeColorForType(t?: string) {
  const map: Record<string, any> = {
    users: 'primary',
    access: 'info',
    security: 'warning',
    billing: 'secondary',
    general: 'neutral'
  }
  return map[t || 'general'] || 'neutral'
}

function badgeColorForStatus(s?: string) {
  const map: Record<string, any> = {
    success: 'success',
    warning: 'warning',
    error: 'error'
  }
  return map[s || 'success'] || 'neutral'
}

/** -----------------------
 * Filters
 * ---------------------- */
const q = ref('')
const typeFilter = ref<'all' | string>('all')
const statusFilter = ref<'all' | string>('all')

const typeItems = computed(() => {
  const set = new Set(logs.value.map(l => l.type || 'general'))
  const items = Array.from(set).sort().map(v => ({ label: titleCase(v), value: v }))
  return [{ label: 'All types', value: 'all' }, ...items]
})
const statusItems = [
  { label: 'All status', value: 'all' },
  { label: 'Success', value: 'success' },
  { label: 'Warning', value: 'warning' },
  { label: 'Error', value: 'error' }
]

function titleCase(s: string) {
  return s.replace(/(^|\s|-)\S/g, (t) => t.toUpperCase())
}

const filtered = computed(() => {
  const query = q.value.trim().toLowerCase()
  let rows = [...logs.value]

  if (typeFilter.value !== 'all') rows = rows.filter(r => (r.type || 'general') === typeFilter.value)
  if (statusFilter.value !== 'all') rows = rows.filter(r => (r.status || 'success') === statusFilter.value)

  if (query) {
    rows = rows.filter(r => {
      const hay = `${r.user} ${r.action} ${r.type ?? ''} ${r.ip ?? ''} ${r.target ?? ''}`.toLowerCase()
      return hay.includes(query)
    })
  }

  return rows
})

/** -----------------------
 * Stats
 * ---------------------- */
const stats = computed(() => {
  const total = logs.value.length
  const success = logs.value.filter(l => l.status === 'success').length
  const warning = logs.value.filter(l => l.status === 'warning').length
  const error = logs.value.filter(l => l.status === 'error').length

  const topUser = [...logs.value]
    .reduce<Record<string, number>>((acc, l) => {
      acc[l.user] = (acc[l.user] || 0) + 1
      return acc
    }, {})
  const top = Object.entries(topUser).sort((a, b) => b[1] - a[1])[0]

  return {
    total,
    success,
    warning,
    error,
    topUser: top?.[0] || '—',
    topUserCount: top?.[1] || 0
  }
})

/** -----------------------
 * Detail modal
 * ---------------------- */
const isDetailOpen = ref(false)
const selected = ref<Activity | null>(null)

function openDetail(row: Activity) {
  selected.value = row
  isDetailOpen.value = true
}

/** Row actions */
function rowMenuItems(row: Activity): DropdownMenuItem[][] {
  return [
    [{ label: 'View details', icon: 'i-lucide-eye', onSelect: () => openDetail(row) }],
    [{ label: 'Copy action text', icon: 'i-lucide-copy', onSelect: () => copyText(`${row.user}: ${row.action}`) }]
  ]
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.add({ title: 'Copied', description: 'Copied to clipboard.', color: 'success' })
  } catch {
    toast.add({ title: 'Copy failed', description: 'Clipboard permission blocked.', color: 'error' })
  }
}

/** -----------------------
 * Table columns
 * ---------------------- */
const columns: TableColumn<Activity>[] = [
  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => {
      const r = row.original
      return h('button', {
        type: 'button',
        class:
          'w-full text-left rounded-xl px-2 py-1 -mx-2 transition-colors ' +
          'hover:bg-gray-50 dark:hover:bg-gray-900/40',
        onClick: () => openDetail(r)
      }, [
        h('div', { class: 'flex items-start gap-3 min-w-0' }, [
          h('div', { class: 'mt-0.5 h-9 w-9 rounded-2xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center shrink-0' }, [
            h(UIcon as any, { name: r.icon || 'i-lucide-activity', class: 'w-4 h-4 text-primary-600 dark:text-primary-400' })
          ]),
          h('div', { class: 'min-w-0' }, [
            h('div', { class: 'font-semibold text-gray-900 dark:text-white truncate' }, r.user),
            h('div', { class: 'text-xs text-gray-500 dark:text-gray-400 line-clamp-1' }, r.action)
          ])
        ])
      ])
    }
  },
  {
    accessorKey: 'type',
    header: 'Type',
    meta: { class: { th: 'w-28', td: 'align-middle' } },
    cell: ({ row }) =>
      h(UBadge as any, { color: badgeColorForType(row.original.type), variant: 'soft', size: 'xs' }, () =>
        titleCase(row.original.type || 'general')
      )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: { class: { th: 'w-28', td: 'align-middle' } },
    cell: ({ row }) =>
      h(UBadge as any, { color: badgeColorForStatus(row.original.status), variant: 'soft', size: 'xs' }, () =>
        titleCase(row.original.status || 'success')
      )
  },
  {
    accessorKey: 'time',
    header: 'Time',
    meta: { class: { th: 'w-40', td: 'align-middle' } },
    cell: ({ row }) => h('div', { class: 'text-sm text-gray-700 dark:text-gray-200' }, row.original.time || '—')
  },
  {
    id: 'actions',
    header: '',
    meta: { class: { th: 'w-16 text-right', td: 'text-right align-middle' } },
    cell: ({ row }) =>
      h('div', { class: 'flex justify-end' }, [
        h(UDropdownMenu as any, { items: rowMenuItems(row.original), content: { align: 'end' } }, () =>
          h(UButton as any, {
            icon: 'i-lucide-ellipsis-vertical',
            color: 'neutral',
            variant: 'ghost',
            size: 'sm',
            'aria-label': 'Row actions'
          })
        )
      ])
  }
]

/** Reset pagination later if you add it; for now simple */
watch([q, typeFilter, statusFilter], () => {
  // reserved (if you want pagination later)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <div class=" px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Header -->
      <div class="rounded-3xl border border-gray-200/70 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/50 backdrop-blur p-5 sm:p-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <div class="h-10 w-10 rounded-2xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center">
                <UIcon name="i-lucide-activity" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Activity log</h1>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Track important changes across users, roles, and security events.
                </p>
              </div>
            </div>

            <div class="mt-3 flex flex-wrap items-center gap-2">
              <UBadge color="neutral" variant="soft" size="xs">Total: <span class="ml-1 font-semibold">{{ stats.total }}</span></UBadge>
              <UBadge color="success" variant="soft" size="xs">Success: <span class="ml-1 font-semibold">{{ stats.success }}</span></UBadge>
              <UBadge color="warning" variant="soft" size="xs">Warning: <span class="ml-1 font-semibold">{{ stats.warning }}</span></UBadge>
              <UBadge color="error" variant="soft" size="xs">Error: <span class="ml-1 font-semibold">{{ stats.error }}</span></UBadge>
              <UBadge color="primary" variant="soft" size="xs">Top user: <span class="ml-1 font-semibold">{{ stats.topUser }}</span> ({{ stats.topUserCount }})</UBadge>
            </div>
          </div>

          <!-- Controls -->
        </div>
        <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
          <UInput v-model="q" icon="i-lucide-search" size="sm" placeholder="Search user, action, ip, target…" class="w-full sm:w-[320px]" />
          <USelectMenu v-model="typeFilter" :items="typeItems" value-key="value" label-key="label" size="sm" color="neutral" variant="outline" class="w-full sm:w-44" />
          <USelectMenu v-model="statusFilter" :items="statusItems" value-key="value" label-key="label" size="sm" color="neutral" variant="outline" class="w-full sm:w-40" />
  
          <div class="flex gap-2">
            <UButton
              size="sm"
              color="neutral"
              variant="soft"
              icon="i-lucide-x"
              :disabled="!q && typeFilter === 'all' && statusFilter === 'all'"
              @click="() => { q = ''; typeFilter = 'all'; statusFilter = 'all' }"
            >
              Clear
            </UButton>
            <UButton
              size="sm"
              color="neutral"
              variant="outline"
              icon="i-lucide-download"
              @click="copyText(JSON.stringify(filtered, null, 2))"
              title="Quick export (copy JSON)"
            >
              Export
            </UButton>
          </div>
        </div>
      </div>
      
      <!-- Table -->
      <UCard class="rounded-3xl" :ui="{ body: 'p-0' }">
        <template #header>
          <div class="p-5 flex items-start justify-between gap-3">
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Recent events</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Click a row to view details.</p>
            </div>
            <UBadge color="neutral" variant="soft" size="xs">{{ filtered.length }} events</UBadge>
          </div>
        </template>

        <div class="px-5 pb-5">
          <div class="rounded-2xl overflow-hidden ring-1 ring-gray-200/70 dark:ring-gray-800/60">
            <UTable
              :data="filtered"
              :columns="columns"
              :ui="{
                thead: 'bg-white dark:bg-gray-900/60',
                th: 'text-xs font-semibold text-gray-600 dark:text-gray-300',
                tr: 'group hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors',
                td: 'py-4'
              }"
              :empty-state="{
                icon: 'i-lucide-inbox',
                label: 'No activity found',
                description: 'Try clearing filters or searching another keyword.'
              }"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Detail modal -->
    <UModal v-model:open="isDetailOpen" :title="'Activity details'" :description="'More context for audit and troubleshooting.'" :ui="{ content: 'sm:max-w-2xl' }">
      <template #body>
        <div class="space-y-4">
          <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-900/20 p-4">
            <div class="flex items-start gap-3">
              <div class="h-10 w-10 rounded-2xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center">
                <UIcon :name="selected?.icon || 'i-lucide-activity'" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <div class="font-semibold text-gray-900 dark:text-white truncate">{{ selected?.user || '—' }}</div>
                  <UBadge :color="badgeColorForType(selected?.type)" variant="soft" size="xs">{{ titleCase(selected?.type || 'general') }}</UBadge>
                  <UBadge :color="badgeColorForStatus(selected?.status)" variant="soft" size="xs">{{ titleCase(selected?.status || 'success') }}</UBadge>
                </div>
                <div class="mt-1 text-sm text-gray-700 dark:text-gray-200">
                  {{ selected?.action || '—' }}
                </div>
                <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Time: <span class="font-semibold text-gray-900 dark:text-white">{{ selected?.time || '—' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/60 dark:bg-gray-950/30 p-4">
              <div class="text-xs text-gray-500 dark:text-gray-400">IP Address</div>
              <div class="mt-1 font-semibold text-gray-900 dark:text-white">{{ selected?.ip || '—' }}</div>
            </div>
            <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/60 dark:bg-gray-950/30 p-4">
              <div class="text-xs text-gray-500 dark:text-gray-400">Target</div>
              <div class="mt-1 font-semibold text-gray-900 dark:text-white">{{ selected?.target || '—' }}</div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/60 dark:bg-gray-950/30 p-4">
            <div class="flex items-center justify-between gap-2">
              <div class="text-sm font-semibold text-gray-900 dark:text-white">Metadata</div>
              <UButton size="xs" color="neutral" variant="outline" icon="i-lucide-copy" :disabled="!selected?.meta" @click="copyText(JSON.stringify(selected?.meta || {}, null, 2))">
                Copy
              </UButton>
            </div>

            <pre class="mt-3 text-xs text-gray-700 dark:text-gray-200 whitespace-pre-wrap break-words">
{{ selected?.meta ? JSON.stringify(selected.meta, null, 2) : '—' }}
            </pre>
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex items-center justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="close">Close</UButton>
          <UButton color="primary" icon="i-lucide-copy" :disabled="!selected" @click="copyText(`${selected?.user}: ${selected?.action} (${selected?.time})`)">
            Copy summary
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
