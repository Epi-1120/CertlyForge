import { describe, it, expect } from 'vitest'
import { exams } from './exams.js'
describe('exam data integrity', () => {
  it('every question has valid correctIndex', () => {
    for (const exam of exams) { for (const q of exam.questions) { expect(q.correctIndex).toBeGreaterThanOrEqual(0); expect(q.correctIndex).toBeLessThan(q.options.length) } }
  })
  it('every question belongs to a declared domain', () => {
    for (const exam of exams) { for (const q of exam.questions) { expect(exam.domains).toContain(q.domain) } }
  })
  it('no duplicate question ids', () => {
    for (const exam of exams) { const ids = exam.questions.map(q => q.id); expect(ids.length).toBe(new Set(ids).size) }
  })
})
