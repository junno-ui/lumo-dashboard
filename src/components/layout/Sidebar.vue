<script setup lang="ts">
import BrandLogo from '@/components/common/BrandLogo.vue';
import { navigationMenu } from '@/config/app.config';
</script>

<template>
  <UDashboardSidebar
    collapsible
    resizable
    :min-size="12"
    class="bg-gray-50 dark:bg-gray-950 backdrop-blur-xl transition-colors duration-200"
    :ui="{
      footer: 'border-t border-gray-200 dark:border-gray-800/50',
      border: 'border-r border-gray-200 dark:border-gray-800/50'
    }"
  >
    <!-- ================= HEADER ================= -->
    <template #header="{ collapsed }">
      <div class="py-4" :class="collapsed ? 'px-0' : 'px-0'">
        <BrandLogo :collapsed="collapsed" />
      </div>
    </template>

    <template #default="{ collapsed }">
      <!-- Navigation -->
      <UNavigationMenu
        :collapsed="collapsed"
        :items="navigationMenu"
        orientation="vertical"
      />
    </template>

    <template #footer="{ collapsed }">
      <div class="px-2 py-3">
        <div class="flex" :class="collapsed ? 'justify-center' : 'justify-end'">
            <UDashboardSidebarCollapse :label="collapsed ? '' : 'Collapse'" class="w-full" />
        </div>
      </div>
    </template>
  </UDashboardSidebar>
</template>
