<script setup lang="ts">
const props = withDefaults(defineProps<{
  collapsed?: boolean
  title?: string
  subtitle?: string
}>(), {
  collapsed: false,
  title: 'Lumo Dashboard',
  subtitle: 'Insights at a Glance'
})
</script>

<template>
  <div 
    class="group flex items-center rounded-xl py-2 select-none transition-all duration-200" 
    :class="props.collapsed 
      ? 'justify-center gap-0 px-0' 
      : 'gap-2.5 pr-1'"
    :aria-label="props.title"
  >
    <!-- Icon badge (Nuxt UI icon only) -->
    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
             bg-primary-50 ring-1 ring-primary-100 transition
             group-hover:scale-[1.02]
             dark:bg-primary-950/40 dark:ring-primary-900/50">
      <UIcon name="duo-icons:dashboard" class="h-5 w-5 text-primary-600 dark:text-primary-400 transition-transform duration-200
               group-hover:scale-110" />
    </span>

    <!-- Text (collapsible) -->
    <div class="min-w-0 overflow-hidden transition-[width,opacity,transform] duration-200" :class="props.collapsed
      ? 'w-0 opacity-0 -translate-x-1'
      : 'w-45 opacity-100 translate-x-0'">
      <div class="truncate text-sm font-semibold text-gray-900 dark:text-white">
        {{ props.title }}
      </div>
      <div class="truncate text-[11px] text-gray-500 dark:text-gray-400">
        {{ props.subtitle }}
      </div>
    </div>
  </div>
</template>
