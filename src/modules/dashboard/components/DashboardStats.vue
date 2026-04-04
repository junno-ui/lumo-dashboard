<script setup lang="ts">
export interface StatCard {
  label: string
  value: string
  delta: number
  deltaLabel: string
  icon: string
  toneBg: string
  toneText: string
  isAbsoluteDelta?: boolean
}

defineProps<{
  cards: StatCard[]
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <UCard
      v-for="card in cards"
      :key="card.label"
      class="hover:shadow-lg transition-shadow duration-200"
      :ui="{ body: 'p-5' }"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <div class="p-2 rounded-lg" :class="card.toneBg">
              <UIcon :name="card.icon" class="w-5 h-5" :class="card.toneText" />
            </div>
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ card.label }}
            </span>
          </div>

          <div class="mt-3 text-3xl font-semibold text-gray-900 dark:text-white truncate">
            {{ card.value }}
          </div>

          <div class="mt-2 flex items-center gap-1 text-sm">
            <template v-if="card.isAbsoluteDelta">
              <UIcon name="i-heroicons-arrow-trending-up" class="w-4 h-4 text-green-500" />
              <span class="text-green-600 dark:text-green-400">
                +{{ card.delta }} {{ card.deltaLabel }}
              </span>
            </template>

            <template v-else>
              <UIcon
                :name="(card.delta ?? 0) >= 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'"
                class="w-4 h-4"
                :class="(card.delta ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'"
              />
              <span :class="(card.delta ?? 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ Math.abs(card.delta ?? 0) }}% {{ card.deltaLabel }}
              </span>
            </template>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
