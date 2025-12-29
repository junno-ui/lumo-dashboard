<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { plans as initialPlans } from '@/mock/subscriptions'

type BillingPeriod = 'monthly' | 'yearly'
type Plan = {
  id: number
  name: string
  price: string
  interval: 'month' | 'year'
  features: string[]
  popular: boolean
  color?: string
  description?: string
}

// Make plans reactive for CRUD operations
const plans = ref<Plan[]>([...initialPlans] as Plan[])
const billingPeriod = ref<BillingPeriod>('monthly')

// Modal state
const isModalOpen = ref(false)
const editingPlan = ref<Plan | null>(null)
const planForm = ref<Plan>({
  id: 0,
  name: '',
  price: '$0',
  interval: 'month',
  features: [],
  popular: false,
  color: 'gray',
  description: '',
})

// Watch editingPlan to populate form
watch(editingPlan, (plan: Plan | null) => {
  if (plan) {
    planForm.value = {
      ...plan,
      features: [...plan.features],
    }
  } else {
    planForm.value = {
      id: 0,
      name: '',
      price: '$0',
      interval: 'month',
      features: [],
      popular: false,
      color: 'gray',
      description: '',
    }
  }
})

const displayedPlans = computed(() =>
  plans.value.map((plan: Plan) => {
    const basePrice = Number(plan.price.replace('$', '')) || 0
    const monthlyPrice =
      plan.interval === 'year' ? basePrice / 12 : basePrice

    const price =
      billingPeriod.value === 'monthly' ? monthlyPrice : monthlyPrice * 12

    const intervalLabel =
      billingPeriod.value === 'monthly' ? 'month' : 'year'

    return {
      ...plan,
      _computedPrice: price,
      _intervalLabel: intervalLabel,
      _monthlyPrice: monthlyPrice,
    }
  }),
)

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value)

const pricingPlans = computed(() =>
  displayedPlans.value.map((plan: any) => ({
    title: plan.name,
    description:
      plan.description ||
      (plan.popular
        ? 'Ideal for growing teams that need advanced features.'
        : 'Good fit for smaller teams and projects.'),
    price: formatCurrency(plan._computedPrice),
    features: [
      ...(plan.features || []),
      billingPeriod.value === 'yearly'
        ? `Billed annually • ${formatCurrency(plan._monthlyPrice)}/month equivalent`
        : `Billed monthly`,
    ],
    badge: plan.popular ? 'Best value' : undefined,
    scale: !!plan.popular,
    button: {
      label: plan.popular ? 'Set as default plan' : 'Choose plan',
    },
  })),
)

// CRUD Functions
function openCreateModal() {
  editingPlan.value = null
  planForm.value = {
    id: 0,
    name: '',
    price: '$0',
    interval: 'month',
    features: [],
    popular: false,
    color: 'gray',
    description: '',
  }
  isModalOpen.value = true
}

function openEditModal(plan: Plan) {
  editingPlan.value = { ...plan }
  isModalOpen.value = true
}

function handleSavePlan() {
  if (editingPlan.value) {
    // Update existing plan
    const index = plans.value.findIndex((p) => p.id === editingPlan.value!.id)
    if (index !== -1) {
      plans.value[index] = {
        ...planForm.value,
        id: editingPlan.value.id,
      }
    }
  } else {
    // Create new plan
    const newId =
      plans.value.length > 0
        ? Math.max(...plans.value.map((p) => p.id)) + 1
        : 1
    plans.value.push({
      ...planForm.value,
      id: newId,
    })
  }
  isModalOpen.value = false
  editingPlan.value = null
}

function handleDeletePlan(planId: number) {
  if (confirm('Are you sure you want to delete this plan?')) {
    plans.value = plans.value.filter((p) => p.id !== planId)
  }
}

// Feature management
function addFeature() {
  planForm.value.features.push('')
}

function removeFeature(index: number) {
  planForm.value.features.splice(index, 1)
}

function updateFeature(index: number, value: string) {
  planForm.value.features[index] = value
}

function getPlanDropdownItems(planTitle: string) {
  return [
    [
      {
        label: 'Edit',
        icon: 'i-heroicons-pencil-square',
        click: () => {
          const originalPlan = plans.value.find((p: Plan) => p.name === planTitle)
          if (originalPlan) openEditModal(originalPlan)
        },
      },
      {
        label: 'Delete',
        icon: 'i-heroicons-trash',
        color: 'red',
        click: () => {
          const originalPlan = plans.value.find((p: Plan) => p.name === planTitle)
          if (originalPlan) handleDeletePlan(originalPlan.id)
        },
      },
    ],
  ]
}
</script>

<template>
  <div class="p-6 space-y-6 bg-white dark:bg-gray-950 min-h-screen">
    <!-- Header + controls -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Subscription plans
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Configure and compare the plans your customers can subscribe to.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
          Billing
        </div>
        <div class="flex rounded-full border border-gray-200 dark:border-gray-800 p-1">
          <UButton
            size="xs"
            :variant="billingPeriod === 'monthly' ? 'solid' : 'ghost'"
            color="gray"
            class="px-3"
            @click="billingPeriod = 'monthly'"
          >
            Monthly
          </UButton>
          <UButton
            size="xs"
            :variant="billingPeriod === 'yearly' ? 'solid' : 'ghost'"
            color="gray"
            class="px-3"
            @click="billingPeriod = 'yearly'"
          >
            Yearly
          </UButton>
        </div>
        <UButton
          color="gray"
          variant="outline"
          size="sm"
          icon="i-heroicons-plus"
          @click="openCreateModal"
        >
          New plan
        </UButton>
      </div>
    </div>

    <!-- Plans grid using Nuxt UI pricing component -->
    <div class="relative">
      <UPricingPlans compact scale :plans="pricingPlans">
        <template #button="{ plan }">
          <div class="flex gap-2">
            <UButton
              color="black"
              block
              :label="plan.badge ? 'Set as default plan' : 'Choose plan'"
            />
            <UDropdown :items="getPlanDropdownItems(plan.title || '')">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-ellipsis-vertical-20-solid"
              />
            </UDropdown>
          </div>
        </template>
      </UPricingPlans>
    </div>

    <!-- Plan Form Modal -->
    <UModal
      v-model:open="isModalOpen"
      :title="editingPlan ? 'Edit Plan' : 'Create New Plan'"
      description="Configure plan details, pricing, and features for your subscription tiers."
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <div class="space-y-4">
          <!-- Plan Name -->
          <UFormGroup label="Plan Name" name="name" required>
            <UInput
              v-model="planForm.name"
              placeholder="e.g., Starter, Pro, Enterprise"
              icon="i-heroicons-tag"
            />
          </UFormGroup>

          <!-- Description -->
          <UFormGroup label="Description" name="description">
            <UTextarea
              v-model="planForm.description"
              placeholder="Brief description of the plan"
              :rows="2"
            />
          </UFormGroup>

          <!-- Price -->
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Price" name="price" required>
              <UInput
                v-model="planForm.price"
                placeholder="$29"
                icon="i-heroicons-currency-dollar"
              />
            </UFormGroup>

            <UFormGroup label="Billing Interval" name="interval" required>
              <USelect
                v-model="planForm.interval"
                :options="[
                  { label: 'Monthly', value: 'month' },
                  { label: 'Yearly', value: 'year' },
                ]"
              />
            </UFormGroup>
          </div>

          <!-- Popular & Color -->
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Mark as Popular" name="popular">
              <UToggle v-model="planForm.popular" />
            </UFormGroup>

            <UFormGroup label="Color" name="color">
              <USelect
                v-model="planForm.color"
                :options="[
                  { label: 'Gray', value: 'gray' },
                  { label: 'Blue', value: 'blue' },
                  { label: 'Green', value: 'green' },
                  { label: 'Purple', value: 'purple' },
                ]"
              />
            </UFormGroup>
          </div>

          <!-- Features -->
          <UFormGroup label="Features" name="features">
            <div class="space-y-2">
              <div
                v-for="(feature, index) in planForm.features"
                :key="index"
                class="flex gap-2"
              >
                <UInput
                  :model-value="feature"
                  placeholder="e.g., 5 Projects, 10GB Storage"
                  icon="i-heroicons-check-circle"
                  @update:model-value="(val) => updateFeature(index, val)"
                />
                <UButton
                  color="red"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  @click="removeFeature(index)"
                />
              </div>
              <UButton
                color="gray"
                variant="outline"
                icon="i-heroicons-plus"
                label="Add Feature"
                block
                @click="addFeature"
              />
            </div>
          </UFormGroup>
        </div>
      </template>

      <template #footer="{ close }">
        <UButton
          label="Cancel"
          color="gray"
          variant="outline"
          @click="close"
        />
        <UButton
          label="Save Plan"
          color="primary"
          @click="handleSavePlan"
        />
      </template>
    </UModal>
  </div>
</template>
