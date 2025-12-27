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
          Join<br />Nova Today
        </h1>
        <p class="text-primary-100 text-lg leading-relaxed mb-12">
          Create an account to start managing your projects and collaborating with your team.
        </p>

        <div class="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 inline-block hover:bg-white/10 transition-all duration-300 group">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-32 h-2 bg-white/20 rounded-full"></div>
            <div class="w-12 h-2 bg-accent-400/50 rounded-full"></div>
          </div>
          <div class="w-full h-32 bg-linear-to-br from-accent-500/20 to-primary-500/20 rounded-xl mb-4 flex items-center justify-center group-hover:from-accent-500/30 group-hover:to-primary-500/30 transition-all">
            <Icon icon="mdi:account-plus" class="w-16 h-16 text-accent-400/40" />
          </div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-accent-400/30 flex items-center justify-center">
              <Icon icon="mdi:rocket-launch" class="w-4 h-4 text-accent-300" />
            </div>
            <div class="text-sm text-primary-100 leading-relaxed">Start your journey with us.</div>
          </div>
          <div class="mt-4 text-sm font-semibold text-accent-300">Get Started</div>
        </div>
      </div>
    </div>

    <!-- Right Side: Registration Form -->
    <div class="relative flex items-center justify-center p-6 sm:p-8 bg-white dark:bg-neutral-950 min-h-screen">
      <div class="w-full max-w-md">
        <div class="mb-10">
          <h2 class="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
            Create Account
          </h2>
          <p class="text-neutral-600 dark:text-neutral-400 text-sm">
            Already have an account?
            <NuxtLink to="/auth/login" class="text-accent-600 dark:text-accent-400 font-semibold hover:text-accent-700 dark:hover:text-accent-300">
              Sign in
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

        <UForm :schema="schema" :state="state" class="space-y-5" @submit="onSignUp">
          <UFormGroup label="Full Name" name="name" class="space-y-2">
            <UInput
              v-model="state.name"
              type="text"
              placeholder="John Doe"
              size="lg"
              icon="i-heroicons-user"
            />
          </UFormGroup>

          <UFormGroup label="Email address" name="email" class="space-y-2">
            <UInput
              v-model="state.email"
              type="email"
              placeholder="you@example.com"
              size="lg"
              icon="i-heroicons-envelope"
            />
          </UFormGroup>

          <UFormGroup label="Password" name="password" class="space-y-2">
            <UInput
              v-model="state.password"
              type="password"
              placeholder="Create a password"
              size="lg"
              icon="i-heroicons-lock-closed"
            />
          </UFormGroup>

          <UFormGroup label="Confirm Password" name="confirmPassword" class="space-y-2">
            <UInput
              v-model="state.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              size="lg"
              icon="i-heroicons-lock-closed"
            />
          </UFormGroup>

          <UFormGroup name="terms" class="space-y-2">
            <div class="flex items-center gap-2">
              <UCheckbox v-model="state.terms" />
              <label class="text-sm text-neutral-600 dark:text-neutral-400">
                I agree to the <a href="#" class="text-accent-600 dark:text-accent-400 hover:underline">Terms</a> and <a href="#" class="text-accent-600 dark:text-accent-400 hover:underline">Privacy Policy</a>
              </label>
            </div>
          </UFormGroup>

          <UButton
            type="submit"
            block
            size="lg"
            :loading="isLoading"
          >
            Create Account
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
import { Icon } from '@iconify/vue'

const router = useRouter()
const isLoading = ref(false)
const toast = useToast()

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  terms: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
})

const state = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
})

const onSignUp = async () => {
  isLoading.value = true

  await new Promise(resolve => setTimeout(resolve, 1500))

  isLoading.value = false
  toast.add({
    title: 'Account created',
    description: 'Your account has been created successfully.',
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
