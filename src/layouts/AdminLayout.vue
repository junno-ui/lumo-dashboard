<script setup lang="ts">
import AppSidebar from '../components/layout/AppSidebar.vue'
import AppHeader from '../components/layout/AppHeader.vue'
</script>

<template>
  <UDashboardGroup class="font-sans">
    <AppSidebar />
    
    <UDashboardPanel grow>
      <AppHeader />
      
      <UDashboardPanelContent class="p-8">
        <RouterView />
      </UDashboardPanelContent>
    </UDashboardPanel>

    </UDashboardGroup>
</template>
