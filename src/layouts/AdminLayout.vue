<script setup lang="ts">
import Sidebar from '@/components/global/general/Sidebar.vue';
import Header from '@/components/global/general/Header.vue';
import Footer from '@/components/global/general/Footer.vue';
</script>

<template>
  <UDashboardGroup class="font-sans">
    <Sidebar />
    
    <UDashboardPanel grow>
      <Header />
      
      <UDashboardPanelContent class="p-8 overflow-auto bg-gray-50 dark:bg-gray-950 transition-colors duration-200 flex flex-col min-h-0">
        <div class="flex-1">
          <RouterView />
        </div>
        <Footer />
      </UDashboardPanelContent>
    </UDashboardPanel>

    </UDashboardGroup>
</template>
