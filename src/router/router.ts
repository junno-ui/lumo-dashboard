import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Index from '../pages/index.vue'

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    isRedirect?: boolean;
    title?: string;
    icon?: string;
  }
}
const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'Index',
    component: Index,
    meta: { title: 'Home' },
  },
  // {
  //   path: '/:pathMatch(.*)*', // Tangkap semua rute yang tidak cocok
  //   name: 'NotFound',
  //   component: Error, // Lazy load halaman 404
  //   meta: { title: '404 Not Found' },
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  next()
})

export default router
