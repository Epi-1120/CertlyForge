# CertlyForge

Free exam prep for IT certifications and IELTS.

I started this while studying for CISA in late 2025. The paid platforms were charging HKD 2000+ for question banks, and the free ones had outdated or wrong answers. So I wrote my own questions from public study materials and built a simple quiz app around them.

It grew from there - friends asked for CISM and Security+ too, and someone suggested adding IELTS since a lot of people in HK need both IT certs and English scores for immigration.

No paywall, no ads, no tracking. Just practice questions.

---

我開始做呢個係因為考 CISA 嗰陣啲 paid platform 太貴，免費嘅又好多錯答案。所以自己寫題目、自己起個 app。之後朋友話想要 CISM 同 Security+，又有人建議加 IELTS。

冇收費、冇廣告。純粹幫人溫書。

---

## Features

- Practice questions by domain (CISA 30, CISM 40, Security+ 30, CCNA 30)
- Timed mock exams with score breakdown
- Flashcards with SM-2 spaced repetition
- IELTS reading + vocabulary drills
- Community forum
- Dark mode

## Run locally

```bash
git clone https://github.com/Epi-1120/CertlyForge.git
cd CertlyForge
npm install
cp .env.example .env.local   # fill in Firebase creds
npm run dev
```

Needs a Firebase project with Auth + Realtime Database.

## Tech

Vue 3 + Vite + Tailwind + Firebase Realtime DB

Started in plain JS, gradually converting to TypeScript.

## Known issues

- Community feed has no pagination - gets slow past ~200 posts
- Mock exam timer resets on page refresh
- IELTS only has reading and vocab so far
- No offline support
- Mobile layout is okay but not great on very small screens

## Ethics

Questions are self-authored from public study materials and official exam objectives. Not from any confidential exam pool.

## License

CC BY-NC 4.0. Free for personal and educational use.mm---

Not affiliated with ISACA, CompTIA, Cisco, or British Council.
