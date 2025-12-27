<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { notifications } from '@/mock/notifications'
const router = useRouter()
const open = ref(false)
const items = notifications.slice(0, 6)
const unread = computed(() => items.filter(n => n.unread).length)
function markAllRead() { items.forEach(n => (n.unread = false)) }
function openNotifications() { router.push('/notifications') }
</script>

<template>
  <UPopover v-model:open="open" arrow :content="{ side: 'bottom', sideOffset: 8 }">
    <UButton color="neutral" variant="ghost" class="rounded-xl w-10 h-10 flex items-center justify-center">
      <UIcon name="i-heroicons-bell" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
      <span v-if="unread" class="absolute top-2 right-2">
        <span class="absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-400 opacity-75 animate-ping"></span>
        <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-900"></span>
      </span>
    </UButton>
    <template #content>
      <div class="w-80 p-2">
        <div class="flex items-center justify-between px-2 py-1">
          <div class="text-sm font-semibold">Notifications</div>
          <UBadge v-if="unread" color="red">{{ unread }}</UBadge>
        </div>
        <div class="max-h-64 overflow-auto divide-y divide-gray-100 dark:divide-gray-800">
          <div v-for="n in items" :key="n.id" class="flex items-start gap-3 px-3 py-2">
            <UIcon :name="n.icon" class="w-5 h-5 text-primary-500" />
            <div class="flex-1">
              <div class="text-sm font-medium">{{ n.title }}</div>
              <div class="text-xs text-gray-500">{{ n.description }}</div>
              <div class="text-xs text-gray-400">{{ n.time }}</div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between gap-2 px-2 py-2">
          <UButton color="gray" variant="ghost" label="Mark all read" @click="markAllRead" />
          <UButton color="black" variant="soft" label="View all" @click="openNotifications" />
        </div>
      </div>
    </template>
  </UPopover>
</template>