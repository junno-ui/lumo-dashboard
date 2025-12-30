<script setup lang="ts">
import { securitySettings, loginAttempts, auditEvents } from '@/mock/settings'
const maxLogin = Math.max(...loginAttempts.map((l: { success: number; fail: number }) => l.success + l.fail))
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
       <UCard class=" dark:bg-gray-900 p-4"><p class="text-sm text-gray-500">MFA Enabled</p><p class="text-2xl font-bold">{{ securitySettings.mfaEnabled ? 'Yes' : 'No' }}</p></UCard>
       <UCard class=" dark:bg-gray-900 p-4"><p class="text-sm text-gray-500">Last Login</p><p class="text-2xl font-bold">{{ securitySettings.lastLogin }}</p></UCard>
       <UCard class=" dark:bg-gray-900 p-4"><p class="text-sm text-gray-500">Active Sessions</p><p class="text-2xl font-bold">{{ securitySettings.activeSessions }}</p></UCard>
    </div>

    <UCard>
      <template #header><h3 class="text-base font-semibold">Login Attempts</h3></template>
      <div class="h-64 flex items-end justify-between gap-2 px-4 pb-4">
        <div v-for="l in loginAttempts" :key="l.date" class="w-full bg-primary-100 dark:bg-primary-900/20 rounded-t-sm hover:bg-primary-500 transition-colors relative group" :style="{ height: `${((l.success + l.fail) / maxLogin) * 80 + 20}%` }">
          <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {{ l.success }} ✓ / {{ l.fail }} ✗
          </div>
          <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500">{{ new Date(l.date).toLocaleDateString() }}</div>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header><h3 class="text-base font-semibold">Recent Security Events</h3></template>
      <div class="p-4 space-y-3">
        <div v-for="e in auditEvents" :key="e.date" class="flex items-center gap-3">
          <UIcon name="i-heroicons-shield-check" class="text-primary-500" />
          <div class="flex-1">
            <div class="font-medium">{{ e.action }}</div>
            <div class="text-xs text-gray-500">{{ e.actor }} · {{ new Date(e.date).toLocaleDateString() }}</div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
  </template>