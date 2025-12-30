<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { notifications as seed } from '@/mock/notifications'

type Notif = {
  id: string | number
  title: string
  description: string
  time: string
  icon?: string
  unread?: boolean
  to?: string // optional route per notification
}

const router = useRouter()
const open = ref(false)

// keep notifications reactive so "mark all read" updates UI
const notifs = ref<Notif[]>(seed as Notif[])

const items = computed(() => notifs.value.slice(0, 6))
const unreadCount = computed(() => items.value.filter(n => n.unread).length)

function closePopover() {
  open.value = false
}

function markAllRead() {
  notifs.value = notifs.value.map(n => ({ ...n, unread: false }))
}

function openNotifications() {
  closePopover()
  router.push('/notifications')
}

function openNotif(n: Notif) {
  // mark as read when opened (optional)
  notifs.value = notifs.value.map(x => (x.id === n.id ? { ...x, unread: false } : x))

  closePopover()
  router.push(n.to || '/notifications')
}
</script>

<template>
  <UPopover
    v-model:open="open"
    arrow
    :content="{ side: 'bottom', sideOffset: 10, align: 'end' }"
  >
    <!-- Trigger with badge -->
    <UChip :show="unreadCount > 0" :text="unreadCount" size="xl" class="select-none">
      <UButton
          :color="unreadCount > 0 ? 'primary' : 'gray'"
        variant="subtle"
        class="rounded-xl w-10 h-10 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800"
        aria-label="Open notifications"
        icon="i-heroicons-bell"
      />
    </UChip>

    <template #content>
      <div
        class="w-88 p-2 rounded-2xl
               bg-white/95 dark:bg-neutral-900/95 backdrop-blur
               border border-neutral-200/70 dark:border-neutral-800/70
               shadow-xl"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2">
            <div class="text-sm font-semibold text-neutral-900 dark:text-white">Notifications</div>
            <UBadge v-if="unreadCount" color="red" variant="soft">{{ unreadCount }} new</UBadge>
          </div>

          <div class="flex items-center gap-1">
            <UButton
              v-if="unreadCount"
              color="neutral"
              variant="ghost"
              size="xs"
              class="rounded-lg"
              @click="markAllRead"
            >
              <span class="inline-flex items-center gap-1">
                <UIcon name="i-heroicons-check" class="w-4 h-4" />
                Mark all
              </span>
            </UButton>

            <UButton
              color="neutral"
              variant="ghost"
              size="xs"
              class="rounded-lg"
              @click="closePopover"
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
            <div class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <UIcon name="i-heroicons-bell-slash" class="w-5 h-5 text-neutral-500" />
            </div>
            <div class="text-sm font-medium text-neutral-900 dark:text-white">No notifications</div>
            <div class="text-xs text-neutral-500 dark:text-neutral-400">You’re all caught up.</div>
          </div>

          <!-- Items -->
          <button
            v-for="n in items"
            :key="n.id"
            type="button"
            class="w-full text-left p-3 rounded-xl
                   hover:bg-neutral-50 dark:hover:bg-neutral-800/60
                   transition"
            @click="openNotif(n)"
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
                    :class="n.unread ? 'text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-200'"
                  >
                    {{ n.title }}
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="text-[11px] text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                      {{ n.time }}
                    </span>
                    <span
                      class="h-2 w-2 rounded-full"
                      :class="n.unread ? 'bg-red-500' : 'bg-transparent'"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div class="mt-1 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {{ n.description }}
                </div>
              </div>
            </div>
          </button>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-2 pt-2">
          <div class="text-xs text-neutral-500 dark:text-neutral-400">
            Showing {{ items.length }} of {{ notifs.length }}
          </div>

          <UButton color="primary" variant="soft" size="sm" class="rounded-xl" @click="openNotifications">
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
