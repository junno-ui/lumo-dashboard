<script setup lang="ts">
import { ref, watch } from 'vue'

import { useBrand, type Brand } from '../composable/useBrand'
import { useNeutral, type Neutral } from '../composable/useNeutral'
import { useRadius } from '../composable/useRadius'
import { Icon } from '@iconify/vue'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { brand, applyBrand } = useBrand()
const { neutral, applyNeutral } = useNeutral()
const { radius, applyRadius } = useRadius()

type BrandOption = { label: string; value: Brand; dot: string }
const brandOptions: BrandOption[] = [
   { value: 'black', label: 'Black', dot: 'bg-black' },
   { value: 'red', label: 'Red', dot: 'bg-red-500' },
   { value: 'orange', label: 'Orange', dot: 'bg-orange-500' },
   { value: 'amber', label: 'Amber', dot: 'bg-amber-500' },
   { value: 'yellow', label: 'Yellow', dot: 'bg-yellow-500' },
   { value: 'lime', label: 'Lime', dot: 'bg-lime-500' },
   { value: 'green', label: 'Green', dot: 'bg-green-500' },
   { value: 'emerald', label: 'Emerald', dot: 'bg-emerald-500' },
   { value: 'teal', label: 'Teal', dot: 'bg-teal-500' },
   { value: 'cyan', label: 'Cyan', dot: 'bg-cyan-500' },
   { value: 'sky', label: 'Sky', dot: 'bg-sky-500' },
   { value: 'blue', label: 'Blue', dot: 'bg-blue-500' },
   { value: 'indigo', label: 'Indigo', dot: 'bg-indigo-500' },
   { value: 'violet', label: 'Violet', dot: 'bg-violet-500' },
   { value: 'purple', label: 'Purple', dot: 'bg-purple-500' },
   { value: 'fuchsia', label: 'Fuchsia', dot: 'bg-fuchsia-500' },
   { value: 'pink', label: 'Pink', dot: 'bg-pink-500' },
   { value: 'rose', label: 'Rose', dot: 'bg-rose-500' }
]

type NeutralOption = { label: string; value: Neutral; bg: string }
const neutralOptions: NeutralOption[] = [
   { value: 'slate', label: 'Slate', bg: 'bg-slate-500' },
   { value: 'gray', label: 'Gray', bg: 'bg-gray-500' },
   { value: 'zinc', label: 'Zinc', bg: 'bg-zinc-500' },
   { value: 'neutral', label: 'Neutral', bg: 'bg-neutral-500' },
   { value: 'stone', label: 'Stone', bg: 'bg-stone-500' }
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

const brandItem = ref<BrandOption | undefined>(brandOptions.find(o => o.value === brand.value))
const neutralItem = ref<NeutralOption | undefined>(neutralOptions.find(o => o.value === neutral.value))
const radiusItem = ref<RadiusOption | undefined>(radiusOptions.find(o => o.value === (radius.value as RadiusKey)))

watch(brandItem, v => v && applyBrand(v.value))
watch(neutralItem, v => v && applyNeutral(v.value))
watch(radiusItem, v => v && applyRadius(v.value))

watch(brand, v => { if (!brandItem.value || brandItem.value.value !== v) brandItem.value = brandOptions.find(o => o.value === v) })
watch(neutral, v => { if (!neutralItem.value || neutralItem.value.value !== v) neutralItem.value = neutralOptions.find(o => o.value === v) })
watch(radius, v => { if (!radiusItem.value || radiusItem.value.value !== v) radiusItem.value = radiusOptions.find(o => o.value === (v as RadiusKey)) })
</script>

<template>
   <UPopover :ui="{ 
       content: 'p-0 w-80 rounded-xl shadow-2xl ring-1 ring-gray-200 dark:ring-gray-800 bg-white dark:bg-gray-900'
      }">
      <UButton 
          color="gray" 
          variant="ghost" 
          class="rounded-xl w-10 h-10 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center justify-center p-0"
          :ui="{ rounded: 'rounded-xl' }"
      >
         <Icon icon="heroicons:paint-brush" class="w-5 h-5" />
      </UButton>

      <template #content>
         <div class="p-5 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">

             <!-- Mode -->
            <div class="space-y-3">
               <div class="flex items-center gap-2">
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">Mode</h3>
               </div>
               <div class="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                     <UButton @click="toggleDark(true)" class="flex-1 justify-center gap-2" size="xs"
                     :color="isDark ? 'primary' : 'neutral'" :variant="isDark ? 'soft' : 'ghost'"
                     :ui="{ rounded: 'rounded-md' }" label="Dark" icon="heroicons:moon"/>

                     <UButton @click="toggleDark(false)" class="flex-1 justify-center gap-2" size="xs"
                     :color="!isDark ? 'primary' : 'neutral'" :variant="!isDark ? 'soft' : 'ghost'"
                     :ui="{ rounded: 'rounded-md' }" label="Light" icon="heroicons:sun"/>

               </div>
            </div>   

            <hr class="border-gray-200 dark:border-gray-800" />

            <!-- Primary Colors -->
            <div class="space-y-3">
               <div class="flex items-center gap-2">
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">Primary</h3>
               </div>
               <div class="grid grid-cols-3 gap-2">
                  <UButton v-for="option in brandOptions" :key="option.value" @click="brandItem = option"
                     class="flex justify-start gap-2" size="sm" :ui="{ rounded: 'rounded-lg' }"
                     :color="brandItem?.value === option.value ? 'primary' : 'neutral'"
                     :variant="brandItem?.value === option.value ? 'soft' : 'soft'">
                     <span class="w-2 h-2 rounded-full shadow-sm" 
                        :class="[
                          option.value === 'black' ? (isDark ? 'bg-white' : 'bg-black') : option.dot
                        ]" />
                     <span class="truncate">{{ option.label }}</span>
                  </UButton>
               </div>
            </div>

            <!-- Neutral Colors -->
            <div class="space-y-3">
               <div class="flex items-center gap-2">
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">Neutral</h3>
               </div>
               <div class="grid grid-cols-3 gap-2">
                  <UButton v-for="option in neutralOptions" :key="option.value" @click="neutralItem = option"
                     class="flex justify-start gap-2" size="sm" :ui="{ rounded: 'rounded-lg' }"
                     :color="neutralItem?.value === option.value ? 'primary' : 'gray'"
                     :variant="neutralItem?.value === option.value ? 'soft' : 'soft'">
                     <span class="w-2 h-2 rounded-full shadow-sm" :class="option.bg" />
                     <span class="truncate">{{ option.label }}</span>
                  </UButton>
               </div>
            </div>

            <!-- Radius -->
            <div class="space-y-3">
               <div class="flex items-center gap-2">
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">Radius</h3>
               </div>
               <div class="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  <UButton v-for="option in radiusOptions" :key="option.value" @click="radiusItem = option"
                     class="flex-1 justify-center" size="xs"
                     :color="radiusItem?.value === option.value ? 'primary' : 'neutral'" 
                     :variant="radiusItem?.value === option.value ? 'soft' : 'soft'"
                     :ui="{ rounded: 'rounded-md' }">
                     {{ option.label }}
                  </UButton>
               </div>
            </div>

         </div>
      </template>
   </UPopover>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
   width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background-color: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
   background-color: rgba(156, 163, 175, 0.5);
   border-radius: 10px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
   background-color: rgba(255, 255, 255, 0.2);
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(107, 114, 128, 0.8);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
   background-color: rgba(255, 255, 255, 0.3);
}
</style>
