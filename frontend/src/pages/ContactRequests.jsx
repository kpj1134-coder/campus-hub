import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const ContactRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/api/contact-requests/my');
        setRequests(res.data);
      } catch {
        setError('Failed to load contact requests');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const formatDate = (dt) => {
    if (!dt) return '';
    return new Date(dt).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1>📬 My Contact Requests</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            {requests.length} contact request{requests.length !== 1 ? 's' : ''} sent
          </p>
        </div>
        <Link to="/marketplace" className="btn-secondary">🛒 Browse Marketplace</Link>
      </div>

      {loading && <div className="loading-screen"><div className="spinner" /><p>Loading requests...</p></div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && requests.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>No contact requests yet.</p>
          <Link to="/marketplace" className="btn-primary" style={{ marginTop: 12 }}>Browse Products</Link>
        </div>
      )}

      <div className="requests-list">
        {requests.map(r => (
          <div className="request-card" key={r.id}>
            <div className="request-card-header">
              <div>
                <h3 className="request-product-title">{r.productTitle}</h3>
                <span className={`request-status status-${r.status?.toLowerCase()}`}>{r.status}</span>
              </div>
              <span className="request-date">{formatDate(r.createdAt)}</span>
            </div>
            <div className="request-body">
              <div className="request-info-row">
                <span className="info-label">👤 Seller</span>
                <span className="info-value">{r.sellerName}</span>
              </div>
              <div className="request-info-row">
                <span className="info-label">📧 Contact</span>
                <a href={`mailto:${r.sellerContact}`} className="info-value info-link">{r.sellerContact}</a>
              </div>
              <div className="request-info-row">
                <span className="info-label">💬 Message</span>
                <span className="info-value">{r.message}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactRequests;
