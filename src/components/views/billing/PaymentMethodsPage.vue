<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { DropdownMenuItem, FormSubmitEvent } from '@nuxt/ui'
import * as yup from 'yup'
import { paymentMethods as mockMethods } from '@/data/billing'

type MethodType = 'Visa' | 'Mastercard' | 'PayPal'
type Method = {
  id: number
  type: MethodType
  last4?: string
  expiry?: string
  email?: string
  default: boolean
  icon: string
}

const toast = useToast()

const methods = ref<Method[]>(
  (Array.isArray(mockMethods) ? mockMethods : []).map((m: any) => ({ ...m }))
)

const open = ref(false)
const mode = ref<'create' | 'edit'>('create')
const editingId = ref<number | null>(null)
const saving = ref(false)

/** Form */
const schema = yup.object({
  type: yup.mixed<MethodType>().oneOf(['Visa', 'Mastercard', 'PayPal']).required(),
  default: yup.boolean().required(),
  email: yup
    .string()
    .email('Invalid email')
    .when('type', { is: 'PayPal', then: (s) => s.required('Email is required for PayPal'), otherwise: (s) => s.optional() }),
  last4: yup
    .string()
    .when('type', {
      is: (v: MethodType) => v !== 'PayPal',
      then: (s) => s.required('Last 4 is required').matches(/^\d{4}$/, 'Must be 4 digits'),
      otherwise: (s) => s.optional()
    }),
  expiry: yup
    .string()
    .when('type', {
      is: (v: MethodType) => v !== 'PayPal',
      then: (s) => s.required('Expiry is required').matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY'),
      otherwise: (s) => s.optional()
    })
})
type FormShape = yup.InferType<typeof schema>

const form = reactive<FormShape>({
  type: 'Visa',
  email: '',
  last4: '',
  expiry: '',
  default: false
})

const isCard = computed(() => form.type !== 'PayPal')

function iconFor(type: MethodType) {
  if (type === 'PayPal') return 'i-lucide-paypal'
  if (type === 'Mastercard') return 'i-lucide-credit-card'
  return 'i-lucide-credit-card'
}

function resetForm() {
  Object.assign(form, { type: 'Visa', email: '', last4: '', expiry: '', default: false })
}

function openCreate() {
  mode.value = 'create'
  editingId.value = null
  resetForm()
  open.value = true
}

function openEdit(m: Method) {
  mode.value = 'edit'
  editingId.value = m.id
  Object.assign(form, {
    type: m.type,
    email: m.email || '',
    last4: m.last4 || '',
    expiry: m.expiry || '',
    default: !!m.default
  })
  open.value = true
}

/** Actions */
function setDefault(id: number) {
  methods.value = methods.value.map((m) => ({ ...m, default: m.id === id }))
  toast.add({ title: 'Default updated', color: 'success', icon: 'i-lucide-circle-check' })
}

function removeMethod(id: number) {
  const current = methods.value.find((m) => m.id === id)
  methods.value = methods.value.filter((m) => m.id !== id)

  // keep at least one default if any remain
  if (methods.value.length && !methods.value.some((m) => m.default)) {
    const first = methods.value[0]
    if (first) {
      first.default = true
    }
  }

  toast.add({
    title: 'Payment method removed',
    description: current ? `${current.type}${current.last4 ? ` •••• ${current.last4}` : ''}` : undefined,
    color: 'neutral',
    icon: 'i-lucide-trash-2'
  })
}

const modalTitle = computed(() => (mode.value === 'edit' ? 'Edit payment method' : 'Add payment method'))
const modalDesc = computed(() =>
  mode.value === 'edit'
    ? 'Update details or set this as default.'
    : 'Add a new card or PayPal account for billing.'
)
const submitLabel = computed(() => (mode.value === 'edit' ? 'Save changes' : 'Add method'))

async function onSubmit(e: FormSubmitEvent<FormShape>) {
  saving.value = true
  try {
    const data = e.data

    // enforce a single default
    if (data.default) methods.value = methods.value.map((m) => ({ ...m, default: false }))

    if (mode.value === 'edit' && editingId.value != null) {
      methods.value = methods.value.map((m) =>
        m.id === editingId.value
          ? ({
              ...m,
              type: data.type,
              icon: iconFor(data.type),
              default: data.default,
              email: data.type === 'PayPal' ? data.email || '' : '',
              last4: data.type === 'PayPal' ? '' : data.last4 || '',
              expiry: data.type === 'PayPal' ? '' : data.expiry || ''
            } as Method)
          : m
      )

      toast.add({ title: 'Payment method updated', color: 'success', icon: 'i-lucide-save' })
    } else {
      const newId = Math.max(0, ...methods.value.map((x) => x.id)) + 1
      methods.value = [
        ...methods.value,
        {
          id: newId,
          type: data.type,
          icon: iconFor(data.type),
          default: data.default,
          email: data.type === 'PayPal' ? data.email || '' : '',
          last4: data.type === 'PayPal' ? '' : data.last4 || '',
          expiry: data.type === 'PayPal' ? '' : data.expiry || ''
        }
      ]

      // if none default, make newest default
      if (!methods.value.some((m) => m.default)) setDefault(newId)

      toast.add({ title: 'Payment method added', color: 'success', icon: 'i-lucide-plus' })
    }

    open.value = false
    resetForm()
  } finally {
    saving.value = false
  }
}

/** Menu items per card */
function menuItems(m: Method): DropdownMenuItem[][] {
  return [
    [{ type: 'label', label: m.default ? 'Default method' : 'Payment method' }],
    [
      { label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => openEdit(m) },
      { label: 'Set as default', icon: 'i-lucide-star', disabled: m.default, onSelect: () => setDefault(m.id) }
    ],
    [{ label: 'Remove', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => removeMethod(m.id) }]
  ]
}

const defaultMethod = computed(() => methods.value.find((m) => m.default) || null)
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <div class=" px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Payment methods</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Manage cards and PayPal accounts used for billing. Choose one default method for automatic payments.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <UButton color="neutral" variant="outline" icon="i-lucide-receipt" to="/billing/invoices">Invoices</UButton>
          <UButton color="primary" icon="i-lucide-plus" @click="openCreate">Add method</UButton>
        </div>
      </div>

      <!-- Default highlight -->
      <UCard v-if="defaultMethod" class="rounded-2xl" :ui="{ body: 'p-4' }">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-3 min-w-0">
            <div class="p-2 rounded-xl bg-white dark:bg-gray-900 ring-1 ring-gray-200/70 dark:ring-gray-800/60">
              <UIcon :name="defaultMethod.icon" class="size-5 text-primary" />
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <p class="font-semibold text-gray-900 dark:text-white">Default method</p>
                <UBadge color="primary" variant="soft" size="xs">Auto-pay</UBadge>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                <span class="font-medium">{{ defaultMethod.type }}</span>
                <span v-if="defaultMethod.last4"> •••• {{ defaultMethod.last4 }} · Exp {{ defaultMethod.expiry }}</span>
                <span v-else-if="defaultMethod.email"> · {{ defaultMethod.email }}</span>
              </p>
            </div>
          </div>

          <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-settings" @click="openEdit(defaultMethod)">
            Manage
          </UButton>
        </div>
      </UCard>

      <!-- Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard
          v-for="m in methods"
          :key="m.id"
          class="rounded-2xl"
          :ui="{ body: 'p-4' }"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3 min-w-0">
              <div class="p-2 rounded-xl bg-white dark:bg-gray-900 ring-1 ring-gray-200/70 dark:ring-gray-800/60">
                <UIcon :name="m.icon" class="size-5 text-primary" />
              </div>

              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <p class="font-semibold text-gray-900 dark:text-white truncate">{{ m.type }}</p>
                  <UBadge v-if="m.default" color="primary" variant="soft" size="xs">Default</UBadge>
                </div>

                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 truncate">
                  <template v-if="m.last4">
                    •••• {{ m.last4 }} · Exp {{ m.expiry }}
                  </template>
                  <template v-else>
                    {{ m.email || '—' }}
                  </template>
                </p>
              </div>
            </div>

            <UDropdownMenu :items="menuItems(m)" :content="{ align: 'end' }">
              <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="sm" aria-label="Actions" />
            </UDropdownMenu>
          </div>

          <div class="mt-4 flex items-center gap-2">
            <UButton size="sm" class="flex-1" color="neutral" variant="outline" icon="i-lucide-pencil" @click="openEdit(m)">
              Edit
            </UButton>
            <UButton
              size="sm"
              class="flex-1"
              :color="m.default ? 'neutral' : 'primary'"
              :variant="m.default ? 'outline' : 'solid'"
              icon="i-lucide-star"
              :disabled="m.default"
              @click="setDefault(m.id)"
            >
              {{ m.default ? 'Default' : 'Set default' }}
            </UButton>
          </div>
        </UCard>
      </div>

      <!-- Modal (Nuxt UI doc style) -->
      <UModal v-model:open="open" :ui="{ content: 'sm:max-w-lg' }" :dismissible="true">
        <template #header>
          <div class="space-y-1">
            <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ modalTitle }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ modalDesc }}</p>
          </div>
        </template>

        <template #body>
          <UForm :schema="schema" :state="form" class="space-y-4" @submit="onSubmit" id="pm-form">
            <UFormField label="Type" name="type" required>
              <USelectMenu
                v-model="form.type"
                :items="[
                  { label: 'Visa', value: 'Visa' },
                  { label: 'Mastercard', value: 'Mastercard' },
                  { label: 'PayPal', value: 'PayPal' }
                ]"
                value-key="value"
                label-key="label"
                color="neutral"
                variant="outline"
              />
            </UFormField>

            <div v-if="!isCard" class="space-y-4">
              <UFormField label="PayPal email" name="email" required>
                <UInput v-model="form.email" type="email" placeholder="billing@example.com" icon="i-lucide-mail" />
              </UFormField>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField label="Card last 4" name="last4" required>
                <UInput v-model="form.last4" placeholder="4242" inputmode="numeric" maxlength="4" />
              </UFormField>

              <UFormField label="Expiry (MM/YY)" name="expiry" required>
                <UInput v-model="form.expiry" placeholder="12/28" />
              </UFormField>
            </div>

            <UFormField label="Default" name="default" help="Only one method can be default.">
              <div class="h-10 flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 px-3 bg-white/60 dark:bg-gray-900/30">
                <div class="text-sm text-gray-700 dark:text-gray-200">Use as default</div>
                <USwitch v-model="form.default" />
              </div>
            </UFormField>
          </UForm>
        </template>

        <template #footer>
          <div class="flex items-center justify-end gap-2 w-full">
            <UButton color="neutral" variant="ghost" @click="open = false">Cancel</UButton>
            <UButton
              color="primary"
              :loading="saving"
              type="submit"
              form="pm-form"
              icon="i-lucide-save"
            >
              {{ submitLabel }}
            </UButton>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>
