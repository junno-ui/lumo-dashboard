<script setup lang="ts">
import { useBrand } from './composable/useBrand'
import { useNeutral } from './composable/useNeutral'
import { useRadius } from './composable/useRadius'

useBrand()
useNeutral()
useRadius()
</script>

<template>
  <UApp>
    <RouterView />
  </UApp>
</template>
