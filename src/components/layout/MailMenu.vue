<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { inboxMessages } from '@/mock/inbox'
const router = useRouter()
const open = ref(false)
const mails = inboxMessages
const unread = computed(() => mails.filter(m => m.unread).length)
function openInbox() { router.push('/inbox') }
</script>

<template>
  <UPopover v-model:open="open" arrow :content="{ side: 'bottom', sideOffset: 8 }">
    <UButton color="neutral" variant="ghost" class="rounded-xl w-10 h-10 flex items-center justify-center">
      <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
      <span v-if="unread" class="absolute top-2 right-2">
        <span class="absolute inline-flex h-2.5 w-2.5 rounded-full bg-primary-400 opacity-75 animate-ping"></span>
        <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-500 border-2 border-white dark:border-slate-900"></span>
      </span>
    </UButton>
    <template #content>
      <div class="w-80 p-2">
        <div class="flex items-center justify-between px-2 py-1">
          <div class="text-sm font-semibold">Inbox</div>
          <UBadge v-if="unread" color="primary">{{ unread }}</UBadge>
        </div>
        <div class="max-h-64 overflow-auto divide-y divide-gray-100 dark:divide-gray-800">
          <div v-for="m in mails" :key="m.id" class="px-3 py-2">
            <div class="text-sm font-medium">{{ m.subject }}</div>
            <div class="text-xs text-gray-500">{{ m.from }} · {{ m.time }}</div>
            <div class="text-xs text-gray-400 truncate">{{ m.preview }}</div>
          </div>
        </div>
        <div class="flex justify-end px-2 py-2">
          <UButton color="black" variant="soft" label="Open Inbox" @click="openInbox" />
        </div>
      </div>
    </template>
  </UPopover>
</template>