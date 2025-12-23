<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const pageTitle = computed(() => route.meta.title || 'Dashboard')
</script>

<template>
  <header class="sticky top-0 z-40 px-8 py-5 flex items-center justify-between pointer-events-none">  
         <!-- Background blur strip -->
        <div class="absolute inset-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-gray-100/50 dark:border-slate-800/50"></div>

        <div class="relative z-10 pointer-events-auto flex items-center gap-4">
          <!-- Mobile Menu Toggle (Visible only on small screens - logic to be added if needed, kept simple for now) -->
          
          <h1 class="text-xl font-bold text-gray-800 dark:text-white lg:hidden">{{ pageTitle }}</h1>

          <div class="hidden lg:block w-[32rem]">
             <UInput 
                icon="i-heroicons-magnifying-glass" 
                placeholder="Search for courses, mentors, or tasks..." 
                class="w-full transition-all duration-300 focus-within:ring-4 focus-within:ring-primary-500/20"
                :ui="{ rounded: 'rounded-2xl', icon: { trailing: { pointer: '' } }, base: 'bg-gray-100/50 dark:bg-slate-800/50 border-0 focus:ring-0 focus:shadow-lg' }"
                size="lg"
                variant="none"
             />
          </div>
        </div>
        
        <div class="flex items-center gap-6 relative z-10 pointer-events-auto">
           <div class="flex items-center gap-2">
               <UButton icon="i-heroicons-envelope" color="neutral" variant="ghost" class="rounded-xl w-10 h-10 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400" />
               <div class="relative">
                   <UButton icon="i-heroicons-bell" color="neutral" variant="ghost" class="rounded-xl w-10 h-10 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 transition-colors" />
                   <span class="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
               </div>
           </div>
           
           <div class="hidden lg:block w-px h-8 bg-gray-200 dark:bg-slate-700"></div>

           <div class="flex items-center gap-4 cursor-pointer group p-1 pr-4 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-700 shadow-sm hover:shadow">
             <UAvatar src="https://randomuser.me/api/portraits/men/85.jpg" size="md" alt="Jason Ranti" class="ring-2 ring-white dark:ring-slate-700 shadow-md group-hover:scale-105 transition-transform" />
             <div class="text-left hidden lg:block">
                 <div class="text-sm font-bold text-gray-800 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">Jason Ranti</div>
                 <div class="text-xs text-gray-400">Student</div>
             </div>
             <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
           </div>
        </div>
  </header>
</template>
