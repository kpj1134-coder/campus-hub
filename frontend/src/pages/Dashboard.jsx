import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCampusEvents: 0,
    totalExternalEvents: 0,
    myRegistrations: 0,
    myContactRequests: 0,
    unreadNotifications: 0,
  });
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [myContactRequests, setMyContactRequests] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pRes, eRes, extRes, rRes, crRes, nRes, prodRes] = await Promise.all([
          API.get('/api/products'),
          API.get('/api/events'),
          API.get('/api/external-events'),
          API.get('/api/events/my-registrations'),
          API.get('/api/contact-requests/my'),
          API.get('/api/notifications'),
          API.get('/api/products/mine'),
        ]);

        const notifications = nRes.data || [];
        const unread = notifications.filter(n => !n.read).length;

        setStats({
          totalProducts: pRes.data.length,
          totalCampusEvents: eRes.data.length,
          totalExternalEvents: extRes.data.length,
          myRegistrations: rRes.data.length,
          myContactRequests: crRes.data.length,
          unreadNotifications: unread,
        });
        setMyRegistrations(rRes.data.slice(0, 3));
        setMyContactRequests(crRes.data.slice(0, 3));
        setRecentNotifications(notifications.slice(0, 5));
        setMyProducts(prodRes.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/api/products/${id}`);
      setMyProducts(myProducts.filter(p => p.id !== id));
      setStats(s => ({ ...s, totalProducts: s.totalProducts - 1 }));
    } catch { alert('Delete failed'); }
  };

  const notifIcon = (type) => ({ SUCCESS: '✅', INFO: '📬', WARNING: '⚠️' }[type] || '🔔');

  if (loading) return <div className="loading-screen"><div className="spinner" /><p>Loading dashboard...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h1>📊 Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Welcome back, <strong style={{ color: 'var(--primary-light)' }}>{user?.name}</strong>
          &nbsp;<span className={`badge badge-${user?.role}`}>{user?.role}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-value">{stats.totalProducts}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎉</div>
          <div className="stat-value">{stats.totalCampusEvents}</div>
          <div className="stat-label">Campus Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌐</div>
          <div className="stat-value">{stats.totalExternalEvents}</div>
          <div className="stat-label">External Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎟️</div>
          <div className="stat-value">{stats.myRegistrations}</div>
          <div className="stat-label">My Registrations</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📬</div>
          <div className="stat-value">{stats.myContactRequests}</div>
          <div className="stat-label">Contact Requests</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-value">{stats.unreadNotifications}</div>
          <div className="stat-label">Unread Alerts</div>
        </div>
      </div>

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
                  </div>
                  <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                    ✅ {r.status || 'CONFIRMED'}
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
                <p>No contact requests. <Link to="/marketplace" style={{ color: 'var(--primary-light)' }}>Browse marketplace →</Link></p>
              </div>
            ) : (
              myContactRequests.map(r => (
                <div className="list-item" key={r.id}>
                  <div className="list-item-info">
                    <div className="list-item-title">📦 {r.productTitle}</div>
                    <div className="list-item-sub">Seller: {r.sellerName} · {r.sellerContact}</div>
                  </div>
                  <span style={{ color: 'var(--primary-light)', fontSize: '0.85rem', fontWeight: 600 }}>
                    {r.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Recent Notifications */}
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
                  <span className="notif-msg">{n.message}</span>
                </div>
              ))
            )}
          </div>

          {/* My Products */}
          <div className="dashboard-section">
            <div className="section-header-row">
              <h2>🛒 My Listings</h2>
              <Link to="/marketplace" className="see-all-link">Add product →</Link>
            </div>
            {myProducts.length === 0 ? (
              <div className="empty-state small">
                <div className="empty-icon">📦</div>
                <p>No listings. <Link to="/marketplace" style={{ color: 'var(--primary-light)' }}>Add a product →</Link></p>
              </div>
            ) : (
              myProducts.map(p => (
                <div className="list-item" key={p.id}>
                  <div className="list-item-info">
                    <div className="list-item-title">{p.title}</div>
                    <div className="list-item-sub">₹{p.price.toLocaleString()} · {p.category}</div>
                  </div>
                  <button className="btn-danger" onClick={() => handleDeleteProduct(p.id)}>🗑️</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>⚡ Quick Actions</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/marketplace" className="btn-primary">🛒 Marketplace</Link>
          <Link to="/events" className="btn-secondary">🎉 Campus Events</Link>
          <Link to="/external-events" className="btn-secondary">🌐 External Events</Link>
          <Link to="/contact-requests" className="btn-secondary">📬 My Requests</Link>
          <Link to="/my-registered-events" className="btn-secondary">🎟️ My Events</Link>
          <Link to="/notifications" className="btn-secondary">🔔 Notifications</Link>
          <Link to="/chatbot" className="btn-secondary">🤖 AI Chatbot</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
