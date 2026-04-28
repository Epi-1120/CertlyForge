import { describe, it, expect, vi } from 'vitest'
vi.mock('./firebase.js', () => ({ db: null }))
import { sm2, getDueCards } from './flashcards.ts'
function makeCard(o = {}) { return { id: 'c1', front: 'Q', back: 'A', interval: 0, repetition: 0, easeFactor: 2.5, nextReview: new Date().toISOString(), ...o } }
describe('sm2', () => {
  it('resets on quality < 3', () => { const r = sm2(makeCard({ interval: 10, repetition: 4 }), 2); expect(r.interval).toBe(1); expect(r.repetition).toBe(0) })
  it('first correct sets interval to 1', () => { expect(sm2(makeCard(), 4).interval).toBe(1) })
  it('second correct sets interval to 6', () => { expect(sm2(makeCard({ repetition: 1, interval: 1 }), 4).interval).toBe(6) })
  it('third+ multiplies by easeFactor', () => { expect(sm2(makeCard({ repetition: 2, interval: 6, easeFactor: 2.5 }), 4).interval).toBe(15) })
  it('easeFactor never below 1.3', () => { expect(sm2(makeCard({ easeFactor: 1.3 }), 0).easeFactor).toBeGreaterThanOrEqual(1.3) })
  it('perfect score increases easeFactor', () => { expect(sm2(makeCard(), 5).easeFactor).toBeGreaterThan(2.5) })
})
describe('getDueCards', () => {
  it('returns past-due cards', () => {
    const past = new Date(Date.now() - 86400000).toISOString()
    const future = new Date(Date.now() + 86400000).toISOString()
    const due = getDueCards([makeCard({ id: 'due', nextReview: past }), makeCard({ id: 'not', nextReview: future })])
    expect(due).toHaveLength(1); expect(due[0].id).toBe('due')
  })
  it('empty when nothing due', () => { expect(getDueCards([makeCard({ nextReview: new Date(Date.now() + 86400000).toISOString() })])).toHaveLength(0) })
})
