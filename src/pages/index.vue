<script setup lang="ts">
import ThemePickerColor from '../components/ThemePickerColor.vue';
import type { TabsItem } from '@nuxt/ui'
import { ref } from 'vue';

const items = ref<TabsItem[]>([
  {
    label: 'Account',
    icon: 'i-lucide-user',
    content: 'This is the account content.'
  },
  {
    label: 'Password',
    icon: 'i-lucide-lock',
    content: 'This is the password content.'
  }
])
</script>

<template>
  <UButton>Button</UButton>
  <UTabs :items="items" class="w-full" />
  <ThemePickerColor />
</template>
