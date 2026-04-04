<script setup lang="ts">
import { computed } from 'vue'
import { appConfig } from '@/shared/config/sidebar'

type BrandSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  collapsed?: boolean
  title?: string
  subtitle?: string
  size?: BrandSize
}>(), {
  collapsed: false,
  title: appConfig.name,
  subtitle: appConfig.subtitle,
  size: 'md'
})

const sizeMap = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        wrap: 'py-1',
        mark: 'h-9 w-9 rounded-xl',
        icon: 'h-5 w-5',
        title: 'text-sm',
        subtitle: 'text-[11px]',
        textWidth: 'w-[160px]'
      }
    case 'lg':
      return {
        wrap: 'py-2',
        mark: 'h-12 w-12 rounded-2xl',
        icon: 'h-7 w-7',
        title: 'text-lg',
        subtitle: 'text-sm',
        textWidth: 'w-[220px]'
      }
    default:
      return {
        wrap: 'py-2',
        mark: 'h-10 w-10 rounded-xl',
        icon: 'h-6 w-6',
        title: 'text-[15px]',
        subtitle: 'text-xs',
        textWidth: 'w-[180px]'
      }
  }
})
</script>

<template>
  <div
    class="group flex items-center rounded-2xl select-none transition-all duration-200"
    :class="[sizeMap.wrap, props.collapsed ? 'justify-center gap-0 px-0' : 'gap-2.5 pr-1']"
    :aria-label="props.title"
  >
    <span
      class="flex shrink-0 items-center justify-center border border-white/8 bg-white/[0.04] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] transition group-hover:bg-white/[0.08]"
      :class="sizeMap.mark"
    >
      <img src="/images/logo-white.png" alt="Lumo" class="object-contain opacity-95" :class="sizeMap.icon" />
    </span>

    <div
      class="min-w-0 overflow-hidden transition-[width,opacity,transform] duration-200"
      :class="props.collapsed ? 'w-0 opacity-0 -translate-x-1' : `${sizeMap.textWidth} opacity-100 translate-x-0`"
    >
      <div class="truncate font-semibold tracking-[-0.03em] text-white" :class="sizeMap.title">
        {{ props.title }}
      </div>
      <div class="truncate text-zinc-500" :class="sizeMap.subtitle">
        {{ props.subtitle }}
      </div>
    </div>
  </div>
</template>
