import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const statusConfig = {
  AVAILABLE: { label: 'Available', color: 'var(--success)', bg: 'rgba(16,185,129,0.12)' },
  RESERVED: { label: 'Reserved', color: 'var(--warning)', bg: 'rgba(245,158,11,0.12)' },
  SOLD: { label: 'Sold', color: 'var(--danger)', bg: 'rgba(239,68,68,0.12)' },
};

const categoryColors = {
  Books: '#7c3aed', Electronics: '#2563eb', Notes: '#059669',
  Vehicles: '#d97706', Stationery: '#dc2626', Clothing: '#db2777', Other: '#6b7280',
};

const ProductCard = ({ product, onEdit, onDelete, onStatusChange }) => {
  const { user } = useAuth();
  const isOwner = user && user.id === product.sellerId;
  const isAdmin = user && user.role === 'admin';
  const color = categoryColors[product.category] || categoryColors.Other;

  const [showContact, setShowContact] = useState(false);
  const [message, setMessage] = useState('Hi, I am interested. Please share more details.');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [savingWish, setSavingWish] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const productStatus = product.status || 'AVAILABLE';
  const sc = statusConfig[productStatus] || statusConfig.AVAILABLE;

  // Check wishlist status on mount (only for non-owners)
  useEffect(() => {
    if (user && !isOwner && !isAdmin) {
      API.get(`/api/wishlist/check/${product.id}`)
        .then(r => setSaved(r.data.saved))
        .catch(() => { });
    }
  }, [product.id]);

  const handleContact = async (e) => {
    e.preventDefault();
    setSending(true); setError('');
    try {
      await API.post('/api/contact-requests', { productId: product.id, message });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
    } finally { setSending(false); }
  };

  const closeModal = () => {
    setShowContact(false); setSent(false); setError('');
    setMessage('Hi, I am interested. Please share more details.');
  };

  const toggleWishlist = async () => {
    setSavingWish(true);
    try {
      const res = await API.post(`/api/wishlist/${product.id}`);
      setSaved(res.data.saved);
    } catch { /* non-critical */ }
    finally { setSavingWish(false); }
  };

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Mark this product as ${newStatus}?`)) return;
    setUpdatingStatus(true);
    try {
      const res = await API.patch(`/api/products/${product.id}/status`, { status: newStatus });
      if (onStatusChange) onStatusChange(res.data);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update status');
    } finally { setUpdatingStatus(false); }
  };

  return (
    <div className={`product-card ${productStatus === 'SOLD' ? 'product-sold' : ''}`}>
      <div className="product-image-wrap">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400'}
          alt={product.title}
          className="product-image"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400'; }}
        />

      </div>

      <div className="product-body">
        <div className="product-meta-row">
          <span className="product-cat-label">{product.category}</span>
          <span className="product-status-text" style={{ color: sc.color }}>● {sc.label}</span>
        </div>
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">₹{product.price?.toLocaleString()}</span>
          <span className="product-seller-name">👤 {product.sellerName}</span>
        </div>

        {/* Wishlist button — non-owners only */}
        {user && !isOwner && !isAdmin && (
          <button
            className={`btn-wishlist ${saved ? 'saved' : ''}`}
            onClick={toggleWishlist}
            disabled={savingWish}
            title={saved ? 'Remove from saved' : 'Save product'}
          >
            {savingWish ? '⏳' : saved ? '❤️ Saved' : '🤍 Save'}
          </button>
        )}

        {/* Contact Seller — only if AVAILABLE and not owner */}
        {user && !isOwner && productStatus === 'AVAILABLE' && (
          <button className="btn-contact" onClick={() => setShowContact(true)}>
            📬 Contact Seller
          </button>
        )}
        {user && !isOwner && productStatus !== 'AVAILABLE' && (
          <div className="sold-notice">🚫 {productStatus === 'SOLD' ? 'Already Sold' : 'Currently Reserved'}</div>
        )}
        {!user && <span className="login-prompt">🔐 Login to contact seller</span>}

        {/* Owner actions */}
        {isOwner && (
          <div className="product-actions">
            <button className="btn-edit" onClick={() => onEdit(product)}>✏️ Edit</button>
            <button className="btn-delete" onClick={() => onDelete(product.id)}>🗑️ Delete</button>
            {/* Status dropdown */}
            <div className="status-select-wrap">
              <select
                className="status-select"
                value={productStatus}
                onChange={e => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                title="Change product status"
              >
                <option value="AVAILABLE">✅ Available</option>
                <option value="RESERVED">🔒 Reserved</option>
                <option value="SOLD">🏷️ Sold</option>
              </select>
            </div>
          </div>
        )}
        {isAdmin && !isOwner && (
          <button className="btn-delete" onClick={() => onDelete(product.id)}>🗑️ Remove</button>
        )}
      </div>

      {/* Contact Seller Modal */}
      {showContact && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            {!sent ? (
              <>
                <h2>📬 Contact Seller</h2>
                <div className="contact-info-box">
                  <p><strong>Product:</strong> {product.title}</p>
                  <p><strong>Seller:</strong> {product.sellerName}</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: 6 }}>
                    Your request will be saved and seller gets an in-app notification.
                  </p>
                </div>
                <form onSubmit={handleContact}>
                  <div className="form-group">
                    <label>Your Message</label>
                    <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)} required />
                  </div>
                  {error && <div className="alert alert-error">⚠️ {error}</div>}
                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="btn-primary" disabled={sending}>
                      {sending ? '⏳ Sending...' : '📨 Send Request'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2>✅ Request Sent!</h2>
                <div className="contact-reveal-box">
                  <p>Your interest was recorded. The seller has been notified in-app.</p>
                  <p style={{ marginTop: 10, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Track status in <strong>Contact Requests</strong> page. You'll get a notification when the seller responds.
                  </p>
                </div>
                <div className="modal-footer">
                  <button className="btn-primary" onClick={closeModal}>Done ✓</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
