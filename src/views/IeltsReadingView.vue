<template>
  <div class="p-8 max-w-4xl mx-auto">
    <router-link to="/" class="text-sm text-gray-500">back</router-link>
    <h1 class="text-2xl font-bold mt-4 mb-6">IELTS Reading</h1>
    <div v-if="!active">
      <div v-for="p in passages" :key="p.id" class="border rounded-lg p-4 mb-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" @click="active = p; ans = []">
        <h3 class="font-semibold">{{ p.title }}</h3>
        <p class="text-sm text-gray-500">{{ p.questions.length }} questions</p>
      </div>
    </div>
    <div v-else>
      <h2 class="text-xl font-semibold mb-4">{{ active.title }}</h2>
      <div class="bg-white dark:bg-gray-800 border rounded-lg p-6 mb-6 text-sm leading-relaxed">{{ active.passage }}</div>
      <div v-if="!done">
        <div v-for="(q, qi) in active.questions" :key="q.id" class="mb-6">
          <p class="font-medium mb-2">{{ qi+1 }}. {{ q.question }}</p>
          <label v-for="(o, oi) in q.options" :key="oi" class="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"><input type="radio" :name="'q'+qi" :value="oi" v-model="ans[qi]"/>{{ o }}</label>
        </div>
        <button @click="done = true" class="px-6 py-2 bg-teal-600 text-white rounded-lg">Check</button>
      </div>
      <div v-else><p class="text-lg font-bold">{{ score }} / {{ active.questions.length }}</p><button @click="active=null;done=false" class="mt-2 px-4 py-2 border rounded-lg">Try Another</button></div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { ieltsReading } from '../data/ielts-reading.js'
const passages = ieltsReading
const active = ref(null)
const ans = ref([])
const done = ref(false)
const score = computed(() => { if (!active.value) return 0; let c=0; active.value.questions.forEach((q,i) => { if(ans.value[i]===q.correctIndex) c++ }); return c })
</script>
