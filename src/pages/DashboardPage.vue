<script setup lang="ts">
import PromoBanner from '../components/dashboard/PromoBanner.vue'
import StatsOverview from '../components/dashboard/StatsOverview.vue'
import CourseList from '../components/dashboard/CourseList.vue'
import LessonTable from '../components/dashboard/LessonTable.vue'
import UserProgressWidget from '../components/dashboard/UserProgressWidget.vue'
import MentorsList from '../components/dashboard/MentorsList.vue'
</script>

<template>
  <div class="grid grid-cols-12 gap-8">
    
    <!-- Center Column -->
    <div class="col-span-12 xl:col-span-8 space-y-10">
      <PromoBanner />
      <StatsOverview />
      <CourseList />
      <LessonTable />
    </div>

    <!-- Right Column -->
    <div class="col-span-12 xl:col-span-4 space-y-8">
       <UserProgressWidget />
       <MentorsList />
    </div>
  </div>
</template>
