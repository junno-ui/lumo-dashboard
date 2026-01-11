<script setup lang="ts">
import { ref } from 'vue'
import type { ButtonProps, AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import * as yup from 'yup'
import { useRouter } from 'vue-router'
import LoginDashboard from './LoginDashboard.vue'
import BrandLogo from '@/components/global/logo/BrandLogo.vue'

const router = useRouter()
const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
})

const providers = ref<ButtonProps[]>([
  {
    label: 'Google',
    icon: 'mdi:google',
    color: 'neutral',
    variant: 'subtle',
    onClick: () => {
      toast.add({ icon: 'mdi:google', title: 'Google', description: 'Login with Google' })
    }
  },
  {
    label: 'GitHub',
    icon: 'mdi:github',
    color: 'neutral',
    variant: 'subtle',
    onClick: () => {
      toast.add({ icon: 'mdi:github', title: 'GitHub', description: 'Login with GitHub' })
    }

  }
])

const fields = ref<AuthFormField[]>([
  {
    name: 'email',
    type: 'text',
    label: 'Email',
    placeholder: 'you@example.com',
    required: true
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: '••••••••',
    required: true
  }
])

const toast = useToast()
type Schema = yup.InferType<typeof schema>

const goToRegister = () => router.push('/auth/register')
function onSubmit(payload: FormSubmitEvent<Schema>) {
  toast.add({ icon: 'mdi:view-dashboard', title: 'Login', description: `Login with ${payload.data.email}` })
}
function onError() {
  toast.add({
    icon: 'mdi:alert-circle',
    title: 'Validation error',
    description: 'Please check the form fields.',
    color: 'error',
  })
}
</script>

<template>
  <div class="min-h-screen lg:h-screen w-full p-2 sm:p-5 bg-white dark:bg-gray-900 overflow-y-auto lg:overflow-hidden">
    <div class="grid h-full grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-5">
  <!-- Dashboard preview: show on all sizes and let it stack above form on smaller screens -->
  <div class="flex relative flex-col h-auto lg:h-full rounded-2xl overflow-hidden bg-linear-to-br dark:from-primary-700 dark:via-primary-800 dark:to-primary-950 text-white from-primary-800 via-primary-700 to-primary-800 order-last lg:order-first">
          <div class="relative flex flex-col h-full p-8 sm:p-12">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
              <BrandLogo :collapsed="true" size="lg" />
            </div>
            <span class="text-lg sm:text-xl font-semibold">Lumo Dashboard</span>
          </div>

          <div class="mt-14 max-w-xl">
            <h1 class="
    text-3xl
    lg:text-4xl
    font-semibold
    leading-snug
    sm:leading-snug
    lg:leading-tight
  ">
              Effortlessly manage your team<br class="hidden sm:block" />
              and operations.
            </h1>


            <p class="mt-3 sm:mt-5 text-white/75 text-sm leading-relaxed max-w-md">
              Log in to access your CRM dashboard and manage your team.
            </p>
          </div>
          <LoginDashboard />
        </div>
      </div>

       <div class="relative flex items-center justify-center h-full rounded-2xl overflow-hidden
               bg-white dark:bg-gray-900">
        <div class="w-full max-w-md p-6 sm:p-10">
          <div class="mb-10">
            <h2 class="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
              Sign in
            </h2>
            <p class="text-neutral-600 dark:text-neutral-400 text-sm">
              Don't have an account?
              <UButton label="Create one" @click="goToRegister()" variant="link" />
            </p>
          </div>

          <UAuthForm :schema="schema" :providers="providers" :fields="fields" :separator="{ label: 'Or continue with' }"
            class="max-w-md" @submit="onSubmit" @error="onError" />
        </div>
      </div>
    </div>
  </div>
</template>
