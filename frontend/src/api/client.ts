const API_URL = '/api';

export interface ChatResponse {
  response: string;
  intent: string;
  language: string;
  thinkingMs: number;
}

export async function sendMessage(message: string): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error('Failed to get response');
  return res.json();
}
