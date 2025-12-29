<template>
  <!-- Dashboard Preview (compact SaaS style) -->
  <div class="mt-auto pt-10">
    <div class="relative max-w-3xl">
      <!-- Base card (interactive) -->
      <UCard class="group rounded-2xl overflow-hidden
               border border-black/5 bg-white/90 text-neutral-900 shadow-2xl shadow-black/20
               transition-all duration-300 ease-out
               hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/30
               dark:border-white/10 dark:bg-neutral-950/60 dark:text-white dark:shadow-black/50"
        :ui="{ body: 'p-0', header: 'p-0', footer: 'p-0' }">
        <!-- top strip (FIX: linear class) -->
        <div class="h-10 bg-linear-to-r from-primary-600/20 to-primary-700/10
                 dark:from-primary-500/15 dark:to-primary-700/5" />

        <div class="p-5">
          <!-- KPI row -->
          <div class="grid grid-cols-3 gap-3">
            <!-- KPI Card -->
            <div class="group/kpi rounded-xl border border-neutral-200/80 bg-white p-3
                     transition-all duration-300 ease-out
                     hover:-translate-y-0.5 hover:border-primary-300/60 hover:shadow-lg hover:shadow-black/10
                     dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:shadow-black/40">
              <div class="flex items-center justify-between">
                <p class="text-[10px] text-neutral-500 dark:text-white/60">MRR</p>
                <UBadge size="xs" color="success" variant="soft">+8%</UBadge>
              </div>

              <p class="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">$18,930</p>

              <div class="mt-2 h-6 rounded-lg bg-neutral-100 dark:bg-white/10 overflow-hidden">
                <div class="h-full w-[68%] bg-primary-600/40 dark:bg-primary-400/35
                         transition-all duration-500 group-hover/kpi:w-[76%]" />
              </div>
            </div>

            <!-- KPI Card -->
            <div class="group/kpi rounded-xl border border-neutral-200/80 bg-white p-3
                     transition-all duration-300 ease-out
                     hover:-translate-y-0.5 hover:border-primary-300/60 hover:shadow-lg hover:shadow-black/10
                     dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:shadow-black/40">
              <div class="flex items-center justify-between">
                <p class="text-[10px] text-neutral-500 dark:text-white/60">Active Users</p>
                <UBadge size="xs" color="primary" variant="soft">Live</UBadge>
              </div>

              <p class="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">2,184</p>

              <div class="mt-2 flex items-end gap-1 h-6">
                <div
                  class="w-1.5 h-2 bg-neutral-200 dark:bg-white/15 rounded transition-all duration-300 group-hover/kpi:h-3" />
                <div
                  class="w-1.5 h-3 bg-neutral-200 dark:bg-white/15 rounded transition-all duration-300 group-hover/kpi:h-4" />
                <div
                  class="w-1.5 h-5 bg-primary-600/50 dark:bg-primary-400/35 rounded transition-all duration-300 group-hover/kpi:h-6" />
                <div
                  class="w-1.5 h-4 bg-neutral-200 dark:bg-white/15 rounded transition-all duration-300 group-hover/kpi:h-5" />
                <div
                  class="w-1.5 h-6 bg-primary-600/50 dark:bg-primary-400/35 rounded transition-all duration-300 group-hover/kpi:h-7" />
              </div>
            </div>

            <!-- KPI Card -->
            <div class="group/kpi rounded-xl border border-neutral-200/80 bg-white p-3
                     transition-all duration-300 ease-out
                     hover:-translate-y-0.5 hover:border-primary-300/60 hover:shadow-lg hover:shadow-black/10
                     dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:shadow-black/40">
              <div class="flex items-center justify-between">
                <p class="text-[10px] text-neutral-500 dark:text-white/60">Tickets</p>
                <UBadge size="xs" color="warning" variant="soft">Open</UBadge>
              </div>

              <p class="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">37</p>

              <div class="mt-2">
                <UProgress class="transition-all duration-300" size="xs" :model-value="42" />
              </div>
            </div>
          </div>

          <!-- Mid widgets -->
          <div class="mt-4 grid grid-cols-5 gap-3">
            <!-- Conversion -->
            <div class="group/widget col-span-2 rounded-xl border border-neutral-200/80 bg-white p-3
                     transition-all duration-300 ease-out
                     hover:-translate-y-0.5 hover:border-primary-300/60 hover:shadow-lg hover:shadow-black/10
                     dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:shadow-black/40">
              <div class="flex items-center justify-between">
                <p class="text-[10px] font-medium text-neutral-700 dark:text-white/80">Conversion</p>
                <p class="text-[10px] text-neutral-500 dark:text-white/60">Weekly</p>
              </div>

              <div class="mt-3 rounded-xl bg-neutral-50 dark:bg-white/5 p-3">
                <p class="text-[10px] text-neutral-500 dark:text-white/60">Rate</p>
                <p class="mt-1 text-base font-semibold text-neutral-900 dark:text-white">4.8%</p>

                <!-- FIX: linear class + hover animation -->
                <div class="mt-3 h-16 rounded-lg
                         bg-linear-to-br from-primary-600/25 to-primary-700/10
                         dark:from-primary-400/20 dark:to-primary-700/5
                         transition-all duration-300
                         group-hover/widget:scale-[1.02]" />
              </div>
            </div>

            <!-- Recent activity -->
            <div class="group/widget col-span-3 rounded-xl border border-neutral-200/80 bg-white p-3
                     transition-all duration-300 ease-out
                     hover:-translate-y-0.5 hover:border-primary-300/60 hover:shadow-lg hover:shadow-black/10
                     dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:shadow-black/40">
              <div class="flex items-center justify-between">
                <p class="text-[10px] font-medium text-neutral-700 dark:text-white/80">Recent Activity</p>
                <UBadge size="xs" color="neutral" variant="soft" class="bg-neutral-100 text-neutral-700
                         dark:bg-white/10 dark:text-white/80">
                  Today
                </UBadge>
              </div>

              <div class="mt-3 space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="flex items-center justify-center w-7 h-7 rounded-lg
                             bg-neutral-100 text-neutral-700
                             transition-all duration-300
                             group-hover/widget:bg-primary-600/15
                             dark:bg-white/10 dark:text-white/80 dark:group-hover/widget:bg-white/15">
                      <UIcon name="mdi:credit-card-outline" class="w-4 h-4" />
                    </div>

                    <div>
                      <p class="text-[11px] font-medium text-neutral-900 dark:text-white">Invoice paid</p>
                      <p class="text-[10px] text-neutral-500 dark:text-white/60">Acme Inc.</p>
                    </div>
                  </div>

                  <UBadge size="xs" color="success" variant="soft">+$320</UBadge>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="flex items-center justify-center w-7 h-7 rounded-lg
                             bg-neutral-100 text-neutral-700
                             transition-all duration-300
                             group-hover/widget:bg-primary-600/15
                             dark:bg-white/10 dark:text-white/80 dark:group-hover/widget:bg-white/15">
                      <UIcon name="mdi:account-outline" class="w-4 h-4" />
                    </div>

                    <div>
                      <p class="text-[11px] font-medium text-neutral-900 dark:text-white">New signup</p>
                      <p class="text-[10px] text-neutral-500 dark:text-white/60">Pro plan</p>
                    </div>
                  </div>

                  <UBadge size="xs" color="primary" variant="soft">User</UBadge>
                </div>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="mt-4 rounded-xl border border-neutral-200/80 overflow-hidden
                   transition-all duration-300
                   hover:border-primary-300/60
                   dark:border-white/10 dark:hover:border-white/20">
            <div class="flex items-center justify-between bg-neutral-50 px-3 py-2 dark:bg-white/5">
              <p class="text-[11px] font-medium text-neutral-700 dark:text-white/80">Latest Transactions</p>
              <UBadge size="xs" color="primary" variant="soft">Sync</UBadge>
            </div>

            <div class="divide-y divide-neutral-200/80 dark:divide-white/10 text-[11px]">
              <div class="px-3 py-2 flex items-center justify-between
                       transition-colors duration-200
                       hover:bg-neutral-50/70 dark:hover:bg-white/5">
                <div class="flex items-center gap-2">
                  <UIcon name="mdi:credit-card-outline" class="w-4 h-4" />
                  <div>
                    <p class="font-medium text-neutral-900 dark:text-white">Stripe • INV-1201</p>
                    <p class="text-[10px] text-neutral-500 dark:text-white/60">2 min ago</p>
                  </div>
                </div>

                <div class="text-right">
                  <p class="font-semibold text-neutral-900 dark:text-white">$129</p>
                  <UBadge size="xs" color="success" variant="soft">Paid</UBadge>
                </div>
              </div>

              <div class="px-3 py-2 flex items-center justify-between
                       transition-colors duration-200
                       hover:bg-neutral-50/70 dark:hover:bg-white/5">
                <div class="flex items-center gap-2">
                  <UIcon name="mdi:credit-card-outline" class="w-4 h-4" />
                  <div>
                    <p class="font-medium text-neutral-900 dark:text-white">PayPal • INV-1200</p>
                    <p class="text-[10px] text-neutral-500 dark:text-white/60">8 min ago</p>
                  </div>
                </div>

                <div class="text-right">
                  <p class="font-semibold text-neutral-900 dark:text-white">$59</p>
                  <UBadge size="xs" color="warning" variant="soft">Pending</UBadge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Floating small KPI -->
      <UCard class="absolute -top-8 left-5 w-44 rounded-2xl
               border border-black/5 bg-white/95 text-neutral-900 shadow-xl
               transition-all duration-300 ease-out
               hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/20
               dark:border-white/10 dark:bg-neutral-950/75 dark:text-white dark:hover:shadow-black/50"
        :ui="{ body: 'p-3' }">
        <div class="flex items-center justify-between">
          <p class="text-[10px] text-neutral-500 dark:text-white/60">NPS</p>
          <UBadge size="xs" color="success" variant="soft">+3</UBadge>
        </div>
        <p class="mt-1 text-base font-semibold">54</p>
        <p class="text-[10px] text-neutral-500 dark:text-white/60">Last 7 days</p>
      </UCard>

      <!-- Floating chart -->
      <UCard class="absolute top-10 -right-10 w-56 rounded-2xl
               border border-black/5 bg-white/95 text-neutral-900 shadow-xl
               transition-all duration-300 ease-out
               hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/20
               dark:border-white/10 dark:bg-neutral-950/75 dark:text-white dark:hover:shadow-black/50"
        :ui="{ body: 'p-3' }">
        <div class="flex items-center justify-between">
          <p class="text-[10px] font-medium text-neutral-700 dark:text-white/80">Revenue</p>
          <UBadge size="xs" color="primary" variant="soft">30d</UBadge>
        </div>

        <p class="mt-1 text-sm font-semibold">$42.1k</p>

        <!-- FIX: linear class -->
        <div class="mt-2 h-14 rounded-xl
                 bg-linear-to-br from-primary-600/25 to-primary-700/10
                 dark:from-primary-400/20 dark:to-primary-700/5
                 transition-transform duration-300 hover:scale-[1.02]" />

        <p class="mt-2 text-[10px] text-neutral-500 dark:text-white/60">Forecast +6%</p>
      </UCard>
    </div>
  </div>
</template>
