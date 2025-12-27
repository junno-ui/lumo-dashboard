<script setup lang="ts">
import { ref, h, resolveComponent } from 'vue'
import BaseDataTable from '../../components/common/BaseDataTable.vue'
import UserFormModal from '../../components/users/UserFormModal.vue'
import { users as mockUsers } from '@/mock/users'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UAvatar = resolveComponent('UAvatar')

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
}

const users = ref<User[]>(mockUsers.map((u:any) => ({ id: u.id, name: u.name, email: u.email, role: u.role.toLowerCase(), status: u.status.toLowerCase() })))

// Columns
const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }: any) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'name',
    header: 'User',
    cell: ({ row }: any) => {
        const user = row.original
        return h('div', { class: 'flex items-center gap-3' }, [
            h(UAvatar, { src: `https://i.pravatar.cc/150?u=${user.id}`, alt: user.name }),
            h('div', [
                h('div', { class: 'font-medium text-gray-900 dark:text-white' }, user.name),
                h('div', { class: 'text-gray-500 text-sm' }, user.email)
            ])
        ])
    }
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }: any) => {
        const role = row.getValue('role') as string
        const color = role === 'admin' ? 'primary' : role === 'viewer' ? 'gray' : 'white'
        return h(UBadge, { color, variant: 'subtle', class: 'capitalize' }, () => role)
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
        const status = row.getValue('status') as string
        const color = status === 'active' ? 'green' : status === 'inactive' ? 'red' : 'orange'
        return h(UBadge, { color, variant: 'solid', size: 'xs', class: 'capitalize' }, () => status)
    }
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }: any) => {
        const items = [
            [{
                label: 'Edit',
                icon: 'i-heroicons-pencil-square',
                click: () => openEdit(row.original)
            }],
            [{
                label: 'Delete',
                icon: 'i-heroicons-trash',
                color: 'red',
                click: () => deleteUser(row.original.id)
            }]
        ]
        
        return h(UDropdownMenu, { items }, () =>
            h(UButton, { color: 'gray', variant: 'ghost', icon: 'i-heroicons-ellipsis-horizontal-20-solid' })
        )
    }
  }
]

// Modal Logic
const isModalOpen = ref(false)
const selectedUser = ref<User | null>(null)

function openCreate() {
    selectedUser.value = null
    isModalOpen.value = true
}

function openEdit(user: User) {
    selectedUser.value = { ...user } // Clone
    isModalOpen.value = true
}

function handleSave(userData: any) {
    if (userData.id) {
        // Update
        const index = users.value.findIndex(u => u.id === userData.id)
        if (index !== -1) users.value[index] = userData
    } else {
        // Create
        const newId = Math.max(...users.value.map(u => u.id)) + 1
        users.value.push({ ...userData, id: newId })
    }
}

function deleteUser(id: number) {
    if (confirm('Are you sure?')) {
        users.value = users.value.filter(u => u.id !== id)
    }
}
</script>

<template>
  <div class="p-6">
    <BaseDataTable
      title="Users"
      :data="users"
      :columns="columns"
      search-placeholder="Search users..."
    >
      <template #actions>
        <UButton label="Add User" color="black" icon="i-heroicons-plus" @click="openCreate" />
      </template>
    </BaseDataTable>

    <UserFormModal
        v-model="isModalOpen"
        :user="selectedUser || undefined"
        @save="handleSave"
    />
  </div>
</template>
