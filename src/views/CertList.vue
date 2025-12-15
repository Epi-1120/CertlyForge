<template>
  <div class="cert-list">
    <h1>CertlyForge</h1>
    <p class="sub">Pick a certification to practice</p>
    <div class="cards">
      <router-link v-for="exam in exams" :key="exam.id" :to="'/exam/'+exam.id" class="card" :style="{borderColor: exam.color}">
        <h3 :style="{color: exam.color}">{{ exam.name }}</h3>
        <p>{{ exam.fullName }}</p>
        <span class="count">{{ exam.questions.length }} questions</span>
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { exams } from '../data/exams.js'
</script>
<style scoped>
.cert-list { max-width: 800px; margin: 0 auto; padding: 2rem; }
.sub { color: #666; margin-bottom: 2rem; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
.card { padding: 1.5rem; border: 2px solid #eee; border-radius: 12px; text-decoration: none; color: inherit; }
.card:hover { transform: translateY(-2px); transition: transform 0.15s; }
.card h3 { margin: 0 0 0.5rem; }
.card p { margin: 0; font-size: 0.9rem; color: #555; }
.count { font-size: 0.8rem; color: #888; }
</style>
