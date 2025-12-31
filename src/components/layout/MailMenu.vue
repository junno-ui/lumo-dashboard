<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { inboxMessages } from '@/mock/inbox'

type Mail = {
  id: string | number
  subject: string
  from: string
  time: string
  preview: string
  unread?: boolean
}

const router = useRouter()
const open = ref(false)

// if you want to be able to "mark all read", keep mails in a ref
const mails = ref<Mail[]>(inboxMessages as Mail[])

const unreadCount = computed(() => mails.value.filter(m => m.unread).length)
const visibleMails = computed(() => mails.value.slice(0, 8)) // show top 8 in popover

function closePopover() {
  open.value = false
}

function openInbox() {
  closePopover()
  router.push('/inbox')
}

function openMail(id: Mail['id']) {
  closePopover()
  router.push(`/inbox/${id}`)
}

// optional action
function markAllRead() {
  mails.value = mails.value.map(m => ({ ...m, unread: false }))
}
</script>

<template>
  <UPopover
    v-model:open="open"
    arrow
    :content="{ side: 'bottom', sideOffset: 10, align: 'end' }"
  >
    <!-- Trigger -->
    <UChip
      :show="unreadCount > 0"
      :text="unreadCount"
      size="3xl"
      class="select-none "
    >
      <UButton
  :color="unreadCount > 0 ? 'primary' : 'gray'"
  variant="soft"
  class="rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
  aria-label="Open inbox notifications"
  icon="i-heroicons-envelope"
/>

    </UChip>

    <!-- Content -->
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
            <div class="text-sm font-semibold text-gray-900 dark:text-white">
              Inbox
            </div>
            <UBadge v-if="unreadCount" color="primary" variant="soft">
              {{ unreadCount }} unread
            </UBadge>
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
                Mark all read
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

        <div
          class="max-h-72 overflow-auto px-1
                 divide-y divide-gray-100 dark:divide-gray-800"
        >
          <!-- Empty state -->
          <div
            v-if="!mails.length"
            class="p-6 text-center"
          >
            <div class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              <UIcon name="i-heroicons-inbox" class="w-5 h-5 text-gray-500" />
            </div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">No messages</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">You're all caught up.</div>
          </div>

          <button
            v-for="m in visibleMails"
            :key="m.id"
            type="button"
            class="w-full text-left px-2 py-3 rounded-xl
                   hover:bg-gray-50 dark:hover:bg-gray-800/60
                   transition"
            @click="openMail(m.id)"
          >
            <div class="flex items-start gap-2">
              <!-- Unread dot -->
              <span
                class="mt-2 h-2 w-2 rounded-full"
                :class="m.unread ? 'bg-primary-500' : 'bg-transparent'"
              />

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                  <div
                    class="text-sm font-semibold truncate"
                    :class="m.unread ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'"
                  >
                    {{ m.subject }}
                  </div>
                  <div class="text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {{ m.time }}
                  </div>
                </div>

                <div class="mt-0.5 text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ m.from }}
                </div>

                <div class="mt-1 text-xs text-gray-500/90 dark:text-gray-400 truncate">
                  {{ m.preview }}
                </div>
              </div>
            </div>
          </button>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-2 pt-2">
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Showing {{ visibleMails.length }} of {{ mails.length }}
          </div>

          <UButton
            color="primary"
            variant="soft"
            size="sm"
            class="rounded-xl"
            @click="openInbox"
          >
            <span class="inline-flex items-center gap-2">
              Open Inbox
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
            </span>
          </UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>
