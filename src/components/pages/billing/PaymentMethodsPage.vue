<script setup lang="ts">
import { ref } from 'vue'
import { paymentMethods as mockMethods } from '@/mock/billing'

type Method = { id: number; type: string; last4?: string; expiry?: string; email?: string; default: boolean; icon: string }
const methods = ref<Method[]>(mockMethods.map((m:any) => ({ ...m })))

const isOpen = ref(false)
const form = ref<Method>({ id: 0, type: 'Visa', last4: '', expiry: '', email: '', default: false, icon: 'i-heroicons-credit-card' })

function openCreate() {
  form.value = { id: 0, type: 'Visa', last4: '', expiry: '', email: '', default: false, icon: 'i-heroicons-credit-card' }
  isOpen.value = true
}

function save() {
  const newId = Math.max(0, ...methods.value.map(x => x.id)) + 1
  methods.value.push({ ...form.value, id: newId })
  isOpen.value = false
}
</script>

<template>
  <div class="p-6 space-y-4">
    <div class="flex justify-end">
      <UButton label="Add Method" color="black" icon="i-heroicons-plus" @click="openCreate" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard v-for="m in methods" :key="m.id" class="p-4">
        <div class="flex items-center gap-3">
          <UIcon :name="m.icon" class="w-6 h-6 text-primary-500" />
          <div class="font-semibold">{{ m.type }}</div>
          <UBadge v-if="m.default" color="blue">Default</UBadge>
        </div>
        <div class="mt-3 text-sm text-gray-600">
          <div v-if="m.last4">•••• •••• •••• {{ m.last4 }} · Exp {{ m.expiry }}</div>
          <div v-else>{{ m.email }}</div>
        </div>
        <div class="mt-4">
          <UButton label="Manage" color="gray" variant="soft" />
        </div>
      </UCard>
    </div>

    <UModal v-model="isOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Add Payment Method</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
          </div>
        </template>
        <div class="space-y-4">
          <UFormGroup label="Type" name="type"><USelect v-model="form.type" :options="['Visa','Mastercard','PayPal']" /></UFormGroup>
          <UFormGroup label="Email" name="email"><UInput v-model="form.email" type="email" placeholder="billing@example.com" /></UFormGroup>
          <UFormGroup label="Card Last 4" name="last4"><UInput v-model="form.last4" placeholder="4242" /></UFormGroup>
          <UFormGroup label="Expiry" name="expiry"><UInput v-model="form.expiry" placeholder="12/28" /></UFormGroup>
          <div class="flex justify-end gap-2 mt-6">
            <UButton label="Cancel" color="gray" variant="ghost" @click="isOpen = false" />
            <UButton label="Save" color="primary" @click="save" />
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
  </template>