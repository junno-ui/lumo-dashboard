<script setup lang="ts">
import { ref, reactive, computed, h, resolveComponent, watch } from 'vue'
import type { TabsItem } from '@nuxt/ui'
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

const toast = useToast()

const roles = ref<Role[]>(
  (initialRoles as any[]).map((r: any) => ({
    id: Number(r.id),
    name: String(r.name ?? ''),
    description: String(r.description ?? ''),
    permissions: Array.isArray(r.permissions) ? r.permissions : [],
    users: Number(r.users ?? 0)
  }))
)

const tabs: TabsItem[] = [
  { label: 'Overview', icon: 'i-lucide-layout-grid', value: 'overview' },
  { label: 'Manage Roles', icon: 'i-lucide-settings', value: 'manage' }
]

const activeTab = ref<'overview' | 'manage'>('overview')
const searchQuery = ref('')

const isRoleModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

const editingRole = ref<Role | null>(null)
const deletingRole = ref<Role | null>(null)

const availablePermissions = [
  'View Dashboard',
  'Manage Users',
  'Create Users',
  'Edit Users',
  'Delete Users',
  'Manage Roles',
  'Manage Permissions',
  'View Reports',
  'Export Data',
  'Manage Settings',
  'View Analytics',
  'Manage Billing'
]

const roleForm = reactive<{
  id?: number
  name: string
  description: string
  permissions: string[]
}>({
  id: undefined,
  name: '',
  description: '',
  permissions: []
})

const permissionQuery = ref('')

const isEditing = computed(() => !!editingRole.value)

const filteredRoles = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return roles.value
  return roles.value.filter((r) => {
    const nameHit = r.name.toLowerCase().includes(q)
    const descHit = (r.description || '').toLowerCase().includes(q)
    const permHit = (r.permissions || []).some((p) => p.toLowerCase().includes(q))
    return nameHit || descHit || permHit
  })
})

const stats = computed(() => {
  const totalRoles = roles.value.length
  const totalUsers = roles.value.reduce((sum, r) => sum + (r.users || 0), 0)
  const avgPermissions =
    totalRoles > 0
      ? Math.round(
          roles.value.reduce((sum, r) => sum + ((r.permissions || []).length || 0), 0) / totalRoles
        )
      : 0

  return { totalRoles, totalUsers, avgPermissions }
})

const filteredAvailablePermissions = computed(() => {
  const q = permissionQuery.value.trim().toLowerCase()
  if (!q) return availablePermissions
  return availablePermissions.filter((p) => p.toLowerCase().includes(q))
})

const allSelected = computed(() => roleForm.permissions.length === availablePermissions.length)

// ----------------------- Table columns
const columns = [
  {
    accessorKey: 'name',
    header: 'Role',
    cell: ({ row }: any) => {
      const r: Role = row.original
      return h('div', { class: 'flex items-start gap-3' }, [
        h('div', { class: 'mt-0.5' }, [
          h(UIcon as any, { name: 'i-lucide-shield', class: 'w-4 h-4 text-primary-500' })
        ]),
        h('div', { class: 'min-w-0' }, [
          h('div', { class: 'font-semibold text-gray-900 dark:text-white truncate' }, r.name),
          r.description
            ? h('div', { class: 'text-xs text-gray-500 dark:text-gray-400 line-clamp-1' }, r.description)
            : h('div', { class: 'text-xs text-gray-400 dark:text-gray-500' }, 'No description')
        ])
      ])
    }
  },
  {
    accessorKey: 'permissions',
    header: 'Permissions',
    cell: ({ row }: any) => {
      const perms: string[] = row.original.permissions || []
      const shown = perms.slice(0, 3)
      const rest = perms.length - shown.length

      return h(
        'div',
        { class: 'flex items-center gap-2 flex-wrap' },
        [
          h(UBadge as any, { color: 'primary', variant: 'soft', size: 'xs' }, () => `${perms.length} total`),
          ...shown.map((p) =>
            h(UBadge as any, { color: 'neutral', variant: 'soft', size: 'xs' }, () => p)
          ),
          rest > 0 ? h(UBadge as any, { color: 'neutral', variant: 'outline', size: 'xs' }, () => `+${rest}`) : null
        ].filter(Boolean)
      )
    }
  },
  {
    accessorKey: 'users',
    header: () => h('div', { class: 'text-right' }, 'Users'),
    meta: { class: { th: 'text-right', td: 'text-right' } },
    cell: ({ row }: any) =>
      h('div', { class: 'inline-flex items-center justify-end gap-2 w-full' }, [
        h(UIcon as any, { name: 'i-lucide-users', class: 'w-4 h-4 text-gray-400' }),
        h('span', { class: 'font-semibold text-gray-900 dark:text-white' }, String(row.original.users ?? 0))
      ])
  },
  {
    id: 'actions',
    header: '',
    meta: { class: { th: 'w-16 text-right', td: 'text-right' } },
    cell: ({ row }: any) => {
      const r: Role = row.original
      const items = [
        [{ label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => openEdit(r.id) }],
        [{ label: 'Delete', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => askDelete(r.id) }]
      ]

      return h(
        'div',
        { class: 'flex justify-end' },
        h(UDropdownMenu as any, { items }, () =>
          h(UButton as any, {
            icon: 'i-lucide-ellipsis-vertical',
            color: 'neutral',
            variant: 'ghost',
            size: 'sm'
          })
        )
      )
    }
  }
]

// ----------------------- Helpers
function resetRoleForm() {
  roleForm.id = undefined
  roleForm.name = ''
  roleForm.description = ''
  roleForm.permissions = []
  permissionQuery.value = ''
}

function toggleSelectAll() {
  roleForm.permissions = allSelected.value ? [] : [...availablePermissions]
}

// ----------------------- CRUD
function openCreate() {
  editingRole.value = null
  resetRoleForm()
  isRoleModalOpen.value = true
}

function openEdit(roleId: number) {
  const role = roles.value.find((r) => r.id === roleId)
  if (!role) return

  editingRole.value = role
  roleForm.id = role.id
  roleForm.name = role.name
  roleForm.description = role.description
  roleForm.permissions = [...(role.permissions || [])]
  permissionQuery.value = ''

  isRoleModalOpen.value = true
}

function askDelete(roleId: number) {
  const role = roles.value.find((r) => r.id === roleId)
  if (!role) return

  deletingRole.value = role
  isDeleteModalOpen.value = true
}

function validateRoleForm() {
  const name = roleForm.name.trim()
  if (!name) return 'Role name is required.'
  if (roleForm.permissions.length === 0) return 'Pick at least 1 permission.'

  const exists = roles.value.some(
    (r) => r.name.toLowerCase() === name.toLowerCase() && r.id !== roleForm.id
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

  const payload: Role = {
    id: roleForm.id ?? Date.now(),
    name: roleForm.name.trim(),
    description: roleForm.description.trim(),
    permissions: [...roleForm.permissions],
    users: 0
  }

  if (isEditing.value && editingRole.value) {
    roles.value = roles.value.map((r) =>
      r.id === payload.id
        ? { ...r, name: payload.name, description: payload.description, permissions: payload.permissions }
        : r
    )
    toast.add({ title: 'Role updated', description: `"${payload.name}" has been updated.`, color: 'success' })
  } else {
    roles.value = [{ ...payload, users: 0 }, ...roles.value]
    toast.add({ title: 'Role created', description: `"${payload.name}" has been created.`, color: 'success' })
  }

  isRoleModalOpen.value = false
}

function confirmDelete() {
  if (!deletingRole.value) return

  const name = deletingRole.value.name
  roles.value = roles.value.filter((r) => r.id !== deletingRole.value!.id)

  toast.add({ title: 'Role deleted', description: `"${name}" has been removed.`, color: 'success' })
  isDeleteModalOpen.value = false
}

// Auto cleanup when modals close
watch(isRoleModalOpen, (open) => {
  if (!open) {
    editingRole.value = null
    resetRoleForm()
  }
})

watch(isDeleteModalOpen, (open) => {
  if (!open) deletingRole.value = null
})
</script>

<template>
  <div class="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-950">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Header -->
      <div
        class="rounded-3xl border border-gray-200/70 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/60 backdrop-blur p-5 sm:p-6"
      >
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <div
                class="h-9 w-9 rounded-2xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center"
              >
                <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Roles & Permissions
              </h1>
            </div>

            <p class="text-sm text-gray-600 dark:text-gray-400">
              Manage user roles and their access permissions.
            </p>

            <div class="flex flex-wrap items-center gap-2 pt-2">
              <UBadge color="neutral" variant="soft" size="xs">
                {{ stats.totalRoles }} roles
              </UBadge>
              <UBadge color="primary" variant="soft" size="xs">
                {{ stats.totalUsers }} users
              </UBadge>
              <UBadge color="success" variant="soft" size="xs">
                Avg {{ stats.avgPermissions }} permissions
              </UBadge>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Search roles, descriptions, permissions..."
              size="sm"
              class="w-full sm:w-[320px]"
            />
            <div class="flex gap-2">
              <UButton
                color="neutral"
                variant="soft"
                size="sm"
                icon="i-lucide-x"
                :disabled="!searchQuery"
                @click="searchQuery = ''"
              >
                Clear
              </UButton>
              <UButton color="primary" icon="i-lucide-plus" size="sm" @click="openCreate">
                New Role
              </UButton>
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
              <UIcon name="i-lucide-inbox" class="w-12 h-12 mx-auto text-gray-400" />
              <div class="mt-4 font-semibold text-gray-900 dark:text-white">No roles found</div>
              <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try a different search or create a new role
              </div>
              <div class="mt-6">
                <UButton color="primary" variant="soft" icon="i-lucide-plus" @click="openCreate">
                  Create role
                </UButton>
              </div>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <UCard
                v-for="r in filteredRoles"
                :key="r.id"
                :ui="{ body: 'space-y-4' }"
                class="rounded-3xl hover:shadow-lg transition-shadow duration-200 ring-1 ring-gray-200/60 dark:ring-gray-800/60"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-shield" class="w-4 h-4 text-primary-500" />
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {{ r.name }}
                      </h3>
                    </div>

                    <p v-if="r.description" class="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {{ r.description }}
                    </p>
                    <p v-else class="mt-1 text-sm text-gray-400 dark:text-gray-500">
                      No description
                    </p>
                  </div>

                  <div class="flex flex-col items-end gap-2">
                    <UBadge color="neutral" variant="soft" size="sm">
                      {{ r.users }} users
                    </UBadge>
                    <UBadge color="primary" variant="soft" size="xs">
                      {{ r.permissions.length }} perms
                    </UBadge>
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                      Permissions
                    </span>
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-pencil"
                      @click="openEdit(r.id)"
                    >
                      Edit
                    </UButton>
                  </div>

                  <ul class="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    <li
                      v-for="p in r.permissions"
                      :key="p"
                      class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200"
                    >
                      <UIcon name="i-lucide-check-circle-2" class="w-4 h-4 text-success-500 shrink-0" />
                      <span class="truncate">{{ p }}</span>
                    </li>
                  </ul>
                </div>

                <div class="flex gap-2 pt-2 border-t border-gray-200/70 dark:border-gray-800/70">
                  <UButton size="sm" color="primary" variant="soft" icon="i-lucide-pencil" @click="openEdit(r.id)" class="flex-1">
                    Edit
                  </UButton>
                  <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-trash-2" @click="askDelete(r.id)">
                    Delete
                  </UButton>
                </div>
              </UCard>
            </div>
          </div>

          <!-- MANAGE -->
          <div v-else class="space-y-4">
            <UCard class="rounded-3xl" :ui="{ body: 'p-0' }">
              <template #header>
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5">
                  <div>
                    <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                      All Roles
                    </h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      Manage roles and their permissions
                    </p>
                  </div>

                  <div class="flex items-center gap-2">
                    <UBadge color="neutral" variant="soft" size="xs">
                      {{ filteredRoles.length }} roles
                    </UBadge>
                    <UButton color="primary" variant="soft" size="sm" icon="i-lucide-plus" @click="openCreate">
                      Add role
                    </UButton>
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

    <UModal
  v-model:open="isRoleModalOpen"
  scrollable
  :title="isEditing ? 'Edit role' : 'Create new role'"
  :description="isEditing
    ? 'Update role information and permissions.'
    : 'Create a role and choose what this role can access.'"
  :ui="{
    content: ' max-w-3xl ',
    body: 'p-0',
  }"
>
  <!-- BODY -->
  <template #body>
    <div class="p-5 sm:p-6 space-y-6">
      <!-- Top section: Basic info -->
      <div class="rounded-3xl border border-gray-200/70 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/40 backdrop-blur p-4 sm:p-5">
        <div class="flex items-start gap-3">
          <div class="shrink-0 h-10 w-10 rounded-2xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center">
            <UIcon :name="isEditing ? 'i-lucide-pencil' : 'i-lucide-plus'" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  Role details
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Name and description help people understand what this role is for.
                </p>
              </div>

              <div class="flex items-center gap-2">
                <UBadge color="primary" variant="soft" size="xs">
                  {{ roleForm.permissions.length }} selected
                </UBadge>
                <UBadge color="neutral" variant="soft" size="xs">
                  {{ availablePermissions.length }} available
                </UBadge>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormGroup label="Role name" required>
                <UInput
                  v-model="roleForm.name"
                  placeholder="e.g. Admin, Editor, Viewer"
                  icon="i-lucide-shield"
                />
              </UFormGroup>

              <UFormGroup label="Selected permissions">
                <UInput
                  :model-value="String(roleForm.permissions.length)"
                  disabled
                  icon="i-lucide-key-round"
                />
              </UFormGroup>

              <div class="sm:col-span-2">
                <UFormGroup label="Description">
                  <UTextarea
                    v-model="roleForm.description"
                    :rows="3"
                    placeholder="Short explanation for this role..."
                  />
                  <template #hint>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      Tip: keep it short (1–2 lines).
                    </span>
                  </template>
                </UFormGroup>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Permissions section -->
      <div class="rounded-3xl border border-gray-200/70 dark:border-gray-800/60 bg-gray-50/40 dark:bg-gray-900/20 p-4 sm:p-5 space-y-4">
        <!-- Header -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2">
            <div class="h-9 w-9 rounded-2xl bg-white dark:bg-gray-950/40 ring-1 ring-gray-200/70 dark:ring-gray-800/60 flex items-center justify-center">
              <UIcon name="i-lucide-key-round" class="w-4 h-4 text-gray-700 dark:text-gray-200" />
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">Permissions</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Choose what this role can access.
              </p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
            <UInput
              v-model="permissionQuery"
              icon="i-lucide-search"
              size="sm"
              placeholder="Search permissions..."
              class="w-full sm:w-72"
            />
            <div class="flex gap-2">
              <UButton
                size="sm"
                color="neutral"
                variant="soft"
                :icon="allSelected ? 'i-lucide-square' : 'i-lucide-check-square'"
                @click="toggleSelectAll"
              >
                {{ allSelected ? 'Unselect all' : 'Select all' }}
              </UButton>

              <UButton
                size="sm"
                color="neutral"
                variant="outline"
                icon="i-lucide-rotate-ccw"
                :disabled="roleForm.permissions.length === 0"
                @click="roleForm.permissions = []"
              >
                Reset
              </UButton>
            </div>
          </div>
        </div>

        <!-- List -->
        <div class="rounded-2xl bg-white/80 dark:bg-gray-950/30 ring-1 ring-gray-200/70 dark:ring-gray-800/60 overflow-hidden">
          <div class="max-h-72 overflow-y-auto p-3 sm:p-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <UCheckbox
                v-for="p in filteredAvailablePermissions"
                :key="p"
                :label="p"
                :model-value="roleForm.permissions.includes(p)"
                @update:model-value="(checked: any) => {
                  if (checked) {
                    if (!roleForm.permissions.includes(p)) roleForm.permissions.push(p)
                  } else {
                    roleForm.permissions = roleForm.permissions.filter(x => x !== p)
                  }
                }"
              />
            </div>

            <div
              v-if="filteredAvailablePermissions.length === 0"
              class="py-10 text-center"
            >
              <UIcon name="i-lucide-search-x" class="w-9 h-9 mx-auto text-gray-400" />
              <p class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No results</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Try a different keyword.
              </p>
            </div>
          </div>

          <!-- Sticky selected footer -->
          <div class="border-t border-gray-200/70 dark:border-gray-800/60 bg-white/90 dark:bg-gray-950/40 backdrop-blur p-3 sm:p-4">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-badge-check" class="w-4 h-4 text-success-500" />
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  Selected
                </p>
                <UBadge color="primary" variant="soft" size="xs">
                  {{ roleForm.permissions.length }}
                </UBadge>
              </div>

              <UButton
                size="xs"
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                :disabled="roleForm.permissions.length === 0"
                @click="roleForm.permissions = []"
              >
                Clear selected
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
                @click="roleForm.permissions = roleForm.permissions.filter(x => x !== p)"
              >
                {{ p }}
                <UIcon name="i-lucide-x" class="w-3 h-3 ml-1" />
              </UBadge>

              <div
                v-if="roleForm.permissions.length === 0"
                class="text-xs text-gray-500 dark:text-gray-400"
              >
                No permissions selected yet.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <!-- FOOTER -->
  <template #footer="{ close }">
    <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <UIcon name="i-lucide-info" class="w-4 h-4" />
        <span>Click a selected chip to remove it.</span>
      </div>

      <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <UButton color="neutral" variant="outline" @click="close">
          Cancel
        </UButton>
        <UButton
          color="primary"
          icon="i-lucide-save"
          :disabled="!roleForm.name?.trim() || roleForm.permissions.length === 0"
          @click="submitRole"
        >
          {{ isEditing ? 'Save changes' : 'Create role' }}
        </UButton>
      </div>
    </div>
  </template>
</UModal>


    <UModal
      v-model:open="isDeleteModalOpen"
      title="Delete role"
      description="This action cannot be undone."
      :close="{ color: 'neutral', variant: 'ghost', class: 'rounded-full' }"
      :ui="{
        content: 'w-[calc(100vw-2rem)] sm:max-w-lg rounded-3xl overflow-hidden',
        header: 'p-5 sm:p-6',
        body: 'p-5 sm:p-6',
        footer: 'p-5 sm:p-6'
      }"
    >
      <template #body>
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div class="h-9 w-9 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
              <UIcon name="i-lucide-trash-2" class="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>

            <div class="flex-1">
              <p class="text-sm text-gray-700 dark:text-gray-200">
                Are you sure you want to delete
                <span class="font-semibold">{{ deletingRole?.name }}</span>?
              </p>

              <div class="mt-3 rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-gray-50/60 dark:bg-gray-900/20 p-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Users assigned</span>
                  <span class="font-semibold text-gray-900 dark:text-white">{{ deletingRole?.users ?? 0 }}</span>
                </div>
                <div class="flex items-center justify-between text-sm mt-1">
                  <span class="text-gray-600 dark:text-gray-400">Permissions</span>
                  <span class="font-semibold text-gray-900 dark:text-white">{{ deletingRole?.permissions?.length ?? 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <UButton color="neutral" variant="outline" @click="close">
            Cancel
          </UButton>
          <UButton
            color="error"
            icon="i-lucide-trash-2"
            @click="() => { confirmDelete(); close() }"
          >
            Delete
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
