import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { closeCart, updateCartItem, removeFromCart, selectCartTotal } from '../../store/slices/cartSlice';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const { items, isOpen, loading } = useSelector(s => s.cart);
  const total = useSelector(selectCartTotal);
  const { isAuthenticated } = useSelector(s => s.auth);

  if (!isOpen) return null;

  const handleQty = (itemId, qty) => {
    if (isAuthenticated) dispatch(updateCartItem({ itemId, quantity: qty }));
  };

  const handleRemove = (itemId) => {
    if (isAuthenticated) dispatch(removeFromCart(itemId));
  };

  return (
    <>
      <div className="cart-overlay" onClick={() => dispatch(closeCart())} />
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShoppingBag size={22} color="var(--accent)" />
            <span style={{ fontWeight: 700, fontSize: 18 }}>Your Bag</span>
            <span className="badge badge-accent">{items.length}</span>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={() => dispatch(closeCart())}>
            <X size={20} />
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--gray-300)' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ fontWeight: 600, marginBottom: 8 }}>Your bag is empty</p>
              <p style={{ fontSize: 13 }}>Add some kicks to get started</p>
              <Link to="/products" className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => dispatch(closeCart())}>
                Shop Now
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/80x80?text=Shoe'}
                  alt={item.product?.name}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.product?.name || 'Product'}</div>
                  <div className="cart-item-meta">Size: {item.size}</div>
                  <div className="cart-item-meta" style={{ color: 'var(--accent)' }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => handleQty(item._id, item.quantity - 1)} disabled={loading}>
                      <Minus size={12} />
                    </button>
                    <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 700, fontSize: 14 }}>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => handleQty(item._id, item.quantity + 1)} disabled={loading}>
                      <Plus size={12} />
                    </button>
                    <button className="btn btn-ghost btn-icon" style={{ width: 28, height: 28, marginLeft: 4 }}
                      onClick={() => handleRemove(item._id)}>
                      <Trash2 size={13} color="var(--red)" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Subtotal</span>
              <span className="cart-total-value">₹{total.toLocaleString()}</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--gray-300)', marginBottom: 16 }}>Shipping & taxes calculated at checkout</p>
            <Link
              to={isAuthenticated ? '/checkout' : '/login?redirect=/checkout'}
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: 12 }}
              onClick={() => dispatch(closeCart())}
            >
              Checkout
            </Link>
            <Link to="/cart" className="btn btn-outline" style={{ width: '100%' }} onClick={() => dispatch(closeCart())}>
              View Bag
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
