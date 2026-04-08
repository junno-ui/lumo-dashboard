<script setup lang="ts">
import { profileSettings } from '@/modules/settings/data/settings'
import LogoutModal from '@/modules/auth/components/LogoutModal.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

type MenuItem = {
  label: string
  icon?: string
  to?: string
  color?: 'red' | 'primary' | 'neutral' | string
  onSelect?: () => void
}

const router = useRouter()
const openLogout = ref(false)

const handleLogout = () => {
  openLogout.value = false
  router.push('/auth/login')
}

const items: MenuItem[][] = [
  [
    { label: 'Profile', icon: 'i-heroicons-user-circle', to: '/dashboard/settings/profile' },
    { label: 'Preferences', icon: 'i-heroicons-adjustments-horizontal', to: '/dashboard/settings/preferences' }
  ],
  [{ label: 'Billing', icon: 'i-heroicons-credit-card', to: '/dashboard/billing/overview' }],
  [{ label: 'Logout', icon: 'i-heroicons-arrow-left-on-rectangle', color: 'primary', onSelect: () => { openLogout.value = true } }]
]
</script>

<template>
  <UDropdownMenu :items="items" :ui="{ content: 'w-72 rounded-2xl border border-white/8 bg-zinc-950/96 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl' }">
    <UButton
      color="neutral"
      variant="ghost"
      class="rounded-[18px] border border-white/8 bg-black/30 p-1.5 pr-2 text-left hover:bg-white/[0.05]"
      :ui="{ base: 'justify-start w-full' }"
    >
      <UAvatar
        :src="profileSettings.avatar"
        :alt="profileSettings.name"
        size="md"
        class="ring-1 ring-white/10"
      />

      <span class="ml-3 hidden text-left leading-tight lg:block">
        <span class="block text-sm font-medium text-white">
          {{ profileSettings.name }}
        </span>
        <span class="block max-w-xl truncate text-xs text-zinc-500">
          {{ profileSettings.bio }}
        </span>
      </span>

      <UIcon name="i-heroicons-chevron-down" class="ml-auto hidden h-4 w-4 text-zinc-600 lg:block" />
    </UButton>
  </UDropdownMenu>

  <LogoutModal
    v-model:open="openLogout"
    :email="profileSettings.email"
    :avatar="profileSettings.avatar"
    :name="profileSettings.name"
    @confirm="handleLogout"
    @cancel="openLogout = false"
  />
</template>
