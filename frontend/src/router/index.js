import { createRouter, createWebHistory } from 'vue-router'
import FileBrowser from '@/components/FileBrowser.vue'

const routes = [
  {
    path: '/',
    name: 'FileBrowser',
    component: FileBrowser
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router