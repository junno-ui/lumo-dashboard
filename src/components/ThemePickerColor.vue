<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useColorMode } from '@vueuse/core'
import { useBrand, type Brand } from '../composable/useBrand'
import { useNeutral, type Neutral } from '../composable/useNeutral'
import { useRadius } from '../composable/useRadius'

const { brand, applyBrand } = useBrand()
const { neutral, applyNeutral } = useNeutral()
const { radius, applyRadius } = useRadius()

type ThemeKey = 'light' | 'dark' | 'auto'
const colorMode = useColorMode<ThemeKey>({
  attribute: 'class',
  initialValue: 'auto',
  storageKey: 'nuxt-color-mode'
})

type BrandOption = { label: string; value: Brand; dot: string }
const brandOptions: BrandOption[] = [
  { value: 'black',   label: 'Black',   dot: 'bg-black' },
  { value: 'red',     label: 'Red',     dot: 'bg-red-500' },
  { value: 'orange',  label: 'Orange',  dot: 'bg-orange-500' },
  { value: 'amber',   label: 'Amber',   dot: 'bg-amber-500' },
  { value: 'yellow',  label: 'Yellow',  dot: 'bg-yellow-500' },
  { value: 'lime',    label: 'Lime',    dot: 'bg-lime-500' },
  { value: 'green',   label: 'Green',   dot: 'bg-green-500' },
  { value: 'emerald', label: 'Emerald', dot: 'bg-emerald-500' },
  { value: 'teal',    label: 'Teal',    dot: 'bg-teal-500' },
  { value: 'cyan',    label: 'Cyan',    dot: 'bg-cyan-500' },
  { value: 'sky',     label: 'Sky',     dot: 'bg-sky-500' },
  { value: 'blue',    label: 'Blue',    dot: 'bg-blue-500' },
  { value: 'indigo',  label: 'Indigo',  dot: 'bg-indigo-500' },
  { value: 'violet',  label: 'Violet',  dot: 'bg-violet-500' },
  { value: 'purple',  label: 'Purple',  dot: 'bg-purple-500' },
  { value: 'fuchsia', label: 'Fuchsia', dot: 'bg-fuchsia-500' },
  { value: 'pink',    label: 'Pink',    dot: 'bg-pink-500' },
  { value: 'rose',    label: 'Rose',    dot: 'bg-rose-500' }
]

type NeutralOption = { label: string; value: Neutral }
const neutralOptions: NeutralOption[] = [
  { value: 'slate',   label: 'Slate' },
  { value: 'gray',    label: 'Gray' },
  { value: 'zinc',    label: 'Zinc' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'stone',   label: 'Stone' }
]

type RadiusKey = '0' | '0.125' | '0.25' | '0.375' | '0.5'
type RadiusOption = { label: string; value: RadiusKey }
const radiusOptions: RadiusOption[] = [
  { value: '0', label: '0' },
  { value: '0.125', label: '0.125' },
  { value: '0.25', label: '0.25' },
  { value: '0.375', label: '0.375' },
  { value: '0.5', label: '0.5' }
]

type ThemeOption = { label: string; value: ThemeKey; icon: string }
const themeOptions: ThemeOption[] = [
  { label: 'Light',  value: 'light',  icon: 'i-lucide-sun' },
  { label: 'Dark',   value: 'dark',   icon: 'i-lucide-moon' },
  { label: 'System', value: 'auto',   icon: 'i-lucide-monitor' }
]

const brandItem   = ref<BrandOption  | undefined>(brandOptions.find(o => o.value === brand.value))
const neutralItem = ref<NeutralOption| undefined>(neutralOptions.find(o => o.value === neutral.value))
const radiusItem  = ref<RadiusOption | undefined>(radiusOptions.find(o => o.value === (radius.value as RadiusKey)))
const themeItem   = ref<ThemeOption  | undefined>(themeOptions.find(o => o.value === colorMode.value))

watch(brandItem,   v => v && applyBrand(v.value))
watch(neutralItem, v => v && applyNeutral(v.value))
watch(radiusItem,  v => v && applyRadius(v.value))
watch(themeItem,   v => v && (colorMode.value = v.value))

watch(brand,      v => { if (!brandItem.value || brandItem.value.value !== v) brandItem.value   = brandOptions.find(o => o.value === v) })
watch(neutral,    v => { if (!neutralItem.value || neutralItem.value.value !== v) neutralItem.value = neutralOptions.find(o => o.value === v) })
watch(radius,     v => { if (!radiusItem.value || radiusItem.value.value !== v) radiusItem.value  = radiusOptions.find(o => o.value === (v as RadiusKey)) })
watch(colorMode,  v => { if (!themeItem.value || themeItem.value.value !== v) themeItem.value   = themeOptions.find(o => o.value === v) })

const primaryPreviewStyle = computed(() => ({ background: 'var(--ui-primary)' }))
</script>

<template>
  <UCard class="rounded-2xl bg-slate-900 text-slate-100 border border-slate-800" :ui="{ body: 'p-4 sm:p-6 space-y-6' }">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="h-6 w-6 rounded-full ring-2 ring-white/10" :style="primaryPreviewStyle" />
        <div>
          <p class="text-sm text-slate-300">Primary</p>
          <p class="text-xs text-slate-400">Powered by <code>--ui-primary</code></p>
        </div>
      </div>
      <div class="text-xs text-slate-400">
        Radius: <span class="font-medium">{{ radiusItem?.value }}</span> rem
      </div>
    </div>

    <section>
      <h3 class="text-sm font-semibold mb-2 text-slate-200">Primary</h3>
      <USelectMenu
        v-model="brandItem"
        :items="brandOptions"
        searchable
      />
    </section>

    <section>
      <h3 class="text-sm font-semibold mb-2 text-slate-200">Neutral</h3>
      <USelectMenu
        v-model="neutralItem"
        :items="neutralOptions"
      />
    </section>

    <section>
      <h3 class="text-sm font-semibold mb-2 text-slate-200">Radius</h3>
      <USelectMenu
        v-model="radiusItem"
        :items="radiusOptions"
      />
    </section>

    <section>
      <h3 class="text-sm font-semibold mb-2 text-slate-200">Theme</h3>
      <USelectMenu
        v-model="themeItem"
        :items="themeOptions"
      />
    </section>
  </UCard>
</template>
