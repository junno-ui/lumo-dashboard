<template>
  <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-100/50 dark:shadow-none relative overflow-hidden group">
    <div class="absolute top-0 right-0 p-32 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-500/10 transition-colors duration-700"></div>

    <div class="flex items-center justify-between mb-10 relative z-10">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Statistic</h3>
        <button class="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <UIcon name="i-heroicons-ellipsis-horizontal" class="w-6 h-6" />
        </button>
    </div>

    <div class="flex flex-col items-center justify-center text-center mb-10 relative z-10">
        <div class="relative w-40 h-40 mb-6 group-hover:scale-105 transition-transform duration-500">
        <!-- Progress Circle -->
        <svg class="w-full h-full transform -rotate-90 drop-shadow-lg">
            <circle cx="80" cy="80" r="70" stroke="currentColor" stroke-width="12" fill="transparent" class="text-gray-100 dark:text-slate-800" />
            <circle cx="80" cy="80" r="70" stroke="currentColor" stroke-width="12" fill="transparent" stroke-dasharray="439.8" stroke-dashoffset="300" class="text-primary-500 transition-all duration-1000 ease-out" stroke-linecap="round" />
        </svg>
        <div class="absolute top-4 right-4 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border-2 border-white dark:border-slate-900 transform rotate-12">32%</div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
            <UAvatar src="https://randomuser.me/api/portraits/men/85.jpg" size="3xl" alt="Jason" class="ring-4 ring-white dark:ring-slate-900 shadow-inner" />
        </div>
        </div>
        
        <h4 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Good Morning Jason <span class="animate-pulse">🔥</span></h4>
        <p class="text-sm text-gray-500 px-8 leading-relaxed">Continue your learning to achieve your target!</p>
    </div>

    <!-- Bar Chart -->
    <div class="h-40 flex items-end justify-between px-4 gap-3 relative z-10">
    <div v-for="(h, i) in ['40%', '65%', '45%', '90%', '50%']" :key="i" class="flex-1 flex flex-col justify-end group/bar">
        <div 
            :class="`w-full rounded-t-2xl transition-all duration-500 hover:bg-primary-400 ${i % 2 === 0 ? 'bg-primary-100 dark:bg-slate-800' : 'bg-primary-500'}`" 
            :style="{ height: h }"
        ></div>
    </div>
    </div>
    <div class="flex justify-between text-[10px] font-bold text-gray-400 mt-4 px-2 uppercase tracking-wide">
        <span>1-10 Aug</span>
        <span>11-20 Aug</span>
        <span>21-30 Aug</span>
    </div>
  </div>
</template>
