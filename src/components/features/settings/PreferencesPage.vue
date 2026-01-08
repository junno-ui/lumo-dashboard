<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { preferences as mockPreferences } from '@/mock/settings'

type Theme = 'System' | 'Light' | 'Dark'
type Language = 'English' | 'Indonesian' | 'Japanese' | 'French'

type Prefs = {
  theme: Theme
  language: Language 
  notifications: {
    email: boolean
    push: boolean
    desktop: boolean
  }
  quietHours: {
    enabled: boolean
    start: string 
    end: string 
  }
}

const toast = useToast()

// local editable state (don’t mutate mock directly)
const state = reactive<Prefs>({
  theme: mockPreferences.theme as Theme ?? 'System',
  language: mockPreferences.language ?? 'English',
  notifications: {
    email: !!mockPreferences.notifications?.email,
    push: !!mockPreferences.notifications?.push,
    desktop: !!mockPreferences.notifications?.desktop
  },
  quietHours: {
    enabled: !!mockPreferences.quietHours?.enabled,
    start: mockPreferences.quietHours?.start ?? '22:00',
    end: mockPreferences.quietHours?.end ?? '07:00'
  }
});
const initial = ref(JSON.stringify(state))

const isDirty = computed(() => JSON.stringify(state) !== initial.value)

const themeItems = [
  {
    value: 'System',
    label: 'System',
    description: 'Match your OS appearance automatically.',
    icon: 'i-lucide-monitor'
  },
  {
    value: 'Light',
    label: 'Light',
    description: 'Always use a bright interface.',
    icon: 'i-lucide-sun'
  },
  {
    value: 'Dark',
    label: 'Dark',
    description: 'Always use a darker interface.',
    icon: 'i-lucide-moon'
  }
]

const languageItems = [
  { label: 'English', value: 'English' },
  { label: 'Indonesian', value: 'Indonesian' },
  { label: 'Japanese', value: 'Japanese' },
  { label: 'French', value: 'French' }
]

function discard() {
  const parsed = JSON.parse(initial.value)
  Object.assign(state, parsed)
  toast.add({ title: 'Changes discarded', color: 'neutral', icon: 'i-lucide-undo-2' })
}

function save() {
  // In real app: call API here
  initial.value = JSON.stringify(state)
  toast.add({ title: 'Preferences saved', color: 'success', icon: 'i-lucide-circle-check' })
}

const notificationSummary = computed(() => {
  const enabled = Object.entries(state.notifications).filter(([, v]) => v).map(([k]) => k)
  if (!enabled.length) return 'All notifications are disabled.'
  return `Enabled: ${enabled.join(', ')}.`
})
</script>

<template>
  <AppPage
    title="Preferences"
    description="Personalize your workspace: theme, language, and notification rules."
    icon="i-lucide-sliders-horizontal"
  >
    <template #actions>
      <UButton color="neutral" variant="outline" icon="i-lucide-rotate-ccw" :disabled="!isDirty" @click="discard">
        Discard
      </UButton>
      <UButton color="primary" icon="i-lucide-save" :disabled="!isDirty" @click="save">
        Save
      </UButton>
    </template>

    <!-- Unsaved bar -->
    <UAlert
      v-if="isDirty"
      color="warning"
      variant="soft"
      icon="i-lucide-alert-triangle"
      title="You have unsaved changes"
      description="Save to apply your updated preferences."
      class="rounded-3xl"
    />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Appearance -->
      <UCard class="rounded-3xl" :ui="{ body: 'p-5 space-y-4' }">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <div class="h-9 w-9 rounded-2xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center">
                <UIcon name="i-lucide-palette" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">Appearance</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Choose how the interface looks across the app.
                </p>
              </div>
            </div>
          </div>

          <UBadge color="neutral" variant="soft" size="xs">
            Current: {{ state.theme }}
          </UBadge>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            v-for="t in themeItems"
            :key="t.value"
            type="button"
            class="text-left rounded-2xl border p-4 transition
              border-gray-200/70 dark:border-gray-800/60
              bg-white/60 dark:bg-gray-950/30
              hover:bg-gray-50 dark:hover:bg-gray-900/40"
            :class="state.theme === t.value ? 'ring-2 ring-primary-500/40' : ''"
          >
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <UIcon :name="t.icon" class="w-4 h-4 text-gray-700 dark:text-gray-200" />
                <div class="font-semibold text-gray-900 dark:text-white">{{ t.label }}</div>
              </div>

              <UIcon
                v-if="state.theme === t.value"
                name="i-lucide-check-circle-2"
                class="w-4 h-4 text-primary-600 dark:text-primary-400"
              />
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {{ t.description }}
            </div>
          </button>
        </div>

        <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-gray-50/60 dark:bg-gray-950/25 p-4">
          <div class="text-xs text-gray-500 dark:text-gray-400">Tip</div>
          <div class="text-sm text-gray-700 dark:text-gray-200 mt-1">
            Use <span class="font-semibold">System</span> for consistent look across devices.
          </div>
        </div>
      </UCard>

      <!-- Language -->
      <UCard class="rounded-3xl" :ui="{ body: 'p-5 space-y-4' }">
        <div class="flex items-start gap-3">
          <div class="h-9 w-9 rounded-2xl bg-gray-100 dark:bg-gray-900/40 flex items-center justify-center">
            <UIcon name="i-lucide-languages" class="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </div>
          <div class="flex-1">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Language</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Choose your preferred language for UI labels.
            </p>

            <div class="mt-4">
              <UFormField label="App language" help="This only changes UI text, not your data.">
                <USelectMenu
                  v-model="state.language"
                  :items="languageItems"
                  value-key="value"
                  label-key="label"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="mt-4 rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/60 dark:bg-gray-950/30 p-4">
              <div class="text-xs text-gray-500 dark:text-gray-400">Current</div>
              <div class="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                {{ state.language }}
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Notifications -->
      <UCard class="rounded-3xl lg:col-span-2" :ui="{ body: 'p-5 space-y-5' }">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <div class="h-9 w-9 rounded-2xl bg-warning-50 dark:bg-warning-950/25 flex items-center justify-center">
              <UIcon name="i-lucide-bell" class="w-5 h-5 text-warning-600 dark:text-warning-400" />
            </div>
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Notifications</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Control how you receive product and account updates.
              </p>
            </div>
          </div>

          <UBadge color="neutral" variant="soft" size="xs">
            {{ notificationSummary }}
          </UBadge>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/60 dark:bg-gray-950/30 p-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-semibold text-gray-900 dark:text-white text-sm">Email</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Weekly summaries & receipts.</div>
              </div>
              <USwitch v-model="state.notifications.email" />
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/60 dark:bg-gray-950/30 p-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-semibold text-gray-900 dark:text-white text-sm">Push</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Important changes instantly.</div>
              </div>
              <USwitch v-model="state.notifications.push" />
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/60 dark:bg-gray-950/30 p-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-semibold text-gray-900 dark:text-white text-sm">Desktop</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Browser notifications.</div>
              </div>
              <USwitch v-model="state.notifications.desktop" />
            </div>
          </div>
        </div>

        <!-- Quiet hours -->
        <div class="rounded-3xl border border-gray-200/70 dark:border-gray-800/60 bg-gray-50/60 dark:bg-gray-950/25 p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-moon-star" class="w-4 h-4 text-gray-700 dark:text-gray-200" />
                <div class="font-semibold text-gray-900 dark:text-white">Quiet hours</div>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Pause non-critical notifications during your focus time.
              </div>
            </div>
            <USwitch v-model="state.quietHours.enabled" />
          </div>

          <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3" :class="!state.quietHours.enabled ? 'opacity-60' : ''">
            <UFormField label="Start" help="24-hour format">
              <UInput v-model="state.quietHours.start" type="time" :disabled="!state.quietHours.enabled" />
            </UFormField>

            <UFormField label="End" help="24-hour format">
              <UInput v-model="state.quietHours.end" type="time" :disabled="!state.quietHours.enabled" />
            </UFormField>
          </div>

          <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Quiet hours apply to push & desktop notifications (not invoices/critical alerts).
          </div>
        </div>
      </UCard>
    </div>

    <!-- Bottom actions (extra UX for long pages) -->
    <div class="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
      <UButton color="neutral" variant="outline" :disabled="!isDirty" icon="i-lucide-rotate-ccw" @click="discard">
        Discard changes
      </UButton>
      <UButton color="primary" :disabled="!isDirty" icon="i-lucide-save" @click="save">
        Save preferences
      </UButton>
    </div>
  </AppPage>
</template>
