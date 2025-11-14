<template>
  <div class="app">
    <h1>CertlyForge</h1>
    <QuizView :exam="cisaExam" />
  </div>
</template>
<script setup>
import QuizView from './components/QuizView.vue'
import { cisaExam } from './data/cisa.js'
</script>
<style>.app { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }</style>
