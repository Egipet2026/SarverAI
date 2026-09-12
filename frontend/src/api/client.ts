const API_URL = '/api';

export interface ChatResponse {
  response: string;
  intent: string;
  language: string;
  thinkingMs: number;
  sessionId: string;
  sessionTitle: string;
}

export interface SessionMeta {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface SessionFull extends SessionMeta {
  messages: { role: 'user' | 'ai'; content: string; timestamp: string }[];
}

export async function sendMessage(message: string, sessionId?: string): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId }),
  });
  if (!res.ok) throw new Error('Failed to get response');
  return res.json();
}

export async function getSessions(): Promise<SessionMeta[]> {
  const res = await fetch(`${API_URL}/sessions`);
  if (!res.ok) throw new Error('Failed to load sessions');
  return res.json();
}

export async function getSession(id: string): Promise<SessionFull> {
  const res = await fetch(`${API_URL}/sessions/${id}`);
  if (!res.ok) throw new Error('Failed to load session');
  return res.json();
}

export async function deleteSession(id: string): Promise<void> {
  await fetch(`${API_URL}/sessions/${id}`, { method: 'DELETE' });
}
