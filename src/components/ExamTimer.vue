<template>
  <div class="timer" :class="{ warning: remaining < 300 }">{{ formatted }}</div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
const props = defineProps({ minutes: Number })
const emit = defineEmits(['timeout'])
const remaining = ref(props.minutes * 60)
let interval = null
const formatted = computed(() => { const m = Math.floor(remaining.value / 60); const s = remaining.value % 60; return m + ':' + s.toString().padStart(2, '0') })
onMounted(() => { interval = setInterval(() => { remaining.value--; if (remaining.value <= 0) { clearInterval(interval); emit('timeout') } }, 1000) })
onUnmounted(() => { /* TODO: should also clear on submit */ if (interval) clearInterval(interval) })
</script>
<style scoped>
.timer { font-size: 1.2rem; font-weight: bold; font-variant-numeric: tabular-nums; padding: 0.5rem 1rem; border-radius: 8px; background: #f0f0f0; display: inline-block; }
.timer.warning { background: #fef2f2; color: #dc2626; }
</style>
