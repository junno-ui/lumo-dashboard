<script setup lang="ts">
import BrandLogo from '@/shared/components/branding/BrandLogo.vue'
import { navigationMenu } from '@/shared/config/sidebar'
import { ref } from 'vue'

const open = ref(true)
</script>

<template>
  <USidebar
    v-model:open="open"
    collapsible="icon"
    variant="inset"
    rail
  >
    <template #header>
      <BrandLogo :collapsed="!open" />
    </template>

    <template #default="{ state }">
      <UButton
        :label="state === 'collapsed' ? undefined : 'Search...'"
        icon="i-lucide-command"
        color="neutral"
        variant="ghost"
        block
        :square="state === 'collapsed'"
        class="mb-5 rounded-xl border border-white/8 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-white"
      >
        <template v-if="state !== 'collapsed'" #trailing>
          <div class="ms-auto flex items-center gap-1">
            <UKbd value="meta" variant="subtle" class="border-white/8 bg-white/[0.04] text-zinc-400" />
            <UKbd value="K" variant="subtle" class="border-white/8 bg-white/[0.04] text-zinc-400" />
          </div>
        </template>
      </UButton>

      <UNavigationMenu
        :key="state"
        :collapsed="state === 'collapsed'"
        :items="navigationMenu[0]"
        orientation="vertical"
        :ui="{
          link: 'rounded-xl px-3 py-2.5 text-sm text-zinc-400 hover:bg-white/[0.06] hover:text-white data-[state=active]:bg-white/[0.08] data-[state=active]:text-white',
          childLink: 'rounded-xl px-3 py-2 text-sm text-zinc-500 hover:bg-white/[0.04] hover:text-white data-[state=active]:bg-white/[0.08] data-[state=active]:text-white'
        }"
      />

      <UNavigationMenu
        :key="'bottom-' + state"
        :collapsed="state === 'collapsed'"
        :items="navigationMenu[1]"
        orientation="vertical"
        class="mt-auto"
        :ui="{
          link: 'rounded-xl px-3 py-2.5 text-sm text-zinc-500 hover:bg-white/[0.05] hover:text-white'
        }"
      />
    </template>

    <template #footer>
      <div class="flex" :class="!open ? 'justify-center' : 'justify-end'">
        <UButton
          icon="i-lucide-panel-left-close"
          color="neutral"
          variant="ghost"
          :label="!open ? '' : 'Collapse'"
          class="w-full rounded-xl border border-white/8 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-white"
          @click="open = false"
        />
      </div>
    </template>
  </USidebar>
</template>
