// ── SarverAI Backend Server ──

import express from 'express';
import cors from 'cors';
import { SarverEngine } from './engine/engine.js';

const app = express();
const PORT = 8000;
const engine = new SarverEngine();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', model: 'SarverAI v1.0', running: true });
});

// Chat endpoint
app.post('/chat', (req, res) => {
  const { message, history } = req.body as { message: string; history?: unknown[] };

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  const result = engine.process(message);

  res.json({
    response: result.response,
    intent: result.intent,
    language: result.language,
    thinkingMs: result.thinkingMs,
  });
});

// Reset conversation
app.post('/reset', (_req, res) => {
  engine.reset();
  res.json({ status: 'reset' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SarverAI engine running on port ${PORT}`);
});
