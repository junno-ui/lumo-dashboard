<script setup lang="ts">
import { ref, watch } from 'vue'

import { useBrand, type Brand } from '../composable/useBrand'
import { useNeutral, type Neutral } from '../composable/useNeutral'
import { useRadius } from '../composable/useRadius'
import { useFont } from '../composable/useFont'
import { Icon } from '@iconify/vue'

const { brand, applyBrand } = useBrand()
const { neutral, applyNeutral } = useNeutral()
const { radius, applyRadius } = useRadius()
const { font, applyFont, fontOptions } = useFont()



// const colorMode = useColorMode<ThemeKey>({
//   attribute: 'class',
//   initialValue: 'auto',
//   storageKey: 'nuxt-color-mode'
// })

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

type NeutralOption = { label: string; value: Neutral; bg: string }
const neutralOptions: NeutralOption[] = [
  { value: 'slate',   label: 'Slate',   bg: 'bg-slate-500' },
  { value: 'gray',    label: 'Gray',    bg: 'bg-gray-500' },
  { value: 'zinc',    label: 'Zinc',    bg: 'bg-zinc-500' },
  { value: 'neutral', label: 'Neutral', bg: 'bg-neutral-500' },
  { value: 'stone',   label: 'Stone',   bg: 'bg-stone-500' }
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

const brandItem   = ref<BrandOption  | undefined>(brandOptions.find(o => o.value === brand.value))
const neutralItem = ref<NeutralOption| undefined>(neutralOptions.find(o => o.value === neutral.value))
const radiusItem  = ref<RadiusOption | undefined>(radiusOptions.find(o => o.value === (radius.value as RadiusKey)))
const fontItem    = ref(fontOptions.find(o => o.value === font.value))

watch(brandItem,   v => v && applyBrand(v.value))
watch(neutralItem, v => v && applyNeutral(v.value))
watch(radiusItem,  v => v && applyRadius(v.value))
watch(fontItem,    v => v && applyFont(v.value as any)) // Cast to any or Font to avoid structural strictness issues temporarily

watch(brand,      v => { if (!brandItem.value || brandItem.value.value !== v) brandItem.value   = brandOptions.find(o => o.value === v) })
watch(neutral,    v => { if (!neutralItem.value || neutralItem.value.value !== v) neutralItem.value = neutralOptions.find(o => o.value === v) })
watch(radius,     v => { if (!radiusItem.value || radiusItem.value.value !== v) radiusItem.value  = radiusOptions.find(o => o.value === (v as RadiusKey)) })
watch(font,       v => { if (!fontItem.value || fontItem.value.value !== v) fontItem.value = fontOptions.find(o => o.value === v) })
</script>

<template>
  <div class="fixed bottom-4 right-4 z-[999]">
    <UPopover :ui="{ content: 'p-0 w-80 rounded-xl shadow-2xl ring-1 ring-gray-800 backdrop-blur-3xl bg-[#0B1120] border border-white/5' }">
      <UButton
        color="primary"
        variant="solid"
        size="xl"
        class="rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center ring-4 ring-white/10 dark:ring-[#0B1120] relative group"
        :ui="{ rounded: 'rounded-full' }"
      >
        <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <Icon icon="heroicons:paint-brush" class="w-6 h-6 relative z-10" />
      </UButton>
      
      <template #content>
        <div class="p-5 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
          
          <!-- Primary Colors -->
          <div class="space-y-3">
             <div class="flex items-center gap-2">
                 <h3 class="text-sm font-bold text-white">Primary</h3>
                 <UTooltip text="Set your brand's primary color" :popper="{ placement: 'top' }">
                    <Icon icon="heroicons:question-mark-circle" class="w-4 h-4 text-gray-500 cursor-help" />
                 </UTooltip>
             </div>
             <div class="grid grid-cols-3 gap-2">
                <button
                    v-for="option in brandOptions"
                    :key="option.value"
                    @click="brandItem = option"
                    class="flex items-center gap-2 px-2 py-1.5 rounded-lg border transition-all duration-200 group"
                    :class="[
                        brandItem?.value === option.value 
                        ? 'border-primary-500 bg-primary-500/10' 
                        : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
                    ]"
                >
                    <span class="w-2.5 h-2.5 rounded-full shadow-sm" :class="option.dot" />
                    <span class="text-xs font-medium" :class="brandItem?.value === option.value ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'">{{ option.label }}</span>
                </button>
             </div>
          </div>

          <!-- Neutral Colors -->
          <div class="space-y-3">
             <div class="flex items-center gap-2">
                 <h3 class="text-sm font-bold text-white">Neutral</h3>
                 <UTooltip text="Set the base gray scale" :popper="{ placement: 'top' }">
                    <Icon icon="heroicons:question-mark-circle" class="w-4 h-4 text-gray-500 cursor-help" />
                 </UTooltip>
             </div>
             <div class="grid grid-cols-3 gap-2">
                <button
                    v-for="option in neutralOptions"
                    :key="option.value"
                    @click="neutralItem = option"
                    class="flex items-center gap-2 px-2 py-1.5 rounded-lg border transition-all duration-200 group"
                    :class="[
                        neutralItem?.value === option.value 
                        ? 'border-primary-500 bg-primary-500/10' 
                        : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
                    ]"
                >
                    <span class="w-2.5 h-2.5 rounded-full shadow-sm" :class="option.bg" />
                    <span class="text-xs font-medium" :class="neutralItem?.value === option.value ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'">{{ option.label }}</span>
                </button>
             </div>
          </div>

          <!-- Radius -->
          <div class="space-y-3">
             <div class="flex items-center gap-2">
                 <h3 class="text-sm font-bold text-white">Radius</h3>
                 <UTooltip text="Corner rounding factor" :popper="{ placement: 'top' }">
                    <Icon icon="heroicons:question-mark-circle" class="w-4 h-4 text-gray-500 cursor-help" />
                 </UTooltip>
             </div>
             <div class="flex bg-white/5 p-1 rounded-lg border border-white/5">
                <button
                    v-for="option in radiusOptions"
                    :key="option.value"
                    @click="radiusItem = option"
                    class="flex-1 py-1 text-xs font-medium rounded-md transition-all duration-200"
                    :class="[
                        radiusItem?.value === option.value 
                        ? 'bg-primary-600 text-white shadow-sm' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    ]"
                >
                    {{ option.label }}
                </button>
             </div>
          </div>

          <!-- Font -->
          <div class="space-y-3">
             <div class="flex items-center gap-2">
                 <h3 class="text-sm font-bold text-white">Font</h3>
                 <UTooltip text="Global font family" :popper="{ placement: 'top' }">
                    <Icon icon="heroicons:question-mark-circle" class="w-4 h-4 text-gray-500 cursor-help" />
                 </UTooltip>
             </div>
             <USelectMenu
                v-model="fontItem"
                :items="fontOptions"
                class="w-full"
                option-attribute="label"
                :ui="{ 
                    background: 'bg-white/5 dark:bg-white/5', 
                    ring: 'ring-1 ring-white/10 dark:ring-white/10'
                }"
             >
                <template #default="{ open }">
                   <UButton
                      color="gray"
                      variant="ghost"
                      class="w-full justify-between bg-white/5 border border-white/5 hover:bg-white/10 text-white ring-0"
                   >
                     <div class="flex items-center gap-2">
                         <Icon icon="heroicons:language" class="w-4 h-4 text-gray-400" />
                         <span>{{ fontItem?.label }}</span>
                     </div>
                      <Icon icon="heroicons:chevron-down" class="w-4 h-4 text-gray-400 transition-transform" :class="[open && 'rotate-180']" />
                   </UButton>
                </template>
             </USelectMenu>
          </div>

        </div>
      </template>
    </UPopover>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
