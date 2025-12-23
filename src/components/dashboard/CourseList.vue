<script setup lang="ts">
import { ref } from 'vue'

const courses = [
  { title: "Beginner's Guide to Becoming a Professional Front-End Developer", mentor: 'Leonardo Samsul', category: 'FRONT END', image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop', categoryColor: 'text-sky-500 bg-sky-500/10' },
  { title: 'Optimizing User Experience with the Best UI/UX Design', mentor: 'Bayu Salto', category: 'UI/UX DESIGN', image: 'https://images.unsplash.com/photo-1509395062583-c266857a55dc?q=80&w=2070&auto=format&fit=crop', categoryColor: 'text-purple-500 bg-purple-500/10' },
  { title: 'Reviving and Refreshing Company Image', mentor: 'Padhang Satrio', category: 'BRANDING', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop', categoryColor: 'text-pink-500 bg-pink-500/10' }
]

const hoveredCard = ref<number | null>(null)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Continue Watching</h3>
      <div class="flex gap-3">
         <button class="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm">
            <UIcon name="i-heroicons-chevron-left" class="w-5 h-5" />
         </button>
         <button class="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white hover:bg-primary-700 transition-all active:scale-95 shadow-lg shadow-primary-500/30">
            <UIcon name="i-heroicons-chevron-right" class="w-5 h-5" />
         </button>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
       <div v-for="(course, i) in courses" :key="course.title" 
            class="group cursor-pointer flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 p-4 hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-500 hover:-translate-y-2 relative"
            @mouseenter="hoveredCard = i"
            @mouseleave="hoveredCard = null"
        >
          <div class="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-4 shadow-md">
             <div class="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10"></div>
             <img :src="course.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
             <button class="absolute top-4 right-4 z-20 bg-white/30 backdrop-blur-md rounded-full p-2.5 hover:bg-white/50 transition-all duration-300 active:scale-90 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                <UIcon name="i-heroicons-heart" class="w-5 h-5 text-white" />
             </button>
             <button class="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="w-14 h-14 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
                    <UIcon name="i-heroicons-play" class="w-6 h-6 text-primary-600 ml-1" />
                </div>
             </button>
          </div>
          
          <div class="flex-1 flex flex-col">
              <div :class="`self-start px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-3 ${course.categoryColor}`">
                {{ course.category }}
              </div>
              <h4 class="font-bold text-lg text-gray-900 dark:text-white leading-snug mb-4 line-clamp-2 group-hover:text-primary-600 transition-colors">{{ course.title }}</h4>
              
              <div class="mt-auto flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                <UAvatar :src="'https://i.pravatar.cc/150?u=' + course.mentor" size="xs" />
                <div>
                    <div class="text-xs font-bold text-gray-900 dark:text-white">{{ course.mentor }}</div>
                    <div class="text-[10px] text-gray-500">Sr. Designer</div>
                </div>
              </div>
          </div>
       </div>
    </div>
  </div>
</template>
