<script setup lang="ts">
import { ref, computed, h, resolveComponent } from 'vue'
import { roles as initialRoles } from '@/mock/users'
import type { TabsItem } from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UIcon = resolveComponent('UIcon')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()

interface Role {
  id: number
  name: string
  permissions: string[]
  users: number
  description?: string
}

// State
const roles = ref<Role[]>(initialRoles.map((r: any) => ({
  id: r.id,
  name: r.name,
  permissions: Array.isArray(r.permissions) ? r.permissions : [],
  users: r.users || 0,
  description: r.description || ''
})))

const tabs: TabsItem[] = [
  { label: 'Overview', icon: 'i-lucide-layout-grid', value: 'overview' },
  { label: 'Manage Roles', icon: 'i-lucide-settings', value: 'manage' }
]

const activeTab = ref('overview')
const searchQuery = ref('')

// Modal states
const isRoleModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const editingRole = ref<Role | null>(null)
const deletingRole = ref<Role | null>(null)

// Form state
const roleForm = ref({
  name: '',
  description: '',
  permissions: [] as string[]
})

// Available permissions list
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

// Computed
const filteredRoles = computed(() => {
  if (!searchQuery.value) return roles.value
  const query = searchQuery.value.toLowerCase()
  return roles.value.filter(r =>
    r.name.toLowerCase().includes(query) ||
    r.permissions.some(p => p.toLowerCase().includes(query))
  )
})

const stats = computed(() => ({
  totalRoles: roles.value.length,
  totalUsers: roles.value.reduce((sum, r) => sum + r.users, 0),
  avgPermissions: Math.round(roles.value.reduce((sum, r) => sum + r.permissions.length, 0) / roles.value.length) || 0
}))

// Table columns
const columns = [
  {
    accessorKey: 'name',
    header: 'Role Name',
    cell: ({ row }: any) => {
      const r = row.original
      return h('div', { class: 'space-y-1' }, [
        h('div', { class: 'font-semibold text-gray-900 dark:text-white' }, r.name),
        r.description ? h('div', { class: 'text-xs text-gray-500 dark:text-gray-400' }, r.description) : null
      ].filter(Boolean))
    }
  },
  {
    accessorKey: 'permissions',
    header: 'Permissions',
    cell: ({ row }: any) => {
      const perms = row.original.permissions
      return h('div', { class: 'flex items-center gap-2' }, [
        h(UBadge as any, { color: 'primary', variant: 'soft', size: 'xs' }, () => `${perms.length} permissions`),
        perms.length > 0 ? h('div', { class: 'text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs' }, perms.slice(0, 2).join(', ') + (perms.length > 2 ? '...' : '')) : null
      ].filter(Boolean))
    }
  },
  {
    accessorKey: 'users',
    header: () => h('div', { class: 'text-right' }, 'Users'),
    meta: { class: { th: 'text-right', td: 'text-right' } },
    cell: ({ row }: any) =>
      h('div', { class: 'flex items-center justify-end gap-2' }, [
        h(UIcon as any, { name: 'i-lucide-users', class: 'w-4 h-4 text-gray-400' }),
        h('span', { class: 'font-medium text-gray-900 dark:text-white' }, row.original.users)
      ])
  },
  {
    id: 'actions',
    header: '',
    meta: { class: { th: 'w-16 text-right', td: 'text-right' } },
    cell: ({ row }: any) => {
      const items = [
        [
          { label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => openEdit(row.original.id) }
        ],
        [
          { label: 'Delete', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => askDelete(row.original.id) }
        ]
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

// CRUD Operations
function openCreate() {
  editingRole.value = null
  roleForm.value = {
    name: '',
    description: '',
    permissions: []
  }
  isRoleModalOpen.value = true
}

function openEdit(roleId: number) {
  const role = roles.value.find(r => r.id === roleId)
  if (role) {
    editingRole.value = role
    roleForm.value = {
      name: role.name,
      description: role.description || '',
      permissions: [...role.permissions]
    }
    isRoleModalOpen.value = true
  }
}

function saveRole() {
  if (!roleForm.value.name.trim()) {
    toast.add({ title: 'Role name is required', color: 'error', icon: 'i-lucide-alert-circle' })
    return
  }

  if (editingRole.value) {
    // Update
    const index = roles.value.findIndex(r => r.id === editingRole.value!.id)
    if (index !== -1) {
      const existingRole = roles.value[index]!
      roles.value[index] = {
        id: existingRole.id,
        users: existingRole.users,
        name: roleForm.value.name,
        description: roleForm.value.description,
        permissions: roleForm.value.permissions
      }
      toast.add({
        title: 'Role updated',
        description: `${roleForm.value.name} has been updated.`,
        color: 'success',
        icon: 'i-lucide-check-circle'
      })
    }
  } else {
    // Create
    const newId = Math.max(...roles.value.map(r => r.id), 0) + 1
    roles.value.push({
      id: newId,
      name: roleForm.value.name,
      description: roleForm.value.description,
      permissions: roleForm.value.permissions,
      users: 0
    })
    toast.add({
      title: 'Role created',
      description: `${roleForm.value.name} has been created.`,
      color: 'success',
      icon: 'i-lucide-plus-circle'
    })
  }

  isRoleModalOpen.value = false
}

function askDelete(roleId: number) {
  const role = roles.value.find(r => r.id === roleId)
  if (role) {
    deletingRole.value = role
    isDeleteModalOpen.value = true
  }
}

function confirmDelete() {
  if (deletingRole.value) {
    const roleName = deletingRole.value.name
    roles.value = roles.value.filter(r => r.id !== deletingRole.value!.id)

    toast.add({
      title: 'Role deleted',
      description: `${roleName} has been removed.`,
      color: 'neutral',
      icon: 'i-lucide-trash-2'
    })

    isDeleteModalOpen.value = false
    deletingRole.value = null
  }
}

function togglePermission(permission: string) {
  const index = roleForm.value.permissions.indexOf(permission)
  if (index > -1) {
    roleForm.value.permissions.splice(index, 1)
  } else {
    roleForm.value.permissions.push(permission)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-1">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Roles & Permissions</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Manage user roles and their access permissions
          </p>

          <!-- Stats -->
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

        <div class="flex gap-3">
          <UInput v-model="searchQuery" icon="i-lucide-search" placeholder="Search roles..." size="sm"
            class="w-full sm:w-64" />
          <UButton color="primary" icon="i-lucide-plus" size="sm" @click="openCreate">
            New Role
          </UButton>
        </div>
      </div>

      <!-- Tabs -->
      <UTabs v-model="activeTab" :items="tabs" class="w-full">
        <template #content="{ item }">
          <!-- OVERVIEW TAB (Cards) -->
          <div v-if="item.value === 'overview'" class="space-y-4">
            <div v-if="filteredRoles.length === 0" class="py-16 text-center">
              <UIcon name="i-lucide-inbox" class="w-12 h-12 mx-auto text-gray-400" />
              <div class="mt-4 font-semibold text-gray-900 dark:text-white">No roles found</div>
              <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try a different search or create a new role
              </div>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <UCard v-for="r in filteredRoles" :key="r.id" :ui="{ body: 'space-y-4' }"
                class="hover:shadow-lg transition-shadow duration-200">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ r.name }}
                    </h3>
                    <p v-if="r.description" class="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {{ r.description }}
                    </p>
                  </div>
                  <UBadge color="neutral" variant="soft" size="sm">
                    {{ r.users }} users
                  </UBadge>
                </div>

                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                      Permissions
                    </span>
                    <UBadge color="primary" variant="soft" size="xs">
                      {{ r.permissions.length }}
                    </UBadge>
                  </div>

                  <ul class="space-y-1.5 max-h-32 overflow-y-auto">
                    <li v-for="p in r.permissions" :key="p"
                      class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                      <UIcon name="i-lucide-shield-check" class="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span class="truncate">{{ p }}</span>
                    </li>
                  </ul>
                </div>

                <div class="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                  <UButton size="sm" color="primary" variant="soft" icon="i-lucide-pencil" @click="openEdit(r.id)"
                    class="flex-1">
                    Edit
                  </UButton>
                  <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-trash-2" @click="askDelete(r.id)">
                    Delete
                  </UButton>
                </div>
              </UCard>
            </div>
          </div>

          <!-- MANAGE TAB (Table with CRUD) -->
          <div v-else class="space-y-4">
            <UCard :ui="{ body: 'p-0' }">
              <template #header>
                <div class="flex items-center justify-between gap-3 p-5">
                  <div>
                    <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                      All Roles
                    </h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      Manage roles and their permissions
                    </p>
                  </div>
                  <UBadge color="neutral" variant="soft" size="xs">
                    {{ filteredRoles.length }} roles
                  </UBadge>
                </div>
              </template>

              <div class="px-5 pb-5">
                <div class="rounded-2xl overflow-hidden ring-1 ring-gray-200/70 dark:ring-gray-800/60">
                  <UTable :data="filteredRoles" :columns="columns" :ui="{
                    thead: 'bg-white dark:bg-gray-900/60',
                    th: 'text-xs font-semibold text-gray-600 dark:text-gray-300',
                    tr: 'group hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors',
                    td: 'py-4'
                  }" :empty-state="{
                    icon: 'i-lucide-shield-off',
                    label: 'No roles found',
                    description: 'Create your first role to get started'
                  }" />
                </div>
              </div>
            </UCard>
          </div>
        </template>
      </UTabs>
    </div>

    <!-- Create/Edit Role Modal -->
    <UModal v-model="isRoleModalOpen" :title="editingRole ? 'Edit Role' : 'Create New Role'"
      :description="editingRole ? 'Update role details and permissions' : 'Define a new role with specific permissions'"
      :ui="{ width: 'sm:max-w-2xl' }">
      <template #body>
        <div class="space-y-5 p-6">
          <!-- Role Name -->
          <UFormGroup label="Role Name" required>
            <UInput v-model="roleForm.name" placeholder="e.g., Administrator, Editor, Viewer" size="lg"
              icon="i-lucide-badge" />
          </UFormGroup>

          <!-- Description -->
          <UFormGroup label="Description">
            <UTextarea v-model="roleForm.description" placeholder="Brief description of this role..." :rows="2" />
          </UFormGroup>

          <!-- Permissions -->
          <UFormGroup label="Permissions">
            <div class="space-y-2">
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Select permissions for this role ({{ roleForm.permissions.length }} selected)
              </div>

              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto p-3 rounded-lg bg-gray-50 dark:bg-gray-900/40">
                <label v-for="perm in availablePermissions" :key="perm"
                  class="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer transition-colors"
                  :class="{
                    'border-primary-500 dark:border-primary-500 bg-primary-50 dark:bg-primary-950/30': roleForm.permissions.includes(perm)
                  }">
                  <UCheckbox :model-value="roleForm.permissions.includes(perm)"
                    @update:model-value="togglePermission(perm)" />
                  <span class="text-sm text-gray-700 dark:text-gray-200">
                    {{ perm }}
                  </span>
                </label>
              </div>
            </div>
          </UFormGroup>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <UButton color="neutral" variant="outline" @click="isRoleModalOpen = false">
              Cancel
            </UButton>
            <UButton color="primary" icon="i-lucide-check" @click="saveRole">
              {{ editingRole ? 'Update Role' : 'Create Role' }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="isDeleteModalOpen" title="Delete Role" description="This action cannot be undone"
      :ui="{ width: 'sm:max-w-md' }">
      <template #body>
        <div class="space-y-4 p-6">
          <p class="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete
            <span class="font-semibold text-gray-900 dark:text-white">{{ deletingRole?.name }}</span>?
            Users with this role will lose their permissions.
          </p>

          <div class="flex justify-end gap-3 pt-4">
            <UButton color="neutral" variant="outline" @click="isDeleteModalOpen = false">
              Cancel
            </UButton>
            <UButton color="error" icon="i-lucide-trash-2" @click="confirmDelete">
              Delete Role
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>