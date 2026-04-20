import { describe, it, expect } from 'vitest'
import { countCorrect, calcPercentage, didPass, domainBreakdown } from './scoring.ts'
function q(ci, domain = 'Audit') { return { id: 'q1', question: 'stub', options: ['A','B','C','D'], correctIndex: ci, explanation: '', domain } }
describe('countCorrect', () => {
  it('counts matching answers', () => { expect(countCorrect([q(0), q(2), q(1)], [0, 2, 1])).toBe(3) })
  it('treats null as wrong', () => { expect(countCorrect([q(0)], [null])).toBe(0) })
})
describe('calcPercentage', () => {
  it('rounds to nearest integer', () => { expect(calcPercentage(1, 3)).toBe(33) })
  it('zero total returns zero', () => { expect(calcPercentage(0, 0)).toBe(0) })
})
describe('didPass', () => {
  it('uses 70% for scaled scores', () => { expect(didPass(70, 450)).toBe(true); expect(didPass(69, 450)).toBe(false) })
  it('uses passingScore directly when <= 100', () => { expect(didPass(75, 75)).toBe(true); expect(didPass(74, 75)).toBe(false) })
})
describe('domainBreakdown', () => {
  it('groups by domain', () => {
    const r = domainBreakdown([q(0,'A'), q(1,'A'), q(2,'B')], [0, 0, 2], ['A','B'])
    expect(r[0]).toEqual({ domain: 'A', correct: 1, total: 2, pct: 50 })
  })
  it('skips empty domains', () => { expect(domainBreakdown([q(0,'A')], [0], ['A','B'])).toHaveLength(1) })
})
