<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import { navigationMenu } from '@/config/app.config'

const route = useRoute()

// Process navigation items to add active state and defaultOpen based on current route
const items = computed(() => {
  return navigationMenu.map((group) => {
    return group.map((item) => {
      const isChildActive = item.children?.some((child) => {
        if (typeof child.to === 'string') {
          return route.path === child.to || route.path.startsWith(child.to + '/')
        }
        return false
      })

      const isItemActive = typeof item.to === 'string' && (route.path === item.to || route.path.startsWith(item.to + '/'))
      const isActive = isChildActive || (isItemActive && !isChildActive)

      return {
        ...item,
        active: isActive || item.active,
        defaultOpen: isChildActive || item.defaultOpen
      }
    })
  })
})
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
        :items="items[0]"
        orientation="vertical"
      />

      <!-- Footer navigation -->
      <UNavigationMenu
        :collapsed="collapsed"
        :items="items[1]"
        orientation="vertical"
        class="mt-auto"
      />
    </template>

    <!-- Footer -->
    <template #footer="{ collapsed }">
      <UButton
        :avatar="{ src: 'https://github.com/benjamincanac.png' }"
        :label="collapsed ? undefined : 'John Doe'"
        color="gray"
        variant="ghost"
        class="w-full"
        :square="collapsed"
      />
    </template>
  </UDashboardSidebar>
</template>
