<script setup lang="ts">
import { ref } from 'vue'
import { notifications as seed } from '@/mock/notifications'

type Notif = {
  id: string | number
  title: string
  description: string
  time: string
  icon?: string
  unread?: boolean
  to?: string
}

// Static template - use mock data directly
const notifs = seed as Notif[]
const items = notifs.slice(0, 6)
const unreadCount = items.filter(n => n.unread).length

const open = ref(false)
</script>

<template>
  <UPopover
    v-model:open="open"
    arrow
    :content="{ side: 'bottom', sideOffset: 10, align: 'end' }"
  >
    <!-- Trigger with badge -->
    <UChip :show="unreadCount > 0" :text="unreadCount" size="3xl" class="select-none">
      <UButton
          :color="unreadCount > 0 ? 'primary' : 'gray'"
        variant="soft"
        class="rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        aria-label="Open notifications"
        icon="i-heroicons-bell"
      />
    </UChip>

    <template #content>
      <div
        class="w-88 p-2 rounded-2xl
               bg-white/95 dark:bg-gray-900/95 backdrop-blur
               border border-gray-200/70 dark:border-gray-800/70
               shadow-xl"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2">
            <div class="text-sm font-semibold text-gray-900 dark:text-white">Notifications</div>
            <UBadge v-if="unreadCount" color="red" variant="soft">{{ unreadCount }} new</UBadge>
          </div>

          <div class="flex items-center gap-1">
            <UButton
              color="neutral"
              variant="ghost"
              size="xs"
              class="rounded-lg"
              @click="open = false"
              aria-label="Close"
            >
              <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
            </UButton>
          </div>
        </div>

        <!-- List -->
        <div class="max-h-72 overflow-auto px-1 space-y-1">
          <!-- Empty state -->
          <div v-if="items.length === 0" class="p-6 text-center">
            <div class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              <UIcon name="i-heroicons-bell-slash" class="w-5 h-5 text-gray-500" />
            </div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">No notifications</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">You're all caught up.</div>
          </div>

          <!-- Items -->
          <div
            v-for="n in items"
            :key="n.id"
            class="w-full text-left p-3 rounded-xl
                   hover:bg-gray-50 dark:hover:bg-gray-800/60
                   transition cursor-pointer"
          >
            <div class="flex items-start gap-3">
              <div
                class="mt-0.5 h-9 w-9 rounded-xl flex items-center justify-center
                       bg-primary-500/10 text-primary-600 dark:text-primary-400"
              >
                <UIcon :name="n.icon || 'i-heroicons-bell'" class="w-5 h-5" />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                  <div
                    class="text-sm font-semibold truncate"
                    :class="n.unread ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'"
                  >
                    {{ n.title }}
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {{ n.time }}
                    </span>
                    <span
                      class="h-2 w-2 rounded-full"
                      :class="n.unread ? 'bg-red-500' : 'bg-transparent'"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div class="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {{ n.description }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-2 pt-2">
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Showing {{ items.length }} of {{ notifs.length }}
          </div>

          <UButton color="primary" variant="soft" size="sm" class="rounded-xl" to="/dashboard/notifications">
            <span class="inline-flex items-center gap-2">
              View all
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
            </span>
          </UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>
