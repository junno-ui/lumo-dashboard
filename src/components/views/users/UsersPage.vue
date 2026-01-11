<script setup lang="ts">
import { computed, h, reactive, ref, resolveComponent, watch } from 'vue'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import type { DropdownMenuItem, FormSubmitEvent, TableColumn } from '@nuxt/ui'
import * as yup from 'yup'
import { users as mockUsers } from '@/data/users'

/** Nuxt UI components for h() */
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UAvatar = resolveComponent('UAvatar')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()

type Role = 'admin' | 'member' | 'viewer'
type Status = 'active' | 'inactive' | 'invited'

type User = {
  id: number
  name: string
  email: string
  role: Role
  status: Status
  createdAt?: string
  lastSeen?: string
}

function normRole(v: string): Role {
  const x = (v || '').toLowerCase()
  if (x === 'admin') return 'admin'
  if (x === 'viewer') return 'viewer'
  return 'member'
}
function normStatus(v: string): Status {
  const x = (v || '').toLowerCase()
  if (x === 'inactive') return 'inactive'
  if (x === 'invited') return 'invited'
  return 'active'
}
function nowIso() {
  return new Date().toISOString()
}
function niceDate(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

const users = ref<User[]>(
  (Array.isArray(mockUsers) ? mockUsers : []).map((u: any) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: normRole(u.role),
    status: normStatus(u.status),
    createdAt: u.createdAt || nowIso(),
    lastSeen: u.lastSeen || nowIso()
  }))
)

/** Toolbar state */
const query = ref('')
const roleFilter = ref<'all' | Role>('all')
const statusFilter = ref<'all' | Status>('all')
const sortKey = ref<'name' | 'role' | 'status' | 'createdAt'>('name')
const sortDir = ref<'asc' | 'desc'>('asc')

/** Pagination */
const page = ref(1)
const pageSize = ref(10)

/** Selection */
const selectedIds = ref<Set<number>>(new Set())
const allVisibleIds = computed(() => paginatedRows.value.map((r) => r.id))
const isAllChecked = computed(() => !!allVisibleIds.value.length && allVisibleIds.value.every((id) => selectedIds.value.has(id)))
const isSomeChecked = computed(() => allVisibleIds.value.some((id) => selectedIds.value.has(id)) && !isAllChecked.value)

function toggleSelectAll(checked: boolean) {
  const next = new Set(selectedIds.value)
  for (const id of allVisibleIds.value) checked ? next.add(id) : next.delete(id)
  selectedIds.value = next
}
function toggleRow(id: number, checked: boolean) {
  const next = new Set(selectedIds.value)
  checked ? next.add(id) : next.delete(id)
  selectedIds.value = next
}
function clearSelection() {
  selectedIds.value = new Set()
}

/** Derived */
const stats = computed(() => {
  const total = users.value.length
  const active = users.value.filter((u) => u.status === 'active').length
  const inactive = users.value.filter((u) => u.status === 'inactive').length
  const invited = users.value.filter((u) => u.status === 'invited').length
  return { total, active, inactive, invited }
})

const filteredUsers = computed<User[]>(() => {
  const q = query.value.trim().toLowerCase()
  let rows = [...users.value]

  if (roleFilter.value !== 'all') rows = rows.filter((u) => u.role === roleFilter.value)
  if (statusFilter.value !== 'all') rows = rows.filter((u) => u.status === statusFilter.value)

  if (q) {
    rows = rows.filter((u) => {
      const hay = `${u.name} ${u.email} ${u.role} ${u.status}`.toLowerCase()
      return hay.includes(q)
    })
  }

  const dir = sortDir.value === 'asc' ? 1 : -1
  rows.sort((a, b) => {
    if (sortKey.value === 'name') return dir * a.name.localeCompare(b.name)
    if (sortKey.value === 'role') return dir * a.role.localeCompare(b.role)
    if (sortKey.value === 'status') return dir * a.status.localeCompare(b.status)
    // createdAt
    return dir * (new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
  })

  return rows
})

watch([query, roleFilter, statusFilter, sortKey, sortDir, pageSize], () => (page.value = 1))

const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / pageSize.value)))
const paginatedRows = computed(() => {
  const p = Math.min(Math.max(page.value, 1), totalPages.value)
  const start = (p - 1) * pageSize.value
  return filteredUsers.value.slice(start, start + pageSize.value)
})

/** UI helpers */
function roleBadgeColor(role: Role) {
  if (role === 'admin') return 'primary'
  if (role === 'viewer') return 'neutral'
  return 'secondary'
}
function statusBadge(status: Status) {
  if (status === 'active') return { color: 'success', label: 'Active' }
  if (status === 'inactive') return { color: 'error', label: 'Inactive' }
  return { color: 'warning', label: 'Invited' }
}

/** CRUD Modal */
const isModalOpen = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  role: yup.mixed<Role>().oneOf(['admin', 'member', 'viewer']).required(),
  status: yup.mixed<Status>().oneOf(['active', 'inactive', 'invited']).required()
})
type FormShape = yup.InferType<typeof schema>

const form = reactive<FormShape>({
  name: '',
  email: '',
  role: 'member',
  status: 'active'
})

const isEdit = computed(() => editingId.value != null)
const modalTitle = computed(() => (isEdit.value ? 'Edit user' : 'Add user'))
const modalDesc = computed(() => (isEdit.value ? 'Update profile, role, or access status.' : 'Create a new user and assign role.'))
const submitLabel = computed(() => (isEdit.value ? 'Save changes' : 'Create user'))

function openCreate() {
  editingId.value = null
  Object.assign(form, { name: '', email: '', role: 'member', status: 'active' })
  isModalOpen.value = true
}
function openEdit(u: User) {
  editingId.value = u.id
  Object.assign(form, { name: u.name, email: u.email, role: u.role, status: u.status })
  isModalOpen.value = true
}

async function onSubmit(e: FormSubmitEvent<FormShape>) {
  saving.value = true
  try {
    const data = e.data

    if (editingId.value != null) {
      users.value = users.value.map((u) =>
        u.id === editingId.value ? { ...u, ...data, lastSeen: u.lastSeen || nowIso() } : u
      )
      toast.add({ title: 'User updated', color: 'success', icon: 'i-lucide-circle-check' })
    } else {
      const newId = Math.max(0, ...users.value.map((u) => u.id)) + 1
      users.value = [
        ...users.value,
        {
          id: newId,
          ...data,
          createdAt: nowIso(),
          lastSeen: nowIso()
        }
      ]
      toast.add({ title: 'User created', color: 'success', icon: 'i-lucide-user-plus' })
    }

    isModalOpen.value = false
    editingId.value = null
  } finally {
    saving.value = false
  }
}

/** Delete + bulk actions */
const isDeleteOpen = ref(false)
const deletingId = ref<number | null>(null)
const deletingName = computed(() => {
  const id = deletingId.value
  return id == null ? '' : users.value.find((u) => u.id === id)?.name || ''
})

function askDelete(id: number) {
  deletingId.value = id
  isDeleteOpen.value = true
}
function confirmDelete() {
  const id = deletingId.value
  if (id == null) return
  users.value = users.value.filter((u) => u.id !== id)
  selectedIds.value.delete(id)
  toast.add({ title: 'User removed', color: 'neutral', icon: 'i-lucide-trash-2' })
  isDeleteOpen.value = false
  deletingId.value = null
}

function bulkSetStatus(status: Status) {
  if (!selectedIds.value.size) return
  users.value = users.value.map((u) => (selectedIds.value.has(u.id) ? { ...u, status } : u))
  toast.add({ title: `Updated ${selectedIds.value.size} users`, color: 'success', icon: 'i-lucide-wand-2' })
  clearSelection()
}
function bulkDelete() {
  if (!selectedIds.value.size) return
  const count = selectedIds.value.size
  users.value = users.value.filter((u) => !selectedIds.value.has(u.id))
  toast.add({ title: `Deleted ${count} users`, color: 'neutral', icon: 'i-lucide-trash-2' })
  clearSelection()
}

const bulkItems = computed<DropdownMenuItem[][]>(() => [
  [{ type: 'label', label: `Selected: ${selectedIds.value.size}` }],
  [
    { label: 'Set Active', icon: 'i-lucide-check', onSelect: () => bulkSetStatus('active'), disabled: selectedIds.value.size === 0 },
    { label: 'Set Inactive', icon: 'i-lucide-slash', onSelect: () => bulkSetStatus('inactive'), disabled: selectedIds.value.size === 0 },
    { label: 'Set Invited', icon: 'i-lucide-mail', onSelect: () => bulkSetStatus('invited'), disabled: selectedIds.value.size === 0 }
  ],
  [{ label: 'Delete selected', icon: 'i-lucide-trash-2', color: 'error', onSelect: bulkDelete, disabled: selectedIds.value.size === 0 }]
])

/** Row menu */
function rowMenuItems(u: User): DropdownMenuItem[][] {
  return [
    [{ type: 'label', label: `#${u.id}` }],
    [{ label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => openEdit(u) }],
    [{ label: 'Delete', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => askDelete(u.id) }]
  ]
}

/** Table columns */
type Row = User
const columns: TableColumn<Row>[] = [
  {
    id: 'select',
    header: () =>
      h('div', { class: 'flex justify-center' }, [
        h(UCheckbox as any, {
          modelValue: isAllChecked.value,
          indeterminate: isSomeChecked.value,
          'onUpdate:modelValue': (v: boolean) => toggleSelectAll(v),
          'aria-label': 'Select all'
        })
      ]),
    cell: ({ row }) => {
      const u = row.original
      return h('div', { class: 'flex justify-center' }, [
        h(UCheckbox as any, {
          modelValue: selectedIds.value.has(u.id),
          'onUpdate:modelValue': (v: boolean) => toggleRow(u.id, v),
          'aria-label': 'Select row'
        })
      ])
    },
    meta: { class: { th: 'w-12', td: 'w-12 align-middle' } }
  },
  {
    accessorKey: 'name',
    header: 'User',
    cell: ({ row }) => {
      const u = row.original
      return h('div', { class: 'flex items-center gap-3 min-w-0' }, [
        h(UAvatar as any, { src: `https://i.pravatar.cc/150?u=${u.id}`, alt: u.name, size: 'sm' }),
        h('div', { class: 'min-w-0' }, [
          h('div', { class: 'font-semibold text-gray-900 dark:text-white truncate' }, u.name),
          h('div', { class: 'text-xs text-gray-500 dark:text-gray-400 truncate' }, u.email)
        ])
      ])
    }
  },
  {
    accessorKey: 'role',
    header: 'Role',
    meta: { class: { th: 'w-28', td: 'align-middle' } },
    cell: ({ row }) => {
      const role = row.original.role
      return h(UBadge as any, { color: roleBadgeColor(role), variant: 'soft', size: 'xs', class: 'capitalize' }, () => role)
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: { class: { th: 'w-28', td: 'align-middle' } },
    cell: ({ row }) => {
      const s = statusBadge(row.original.status)
      return h(UBadge as any, { color: s.color, variant: 'soft', size: 'xs' }, () => s.label)
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    meta: { class: { th: 'w-32', td: 'align-middle' } },
    cell: ({ row }) => h('div', { class: 'text-sm text-gray-700 dark:text-gray-200' }, niceDate(row.original.createdAt))
  },
  {
    id: 'actions',
    header: '',
    meta: { class: { th: 'w-16 text-right', td: 'text-right align-middle' } },
    cell: ({ row }) =>
      h(
        'div',
        { class: 'flex justify-end' },
        h(UDropdownMenu as any, { items: rowMenuItems(row.original), content: { align: 'end' } }, () =>
          h(UButton as any, {
            icon: 'i-lucide-ellipsis-vertical',
            color: 'neutral',
            variant: 'ghost',
            size: 'sm',
            'aria-label': 'Row actions'
          })
        )
      )
  }
]

const roleItems = [
  { label: 'All roles', value: 'all' },
  { label: 'Admin', value: 'admin' },
  { label: 'Member', value: 'member' },
  { label: 'Viewer', value: 'viewer' }
]
const statusItems = [
  { label: 'All status', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Invited', value: 'invited' }
]
const sortItems = [
  { label: 'Name', value: 'name' },
  { label: 'Role', value: 'role' },
  { label: 'Status', value: 'status' },
  { label: 'Created', value: 'createdAt' }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <div class=" px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">All users</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Manage members, assign roles, and control access status.
          </p>

          <div class="flex flex-wrap items-center gap-2 pt-2">
            <UBadge color="neutral" variant="soft" size="xs">Total: <span class="ml-1 font-semibold">{{ stats.total }}</span></UBadge>
            <UBadge color="success" variant="soft" size="xs">Active: <span class="ml-1 font-semibold">{{ stats.active }}</span></UBadge>
            <UBadge color="error" variant="soft" size="xs">Inactive: <span class="ml-1 font-semibold">{{ stats.inactive }}</span></UBadge>
            <UBadge color="warning" variant="soft" size="xs">Invited: <span class="ml-1 font-semibold">{{ stats.invited }}</span></UBadge>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <UButton color="neutral" variant="outline" icon="i-lucide-shield" to="/users/roles">Roles</UButton>
          <UButton color="primary" icon="i-lucide-user-plus" @click="openCreate">Add user</UButton>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
          <UInput v-model="query" icon="i-lucide-search" placeholder="Search name, email…" size="sm" class="w-full sm:w-64" />

          <USelectMenu
            v-model="roleFilter"
            :items="roleItems"
            value-key="value"
            label-key="label"
            size="sm"
            color="neutral"
            variant="outline"
            class="w-full sm:w-40"
          />

          <USelectMenu
            v-model="statusFilter"
            :items="statusItems"
            value-key="value"
            label-key="label"
            size="sm"
            color="neutral"
            variant="outline"
            class="w-full sm:w-40"
          />
        </div>

        <div class="flex items-center gap-2">
          <USelectMenu
            v-model="sortKey"
            :items="sortItems"
            value-key="value"
            label-key="label"
            size="sm"
            color="neutral"
            variant="outline"
            class="w-40"
          />

          <UButton
            size="sm"
            color="neutral"
            variant="outline"
            :icon="sortDir === 'desc' ? 'i-lucide-arrow-down' : 'i-lucide-arrow-up'"
            @click="sortDir = sortDir === 'desc' ? 'asc' : 'desc'"
            aria-label="Toggle sort direction"
          />

          <UDropdownMenu :items="bulkItems" :content="{ align: 'end' }">
            <UButton
              size="sm"
              color="neutral"
              variant="outline"
              icon="i-lucide-layers"
              :disabled="selectedIds.size === 0"
            >
              Bulk actions
            </UButton>
          </UDropdownMenu>

          <USelectMenu
            v-model="pageSize"
            :items="[10, 15, 25].map(v => ({ label: `${v}/page`, value: v }))"
            value-key="value"
            label-key="label"
            size="sm"
            color="neutral"
            variant="outline"
            class="w-28"
          />
        </div>
      </div>

      <!-- Table -->
      <UCard class="rounded-2xl" :ui="{ body: 'p-0' }">
        <template #header>
          <div class="p-5 flex items-start justify-between gap-3">
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Users</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Showing <span class="font-semibold text-gray-900 dark:text-white">{{ paginatedRows.length }}</span> of
                <span class="font-semibold text-gray-900 dark:text-white">{{ filteredUsers.length }}</span> results
                • Page <span class="font-semibold text-gray-900 dark:text-white">{{ page }}</span> /
                <span class="font-semibold text-gray-900 dark:text-white">{{ totalPages }}</span>
              </p>
            </div>

            <UBadge color="neutral" variant="soft" size="xs">{{ filteredUsers.length }} results</UBadge>
          </div>
        </template>

        <div class="px-5 pb-5">
          <div class="rounded-2xl overflow-hidden ring-1 ring-gray-200/70 dark:ring-gray-800/60">
            <UTable
              :data="paginatedRows"
              :columns="columns"
              :ui="{
                thead: 'bg-white dark:bg-gray-900/60',
                th: 'text-xs font-semibold text-gray-600 dark:text-gray-300',
                tr: 'group hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors',
                td: 'py-4'
              }"
              :empty-state="{ icon: 'i-lucide-users', label: 'No users found.' }"
            />
          </div>

          <!-- Pagination -->
          <div v-if="filteredUsers.length > 0" class="mt-4 flex items-center justify-between gap-3">
            <UButton
              size="sm"
              color="neutral"
              variant="outline"
              icon="i-lucide-chevron-left"
              :disabled="page <= 1"
              @click="page = Math.max(1, page - 1)"
            >
              Prev
            </UButton>

            <div class="text-xs text-gray-500 dark:text-gray-400">
              Page <span class="font-semibold text-gray-900 dark:text-white">{{ page }}</span> of
              <span class="font-semibold text-gray-900 dark:text-white">{{ totalPages }}</span>
            </div>

            <UButton
              size="sm"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-chevron-right"
              :disabled="page >= totalPages"
              @click="page = Math.min(totalPages, page + 1)"
            >
              Next
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Create/Edit modal -->
      <UModal v-model:open="isModalOpen" :ui="{ content: 'sm:max-w-lg' }">
        <template #header>
          <div class="space-y-1">
            <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ modalTitle }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ modalDesc }}</p>
          </div>
        </template>

        <template #body>
          <UForm :schema="schema" :state="form" class="space-y-4" @submit="onSubmit" id="user-form">
            <UFormField label="Full name" name="name" required>
              <UInput v-model="form.name" icon="i-lucide-user" placeholder="e.g. John Doe" />
            </UFormField>

            <UFormField label="Email" name="email" required>
              <UInput v-model="form.email" icon="i-lucide-mail" type="email" placeholder="name@company.com" />
            </UFormField>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField label="Role" name="role" required>
                <USelectMenu
                  v-model="form.role"
                  :items="[
                    { label: 'Admin', value: 'admin' },
                    { label: 'Member', value: 'member' },
                    { label: 'Viewer', value: 'viewer' }
                  ]"
                  value-key="value"
                  label-key="label"
                  color="neutral"
                  variant="outline"
                />
              </UFormField>

              <UFormField label="Status" name="status" required>
                <USelectMenu
                  v-model="form.status"
                  :items="[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                    { label: 'Invited', value: 'invited' }
                  ]"
                  value-key="value"
                  label-key="label"
                  color="neutral"
                  variant="outline"
                />
              </UFormField>
            </div>

            <div class="rounded-xl border border-gray-200 dark:border-gray-800 p-3 bg-white/60 dark:bg-gray-900/30">
              <p class="text-xs text-gray-600 dark:text-gray-400">
                Tip: Use <span class="font-semibold text-gray-900 dark:text-white">Invited</span> for users who haven't accepted access yet.
              </p>
            </div>
          </UForm>
        </template>

        <template #footer>
          <div class="flex items-center justify-end gap-2 w-full">
            <UButton color="neutral" variant="ghost" @click="isModalOpen = false">Cancel</UButton>
            <UButton
              color="primary"
              :loading="saving"
              type="submit"
              form="user-form"
              :icon="isEdit ? 'i-lucide-save' : 'i-lucide-user-plus'"
            >
              {{ submitLabel }}
            </UButton>
          </div>
        </template>
      </UModal>

      <!-- Delete confirm modal -->
      <UModal v-model:open="isDeleteOpen" :ui="{ content: 'sm:max-w-md' }">
        <template #header>
          <p class="text-lg font-semibold text-gray-900 dark:text-white">Delete user?</p>
        </template>
        <template #body>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            You’re about to delete <span class="font-semibold text-gray-900 dark:text-white">{{ deletingName || 'this user' }}</span>.
            This action cannot be undone.
          </p>
        </template>
        <template #footer>
          <div class="flex items-center justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="isDeleteOpen = false">Cancel</UButton>
            <UButton color="error" icon="i-lucide-trash-2" @click="confirmDelete">Delete</UButton>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>
