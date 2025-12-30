<script setup lang="ts">
import { profileSettings } from '@/mock/settings'
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Overview Card -->
       <UCard class=" dark:bg-gray-900 lg:col-span-1 shadow-sm border-0 bg-white dark:bg-gray-800/50">
        <div class="flex flex-col items-center text-center p-4">
          <UAvatar 
            :src="profileSettings.avatar" 
            size="3xl" 
            class="ring-4 ring-primary-500/20 mb-4"
          />
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ profileSettings.name }}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ profileSettings.bio }}</p>
          <div class="flex gap-2 w-full">
            <UButton label="Follow" color="primary" block variant="solid" />
            <UButton label="Message" color="gray" block variant="outline" />
          </div>
        </div>
      </UCard>

      <!-- Account Details Card -->
       <UCard class=" dark:bg-gray-900 lg:col-span-2 shadow-sm border-0 bg-white dark:bg-gray-800/50">
        <template #header>
          <h3 class="text-lg font-semibold">Account Information</h3>
        </template>
        
        <div class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormGroup label="Full Name">
              <UInput v-model="profileSettings.name" readonly />
            </UFormGroup>
            <UFormGroup label="Email Address">
              <UInput v-model="profileSettings.email" readonly />
            </UFormGroup>
          </div>
          <UFormGroup label="Bio">
            <UTextarea v-model="profileSettings.bio" readonly autoresize />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton label="Save Changes" color="black" icon="i-heroicons-check" />
          </div>
        </template>
      </UCard>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UButton 
        icon="i-heroicons-shield-check" 
        label="Security Settings" 
        color="gray" 
        variant="outline" 
        class="h-24 flex flex-col items-center justify-center gap-2"
        to="/settings/security"
      />
      <UButton 
        icon="i-heroicons-bell" 
        label="Notifications" 
        color="gray" 
        variant="outline" 
        class="h-24 flex flex-col items-center justify-center gap-2"
        to="/settings/preferences"
      />
      <UButton 
        icon="i-heroicons-credit-card" 
        label="Billing Info" 
        color="gray" 
        variant="outline" 
        class="h-24 flex flex-col items-center justify-center gap-2"
        to="/billing/overview"
      />
      <UButton 
        icon="i-heroicons-users" 
        label="Team" 
        color="gray" 
        variant="outline" 
        class="h-24 flex flex-col items-center justify-center gap-2"
        to="/settings/organization"
      />
    </div>
  </div>
</template>