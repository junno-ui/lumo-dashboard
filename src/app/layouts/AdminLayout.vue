<script setup lang="ts">
import Sidebar from '@/shared/components/navigation/Sidebar.vue'
import Header from '@/shared/components/navigation/Header.vue'
import Footer from '@/shared/components/navigation/Footer.vue'
</script>

<template>
  <div class="app-shell vercel-grid font-sans flex flex-1 h-screen w-full bg-background text-foreground">
    <Sidebar />

    <div class="flex-1 flex flex-col overflow-hidden m-4 lg:ms-0 rounded-xl shadow-sm ring ring-border bg-card text-card-foreground">
      <Header />

      <div class="flex-1 flex flex-col overflow-auto bg-transparent relative">
        <UContainer class="flex-1 min-h-0 w-full py-4 sm:py-6">
          <RouterView />
        </UContainer>
        <Footer />
      </div>
    </div>
  </div>
</template>
