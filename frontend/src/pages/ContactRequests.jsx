import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { formatTimeAgo, formatDateTime } from '../utils/dateUtils';

const statusColors = {
  SENT: { bg: 'rgba(99,102,241,0.15)', color: 'var(--primary-light)', border: 'rgba(99,102,241,0.3)' },
  VIEWED: { bg: 'rgba(245,158,11,0.15)', color: 'var(--warning)', border: 'rgba(245,158,11,0.3)' },
  RESPONDED: { bg: 'rgba(16,185,129,0.15)', color: 'var(--success)', border: 'rgba(16,185,129,0.3)' },
  PENDING: { bg: 'rgba(245,158,11,0.15)', color: 'var(--warning)', border: 'rgba(245,158,11,0.3)' },
};

const ContactRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('sent'); // 'sent' | 'received'
  const [sellerRequests, setSellerRequests] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [buyerRes, sellerRes] = await Promise.all([
          API.get('/api/contact-requests/my'),
          API.get('/api/contact-requests/seller').catch(() => ({ data: [] })),
        ]);
        setRequests(buyerRes.data);
        setSellerRequests(sellerRes.data);
      } catch {
        setError('Failed to load contact requests');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const displayed = activeTab === 'sent' ? requests : sellerRequests;

  const getStatusStyle = (status) => statusColors[status] || statusColors.SENT;

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1>📬 Contact Requests</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            {activeTab === 'sent'
              ? `${requests.length} request${requests.length !== 1 ? 's' : ''} sent`
              : `${sellerRequests.length} interest${sellerRequests.length !== 1 ? 's' : ''} received`}
          </p>
        </div>
        <Link to="/marketplace" className="btn-secondary">🛒 Browse Marketplace</Link>
      </div>

      {/* Tabs */}
      <div className="filter-row" style={{ marginBottom: 24 }}>
        <button
          className={`filter-btn ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          📤 Sent ({requests.length})
        </button>
        <button
          className={`filter-btn ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          📥 Received ({sellerRequests.length})
        </button>
      </div>

      {loading && <div className="loading-screen"><div className="spinner" /><p>Loading...</p></div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && displayed.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">{activeTab === 'sent' ? '📭' : '📬'}</div>
          <p>
            {activeTab === 'sent'
              ? 'No contact requests sent yet.'
              : 'No buyer interests received yet.'}
          </p>
          {activeTab === 'sent' && (
            <Link to="/marketplace" className="btn-primary" style={{ marginTop: 12 }}>
              Browse Products →
            </Link>
          )}
        </div>
      )}

      <div className="requests-list">
        {displayed.map(r => {
          const style = getStatusStyle(r.status);
          return (
            <div className="request-card" key={r.id}>
              <div className="request-card-header">
                <div>
                  <h3 className="request-product-title">📦 {r.productTitle}</h3>
                  <span className="request-status" style={{
                    background: style.bg, color: style.color, border: `1px solid ${style.border}`
                  }}>
                    {r.status || 'SENT'}
                  </span>
                </div>
                {/* Real timestamp — uses formatTimeAgo */}
                <span className="request-date" title={formatDateTime(r.createdAt)}>
                  {formatTimeAgo(r.createdAt)}
                </span>
              </div>
              <div className="request-body">
                {activeTab === 'sent' ? (
                  <>
                    <div className="request-info-row">
                      <span className="info-label">👤 Seller</span>
                      <span className="info-value">{r.sellerName}</span>
                    </div>
                    <div className="request-info-row">
                      <span className="info-label">📧 Contact</span>
                      <a href={`mailto:${r.sellerContact}`} className="info-value info-link">{r.sellerContact}</a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="request-info-row">
                      <span className="info-label">👤 Buyer</span>
                      <span className="info-value">{r.buyerName}</span>
                    </div>
                    <div className="request-info-row">
                      <span className="info-label">📧 Email</span>
                      <a href={`mailto:${r.buyerEmail}`} className="info-value info-link">{r.buyerEmail}</a>
                    </div>
                  </>
                )}
                <div className="request-info-row">
                  <span className="info-label">💬 Message</span>
                  <span className="info-value">{r.message}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactRequests;
