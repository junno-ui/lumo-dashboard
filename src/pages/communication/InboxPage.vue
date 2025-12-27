<template>
  <div class="max-w-4xl mx-auto">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold">Inbox</h3>
          <UBadge color="primary">New</UBadge>
        </div>
      </template>
      <div class="text-center py-12">
        <div class="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <UIcon name="i-heroicons-inbox" class="w-10 h-10 text-indigo-500" />
        </div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">Inbox</h2>
        <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto">You have no new messages at the moment. When you receive a message from a mentor or friend, it will appear here.</p>
      </div>
    </UCard>
  </div>
</template>