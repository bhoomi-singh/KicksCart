import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Package, ChevronRight } from 'lucide-react';
import { fetchMyOrders } from '../store/slices/orderSlice';

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { orders } = useSelector(s => s.orders);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh', paddingBottom: 80 }}>
      <div className="container" style={{ paddingTop: 48 }}>
        <h1 className="display-md" style={{ marginBottom: 40 }}>My Orders</h1>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-300)' }}>
            <Package size={64} style={{ margin: '0 auto 24px', opacity: 0.3 }} />
            <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 8 }}>No orders yet</h2>
            <p style={{ marginBottom: 32 }}>Start shopping to see your orders here.</p>
            <Link to="/products" className="btn btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(order => (
              <Link key={order._id} to={`/orders/${order._id}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', border: '1px solid var(--gray-700)', borderRadius: 'var(--radius-lg)', padding: 24, transition: 'var(--transition)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gray-500)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-700)'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ width: 56, height: 56, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={24} color="var(--accent)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Order #{order._id?.slice(-8).toUpperCase()}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray-300)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {' · '}{order.orderItems?.length} item{order.orderItems?.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <span className={`badge status-${order.orderStatus}`}>{order.orderStatus}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--accent)' }}>₹{order.totalPrice?.toLocaleString()}</span>
                  <ChevronRight size={18} color="var(--gray-500)" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
