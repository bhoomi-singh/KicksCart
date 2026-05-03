import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { getMe } from '../store/slices/authSlice';
import ProductCard from '../components/product/ProductCard';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);

  useEffect(() => { dispatch(getMe()); }, [dispatch]);

  const wishlist = user?.wishlist || [];

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh', paddingBottom: 80 }}>
      <div className="container" style={{ paddingTop: 48 }}>
        <h1 className="display-md" style={{ marginBottom: 16 }}>Wishlist</h1>
        <p style={{ color: 'var(--gray-300)', marginBottom: 40 }}>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>

        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-300)' }}>
            <Heart size={64} style={{ margin: '0 auto 24px', opacity: 0.3 }} />
            <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 8 }}>Nothing saved yet</h2>
            <p style={{ marginBottom: 32 }}>Heart products to save them for later.</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="product-grid">
            {wishlist.map(p => <ProductCard key={p._id || p} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
