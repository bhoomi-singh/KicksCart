import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, Zap, Shield, RefreshCw } from 'lucide-react';
import { fetchFeatured } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';

const CATEGORIES = [
  { name: 'Running', emoji: '🏃', desc: 'Built for speed' },
  { name: 'Basketball', emoji: '🏀', desc: 'Court dominance' },
  { name: 'Casual', emoji: '✌️', desc: 'Street style' },
  { name: 'Limited Edition', emoji: '⚡', desc: 'Rare drops' },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const { featured, newArrivals, bestSellers } = useSelector(s => s.products);

  useEffect(() => { dispatch(fetchFeatured()); }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-eyebrow">
                <div className="hero-eyebrow-line" />
                <span className="label">New Season 2025</span>
              </div>
              <h1 className="display-xl" style={{ marginBottom: 24 }}>
                STEP<br />INTO<br /><span style={{ color: 'var(--accent)' }}>ICONIC</span>
              </h1>
              <p style={{ fontSize: 18, color: 'var(--gray-300)', maxWidth: 420, lineHeight: 1.7 }}>
                Premium sneakers crafted for those who move at the speed of culture. KicksCart — where every step is a statement.
              </p>
              <div className="hero-cta-group">
                <Link to="/products" className="btn btn-primary btn-lg">
                  Shop Now <ArrowRight size={18} />
                </Link>
                <Link to="/products?isNewArrival=true" className="btn btn-outline btn-lg">
                  New Arrivals
                </Link>
              </div>
              <div className="hero-stats">
                {[['10K+', 'Happy Customers'], ['500+', 'Shoe Styles'], ['100%', 'Authentic']].map(([v, l]) => (
                  <div key={l}>
                    <div className="hero-stat-value">{v}</div>
                    <div className="hero-stat-label">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-image-wrapper">
              <div className="hero-image-bg" />
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
                alt="Featured Sneaker"
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--gray-700)', borderBottom: '1px solid var(--gray-700)', padding: '20px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { icon: Zap, title: 'Express Delivery', desc: '2-3 business days' },
              { icon: Shield, title: '100% Authentic', desc: 'Verified genuine products' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color="var(--accent)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-300)' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-tag">Categories</div>
              <h2 className="display-md">Shop by Style</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/products?category=${cat.name}`}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--gray-700)', borderRadius: 'var(--radius-lg)', padding: '32px 24px', textAlign: 'center', transition: 'var(--transition)', display: 'block' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-glow)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-700)'; e.currentTarget.style.background = 'var(--bg-card)'; }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{cat.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{cat.name}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-300)' }}>{cat.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-header">
              <div>
                <div className="section-tag">Fresh Drops</div>
                <h2 className="display-md">New Arrivals</h2>
              </div>
              <Link to="/products?isNewArrival=true" className="btn btn-outline">View All <ArrowRight size={16} /></Link>
            </div>
            <div className="product-grid">
              {newArrivals.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-secondary)', paddingTop: 80, paddingBottom: 80 }}>
          <div className="container">
            <div className="section-header">
              <div>
                <div className="section-tag">Fan Favorites</div>
                <h2 className="display-md">Best Sellers</h2>
              </div>
              <Link to="/products?isBestSeller=true" className="btn btn-outline">View All <ArrowRight size={16} /></Link>
            </div>
            <div className="product-grid">
              {bestSellers.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section style={{ background: 'linear-gradient(135deg, #0d1a00 0%, #1a2e00 100%)', padding: '80px 0', borderTop: '1px solid var(--gray-700)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="label" style={{ color: 'var(--accent)', marginBottom: 16 }}>Limited Time</div>
          <h2 className="display-lg" style={{ marginBottom: 16 }}>SUMMER SALE</h2>
          <p style={{ fontSize: 18, color: 'var(--gray-300)', marginBottom: 40 }}>Up to 40% off on selected styles. Don't miss out.</p>
          <Link to="/products?sort=price_asc" className="btn btn-primary btn-lg">
            Shop Sale <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
