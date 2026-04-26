import { useState, useEffect } from 'react';
import API from '../api/axios';
import { formatTimeAgo, formatDateTime } from '../utils/dateUtils';

const typeIcon = (type) => ({ SUCCESS: '✅', WARNING: '⚠️', ERROR: '❌', INFO: 'ℹ️' }[type] || '🔔');
const typeColor = (type) => ({
  SUCCESS: 'var(--success)',
  WARNING: 'var(--warning)',
  ERROR: 'var(--danger)',
  INFO: 'var(--accent)',
}[type] || 'var(--primary-light)');

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    setMarking(true);
    try {
      await API.put('/api/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    } finally {
      setMarking(false);
    }
  };

  const markOneRead = async (id) => {
    try {
      await API.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/api/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const unread = notifications.filter(n => !n.read).length;

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" />
      <p>Loading notifications...</p>
    </div>
  );

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1>🔔 Notifications</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            {unread > 0
              ? <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{unread} unread notification{unread > 1 ? 's' : ''}</span>
              : <span style={{ color: 'var(--success)' }}>✅ All caught up!</span>
            }
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
          <p>No notifications yet.</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: 8 }}>
            Notifications appear when you register for events, contact sellers, or receive updates.
          </p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map(n => (
            <div key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
              <div className="notif-icon-large" style={{ color: typeColor(n.type) }}>
                {typeIcon(n.type)}
              </div>
              <div className="notif-content">
                {n.title && (
                  <div className="notif-title">{n.title}</div>
                )}
                <div className="notif-message">{n.message}</div>
                {/* Real timestamp using formatTimeAgo — never hardcoded */}
                <div className="notif-time" title={formatDateTime(n.createdAt)}>
                  {formatTimeAgo(n.createdAt)}
                </div>
              </div>
              <div className="notif-actions">
                {!n.read && (
                  <button
                    className="notif-action-btn"
                    onClick={() => markOneRead(n.id)}
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
                <button
                  className="notif-action-btn notif-delete-btn"
                  onClick={() => deleteNotification(n.id)}
                  title="Delete"
                >
                  ✕
                </button>
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
