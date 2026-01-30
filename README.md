# CertlyForge

Free exam prep for IT certifications. I built this while studying for CISA because the paid platforms were too expensive and the free ones had outdated questions.

Covers CISA, CISM, Security+, and CCNA so far.

## Run locally

```bash
git clone https://github.com/Epi-1120/CertlyForge.git
cd CertlyForge
npm install
cp .env.example .env.local
npm run dev
```

Needs a Firebase project with Realtime Database enabled.

## Tech

Vue 3 + Vite + Tailwind + Firebase
