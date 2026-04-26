import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { formatTimeAgo } from '../utils/dateUtils';

const SavedProducts = () => {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    API.get('/api/wishlist/my')
      .then(r => setSaved(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (productId) => {
    setRemoving(productId);
    try {
      await API.post(`/api/wishlist/${productId}`); // toggle = remove
      setSaved(prev => prev.filter(w => w.productId !== productId));
    } catch { /* non-critical */ }
    finally { setRemoving(null); }
  };

  const statusColors = {
    AVAILABLE: { color: 'var(--success)', bg: 'rgba(16,185,129,0.1)', label: '✅ Available' },
    RESERVED:  { color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)', label: '🔒 Reserved' },
    SOLD:      { color: 'var(--danger)',  bg: 'rgba(239,68,68,0.1)',  label: '❌ Sold' },
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1>❤️ Saved Products</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            {saved.length} saved product{saved.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/marketplace" className="btn-secondary">🛒 Browse More</Link>
      </div>

      {loading && <div className="loading-screen"><div className="spinner" /></div>}

      {!loading && saved.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🤍</div>
          <p>No saved products yet.</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: 8 }}>
            Click the ❤️ button on any product to save it here.
          </p>
          <Link to="/marketplace" className="btn-primary" style={{ marginTop: 16 }}>Browse Marketplace →</Link>
        </div>
      )}

      <div className="product-grid">
        {saved.map(w => {
          const sc = statusColors[w.productStatus] || statusColors.AVAILABLE;
          return (
            <div className="product-card" key={w.id}>
              <div className="product-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span className="product-category">{w.productCategory}</span>
                  <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: 12, background: sc.bg, color: sc.color, fontWeight: 600 }}>
                    {sc.label}
                  </span>
                </div>
                <h3 className="product-title">{w.productTitle}</h3>
                <div className="product-meta">
                  <span>👤 {w.sellerName}</span>
                </div>
                <div className="product-price">₹{w.productPrice?.toLocaleString()}</div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: 6 }}>
                  Saved {formatTimeAgo(w.savedAt)}
                </p>
              </div>
              <div className="product-card-footer">
                <Link to="/marketplace" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  View in Marketplace
                </Link>
                <button
                  className="btn-danger"
                  style={{ padding: '8px 14px' }}
                  onClick={() => handleRemove(w.productId)}
                  disabled={removing === w.productId}
                  title="Remove from saved"
                >
                  {removing === w.productId ? '⏳' : '🗑️'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedProducts;
