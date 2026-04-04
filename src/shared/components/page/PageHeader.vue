<script setup lang="ts">
type Metric = {
  label: string
  value: string | number
}

defineProps<{
  eyebrow?: string
  title: string
  description?: string
  metrics?: Metric[]
}>()
</script>

<template>
  <section class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
    <div class="space-y-3">
      <p v-if="eyebrow" class="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
        {{ eyebrow }}
      </p>

      <div class="space-y-2">
        <h1 class="page-title">
          {{ title }}
        </h1>
        <p v-if="description" class="page-copy text-sm sm:text-base">
          {{ description }}
        </p>
      </div>

      <div v-if="metrics?.length" class="flex flex-wrap gap-2 pt-1">
        <div
          v-for="metric in metrics"
          :key="metric.label"
          class="metric-badge rounded-full px-3 py-1.5 text-xs"
        >
          <span class="text-zinc-500">{{ metric.label }}</span>
          <span class="ml-1.5 font-semibold text-white">{{ metric.value }}</span>
        </div>
      </div>
    </div>

    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </section>
</template>
