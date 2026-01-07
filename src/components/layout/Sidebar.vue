<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import BrandLogo from '@/components/common/BrandLogo.vue';
import { navigationMenu } from '@/config/app.config';

const route = useRoute();

const items = computed(() => {
  return navigationMenu.map((item) => {
    // Check if any child item is currently active
    const isChildActive = item.children?.some((child) => {
      // Handle potential undefined or different types for 'to'
      if (typeof child.to === 'string') {
        // Child is active if path matches exactly or is a sub-path
        return route.path === child.to || route.path.startsWith(child.to + '/');
      }
      return false;
    });

    // Check if the item itself is active
    const isItemActive = typeof item.to === 'string' && (route.path === item.to || route.path.startsWith(item.to + '/'));

    const isActive = isChildActive || (isItemActive && !isChildActive); // Parent is only active if child is NOT (unless it's a group header without link, but here we cover links)

    // Return the item with defaultOpen and active set
    return {
      ...item,
      active: isActive || item.active,
      defaultOpen: isChildActive || item.defaultOpen,
    };
  });
});
</script>

<template>
  <UDashboardSidebar collapsible resizable :min-size="12"
    class="bg-gray-50 dark:bg-gray-950 backdrop-blur-xl transition-colors duration-200" :ui="{
      footer: 'border-t border-gray-200 dark:border-gray-800/50',
      border: 'border-r border-gray-200 dark:border-gray-800/50'
    }">
    <!-- ================= HEADER ================= -->
    <template #header="{ collapsed }">
      <div class="py-4" :class="collapsed ? 'px-0' : 'px-0'">
        <BrandLogo :collapsed="collapsed" />
      </div>
    </template>

    <template #default="{ collapsed }">
      <!-- Navigation -->
      <UNavigationMenu :collapsed="collapsed" :items="items" orientation="vertical" />
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
