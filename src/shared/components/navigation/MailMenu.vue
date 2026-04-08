<script setup lang="ts">
import { ref } from 'vue'
import { inboxMessages } from '@/modules/communication/data/inbox'

type Mail = {
  id: string | number
  subject: string
  from: string
  time: string
  preview: string
  unread?: boolean
}

const mails = inboxMessages as Mail[]
const unreadCount = mails.filter((mail) => mail.unread).length
const visibleMails = mails.slice(0, 8)
const open = ref(false)
</script>

<template>
  <UPopover v-model:open="open" arrow :content="{ side: 'bottom', sideOffset: 10, align: 'end' }">
    <UChip :show="unreadCount > 0" :text="unreadCount" size="3xl" class="select-none">
      <UButton
        color="neutral"
        variant="ghost"
        class="rounded-lg border border-white/8 bg-black/30 text-zinc-400 hover:bg-white/[0.06] hover:text-white"
        aria-label="Open inbox notifications"
        icon="i-heroicons-envelope"
      />
    </UChip>

    <template #content>
      <div class="w-88 rounded-2xl border border-white/8 bg-zinc-950/96 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2">
            <div class="text-sm font-semibold text-white">Inbox</div>
            <UBadge v-if="unreadCount" color="neutral" variant="soft">{{ unreadCount }} unread</UBadge>
          </div>

          <UButton color="neutral" variant="ghost" size="xs" class="rounded-lg text-zinc-500 hover:text-white" @click="open = false" aria-label="Close">
            <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
          </UButton>
        </div>

        <div class="max-h-72 overflow-auto px-1 divide-y divide-white/6">
          <div v-if="!mails.length" class="p-6 text-center">
            <div class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/[0.04]">
              <UIcon name="i-heroicons-inbox" class="w-5 h-5 text-zinc-500" />
            </div>
            <div class="text-sm font-medium text-white">No messages</div>
            <div class="text-xs text-zinc-500">You're all caught up.</div>
          </div>

          <div
            v-for="mail in visibleMails"
            :key="mail.id"
            class="w-full cursor-pointer rounded-xl px-2 py-3 text-left transition hover:bg-white/[0.04]"
          >
            <div class="flex items-start gap-3">
              <span class="mt-2 h-2 w-2 rounded-full" :class="mail.unread ? 'bg-white' : 'bg-transparent'" />

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                  <div class="truncate text-sm font-medium text-white">{{ mail.subject }}</div>
                  <div class="whitespace-nowrap text-[11px] text-zinc-500">{{ mail.time }}</div>
                </div>

                <div class="mt-0.5 truncate text-xs text-zinc-500">{{ mail.from }}</div>
                <div class="mt-1 truncate text-xs text-zinc-400">{{ mail.preview }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between px-2 pt-2">
          <div class="text-xs text-zinc-500">Showing {{ visibleMails.length }} of {{ mails.length }}</div>

          <UButton color="neutral" variant="outline" size="sm" class="rounded-lg border-white/8 bg-black/30 hover:bg-white/[0.06]" to="/dashboard/inbox">
            Open inbox
          </UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>
