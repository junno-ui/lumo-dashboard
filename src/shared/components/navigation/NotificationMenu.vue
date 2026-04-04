<script setup lang="ts">
import { ref } from 'vue'
import { notifications as seed } from '@/modules/communication/data/notifications'

type Notif = {
  id: string | number
  title: string
  description: string
  time: string
  icon?: string
  unread?: boolean
}

const notifications = seed as Notif[]
const items = notifications.slice(0, 6)
const unreadCount = items.filter((item) => item.unread).length
const open = ref(false)
</script>

<template>
  <UPopover v-model:open="open" arrow :content="{ side: 'bottom', sideOffset: 10, align: 'end' }">
    <UChip :show="unreadCount > 0" :text="unreadCount" size="3xl" class="select-none">
      <UButton
        color="neutral"
        variant="ghost"
        class="rounded-xl border border-white/8 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.08] hover:text-white"
        aria-label="Open notifications"
        icon="i-heroicons-bell"
      />
    </UChip>

    <template #content>
      <div class="w-88 rounded-3xl border border-white/8 bg-black/85 p-2 shadow-2xl backdrop-blur-2xl">
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2">
            <div class="text-sm font-semibold text-white">Notifications</div>
            <UBadge v-if="unreadCount" color="neutral" variant="soft">{{ unreadCount }} new</UBadge>
          </div>

          <UButton color="neutral" variant="ghost" size="xs" class="rounded-lg text-zinc-500 hover:text-white" @click="open = false" aria-label="Close">
            <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
          </UButton>
        </div>

        <div class="max-h-72 overflow-auto px-1 space-y-1">
          <div v-if="items.length === 0" class="p-6 text-center">
            <div class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/[0.04]">
              <UIcon name="i-heroicons-bell-slash" class="w-5 h-5 text-zinc-500" />
            </div>
            <div class="text-sm font-medium text-white">No notifications</div>
            <div class="text-xs text-zinc-500">You're all caught up.</div>
          </div>

          <div
            v-for="item in items"
            :key="item.id"
            class="w-full cursor-pointer rounded-2xl p-3 text-left transition hover:bg-white/[0.04]"
          >
            <div class="flex items-start gap-3">
              <div class="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/[0.04] text-zinc-200">
                <UIcon :name="item.icon || 'i-heroicons-bell'" class="w-4 h-4" />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                  <div class="truncate text-sm font-medium text-white">{{ item.title }}</div>

                  <div class="flex items-center gap-2">
                    <span class="whitespace-nowrap text-[11px] text-zinc-500">{{ item.time }}</span>
                    <span class="h-2 w-2 rounded-full" :class="item.unread ? 'bg-white' : 'bg-transparent'" />
                  </div>
                </div>

                <div class="mt-1 line-clamp-2 text-xs text-zinc-400">
                  {{ item.description }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between px-2 pt-2">
          <div class="text-xs text-zinc-500">Showing {{ items.length }} of {{ notifications.length }}</div>

          <UButton color="neutral" variant="outline" size="sm" class="rounded-xl border-white/8 bg-white/[0.03] hover:bg-white/[0.06]" to="/dashboard/notifications">
            View all
          </UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>
