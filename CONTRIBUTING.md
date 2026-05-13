# Contributing

PRs welcome. Especially: more questions, bug fixes, better mobile layout, IELTS content.

## Adding questions

Questions go in `src/data/<cert>.js`. Each needs:
- id (unique within exam)
- question, options array, correctIndex
- explanation, domain (must match exam domains)

Run `npm test` to check data integrity.

## Running locally

```bash
npm install
cp .env.example .env.local
npm run dev
```
