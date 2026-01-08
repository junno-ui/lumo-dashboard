<script setup lang="ts">
import BrandLogo from '@/components/ui/BrandLogo.vue'
import { navigationMenu } from '@/config/app.config'

// Static sidebar - navigation items from config
// No dynamic state management for static template
</script>

<template>
  <UDashboardSidebar collapsible resizable :ui="{ footer: 'border-t border-gray-200 dark:border-gray-800/50' }">
    <!-- Header -->
    <template #header="{ collapsed }">
      <BrandLogo :collapsed="collapsed" />
    </template>

    <!-- Main content -->
    <template #default="{ collapsed }">
      <!-- Search button -->
      <UButton
        :label="collapsed ? undefined : 'Search...'"
        icon="i-lucide-search"
        color="gray"
        variant="outline"
        block
        :square="collapsed"
        class="mb-4"
      >
        <template v-if="!collapsed" #trailing>
          <div class="flex items-center gap-0.5 ms-auto">
            <UKbd value="meta" variant="subtle" />
            <UKbd value="K" variant="subtle" />
          </div>
        </template>
      </UButton>

      <!-- Main navigation -->
      <UNavigationMenu
        :collapsed="collapsed"
        :items="navigationMenu[0]"
        orientation="vertical"
      />

      <!-- Footer navigation -->
      <UNavigationMenu
        :collapsed="collapsed"
        :items="navigationMenu[1]"
        orientation="vertical"
        class="mt-auto"
      />
    </template>

    <!-- Footer -->
    <template #footer="{ collapsed }">
        <div class="flex" :class="collapsed ? 'justify-center' : 'justify-end'">
          <UDashboardSidebarCollapse variant="link" :label="collapsed ? '' : 'Collapse'" class="w-full" />
        </div>
    </template>
  </UDashboardSidebar>
</template>
