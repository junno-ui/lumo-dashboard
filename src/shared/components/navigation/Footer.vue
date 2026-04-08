<script setup lang="ts">
const currentYear = new Date().getFullYear()
const version = __APP_VERSION__
</script>

<template>
  <footer class="mt-auto border-t border-white/8 bg-black/30">
    <div class="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-4 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <p class="font-medium text-zinc-400">Lumo v{{ version }}</p>
      <p>(c) {{ currentYear }} Simple dashboard UI built with Nuxt UI.</p>
    </div>
  </footer>
</template>
