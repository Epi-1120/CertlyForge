<template>
  <div class="p-8 max-w-3xl mx-auto">
    <router-link to="/" class="text-sm text-gray-500">back</router-link>
    <h1 class="text-2xl font-bold mt-4 mb-6">IELTS Vocabulary</h1>
    <div class="flex gap-2 flex-wrap mb-4">
      <button v-for="t in topics" :key="t" @click="topic=t" :class="['px-3 py-1 rounded-full text-sm border', topic===t?'bg-teal-600 text-white border-teal-600':'border-gray-300']">{{t}}</button>
    </div>
    <div v-for="v in filtered" :key="v.word" class="border rounded-lg p-4 mb-3">
      <div class="flex justify-between"><h3 class="font-semibold text-lg">{{v.word}}</h3><span class="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700">{{v.level}}</span></div>
      <p class="text-gray-600 dark:text-gray-400 mt-1">{{v.meaning}}</p>
      <p class="text-sm text-gray-500 mt-2 italic">"{{v.example}}"</p>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { ieltsVocab } from '../data/ielts-vocab.js'
const topics = ['all', ...new Set(ieltsVocab.map(v => v.topic))]
const topic = ref('all')
const filtered = computed(() => topic.value === 'all' ? ieltsVocab : ieltsVocab.filter(v => v.topic === topic.value))
</script>
