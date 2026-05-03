import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminLayout } from './AdminDashboard';
import api from '../../utils/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', brand: '', category: 'Running', gender: 'Men', price: '', discountPrice: '', description: '', isFeatured: false, isNewArrival: false, isBestSeller: false });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products', { params: { keyword: search, limit: 50 } });
      setProducts(res.data.products);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const openCreate = () => { setEditProduct(null); setForm({ name: '', brand: '', category: 'Running', gender: 'Men', price: '', discountPrice: '', description: '', isFeatured: false, isNewArrival: false, isBestSeller: false }); setShowModal(true); };
  const openEdit = (p) => { setEditProduct(p); setForm({ name: p.name, brand: p.brand, category: p.category, gender: p.gender, price: p.price, discountPrice: p.discountPrice || '', description: p.description, isFeatured: p.isFeatured, isNewArrival: p.isNewArrival, isBestSeller: p.isBestSeller }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, form);
        toast.success('Product updated!');
      } else {
        await api.post('/products', { ...form, variants: [{ size: 'UK7', stock: 10, sku: `SKU-${Date.now()}` }, { size: 'UK8', stock: 10, sku: `SKU-${Date.now() + 1}` }, { size: 'UK9', stock: 10, sku: `SKU-${Date.now() + 2}` }] });
        toast.success('Product created!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); toast.success('Deleted'); fetchProducts(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 className="heading-lg">Products</h1>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Product</button>
      </div>

      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
        <input className="form-input" placeholder="Search products…" style={{ paddingLeft: 40, width: 320 }} value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--gray-700)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {loading ? <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
          <table className="data-table" style={{ width: '100%' }}>
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={p.images?.[0]?.url || 'https://via.placeholder.com/40'} alt={p.name} style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', objectFit: 'cover', background: 'var(--bg-elevated)' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-300)' }}>{p.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-gray">{p.category}</span></td>
                  <td>
                    <div style={{ fontWeight: 700 }}>₹{p.discountPrice > 0 ? p.discountPrice.toLocaleString() : p.price.toLocaleString()}</div>
                    {p.discountPrice > 0 && <div style={{ fontSize: 12, color: 'var(--gray-500)', textDecoration: 'line-through' }}>₹{p.price.toLocaleString()}</div>}
                  </td>
                  <td><span style={{ color: p.totalStock < 5 ? 'var(--red)' : 'inherit' }}>{p.totalStock} units</span></td>
                  <td>⭐ {p.rating?.toFixed(1)} ({p.numReviews})</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(p)}><Pencil size={14} /></button>
                      <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--red)' }} onClick={() => handleDelete(p._id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--gray-700)', borderRadius: 'var(--radius-xl)', padding: 40, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 28 }}>{editProduct ? 'Edit Product' : 'New Product'}</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[['name', 'Product Name', 'text'], ['brand', 'Brand', 'text'], ['price', 'Price (₹)', 'number'], ['discountPrice', 'Discount Price (₹)', 'number']].map(([key, label, type]) => (
                  <div key={key} className="form-group">
                    <label className="form-label">{label}</label>
                    <input className="form-input" type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required={key !== 'discountPrice'} />
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {['Running', 'Casual', 'Basketball', 'Training', 'Lifestyle', 'Limited Edition'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-select" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                    {['Men', 'Women', 'Unisex', 'Kids'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 24 }}>
                {[['isFeatured', 'Featured'], ['isNewArrival', 'New Arrival'], ['isBestSeller', 'Best Seller']].map(([key, label]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                    <input type="checkbox" checked={form[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })} style={{ accentColor: 'var(--accent)', width: 16, height: 16 }} />
                    {label}
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Product</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
