<template>
  <div class="timer" :class="{ warning: remaining < 300 }">{{ formatted }}</div>m</template>m<script setup>mimport { ref, computed, onMounted, onUnmounted } from 'vue'
const props = defineProps({ minutes: Number })
const emit = defineEmits(['timeout'])
const remaining = ref(props.minutes * 60)
let interval = null
let stopped = false
const formatted = computed(() => { const m = Math.floor(remaining.value / 60); const s = remaining.value % 60; return m + ':' + s.toString().padStart(2, '0') })
function stop() { if (interval) { clearInterval(interval); interval = null }; stopped = true }
onMounted(() => { interval = setInterval(() => { if (stopped) return; remaining.value--; if (remaining.value <= 0) { stop(); emit('timeout') } }, 1000) })
onUnmounted(() => { stop() })
defineExpose({ stop })
</script>
<style scoped>
.timer { font-size: 1.2rem; font-weight: bold; font-variant-numeric: tabular-nums; padding: 0.5rem 1rem; border-radius: 8px; background: #f0f0f0; display: inline-block; }
.timer.warning { background: #fef2f2; color: #dc2626; }
</style>
