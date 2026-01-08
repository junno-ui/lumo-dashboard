<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  open: boolean
  loading?: boolean
  title?: string
  description?: string
  name?: string
  email?: string
  avatar?: string

}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  title: 'Log out',
  description: 'Are you sure you want to log out? You can sign in again anytime.',
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm', payload: { rememberDevice: boolean }): void
  (e: 'cancel'): void
}>()

const rememberDevice = defineModel<boolean>('rememberDevice', { default: true })

function closeModal() {
  emit('update:open', false)
  emit('cancel')
}

function confirmLogout() {
  emit('confirm', { rememberDevice: rememberDevice.value })
}

const initials = computed(() => {
  const name = (props.name || '').trim()
  if (!name) return 'U'
  const parts = name.split(/\s+/).slice(0, 2)
  return parts.map(p => p[0]?.toUpperCase()).join('')
})
</script>

<template>
  <UModal
    :open="props.open"
    @update:open="(v:any) => emit('update:open', v)"
    :ui="{
      content: 'rounded-2xl',
      header: 'pb-3',
      body: 'py-4',
      footer: 'justify-end gap-2'
    }"
  >
    <!-- Custom header with icon -->
    <template #header>
      <div class="flex items-start gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl
                 bg-primary-500/10 text-primary-600 dark:text-primary-400"
        >
          <UIcon name="i-heroicons-arrow-left-on-rectangle" class="h-5 w-5" />
        </div>

        <div class="min-w-0">
          <div class="text-base font-semibold text-neutral-900 dark:text-white">
            {{ props.title }}
          </div>
          <p class="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">
            {{ props.description }}
          </p>
        </div>

        <UButton
          color="neutral"
          variant="ghost"
          class="ml-auto -mt-1"
          :disabled="props.loading"
          @click="closeModal"
          aria-label="Close"
        >
          <UIcon name="i-heroicons-x-mark" class="h-5 w-5 text-neutral-500" />
        </UButton>
      </div>
    </template>

    <template #body>
      <div class="space-y-4">
        <!-- User info block (optional) -->
        <div
          v-if="props.name || props.email || props.avatar"
          class="flex items-center gap-3 rounded-xl
                 border border-neutral-200/70 dark:border-neutral-800/70
                 bg-white dark:bg-gray-900 p-4"
        >
          <UAvatar
            :src="props.avatar"
            :alt="props.name || 'User'"
            size="md"
          >
            <template #fallback>
              <span class="text-sm font-semibold">{{ initials }}</span>
            </template>
          </UAvatar>

          <div class="min-w-0">
            <div class="text-sm font-semibold text-neutral-900 dark:text-white truncate">
              {{ props.name || 'Signed-in user' }}
            </div>
            <div class="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {{ props.email || '—' }}
            </div>
          </div>

          <div
            class="ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1
                   bg-gray-100 dark:bg-gray-800 text-neutral-700 dark:text-neutral-200 text-xs"
          >
            <UIcon name="i-heroicons-shield-check" class="h-4 w-4" />
            Session active
          </div>
        </div>

        <!-- Warning panel -->
        <div
          class="rounded-xl border border-primary-200/70 dark:border-primary-900/50
                 bg-primary-50/70 dark:bg-primary-950/20 p-4"
        >
          <div class="flex gap-3">
            <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5" />
            <div class="space-y-2">
              <p class="text-sm font-medium text-primary-800 dark:text-primary-200">
                You’re about to end your session.
              </p>

              <ul class="space-y-1.5 text-sm text-primary-700/90 dark:text-primary-200/80">
                <li class="flex items-start gap-2">
                  <UIcon name="i-heroicons-check-circle" class="h-4 w-4 mt-0.5" />
                  You will be signed out on this device.
                </li>
                <li class="flex items-start gap-2">
                  <UIcon name="i-heroicons-check-circle" class="h-4 w-4 mt-0.5" />
                  Any unsaved changes may be lost.
                </li>
                <li class="flex items-start gap-2">
                  <UIcon name="i-heroicons-check-circle" class="h-4 w-4 mt-0.5" />
                  You can sign in again anytime.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton
        color="neutral"
        variant="outline"
        :disabled="props.loading"
        @click="closeModal"
      >
        <span class="inline-flex items-center gap-2">
          <UIcon name="i-heroicons-x-mark" class="h-4 w-4" />
          Cancel
        </span>
      </UButton>

      <UButton
        color="primary"
        variant="solid"
        :loading="props.loading"
        @click="confirmLogout"
      >
        <span class="inline-flex items-center gap-2">
          <UIcon name="i-heroicons-arrow-left-on-rectangle" class="h-4 w-4" />
          Log out
        </span>
      </UButton>
    </template>
  </UModal>
</template>
