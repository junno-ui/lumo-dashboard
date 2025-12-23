<template>
  <div class="max-w-2xl mx-auto">
    <div class="backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-[2.5rem] p-10 border border-white/20 dark:border-slate-800 shadow-xl space-y-8">
        <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h2>
            <p class="text-gray-500 dark:text-gray-400 text-sm">Manage your account preferences</p>
        </div>

        <div class="space-y-6">
            <UFormGroup label="Display Name" name="name">
                <UInput placeholder="Jason Ranti" size="lg" :ui="{ rounded: 'rounded-xl' }" />
            </UFormGroup>
             <UFormGroup label="Email Address" name="email">
                <UInput placeholder="jason@coursue.com" icon="i-heroicons-envelope" size="lg" :ui="{ rounded: 'rounded-xl' }" />
            </UFormGroup>
            
            <div class="pt-4 border-t border-gray-100 dark:border-slate-800">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Notifications</h3>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                         <span class="text-sm text-gray-600 dark:text-gray-300">Email Notifications</span>
                         <UToggle color="primary" />
                    </div>
                     <div class="flex items-center justify-between">
                         <span class="text-sm text-gray-600 dark:text-gray-300">Push Notifications</span>
                         <UToggle color="primary" :model-value="true" />
                    </div>
                </div>
            </div>

            <div class="pt-6">
                <UButton label="Save Changes" size="xl" color="primary" block class="rounded-xl font-bold" />
            </div>
        </div>
    </div>
  </div>
</template>
