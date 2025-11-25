export function countCorrect(questions, selected) {
  let c = 0
  for (let i = 0; i < questions.length; i++) {
    if (selected[i] === questions[i].correctIndex) c++
  }
  return c
}

export function calcPercentage(correct, total) {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

export function didPass(pct, passingScore) {
  if (passingScore > 100) return pct >= 70
  return pct >= passingScore
}

export function domainBreakdown(questions, selected, domains) {
  return domains
    .map(d => {
      const indices = []
      questions.forEach((q, i) => { if (q.domain === d) indices.push(i) })
      const total = indices.length
      if (total === 0) return null
      const correct = indices.filter(i => selected[i] === questions[i].correctIndex).length
      return { domain: d, correct, total, pct: Math.round((correct / total) * 100) }
    })
    .filter(Boolean)
}
