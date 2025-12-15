import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  { path: '/', name: 'home', component: () => import('./views/CertList.vue') },
  { path: '/exam/:certId', name: 'exam', component: () => import('./views/ExamView.vue') }
]
export const router = createRouter({ history: createWebHistory(), routes })
