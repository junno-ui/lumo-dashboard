<script setup lang="ts">
import { useBrand } from '@/composables/useBrand'
import { useNeutral } from '@/composables/useNeutral'
import { useRadius } from '@/composables/useRadius'

useBrand()
useNeutral()
useRadius()
</script>

<template>
  <UApp>
    <RouterView />
  </UApp>
</template>
