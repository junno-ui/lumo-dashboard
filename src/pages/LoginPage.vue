<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import * as yup from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const router = useRouter()
const isLoading = ref(false)
const toast = useToast()

const state = reactive({
  email: '',
  password: '',
  remember: false
})

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Must be at least 8 characters').required('Password is required')
})

type Schema = yup.InferType<typeof schema>

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isLoading.value = true
  console.log('Submitted', event.data)
  
  // Simulate login delay
  setTimeout(() => {
    isLoading.value = false
    router.push('/dashboard')
    toast.add({ title: 'Welcome back!', description: 'You have signed in successfully.', color: 'green' })
  }, 1000)
}

const handleSocialLogin = (provider: string) => {
    toast.add({ title: provider, description: `Continue with ${provider}`, color: 'gray' })
}
</script>

<template>
  <div class="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans">
    
    <!-- Left Side (Blue Branding) -->
    <div class="relative hidden lg:flex flex-col justify-between bg-blue-600 p-12 text-white overflow-hidden">
        <!-- Background Decor -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-50"></div>
        <div class="absolute bottom-0 left-0 w-80 h-80 bg-blue-700 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 opacity-50"></div>
        
        <!-- Geometric Shapes -->
         <div class="absolute top-20 right-20 w-24 h-24 border-4 border-blue-400/30 rounded-full"></div>
         <div class="absolute bottom-40 left-20 w-16 h-16 bg-blue-400/20 rotate-45 transform"></div>

        <!-- Header -->
        <div class="relative z-10 flex items-center gap-3">
             <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                 <div class="w-5 h-5 bg-white rounded-full"></div>
             </div>
             <span class="text-xl font-bold tracking-wide">Flee</span>
        </div>

        <!-- Main Content -->
        <div class="relative z-10 max-w-lg mt-auto mb-auto">
             <h1 class="text-5xl lg:text-6xl font-bold leading-tight mb-8">Start and Grow <br/> Your Online <br/> Business</h1>
             <p class="text-blue-100 text-lg leading-relaxed mb-6">Join us to sell online, offline, and everywhere in between.</p>
             
             <!-- Floating Element -->
             <div class="mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 inline-block max-w-sm">
                 <div class="flex items-center gap-4 mb-4">
                     <div class="w-32 h-2 bg-white/20 rounded-full"></div>
                     <div class="w-12 h-2 bg-blue-300/50 rounded-full"></div>
                 </div>
                  <div class="w-full h-32 bg-gradient-to-tr from-blue-500/50 to-purple-500/50 rounded-xl mb-4 relative overflow-hidden group">
                      <div class="absolute inset-0 bg-blue-400/20 group-hover:bg-blue-400/0 transition-colors"></div>
                  </div>
                 <div class="flex items-center gap-2">
                     <div class="w-8 h-8 rounded-full bg-blue-400/50"></div>
                     <div class="text-xs text-blue-100">Don't worry about failure; you only have to be right once.</div>
                 </div>
                 <div class="mt-4 text-sm font-bold">Simon Sinek</div>
             </div>
        </div>
    </div>

    <!-- Right Side (Form) -->
    <div class="flex items-center justify-center p-8 bg-white dark:bg-slate-900 overflow-y-auto">
      <div class="w-full max-w-md">
         <div class="text-center lg:text-left mb-10">
             <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create your account</h2>
             <p class="text-gray-500 dark:text-gray-400 text-sm">Have an account? <a href="#" class="text-blue-600 font-medium hover:underline">Login</a></p>
         </div>

         <!-- Social Login -->
         <div class="space-y-3 mb-8">
             <UButton 
                block 
                color="white" 
                variant="solid" 
                label="Continue with Google" 
                icon="i-simple-icons-google" 
                class="bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 h-12 shadow-sm rounded-xl font-medium"
                @click="handleSocialLogin('Google')"
            />
             <UButton 
                block 
                color="white" 
                variant="solid" 
                label="Continue with Apple" 
                icon="i-simple-icons-apple" 
                class="bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 h-12 shadow-sm rounded-xl font-medium"
                @click="handleSocialLogin('Apple')"
            />
         </div>

         <div class="relative flex items-center gap-4 py-4 mb-8">
            <div class="flex-grow border-t border-gray-200 dark:border-slate-700"></div>
            <span class="text-xs text-gray-400 uppercase font-medium">OR</span>
            <div class="flex-grow border-t border-gray-200 dark:border-slate-700"></div>
         </div>

         <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
            <UFormGroup label="Email" name="email" class="space-y-1.5 font-medium text-gray-700 dark:text-gray-300">
               <UInput 
                 v-model="state.email" 
                 placeholder="john@example.com" 
                 class="w-full"
                 size="lg"
                 :ui="{ rounded: 'rounded-xl', base: 'h-12' }"
                 variant="outline"
                 color="white"
               />
            </UFormGroup>

            <UFormGroup label="Password" name="password" class="space-y-1.5 font-medium text-gray-700 dark:text-gray-300">
               <UInput 
                 v-model="state.password" 
                 type="password" 
                 placeholder="••••••••" 
                 class="w-full"
                 size="lg"
                 :ui="{ rounded: 'rounded-xl', base: 'h-12' }"
                 variant="outline"
                 color="white"
               />
            </UFormGroup>

             <!-- Privacy Policy (Mocking the UI layout) -->
             <div class="text-xs text-gray-500 mt-4 leading-relaxed">
                By signing up, you agree to our <a href="#" class="font-bold text-gray-700 dark:text-gray-300 underline">Terms & Conditions</a> and <a href="#" class="font-bold text-gray-700 dark:text-gray-300 underline">Privacy Policy</a>
             </div>

            <UButton 
                type="submit" 
                block 
                label="Sign up" 
                color="primary" 
                size="xl" 
                :loading="isLoading"
                class="h-12 rounded-xl text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 transform active:scale-[0.98]"
            />
         </UForm>
      </div>
    </div>
  </div>
</template>
