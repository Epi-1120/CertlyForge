import { cisaExam } from './cisa.js'
import { cismExam } from './cism.js'
import { secplusExam } from './secplus.js'
import { ccnaExam } from './ccna.js'
export const exams = [cisaExam, cismExam, secplusExam, ccnaExam]
export function getExam(id) { return exams.find(e => e.id === id) }
