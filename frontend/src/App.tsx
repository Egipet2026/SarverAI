import { useState, useRef, useEffect, useCallback } from 'react';
import { sendMessage, getSessions, getSession, deleteSession, type SessionMeta } from './api/client.js';
import ChatMessage from './components/ChatMessage.js';
import TypingIndicator from './components/TypingIndicator.js';
import HistoryPanel from './components/HistoryPanel.js';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const WELCOME_MESSAGE = 'Здравей! 👋 Аз съм **SarverAI** — твоят независим изкуствен интелект. Работя изцяло локално, без външни API-та. С какво мога да помогна?';

const SUGGESTIONS = [
  'Кой си ти?',
  'Колко е часа?',
  'Колко е 25 * 4 + 10?',
  'Разкажи шега',
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([{ role: 'ai', content: WELCOME_MESSAGE }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionMeta[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const refreshSessions = useCallback(async () => {
    try {
      setSessions(await getSessions());
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || isTyping) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setIsTyping(true);

    try {
      const res = await sendMessage(message, sessionId ?? undefined);
      setSessionId(res.sessionId);
      setMessages((prev) => [...prev, { role: 'ai', content: res.response }]);
      refreshSessions();
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: '⚠️ Възникна грешка при връзката с двигателя. Опитай отново.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const startNewChat = () => {
    setMessages([{ role: 'ai', content: WELCOME_MESSAGE }]);
    setSessionId(null);
    setShowHistory(false);
  };

  const loadSession = async (id: string) => {
    try {
      const session = await getSession(id);
      setSessionId(id);
      setMessages(session.messages.map((m) => ({ role: m.role, content: m.content })));
      setShowHistory(false);
    } catch { /* ignore */ }
  };

  const handleDeleteSession = async (id: string) => {
    await deleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (id === sessionId) startNewChat();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app">
      {showHistory && (
        <HistoryPanel
          sessions={sessions}
          activeSessionId={sessionId}
          onNewChat={startNewChat}
          onLoadSession={loadSession}
          onDeleteSession={handleDeleteSession}
          onClose={() => setShowHistory(false)}
        />
      )}

      <header className="header">
        <button className="menu-btn" onClick={() => setShowHistory(true)} aria-label="История">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="header-logo">
          <span className="header-icon">🧠</span>
          <div className="header-text">
            <h1>SarverAI</h1>
            <span className="header-subtitle">Независим AI · Без външни API</span>
          </div>
        </div>
        <div className="header-status">
          <span className="status-dot" />
          <span className="status-text">Online</span>
        </div>
      </header>

      <div className="chat-container" ref={scrollRef}>
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {messages.length <= 1 && (
        <div className="suggestions">
          {SUGGESTIONS.map((s) => (
            <button key={s} className="suggestion-chip" onClick={() => handleSend(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <footer className="input-bar">
        <input
          className="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Напиши съобщение на български или английски…"
          disabled={isTyping}
        />
        <button
          className="send-btn"
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          aria-label="Изпрати"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </footer>
    </div>
  );
}
