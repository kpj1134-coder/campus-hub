import { useState, useRef, useEffect } from 'react';
import API from '../api/axios';

const WELCOME = { role: 'bot', text: "👋 Hi! I'm the **Campus Hub AI Assistant**. Ask me anything about the marketplace, events, or your account!\n\nType **'help'** to see what I can do." };

const Chatbot = () => {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const res = await API.post('/api/chatbot/message', { message: text });
      setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: '❌ Sorry, I could not connect. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const renderText = (text) => {
    // Bold **text**
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        <br />
      </span>
    ));
  };

  const quickReplies = ['help', 'events', 'products', 'sell something', 'login', 'dashboard'];

  return (
    <div className="chatbot-page">
      <div className="page-header">
        <h1>🤖 AI Campus Assistant</h1>
        <p style={{ color: 'var(--text-muted)' }}>Ask me anything about Campus Hub</p>
      </div>

      {/* Quick replies */}
      <div className="filter-row" style={{ marginBottom: 12 }}>
        {quickReplies.map(q => (
          <button key={q} className="filter-btn" onClick={() => { setInput(q); }}>
            {q}
          </button>
        ))}
      </div>

      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            <div className="chat-avatar">
              {msg.role === 'bot' ? '🤖' : '👤'}
            </div>
            <div className="chat-bubble">
              {renderText(msg.text)}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message bot">
            <div className="chat-avatar">🤖</div>
            <div className="chat-bubble">
              <div className="chat-typing">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your message… (Enter to send)"
          disabled={loading}
        />
        <button className="btn-primary" onClick={sendMessage} disabled={loading || !input.trim()}>
          Send ➤
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
