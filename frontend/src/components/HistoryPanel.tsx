interface HistoryPanelProps {
  sessions: { id: string; title: string; createdAt: string; messageCount: number; updatedAt: string }[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onLoadSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onClose: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = diff / 3600000;
  if (hours < 1) return 'наскоро';
  if (hours < 24) return `преди ${Math.floor(hours)} ч`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'вчера';
  if (days < 7) return `преди ${days} дни`;
  return d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'short' });
}

export default function HistoryPanel({
  sessions, activeSessionId, onNewChat, onLoadSession, onDeleteSession, onClose,
}: HistoryPanelProps) {
  return (
    <>
      <div className="history-overlay" onClick={onClose} />
      <div className="history-panel">
        <div className="history-header">
          <h2>История</h2>
          <button className="history-close" onClick={onClose} aria-label="Затвори">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <button className="new-chat-btn" onClick={onNewChat}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Нов разговор
        </button>
        <div className="history-list">
          {sessions.length === 0 ? (
            <p className="history-empty">Няма запазени разговори</p>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                className={`history-item ${s.id === activeSessionId ? 'active' : ''}`}
                onClick={() => onLoadSession(s.id)}
              >
                <div className="history-item-icon">💬</div>
                <div className="history-item-content">
                  <span className="history-item-title">{s.title}</span>
                  <span className="history-item-meta">{formatDate(s.updatedAt)} · {s.messageCount} съобщ.</span>
                </div>
                <button
                  className="history-item-delete"
                  onClick={(e) => { e.stopPropagation(); onDeleteSession(s.id); }}
                  aria-label="Изтрий"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
