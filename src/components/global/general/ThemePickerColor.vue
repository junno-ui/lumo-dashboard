<script setup lang="ts">
import { ref, watch, computed } from 'vue'

import { useBrand, type Brand } from '@/composables/useBrand'
import { useNeutral, type Neutral } from '@/composables/useNeutral'
import { useRadius } from '@/composables/useRadius'
import { Icon } from '@iconify/vue'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { brand, applyBrand } = useBrand()
const { neutral, applyNeutral } = useNeutral()
const { radius, applyRadius } = useRadius()

// Options
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
type RadiusOption = { label: string; value: RadiusKey; class: string }
const radiusOptions: RadiusOption[] = [
   { value: '0', label: 'None', class: 'rounded-none' },
   { value: '0.125', label: 'Small', class: 'rounded-sm' },
   { value: '0.25', label: 'Standard', class: 'rounded-md' },
   { value: '0.375', label: 'Medium', class: 'rounded-lg' },
   { value: '0.5', label: 'Large', class: 'rounded-2xl' }
]

// State
const brandItem = ref<BrandOption | undefined>(brandOptions.find(o => o.value === brand.value))
const neutralItem = ref<NeutralOption | undefined>(neutralOptions.find(o => o.value === neutral.value))
const radiusItem = ref<RadiusOption | undefined>(radiusOptions.find(o => o.value === (radius.value as RadiusKey)))

const showBrandGrid = ref(false)
const showNeutralGrid = ref(false)

// Watchers
watch(brandItem, v => v && applyBrand(v.value))
watch(neutralItem, v => v && applyNeutral(v.value))
watch(radiusItem, v => v && applyRadius(v.value))

watch(brand, v => { if (!brandItem.value || brandItem.value.value !== v) brandItem.value = brandOptions.find(o => o.value === v) })
watch(neutral, v => { if (!neutralItem.value || neutralItem.value.value !== v) neutralItem.value = neutralOptions.find(o => o.value === v) })
watch(radius, v => { if (!radiusItem.value || radiusItem.value.value !== v) radiusItem.value = radiusOptions.find(o => o.value === (v as RadiusKey)) })

// Helper for 'Active' color preview
const activeBrandDot = computed(() => brandItem.value?.dot || 'bg-primary-500')
const activeNeutralBg = computed(() => neutralItem.value?.bg || 'bg-gray-500')

</script>

<template>
   <UPopover :ui="{ 
       content: 'p-0 w-72 rounded-xl shadow-2xl ring-1 ring-gray-200 dark:ring-gray-800 bg-white dark:bg-gray-900 overflow-hidden',
       overlay: 'z-50'
      }">
      
      <!-- Trigger Button -->
      <UButton 
          color="gray" 
          variant="ghost" 
          class="rounded-xl w-9 h-9 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors flex items-center justify-center p-0"
          :ui="{ rounded: 'rounded-xl' }"
          aria-label="Theme Settings"
      >
         <Icon icon="heroicons:paint-brush" class="w-5 h-5" />
      </UButton>

      <template #content>
         <div class="flex flex-col max-h-[85vh]">
            
            <!-- Header -->
            <div class="px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
               <h2 class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Theme</h2>
               <button @click="(showBrandGrid = false) || (showNeutralGrid = false)" class="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline">Reset View</button>
            </div>

            <!-- Scrollable Content -->
            <div class="p-5 space-y-6 overflow-y-auto custom-scrollbar flex-1">

               <!-- 1. THEME MODE (Compact) -->
               <div class="grid grid-cols-2 gap-2">
                     <button 
                        @click="toggleDark(false)"
                        class="flex flex-row items-center justify-center gap-2 py-2 rounded-lg border transition-all duration-200"
                        :class="[!isDark ? 'border-primary-500 bg-primary-50/80 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400']"
                     >
                        <Icon icon="heroicons:sun" class="w-4 h-4" />
                        <span class="text-xs font-semibold">Light</span>
                     </button>
                     
                     <button 
                        @click="toggleDark(true)"
                        class="flex flex-row items-center justify-center gap-2 py-2 rounded-lg border transition-all duration-200"
                        :class="[isDark ? 'border-primary-500 bg-primary-50/80 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400']"
                     >
                        <Icon icon="heroicons:moon" class="w-4 h-4" />
                        <span class="text-xs font-semibold">Dark</span>
                     </button>
               </div> 

               <!-- 2. PRIMARY COLOR -->
               <div class="space-y-2">
                  <div class="flex justify-between items-center mb-1">
                     <span class="text-xs font-medium text-gray-900 dark:text-white">Accent</span>
                     <button @click="showBrandGrid = !showBrandGrid" class="text-[10px] font-medium text-primary-500 hover:text-primary-600 transition-colors">
                        {{ showBrandGrid ? 'Hide' : 'Change' }}
                     </button>
                  </div>
                  
                  <!-- Selected Preview (Collapsed) -->
                  <button v-if="!showBrandGrid" class="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 bg-white dark:bg-gray-800 transition-all group" @click="showBrandGrid = true">
                     <div class="flex items-center gap-2">
                        <span class="w-4 h-4 rounded-full shadow-sm ring-1 ring-black/5" 
                           :class="[brandItem?.value === 'black' ? (isDark ? 'bg-white' : 'bg-black') : brandItem?.dot]"></span>
                        <span class="text-xs text-gray-600 dark:text-gray-300 capitalize group-hover:text-gray-900 dark:group-hover:text-white">{{ brandItem?.label }}</span>
                     </div>
                     <Icon icon="heroicons:chevron-right" class="w-3 h-3 text-gray-400 group-hover:text-primary-500 transition-colors" />
                  </button>

                  <!-- Color Grid (Expanded) -->
                  <div v-else class="grid grid-cols-6 gap-2 animate-fade-in p-1">
                     <button 
                        v-for="option in brandOptions" :key="option.value" 
                        @click="brandItem = option; showBrandGrid = false"
                        class="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none ring-1 ring-transparent hover:ring-gray-300 dark:hover:ring-gray-600"
                        :title="option.label"
                     >
                        <span class="w-5 h-5 rounded-full shadow-sm"
                           :class="[
                               option.value === 'black' ? (isDark ? 'bg-white' : 'bg-black') : option.dot,
                               brandItem?.value === option.value ? 'ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 ring-primary-500 scale-100' : ''
                           ]"
                        />
                     </button>
                  </div>
               </div>

               <!-- 3. NEUTRAL COLOR -->
               <div class="space-y-2">
                  <div class="flex justify-between items-center mb-1">
                     <span class="text-xs font-medium text-gray-900 dark:text-white">Tone</span>
                     <button @click="showNeutralGrid = !showNeutralGrid" class="text-[10px] font-medium text-primary-500 hover:text-primary-600 transition-colors">
                        {{ showNeutralGrid ? 'Hide' : 'Change' }}
                     </button>
                  </div>
                   
                  <!-- Selected Preview (Collapsed) -->
                  <button v-if="!showNeutralGrid" class="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 bg-white dark:bg-gray-800 transition-all group" @click="showNeutralGrid = true">
                     <div class="flex items-center gap-2">
                        <span class="w-4 h-4 rounded-full shadow-sm ring-1 ring-black/5" :class="activeNeutralBg"></span>
                        <span class="text-xs text-gray-600 dark:text-gray-300 capitalize group-hover:text-gray-900 dark:group-hover:text-white">{{ neutralItem?.label }}</span>
                     </div>
                     <Icon icon="heroicons:chevron-right" class="w-3 h-3 text-gray-400 group-hover:text-primary-500 transition-colors" />
                  </button>

                  <!-- Color Grid (Expanded) -->
                   <div v-else class="grid grid-cols-5 gap-2 animate-fade-in p-1">
                     <button 
                        v-for="option in neutralOptions" :key="option.value" 
                        @click="neutralItem = option; showNeutralGrid = false"
                        class="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none ring-1 ring-transparent hover:ring-gray-300 dark:hover:ring-gray-600"
                        :title="option.label"
                     >
                        <span class="w-5 h-5 rounded-full shadow-sm"
                           :class="[
                               option.bg,
                               neutralItem?.value === option.value ? 'ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 ring-gray-500 scale-100' : ''
                           ]"
                        />
                     </button>
                  </div>
               </div>

               <!-- 4. SHAPE (Rounded) -->
               <div class="space-y-2">
                   <div class="flex justify-between items-center mb-1">
                     <span class="text-xs font-medium text-gray-900 dark:text-white">Radius</span>
                   </div>
                   <div class="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
                      <button 
                        v-for="option in radiusOptions" 
                        :key="option.value"
                        @click="radiusItem = option"
                        class="w-8 h-8 flex items-center justify-center transition-all duration-200 group relative focus:outline-none rounded-md hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm"
                        :class="[radiusItem?.value === option.value ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-500' : 'text-gray-400']"
                      >  
                        <!-- The Shape Preview, Scaled down -->
                        <span 
                           class="block w-4 h-4 border-2 transition-all"
                           :class="[
                              option.class,
                              radiusItem?.value === option.value 
                                 ? 'bg-primary-500 border-primary-500' 
                                 : 'bg-transparent border-current'
                           ]"
                        ></span>
                      </button>
                   </div>
               </div>

            </div>
         </div>
      </template>
   </UPopover>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
   width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background-color: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
   background-color: rgba(156, 163, 175, 0.3);
   border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
   background-color: rgba(255, 255, 255, 0.1);
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(107, 114, 128, 0.6);
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
   background-color: rgba(255, 255, 255, 0.2);
}

.animate-fade-in {
   animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
   from { opacity: 0; transform: translateY(-2px); }
   to { opacity: 1; transform: translateY(0); }
}
</style>
