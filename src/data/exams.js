import { cisaExam } from './cisa.js'
import { cismExam } from './cism.js'
import { secplusExam } from './secplus.js'
export const exams = [cisaExam, cismExam, secplusExam]
export function getExam(id) { return exams.find(e => e.id === id) }
