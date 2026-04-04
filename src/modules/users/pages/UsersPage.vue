<script setup lang="ts">
import { computed, h, reactive, ref, resolveComponent, watch } from 'vue'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import type { DropdownMenuItem, FormSubmitEvent, TableColumn } from '@nuxt/ui'
import * as yup from 'yup'
import { users as mockUsers } from '@/modules/users/data/users'
import BaseDataTable from '@/shared/components/data-table/BaseDataTable.vue'
import PageHeader from '@/shared/components/page/PageHeader.vue'
import TableActionsDropdown from '@/shared/components/data-table/TableActionsDropdown.vue'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
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

function normRole(value: string): Role {
  const normalized = value.toLowerCase()
  if (normalized === 'admin') return 'admin'
  if (normalized === 'viewer') return 'viewer'
  return 'member'
}

function normStatus(value: string): Status {
  const normalized = value.toLowerCase()
  if (normalized === 'inactive') return 'inactive'
  if (normalized === 'invited') return 'invited'
  return 'active'
}

function nowIso() {
  return new Date().toISOString()
}

function niceDate(iso?: string) {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

const users = ref<User[]>(
  (Array.isArray(mockUsers) ? mockUsers : []).map((user: any) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: normRole(user.role),
    status: normStatus(user.status),
    createdAt: user.createdAt || nowIso(),
    lastSeen: user.lastSeen || nowIso()
  }))
)

const query = ref('')
const roleFilter = ref<'all' | Role>('all')
const statusFilter = ref<'all' | Status>('all')
const sortKey = ref<'name' | 'role' | 'status' | 'createdAt'>('name')
const sortDir = ref<'asc' | 'desc'>('asc')
const page = ref(1)
const pageSize = ref(10)
const selectedIds = ref<Set<number>>(new Set())

const stats = computed(() => {
  const total = users.value.length
  const active = users.value.filter((user) => user.status === 'active').length
  const inactive = users.value.filter((user) => user.status === 'inactive').length
  const invited = users.value.filter((user) => user.status === 'invited').length
  return { total, active, inactive, invited }
})

const headerMetrics = computed(() => [
  { label: 'Total', value: stats.value.total },
  { label: 'Active', value: stats.value.active },
  { label: 'Inactive', value: stats.value.inactive },
  { label: 'Invited', value: stats.value.invited }
])

const filteredUsers = computed<User[]>(() => {
  const search = query.value.trim().toLowerCase()
  let rows = [...users.value]

  if (roleFilter.value !== 'all') rows = rows.filter((user) => user.role === roleFilter.value)
  if (statusFilter.value !== 'all') rows = rows.filter((user) => user.status === statusFilter.value)

  if (search) {
    rows = rows.filter((user) => `${user.name} ${user.email} ${user.role} ${user.status}`.toLowerCase().includes(search))
  }

  const dir = sortDir.value === 'asc' ? 1 : -1
  rows.sort((a, b) => {
    if (sortKey.value === 'name') return dir * a.name.localeCompare(b.name)
    if (sortKey.value === 'role') return dir * a.role.localeCompare(b.role)
    if (sortKey.value === 'status') return dir * a.status.localeCompare(b.status)
    return dir * (new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
  })

  return rows
})

watch([query, roleFilter, statusFilter, sortKey, sortDir, pageSize], () => {
  page.value = 1
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / pageSize.value)))
const paginatedRows = computed(() => {
  const currentPage = Math.min(Math.max(page.value, 1), totalPages.value)
  const start = (currentPage - 1) * pageSize.value
  return filteredUsers.value.slice(start, start + pageSize.value)
})

const allVisibleIds = computed(() => paginatedRows.value.map((row) => row.id))
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

function openEdit(user: User) {
  editingId.value = user.id
  Object.assign(form, { name: user.name, email: user.email, role: user.role, status: user.status })
  isModalOpen.value = true
}

async function onSubmit(event: FormSubmitEvent<FormShape>) {
  saving.value = true

  try {
    const payload = event.data

    if (editingId.value != null) {
      users.value = users.value.map((user) =>
        user.id === editingId.value ? { ...user, ...payload, lastSeen: user.lastSeen || nowIso() } : user
      )
      toast.add({ title: 'User updated', color: 'success', icon: 'i-lucide-circle-check' })
    } else {
      const nextId = Math.max(0, ...users.value.map((user) => user.id)) + 1
      users.value = [
        ...users.value,
        {
          id: nextId,
          ...payload,
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

const isDeleteOpen = ref(false)
const deletingId = ref<number | null>(null)
const deletingName = computed(() => {
  const id = deletingId.value
  return id == null ? '' : users.value.find((user) => user.id === id)?.name || ''
})

function askDelete(id: number) {
  deletingId.value = id
  isDeleteOpen.value = true
}

function confirmDelete() {
  const id = deletingId.value
  if (id == null) return

  users.value = users.value.filter((user) => user.id !== id)
  selectedIds.value.delete(id)
  toast.add({ title: 'User removed', color: 'neutral', icon: 'i-lucide-trash-2' })
  isDeleteOpen.value = false
  deletingId.value = null
}

function bulkSetStatus(status: Status) {
  if (!selectedIds.value.size) return

  users.value = users.value.map((user) => (selectedIds.value.has(user.id) ? { ...user, status } : user))
  toast.add({ title: `Updated ${selectedIds.value.size} users`, color: 'success', icon: 'i-lucide-wand-2' })
  clearSelection()
}

function bulkDelete() {
  if (!selectedIds.value.size) return
  const count = selectedIds.value.size
  users.value = users.value.filter((user) => !selectedIds.value.has(user.id))
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

function rowMenuItems(user: User): DropdownMenuItem[][] {
  return [
    [{ type: 'label', label: `#${user.id}` }],
    [{ label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => openEdit(user) }],
    [{ label: 'Delete', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => askDelete(user.id) }]
  ]
}

const columns: TableColumn<User>[] = [
  {
    id: 'select',
    header: () =>
      h('div', { class: 'flex justify-center' }, [
        h(UCheckbox as any, {
          modelValue: isAllChecked.value,
          indeterminate: isSomeChecked.value,
          'onUpdate:modelValue': (value: boolean) => toggleSelectAll(value),
          'aria-label': 'Select all'
        })
      ]),
    cell: ({ row }) =>
      h('div', { class: 'flex justify-center' }, [
        h(UCheckbox as any, {
          modelValue: selectedIds.value.has(row.original.id),
          'onUpdate:modelValue': (value: boolean) => toggleRow(row.original.id, value),
          'aria-label': 'Select row'
        })
      ]),
    meta: { class: { th: 'w-12', td: 'w-12' } }
  },
  {
    accessorKey: 'name',
    header: 'User',
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-3 min-w-0' }, [
        h(UAvatar as any, {
          src: `https://i.pravatar.cc/150?u=${row.original.id}`,
          alt: row.original.name,
          size: 'sm',
          class: 'ring-1 ring-white/10'
        }),
        h('div', { class: 'min-w-0' }, [
          h('div', { class: 'truncate font-medium text-white' }, row.original.name),
          h('div', { class: 'truncate text-xs text-zinc-500' }, row.original.email)
        ])
      ])
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) =>
      h(UBadge as any, { color: roleBadgeColor(row.original.role), variant: 'soft', size: 'xs', class: 'capitalize' }, () => row.original.role)
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = statusBadge(row.original.status)
      return h(UBadge as any, { color: status.color, variant: 'soft', size: 'xs' }, () => status.label)
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => h('div', { class: 'text-sm text-zinc-400' }, niceDate(row.original.createdAt))
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => h('div', { class: 'flex justify-end' }, h(TableActionsDropdown, { items: rowMenuItems(row.original), label: 'User actions' })),
    meta: { class: { th: 'w-16', td: 'text-right' } }
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
  <div class="page-frame page-stack">
    <PageHeader
      eyebrow="Identity"
      title="Users"
      description="Manage members, assign permissions, and keep account status clean with a simpler operating surface."
      :metrics="headerMetrics"
    >
      <template #actions>
        <UButton color="neutral" variant="outline" class="rounded-xl border-white/8 bg-white/[0.03] hover:bg-white/[0.06]" to="/dashboard/users/roles">
          Roles
        </UButton>
        <UButton color="primary" class="rounded-xl bg-white text-black hover:bg-zinc-200" icon="i-lucide-user-plus" @click="openCreate">
          Add user
        </UButton>
      </template>
    </PageHeader>

    <BaseDataTable
      v-model:search="query"
      v-model:page="page"
      v-model:page-size="pageSize"
      title="Directory"
      description="Filter, review, and edit user records from one focused table."
      :data="paginatedRows"
      :columns="columns"
      :total-items="filteredUsers.length"
      :total-pages="totalPages"
      search-placeholder="Search name or email..."
      :page-size-options="[10, 15, 25].map((value) => ({ label: `${value} / page`, value }))"
      :empty-state="{ icon: 'i-lucide-users', label: 'No users found.', description: 'Try changing the filters or create a new user.' }"
    >
      <template #filters>
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

        <USelectMenu
          v-model="sortKey"
          :items="sortItems"
          value-key="value"
          label-key="label"
          size="sm"
          color="neutral"
          variant="outline"
          class="w-full sm:w-40"
        />

        <UButton
          size="sm"
          color="neutral"
          variant="outline"
          class="rounded-xl border-white/8 bg-white/[0.03] hover:bg-white/[0.06]"
          :icon="sortDir === 'desc' ? 'i-lucide-arrow-down' : 'i-lucide-arrow-up'"
          aria-label="Toggle sort direction"
          @click="sortDir = sortDir === 'desc' ? 'asc' : 'desc'"
        />
      </template>

      <template #actions>
        <UDropdownMenu :items="bulkItems" :content="{ align: 'end' }">
          <UButton
            size="sm"
            color="neutral"
            variant="outline"
            class="rounded-xl border-white/8 bg-white/[0.03] hover:bg-white/[0.06]"
            icon="i-lucide-layers-3"
            :disabled="selectedIds.size === 0"
          >
            Bulk actions
          </UButton>
        </UDropdownMenu>
      </template>
    </BaseDataTable>

    <UModal v-model:open="isModalOpen" :ui="{ content: 'sm:max-w-lg rounded-[24px] border border-white/8 bg-zinc-950' }">
      <template #header>
        <div class="space-y-1">
          <p class="text-lg font-semibold text-white">{{ modalTitle }}</p>
          <p class="text-sm text-zinc-500">{{ modalDesc }}</p>
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

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          <div class="surface-subtle rounded-2xl p-3 text-xs text-zinc-500">
            Use <span class="font-semibold text-white">Invited</span> for users who have not accepted access yet.
          </div>
        </UForm>
      </template>

      <template #footer>
        <div class="flex w-full items-center justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="isModalOpen = false">Cancel</UButton>
          <UButton color="primary" :loading="saving" type="submit" form="user-form" class="rounded-xl bg-white text-black hover:bg-zinc-200">
            {{ submitLabel }}
          </UButton>
        </div>
      </template>
    </UModal>

    <UModal v-model:open="isDeleteOpen" :ui="{ content: 'sm:max-w-md rounded-[24px] border border-white/8 bg-zinc-950' }">
      <template #header>
        <p class="text-lg font-semibold text-white">Delete user?</p>
      </template>

      <template #body>
        <p class="text-sm text-zinc-500">
          You're about to delete <span class="font-semibold text-white">{{ deletingName || 'this user' }}</span>.
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
</template>
