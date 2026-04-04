<script setup lang="ts">
import Sidebar from '@/shared/components/navigation/Sidebar.vue'
import Header from '@/shared/components/navigation/Header.vue'
import Footer from '@/shared/components/navigation/Footer.vue'
</script>

<template>
  <UDashboardGroup class="app-shell vercel-grid font-sans">
    <Sidebar />

    <UDashboardPanel grow>
      <Header />

      <UDashboardPanelContent class="flex min-h-0 flex-col overflow-auto bg-transparent">
        <div class="flex-1">
          <RouterView />
        </div>
        <Footer />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
