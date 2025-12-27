<script setup lang="ts">
import { ref, h, resolveComponent, watch } from 'vue'
import BaseDataTable from '@/components/common/BaseDataTable.vue'
import { userSubscriptions as mockSubs } from '@/mock/subscriptions'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

type Sub = { id: number; user: string; email: string; plan: string; status: string; nextBilling: string }
const subscriptions = ref<Sub[]>(mockSubs.map((s:any, i:number) => ({ id: s.id || i+1, ...s })))

const columns = [
  { accessorKey: 'user', header: 'User' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'plan', header: 'Plan' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const s = row.getValue('status') as string
      const color = s === 'Active' ? 'green' : s === 'Canceled' ? 'red' : 'orange'
      return h(UBadge, { color, variant: 'solid', size: 'xs' }, () => s)
    }
  },
  { accessorKey: 'nextBilling', header: 'Next Billing' },
  {
    id: 'actions',
    header: '',
    cell: ({ row }: any) => {
      const items = [
        [{ label: 'Edit', icon: 'i-heroicons-pencil-square', click: () => openEdit(row.original) }],
        [{ label: 'Delete', icon: 'i-heroicons-trash', color: 'red', click: () => remove(row.original.id) }]
      ]
      return h(UDropdownMenu, { items }, () => h(UButton, { color: 'gray', variant: 'ghost', icon: 'i-heroicons-ellipsis-horizontal-20-solid' }))
    }
  }
]

const isOpen = ref(false)
const editing = ref<Sub | null>(null)
const form = ref<Sub>({ id: 0, user: '', email: '', plan: 'Starter', status: 'Active', nextBilling: '' })

watch(editing, (val) => {
  form.value = val ? { ...val } : { id: 0, user: '', email: '', plan: 'Starter', status: 'Active', nextBilling: '' }
})

function openCreate() {
  editing.value = null
  isOpen.value = true
}

function openEdit(s: Sub) {
  editing.value = { ...s }
  isOpen.value = true
}

function save() {
  if (editing.value && editing.value.id) {
    const idx = subscriptions.value.findIndex(x => x.id === editing.value!.id)
    if (idx !== -1) subscriptions.value[idx] = { ...form.value }
  } else {
    const newId = Math.max(0, ...subscriptions.value.map(x => x.id)) + 1
    subscriptions.value.push({ ...form.value, id: newId })
  }
  isOpen.value = false
}

function remove(id: number) {
  subscriptions.value = subscriptions.value.filter(x => x.id !== id)
}
</script>

<template>
  <div class="p-6">
    <BaseDataTable title="User Subscriptions" :data="subscriptions" :columns="columns" search-placeholder="Search users...">
      <template #actions>
        <UButton label="Add Subscription" color="black" icon="i-heroicons-plus" @click="openCreate" />
      </template>
    </BaseDataTable>

    <UModal v-model="isOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">{{ editing ? 'Edit Subscription' : 'Add Subscription' }}</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
          </div>
        </template>

        <div class="space-y-4">
          <UFormGroup label="User" name="user"><UInput v-model="form.user" placeholder="John Doe" icon="i-heroicons-user" /></UFormGroup>
          <UFormGroup label="Email" name="email"><UInput v-model="form.email" type="email" placeholder="john@example.com" icon="i-heroicons-envelope" /></UFormGroup>
          <UFormGroup label="Plan" name="plan">
            <USelect v-model="form.plan" :options="['Starter','Pro','Enterprise']" />
          </UFormGroup>
          <UFormGroup label="Status" name="status">
            <USelect v-model="form.status" :options="['Active','Canceled','Past Due']" />
          </UFormGroup>
          <UFormGroup label="Next Billing" name="nextBilling"><UInput v-model="form.nextBilling" placeholder="2025-11-15" /></UFormGroup>
          <div class="flex justify-end gap-2 mt-6">
            <UButton label="Cancel" color="gray" variant="ghost" @click="isOpen = false" />
            <UButton label="Save" color="primary" @click="save" />
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
  </template>