import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Books', 'Electronics', 'Notes', 'Vehicles', 'Stationery', 'Clothing', 'Other'];

const emptyForm = { title: '', description: '', category: 'Books', price: '', contact: '', imageUrl: '' };

const Marketplace = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/api/products');
      setProducts(res.data);
    } catch { setError('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  const openAdd = () => { setEditProduct(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p) => { setEditProduct(p); setForm({ title: p.title, description: p.description, category: p.category, price: p.price, contact: p.contact, imageUrl: p.imageUrl || '' }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditProduct(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editProduct) {
        const res = await API.put(`/api/products/${editProduct.id}`, { ...form, price: Number(form.price) });
        setProducts(products.map(p => p.id === editProduct.id ? res.data : p));
      } else {
        const res = await API.post('/api/products', { ...form, price: Number(form.price) });
        setProducts([res.data, ...products]);
      }
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/api/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch { alert('Delete failed'); }
  };

  return (
    <div>
      <div className="page-header-row">
        <div><h1>🛒 Marketplace</h1><p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{filtered.length} items listed</p></div>
        {user && <button className="btn-primary" onClick={openAdd}>+ Add Product</button>}
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="filter-row">
        {CATEGORIES.map(c => (
          <button key={c} className={`filter-btn ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      {loading && <div className="loading-screen"><div className="spinner" /><p>Loading products...</p></div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && filtered.length === 0 && (
        <div className="empty-state"><div className="empty-icon">📦</div><p>No products found</p></div>
      )}

      <div className="cards-grid">
        {filtered.map(p => <ProductCard key={p.id} product={p} onEdit={openEdit} onDelete={handleDelete} />)}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editProduct ? '✏️ Edit Product' : '+ Add Product'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Title</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Product title" /></div>
              <div className="form-group"><label>Description</label><textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe your product..." /></div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Price (₹)</label><input type="number" required min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0" /></div>
              <div className="form-group"><label>Contact (email/phone)</label><input required value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="Contact info" /></div>
              <div className="form-group"><label>Image URL (optional)</label><input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." /></div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
