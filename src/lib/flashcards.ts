import { db } from './firebase.js'
import { ref, get, set, push, remove, update } from 'firebase/database'

export interface Flashcard { id: string; front: string; back: string; interval: number; repetition: number; easeFactor: number; nextReview: string; createdAt: string }
export interface FlashcardDeck { id: string; name: string; description: string; color: string; cardCount: number; createdAt: string; updatedAt: string }

// SM-2 algorithm
// quality: 0-5 (0 = complete blackout, 5 = perfect)
export function sm2(card: Flashcard, quality: number): Partial<Flashcard> {
  let { interval, repetition, easeFactor } = card
  if (quality >= 3) { if (repetition === 0) interval = 1; else if (repetition === 1) interval = 6; else interval = Math.round(interval * easeFactor); repetition += 1 }
  else { repetition = 0; interval = 1 }
  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
  if (isNaN(easeFactor)) easeFactor = 2.5
  return { interval, repetition, easeFactor, nextReview: new Date(Date.now() + interval * 86400000).toISOString() }
}

export async function getDecks(uid: string): Promise<FlashcardDeck[]> { if (!db) return []; const s = await get(ref(db, `users/${uid}/decks`)); if (!s.exists()) return []; return Object.entries(s.val()).map(([id, v]) => ({...(v as any), id})) }
export async function createDeck(uid: string, name: string, desc: string, color: string) { if (!db) throw new Error('db not available'); const r = push(ref(db, `users/${uid}/decks`)); const now = new Date().toISOString(); await set(r, {name, description: desc, color, cardCount: 0, createdAt: now, updatedAt: now}); return r.key! }
export async function deleteDeck(uid: string, deckId: string) { if (!db) return; await remove(ref(db, `users/${uid}/decks/${deckId}`)); await remove(ref(db, `users/${uid}/cards/${deckId}`)) }
export async function getCards(uid: string, deckId: string): Promise<Flashcard[]> { if (!db) return []; const s = await get(ref(db, `users/${uid}/cards/${deckId}`)); if (!s.exists()) return []; return Object.entries(s.val()).map(([id, v]) => ({...(v as any), id})) }
export async function addCard(uid: string, deckId: string, front: string, back: string) { if (!db) throw new Error('db not available'); const r = push(ref(db, `users/${uid}/cards/${deckId}`)); const now = new Date().toISOString(); await set(r, {front, back, interval:0, repetition:0, easeFactor:2.5, nextReview:now, createdAt:now}); const cards = await getCards(uid, deckId); await update(ref(db, `users/${uid}/decks/${deckId}`), {cardCount: cards.length, updatedAt: now}); return r.key! }
export async function deleteCard(uid: string, deckId: string, cardId: string) { if (!db) return; await remove(ref(db, `users/${uid}/cards/${deckId}/${cardId}`)); const cards = await getCards(uid, deckId); await update(ref(db, `users/${uid}/decks/${deckId}`), {cardCount: cards.length, updatedAt: new Date().toISOString()}) }

// filter due cards
// was using setInterval to poll this every 30s but that was dumb
// just compute it when the user opens the deck
export function getDueCards(cards: Flashcard[]): Flashcard[] { const now = new Date().toISOString(); return cards.filter(c => !c.nextReview || c.nextReview <= now) }
