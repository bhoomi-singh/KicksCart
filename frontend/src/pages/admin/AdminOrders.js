import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AdminLayout } from './AdminDashboard';
import api from '../../utils/api';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders', { params: { status: filter || undefined, limit: 50 } });
      setOrders(res.data.orders);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Status updated');
      fetchOrders();
    } catch { toast.error('Update failed'); }
  };

  return (
    <AdminLayout>
      <h1 className="heading-lg" style={{ marginBottom: 32 }}>Orders</h1>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        <button className={`filter-chip ${filter === '' ? 'active' : ''}`} onClick={() => setFilter('')}>All</button>
        {STATUSES.map(s => <button key={s} className={`filter-chip ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>{s}</button>)}
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--gray-700)', borderRadius: 'var(--radius-lg)', overflow: 'auto' }}>
        {loading ? <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
          <table className="data-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>#{order._id?.slice(-8).toUpperCase()}</span></td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{order.user?.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-300)' }}>{order.user?.email}</div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--gray-300)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>{order.orderItems?.length}</td>
                  <td><span style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>₹{order.totalPrice?.toLocaleString()}</span></td>
                  <td><span className={`badge ${order.isPaid ? 'badge-accent' : 'badge-gray'}`}>{order.isPaid ? 'Paid' : 'Unpaid'}</span></td>
                  <td>
                    <select className="form-select" style={{ fontSize: 12, padding: '6px 10px' }}
                      value={order.orderStatus}
                      onChange={e => handleStatusUpdate(order._id, e.target.value)}>
                      {STATUSES.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
