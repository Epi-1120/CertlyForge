export interface ExamQuestion { id: string; question: string; options: string[]; correctIndex: number; explanation: string; domain: string }

export function countCorrect(questions: ExamQuestion[], selected: (number|null)[]): number {
  let c = 0; for (let i = 0; i < questions.length; i++) { if (selected[i] === questions[i].correctIndex) c++ }; return c
}
export function calcPercentage(correct: number, total: number): number { if (total === 0) return 0; return Math.round((correct / total) * 100) }
export function calcGrade(pct: number): string { if (pct >= 90) return 'A+'; if (pct >= 80) return 'A'; if (pct >= 70) return 'B'; if (pct >= 60) return 'C'; if (pct >= 50) return 'D'; return 'F' }
export function didPass(pct: number, passingScore: number): boolean { if (passingScore > 100) return pct >= 70; return pct >= passingScore }
export function domainBreakdown(questions: ExamQuestion[], selected: (number|null)[], domains: string[]) {
  return domains.map(d => { const idx: number[] = []; questions.forEach((q,i) => { if(q.domain===d) idx.push(i) }); const total = idx.length; if(!total) return null; const correct = idx.filter(i => selected[i]===questions[i].correctIndex).length; return { domain: d, correct, total, pct: Math.round((correct/total)*100) } }).filter(Boolean) as { domain: string; correct: number; total: number; pct: number }[]
}
