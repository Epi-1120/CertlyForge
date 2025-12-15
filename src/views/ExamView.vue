<template>
  <div class="exam-view">
    <router-link to="/" class="back">back to certs</router-link>
    <QuizView v-if="exam" :exam="exam" />
    <p v-else>Exam not found</p>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import QuizView from '../components/QuizView.vue'
import { getExam } from '../data/exams.js'
const route = useRoute()
const exam = computed(() => getExam(route.params.certId))
</script>
<style scoped>
.exam-view { max-width: 800px; margin: 0 auto; padding: 2rem; }
.back { color: #666; text-decoration: none; font-size: 0.9rem; }
</style>
