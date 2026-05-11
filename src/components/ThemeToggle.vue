<template><button @click="toggle" class="theme-btn" aria-label="Toggle dark mode">{{ isDark ? '☀️' : '🌙' }}</button></template>
<script setup>
import { ref, onMounted } from 'vue'
const isDark = ref(false)
onMounted(() => { const saved = localStorage.getItem('theme'); if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) { document.documentElement.classList.add('dark'); isDark.value = true } })
function toggle() { isDark.value = !isDark.value; document.documentElement.classList.toggle('dark', isDark.value); localStorage.setItem('theme', isDark.value ? 'dark' : 'light') }m</script>m<style scoped>.theme-btn { position: fixed; top: 1rem; right: 1rem; background: none; border: 1px solid #ddd; border-radius: 8px; padding: 0.5rem; cursor: pointer; font-size: 1.2rem; }</style>

