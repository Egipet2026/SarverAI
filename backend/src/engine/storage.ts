// ── File-based session storage for chat history ──

import fs from 'fs';
import path from 'path';

interface StoredMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export interface StoredSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: StoredMessage[];
}

export type SessionMeta = Omit<StoredSession, 'messages'> & { messageCount: number };

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'sessions.json');

function ensureStorage(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');
}

function readAll(): StoredSession[] {
  ensureStorage();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeAll(sessions: StoredSession[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(sessions, null, 2));
}

export function getAllSessions(): SessionMeta[] {
  return readAll().map(({ messages, ...meta }) => ({ ...meta, messageCount: messages.length }));
}

export function getSession(id: string): StoredSession | null {
  return readAll().find((s) => s.id === id) || null;
}

export function createSession(): StoredSession {
  const id = Date.now().toString();
  const now = new Date().toISOString();
  const session: StoredSession = { id, title: 'Нов разговор', createdAt: now, updatedAt: now, messages: [] };
  const sessions = readAll();
  sessions.unshift(session);
  writeAll(sessions);
  return session;
}

export function addMessageToSession(id: string, message: StoredMessage): StoredSession | null {
  const sessions = readAll();
  const session = sessions.find((s) => s.id === id);
  if (!session) return null;
  session.messages.push(message);
  session.updatedAt = new Date().toISOString();
  if (session.title === 'Нов разговор' && message.role === 'user') {
    session.title = message.content.substring(0, 40) || 'Нов разговор';
  }
  writeAll(sessions);
  return session;
}

export function deleteSession(id: string): void {
  writeAll(readAll().filter((s) => s.id !== id));
}
