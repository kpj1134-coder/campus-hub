import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { formatTimeAgo } from '../utils/dateUtils';

const statusConfig = {
  PENDING:   { label: 'Pending',   color: 'var(--warning)',  bg: 'rgba(245,158,11,0.15)', icon: '⏳' },
  APPROVED:  { label: 'Approved',  color: 'var(--success)',  bg: 'rgba(16,185,129,0.15)', icon: '✅' },
  REJECTED:  { label: 'Rejected',  color: 'var(--danger)',   bg: 'rgba(239,68,68,0.15)',  icon: '❌' },
  CANCELLED: { label: 'Cancelled', color: 'var(--text-dim)', bg: 'rgba(107,114,128,0.15)', icon: '🚫' },
};

const AdminEventRequests = () => {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    API.get('/api/admin/event-registrations')
      .then(r => setRegs(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      const res = await API.put(`/api/admin/event-registrations/${id}/status`, { status });
      setRegs(prev => prev.map(r => r.id === id ? res.data : r));
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update');
    } finally { setUpdating(null); }
  };

  const counts = { ALL: regs.length };
  ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].forEach(s => {
    counts[s] = regs.filter(r => r.status === s).length;
  });

  const displayed = filter === 'ALL' ? regs : regs.filter(r => r.status === filter);

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1>🎓 Event Registration Requests</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            {counts.PENDING} pending approvals
          </p>
        </div>
        <Link to="/dashboard" className="btn-secondary">← Dashboard</Link>
      </div>

      {/* Filter tabs */}
      <div className="filter-row" style={{ marginBottom: 24 }}>
        {Object.entries(counts).map(([s, c]) => (
          <button key={s} className={`filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'ALL' ? `All (${c})` : `${statusConfig[s]?.icon || ''} ${s} (${c})`}
          </button>
        ))}
      </div>

      {loading && <div className="loading-screen"><div className="spinner" /></div>}
      {!loading && displayed.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No {filter !== 'ALL' ? filter.toLowerCase() : ''} registrations</p>
        </div>
      )}

      <div className="requests-list">
        {displayed.map(r => {
          const cfg = statusConfig[r.status] || statusConfig.PENDING;
          return (
            <div className="request-card" key={r.id}>
              <div className="request-card-header">
                <div>
                  <h3 className="request-product-title">🎉 {r.eventTitle}</h3>
                  <span className="request-status" style={{ background: cfg.bg, color: cfg.color }}>
                    {cfg.icon} {cfg.label}
                  </span>
                </div>
                <span className="request-date">{formatTimeAgo(r.registeredAt)}</span>
              </div>
              <div className="request-body">
                <div className="request-info-row">
                  <span className="info-label">👤 Student</span>
                  <span className="info-value">{r.userName}</span>
                </div>
                <div className="request-info-row">
                  <span className="info-label">📧 Email</span>
                  <span className="info-value">{r.userEmail}</span>
                </div>
                {r.eventDate && (
                  <div className="request-info-row">
                    <span className="info-label">📅 Date</span>
                    <span className="info-value">{r.eventDate} {r.eventTime && `• ${r.eventTime}`}</span>
                  </div>
                )}
                {r.eventLocation && (
                  <div className="request-info-row">
                    <span className="info-label">📍 Venue</span>
                    <span className="info-value">{r.eventLocation}</span>
                  </div>
                )}
              </div>

              {r.status === 'PENDING' && (
                <div className="action-btns-row">
                  <button
                    className="btn-success"
                    disabled={updating === r.id}
                    onClick={() => updateStatus(r.id, 'APPROVED')}
                  >
                    {updating === r.id ? '⏳' : '✅ Approve'}
                  </button>
                  <button
                    className="btn-danger"
                    disabled={updating === r.id}
                    onClick={() => updateStatus(r.id, 'REJECTED')}
                  >
                    {updating === r.id ? '⏳' : '❌ Reject'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminEventRequests;
