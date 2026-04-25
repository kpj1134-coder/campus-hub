import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { user } = useAuth();

  const isOwner = user && user.id === product.sellerId;
  const isAdmin = user && user.role === 'admin';

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
        <a href={`mailto:${product.contact}`} className="btn-contact">
          📧 Contact Seller
        </a>
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
    </div>
  );
};

export default ProductCard;
