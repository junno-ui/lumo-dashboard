<script setup lang="ts">
import AppSidebar from '../components/layout/AppSidebar.vue'
import AppHeader from '../components/layout/AppHeader.vue'
import ThemePickerColor from '../components/ThemePickerColor.vue'
</script>

<template>
  <div class="flex min-h-screen bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white">
    <AppSidebar />
    <div class="flex-1 ml-72 flex flex-col min-w-0 relative z-0">
        <AppHeader />
        <main class="p-8 relative z-0">
            <RouterView />
        </main>
    </div>
    <ThemePickerColor />
  </div>
</template>
