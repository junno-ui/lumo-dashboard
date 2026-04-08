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
      class="rounded-lg border border-white/8 bg-black/40 text-zinc-400 hover:bg-white/[0.06] hover:text-white"
    />
  </UDropdownMenu>
</template>
