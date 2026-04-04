<script setup lang="ts">
import BrandLogo from '@/shared/components/branding/BrandLogo.vue'
import { navigationMenu } from '@/shared/config/sidebar'
</script>

<template>
  <UDashboardSidebar
    collapsible
    resizable
    :ui="{
      root: 'border-r border-white/8 bg-black/60 backdrop-blur-2xl',
      header: 'border-b border-white/8 px-3 py-3',
      body: 'px-3 py-4',
      footer: 'border-t border-white/8 px-3 py-3'
    }"
  >
    <template #header="{ collapsed }">
      <BrandLogo :collapsed="collapsed" />
    </template>

    <template #default="{ collapsed }">
      <UButton
        :label="collapsed ? undefined : 'Search...'"
        icon="i-lucide-command"
        color="neutral"
        variant="ghost"
        block
        :square="collapsed"
        class="mb-5 rounded-xl border border-white/8 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-white"
      >
        <template v-if="!collapsed" #trailing>
          <div class="ms-auto flex items-center gap-1">
            <UKbd value="meta" variant="subtle" class="border-white/8 bg-white/[0.04] text-zinc-400" />
            <UKbd value="K" variant="subtle" class="border-white/8 bg-white/[0.04] text-zinc-400" />
          </div>
        </template>
      </UButton>

      <UNavigationMenu
        :collapsed="collapsed"
        :items="navigationMenu[0]"
        orientation="vertical"
        :ui="{
          link: 'rounded-xl px-3 py-2.5 text-sm text-zinc-400 hover:bg-white/[0.06] hover:text-white data-[state=active]:bg-white/[0.08] data-[state=active]:text-white',
          childLink: 'rounded-xl px-3 py-2 text-sm text-zinc-500 hover:bg-white/[0.04] hover:text-white data-[state=active]:bg-white/[0.08] data-[state=active]:text-white'
        }"
      />

      <UNavigationMenu
        :collapsed="collapsed"
        :items="navigationMenu[1]"
        orientation="vertical"
        class="mt-auto"
        :ui="{
          link: 'rounded-xl px-3 py-2.5 text-sm text-zinc-500 hover:bg-white/[0.05] hover:text-white'
        }"
      />
    </template>

    <template #footer="{ collapsed }">
      <div class="flex" :class="collapsed ? 'justify-center' : 'justify-end'">
        <UDashboardSidebarCollapse
          variant="ghost"
          :label="collapsed ? '' : 'Collapse'"
          class="w-full rounded-xl border border-white/8 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-white"
        />
      </div>
    </template>
  </UDashboardSidebar>
</template>
