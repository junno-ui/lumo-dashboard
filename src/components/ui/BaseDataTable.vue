<script setup lang="ts" generic="T">
import { ref, computed } from 'vue'
import { getPaginationRowModel } from '@tanstack/vue-table'
import type { TableColumn } from '@nuxt/ui'

const props = defineProps<{
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  title?: string
  searchPlaceholder?: string
}>()

const search = ref('')
const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})
const columnVisibility = ref({})

const currentPage = computed({
  get: () => pagination.value.pageIndex + 1,
  set: (val) => {
    pagination.value.pageIndex = val - 1
  }
})

</script>

<template>
  <div class="space-y-4">
    <!-- Header: Title and Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h2 v-if="title" class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ title }}
      </h2>
      
      <div class="flex items-center gap-2">
        <!-- Search -->
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass"
          :placeholder="searchPlaceholder || 'Search...'"
          class="w-full sm:w-64"
        />
        
        <!-- Slot for extra actions (e.g. Add Button) -->
        <slot name="actions" />
      </div>
    </div>

    <!-- Table -->
    <div class="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      <UTable
        :data="data"
        :columns="columns"
        :loading="loading"
        v-model:global-filter="search"
        v-model:pagination="pagination"
        v-model:column-visibility="columnVisibility"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel()
        }"
        class="w-full"
      >
        <!-- Pass through slots dynamically -->
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </UTable>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end border-t border-gray-200 dark:border-gray-800 pt-4 px-4 pb-4">
      <UPagination
        v-if="data.length > pagination.pageSize"
        v-model="currentPage"
        :page-count="pagination.pageSize"
        :total="data.length"
      />
    </div>
  </div>
</template>

<script lang="ts">
// Additional script block for generic type if needed, but setup generic="T" handles it.
</script>
