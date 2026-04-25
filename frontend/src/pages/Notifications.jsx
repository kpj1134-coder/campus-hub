import { useState, useEffect } from 'react';
import API from '../api/axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    setMarking(true);
    try {
      await API.put('/api/notifications/mark-read');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    } finally {
      setMarking(false);
    }
  };

  const typeIcon = (type) => {
    if (type === 'SUCCESS') return '✅';
    if (type === 'WARNING') return '⚠️';
    return 'ℹ️';
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
      });
    } catch { return dateStr; }
  };

  const unread = notifications.filter(n => !n.read).length;

  if (loading) return <div className="loading-screen"><div className="spinner" /><p>Loading notifications...</p></div>;

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1>🔔 Notifications</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            {unread > 0 ? <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{unread} unread</span> : 'All caught up!'}
          </p>
        </div>
        {unread > 0 && (
          <button className="btn-secondary" onClick={markAllRead} disabled={marking}>
            {marking ? '⏳ Marking...' : '✔️ Mark All Read'}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔕</div>
          <p>No notifications yet. Register for an event to get notified!</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map(n => (
            <div key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
              <div className="notif-icon">{typeIcon(n.type)}</div>
              <div className="notif-content">
                <div className="notif-message">{n.message}</div>
                <div className="notif-time">{formatTime(n.createdAt)}</div>
              </div>
              {!n.read && <div className="notif-badge" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
