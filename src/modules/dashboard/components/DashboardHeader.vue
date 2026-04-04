<script setup lang="ts">
import { ref } from 'vue'
import { type CalendarDate } from '@internationalized/date'

const props = defineProps<{
  user: string
  greeting: string
  modelValue: { start: CalendarDate | null | any; end: CalendarDate | null | any }
  preset: string
  presets: readonly string[]
  dateLabel: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'update:preset', value: string): void
  (e: 'export'): void
}>()

const dateOpen = ref(false)

const handlePresetChange = (val: string) => {
  emit('update:preset', val)
}

const handleApply = () => {
  dateOpen.value = false
}

const handleClear = () => {
  emit('update:modelValue', { start: null, end: null })
}
</script>

<template>
  <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
      <h1 class="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
        Good {{ greeting }}, {{ user }}
      </h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Here&apos;s what&apos;s happening with your SaaS business today
      </p>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-center gap-2">
      <!-- Preset quick filter -->
      <USelectMenu :model-value="preset" @update:model-value="handlePresetChange" :items="presets as any" size="sm"
        color="neutral" variant="outline" class="w-full sm:w-44" />

      <!-- Calendar range -->
      <UPopover v-model:open="dateOpen">
        <UButton color="primary" variant="soft" size="sm" icon="i-lucide-calendar"
          class="w-full sm:w-auto justify-center">
          {{ dateLabel }}
        </UButton>

        <template #content>
          <div class="p-3 w-[min(720px,92vw)]">
            <div class="flex items-center justify-between gap-2 mb-2">
              <div class="text-sm font-semibold text-gray-900 dark:text-white">Custom range</div>
              <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-x" @click="dateOpen = false" />
            </div>

            <UCalendar :model-value="modelValue" @update:model-value="(v:any) => emit('update:modelValue', v)" class="p-2"
              :number-of-months="2" range />

            <div class="mt-2 flex items-center justify-between">
              <div class="text-xs text-gray-600 dark:text-gray-400 truncate">
                Selected: <span class="font-medium text-gray-900 dark:text-white">{{ dateLabel }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UButton size="sm" color="neutral" variant="outline" @click="handleClear">
                  Clear
                </UButton>
                <UButton size="sm" color="primary" variant="solid" @click="handleApply">
                  Apply
                </UButton>
              </div>
            </div>
          </div>
        </template>
      </UPopover>

      <UButton @click="emit('export')" color="primary" variant="soft" size="sm" icon="i-lucide-download"
        class="w-full sm:w-auto justify-center">
        Export
      </UButton>
    </div>
  </div>
</template>
