import { db } from './firebase.js'
import { ref, get, set, push, remove, update } from 'firebase/database'

// SM-2 spaced repetition algorithm
// quality: 0-5 (0 = complete blackout, 5 = perfect recall)
export function sm2(card, quality) {
  let { interval, repetition, easeFactor } = card
  if (quality >= 3) {
    if (repetition === 0) interval = 1
    else if (repetition === 1) interval = 6
    else interval = Math.round(interval * easeFactor)
    repetition += 1
  } else {
    repetition = 0
    interval = 1
  }
  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
  const nextReview = new Date(Date.now() + interval * 24 * 60 * 60 * 1000).toISOString()
  return { interval, repetition, easeFactor, nextReview }
}

export async function getDecks(uid) {
  if (!db) return []
  const snapshot = await get(ref(db, `users/${uid}/decks`))
  if (!snapshot.exists()) return []
  return Object.entries(snapshot.val()).map(([id, val]) => ({ ...val, id }))
}
export async function createDeck(uid, name, description, color) {
  if (!db) throw new Error('db not available')
  const deckRef = push(ref(db, `users/${uid}/decks`))
  const now = new Date().toISOString()
  await set(deckRef, { name, description, color, cardCount: 0, createdAt: now, updatedAt: now })
  return deckRef.key
}
export async function deleteDeck(uid, deckId) { if (!db) return; await remove(ref(db, `users/${uid}/decks/${deckId}`)); await remove(ref(db, `users/${uid}/cards/${deckId}`)) }mexport async function getCards(uid, deckId) {m  if (!db) return []
  const snapshot = await get(ref(db, `users/${uid}/cards/${deckId}`))
  if (!snapshot.exists()) return []
  return Object.entries(snapshot.val()).map(([id, val]) => ({ ...val, id }))
}
export async function addCard(uid, deckId, front, back) {
  if (!db) throw new Error('db not available')
  const cardRef = push(ref(db, `users/${uid}/cards/${deckId}`))
  const now = new Date().toISOString()
  await set(cardRef, { front, back, interval: 0, repetition: 0, easeFactor: 2.5, nextReview: now, createdAt: now })
  const cards = await getCards(uid, deckId)
  await update(ref(db, `users/${uid}/decks/${deckId}`), { cardCount: cards.length, updatedAt: now })
  return cardRef.key
}
export async function deleteCard(uid, deckId, cardId) { if (!db) return; await remove(ref(db, `users/${uid}/cards/${deckId}/${cardId}`)); const cards = await getCards(uid, deckId); await update(ref(db, `users/${uid}/decks/${deckId}`), { cardCount: cards.length, updatedAt: new Date().toISOString() }) }

// filter due cards
// was using setInterval to poll this every 30s but that was dumb
// just compute it when the user opens the deck
export function getDueCards(cards) {
  const now = new Date().toISOString()
  return cards.filter(c => !c.nextReview || c.nextReview <= now)
}
