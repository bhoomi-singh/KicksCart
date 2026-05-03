// OrderDetailPage.js
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, MapPin, CreditCard, Package } from 'lucide-react';
import { fetchOrder } from '../store/slices/orderSlice';

export default function OrderDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector(s => s.orders);

  useEffect(() => { dispatch(fetchOrder(id)); }, [id, dispatch]);

  if (loading || !order) return <div style={{ paddingTop: 68, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" /></div>;

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh', paddingBottom: 80 }}>
      <div className="container" style={{ paddingTop: 40 }}>
        <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--gray-300)', marginBottom: 32, fontSize: 14 }}>
          <ChevronLeft size={16} /> Back to Orders
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
          <div>
            <h1 className="heading-lg">Order #{order._id?.slice(-8).toUpperCase()}</h1>
            <p style={{ color: 'var(--gray-300)', fontSize: 14, marginTop: 4 }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <span className={`badge status-${order.orderStatus}`} style={{ padding: '8px 16px', fontSize: 14 }}>{order.orderStatus}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
          <div>
            {/* Items */}
            <div className="checkout-section">
              <h2 className="checkout-section-title"><Package size={20} color="var(--accent)" /> Items Ordered</h2>
              {order.orderItems?.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: 16, marginBottom: 16, borderBottom: i < order.orderItems.length - 1 ? '1px solid var(--gray-700)' : 'none' }}>
                  <img src={item.image} alt={item.name} style={{ width: 80, height: 80, borderRadius: 'var(--radius-md)', objectFit: 'cover', background: 'var(--bg-elevated)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-300)', fontFamily: 'var(--font-mono)' }}>Size: {item.size} × {item.quantity}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div className="checkout-section">
              <h2 className="checkout-section-title"><MapPin size={20} color="var(--accent)" /> Shipping Address</h2>
              <p style={{ color: 'var(--gray-300)', fontSize: 14, lineHeight: 2 }}>
                {order.shippingAddress?.fullName}<br/>
                {order.shippingAddress?.street}<br/>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br/>
                {order.shippingAddress?.country}<br/>
                📞 {order.shippingAddress?.phone}
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="checkout-section">
            <h2 className="checkout-section-title"><CreditCard size={20} color="var(--accent)" /> Order Summary</h2>
            {[{ label: 'Items', value: `₹${order.itemsPrice?.toLocaleString()}` }, { label: 'Shipping', value: order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}` }, { label: 'Tax', value: `₹${order.taxPrice?.toLocaleString()}` }].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14, color: 'var(--gray-300)' }}>
                <span>{row.label}</span>
                <span style={{ color: row.value === 'FREE' ? 'var(--accent)' : 'inherit' }}>{row.value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--gray-700)', fontWeight: 800, marginBottom: 20 }}>
              <span>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--accent)' }}>₹{order.totalPrice?.toLocaleString()}</span>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--gray-300)', marginBottom: 6 }}>Payment Method</div>
              <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{order.paymentMethod}</div>
              <div style={{ marginTop: 8 }}>
                <span className={`badge ${order.isPaid ? 'badge-accent' : 'badge-gray'}`}>{order.isPaid ? '✓ Paid' : 'Pending'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
