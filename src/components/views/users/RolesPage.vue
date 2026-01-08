<script setup lang="ts">
import { computed, h, reactive, ref, resolveComponent, watch } from 'vue'
import type { DropdownMenuItem, TableColumn, TabsItem } from '@nuxt/ui'
import { roles as initialRoles } from '@/mock/users'

type Role = {
  id: number
  name: string
  description: string
  permissions: string[]
  users: number
}

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UIcon = resolveComponent('UIcon')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()

/** -----------------------
 * Data
 * ---------------------- */
const roles = ref<Role[]>(
  (Array.isArray(initialRoles) ? (initialRoles as any[]) : []).map((r: any) => ({
    id: Number(r.id),
    name: String(r.name ?? ''),
    description: String(r.description ?? ''),
    permissions: Array.isArray(r.permissions) ? r.permissions : [],
    users: Number(r.users ?? 0)
  }))
)

/** -----------------------
 * Tabs
 * ---------------------- */
const tabs: TabsItem[] = [
  { label: 'Overview', icon: 'i-lucide-layout-grid', value: 'overview' },
  { label: 'Manage', icon: 'i-lucide-settings', value: 'manage' }
]
const activeTab = ref<'overview' | 'manage'>('overview')

/** -----------------------
 * Filters
 * ---------------------- */
const query = ref('')
const sortKey = ref<'name' | 'users' | 'perms'>('users')
const sortDir = ref<'asc' | 'desc'>('desc')

const filteredRoles = computed(() => {
  const q = query.value.trim().toLowerCase()
  let rows = [...roles.value]

  if (q) {
    rows = rows.filter((r) => {
      const hay = `${r.name} ${r.description} ${(r.permissions || []).join(' ')}`.toLowerCase()
      return hay.includes(q)
    })
  }

  const dir = sortDir.value === 'asc' ? 1 : -1
  rows.sort((a, b) => {
    if (sortKey.value === 'name') return dir * a.name.localeCompare(b.name)
    if (sortKey.value === 'perms') return dir * ((a.permissions?.length || 0) - (b.permissions?.length || 0))
    return dir * ((a.users || 0) - (b.users || 0))
  })

  return rows
})

/** -----------------------
 * Stats + insights
 * ---------------------- */
const stats = computed(() => {
  const totalRoles = roles.value.length
  const totalUsers = roles.value.reduce((sum, r) => sum + (r.users || 0), 0)
  const avgPermissions =
    totalRoles > 0
      ? Math.round(roles.value.reduce((sum, r) => sum + (r.permissions?.length || 0), 0) / totalRoles)
      : 0

  const mostUsed = [...roles.value].sort((a, b) => (b.users || 0) - (a.users || 0))[0]
  const mostPrivileged = [...roles.value].sort((a, b) => (b.permissions?.length || 0) - (a.permissions?.length || 0))[0]

  return {
    totalRoles,
    totalUsers,
    avgPermissions,
    mostUsedName: mostUsed?.name || '—',
    mostUsedUsers: mostUsed?.users || 0,
    mostPrivilegedName: mostPrivileged?.name || '—',
    mostPrivilegedPerms: mostPrivileged?.permissions?.length || 0
  }
})

function riskLabel(role: Role) {
  const perms = role.permissions?.length || 0
  // simple heuristic (informative only)
  if (perms >= 10 || role.name.toLowerCase().includes('admin')) return { label: 'High access', color: 'warning' as const }
  if (perms >= 6) return { label: 'Medium access', color: 'info' as const }
  return { label: 'Low access', color: 'success' as const }
}

/** -----------------------
 * Permissions catalog (grouped)
 * ---------------------- */
const permissionGroups = [
  {
    id: 'users',
    label: 'Users',
    icon: 'i-lucide-users',
    items: ['Manage Users', 'Create Users', 'Edit Users', 'Delete Users']
  },
  {
    id: 'roles',
    label: 'Roles & Access',
    icon: 'i-lucide-shield',
    items: ['Manage Roles', 'Manage Permissions']
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: 'i-lucide-credit-card',
    items: ['Manage Billing']
  },
  {
    id: 'data',
    label: 'Data & Reports',
    icon: 'i-lucide-bar-chart-3',
    items: ['View Reports', 'Export Data', 'View Analytics']
  },
  {
    id: 'system',
    label: 'System',
    icon: 'i-lucide-settings',
    items: ['View Dashboard', 'Manage Settings']
  }
] as const

const allPermissions = computed(() => permissionGroups.flatMap((g) => [...g.items]))

/** -----------------------
 * Modal state (Create/Edit)
 * ---------------------- */
const isRoleModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

const editingId = ref<number | null>(null)
const deletingId = ref<number | null>(null)

const isEditing = computed(() => editingId.value != null)
const roleForm = reactive<{
  name: string
  description: string
  permissions: string[] 
}>({
  name: '',
  description: '',
  permissions: [] as const as string[]
})
const permissionQuery = ref('')

const modalTitle = computed(() => (isEditing.value ? 'Edit role' : 'Create role'))
const modalDesc = computed(() =>
  isEditing.value
    ? 'Update role details and access permissions.'
    : 'Create a role and choose what it can access.'
)

function openCreate() {
  editingId.value = null
  Object.assign(roleForm, { name: '', description: '', permissions: [] })
  permissionQuery.value = ''
  isRoleModalOpen.value = true
}

function openEdit(id: number) {
  const r = roles.value.find((x) => x.id === id)
  if (!r) return
  editingId.value = id
  Object.assign(roleForm, {
    name: r.name,
    description: r.description,
    permissions: [...(r.permissions || [])]
  })
  permissionQuery.value = ''
  isRoleModalOpen.value = true
}

/** -----------------------
 * Permission helpers
 * ---------------------- */
const filteredGroups = computed(() => {
  const q = permissionQuery.value.trim().toLowerCase()
  if (!q) return permissionGroups

  return permissionGroups
    .map((g) => ({
      ...g,
      items: g.items.filter((p) => p.toLowerCase().includes(q))
    }))
    .filter((g) => g.items.length > 0)
})

function isPermSelected(p: string) {
  return roleForm.permissions.includes(p)
}
function togglePerm(p: string, checked: boolean) {
  if (checked) {
    if (!roleForm.permissions.includes(p)) roleForm.permissions.push(p)
  } else {
    roleForm.permissions = roleForm.permissions.filter((x) => x !== p)
  }
}
function groupAllSelected(groupId: string) {
  const group = permissionGroups.find((g) => g.id === groupId)
  if (!group) return false
  return group.items.every((p) => roleForm.permissions.includes(p))
}
function toggleGroup(groupId: string) {
  const group = permissionGroups.find((g) => g.id === groupId)
  if (!group) return
  const allSel = group.items.every((p) => roleForm.permissions.includes(p))
  if (allSel) {
  } else {
    const next = new Set(roleForm.permissions)
    group.items.forEach((p) => next.add(p))
    roleForm.permissions = [...next]
  }
}
function toggleSelectAll() {
  const allSel = roleForm.permissions.length === allPermissions.value.length
  roleForm.permissions = allSel ? [] : [...allPermissions.value]
}
function removeChip(p: string) {
  roleForm.permissions = roleForm.permissions.filter((x) => x !== p)
}

/** -----------------------
 * CRUD validate + submit
 * ---------------------- */
function validateRoleForm() {
  const name = roleForm.name.trim()
  if (!name) return 'Role name is required.'
  if (roleForm.permissions.length === 0) return 'Pick at least 1 permission.'

  const exists = roles.value.some(
    (r) => r.name.toLowerCase() === name.toLowerCase() && r.id !== editingId.value
  )
  if (exists) return 'Role name already exists.'
  return null
}

function submitRole() {
  const err = validateRoleForm()
  if (err) {
    toast.add({ title: 'Validation error', description: err, color: 'error' })
    return
  }

  const payload = {
    name: roleForm.name.trim(),
    description: roleForm.description.trim(),
    permissions: [...roleForm.permissions]
  }

  if (editingId.value != null) {
    roles.value = roles.value.map((r) =>
      r.id === editingId.value ? { ...r, ...payload } : r
    )
    toast.add({ title: 'Role updated', description: `"${payload.name}" updated.`, color: 'success' })
  } else {
    roles.value = [
      {
        id: Date.now(),
        users: 0,
        ...payload
      },
      ...roles.value
    ]
    toast.add({ title: 'Role created', description: `"${payload.name}" created.`, color: 'success' })
  }

  isRoleModalOpen.value = false
}

function askDelete(id: number) {
  deletingId.value = id
  isDeleteModalOpen.value = true
}
const deletingRole = computed(() => roles.value.find((r) => r.id === deletingId.value) || null)

function confirmDelete() {
  const r = deletingRole.value
  if (!r) return

  if (r.users > 0) {
    toast.add({
      title: 'Cannot delete',
      description: 'This role is still assigned to users. Reassign them first.',
      color: 'error'
    })
    return
  }

  roles.value = roles.value.filter((x) => x.id !== r.id)
  toast.add({ title: 'Role deleted', description: `"${r.name}" removed.`, color: 'success' })
  isDeleteModalOpen.value = false
  deletingId.value = null
}

watch(isRoleModalOpen, (open) => {
  if (!open) {
    editingId.value = null
    permissionQuery.value = ''
    Object.assign(roleForm, { name: '', description: '', permissions: [] })
  }
})
watch(isDeleteModalOpen, (open) => {
  if (!open) deletingId.value = null
})

/** -----------------------
 * Table columns (Manage tab)
 * ---------------------- */
const columns: TableColumn<Role>[] = [
  {
    accessorKey: 'name',
    header: 'Role',
    cell: ({ row }) => {
      const r = row.original
      const risk = riskLabel(r)

      return h('div', { class: 'flex items-start gap-3 min-w-0' }, [
        h('div', { class: 'mt-0.5 h-9 w-9 rounded-2xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center shrink-0' }, [
          h(UIcon as any, { name: 'i-lucide-shield', class: 'w-4 h-4 text-primary-600 dark:text-primary-400' })
        ]),
        h('div', { class: 'min-w-0' }, [
          h('div', { class: 'flex items-center gap-2 min-w-0' }, [
            h('div', { class: 'font-semibold text-gray-900 dark:text-white truncate' }, r.name),
            h(UBadge as any, { color: risk.color, variant: 'soft', size: 'xs' }, () => risk.label)
          ]),
          h('div', { class: 'text-xs text-gray-500 dark:text-gray-400 line-clamp-1' }, r.description || 'No description')
        ])
      ])
    }
  },
  {
    accessorKey: 'permissions',
    header: 'Permissions',
    cell: ({ row }) => {
      const perms = row.original.permissions || []
      const shown = perms.slice(0, 2)
      const rest = perms.length - shown.length

      return h('div', { class: 'flex items-center gap-2 flex-wrap' }, [
        h(UBadge as any, { color: 'neutral', variant: 'soft', size: 'xs' }, () => `${perms.length} total`),
        ...shown.map((p) => h(UBadge as any, { color: 'neutral', variant: 'outline', size: 'xs' }, () => p)),
        rest > 0 ? h(UBadge as any, { color: 'neutral', variant: 'soft', size: 'xs' }, () => `+${rest}`) : null
      ].filter(Boolean))
    }
  },
  {
    accessorKey: 'users',
    header: () => h('div', { class: 'text-right' }, 'Users'),
    meta: { class: { th: 'w-28 text-right', td: 'text-right align-middle' } },
    cell: ({ row }) => h('div', { class: 'font-semibold text-gray-900 dark:text-white' }, String(row.original.users ?? 0))
  },
  {
    id: 'actions',
    header: '',
    meta: { class: { th: 'w-16 text-right', td: 'text-right align-middle' } },
    cell: ({ row }) => {
      const r = row.original
      const items: DropdownMenuItem[][] = [
        [{ label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => openEdit(r.id) }],
        [{ label: 'Delete', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => askDelete(r.id) }]
      ]

      return h('div', { class: 'flex justify-end' }, [
        h(UDropdownMenu as any, { items, content: { align: 'end' } }, () =>
          h(UButton as any, { icon: 'i-lucide-ellipsis-vertical', color: 'neutral', variant: 'ghost', size: 'sm' })
        )
      ])
    }
  }
]

const sortItems = [
  { label: 'Users', value: 'users' },
  { label: 'Permissions', value: 'perms' },
  { label: 'Name', value: 'name' }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Header -->
      <div class="rounded-3xl border border-gray-200/70 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/50 backdrop-blur p-5 sm:p-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <div class="h-10 w-10 rounded-2xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center">
                <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Roles & permissions</h1>
                <p class="text-sm text-gray-600 dark:text-gray-400">Control access to the product in a clear, auditable way.</p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 pt-2">
              <UBadge color="neutral" variant="soft" size="xs">{{ stats.totalRoles }} roles</UBadge>
              <UBadge color="primary" variant="soft" size="xs">{{ stats.totalUsers }} users assigned</UBadge>
              <UBadge color="success" variant="soft" size="xs">Avg {{ stats.avgPermissions }} perms/role</UBadge>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
            <UInput
              v-model="query"
              icon="i-lucide-search"
              placeholder="Search role, permission, description…"
              size="sm"
              class="w-full sm:w-[320px]"
            />

            <USelectMenu
              v-model="sortKey"
              :items="sortItems"
              value-key="value"
              label-key="label"
              size="sm"
              color="neutral"
              variant="outline"
              class="w-full sm:w-44"
            />

            <UButton
              size="sm"
              color="neutral"
              variant="outline"
              :icon="sortDir === 'desc' ? 'i-lucide-arrow-down' : 'i-lucide-arrow-up'"
              @click="sortDir = sortDir === 'desc' ? 'asc' : 'desc'"
              aria-label="Toggle sort direction"
            />

            <UButton color="primary" icon="i-lucide-plus" size="sm" @click="openCreate">
              New role
            </UButton>
          </div>
        </div>

        <!-- Insights -->
        <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/20 p-4">
            <div class="text-xs text-gray-500 dark:text-gray-400">Most assigned role</div>
            <div class="mt-1 flex items-center justify-between gap-3">
              <div class="font-semibold text-gray-900 dark:text-white truncate">{{ stats.mostUsedName }}</div>
              <UBadge color="primary" variant="soft" size="xs">{{ stats.mostUsedUsers }} users</UBadge>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/20 p-4">
            <div class="text-xs text-gray-500 dark:text-gray-400">Most privileged role</div>
            <div class="mt-1 flex items-center justify-between gap-3">
              <div class="font-semibold text-gray-900 dark:text-white truncate">{{ stats.mostPrivilegedName }}</div>
              <UBadge color="warning" variant="soft" size="xs">{{ stats.mostPrivilegedPerms }} perms</UBadge>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/20 p-4">
            <div class="text-xs text-gray-500 dark:text-gray-400">Best practice</div>
            <div class="mt-1 text-sm text-gray-700 dark:text-gray-200">
              Keep roles minimal. Grant extra access via a dedicated “Admin” role only.
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <UTabs v-model="activeTab" :items="tabs" variant="link" class="w-full">
        <template #content="{ item }">
          <!-- OVERVIEW -->
          <div v-if="item.value === 'overview'" class="space-y-4">
            <div v-if="filteredRoles.length === 0" class="py-16 text-center">
              <UIcon name="i-lucide-shield-off" class="w-12 h-12 mx-auto text-gray-400" />
              <div class="mt-4 font-semibold text-gray-900 dark:text-white">No roles found</div>
              <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">Try a different search or create a new role.</div>
              <div class="mt-6">
                <UButton color="primary" variant="soft" icon="i-lucide-plus" @click="openCreate">Create role</UButton>
              </div>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <UCard
                v-for="r in filteredRoles"
                :key="r.id"
                class="rounded-3xl ring-1 ring-gray-200/60 dark:ring-gray-800/60 hover:shadow-lg transition-shadow"
                :ui="{ body: 'p-5 space-y-4' }"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-shield" class="w-4 h-4 text-primary-500" />
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">{{ r.name }}</h3>
                    </div>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {{ r.description || 'No description' }}
                    </p>
                  </div>

                  <div class="flex flex-col items-end gap-2">
                    <UBadge color="neutral" variant="soft" size="xs">{{ r.users }} users</UBadge>
                    <UBadge :color="riskLabel(r).color" variant="soft" size="xs">{{ riskLabel(r).label }}</UBadge>
                  </div>
                </div>

                <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-gray-50/40 dark:bg-gray-900/20 p-3">
                  <div class="flex items-center justify-between">
                    <div class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Permissions</div>
                    <UBadge color="primary" variant="soft" size="xs">{{ r.permissions.length }}</UBadge>
                  </div>

                  <div class="mt-2 flex flex-wrap gap-2">
                    <UBadge
                      v-for="p in r.permissions.slice(0, 4)"
                      :key="p"
                      color="neutral"
                      variant="soft"
                      size="xs"
                    >
                      {{ p }}
                    </UBadge>
                    <UBadge v-if="r.permissions.length > 4" color="neutral" variant="outline" size="xs">
                      +{{ r.permissions.length - 4 }}
                    </UBadge>
                  </div>
                </div>

                <div class="flex gap-2 pt-1">
                  <UButton size="sm" color="primary" variant="soft" icon="i-lucide-pencil" class="flex-1" @click="openEdit(r.id)">
                    Edit
                  </UButton>
                  <UButton
                    size="sm"
                    color="neutral"
                    variant="outline"
                    icon="i-lucide-trash-2"
                    :disabled="r.users > 0"
                    @click="askDelete(r.id)"
                    title="Cannot delete role with assigned users"
                  >
                    Delete
                  </UButton>
                </div>

                <p v-if="r.users > 0" class="text-xs text-gray-500 dark:text-gray-400">
                  Tip: reassign users before deleting this role.
                </p>
              </UCard>
            </div>
          </div>

          <!-- MANAGE -->
          <div v-else class="space-y-4">
            <UCard class="rounded-3xl" :ui="{ body: 'p-0' }">
              <template #header>
                <div class="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 class="text-base font-semibold text-gray-900 dark:text-white">All roles</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Quick edits and governance-friendly overview.</p>
                  </div>

                  <div class="flex items-center gap-2">
                    <UBadge color="neutral" variant="soft" size="xs">{{ filteredRoles.length }} roles</UBadge>
                    <UButton color="primary" variant="soft" size="sm" icon="i-lucide-plus" @click="openCreate">Add role</UButton>
                  </div>
                </div>
              </template>

              <div class="px-5 pb-5">
                <div class="rounded-2xl overflow-hidden ring-1 ring-gray-200/70 dark:ring-gray-800/60">
                  <UTable
                    :data="filteredRoles"
                    :columns="columns"
                    :ui="{
                      thead: 'bg-white dark:bg-gray-900/60',
                      th: 'text-xs font-semibold text-gray-600 dark:text-gray-300',
                      tr: 'group hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors',
                      td: 'py-4'
                    }"
                    :empty-state="{
                      icon: 'i-lucide-shield-off',
                      label: 'No roles found',
                      description: 'Create your first role to get started'
                    }"
                  />
                </div>
              </div>
            </UCard>
          </div>
        </template>
      </UTabs>
    </div>

    <!-- Create/Edit modal -->
    <UModal
      v-model:open="isRoleModalOpen"
      scrollable
      :title="modalTitle"
      :description="modalDesc"
      :ui="{ content: 'sm:max-w-3xl', body: 'p-0' }"
    >
      <template #body>
        <div class="p-5 sm:p-6 space-y-6">
          <!-- Role details -->
          <div class="rounded-3xl border border-gray-200/70 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/40 backdrop-blur p-4 sm:p-5">
            <div class="flex items-start gap-3">
              <div class="h-10 w-10 rounded-2xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center">
                <UIcon :name="isEditing ? 'i-lucide-pencil' : 'i-lucide-plus'" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">Role details</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Name, description, and access scope.</p>
                  </div>

                  <div class="flex items-center gap-2">
                    <UBadge color="primary" variant="soft" size="xs">{{ roleForm.permissions.length }} selected</UBadge>
                    <UBadge color="neutral" variant="soft" size="xs">{{ allPermissions.length }} available</UBadge>
                  </div>
                </div>

                <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <UFormGroup label="Role name" required>
                    <UInput v-model="roleForm.name" placeholder="e.g. Admin, Editor, Viewer" icon="i-lucide-shield" />
                  </UFormGroup>

                  <UFormGroup label="Access level">
                    <UInput
                      :model-value="roleForm.permissions.length >= 10 ? 'High' : roleForm.permissions.length >= 6 ? 'Medium' : 'Low'"
                      disabled
                      icon="i-lucide-gauge"
                    />
                  </UFormGroup>

                  <div class="sm:col-span-2">
                    <UFormGroup label="Description">
                      <UTextarea v-model="roleForm.description" :rows="3" placeholder="Short explanation for this role…" />
                    </UFormGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Permissions -->
          <div class="rounded-3xl border border-gray-200/70 dark:border-gray-800/60 bg-gray-50/40 dark:bg-gray-900/20 p-4 sm:p-5 space-y-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-2">
                <div class="h-9 w-9 rounded-2xl bg-white dark:bg-gray-950/40 ring-1 ring-gray-200/70 dark:ring-gray-800/60 flex items-center justify-center">
                  <UIcon name="i-lucide-key-round" class="w-4 h-4 text-gray-700 dark:text-gray-200" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">Permissions</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Search, group, and select quickly.</p>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
                <UInput
                  v-model="permissionQuery"
                  icon="i-lucide-search"
                  size="sm"
                  placeholder="Search permissions…"
                  class="w-full sm:w-72"
                />
                <UButton size="sm" color="neutral" variant="soft" :icon="roleForm.permissions.length === allPermissions.length ? 'i-lucide-square' : 'i-lucide-check-square'" @click="toggleSelectAll">
                  {{ roleForm.permissions.length === allPermissions.length ? 'Unselect all' : 'Select all' }}
                </UButton>
              </div>
            </div>

            <div class="space-y-3">
              <div
                v-for="g in filteredGroups"
                :key="g.id"
                class="rounded-2xl bg-white/80 dark:bg-gray-950/30 ring-1 ring-gray-200/70 dark:ring-gray-800/60 overflow-hidden"
              >
                <div class="p-3 sm:p-4 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <UIcon :name="g.icon" class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ g.label }}</p>
                    <UBadge color="neutral" variant="soft" size="xs">{{ g.items.length }}</UBadge>
                  </div>

                  <UButton size="xs" color="neutral" variant="outline" :icon="groupAllSelected(g.id) ? 'i-lucide-square' : 'i-lucide-check-square'" @click="toggleGroup(g.id)">
                    {{ groupAllSelected(g.id) ? 'Unselect group' : 'Select group' }}
                  </UButton>
                </div>

                <div class="px-3 sm:px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div v-for="p in g.items" :key="p" class="rounded-xl border border-gray-200/70 dark:border-gray-800/60 bg-white/60 dark:bg-gray-950/20 px-3 py-2 flex items-center justify-between">
                    <div class="text-sm text-gray-800 dark:text-gray-200 truncate">{{ p }}</div>
                    <component
                      :is="UCheckbox"
                      :model-value="isPermSelected(p)"
                      @update:model-value="(v: boolean) => togglePerm(p, v)"
                      aria-label="Toggle permission"
                    />
                  </div>
                </div>
              </div>

              <div v-if="filteredGroups.length === 0" class="py-10 text-center">
                <UIcon name="i-lucide-search-x" class="w-10 h-10 mx-auto text-gray-400" />
                <p class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No results</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Try another keyword.</p>
              </div>
            </div>

            <!-- Selected chips -->
            <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/30 p-3 sm:p-4">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-badge-check" class="w-4 h-4 text-success-500" />
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">Selected</p>
                  <UBadge color="primary" variant="soft" size="xs">{{ roleForm.permissions.length }}</UBadge>
                </div>
                <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-x" :disabled="roleForm.permissions.length === 0" @click="roleForm.permissions = []">
                  Clear
                </UButton>
              </div>

              <div class="mt-3 flex flex-wrap gap-2">
                <UBadge
                  v-for="p in roleForm.permissions"
                  :key="p"
                  color="neutral"
                  variant="soft"
                  size="xs"
                  class="cursor-pointer select-none hover:opacity-90"
                  @click="removeChip(p)"
                >
                  {{ p }}
                  <UIcon name="i-lucide-x" class="w-3 h-3 ml-1" />
                </UBadge>

                <p v-if="roleForm.permissions.length === 0" class="text-xs text-gray-500 dark:text-gray-400">
                  No permissions selected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
          <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <UIcon name="i-lucide-info" class="w-4 h-4" />
            <span>Click a selected chip to remove it.</span>
          </div>

          <div class="flex flex-col-reverse sm:flex-row gap-2 justify-end">
            <UButton color="neutral" variant="outline" @click="close">Cancel</UButton>
            <UButton
              color="primary"
              icon="i-lucide-save"
              :disabled="!roleForm.name.trim() || roleForm.permissions.length === 0"
              @click="submitRole"
            >
              {{ isEditing ? 'Save changes' : 'Create role' }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Delete modal -->
    <UModal
      v-model:open="isDeleteModalOpen"
      title="Delete role"
      description="This action cannot be undone."
      :ui="{ content: 'sm:max-w-md' }"
    >
      <template #body>
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div class="h-10 w-10 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
              <UIcon name="i-lucide-trash-2" class="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>

            <div class="flex-1">
              <p class="text-sm text-gray-700 dark:text-gray-200">
                Delete <span class="font-semibold">{{ deletingRole?.name || 'this role' }}</span>?
              </p>

              <div class="mt-3 rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-gray-50/60 dark:bg-gray-900/20 p-3 space-y-1">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Users assigned</span>
                  <span class="font-semibold text-gray-900 dark:text-white">{{ deletingRole?.users ?? 0 }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Permissions</span>
                  <span class="font-semibold text-gray-900 dark:text-white">{{ deletingRole?.permissions?.length ?? 0 }}</span>
                </div>
              </div>

              <p v-if="(deletingRole?.users || 0) > 0" class="mt-3 text-xs text-red-600 dark:text-red-400">
                This role has assigned users. Reassign them first.
              </p>
            </div>
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex items-center justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="close">Cancel</UButton>
          <UButton
            color="error"
            icon="i-lucide-trash-2"
            :disabled="(deletingRole?.users || 0) > 0"
            @click="() => { confirmDelete(); close() }"
          >
            Delete
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
