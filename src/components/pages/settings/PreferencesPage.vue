<script setup lang="ts">
import { preferences } from '@/mock/settings'
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Appearance Card -->
      <UCard class="shadow-sm border-0 bg-white dark:bg-slate-800/50">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-swatch" class="w-5 h-5 text-primary-500" />
            <h3 class="text-lg font-semibold">Appearance</h3>
          </div>
        </template>
        
        <div class="space-y-4">
          <UFormGroup label="Theme" description="Choose how Nova looks to you.">
            <USelect v-model="preferences.theme" :options="['System', 'Light', 'Dark']" />
          </UFormGroup>
          <UFormGroup label="Language" description="Select your preferred language.">
            <USelect v-model="preferences.language" :options="['English', 'Indonesian', 'Japanese', 'French']" />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Notifications Card -->
      <UCard class="shadow-sm border-0 bg-white dark:bg-slate-800/50">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-bell" class="w-5 h-5 text-primary-500" />
            <h3 class="text-lg font-semibold">Notifications</h3>
          </div>
        </template>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium">Email Notifications</div>
              <div class="text-xs text-gray-500">Receive weekly updates via email.</div>
            </div>
            <UToggle v-model="preferences.notifications.email" />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium">Push Notifications</div>
              <div class="text-xs text-gray-500">Enable real-time push alerts.</div>
            </div>
            <UToggle v-model="preferences.notifications.push" />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium">Desktop Notifications</div>
              <div class="text-xs text-gray-500">Show browser notifications.</div>
            </div>
            <UToggle v-model="preferences.notifications.desktop" />
          </div>
        </div>
      </UCard>
    </div>

    <div class="flex justify-end gap-3">
      <UButton label="Discard" color="gray" variant="ghost" />
      <UButton label="Save Preferences" color="black" />
    </div>
  </div>
</template>