import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { updateCartItem, removeFromCart, clearCart, selectCartTotal } from '../store/slices/cartSlice';

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(s => s.cart);
  const { isAuthenticated } = useSelector(s => s.auth);
  const total = useSelector(selectCartTotal);
  const shipping = total > 2000 ? 0 : 99;
  const tax = Math.round(total * 0.18);

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh', paddingBottom: 80 }}>
      <div className="container" style={{ paddingTop: 48 }}>
        <h1 className="display-md" style={{ marginBottom: 40 }}>Your Bag</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-300)' }}>
            <ShoppingBag size={64} style={{ margin: '0 auto 24px', opacity: 0.3 }} />
            <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 8 }}>Your bag is empty</h2>
            <p style={{ marginBottom: 32 }}>Looks like you haven't added any kicks yet.</p>
            <Link to="/products" className="btn btn-primary btn-lg">Shop Now <ArrowRight size={18} /></Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ color: 'var(--gray-300)', fontSize: 14 }}>{items.length} item{items.length > 1 ? 's' : ''}</span>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => dispatch(clearCart())}>
                  <Trash2 size={14} /> Clear All
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {items.map(item => (
                  <div key={item._id} style={{ display: 'flex', gap: 24, background: 'var(--bg-card)', border: '1px solid var(--gray-700)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                    <img src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/100'} alt={item.product?.name}
                      style={{ width: 120, height: 120, borderRadius: 'var(--radius-md)', objectFit: 'cover', background: 'var(--bg-elevated)', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{item.product?.name}</div>
                          <div style={{ fontSize: 13, color: 'var(--gray-300)', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>Size: {item.size}</div>
                          <div style={{ fontSize: 13, color: 'var(--gray-300)', fontFamily: 'var(--font-mono)' }}>₹{item.price?.toLocaleString()} each</div>
                        </div>
                        <button className="btn btn-ghost btn-icon" style={{ color: 'var(--red)' }} onClick={() => dispatch(removeFromCart(item._id))}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                        <div className="cart-item-qty">
                          <button className="qty-btn" onClick={() => dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity - 1 }))} disabled={loading}><Minus size={12} /></button>
                          <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 700 }}>{item.quantity}</span>
                          <button className="qty-btn" onClick={() => dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity + 1 }))} disabled={loading}><Plus size={12} /></button>
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--accent)' }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--gray-700)', borderRadius: 'var(--radius-lg)', padding: 32, position: 'sticky', top: 88 }}>
              <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 24 }}>Order Summary</h2>
              {[{ label: 'Subtotal', value: `₹${total.toLocaleString()}` }, { label: 'Shipping', value: shipping === 0 ? 'FREE' : `₹${shipping}` }, { label: 'GST (18%)', value: `₹${tax.toLocaleString()}` }].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: 'var(--gray-300)' }}>
                  <span>{row.label}</span>
                  <span style={{ color: row.value === 'FREE' ? 'var(--accent)' : 'inherit' }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid var(--gray-700)', fontWeight: 800, marginBottom: 24 }}>
                <span>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--accent)' }}>₹{(total + shipping + tax).toLocaleString()}</span>
              </div>
              <Link to={isAuthenticated ? '/checkout' : '/login?redirect=/checkout'} className="btn btn-primary" style={{ width: '100%', marginBottom: 12 }}>
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
              <Link to="/products" className="btn btn-outline" style={{ width: '100%' }}>Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
