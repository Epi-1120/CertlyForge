<template>
  <div class="p-8 max-w-3xl mx-auto">
    <router-link to="/" class="text-sm text-gray-500">back</router-link>
    <h1 class="text-2xl font-bold mt-4 mb-6">Flashcards</h1>
    <div v-if="!reviewing">
      <div v-for="deck in decks" :key="deck.id" class="border rounded-lg p-4 mb-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" @click="startReview(deck)">
        <h3 class="font-semibold">{{ deck.name }}</h3>
        <p class="text-sm text-gray-500">{{ deck.cards.length }} cards</p>
      </div>
    </div>
    <div v-else class="review">
      <div class="border rounded-xl p-8 text-center min-h-[200px] flex items-center justify-center cursor-pointer" @click="flipped = !flipped">
        <p class="text-lg whitespace-pre-line">{{ flipped ? currentCard.back : currentCard.front }}</p>
      </div>
      <p class="text-sm text-gray-400 text-center mt-2">click to flip</p>
      <div class="flex gap-2 justify-center mt-4">
        <button @click="nextCard" class="px-4 py-2 bg-teal-600 text-white rounded-lg">Next</button>
        <button @click="reviewing = false" class="px-4 py-2 border rounded-lg">Done</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const decks = ref([{ id: 'demo', name: 'CISA Key Terms', cards: [
  { front: 'What is CIA triad?', back: 'Confidentiality, Integrity, Availability' },
  { front: 'Defense in depth?', back: 'Multiple layers of security controls' },
  { front: 'Least privilege?', back: 'Minimum access needed for the job' }
]}])
const reviewing = ref(false)
const flipped = ref(false)
const cardIndex = ref(0)
const currentCard = ref({ front: '', back: '' })
function startReview(deck) { reviewing.value = true; flipped.value = false; cardIndex.value = 0; currentCard.value = deck.cards[0] }
function nextCard() { flipped.value = false; const deck = decks.value[0]; cardIndex.value = (cardIndex.value + 1) % deck.cards.length; currentCard.value = deck.cards[cardIndex.value] }
</script>
