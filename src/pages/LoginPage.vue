<template>
  <div class="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 font-sans">
    <!-- Left Side: Brand Section -->
    <div class="hidden lg:flex relative flex-col justify-between bg-linear-to-br from-primary-800 to-primary-950 p-12 text-white min-h-screen overflow-hidden">
      <div class="absolute top-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-0 w-80 h-80 bg-primary-600/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      <div class="absolute top-1/4 right-1/4 w-64 h-64 bg-accent-400/10 rounded-full blur-2xl"></div>

      <div class="absolute top-20 right-20 w-24 h-24 border-2 border-primary-400/30 rounded-full"></div>
      <div class="absolute bottom-40 left-20 w-16 h-16 bg-primary-400/20 rotate-45"></div>

      <div class="relative z-10 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors">
          <Icon icon="mdi:lightning-bolt" class="w-5 h-5 text-white" />
        </div>
        <span class="text-2xl font-bold tracking-wider">Nova</span>
      </div>

      <div class="relative z-10 max-w-lg">
        <h1 class="text-5xl lg:text-6xl font-bold leading-tight mb-8">
          Welcome<br />Back to Nova
        </h1>
        <p class="text-primary-100 text-lg leading-relaxed mb-12">
          Access your dashboard, manage projects, and collaborate with your team seamlessly.
        </p>

        <div class="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 inline-block hover:bg-white/10 transition-all duration-300 group">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-32 h-2 bg-white/20 rounded-full"></div>
            <div class="w-12 h-2 bg-accent-400/50 rounded-full"></div>
          </div>
          <div class="w-full h-32 bg-linear-to-br from-accent-500/20 to-primary-500/20 rounded-xl mb-4 flex items-center justify-center group-hover:from-accent-500/30 group-hover:to-primary-500/30 transition-all">
            <Icon icon="mdi:shield-check" class="w-16 h-16 text-accent-400/40" />
          </div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-accent-400/30 flex items-center justify-center">
              <Icon icon="mdi:lock" class="w-4 h-4 text-accent-300" />
            </div>
            <div class="text-sm text-primary-100 leading-relaxed">Your data is secure with enterprise-grade encryption.</div>
          </div>
          <div class="mt-4 text-sm font-semibold text-accent-300">Security First</div>
        </div>
      </div>
    </div>

    <!-- Right Side: Login Form -->
    <div class="relative flex items-center justify-center p-6 sm:p-8 bg-white dark:bg-neutral-950 min-h-screen">
      <div class="w-full max-w-md">
        <div class="mb-10">
          <h2 class="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
            Sign in
          </h2>
          <p class="text-neutral-600 dark:text-neutral-400 text-sm">
            Don't have an account?
            <NuxtLink to="/auth/register" class="text-accent-600 dark:text-accent-400 font-semibold hover:text-accent-700 dark:hover:text-accent-300">
              Create one
            </NuxtLink>
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-8">
          <UButton
            variant="outline"
            color="gray"
            size="lg"
            class="rounded-lg"
            @click="handleSocialLogin('Google')"
          >
            <template #leading>
              <Icon icon="mdi:google" class="w-5 h-5" />
            </template>
            <span class="hidden sm:inline">Google</span>
          </UButton>
          <UButton
            variant="outline"
            color="gray"
            size="lg"
            class="rounded-lg"
            @click="handleSocialLogin('GitHub')"
          >
            <template #leading>
              <Icon icon="mdi:github" class="w-5 h-5" />
            </template>
            <span class="hidden sm:inline">GitHub</span>
          </UButton>
        </div>

        <div class="relative flex items-center gap-4 mb-8">
          <div class="grow border-t border-neutral-200 dark:border-neutral-800"></div>
          <span class="text-xs text-neutral-400 dark:text-neutral-600 uppercase font-bold tracking-widest">Or</span>
          <div class="grow border-t border-neutral-200 dark:border-neutral-800"></div>
        </div>

            <UForm :schema="schema" :state="state" class="space-y-5" @submit="onSignIn">
              <UFormGroup label="Email address" name="email" class="space-y-2">
                <UInput
                  v-model="state.email"
                  type="email"
                  placeholder="you@example.com"
                  size="lg"
                  icon="i-heroicons-envelope"
                />
              </UFormGroup>

              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label for="password" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Password
                  </label>
                  <NuxtLink to="/auth/forgot-password" class="text-sm text-accent-600 dark:text-accent-400 font-semibold hover:underline">
                    Forgot?
                  </NuxtLink>
                </div>
                <UInput
                  v-model="state.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  size="lg"
                  icon="i-heroicons-lock-closed"
                >
                  <template #trailing>
                    <UButton :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" color="gray" variant="ghost" @click="showPassword = !showPassword" />
                  </template>
                </UInput>
              </div>

          <UFormGroup name="remember" class="space-y-2">
            <div class="flex items-center gap-2">
              <UCheckbox v-model="state.remember" />
              <label class="text-sm text-neutral-600 dark:text-neutral-400">
                Remember me
              </label>
            </div>
          </UFormGroup>

          <UButton
            type="submit"
            block
            size="lg"
            :loading="isLoading"
          >
            Sign in
          </UButton>
        </UForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as yup from 'yup'

const router = useRouter()
const isLoading = ref(false)
const toast = useToast()
const showPassword = ref(false)

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
  remember: yup.boolean(),
})

const state = reactive({
  email: '',
  password: '',
  remember: false,
})

const onSignIn = async () => {
  isLoading.value = true

  await new Promise(resolve => setTimeout(resolve, 1500))

  isLoading.value = false
  toast.add({
    title: 'Welcome back',
    description: 'You have signed in successfully.',
    icon: 'i-heroicons-check-circle',
    color: 'green',
  })

  await router.push('/dashboard')
}

const handleSocialLogin = (provider: string) => {
  toast.add({
    title: provider,
    description: `Continuing with ${provider}...`,
    icon: 'i-heroicons-arrow-right',
  })
}

</script>
