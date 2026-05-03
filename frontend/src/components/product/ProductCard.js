import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Star } from 'lucide-react';
import { toggleWishlist } from '../../store/slices/authSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const isWishlisted = user?.wishlist?.some(id => id === product._id || id?._id === product._id);
  const discount = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) dispatch(toggleWishlist(product._id));
  };

  return (
    <Link to={`/products/${product.slug || product._id}`} className="product-card" style={{ display: 'block' }}>
      <div className="product-image-wrapper">
        <img
          src={product.images?.[0]?.url || `https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        <div className="product-badges">
          {product.isNewArrival && <span className="badge badge-accent">NEW</span>}
          {product.isBestSeller && <span className="badge" style={{ background: 'rgba(255,100,0,0.9)', color: '#fff' }}>HOT</span>}
          {discount > 0 && <span className="badge badge-red">-{discount}%</span>}
        </div>
        {isAuthenticated && (
          <button className={`product-wishlist-btn ${isWishlisted ? 'active' : ''}`} onClick={handleWishlist}>
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
      <div className="product-info">
        <div className="product-category">{product.category} · {product.gender}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-brand">{product.brand}</div>
        <div className="product-footer">
          <div>
            {product.discountPrice > 0 ? (
              <span className="product-price-discount">₹{product.discountPrice.toLocaleString()}
                <span className="product-price-original">₹{product.price.toLocaleString()}</span>
              </span>
            ) : (
              <span className="product-price">₹{product.price.toLocaleString()}</span>
            )}
          </div>
          <div className="product-rating">
            <Star size={13} fill="var(--accent)" color="var(--accent)" />
            <span>{product.rating?.toFixed(1) || '–'}</span>
            <span style={{ color: 'var(--gray-500)' }}>({product.numReviews})</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
