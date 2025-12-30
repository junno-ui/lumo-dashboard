<script setup lang="ts">
import Sidebar from '@/components/general/Sidebar/Sidebar.vue';
import Header from '@/components/general/Header/Header.vue';
</script>

<template>
  <UDashboardGroup class="font-sans">
    <Sidebar />
    
    <UDashboardPanel grow>
      <Header />
      
      <UDashboardPanelContent class="p-8 overflow-auto">
        <RouterView />
      </UDashboardPanelContent>
    </UDashboardPanel>

    </UDashboardGroup>
</template>
