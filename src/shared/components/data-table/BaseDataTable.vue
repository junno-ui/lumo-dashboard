<script setup lang="ts" generic="T">
import type { TableColumn } from '@nuxt/ui'

withDefaults(defineProps<{
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  title?: string
  description?: string
  totalItems?: number
  totalPages?: number
  searchPlaceholder?: string
  emptyState?: {
    icon?: string
    label?: string
    description?: string
  }
  pageSizeOptions?: Array<{ label: string, value: number }>
}>(), {
  loading: false,
  searchPlaceholder: 'Search...',
  totalItems: 0,
  totalPages: 1,
  emptyState: () => ({
    icon: 'i-lucide-search-x',
    label: 'No results found.',
    description: 'Try changing your filters or search query.'
  }),
  pageSizeOptions: () => [
    { label: '10 / page', value: 10 },
    { label: '20 / page', value: 20 },
    { label: '50 / page', value: 50 }
  ]
})

const search = defineModel<string>('search', { default: '' })
const page = defineModel<number>('page', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 10 })
</script>

<template>
  <UCard class="surface-card overflow-hidden rounded-2xl" :ui="{ body: 'p-0', header: 'p-0' }">
    <div class="flex flex-col gap-5 p-4 sm:p-5">
      <div class="table-toolbar">
        <div v-if="title || description" class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <h2 v-if="title" class="text-base font-semibold tracking-[-0.03em] text-white sm:text-lg">
              {{ title }}
            </h2>
            <span
              v-if="totalItems > 0"
              class="inline-flex items-center rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-zinc-400"
            >
              {{ totalItems }} records
            </span>
          </div>
          <p v-if="description" class="max-w-2xl text-sm text-zinc-500">
            {{ description }}
          </p>
        </div>

        <div class="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[24rem] lg:items-end">
          <div class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <UInput
              v-model="search"
              icon="i-lucide-search"
              size="sm"
              color="neutral"
              variant="outline"
              :placeholder="searchPlaceholder"
              class="w-full sm:max-w-72"
              :ui="{
                base: 'h-10 rounded-lg border-white/8 bg-black/40 text-sm text-white placeholder:text-zinc-600',
                leadingIcon: 'text-zinc-500'
              }"
            />

            <div v-if="$slots.actions" class="flex items-center gap-2">
              <slot name="actions" />
            </div>
          </div>

          <div v-if="$slots.filters" class="flex w-full flex-wrap items-center gap-2 lg:justify-end">
            <slot name="filters" />
          </div>
        </div>
      </div>

      <div class="table-shell">
        <UTable
          :data="data"
          :columns="columns"
          :loading="loading"
          :empty-state="emptyState"
          :ui="{
            base: 'min-w-full',
            thead: 'bg-zinc-950/90 backdrop-blur',
            tbody: 'divide-y divide-white/6',
            th: 'h-11 px-4 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500',
            tr: 'transition-colors hover:bg-white/[0.02]',
            td: 'px-4 py-3.5 align-middle text-sm text-zinc-200'
          }"
        />
      </div>

      <div class="table-toolbar border-t border-white/8 pt-4">
        <div class="text-xs text-zinc-500">
          Showing
          <span class="font-semibold text-white">{{ data.length }}</span>
          of
          <span class="font-semibold text-white">{{ totalItems }}</span>
          records
          <span class="mx-2 text-zinc-700">/</span>
          Page
          <span class="font-semibold text-white">{{ page }}</span>
          of
          <span class="font-semibold text-white">{{ totalPages }}</span>
        </div>

        <div class="flex flex-wrap items-center gap-2 lg:justify-end">
          <USelectMenu
            v-model="pageSize"
            size="sm"
            color="neutral"
            variant="outline"
            class="w-32"
            :items="pageSizeOptions"
            value-key="value"
            label-key="label"
            :ui="{ base: 'rounded-lg border-white/8 bg-black/40' }"
          />

          <UButton
            size="sm"
            color="neutral"
            variant="outline"
            icon="i-lucide-chevron-left"
            class="rounded-lg border-white/8 bg-black/40 hover:bg-white/[0.06]"
            :disabled="page <= 1"
            @click="page = Math.max(1, page - 1)"
          >
            Prev
          </UButton>

          <UButton
            size="sm"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-chevron-right"
            class="rounded-lg border-white/8 bg-black/40 hover:bg-white/[0.06]"
            :disabled="page >= totalPages"
            @click="page = Math.min(totalPages, page + 1)"
          >
            Next
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>
