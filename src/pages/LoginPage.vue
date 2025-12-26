<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import * as yup from 'yup'
import { Icon } from '@iconify/vue'

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



const onSubmit = async (event: any) => {
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
  <div class="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 font-sans bg-white dark:bg-slate-950">
    
    <!-- Left Side (Brand Themed) -->
    <div class="relative hidden lg:flex flex-col justify-between bg-primary-600 p-12 text-white transition-colors duration-300 min-h-screen">
        <!-- Background Decor -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-50"></div>
        <div class="absolute bottom-0 left-0 w-80 h-80 bg-primary-700 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 opacity-50"></div>
        
        <!-- Geometric Shapes -->
         <div class="absolute top-20 right-20 w-24 h-24 border-4 border-primary-400/30 rounded-full"></div>
         <div class="absolute bottom-40 left-20 w-16 h-16 bg-primary-400/20 rotate-45 transform"></div>

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
             <p class="text-primary-100 text-lg leading-relaxed mb-6">Join us to sell online, offline, and everywhere in between.</p>
             
             <!-- Floating Element -->
             <div class="mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 inline-block max-w-sm hover:scale-105 transition-transform duration-300">
                 <div class="flex items-center gap-4 mb-4">
                     <div class="w-32 h-2 bg-white/20 rounded-full"></div>
                     <div class="w-12 h-2 bg-primary-300/50 rounded-full"></div>
                 </div>
                  <div class="w-full h-32 bg-gradient-to-tr from-primary-500/50 to-purple-500/50 rounded-xl mb-4 relative overflow-hidden group">
                      <div class="absolute inset-0 bg-primary-400/20 group-hover:bg-primary-400/0 transition-colors"></div>
                  </div>
                 <div class="flex items-center gap-2">
                     <div class="w-8 h-8 rounded-full bg-primary-400/50 flex items-center justify-center">
                        <Icon icon="heroicons:user" class="w-4 h-4 text-white" />
                     </div>
                     <div class="text-xs text-primary-100">Don't worry about failure; you only have to be right once.</div>
                 </div>
                 <div class="mt-4 text-sm font-bold">Simon Sinek</div>
             </div>
        </div>
    </div>

    <!-- Right Side (Form) -->
    <div class="relative flex items-center justify-center p-8 bg-white dark:bg-slate-950 min-h-screen">
      <div class="w-full max-w-md relative z-10">
         <div class="text-center lg:text-left mb-10">
             <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Create your account</h2>
             <p class="text-gray-500 dark:text-gray-400 text-sm">Have an account? <RouterLink to="#" class="text-primary-600 font-bold hover:underline">Login</RouterLink></p>
         </div>

         <!-- Social Login -->
         <div class="grid grid-cols-2 gap-4 mb-8">
             <UButton 
                block 
                color="white" 
                variant="solid" 
                label="Google" 
                class="bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/80 h-11 shadow-sm rounded-xl font-medium transition-all hover:scale-[1.02]"
                @click="handleSocialLogin('Google')"
            >
                <template #leading>
                    <Icon icon="simple-icons:google" class="w-5 h-5 flex-shrink-0" />
                </template>
            </UButton>
             <UButton 
                block 
                color="white" 
                variant="solid" 
                label="Apple" 
                class="bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/80 h-11 shadow-sm rounded-xl font-medium transition-all hover:scale-[1.02]"
                @click="handleSocialLogin('Apple')"
            >
                <template #leading>
                    <Icon icon="simple-icons:apple" class="w-5 h-5 flex-shrink-0" />
                </template>
            </UButton>
         </div>

         <div class="relative flex items-center gap-4 py-4 mb-8">
            <div class="flex-grow border-t border-gray-200 dark:border-slate-800"></div>
            <span class="text-xs text-gray-400 uppercase font-bold tracking-widest">OR</span>
            <div class="flex-grow border-t border-gray-200 dark:border-slate-800"></div>
         </div>

         <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
            <UFormGroup label="Email Address" name="email" class="space-y-1.5 font-bold text-gray-700 dark:text-gray-300">
               <UInput 
                 v-model="state.email" 
                 placeholder="john@example.com" 
                 class="w-full"
                 size="lg"
                 :ui="{ rounded: 'rounded-xl', base: 'h-12 bg-gray-50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 focus:ring-primary-500' }"
                 variant="outline"
                 color="white"
               >
                 <template #leading>
                     <Icon icon="heroicons:envelope" class="w-5 h-5 text-gray-400" />
                 </template>
               </UInput>
            </UFormGroup>

            <UFormGroup label="Password" name="password" class="space-y-1.5 font-bold text-gray-700 dark:text-gray-300">
               <UInput 
                 v-model="state.password" 
                 type="password" 
                 placeholder="••••••••" 
                 class="w-full"
                 size="lg"
                 :ui="{ rounded: 'rounded-xl', base: 'h-12 bg-gray-50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 focus:ring-primary-500' }"
                 variant="outline"
                 color="white"
               >
                 <template #leading>
                     <Icon icon="heroicons:envelope" class="w-5 h-5 text-gray-400" />
                 </template>
               </UInput>
            </UFormGroup>

            <UFormGroup label="Password" name="password" class="space-y-1.5 font-bold text-gray-700 dark:text-gray-300">
               <UInput 
                 v-model="state.password" 
                 type="password" 
                 placeholder="••••••••" 
                 class="w-full"
                 size="lg"
                 :ui="{ rounded: 'rounded-xl', base: 'h-12 bg-gray-50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 focus:ring-primary-500' }"
                 variant="outline"
                 color="white"
               >
                 <template #leading>
                     <Icon icon="heroicons:lock-closed" class="w-5 h-5 text-gray-400" />
                 </template>
               </UInput>
            </UFormGroup>

             <!-- Privacy Policy -->
             <div class="text-xs text-gray-500 mt-4 leading-relaxed">
                By signing up, you agree to our <a href="#" class="font-bold text-gray-700 dark:text-gray-300 underline hover:text-primary-600">Terms & Conditions</a> and <a href="#" class="font-bold text-gray-700 dark:text-gray-300 underline hover:text-primary-600">Privacy Policy</a>
             </div>

            <UButton 
                type="submit" 
                block 
                label="Create Account" 
                color="primary" 
                variant="solid"
                size="xl" 
                :loading="isLoading"
                class="h-12 rounded-xl text-base font-bold shadow-lg shadow-primary-500/30 transition-all duration-300 transform active:scale-[0.98] hover:shadow-primary-600/40"
            />
         </UForm>
      </div>

    </div>
  </div>
</template>
