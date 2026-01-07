<script setup lang="ts">
import Sidebar from '@/components/layout/Sidebar.vue';
import Header from '@/components/layout/Header.vue';
</script>

<template>
  <UDashboardGroup class="font-sans">
    <Sidebar />
    
    <UDashboardPanel grow>
      <Header />
      
      <UDashboardPanelContent class="p-8 overflow-auto bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
        <RouterView />
      </UDashboardPanelContent>
    </UDashboardPanel>

    </UDashboardGroup>
</template>
