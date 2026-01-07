<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { profileSettings as mock } from '@/mock/settings'

type Profile = {
  name: string
  email: string
  bio: string
  avatar: string
  role?: string
  location?: string
  phone?: string
  website?: string
  timezone?: string
  lastUpdated?: string
}

const toast = useToast()

// Local editable copy (DON'T mutate mock directly)
const form = reactive<Profile>({
  name: mock.name,
  email: mock.email,
  bio: mock.bio,
  avatar: mock.avatar,
  role: (mock as any).role ?? 'Member',
  location: (mock as any).location ?? '—',
  phone: (mock as any).phone ?? '',
  website: (mock as any).website ?? '',
  timezone: (mock as any).timezone ?? 'Asia/Jakarta',
  lastUpdated: (mock as any).lastUpdated ?? new Date().toISOString()
})

const editMode = ref(false)
const saving = ref(false)

// For avatar upload UI (mock only)
const avatarFileName = ref<string>('')

const bioCount = computed(() => (form.bio?.length || 0))
const canSave = computed(() => {
  if (!editMode.value) return false
  if (!form.name.trim()) return false
  if (!form.email.trim()) return false
  return true
})

function startEdit() {
  editMode.value = true
}

function cancelEdit() {
  // reset to mock
  form.name = mock.name
  form.email = mock.email
  form.bio = mock.bio
  form.avatar = mock.avatar
  form.role = (mock as any).role ?? 'Member'
  form.location = (mock as any).location ?? '—'
  form.phone = (mock as any).phone ?? ''
  form.website = (mock as any).website ?? ''
  form.timezone = (mock as any).timezone ?? 'Asia/Jakarta'
  avatarFileName.value = ''
  editMode.value = false
}

async function save() {
  if (!canSave.value) return
  saving.value = true
  try {
    // simulate save
    await new Promise((r) => setTimeout(r, 450))
    form.lastUpdated = new Date().toISOString()

    toast.add({
      title: 'Profile updated',
      description: 'Your changes have been saved.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
    editMode.value = false
  } finally {
    saving.value = false
  }
}

// Very simple avatar “upload” handler (preview only)
function onPickAvatar(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  avatarFileName.value = file.name

  // Preview only (safe)
  const url = URL.createObjectURL(file)
  form.avatar = url

  toast.add({
    title: 'Avatar selected',
    description: 'Preview updated. Save to confirm changes.',
    color: 'neutral',
    icon: 'i-lucide-image'
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Header -->
      <div class="rounded-3xl border border-gray-200/70 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/50 backdrop-blur p-5 sm:p-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Profile</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Manage your personal information, avatar, and public details.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <UButton
              v-if="!editMode"
              color="primary"
              variant="solid"
              icon="i-lucide-pencil"
              @click="startEdit"
            >
              Edit profile
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
        <!-- Left: Profile Card -->
        <UCard class="rounded-3xl lg:col-span-1" :ui="{ body: 'p-5' }">
          <div class="flex flex-col items-center text-center">
            <div class="relative">
              <UAvatar
                :src="form.avatar"
                size="3xl"
                class="ring-4 ring-primary-500/20"
              />

              <!-- Upload button (only in edit mode) -->
              <label
                v-if="editMode"
                class="absolute -bottom-2 -right-2 cursor-pointer rounded-full p-2 bg-white dark:bg-gray-950 ring-1 ring-gray-200/70 dark:ring-gray-800/60 shadow-sm"
                title="Change avatar"
              >
                <UIcon name="i-lucide-camera" class="w-4 h-4 text-gray-700 dark:text-gray-200" />
                <input class="hidden" type="file" accept="image/*" @change="onPickAvatar" />
              </label>
            </div>

            <div class="mt-4 space-y-1">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ form.name }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ form.email }}
              </div>

              <div class="mt-2 flex items-center justify-center gap-2">
                <UBadge color="primary" variant="soft" size="xs">{{ form.role }}</UBadge>
                <UBadge color="neutral" variant="soft" size="xs">{{ form.timezone }}</UBadge>
              </div>

              <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {{ form.bio || 'No bio yet. Add a short description about yourself.' }}
              </p>
            </div>

            <div v-if="editMode && avatarFileName" class="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Selected: <span class="font-semibold text-gray-900 dark:text-white">{{ avatarFileName }}</span>
            </div>

            <div class="mt-5 w-full grid grid-cols-2 gap-2">
              <UButton
                color="neutral"
                variant="soft"
                icon="i-lucide-user"
                class="w-full"
                :disabled="editMode"
              >
                View public
              </UButton>
              <UButton
                color="neutral"
                variant="outline"
                icon="i-lucide-mail"
                class="w-full"
                :disabled="editMode"
              >
                Message
              </UButton>
            </div>

            <div class="mt-5 w-full rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-gray-50/60 dark:bg-gray-900/20 p-4 text-left">
              <div class="text-xs text-gray-500 dark:text-gray-400">Last updated</div>
              <div class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                {{ new Date(form.lastUpdated || Date.now()).toLocaleString() }}
              </div>
            </div>
          </div>
        </UCard>

        <!-- Right: Editable form -->
        <UCard class="rounded-3xl lg:col-span-2" :ui="{ body: 'p-5', footer: 'p-5' }">
          <template #header>
            <div class="p-5 pb-0">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Account information</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Keep your data accurate for notifications and account recovery.
              </p>
            </div>
          </template>

          <div class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField label="Full name" required>
                <UInput
                  v-model="form.name"
                  :disabled="!editMode"
                  icon="i-lucide-user"
                  placeholder="Your full name"
                />
              </UFormField>

              <UFormField label="Email address" required>
                <UInput
                  v-model="form.email"
                  :disabled="!editMode"
                  icon="i-lucide-mail"
                  placeholder="name@company.com"
                />
              </UFormField>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField label="Phone">
                <UInput
                  v-model="form.phone"
                  :disabled="!editMode"
                  icon="i-lucide-phone"
                  placeholder="+62..."
                />
              </UFormField>

              <UFormField label="Website">
                <UInput
                  v-model="form.website"
                  :disabled="!editMode"
                  icon="i-lucide-globe"
                  placeholder="https://..."
                />
              </UFormField>
            </div>

            <UFormField
              label="Bio"
              :help="editMode ? 'Max 160 characters. Make it short and clear.' : ''"
            >
              <UTextarea
                v-model="form.bio"
                :disabled="!editMode"
                :rows="4"
                placeholder="Write a short bio about yourself…"
              />
              <div class="mt-2 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                <span>Shown on your profile card.</span>
                <span :class="bioCount > 160 ? 'text-red-500' : ''">{{ bioCount }}/160</span>
              </div>
            </UFormField>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField label="Location">
                <UInput
                  v-model="form.location"
                  :disabled="!editMode"
                  icon="i-lucide-map-pin"
                  placeholder="City, Country"
                />
              </UFormField>

              <UFormField label="Timezone">
                <USelectMenu
                  v-model="form.timezone"
                  :disabled="!editMode"
                  :items="[
                    { label: 'Asia/Jakarta', value: 'Asia/Jakarta' },
                    { label: 'Asia/Makassar', value: 'Asia/Makassar' },
                    { label: 'Asia/Jayapura', value: 'Asia/Jayapura' }
                  ]"
                  value-key="value"
                  label-key="label"
                  color="neutral"
                  variant="outline"
                />
              </UFormField>
            </div>
          </div>

          <template #footer>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <UIcon name="i-lucide-info" class="w-4 h-4" />
                <span v-if="!editMode">Click “Edit profile” to update your information.</span>
                <span v-else>Review changes before saving.</span>
              </div>

              <div class="flex items-center justify-end gap-2">
                <UButton
                  v-if="editMode"
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-undo-2"
                  :disabled="saving"
                  @click="cancelEdit"
                >
                  Reset
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
                    For security, account-level actions should be done carefully.
                  </div>

                  <div class="mt-3 flex flex-col sm:flex-row gap-2">
                    <UButton
                      color="neutral"
                      variant="outline"
                      icon="i-lucide-key-round"
                      to="/settings/security"
                    >
                      Manage security
                    </UButton>
                    <UButton
                      color="error"
                      variant="soft"
                      icon="i-lucide-log-out"
                      @click="toast.add({ title: 'Logged out (mock)', color: 'neutral' })"
                    >
                      Sign out
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UCard>
      </div>

      <!-- Quick actions -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UCard class="rounded-3xl" :ui="{ body: 'p-5' }">
          <div class="flex items-start gap-3">
            <div class="h-10 w-10 rounded-2xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center">
              <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div class="flex-1">
              <div class="font-semibold text-gray-900 dark:text-white">Security</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Password, 2FA, sessions</div>
              <UButton class="mt-3" size="sm" color="neutral" variant="outline" to="/settings/security" icon="i-lucide-arrow-right">
                Open
              </UButton>
            </div>
          </div>
        </UCard>

        <UCard class="rounded-3xl" :ui="{ body: 'p-5' }">
          <div class="flex items-start gap-3">
            <div class="h-10 w-10 rounded-2xl bg-gray-50 dark:bg-gray-900/40 flex items-center justify-center ring-1 ring-gray-200/70 dark:ring-gray-800/60">
              <UIcon name="i-lucide-bell" class="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </div>
            <div class="flex-1">
              <div class="font-semibold text-gray-900 dark:text-white">Preferences</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Notifications & UI</div>
              <UButton class="mt-3" size="sm" color="neutral" variant="outline" to="/settings/preferences" icon="i-lucide-arrow-right">
                Open
              </UButton>
            </div>
          </div>
        </UCard>

        <UCard class="rounded-3xl" :ui="{ body: 'p-5' }">
          <div class="flex items-start gap-3">
            <div class="h-10 w-10 rounded-2xl bg-gray-50 dark:bg-gray-900/40 flex items-center justify-center ring-1 ring-gray-200/70 dark:ring-gray-800/60">
              <UIcon name="i-lucide-credit-card" class="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </div>
            <div class="flex-1">
              <div class="font-semibold text-gray-900 dark:text-white">Billing</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Invoices & payments</div>
              <UButton class="mt-3" size="sm" color="neutral" variant="outline" to="/billing/overview" icon="i-lucide-arrow-right">
                Open
              </UButton>
            </div>
          </div>
        </UCard>

        <UCard class="rounded-3xl" :ui="{ body: 'p-5' }">
          <div class="flex items-start gap-3">
            <div class="h-10 w-10 rounded-2xl bg-gray-50 dark:bg-gray-900/40 flex items-center justify-center ring-1 ring-gray-200/70 dark:ring-gray-800/60">
              <UIcon name="i-lucide-users" class="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </div>
            <div class="flex-1">
              <div class="font-semibold text-gray-900 dark:text-white">Organization</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Teams & members</div>
              <UButton class="mt-3" size="sm" color="neutral" variant="outline" to="/settings/organization" icon="i-lucide-arrow-right">
                Open
              </UButton>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
