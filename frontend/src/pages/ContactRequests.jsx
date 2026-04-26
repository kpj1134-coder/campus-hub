import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { formatTimeAgo } from '../utils/dateUtils';

const statusConfig = {
  PENDING:   { label: 'Pending',   color: 'var(--warning)',  bg: 'rgba(245,158,11,0.15)',  icon: '⏳' },
  ACCEPTED:  { label: 'Accepted',  color: 'var(--success)',  bg: 'rgba(16,185,129,0.15)', icon: '✅' },
  REJECTED:  { label: 'Rejected',  color: 'var(--danger)',   bg: 'rgba(239,68,68,0.15)',  icon: '❌' },
  RESPONDED: { label: 'Responded', color: 'var(--accent)',   bg: 'rgba(6,182,212,0.15)',  icon: '💬' },
};

const ContactRequests = () => {
  const [tab, setTab] = useState('sent');
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [b, s] = await Promise.all([
          API.get('/api/contact-requests/buyer'),
          API.get('/api/contact-requests/seller').catch(() => ({ data: [] })),
        ]);
        setSent(b.data);
        setReceived(s.data);
      } catch { /* non-critical */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id + status);
    try {
      const res = await API.put(`/api/contact-requests/${id}/status`, { status });
      setReceived(prev => prev.map(r => r.id === id ? res.data : r));
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update');
    } finally { setUpdating(null); }
  };

  const list = tab === 'sent' ? sent : received;

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1>📬 Contact Requests</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            {tab === 'sent' ? `${sent.length} sent` : `${received.length} received`}
          </p>
        </div>
        <Link to="/marketplace" className="btn-secondary">🛒 Marketplace</Link>
      </div>

      <div className="filter-row" style={{ marginBottom: 24 }}>
        <button className={`filter-btn ${tab === 'sent' ? 'active' : ''}`} onClick={() => setTab('sent')}>
          📤 Sent ({sent.length})
        </button>
        <button className={`filter-btn ${tab === 'received' ? 'active' : ''}`} onClick={() => setTab('received')}>
          📥 Received ({received.length})
        </button>
      </div>

      {loading && <div className="loading-screen"><div className="spinner" /></div>}

      {!loading && list.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">{tab === 'sent' ? '📭' : '📬'}</div>
          <p>{tab === 'sent' ? 'No requests sent yet.' : 'No requests received yet.'}</p>
          {tab === 'sent' && <Link to="/marketplace" className="btn-primary" style={{ marginTop: 12 }}>Browse Products →</Link>}
        </div>
      )}

      <div className="requests-list">
        {list.map(r => {
          const cfg = statusConfig[r.status] || statusConfig.PENDING;
          return (
            <div className="request-card" key={r.id}>
              <div className="request-card-header">
                <div>
                  <h3 className="request-product-title">📦 {r.productTitle}</h3>
                  <span className="request-status" style={{ background: cfg.bg, color: cfg.color }}>
                    {cfg.icon} {cfg.label}
                  </span>
                </div>
                <span className="request-date" title={r.createdAt}>{formatTimeAgo(r.createdAt)}</span>
              </div>

              <div className="request-body">
                <div className="request-info-row">
                  <span className="info-label">{tab === 'sent' ? '👤 Seller' : '👤 Buyer'}</span>
                  <span className="info-value">{tab === 'sent' ? r.sellerName : r.buyerName}</span>
                </div>
                {tab === 'received' && r.buyerEmail && (
                  <div className="request-info-row">
                    <span className="info-label">📧 Email</span>
                    <a href={`mailto:${r.buyerEmail}`} className="info-value info-link">{r.buyerEmail}</a>
                  </div>
                )}
                <div className="request-info-row">
                  <span className="info-label">💬 Message</span>
                  <span className="info-value">{r.message}</span>
                </div>
              </div>

              {/* Seller action buttons */}
              {tab === 'received' && r.status === 'PENDING' && (
                <div className="action-btns-row">
                  <button
                    className="btn-success"
                    disabled={!!updating}
                    onClick={() => updateStatus(r.id, 'ACCEPTED')}
                  >
                    {updating === r.id + 'ACCEPTED' ? '⏳' : '✅ Accept'}
                  </button>
                  <button
                    className="btn-danger"
                    disabled={!!updating}
                    onClick={() => updateStatus(r.id, 'REJECTED')}
                  >
                    {updating === r.id + 'REJECTED' ? '⏳' : '❌ Reject'}
                  </button>
                  <button
                    className="btn-secondary"
                    disabled={!!updating}
                    onClick={() => updateStatus(r.id, 'RESPONDED')}
                  >
                    {updating === r.id + 'RESPONDED' ? '⏳' : '💬 Mark Responded'}
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

export default ContactRequests;
