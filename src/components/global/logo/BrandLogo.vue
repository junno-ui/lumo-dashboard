<script setup lang="ts">
import { computed } from 'vue';

type BrandSize = 'sm' | 'md' | 'lg'
type BrandTone = 'primary' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate'

const props = withDefaults(defineProps<{
  collapsed?: boolean
  title?: string
  subtitle?: string

  /** sizes */
  size?: BrandSize

  /**
   * Quick theme preset (recommended)
   * If you want fully custom classes, use `badgeClass` + `iconClass`
   */
  tone?: BrandTone

  /** Optional: override classes directly (highest priority) */
  badgeClass?: string
  iconClass?: string
}>(), {
  collapsed: false,
  title: 'Lumo Dashboard',
  subtitle: 'Insights at a Glance',
  size: 'md',
  tone: 'primary',
  badgeClass: '',
  iconClass: ''
})

const sizeMap = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        wrap: 'py-1.5',
        badge: 'h-8 w-8 rounded-lg',
        icon: 'h-4 w-4',
        title: 'text-[13px]',
        subtitle: 'text-[10px]',
        textWidth: 'w-[160px]'
      }
    case 'lg':
      return {
        wrap: 'py-2.5',
        badge: 'h-10 w-10 rounded-2xl',
        icon: 'h-6 w-6',
        title: 'text-base',
        subtitle: 'text-xs',
        textWidth: 'w-[220px]'
      }
    default:
      return {
        wrap: 'py-2',
        badge: 'h-9 w-9 rounded-xl',
        icon: 'h-5 w-5',
        title: 'text-sm',
        subtitle: 'text-[11px]',
        textWidth: 'w-[180px]'
      }
  }
})

const toneMap = computed(() => {
  const t = props.tone
  // Background + ring + icon color presets
  // (You can override via badgeClass/iconClass)
  if (t === 'indigo') {
    return {
      badge: 'bg-indigo-50 ring-1 ring-indigo-100 dark:bg-indigo-950/40 dark:ring-indigo-900/50',
      icon: 'text-indigo-600 dark:text-indigo-400'
    }
  }
  if (t === 'emerald') {
    return {
      badge: 'bg-emerald-50 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:ring-emerald-900/50',
      icon: 'text-emerald-600 dark:text-emerald-400'
    }
  }
  if (t === 'amber') {
    return {
      badge: 'bg-amber-50 ring-1 ring-amber-100 dark:bg-amber-950/40 dark:ring-amber-900/50',
      icon: 'text-amber-600 dark:text-amber-400'
    }
  }
  if (t === 'rose') {
    return {
      badge: 'bg-rose-50 ring-1 ring-rose-100 dark:bg-rose-950/40 dark:ring-rose-900/50',
      icon: 'text-rose-600 dark:text-rose-400'
    }
  }
  if (t === 'slate') {
    return {
      badge: 'bg-slate-50 ring-1 ring-slate-200 dark:bg-slate-900/50 dark:ring-slate-700/60',
      icon: 'text-slate-700 dark:text-slate-200'
    }
  }
  // primary (default)
  return {
    badge: 'bg-primary-50 ring-1 ring-primary-100 dark:bg-primary-950/40 dark:ring-primary-900/50',
    icon: 'text-primary-600 dark:text-primary-400'
  }
})

const badgeClasses = computed(() => {
  // badgeClass overrides preset tone
  return [
    'flex shrink-0 items-center justify-center transition',
    'group-hover:scale-[1.02]',
    sizeMap.value.badge,
    props.badgeClass || toneMap.value.badge
  ].join(' ')
})

const iconClasses = computed(() => {
  // iconClass overrides preset tone
  return [
    'transition-transform duration-200 group-hover:scale-110',
    sizeMap.value.icon,
    props.iconClass || toneMap.value.icon
  ].join(' ')
})
</script>

<template>
  <div
    class="group flex items-center rounded-xl select-none transition-all duration-200"
    :class="[
      sizeMap.wrap,
      props.collapsed ? 'justify-center gap-0 px-0' : 'gap-2.5 pr-1'
    ]"
    :aria-label="props.title"
  >
    <!-- Icon badge -->
    <span :class="badgeClasses">
      <UIcon name="duo-icons:dashboard" :class="iconClasses" />
    </span>

    <!-- Text (collapsible) -->
    <div
      class="min-w-0 overflow-hidden transition-[width,opacity,transform] duration-200"
      :class="props.collapsed
        ? 'w-0 opacity-0 -translate-x-1'
        : `${sizeMap.textWidth} opacity-100 translate-x-0`"
    >
      <div class="truncate font-semibold text-gray-900 dark:text-white" :class="sizeMap.title">
        {{ props.title }}
      </div>
      <div class="truncate text-gray-500 dark:text-gray-400" :class="sizeMap.subtitle">
        {{ props.subtitle }}
      </div>
    </div>
  </div>
</template>
