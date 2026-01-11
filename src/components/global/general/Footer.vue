<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="mt-auto py-6 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
    <div class="px-4 sm:px-6 lg:px-8 text-center">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Junno UI – Premium Nuxt UI Dashboard Template
        <br class="sm:hidden" />
        <span class="hidden sm:inline"> • </span>
        © {{ currentYear }} Junno UI. All rights reserved.
      </p>
    </div>
  </footer>
</template>
