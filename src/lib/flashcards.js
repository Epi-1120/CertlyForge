import { db } from './firebase.js'
import { ref, get, set, push, remove, update } from 'firebase/database'

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

export async function deleteDeck(uid, deckId) {
  if (!db) return
  await remove(ref(db, `users/${uid}/decks/${deckId}`))
  await remove(ref(db, `users/${uid}/cards/${deckId}`))
}

export async function getCards(uid, deckId) {
  if (!db) return []
  const snapshot = await get(ref(db, `users/${uid}/cards/${deckId}`))
  if (!snapshot.exists()) return []
  return Object.entries(snapshot.val()).map(([id, val]) => ({ ...val, id }))
}

export async function addCard(uid, deckId, front, back) {
  if (!db) throw new Error('db not available')
  const cardRef = push(ref(db, `users/${uid}/cards/${deckId}`))
  const now = new Date().toISOString()
  await set(cardRef, { front, back, createdAt: now })
  const cards = await getCards(uid, deckId)
  await update(ref(db, `users/${uid}/decks/${deckId}`), { cardCount: cards.length, updatedAt: now })
  return cardRef.key
}

export async function deleteCard(uid, deckId, cardId) {
  if (!db) return
  await remove(ref(db, `users/${uid}/cards/${deckId}/${cardId}`))
  const cards = await getCards(uid, deckId)
  await update(ref(db, `users/${uid}/decks/${deckId}`), { cardCount: cards.length, updatedAt: new Date().toISOString() })
}

// just return all cards for now
export function getDueCards(cards) { return cards }
