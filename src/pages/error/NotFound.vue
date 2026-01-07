<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const handlePush = () => {
  router.push('/');
}
</script>

<template>
  <div class="h-screen w-screen flex items-center justify-center">
    <UError
      :error="{
        statusCode: 404,
        statusMessage: 'Page not found',
        message: 'The page you are looking for does not exist.'
      }"
      :clear="{
        label: 'Back to home',
        color: 'primary',
        variant: 'solid',
        onClick: () => handlePush()
      }"
    />
  </div>
</template>
