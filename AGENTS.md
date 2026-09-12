# SarverAI — Independent AI Model

A self-contained AI chat application with no external API dependencies. All inference runs locally on the server.

## Architecture
- **Frontend**: Vite + React + TypeScript (port 5173 → mapped to host 3000)
- **Backend**: Express + TypeScript with `tsx watch` (port 8000)
- **AI Engine**: Custom NLP engine in `backend/src/engine/` — intent detection, knowledge base, math parser, conversation context, bilingual (BG/EN)

## Dev commands
- Start: `docker compose -f docker-compose.base44.yml up -d`
- Logs: `docker compose -f docker-compose.base44.yml logs -f`
- Health: `curl http://localhost:8000/health`

## Key design decisions
- Frontend proxies `/api` → `http://backend:8000` via Vite proxy (single origin, no CORS issues)
- No external secrets or credentials needed — everything runs locally
- The AI engine uses: pattern matching, Levenshtein similarity, recursive-descent math parser, bilingual knowledge base
- Live reload: both frontend (Vite HMR) and backend (tsx watch) auto-reload on file changes

## Engine structure (`backend/src/engine/`)
- `nlp.ts` — language detection, tokenization, text similarity, number/expression extraction
- `intents.ts` — intent classification (greeting, math, time, joke, knowledge, etc.)
- `knowledge.ts` — bilingual knowledge base with keyword matching
- `mathParser.ts` — safe recursive-descent math evaluator (no eval)
- `jokes.ts` — bilingual joke collection
- `context.ts` — conversation state tracking
- `engine.ts` — main orchestrator combining all modules
