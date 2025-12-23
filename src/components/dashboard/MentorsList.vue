<script setup lang="ts">
const mentors = [
  { name: 'Padhang Satrio', role: 'Mentor', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Zakir Horizontal', role: 'Mentor', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { name: 'Leonardo Samsul', role: 'Mentor', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' }
]
</script>

<template>
  <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800 relative z-10">
    <div class="flex items-center justify-between mb-8">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Your mentors</h3>
        <button class="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center hover:bg-primary-50 dark:hover:bg-slate-700 transition-colors group">
            <UIcon name="i-heroicons-plus" class="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary-500" />
        </button>
    </div>
    
    <div class="space-y-6">
        <div v-for="mentor in mentors" :key="mentor.name" class="flex items-center gap-4 group cursor-pointer p-2 -mx-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
        <div class="relative">
            <UAvatar :src="mentor.avatar" size="lg" class="ring-2 ring-white dark:ring-slate-900 shadow-sm" />
            <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center p-0.5">
                <div class="w-full h-full bg-primary-500 rounded-full flex items-center justify-center">
                    <UIcon name="i-heroicons-check" class="w-3 h-3 text-white" />
                </div>
            </div>
        </div>
        <div>
            <div class="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{{ mentor.name }}</div>
            <div class="text-xs text-gray-400 font-medium mt-0.5">{{ mentor.role }}</div>
        </div>
        <button class="ml-auto px-4 py-2 rounded-xl text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-500/10 hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors">
            Follow
        </button>
        </div>
    </div>

    <UButton block color="neutral" variant="soft" label="See All Mentors" class="mt-8 rounded-2xl font-bold py-3 hover:bg-gray-100 dark:hover:bg-slate-800" />
  </div>
</template>
