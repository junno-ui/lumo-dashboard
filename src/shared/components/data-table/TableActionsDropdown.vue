<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
  items: DropdownMenuItem[][]
  label?: string
  icon?: string
}>()
</script>

<template>
  <UDropdownMenu :items="items" :content="{ align: 'end' }">
    <UButton
      color="neutral"
      variant="ghost"
      size="sm"
      :icon="icon || 'i-lucide-ellipsis'"
      :aria-label="label || 'Actions'"
      class="rounded-xl border border-white/8 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.08] hover:text-white"
    />
  </UDropdownMenu>
</template>
