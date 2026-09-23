import { createRouter, createWebHistory } from 'vue-router'
import TriajeView from '../views/TriajeView.vue'
import BandejaView from '../views/BandejaView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'triaje', component: TriajeView, meta: { title: 'Triaje' } },
    { path: '/bandeja', name: 'bandeja', component: BandejaView, meta: { title: 'Bandeja' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
