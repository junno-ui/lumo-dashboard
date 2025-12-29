<script setup lang="ts">
import { ref } from 'vue'
import type { ButtonProps, AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import * as yup from 'yup'

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
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
  <div class="h-screen w-full p-5 bg-white dark:bg-neutral-900 overflow-hidden">
    <div class="grid h-full grid-cols-1 lg:grid-cols-2 gap-5">
      <div
        class="hidden lg:flex relative flex-col h-full rounded-2xl overflow-hidden
               bg-linear-to-br from-primary-700 via-primary-800 to-primary-950 text-white"
      >
        <div class="relative flex flex-col h-full p-12">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
              <UAvatar src="https://github.com/nuxt.png" size="sm" />
            </div>
            <span class="text-2xl font-semibold">Lumo</span>
          </div>

          <div class="mt-14 max-w-xl">
            <h1 class="text-5xl font-semibold leading-tight">
              Effortlessly manage your team<br />
              and operations.
            </h1>

            <p class="mt-5 text-white/75 text-sm leading-relaxed max-w-md">
              Log in to access your CRM dashboard and manage your team.
            </p>
          </div>
          <!-- Put Dashboard Simple like this iamge using nuxt ui  -->
           <DashboardPreview/>
        </div>
      </div>

      <div
        class="relative flex items-center justify-center h-full rounded-2xl overflow-hidden
               bg-white dark:bg-neutral-900"
      >
        <div class="w-full max-w-md p-6 sm:p-10 overflow-y-auto">
          <div class="mb-10">
            <h2 class="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
              Sign in
            </h2>
            <p class="text-neutral-600 dark:text-neutral-400 text-sm">
              Don't have an account?
              <NuxtLink
                to="/auth/register"
                class="text-accent-600 dark:text-accent-400 font-semibold hover:text-accent-700 dark:hover:text-accent-300"
              >
                Create one
              </NuxtLink>
            </p>
          </div>

          <UAuthForm
            :schema="schema"
            :providers="providers"
            :fields="fields"
            :separator="{ label: 'Or continue with' }"
            class="max-w-md"
            @submit="onSubmit"
            @error="onError"
          />
        </div>
      </div>
    </div>
  </div>
</template>


