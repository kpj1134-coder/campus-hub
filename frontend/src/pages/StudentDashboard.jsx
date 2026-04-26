import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { formatTimeAgo } from '../utils/dateUtils';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, saved: 0, regs: 0, requests: 0, unread: 0 });
  const [regs, setRegs] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pRes, wRes, rRes, crRes, nRes] = await Promise.all([
          API.get('/api/products/mine').catch(() => ({ data: [] })),
          API.get('/api/wishlist/my').catch(() => ({ data: [] })),
          API.get('/api/events/my-registrations').catch(() => ({ data: [] })),
          API.get('/api/contact-requests/buyer').catch(() => ({ data: [] })),
          API.get('/api/notifications').catch(() => ({ data: [] })),
        ]);
        const notifs = nRes.data || [];
        setStats({
          products: pRes.data.length,
          saved: wRes.data.length,
          regs: rRes.data.length,
          requests: crRes.data.length,
          unread: notifs.filter(n => !n.read).length,
        });
        setRegs(rRes.data.slice(0, 3));
        setRequests(crRes.data.slice(0, 3));
        setNotifications(notifs.slice(0, 5));
        setProducts(pRes.data.slice(0, 4));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const regStatusIcon = s => ({ PENDING: '⏳', APPROVED: '✅', REJECTED: '❌', CANCELLED: '🚫' }[s] || '🎟️');
  const reqStatusIcon = s => ({ PENDING: '⏳', ACCEPTED: '✅', REJECTED: '❌', RESPONDED: '💬' }[s] || '📬');
  const notifIcon = t => ({ SUCCESS: '✅', INFO: '📬', WARNING: '⚠️', ERROR: '❌' }[t] || '🔔');

  if (loading) return <div className="loading-screen"><div className="spinner" /><p>Loading your dashboard...</p></div>;

  return (
    <div>
      {/* Welcome */}
      <div className="dashboard-welcome">
        <div>
          <h1>👋 Welcome back, <span className="welcome-name">{user?.name?.split(' ')[0]}</span>!</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            <span className="badge badge-student">🎓 Student</span>&nbsp;· Your Campus Hub overview
          </p>
        </div>
        <Link to="/profile" className="btn-secondary">👤 Profile</Link>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid" style={{ marginBottom: 32 }}>
        {[
          { icon: '📦', value: stats.products, label: 'My Listings',  color: '#7c3aed', link: '/marketplace' },
          { icon: '❤️', value: stats.saved,    label: 'Saved Items',  color: '#db2777', link: '/saved-products' },
          { icon: '🎟️', value: stats.regs,     label: 'Registrations', color: '#059669', link: '/my-registered-events' },
          { icon: '📬', value: stats.requests, label: 'Requests Sent', color: '#2563eb', link: '/contact-requests' },
          { icon: '🔔', value: stats.unread,   label: 'Unread Alerts', color: '#f59e0b', link: '/notifications', highlight: stats.unread > 0 },
        ].map((s, i) => (
          <Link to={s.link} key={i} style={{ textDecoration: 'none' }}>
            <div className={`stat-card ${s.highlight ? 'stat-card-highlight' : ''}`}>
              <div className="stat-icon" style={{ color: s.color }}>{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two-Column */}
      <div className="dashboard-two-col">
        {/* Left */}
        <div>
          {/* My Registrations */}
          <div className="dashboard-section">
            <div className="section-header-row">
              <h2>🎟️ My Event Registrations</h2>
              <Link to="/my-registered-events" className="see-all-link">See all →</Link>
            </div>
            {regs.length === 0 ? (
              <div className="empty-state small">
                <div className="empty-icon">🎪</div>
                <p>Not registered for any event yet. <Link to="/events" style={{ color: 'var(--primary-light)' }}>Browse →</Link></p>
              </div>
            ) : regs.map(r => (
              <div className="list-item" key={r.id}>
                <div className="list-item-info">
                  <div className="list-item-title">🎉 {r.eventTitle}</div>
                  <div className="list-item-sub">{r.eventDate} {r.eventTime && `· ${r.eventTime}`}</div>
                  <div className="list-item-time">{formatTimeAgo(r.registeredAt)}</div>
                </div>
                <span className="status-pill" style={{ background: 'transparent' }}>
                  {regStatusIcon(r.status)} {r.status}
                </span>
              </div>
            ))}
          </div>

          {/* My Contact Requests */}
          <div className="dashboard-section">
            <div className="section-header-row">
              <h2>📬 My Contact Requests</h2>
              <Link to="/contact-requests" className="see-all-link">See all →</Link>
            </div>
            {requests.length === 0 ? (
              <div className="empty-state small">
                <div className="empty-icon">📭</div>
                <p>No requests sent. <Link to="/marketplace" style={{ color: 'var(--primary-light)' }}>Browse marketplace →</Link></p>
              </div>
            ) : requests.map(r => (
              <div className="list-item" key={r.id}>
                <div className="list-item-info">
                  <div className="list-item-title">📦 {r.productTitle}</div>
                  <div className="list-item-sub">Seller: {r.sellerName}</div>
                  <div className="list-item-time">{formatTimeAgo(r.createdAt)}</div>
                </div>
                <span style={{ fontSize: '0.8rem' }}>{reqStatusIcon(r.status)} {r.status}</span>
              </div>
            ))}
          </div>

          {/* My Products */}
          {products.length > 0 && (
            <div className="dashboard-section">
              <div className="section-header-row">
                <h2>📦 My Listed Products</h2>
                <Link to="/marketplace" className="see-all-link">Manage →</Link>
              </div>
              {products.map(p => (
                <div className="list-item" key={p.id}>
                  <div className="list-item-info">
                    <div className="list-item-title">{p.title}</div>
                    <div className="list-item-sub">₹{p.price?.toLocaleString()} · {p.category}</div>
                  </div>
                  <span className={`status-pill ${(p.status || 'available').toLowerCase()}`}>
                    {p.status || 'AVAILABLE'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right */}
        <div>
          {/* Notifications */}
          <div className="dashboard-section">
            <div className="section-header-row">
              <h2>🔔 Recent Notifications</h2>
              <Link to="/notifications" className="see-all-link">See all →</Link>
            </div>
            {notifications.length === 0 ? (
              <div className="empty-state small"><div className="empty-icon">🔕</div><p>No notifications yet</p></div>
            ) : notifications.map(n => (
              <div className={`notif-item ${n.read ? 'read' : 'unread'}`} key={n.id}>
                <span className="notif-icon">{notifIcon(n.type)}</span>
                <div style={{ flex: 1 }}>
                  {n.title && <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{n.title}</div>}
                  <span className="notif-msg">{n.message}</span>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)', marginTop: 3 }}>{formatTimeAgo(n.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <div className="section-header-row"><h2>⚡ Quick Actions</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { to: '/marketplace', icon: '🛒', label: 'Marketplace', cls: 'btn-primary' },
                { to: '/events', icon: '🎉', label: 'Events', cls: 'btn-secondary' },
                { to: '/saved-products', icon: '❤️', label: 'Saved', cls: 'btn-secondary' },
                { to: '/contact-requests', icon: '📬', label: 'Requests', cls: 'btn-secondary' },
                { to: '/my-registered-events', icon: '🎟️', label: 'My Events', cls: 'btn-secondary' },
                { to: '/chatbot', icon: '🤖', label: 'AI Help', cls: 'btn-secondary' },
                { to: '/notifications', icon: '🔔', label: 'Alerts', cls: 'btn-secondary' },
                { to: '/profile', icon: '👤', label: 'Profile', cls: 'btn-secondary' },
              ].map(a => (
                <Link key={a.to} to={a.to} className={a.cls} style={{ justifyContent: 'center', padding: '10px', fontSize: '0.82rem' }}>
                  {a.icon} {a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
