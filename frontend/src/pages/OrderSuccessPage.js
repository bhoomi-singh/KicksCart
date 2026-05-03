// OrderSuccessPage.js
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { fetchOrder } from '../store/slices/orderSlice';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order } = useSelector(s => s.orders);

  useEffect(() => { if (id) dispatch(fetchOrder(id)); }, [id, dispatch]);

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '60px 32px', maxWidth: 560 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(200,245,61,0.15)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
          <CheckCircle size={40} color="var(--accent)" />
        </div>
        <h1 className="display-md" style={{ marginBottom: 16 }}>Order Confirmed!</h1>
        <p style={{ color: 'var(--gray-300)', fontSize: 16, marginBottom: 8 }}>
          Thank you for your purchase. Your kicks are on their way!
        </p>
        {order && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--gray-700)', borderRadius: 'var(--radius-lg)', padding: 24, marginTop: 32, marginBottom: 32, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--gray-300)', fontSize: 14 }}>Order ID</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>#{order._id?.slice(-8).toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--gray-300)', fontSize: 14 }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--accent)' }}>₹{order.totalPrice?.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--gray-300)', fontSize: 14 }}>Status</span>
              <span className={`badge status-${order.orderStatus}`}>{order.orderStatus}</span>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to={`/orders/${id}`} className="btn btn-primary">
            <Package size={16} /> Track Order
          </Link>
          <Link to="/products" className="btn btn-outline">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
