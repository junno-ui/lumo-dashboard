<script setup lang="ts">
import { ref, watch } from 'vue'
import { object, string } from 'yup'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  isOpen.value = val
})

watch(isOpen, (val) => {
  emit('update:modelValue', val)
})

const state = ref({
  name: '',
  email: '',
  role: 'member',
  status: 'active'
})

// Validation
const schema = object({
  name: string().required('Name is required'),
  email: string().email('Invalid email').required('Email is required'),
  role: string().required('Role is required')
})

// Populate form if editing
watch(() => props.user, (newUser) => {
  if (newUser) {
    state.value = { ...newUser } as any
  } else {
    state.value = {
      name: '',
      email: '',
      role: 'member',
      status: 'active'
    }
  }
}, { immediate: true })

async function onSubmit(event: any) {
  emit('save', { ...event.data, id: props.user?.id })
  isOpen.value = false
}
</script>

<template>
  <UModal v-model="isOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ user ? 'Edit User' : 'Add New User' }}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
        </div>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Name" name="name" required>
          <UInput v-model="state.name" placeholder="John Doe" icon="i-heroicons-user" />
        </UFormGroup>

        <UFormGroup label="Email" name="email" required>
          <UInput v-model="state.email" type="email" placeholder="john@example.com" icon="i-heroicons-envelope" />
        </UFormGroup>

        <UFormGroup label="Role" name="role" required>
          <USelect
            v-model="state.role"
            :options="[
              { label: 'Admin', value: 'admin' },
              { label: 'Member', value: 'member' },
              { label: 'Viewer', value: 'viewer' }
            ]"
          />
        </UFormGroup>

        <UFormGroup label="Status" name="status">
           <USelect
            v-model="state.status"
            :options="[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' }
            ]"
          />
        </UFormGroup>

        <div class="flex justify-end gap-2 mt-6">
          <UButton label="Cancel" color="gray" variant="ghost" @click="isOpen = false" />
          <UButton type="submit" label="Save" color="primary" />
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>
