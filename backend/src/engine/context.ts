// ── Conversation context: tracks state across messages ──

import { Language } from './nlp.js';

export class ConversationContext {
  messageCount = 0;
  lastIntent: string | null = null;
  lastTopic: string | null = null;
  language: Language = 'en';
  userFacts = new Map<string, string>(); // facts the user taught us
  userName: string | null = null;

  update(lang: Language, intent: string, topic?: string): void {
    this.messageCount++;
    this.lastIntent = intent;
    this.language = lang;
    if (topic) this.lastTopic = topic;
  }

  addFact(key: string, value: string): void {
    this.userFacts.set(key.toLowerCase(), value);
  }

  getFact(key: string): string | null {
    return this.userFacts.get(key.toLowerCase()) || null;
  }

  reset(): void {
    this.messageCount = 0;
    this.lastIntent = null;
    this.lastTopic = null;
    this.userFacts.clear();
    this.userName = null;
  }
}
