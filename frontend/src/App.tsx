import { useState, useRef, useEffect } from 'react';
import { sendMessage } from './api/client.js';
import ChatMessage from './components/ChatMessage.js';
import TypingIndicator from './components/TypingIndicator.js';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const SUGGESTIONS = [
  'Кой си ти?',
  'Колко е часа?',
  'Колко е 25 * 4 + 10?',
  'Разкажи шега',
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: 'Здравей! 👋 Аз съм **SarverAI** — твоят независим изкуствен интелект. Работя изцяло локално, без външни API-та. С какво мога да помогна?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      const res = await sendMessage(message);
      setMessages((prev) => [...prev, { role: 'ai', content: res.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: '⚠️ Възникна грешка при връзката с двигателя. Опитай отново.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app">
      <header className="header">
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
