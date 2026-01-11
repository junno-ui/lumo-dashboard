<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { organizationSettings as mock } from '@/data/settings'

type Org = {
  name: string
  domain: string
  logo: string
  members: number
  plan?: string
  billingEmail?: string
  address?: string
  website?: string
  createdAt?: string
}

const toast = useToast()

const org = reactive<Org>({
  name: mock.name,
  domain: mock.domain,
  logo: mock.logo,
  members: Number(mock.members ?? 0),
  plan: (mock as any).plan ?? 'Pro',
  billingEmail: (mock as any).billingEmail ?? 'billing@company.com',
  address: (mock as any).address ?? '—',
  website: (mock as any).website ?? '',
  createdAt: (mock as any).createdAt ?? new Date().toISOString()
})

const editMode = ref(false)
const saving = ref(false)
const logoFileName = ref('')

const canSave = computed(() => {
  if (!editMode.value) return false
  if (!org.name.trim()) return false
  if (!org.domain.trim()) return false
  return true
})

function startEdit() {
  editMode.value = true
}

function cancelEdit() {
  org.name = mock.name
  org.domain = mock.domain
  org.logo = mock.logo
  org.members = Number(mock.members ?? 0)
  org.plan = (mock as any).plan ?? 'Pro'
  org.billingEmail = (mock as any).billingEmail ?? 'billing@company.com'
  org.address = (mock as any).address ?? '—'
  org.website = (mock as any).website ?? ''
  org.createdAt = (mock as any).createdAt ?? new Date().toISOString()
  logoFileName.value = ''
  editMode.value = false
}

async function save() {
  if (!canSave.value) return
  saving.value = true
  try {
    await new Promise((r) => setTimeout(r, 450))
    toast.add({
      title: 'Organization updated',
      description: 'Changes saved successfully.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
    editMode.value = false
  } finally {
    saving.value = false
  }
}

function onPickLogo(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  logoFileName.value = file.name
  org.logo = URL.createObjectURL(file)

  toast.add({
    title: 'Logo selected',
    description: 'Preview updated. Save to apply changes.',
    color: 'neutral',
    icon: 'i-lucide-image'
  })
}

const memberTier = computed(() => {
  const m = org.members || 0
  if (m <= 5) return { label: 'Small team', hint: 'Great for early stage teams.' }
  if (m <= 25) return { label: 'Growing team', hint: 'Consider setting up roles & permissions.' }
  return { label: 'Large org', hint: 'Recommended: SSO + audit logs.' }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <div class=" px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Header -->
      <div class="rounded-3xl border border-gray-200/70 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/50 backdrop-blur p-5 sm:p-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Organization</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Manage your organization profile, domain, and billing contact.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <UButton
              v-if="!editMode"
              color="primary"
              icon="i-lucide-pencil"
              @click="startEdit"
            >
              Edit organization
            </UButton>

            <template v-else>
              <UButton
                color="neutral"
                variant="outline"
                icon="i-lucide-x"
                :disabled="saving"
                @click="cancelEdit"
              >
                Cancel
              </UButton>
              <UButton
                color="primary"
                icon="i-lucide-save"
                :loading="saving"
                :disabled="!canSave"
                @click="save"
              >
                Save changes
              </UButton>
            </template>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Org identity card -->
        <UCard class="rounded-3xl lg:col-span-1" :ui="{ body: 'p-5' }">
          <div class="flex items-start gap-4">
            <div class="relative">
              <UAvatar :src="org.logo" size="xl" class="ring-4 ring-primary-500/15" />

              <label
                v-if="editMode"
                class="absolute -bottom-2 -right-2 cursor-pointer rounded-full p-2 bg-white dark:bg-gray-950 ring-1 ring-gray-200/70 dark:ring-gray-800/60 shadow-sm"
                title="Change logo"
              >
                <UIcon name="i-lucide-camera" class="w-4 h-4 text-gray-700 dark:text-gray-200" />
                <input class="hidden" type="file" accept="image/*" @change="onPickLogo" />
              </label>
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-2">
                <div class="min-w-0">
                  <div class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {{ org.name }}
                  </div>
                  <div class="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                    Domain: <span class="font-medium text-gray-900 dark:text-white">{{ org.domain }}</span>
                  </div>
                </div>

                <UBadge color="primary" variant="soft" size="xs" class="shrink-0">
                  {{ org.plan }}
                </UBadge>
              </div>

              <div class="mt-3 flex flex-wrap items-center gap-2">
                <UBadge color="neutral" variant="soft" size="xs">
                  {{ org.members }} members
                </UBadge>
                <UBadge color="success" variant="soft" size="xs">
                  {{ memberTier.label }}
                </UBadge>
              </div>

              <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
                {{ memberTier.hint }}
              </div>

              <div v-if="editMode && logoFileName" class="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Selected: <span class="font-semibold text-gray-900 dark:text-white">{{ logoFileName }}</span>
              </div>
            </div>
          </div>

          <div class="mt-5 grid grid-cols-2 gap-2">
            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-users"
              class="w-full"
              to="/users/all-users"
            >
              Manage users
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-shield"
              class="w-full"
              to="/users/roles"
            >
              Roles
            </UButton>
          </div>

          <div class="mt-5 rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-gray-50/60 dark:bg-gray-900/20 p-4">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Created</span>
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ new Date(org.createdAt || Date.now()).toLocaleDateString() }}
              </span>
            </div>
            <div class="flex items-center justify-between text-sm mt-1">
              <span class="text-gray-600 dark:text-gray-400">Billing contact</span>
              <span class="font-semibold text-gray-900 dark:text-white truncate max-w-40 text-right">
                {{ org.billingEmail }}
              </span>
            </div>
          </div>
        </UCard>

        <!-- Right: Org details -->
        <UCard class="rounded-3xl lg:col-span-2" :ui="{ body: 'p-5', footer: 'p-5' }">
          <template #header>
            <div class="p-5 pb-0">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Organization details</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                These details may appear on invoices and team-facing pages.
              </p>
            </div>
          </template>

          <div class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField label="Organization name" required>
                <UInput v-model="org.name" :disabled="!editMode" icon="i-lucide-building-2" placeholder="Company name" />
              </UFormField>

              <UFormField label="Domain" required help="Used for SSO or allowed email domains (if enabled).">
                <UInput v-model="org.domain" :disabled="!editMode" icon="i-lucide-globe" placeholder="company.com" />
              </UFormField>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField label="Billing email" help="Invoices and billing updates will be sent here.">
                <UInput v-model="org.billingEmail" :disabled="!editMode" icon="i-lucide-mail" placeholder="billing@company.com" />
              </UFormField>

              <UFormField label="Website">
                <UInput v-model="org.website" :disabled="!editMode" icon="i-lucide-link" placeholder="https://company.com" />
              </UFormField>
            </div>

            <UFormField label="Address (optional)">
              <UTextarea v-model="org.address" :disabled="!editMode" :rows="3" placeholder="Office address for invoices..." />
            </UFormField>

            <!-- Helpful info panel -->
            <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/40 p-4">
              <div class="flex items-start gap-3">
                <div class="h-9 w-9 rounded-2xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center">
                  <UIcon name="i-lucide-info" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div class="flex-1">
                  <div class="font-semibold text-gray-900 dark:text-white">Tips</div>
                  <ul class="mt-1 text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc pl-5">
                    <li>Use your real company domain to avoid confusion in invites.</li>
                    <li>Set a billing email that multiple finance/admins can access.</li>
                    <li>For larger orgs, enable roles & audit logs to improve governance.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <UIcon name="i-lucide-lock" class="w-4 h-4" />
                <span>Organization changes may affect invites and billing details.</span>
              </div>

              <div class="flex items-center justify-end gap-2">
                <UButton
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-credit-card"
                  to="/billing/overview"
                >
                  Billing
                </UButton>

                <UButton
                  color="primary"
                  icon="i-lucide-save"
                  :loading="saving"
                  :disabled="!canSave"
                  @click="save"
                >
                  Save
                </UButton>
              </div>
            </div>

            <!-- Danger zone -->
            <div class="mt-5 rounded-2xl border border-red-200/70 dark:border-red-900/40 bg-red-50/60 dark:bg-red-950/20 p-4">
              <div class="flex items-start gap-3">
                <div class="h-9 w-9 rounded-2xl bg-white/70 dark:bg-red-950/30 ring-1 ring-red-200/70 dark:ring-red-900/40 flex items-center justify-center">
                  <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div class="flex-1">
                  <div class="font-semibold text-gray-900 dark:text-white">Danger zone</div>
                  <div class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Organization-level actions should be performed carefully.
                  </div>

                  <div class="mt-3 flex flex-col sm:flex-row gap-2">
                    <UButton
                      color="neutral"
                      variant="outline"
                      icon="i-lucide-user-plus"
                      to="/users/all-users"
                    >
                      Invite members
                    </UButton>
                    <UButton
                      color="error"
                      variant="soft"
                      icon="i-lucide-trash-2"
                      @click="toast.add({ title: 'Delete org (mock)', description: 'Hook to your API later.', color: 'error' })"
                    >
                      Delete organization
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>
