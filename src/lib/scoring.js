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

// some certs use scaled scores (CISA 450/900) so we normalize to 70%
export function didPass(pct, passingScore) {
  if (passingScore > 100) return pct >= 70
  return pct >= passingScore
}
