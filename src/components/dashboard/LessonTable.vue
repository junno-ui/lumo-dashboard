<script setup lang="ts">
const lessons = [
  { mentor: 'Padhang Satrio', date: '2/16/2004', type: 'UI/UX DESIGN', desc: 'Understand Of UI/UX Design', typeColor: 'bg-purple-500/10 text-purple-600', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { mentor: 'Zakir Horizontal', date: '2/18/2004', type: 'BRANDING', desc: 'Logo Design Principles', typeColor: 'bg-pink-500/10 text-pink-600', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { mentor: 'Leonardo Samsul', date: '2/20/2004', type: 'FRONT END', desc: 'Vue 3 Composition API', typeColor: 'bg-sky-500/10 text-sky-600', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' }
]
</script>

<template>
  <div>
     <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Your Lesson</h3>
        <a href="#" class="text-sm text-primary-600 hover:text-primary-700 font-bold hover:underline decoration-2 underline-offset-4">See all lessons</a>
     </div>
     
     <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
            <thead>
                <tr class="text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                <th class="pb-6 pl-4">Mentor</th>
                <th class="pb-6">Type</th>
                <th class="pb-6">Description</th>
                <th class="pb-6 text-right pr-4">Action</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-slate-800/50">
                <tr v-for="lesson in lessons" :key="lesson.desc" class="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="py-6 pl-4">
                    <div class="flex items-center gap-4">
                        <div class="relative">
                            <UAvatar :src="lesson.avatar" size="md" class="ring-2 ring-white dark:ring-slate-900" />
                            <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                        </div>
                        <div>
                        <div class="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{{ lesson.mentor }}</div>
                        <div class="text-xs text-gray-400 mt-0.5">{{ lesson.date }}</div>
                        </div>
                    </div>
                </td>
                <td class="py-6">
                    <span :class="`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider ${lesson.typeColor}`">{{ lesson.type }}</span>
                </td>
                <td class="py-6">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{{ lesson.desc }}</span>
                </td>
                <td class="py-6 text-right pr-4">
                    <button class="w-10 h-10 rounded-full border border-gray-200 dark:border-slate-700 flex items-center justify-center hover:bg-primary-600 hover:border-primary-600 hover:text-white transition-all duration-300 group-hover:scale-110 active:scale-95 text-gray-400">
                        <UIcon name="i-heroicons-play" class="w-4 h-4 ml-0.5" />
                    </button>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
     </div>
  </div>
</template>
