import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, registrations: 0, contactRequests: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, regRes, crRes] = await Promise.all([
          API.get('/api/products/mine').catch(() => ({ data: [] })),
          API.get('/api/events/my-registrations').catch(() => ({ data: [] })),
          API.get('/api/contact-requests/my').catch(() => ({ data: [] })),
        ]);
        setStats({
          products: prodRes.data.length,
          registrations: regRes.data.length,
          contactRequests: crRes.data.length,
        });
      } catch {
        // non-critical
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="page-header">
        <h1>👤 My Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Your Campus Hub account details</p>
      </div>

      {/* Profile Card */}
      <div className="dashboard-section" style={{ marginBottom: 24 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 24,
          padding: '28px', background: 'var(--card)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
        }}>
          {/* Avatar */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'var(--gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', flexShrink: 0,
          }}>
            {user?.role === 'admin' ? '👑' : '🎓'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
              {user?.name}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>{user?.email}</p>
            <span className={`badge badge-${user?.role}`} style={{ fontSize: '0.85rem' }}>
              {user?.role === 'admin' ? '👑 Administrator' : '🎓 Student'}
            </span>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-value">{loading ? '...' : stats.products}</div>
          <div className="stat-label">My Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎟️</div>
          <div className="stat-value">{loading ? '...' : stats.registrations}</div>
          <div className="stat-label">Registrations</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📬</div>
          <div className="stat-value">{loading ? '...' : stats.contactRequests}</div>
          <div className="stat-label">Requests Sent</div>
        </div>
      </div>

      {/* Account Info */}
      <div className="dashboard-section">
        <div className="section-header-row">
          <h2>📋 Account Information</h2>
        </div>
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', overflow: 'hidden'
        }}>
          {[
            { label: 'Full Name', value: user?.name, icon: '👤' },
            { label: 'Email Address', value: user?.email, icon: '📧' },
            { label: 'Account Role', value: user?.role === 'admin' ? 'Administrator' : 'Student', icon: '🏷️' },
            { label: 'Account ID', value: user?.id, icon: '🔑' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '16px 20px',
              borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{ fontSize: '1.2rem', width: 28, textAlign: 'center' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text)', fontWeight: 500 }}>
                  {item.value || '—'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="dashboard-section">
        <div className="section-header-row"><h2>⚡ Quick Actions</h2></div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/marketplace" className="btn-primary">🛒 My Listings</Link>
          <Link to="/my-registered-events" className="btn-secondary">🎟️ My Events</Link>
          <Link to="/contact-requests" className="btn-secondary">📬 My Requests</Link>
          <Link to="/notifications" className="btn-secondary">🔔 Notifications</Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
