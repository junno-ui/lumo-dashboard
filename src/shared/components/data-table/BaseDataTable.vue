<script setup lang="ts" generic="T">
import type { TableColumn } from '@nuxt/ui'

const props = withDefaults(defineProps<{
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
  pageSizeOptions?: Array<{ label: string; value: number }>
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
  <UCard class="surface-card rounded-[28px]" :ui="{ body: 'p-0', header: 'p-0' }">
    <div class="flex flex-col gap-5 p-5 sm:p-6">
      <div class="table-toolbar">
        <div v-if="title || description" class="space-y-1.5">
          <h2 v-if="title" class="text-lg font-semibold tracking-[-0.03em] text-white">
            {{ title }}
          </h2>
          <p v-if="description" class="text-sm text-zinc-500">
            {{ description }}
          </p>
        </div>

        <div class="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
          <div v-if="$slots.filters" class="flex flex-wrap items-center gap-2">
            <slot name="filters" />
          </div>

          <UInput
            v-model="search"
            icon="i-lucide-search"
            size="sm"
            color="neutral"
            variant="outline"
            :placeholder="searchPlaceholder"
            class="w-full lg:w-72"
            :ui="{ base: 'rounded-xl border-white/8 bg-white/[0.03] text-white placeholder:text-zinc-600' }"
          />

          <div v-if="$slots.actions" class="flex items-center gap-2">
            <slot name="actions" />
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
            thead: 'bg-white/[0.03]',
            th: 'h-11 px-4 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500',
            tr: 'border-t border-white/6 transition-colors hover:bg-white/[0.03]',
            td: 'px-4 py-4 align-middle text-zinc-200'
          }"
        />
      </div>

      <div class="table-toolbar border-t border-white/8 pt-4">
        <div class="text-xs text-zinc-500">
          Showing
          <span class="font-semibold text-white">{{ data.length }}</span>
          of
          <span class="font-semibold text-white">{{ totalItems }}</span>
          results
          <span class="mx-2 text-zinc-700">•</span>
          Page
          <span class="font-semibold text-white">{{ page }}</span>
          of
          <span class="font-semibold text-white">{{ totalPages }}</span>
        </div>

        <div class="flex items-center gap-2">
          <USelectMenu
            v-model="pageSize"
            size="sm"
            color="neutral"
            variant="outline"
            class="w-32"
            :items="pageSizeOptions"
            value-key="value"
            label-key="label"
          />

          <UButton
            size="sm"
            color="neutral"
            variant="outline"
            icon="i-lucide-chevron-left"
            class="rounded-xl border-white/8 bg-white/[0.03] hover:bg-white/[0.06]"
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
            class="rounded-xl border-white/8 bg-white/[0.03] hover:bg-white/[0.06]"
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
