<script setup lang="ts">
const stats = [
  { label: 'UI/UX Design', watched: 2, total: 8, icon: 'i-heroicons-swatch', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  { label: 'Branding', watched: 3, total: 8, icon: 'i-heroicons-tag', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
  { label: 'Front End', watched: 6, total: 12, icon: 'i-heroicons-code-bracket', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' }
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div v-for="stat in stats" :key="stat.label" 
        class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default"
    >
       <div :class="`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-300 shadow-inner`">
         <UIcon :name="stat.icon" class="w-7 h-7" />
       </div>
       <div class="flex-1">
          <div class="flex justify-between items-center mb-2">
               <span class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{{ stat.label }}</span>
          </div>
          <div class="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div class="bg-primary-500 h-1.5 rounded-full transition-all duration-1000 ease-out" :style="{ width: `${(stat.watched / stat.total) * 100}%` }"></div>
          </div>
          <div class="text-xs text-gray-400 mt-2 font-medium">{{ stat.watched }} / {{ stat.total }} watched</div>
       </div>
       <button class="text-gray-300 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
           <UIcon name="i-heroicons-ellipsis-vertical" class="w-6 h-6" />
       </button>
    </div>
  </div>
</template>
