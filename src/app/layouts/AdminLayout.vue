<script setup lang="ts">
import Sidebar from '@/shared/components/navigation/Sidebar.vue'
import Header from '@/shared/components/navigation/Header.vue'
import Footer from '@/shared/components/navigation/Footer.vue'
</script>

<template>
  <div class="dashboard-shell app-shell vercel-grid flex h-screen w-full bg-background font-sans text-foreground">
    <Sidebar />

    <div class="m-3 flex min-w-0 flex-1 flex-col overflow-hidden rounded-[22px] border border-white/8 bg-card/95 text-card-foreground shadow-[0_20px_70px_rgba(0,0,0,0.32)] lg:ms-0">
      <Header />

      <div class="relative flex flex-1 flex-col overflow-auto bg-transparent">
        <UContainer class="flex-1 min-h-0 w-full py-5 sm:py-6">
          <RouterView />
        </UContainer>
        <Footer />
      </div>
    </div>
  </div>
</template>
