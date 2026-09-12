interface ChatMessageProps {
  role: 'user' | 'ai';
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`message ${isUser ? 'message-user' : 'message-ai'}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '🧠'}
      </div>
      <div className="message-bubble">
        {content.split('\n').map((line, i) => (
          <p key={i} className="message-line" dangerouslySetInnerHTML={{
            __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          }} />
        ))}
      </div>
    </div>
  );
}
