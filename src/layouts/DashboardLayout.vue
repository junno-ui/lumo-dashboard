<script setup lang="ts">
import AppSidebar from '../components/layout/AppSidebar.vue'
import AppHeader from '../components/layout/AppHeader.vue'
import ThemePickerColor from '../components/ThemePickerColor.vue'
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

    <ThemePickerColor />
  </UDashboardGroup>
</template>
