# Nexora

Nexora is a privacy-first AI memory app: "Your second brain. Fully yours."

This build follows the master plan in `Nexora_Master_Plan.pdf` and keeps the first implementation focused on free, local, offline-friendly processing before paid cloud AI.

## Built in this repo

- Expo SDK 56 app with Expo Router and native tabs.
- Memory home screen with sample captures, category filtering, private-mode status, and local analysis results.
- AI Architecture screen showing the free on-device path, premium cloud path, free tool stack, feature gates, and 26-week build roadmap.
- Core architecture data and a deterministic offline analyzer in `src/core/ai/nexora-ai-architecture.ts`.
- Route files kept thin under `src/app`, with feature screens under `src/features`.

## AI architecture

Free on-device AI is the default path:

- Screenshot analysis
- OCR-ready extraction flow
- Image/object recognition adapter slots
- Duplicate detection plan
- Receipt scanning plan
- Automatic reminder plan
- Smart organization
- Local memory search plan

Premium cloud AI remains gated for:

- AI conversations with memories
- Deep document understanding
- Multi-file reasoning
- Study assistant generation
- Code generation
- Cross-device intelligence

## Run

```bash
npm install
npm run web
```

For native testing, start with Expo Go:

```bash
npm run start
```
