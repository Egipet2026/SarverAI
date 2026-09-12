// ── SarverAI Backend Server ──

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { SarverEngine } from './engine/engine.js';
import { getAllSessions, getSession, createSession, addMessageToSession, deleteSession } from './engine/storage.js';

const app = express();
const PORT = 8000;
const engine = new SarverEngine();

app.use(cors());
app.use(express.json());

// Handle malformed JSON bodies gracefully
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'Invalid JSON body' });
    return;
  }
  _next(err);
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', model: 'SarverAI v1.0', running: true });
});

// List all sessions
app.get('/sessions', (_req, res) => {
  res.json(getAllSessions());
});

// Get a single session with messages
app.get('/sessions/:id', (req, res) => {
  const session = getSession(req.params.id);
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  res.json(session);
});

// Delete a session
app.delete('/sessions/:id', (req, res) => {
  deleteSession(req.params.id);
  res.json({ status: 'deleted' });
});

// Chat endpoint — saves messages to a session
app.post('/chat', (req, res) => {
  const { message, sessionId } = req.body as { message: string; sessionId?: string };

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  // Create or reuse session
  let session = sessionId ? getSession(sessionId) : null;
  if (!session) {
    session = createSession();
  }

  // Save user message
  addMessageToSession(session.id, { role: 'user', content: message, timestamp: new Date().toISOString() });

  // Process with AI engine
  const result = engine.process(message);

  // Save AI response
  const updated = addMessageToSession(session.id, { role: 'ai', content: result.response, timestamp: new Date().toISOString() });

  res.json({
    response: result.response,
    intent: result.intent,
    language: result.language,
    thinkingMs: result.thinkingMs,
    sessionId: session.id,
    sessionTitle: updated?.title || session.title,
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
