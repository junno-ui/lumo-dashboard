<script setup lang="ts">
const currentYear = new Date().getFullYear()
const version = __APP_VERSION__
</script>

<template>
  <footer class="mt-auto border-t border-white/8 bg-black/20 backdrop-blur-xl">
    <div class="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-5 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <p>Lumo Dashboard v{{ version }}</p>
      <p>© {{ currentYear }} Built with Nuxt UI and a Vercel-inspired system.</p>
    </div>
  </footer>
</template>
