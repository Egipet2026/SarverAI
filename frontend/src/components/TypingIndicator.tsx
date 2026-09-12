export default function TypingIndicator() {
  return (
    <div className="message message-ai">
      <div className="message-avatar">🧠</div>
      <div className="message-bubble typing">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}
