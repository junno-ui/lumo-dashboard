<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useColorMode } from '@vueuse/core'
import { useBrand, type Brand } from '../composable/useBrand'
import { useNeutral, type Neutral } from '../composable/useNeutral'
import { useRadius } from '../composable/useRadius'
import { Icon } from '@iconify/vue'

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
  { label: 'Light',  value: 'light',  icon: 'lucide:sun' },
  { label: 'Dark',   value: 'dark',   icon: 'lucide:moon' },
  { label: 'System', value: 'auto',   icon: 'lucide:monitor' }
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
  <div class="fixed bottom-4 right-4 z-[999]">
    <UPopover :ui="{ content: 'p-0 w-72 rounded-2xl shadow-2xl ring-1 ring-white/10 backdrop-blur-3xl bg-white/70 dark:bg-slate-900/70' }">
      <UButton
        color="primary"
        variant="solid"
        size="xl"
        class="rounded-full shadow-lg hover:scale-105 transition-transform duration-200 flex items-center justify-center"
      >
        <Icon icon="heroicons:paint-brush" class="w-6 h-6" />
      </UButton>
      
      <template #content>
        <div class="p-5 space-y-6">
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
             <div class="flex items-center gap-3">
               <div class="h-8 w-8 rounded-full ring-2 ring-gray-100 dark:ring-white/10 shadow-sm" :style="primaryPreviewStyle" />
               <div>
                 <p class="text-sm font-bold text-gray-900 dark:text-white">Theme Settings</p>
                 <p class="text-[10px] text-gray-400">Customize your look</p>
               </div>
             </div>
          </div>

          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Primary Color</label>
              <USelectMenu
                v-model="brandItem"
                :items="brandOptions"
                searchable
                class="w-full"
                placeholder="Select a brand color"
                option-attribute="label"
              >
                <template #default="{ open }">
                  <UButton
                    color="white"
                    variant="solid"
                    class="w-full justify-between"
                  >
                    <div v-if="brandItem" class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full" :class="brandItem.dot" />
                      <span>{{ brandItem.label }}</span>
                    </div>
                    <span v-else>Select a brand color</span>

                    <template #trailing>
                      <UIcon
                        name="i-heroicons-chevron-down-20-solid"
                        class="w-5 h-5 transition-transform text-gray-400 dark:text-gray-500"
                        :class="[open && 'transform rotate-180']"
                      />
                    </template>
                  </UButton>
                </template>
                  <template #item="{ item }">
                     <span class="w-3 h-3 rounded-full" :class="item.dot" />
                     <span>{{ item.label }}</span>
                  </template>
              </USelectMenu>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Neutral Tone</label>
              <USelectMenu
                v-model="neutralItem"
                :items="neutralOptions"
                 class="w-full"
                 option-attribute="label"
              />
            </div>

             <div class="space-y-2">
              <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Radius</label>
              <USelectMenu
                v-model="radiusItem"
                :items="radiusOptions"
                 class="w-full"
                 option-attribute="label"
              />
            </div>

            <div class="space-y-2">
              <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mode</label>
              <div class="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
                 <button 
                  v-for="option in themeOptions" 
                  :key="option.value"
                  @click="themeItem = option"
                  :class="[
                      'flex-1 flex items-center justify-center p-1.5 rounded-lg transition-all duration-200 text-sm',
                      themeItem?.value === option.value 
                        ? 'bg-white dark:bg-slate-600 text-primary-500 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  ]"
                 >
                    <Icon :icon="option.icon" class="w-4 h-4" />
                 </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>
