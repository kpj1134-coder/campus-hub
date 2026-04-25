import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [myProducts, setMyProducts] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pRes, rRes, nRes] = await Promise.all([
          API.get('/api/products/mine'),
          API.get('/api/events/my-registrations'),
          API.get('/api/notifications/unread-count'),
        ]);
        setMyProducts(pRes.data);
        setMyRegistrations(rRes.data);
        setUnreadCount(nRes.data.count);
      } catch (err) {
        console.error(err);
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
    } catch { alert('Delete failed'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /><p>Loading dashboard...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h1>📊 Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Welcome, <strong style={{ color: 'var(--primary-light)' }}>{user?.name}</strong>
          &nbsp;<span className={`badge badge-${user?.role}`}>{user?.role}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-value">{myProducts.length}</div>
          <div className="stat-label">My Listings</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎟️</div>
          <div className="stat-value">{myRegistrations.length}</div>
          <div className="stat-label">Event Registrations</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-value">{unreadCount}</div>
          <div className="stat-label">Unread Notifications</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">{user?.role === 'admin' ? '👑' : '👤'}</div>
          <div className="stat-value" style={{ fontSize: '1.2rem' }}>{user?.role}</div>
          <div className="stat-label">Account Role</div>
        </div>
      </div>

      {/* My Products */}
      <div className="dashboard-section">
        <h2>🛒 My Product Listings</h2>
        {myProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>No listings yet. <Link to="/marketplace" style={{ color: 'var(--primary-light)' }}>Add a product →</Link></p>
          </div>
        ) : (
          myProducts.map(p => (
            <div className="list-item" key={p.id}>
              <div className="list-item-info">
                <div className="list-item-title">{p.title}</div>
                <div className="list-item-sub">₹{p.price.toLocaleString()} · {p.category}</div>
              </div>
              <button className="btn-danger" onClick={() => handleDeleteProduct(p.id)}>🗑️ Delete</button>
            </div>
          ))
        )}
      </div>

      {/* My Registrations */}
      <div className="dashboard-section">
        <h2>🎟️ My Event Registrations</h2>
        {myRegistrations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎪</div>
            <p>No registrations yet. <Link to="/events" style={{ color: 'var(--primary-light)' }}>Browse events →</Link></p>
          </div>
        ) : (
          myRegistrations.map(r => (
            <div className="list-item" key={r.id}>
              <div className="list-item-info">
                <div className="list-item-title">🎉 {r.eventTitle}</div>
                <div className="list-item-sub">Registered</div>
              </div>
              <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>✅ Confirmed</span>
            </div>
          ))
        )}
      </div>

      {/* Quick Links */}
      <div className="dashboard-section">
        <h2>⚡ Quick Actions</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/marketplace" className="btn-primary">🛒 Browse Marketplace</Link>
          <Link to="/events" className="btn-secondary">🎉 View Events</Link>
          <Link to="/notifications" className="btn-secondary">🔔 Notifications</Link>
          <Link to="/chatbot" className="btn-secondary">🤖 AI Chatbot</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
