import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [pendingRegs, setPendingRegs] = useState([]);
  const [pendingReqs, setPendingReqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [aRes, regRes, reqRes] = await Promise.all([
          API.get('/api/admin/analytics'),
          API.get('/api/admin/event-registrations'),
          API.get('/api/contact-requests/seller').catch(() => ({ data: [] })),
        ]);
        setAnalytics(aRes.data);
        setPendingRegs(regRes.data.filter(r => r.status === 'PENDING').slice(0, 5));
        setPendingReqs(reqRes.data.filter(r => r.status === 'PENDING').slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /><p>Loading admin dashboard...</p></div>;

  const statCards = analytics ? [
    { icon: '👥', value: analytics.totalUsers,       label: 'Total Users',        color: '#7c3aed', link: null },
    { icon: '🛒', value: analytics.totalProducts,    label: 'Total Products',     color: '#2563eb', link: '/marketplace' },
    { icon: '✅', value: analytics.availableProducts, label: 'Available',         color: '#059669', link: '/marketplace' },
    { icon: '🏷️', value: analytics.soldProducts,     label: 'Sold',              color: '#dc2626', link: '/marketplace' },
    { icon: '🎉', value: analytics.totalEvents,       label: 'Campus Events',     color: '#d97706', link: '/events' },
    { icon: '⏳', value: analytics.pendingRegistrations, label: 'Pending Regs',  color: '#f59e0b', link: '/admin/event-requests', highlight: analytics.pendingRegistrations > 0 },
    { icon: '✅', value: analytics.approvedRegistrations, label: 'Approved Regs', color: '#10b981', link: '/admin/event-requests' },
    { icon: '📬', value: analytics.pendingContactRequests, label: 'Pending Requests', color: '#6366f1', link: '/contact-requests', highlight: analytics.pendingContactRequests > 0 },
  ] : [];

  return (
    <div>
      {/* Header */}
      <div className="dashboard-welcome">
        <div>
          <h1>👑 Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            Welcome back, <strong>{user?.name}</strong> · Full campus control
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/events" className="btn-primary">+ Add Event</Link>
          <Link to="/profile" className="btn-secondary">👤 Profile</Link>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="stats-grid" style={{ marginBottom: 32 }}>
        {statCards.map((s, i) => (
          <div key={i} className="stat-card-link">
            {s.link ? (
              <Link to={s.link} style={{ textDecoration: 'none' }}>
                <div className={`stat-card ${s.highlight ? 'stat-card-highlight' : ''}`}>
                  <div className="stat-icon" style={{ color: s.color }}>{s.icon}</div>
                  <div className="stat-value">{s.value ?? '—'}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </Link>
            ) : (
              <div className="stat-card">
                <div className="stat-icon" style={{ color: s.color }}>{s.icon}</div>
                <div className="stat-value">{s.value ?? '—'}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Two-Column */}
      <div className="dashboard-two-col">
        {/* Left: Pending Event Registrations */}
        <div>
          <div className="dashboard-section">
            <div className="section-header-row">
              <h2>⏳ Pending Event Registrations</h2>
              <Link to="/admin/event-requests" className="see-all-link">Manage all →</Link>
            </div>
            {pendingRegs.length === 0 ? (
              <div className="empty-state small">
                <div className="empty-icon">✅</div>
                <p>No pending registrations</p>
              </div>
            ) : pendingRegs.map(r => (
              <div className="list-item" key={r.id}>
                <div className="list-item-info">
                  <div className="list-item-title">🎉 {r.eventTitle}</div>
                  <div className="list-item-sub">👤 {r.userName} · {r.userEmail}</div>
                </div>
                <Link to="/admin/event-requests" className="btn-primary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                  Review
                </Link>
              </div>
            ))}
          </div>

          {/* Pending Contact Requests */}
          <div className="dashboard-section">
            <div className="section-header-row">
              <h2>📬 Pending Seller Requests</h2>
              <Link to="/contact-requests" className="see-all-link">See all →</Link>
            </div>
            {pendingReqs.length === 0 ? (
              <div className="empty-state small">
                <div className="empty-icon">✅</div>
                <p>No pending requests</p>
              </div>
            ) : pendingReqs.map(r => (
              <div className="list-item" key={r.id}>
                <div className="list-item-info">
                  <div className="list-item-title">📦 {r.productTitle}</div>
                  <div className="list-item-sub">👤 {r.buyerName}</div>
                </div>
                <span className="status-pill sent">PENDING</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div>
          <div className="dashboard-section">
            <div className="section-header-row"><h2>⚡ Quick Actions</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { to: '/admin/event-requests', icon: '🎓', label: 'Event Requests', cls: 'btn-primary' },
                { to: '/events', icon: '🎉', label: 'Manage Events', cls: 'btn-secondary' },
                { to: '/marketplace', icon: '🛒', label: 'Marketplace', cls: 'btn-secondary' },
                { to: '/contact-requests', icon: '📬', label: 'Seller Requests', cls: 'btn-secondary' },
                { to: '/notifications', icon: '🔔', label: 'Notifications', cls: 'btn-secondary' },
                { to: '/chatbot', icon: '🤖', label: 'AI Chatbot', cls: 'btn-secondary' },
                { to: '/profile', icon: '👤', label: 'Profile', cls: 'btn-secondary' },
              ].map(a => (
                <Link key={a.to} to={a.to} className={a.cls} style={{ justifyContent: 'center', padding: '10px', fontSize: '0.85rem' }}>
                  {a.icon} {a.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Admin Tips */}
          <div className="dashboard-section">
            <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: 20 }}>
              <h3 style={{ color: 'var(--warning)', marginBottom: 12 }}>👑 Admin Guide</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'Go to Event Requests to approve/reject registrations',
                  'Approved students get an auto QR pass',
                  'Manage campus events under Events page',
                  'View all seller requests under Contact Requests',
                ].map((tip, i) => (
                  <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--warning)' }}>→</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
