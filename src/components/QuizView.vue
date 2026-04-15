<template>
  <div class="quiz">
    <h2>{{ exam.fullName }}</h2>
    <template v-if="!submitted">
      <p class="progress">Question {{ idx + 1 }} of {{ exam.questions.length }}</p>
      <div class="qcard">
        <p class="qtext">{{ current.question }}</p>
        <div class="options">
          <button v-for="(opt, i) in current.options" :key="i" :class="{ selected: answers[idx] === i }" @click="answers[idx] = i">{{ opt }}</button>
        </div>
      </div>
      <div class="nav">
        <button @click="idx--" :disabled="idx === 0">Back</button>
        <button v-if="idx < exam.questions.length - 1" @click="idx++">Next</button>
        <button v-else @click="submitted = true">Submit</button>
      </div>
    </template>
    <div v-else class="results">
      <h3>{{ correct }} / {{ exam.questions.length }} correct ({{ pct }}%)</h3>
      <div v-for="(q, i) in exam.questions" :key="q.id" class="review" :class="{ right: answers[i] === q.correctIndex, wrong: answers[i] !== q.correctIndex }">
        <p><strong>{{ i+1 }}.</strong> {{ q.question }}</p>
        <p v-if="answers[i] !== q.correctIndex" class="expl">{{ q.explanation }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
const props = defineProps({ exam: Object })
const idx = ref(0)
const answers = ref({})
const submitted = ref(false)
watch(() => props.exam.id, () => { idx.value = 0; answers.value = {}; submitted.value = false })
const current = computed(() => props.exam.questions[idx.value])
const correct = computed(() => { let c = 0; props.exam.questions.forEach((q, i) => { if (answers.value[i] === q.correctIndex) c++ }); return c })
const pct = computed(() => Math.round(correct.value / props.exam.questions.length * 100))
</script>
<style scoped>
.quiz { max-width: 700px; margin: 0 auto; }
.progress { color: #666; font-size: 0.9rem; }
.qcard { background: #f9f9f9; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; }
.qtext { font-size: 1.1rem; margin-bottom: 1rem; }
.options { display: flex; flex-direction: column; gap: 0.5rem; }
.options button { text-align: left; padding: 0.75rem 1rem; border: 1px solid #ddd; border-radius: 6px; background: white; cursor: pointer; }
.options button.selected { border-color: #0D9488; background: #f0fdfa; }
.nav { display: flex; gap: 0.5rem; margin-top: 1rem; }
.nav button { padding: 0.5rem 1.5rem; border-radius: 6px; border: 1px solid #ccc; cursor: pointer; }
.nav button:disabled { opacity: 0.4; }
.results { margin-top: 1rem; }
.review { padding: 0.75rem; margin: 0.5rem 0; border-left: 3px solid #ccc; border-radius: 4px; }
.review.right { border-left-color: #10b981; background: #f0fdf4; }
.review.wrong { border-left-color: #ef4444; background: #fef2f2; }
.expl { color: #666; font-size: 0.85rem; font-style: italic; }
</style>


