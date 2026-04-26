import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { user } = useAuth();

  const isOwner = user && user.id === product.sellerId;
  const isAdmin = user && user.role === 'admin';

  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState('Hi, I am interested in this product. Please share more details.');
  const [sending, setSending] = useState(false);
  const [contactResult, setContactResult] = useState(null); // { sellerContact, sellerName }
  const [contactError, setContactError] = useState('');

  const categoryColors = {
    Books: '#7c3aed',
    Electronics: '#2563eb',
    Notes: '#059669',
    Vehicles: '#d97706',
    Stationery: '#dc2626',
    Clothing: '#db2777',
    Other: '#6b7280',
  };

  const color = categoryColors[product.category] || categoryColors.Other;

  const handleContactSeller = async (e) => {
    e.preventDefault();
    setSending(true);
    setContactError('');
    try {
      const res = await API.post('/api/contact-requests', {
        productId: product.id,
        message,
      });
      setContactResult({
        sellerName: res.data.sellerName,
        sellerContact: res.data.sellerContact,
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to send request';
      setContactError(msg);
    } finally {
      setSending(false);
    }
  };

  const closeModal = () => {
    setShowContactModal(false);
    setContactResult(null);
    setContactError('');
    setMessage('Hi, I am interested in this product. Please share more details.');
  };

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400'}
          alt={product.title}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400';
          }}
        />
        <span className="product-category" style={{ background: color }}>
          {product.category}
        </span>
      </div>
      <div className="product-body">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">₹{product.price.toLocaleString()}</span>
          <div className="product-seller">
            <span>👤 {product.sellerName}</span>
          </div>
        </div>

        {/* Contact Seller - only show if logged in and not the owner */}
        {user && !isOwner && (
          <button className="btn-contact" onClick={() => setShowContactModal(true)}>
            📬 Contact Seller
          </button>
        )}
        {!user && (
          <span className="login-prompt">🔐 Login to contact seller</span>
        )}

        {(isOwner || isAdmin) && (
          <div className="product-actions">
            {isOwner && (
              <button className="btn-edit" onClick={() => onEdit(product)}>
                ✏️ Edit
              </button>
            )}
            <button className="btn-delete" onClick={() => onDelete(product.id)}>
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      {/* Contact Seller Modal */}
      {showContactModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {!contactResult ? (
              <>
                <h2>📬 Contact Seller</h2>
                <div className="contact-info-box">
                  <p><strong>Product:</strong> {product.title}</p>
                  <p><strong>Seller:</strong> {product.sellerName}</p>
                </div>
                <form onSubmit={handleContactSeller}>
                  <div className="form-group">
                    <label>Your Message</label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  {contactError && (
                    <div className="alert alert-error" style={{ marginBottom: 12 }}>
                      ⚠️ {contactError}
                    </div>
                  )}
                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="btn-primary" disabled={sending}>
                      {sending ? 'Sending...' : '📨 Send Request'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2>✅ Request Sent!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
                  Your contact request has been sent. The seller has been notified.
                </p>
                <div className="contact-reveal-box">
                  <div className="contact-reveal-row">
                    <span className="contact-label">👤 Seller Name</span>
                    <span className="contact-value">{contactResult.sellerName}</span>
                  </div>
                  <div className="contact-reveal-row">
                    <span className="contact-label">📧 Contact</span>
                    <a href={`mailto:${contactResult.sellerContact}`} className="contact-value contact-link">
                      {contactResult.sellerContact}
                    </a>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn-primary" onClick={closeModal}>Done</button>
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
