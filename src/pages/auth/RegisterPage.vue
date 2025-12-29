<script setup lang="ts">
import { ref } from 'vue'
import type { ButtonProps, AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import * as yup from 'yup'
import RegisterPreview from '@/components/dashboard/RegisterPreview.vue'

const toast = useToast()

const schema = yup.object({
  name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  terms: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
})

type Schema = yup.InferType<typeof schema>

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
    name: 'name',
    type: 'text',
    label: 'Full Name',
    placeholder: 'John Doe',
    required: true,
  },
  {
    name: 'email',
    type: 'text',
    label: 'Email',
    placeholder: 'you@example.com',
    required: true,
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: '••••••••',
    required: true,
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirm Password',
    placeholder: '••••••••',
    required: true,
  },
  // Checkbox field: Nuxt UI UAuthForm supports extra fields,
  // if your version doesn't render checkbox, I’ll give an alternative using UForm.
  {
    name: 'terms',
    type: 'checkbox' as any,
    label: 'I agree to the Terms and Privacy Policy',
    required: true,
  },
])

function onSubmit(payload: FormSubmitEvent<Schema>) {
  toast.add({
    icon: 'mdi:account-plus',
    title: 'Register',
    description: `Account created for ${payload.data.email}`,
  })
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
  <div class="h-screen w-full p-5 bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
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
              Join Lumo today<br />
              and get started.
            </h1>

            <p class="mt-5 text-white/75 text-sm leading-relaxed max-w-md">
              Create an account to start managing your projects and collaborating with your team.
            </p>
          </div>

          <RegisterPreview/>
        </div>
      </div>

      <!-- RIGHT CARD -->
      <div
        class="relative flex items-center justify-center h-full rounded-2xl overflow-hidden
               bg-white dark:bg-neutral-900"
      >
        <div class="w-full max-w-md p-6 sm:p-10 overflow-y-auto">
          <div class="mb-10">
            <h2 class="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
              Create account
            </h2>
            <p class="text-neutral-600 dark:text-neutral-400 text-sm">
              Already have an account?
              <NuxtLink
                to="/auth/login"
                class="text-accent-600 dark:text-accent-400 font-semibold hover:text-accent-700 dark:hover:text-accent-300"
              >
                Sign in
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
