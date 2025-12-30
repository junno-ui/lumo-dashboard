<template>
  <!-- Register Preview (Onboarding Dashboard) -->
<div class="mt-auto pt-10">
  <div class="relative max-w-3xl">

    <!-- Base card -->
    <UCard
      class="group rounded-2xl overflow-hidden
             border border-black/5 bg-white/90 text-neutral-900 shadow-2xl shadow-black/20
             transition-all duration-300 ease-out
             hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/30
             dark:border-white/10 dark:bg-neutral-950/60 dark:text-white dark:shadow-black/50"
      :ui="{ body: 'p-0', header: 'p-0', footer: 'p-0' }"
    >
      <!-- Header strip -->
      <div
        class="h-10 bg-linear-to-r from-primary-600/20 to-primary-700/10
               dark:from-primary-500/15 dark:to-primary-700/5"
      />

      <div class="p-5 space-y-4">
        <!-- Top row: Onboarding progress -->
        <div
          class="rounded-xl border border-neutral-200/80 bg-white p-4
                 transition-all duration-300 hover:border-primary-300/60 hover:shadow-lg hover:shadow-black/10
                 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:shadow-black/40"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[11px] text-neutral-500 dark:text-white/60">Onboarding</p>
              <p class="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">Complete your setup</p>
            </div>
            <UBadge size="xs" color="primary" variant="soft">Step 2/4</UBadge>
          </div>

          <UProgress class="mt-3" size="xs" :model-value="50" />

          <div class="mt-3 grid grid-cols-4 gap-2">
            <div class="h-2 rounded-full bg-primary-600/40 dark:bg-primary-400/35"></div>
            <div class="h-2 rounded-full bg-primary-600/25 dark:bg-primary-400/20"></div>
            <div class="h-2 rounded-full bg-neutral-200 dark:bg-white/10"></div>
            <div class="h-2 rounded-full bg-neutral-200 dark:bg-white/10"></div>
          </div>

          <div class="mt-3 flex items-center justify-between text-[11px] text-neutral-500 dark:text-white/60">
            <span>Verify email</span>
            <span>Invite team</span>
            <span>Pick plan</span>
            <span>Launch</span>
          </div>
        </div>

        <!-- Middle row: Plan + Features -->
        <div class="grid grid-cols-5 gap-3">
          <!-- Plan card -->
          <div
            class="col-span-2 rounded-xl border border-neutral-200/80 bg-white p-4
                   transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-300/60 hover:shadow-lg hover:shadow-black/10
                   dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:shadow-black/40"
          >
            <div class="flex items-center justify-between">
              <p class="text-[11px] font-medium text-neutral-700 dark:text-white/80">Starter Plan</p>
              <UBadge size="xs" color="success" variant="soft">Free</UBadge>
            </div>

            <p class="mt-2 text-2xl font-semibold text-neutral-900 dark:text-white">$0</p>
            <p class="text-[11px] text-neutral-500 dark:text-white/60">Up to 3 projects</p>

            <div class="mt-3 rounded-lg bg-neutral-50 dark:bg-white/5 p-3">
              <div class="flex items-center justify-between">
                <p class="text-[10px] text-neutral-500 dark:text-white/60">Storage</p>
                <p class="text-[10px] font-medium text-neutral-700 dark:text-white/80">2GB</p>
              </div>
              <div class="mt-2 h-2 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
                <div class="h-full w-[35%] bg-primary-600/40 dark:bg-primary-400/35 transition-all duration-500 group-hover:w-[45%]" />
              </div>
            </div>
          </div>

          <!-- Feature list -->
          <div
            class="col-span-3 rounded-xl border border-neutral-200/80 bg-white p-4
                   transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-300/60 hover:shadow-lg hover:shadow-black/10
                   dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:shadow-black/40"
          >
            <div class="flex items-center justify-between">
              <p class="text-[11px] font-medium text-neutral-700 dark:text-white/80">What you get</p>
              <UBadge size="xs" color="neutral" variant="soft" class="bg-neutral-100 text-neutral-700 dark:bg-white/10 dark:text-white/80">
                Included
              </UBadge>
            </div>

            <ul class="mt-3 space-y-2 text-[11px]">
              <li class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-white/10 flex items-center justify-center">
                  <Icon icon="mdi:check-circle-outline" class="w-4 h-4 text-neutral-700 dark:text-white/80" />
                </span>
                <span class="text-neutral-700 dark:text-white/80">Team workspace & roles</span>
              </li>

              <li class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-white/10 flex items-center justify-center">
                  <Icon icon="mdi:check-circle-outline" class="w-4 h-4 text-neutral-700 dark:text-white/80" />
                </span>
                <span class="text-neutral-700 dark:text-white/80">Realtime activity feed</span>
              </li>

              <li class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-white/10 flex items-center justify-center">
                  <Icon icon="mdi:check-circle-outline" class="w-4 h-4 text-neutral-700 dark:text-white/80" />
                </span>
                <span class="text-neutral-700 dark:text-white/80">Secure authentication</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom: table -->
        <div
          class="rounded-xl border border-neutral-200/80 overflow-hidden
                 transition-all duration-300 hover:border-primary-300/60
                 dark:border-white/10 dark:hover:border-white/20"
        >
          <div class="flex items-center justify-between bg-neutral-50 px-4 py-3 dark:bg-white/5">
            <p class="text-[11px] font-medium text-neutral-700 dark:text-white/80">Recent Signups</p>
            <UBadge size="xs" color="primary" variant="soft">Live</UBadge>
          </div>

          <div class="divide-y divide-neutral-200/80 dark:divide-white/10 text-[11px]">
            <div class="px-4 py-3 flex items-center justify-between transition-colors duration-200 hover:bg-neutral-50/70 dark:hover:bg-white/5">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-white/10 flex items-center justify-center">
                  <UIcon name="mdi:account-outline" class="w-4 h-4" />
                </div>
                <div>
                  <p class="font-medium text-neutral-900 dark:text-white">jane@acme.com</p>
                  <p class="text-[10px] text-neutral-500 dark:text-white/60">Pro trial</p>
                </div>
              </div>
              <UBadge size="xs" color="success" variant="soft">Verified</UBadge>
            </div>

            <div class="px-4 py-3 flex items-center justify-between transition-colors duration-200 hover:bg-neutral-50/70 dark:hover:bg-white/5">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-white/10 flex items-center justify-center">
                                    <UIcon name="mdi:account-outline" class="w-4 h-4" />

                </div>
                <div>
                  <p class="font-medium text-neutral-900 dark:text-white">mike@studio.io</p>
                  <p class="text-[10px] text-neutral-500 dark:text-white/60">Starter</p>
                </div>
              </div>
              <UBadge size="xs" color="warning" variant="soft">Pending</UBadge>
            </div>

            <div class="px-4 py-3 flex items-center justify-between transition-colors duration-200 hover:bg-neutral-50/70 dark:hover:bg-white/5">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-white/10 flex items-center justify-center">
                  <Icon icon="mdi:account-outline" class="w-4 h-4 text-neutral-600 dark:text-white/70" />
                </div>
                <div>
                  <p class="font-medium text-neutral-900 dark:text-white">sara@labs.co</p>
                  <p class="text-[10px] text-neutral-500 dark:text-white/60">Team</p>
                </div>
              </div>
              <UBadge size="xs" color="primary" variant="soft">Invited</UBadge>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Floating mini card (top-left) -->
    <UCard
      class="absolute -top-8 left-5 w-44 rounded-2xl
             border border-black/5 bg-white/95 text-neutral-900 shadow-xl
             transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/20
             dark:border-white/10 dark:bg-neutral-950/75 dark:text-white dark:hover:shadow-black/50"
      :ui="{ body: 'p-3' }"
    >
      <div class="flex items-center justify-between">
        <p class="text-[10px] text-neutral-500 dark:text-white/60">Setup Score</p>
        <UBadge size="xs" color="success" variant="soft">+12</UBadge>
      </div>
      <p class="mt-1 text-base font-semibold">78</p>
      <p class="text-[10px] text-neutral-500 dark:text-white/60">Great progress</p>
    </UCard>

    <UCard
  class="absolute -top-20 right-6 z-20 w-60 rounded-2xl
         border border-black/5 bg-white/95 text-neutral-900 shadow-xl
         transition-all duration-300 ease-out
         hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/25
         hover:scale-[1.02]
         dark:border-white/10 dark:bg-neutral-950/75 dark:text-white dark:hover:shadow-black/50"
  :ui="{ body: 'p-4' }"
>
  <div class="flex items-start justify-between gap-3">
    <div>
      <p class="text-xs font-medium text-neutral-700 dark:text-white/80">
        Workspace Ready
      </p>
      <p class="mt-0.5 text-[11px] text-neutral-500 dark:text-white/60">
        Finish setup to start collaborating
      </p>
    </div>

    <UBadge size="xs" color="primary" variant="soft">
      2/4
    </UBadge>
  </div>

  <div class="mt-3 rounded-xl bg-neutral-50 p-3 dark:bg-white/5">
    <div class="flex items-center justify-between">
      <p class="text-[11px] text-neutral-500 dark:text-white/60">Setup progress</p>
      <p class="text-[11px] font-semibold text-neutral-900 dark:text-white">50%</p>
    </div>
    <UProgress class="mt-2" size="xs" :model-value="50" />
  </div>

  <div class="mt-3 flex items-center justify-between">
    <div>
      <p class="text-[11px] text-neutral-500 dark:text-white/60">Next step</p>
      <p class="text-sm font-semibold text-neutral-900 dark:text-white">
        Invite team members
      </p>
    </div>

    <UBadge size="xs" color="success" variant="soft">
      +12
    </UBadge>
  </div>
</UCard>

  </div>
</div>

</template>