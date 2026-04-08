<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NavigationMenuItem } from '@nuxt/ui'
import BrandLogo from '@/shared/components/branding/BrandLogo.vue'
import { navigationMenu } from '@/shared/config/sidebar'

const open = ref(true)

const primaryItems = computed<NavigationMenuItem[]>(() =>
  navigationMenu[0].map(item => ({
    ...item,
    defaultOpen: false
  }))
)

const secondaryItems = computed<NavigationMenuItem[]>(() => navigationMenu[1])
</script>

<template>
  <USidebar
    v-model:open="open"
    collapsible="icon"
    variant="sidebar"
    rail
    :ui="{
      container: 'h-full',
      inner: 'border-r border-white/6 bg-black/55 backdrop-blur-xl',
      header: 'px-4 py-3.5',
      body: 'gap-4 px-3 pb-3',
      footer: 'px-3 py-3'
    }"
  >
    <template #header="{ state }">
      <div class="flex min-w-0 items-center justify-between gap-2">
        <BrandLogo :collapsed="state === 'collapsed'" />

        <UButton
          v-if="state !== 'collapsed'"
          icon="i-lucide-panel-left"
          color="neutral"
          variant="ghost"
          aria-label="Collapse sidebar"
          class="rounded-lg text-zinc-500 hover:bg-white/[0.04] hover:text-white"
          @click="open = false"
        />
      </div>
    </template>

    <template #default="{ state }">
      <UButton
        :label="state === 'collapsed' ? undefined : 'Search'"
        icon="i-lucide-search"
        color="neutral"
        variant="ghost"
        block
        :square="state === 'collapsed'"
        class="rounded-lg border border-white/8 bg-black/35 text-zinc-400 hover:bg-white/[0.04] hover:text-white"
      >
        <template v-if="state !== 'collapsed'" #trailing>
          <div class="ms-auto flex items-center gap-1.5">
            <UKbd value="meta" variant="subtle" class="border-white/8 bg-white/[0.03] text-zinc-500" />
            <UKbd value="K" variant="subtle" class="border-white/8 bg-white/[0.03] text-zinc-500" />
          </div>
        </template>
      </UButton>

      <UNavigationMenu
        :key="`primary-${state}`"
        :collapsed="state === 'collapsed'"
        :items="primaryItems"
        orientation="vertical"
        class="gap-1"
        :ui="{
          list: 'gap-1',
          childList: 'ms-3 mt-1 border-s border-white/6 ps-2',
          link: 'rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/[0.04] hover:text-white data-[state=active]:bg-white/[0.065] data-[state=active]:text-white',
          childLink: 'rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-white/[0.03] hover:text-white data-[state=active]:bg-white/[0.05] data-[state=active]:text-white',
          leadingIcon: 'text-zinc-500',
          trailingIcon: 'text-zinc-600'
        }"
      />

      <UNavigationMenu
        :key="`secondary-${state}`"
        :collapsed="state === 'collapsed'"
        :items="secondaryItems"
        orientation="vertical"
        class="mt-auto pt-2"
        :ui="{
          list: 'gap-1 border-t border-white/6 pt-2',
          link: 'rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-white/[0.03] hover:text-white'
        }"
      />
    </template>

    <template #footer="{ state }">
      <div class="flex items-center" :class="state === 'collapsed' ? 'justify-center' : 'justify-between'">
        <span v-if="state !== 'collapsed'" class="text-xs text-zinc-600">
          Workspace
        </span>

        <UButton
          :icon="state === 'collapsed' ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'"
          color="neutral"
          variant="ghost"
          :aria-label="state === 'collapsed' ? 'Expand sidebar' : 'Collapse sidebar'"
          class="rounded-lg text-zinc-500 hover:bg-white/[0.04] hover:text-white"
          @click="open = !open"
        />
      </div>
    </template>
  </USidebar>
</template>
