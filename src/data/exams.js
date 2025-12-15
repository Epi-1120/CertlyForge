import { cisaExam } from './cisa.js'
import { cismExam } from './cism.js'
export const exams = [cisaExam, cismExam]
export function getExam(id) { return exams.find(e => e.id === id) }
