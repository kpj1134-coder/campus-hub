import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { formatTimeAgo, formatDateTime } from '../utils/dateUtils';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0, myProducts: 0, totalCampusEvents: 0,
    totalExternalEvents: 0, myRegistrations: 0, myContactRequests: 0,
    unreadNotifications: 0,
  });
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [myContactRequests, setMyContactRequests] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [myProductsList, setMyProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pRes, myPRes, eRes, extRes, rRes, crRes, nRes] = await Promise.all([
          API.get('/api/products'),
          API.get('/api/products/mine').catch(() => ({ data: [] })),
          API.get('/api/events'),
          API.get('/api/external-events'),
          API.get('/api/events/my-registrations'),
          API.get('/api/contact-requests/my'),
          API.get('/api/notifications'),
        ]);

        const notifications = nRes.data || [];
        const unread = notifications.filter(n => !n.read).length;

        setStats({
          totalProducts: pRes.data.length,
          myProducts: myPRes.data.length,
          totalCampusEvents: eRes.data.length,
          totalExternalEvents: extRes.data.length,
          myRegistrations: rRes.data.length,
          myContactRequests: crRes.data.length,
          unreadNotifications: unread,
        });
        setMyRegistrations(rRes.data.slice(0, 3));
        setMyContactRequests(crRes.data.slice(0, 3));
        setRecentNotifications(notifications.slice(0, 5));
        setMyProductsList(myPRes.data.slice(0, 4));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const notifIcon = (type) => ({ SUCCESS: '✅', INFO: '📬', WARNING: '⚠️', ERROR: '❌' }[type] || '🔔');
  const notifColor = (type) => ({
    SUCCESS: 'var(--success)', INFO: 'var(--accent)',
    WARNING: 'var(--warning)', ERROR: 'var(--danger)',
  }[type] || 'var(--primary-light)');

  if (loading) return <div className="loading-screen"><div className="spinner" /><p>Loading dashboard...</p></div>;

  const isAdmin = user?.role === 'admin';

  return (
    <div>
      {/* Welcome Header */}
      <div className="dashboard-welcome">
        <div>
          <h1>
            {isAdmin ? '👑' : '👋'} Welcome back, <span className="welcome-name">{user?.name}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            <span className={`badge badge-${user?.role}`}>{user?.role}</span>
            &nbsp;· Here's your Campus Hub overview
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/profile" className="btn-secondary" style={{ fontSize: '0.9rem' }}>👤 Profile</Link>
          {isAdmin && (
            <Link to="/events" className="btn-primary" style={{ fontSize: '0.9rem' }}>+ Add Event</Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: 32 }}>
        {[
          { icon: '🛒', value: stats.totalProducts, label: 'Total Products', link: '/marketplace', color: '#7c3aed' },
          { icon: '📦', value: stats.myProducts, label: 'My Listings', link: '/marketplace', color: '#2563eb' },
          { icon: '🎉', value: stats.totalCampusEvents, label: 'Campus Events', link: '/events', color: '#059669' },
          { icon: '🌐', value: stats.totalExternalEvents, label: 'External Events', link: '/external-events', color: '#d97706' },
          { icon: '🎟️', value: stats.myRegistrations, label: 'My Registrations', link: '/my-registered-events', color: '#dc2626' },
          { icon: '📬', value: stats.myContactRequests, label: 'Requests Sent', link: '/contact-requests', color: '#db2777' },
          {
            icon: '🔔',
            value: stats.unreadNotifications,
            label: 'Unread Alerts',
            link: '/notifications',
            color: '#6366f1',
            highlight: stats.unreadNotifications > 0,
          },
        ].map((s, i) => (
          <Link to={s.link} key={i} className="stat-card-link">
            <div className={`stat-card ${s.highlight ? 'stat-card-highlight' : ''}`}
              style={{ borderColor: s.highlight ? 'var(--primary)' : undefined }}>
              <div className="stat-icon" style={{ color: s.color }}>{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two-Column Layout */}
      <div className="dashboard-two-col">
        {/* Left Column */}
        <div>
          {/* My Registered Events */}
          <div className="dashboard-section">
            <div className="section-header-row">
              <h2>🎟️ My Registered Events</h2>
              <Link to="/my-registered-events" className="see-all-link">See all →</Link>
            </div>
            {myRegistrations.length === 0 ? (
              <div className="empty-state small">
                <div className="empty-icon">🎪</div>
                <p>No registrations yet. <Link to="/events" style={{ color: 'var(--primary-light)' }}>Browse events →</Link></p>
              </div>
            ) : (
              myRegistrations.map(r => (
                <div className="list-item" key={r.id}>
                  <div className="list-item-info">
                    <div className="list-item-title">🎉 {r.eventTitle}</div>
                    <div className="list-item-sub">
                      {r.eventDate && `📅 ${r.eventDate}`}
                      {r.eventTime && ` · ⏰ ${r.eventTime}`}
                      {r.eventLocation && ` · 📍 ${r.eventLocation}`}
                    </div>
                    {/* Real timestamp */}
                    <div className="list-item-time">{formatTimeAgo(r.registeredAt)}</div>
                  </div>
                  <span className={`status-pill ${(r.status || 'confirmed').toLowerCase()}`}>
                    {r.status || 'CONFIRMED'}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* My Contact Requests */}
          <div className="dashboard-section">
            <div className="section-header-row">
              <h2>📬 My Contact Requests</h2>
              <Link to="/contact-requests" className="see-all-link">See all →</Link>
            </div>
            {myContactRequests.length === 0 ? (
              <div className="empty-state small">
                <div className="empty-icon">📭</div>
                <p>No requests sent. <Link to="/marketplace" style={{ color: 'var(--primary-light)' }}>Browse marketplace →</Link></p>
              </div>
            ) : (
              myContactRequests.map(r => (
                <div className="list-item" key={r.id}>
                  <div className="list-item-info">
                    <div className="list-item-title">📦 {r.productTitle}</div>
                    <div className="list-item-sub">Seller: {r.sellerName} · {r.sellerContact}</div>
                    {/* Real timestamp */}
                    <div className="list-item-time" title={formatDateTime(r.createdAt)}>
                      {formatTimeAgo(r.createdAt)}
                    </div>
                  </div>
                  <span className="status-pill sent">{r.status || 'SENT'}</span>
                </div>
              ))
            )}
          </div>

          {/* My Products */}
          {myProductsList.length > 0 && (
            <div className="dashboard-section">
              <div className="section-header-row">
                <h2>📦 My Listed Products</h2>
                <Link to="/marketplace" className="see-all-link">Manage →</Link>
              </div>
              {myProductsList.map(p => (
                <div className="list-item" key={p.id}>
                  <div className="list-item-info">
                    <div className="list-item-title">{p.title}</div>
                    <div className="list-item-sub">₹{p.price.toLocaleString()} · {p.category}</div>
                  </div>
                  <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.9rem' }}>
                    ₹{p.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* Recent Notifications — with real timestamps */}
          <div className="dashboard-section">
            <div className="section-header-row">
              <h2>🔔 Recent Notifications</h2>
              <Link to="/notifications" className="see-all-link">See all →</Link>
            </div>
            {recentNotifications.length === 0 ? (
              <div className="empty-state small">
                <div className="empty-icon">🔕</div>
                <p>No notifications yet</p>
              </div>
            ) : (
              recentNotifications.map(n => (
                <div className={`notif-item ${n.read ? 'read' : 'unread'}`} key={n.id}>
                  <span className="notif-icon">{notifIcon(n.type)}</span>
                  <div style={{ flex: 1 }}>
                    {n.title && <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{n.title}</div>}
                    <span className="notif-msg">{n.message}</span>
                    {/* Real timestamp for dashboard notification */}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 4 }}
                         title={formatDateTime(n.createdAt)}>
                      {formatTimeAgo(n.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <div className="section-header-row"><h2>⚡ Quick Actions</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { to: '/marketplace', icon: '🛒', label: 'Marketplace', cls: 'btn-primary' },
                { to: '/events', icon: '🎉', label: 'Events', cls: 'btn-secondary' },
                { to: '/external-events', icon: '🌐', label: 'Ext. Events', cls: 'btn-secondary' },
                { to: '/contact-requests', icon: '📬', label: 'My Requests', cls: 'btn-secondary' },
                { to: '/my-registered-events', icon: '🎟️', label: 'My Events', cls: 'btn-secondary' },
                { to: '/chatbot', icon: '🤖', label: 'AI Chatbot', cls: 'btn-secondary' },
                { to: '/notifications', icon: '🔔', label: 'Notifications', cls: 'btn-secondary' },
                { to: '/profile', icon: '👤', label: 'Profile', cls: 'btn-secondary' },
              ].map(a => (
                <Link key={a.to} to={a.to} className={a.cls}
                  style={{ justifyContent: 'center', padding: '10px 12px', fontSize: '0.85rem' }}>
                  {a.icon} {a.label}
                </Link>
              ))}
            </div>
          </div>

          {/* AI Chatbot Card */}
          <div className="dashboard-section">
            <div style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.15) 100%)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 'var(--radius)', padding: 20, textAlign: 'center',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🤖</div>
              <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>AI Campus Assistant</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                Ask me anything about the marketplace, events, or how to use Campus Hub!
              </p>
              <Link to="/chatbot" className="btn-primary" style={{ justifyContent: 'center' }}>
                💬 Chat Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
