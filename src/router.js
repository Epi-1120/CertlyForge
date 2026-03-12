import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  { path: '/', name: 'home', component: () => import('./views/CertList.vue') },
  { path: '/exam/:certId', name: 'exam', component: () => import('./views/ExamView.vue') },
  { path: '/flashcards', name: 'flashcards', component: () => import('./views/FlashcardsView.vue') },
  { path: '/ielts/vocab', name: 'ielts-vocab', component: () => import('./views/IeltsVocabView.vue') },
  { path: '/ielts/reading', name: 'ielts-reading', component: () => import('./views/IeltsReadingView.vue') }
]
export const router = createRouter({ history: createWebHistory(), routes })

