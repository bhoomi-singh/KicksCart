import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Star, ShoppingBag, ChevronLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/authSlice';
import { toggleCart } from '../store/slices/cartSlice';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector(s => s.products);
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const isWishlisted = user?.wishlist?.some(wid => wid === product?._id || wid?._id === product?._id);

  useEffect(() => { dispatch(fetchProduct(id)); }, [id, dispatch]);
  useEffect(() => { setSelectedSize(''); setSelectedImage(0); setQty(1); }, [product?._id]);

  const handleAddToCart = async () => {
    if (!selectedSize) return toast.error('Please select a size');
    if (!isAuthenticated) return toast.error('Please login to add to cart');
    try {
      await dispatch(addToCart({ productId: product._id, size: selectedSize, quantity: qty })).unwrap();
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
      dispatch(toggleCart());
    } catch (err) {
      toast.error(err || 'Failed to add to cart');
    }
  };

  if (loading || !product) return (
    <div style={{ paddingTop: 68, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  const inStockSizes = product.variants?.filter(v => v.stock > 0) || [];
  const selectedVariant = product.variants?.find(v => v.size === selectedSize);

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--gray-300)', marginBottom: 32, fontSize: 14 }}>
          <ChevronLeft size={16} /> Back to Products
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          {/* Images */}
          <div>
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '1', marginBottom: 16 }}>
              <img
                src={product.images?.[selectedImage]?.url || 'https://via.placeholder.com/600x600?text=Shoe'}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: 12 }}>
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    style={{ width: 80, height: 80, border: `2px solid ${selectedImage === i ? 'var(--accent)' : 'var(--gray-700)'}`, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-elevated)', cursor: 'pointer', transition: 'var(--transition)' }}>
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {product.isNewArrival && <span className="badge badge-accent">NEW</span>}
              {product.isBestSeller && <span className="badge" style={{ background: 'rgba(255,100,0,0.9)', color: '#fff' }}>BEST SELLER</span>}
              <span className="badge badge-gray">{product.category}</span>
              <span className="badge badge-gray">{product.gender}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray-300)', marginBottom: 8 }}>{product.brand}</div>
            <h1 style={{ fontWeight: 800, fontSize: 32, lineHeight: 1.2, marginBottom: 16 }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} fill={s <= Math.round(product.rating) ? 'var(--accent)' : 'transparent'} color={s <= Math.round(product.rating) ? 'var(--accent)' : 'var(--gray-500)'} />
                ))}
              </div>
              <span style={{ fontSize: 14, color: 'var(--gray-300)' }}>{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>

            <div style={{ marginBottom: 28 }}>
              {product.discountPrice > 0 ? (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--accent)' }}>₹{product.discountPrice.toLocaleString()}</span>
                  <span style={{ fontSize: 20, color: 'var(--gray-500)', textDecoration: 'line-through' }}>₹{product.price.toLocaleString()}</span>
                  <span className="badge badge-red">{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF</span>
                </div>
              ) : (
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 48 }}>₹{product.price.toLocaleString()}</span>
              )}
            </div>

            {/* Size Selection */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div className="label">Select Size</div>
                <button style={{ fontSize: 13, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Size Guide</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {product.variants?.map(v => (
                  <button key={v.size} onClick={() => v.stock > 0 && setSelectedSize(v.size)} disabled={v.stock === 0}
                    style={{
                      width: 56, height: 48, border: `1.5px solid ${selectedSize === v.size ? 'var(--accent)' : 'var(--gray-700)'}`,
                      borderRadius: 'var(--radius-sm)', background: selectedSize === v.size ? 'var(--accent-glow)' : 'transparent',
                      color: v.stock === 0 ? 'var(--gray-700)' : selectedSize === v.size ? 'var(--accent)' : 'var(--white)',
                      fontWeight: 700, fontSize: 13, cursor: v.stock === 0 ? 'not-allowed' : 'pointer',
                      textDecoration: v.stock === 0 ? 'line-through' : 'none', transition: 'var(--transition)',
                    }}>
                    {v.size}
                  </button>
                ))}
              </div>
              {selectedVariant && (
                <div style={{ marginTop: 8, fontSize: 13, color: selectedVariant.stock <= 3 ? 'var(--red)' : 'var(--gray-300)' }}>
                  {selectedVariant.stock <= 3 ? `⚠️ Only ${selectedVariant.stock} left!` : `✓ ${selectedVariant.stock} in stock`}
                </div>
              )}
            </div>

            {/* Qty */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div className="label">Qty</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
                <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 700 }}>{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className={`btn ${addedToCart ? 'btn-outline' : 'btn-primary'}`} style={{ flex: 1 }} onClick={handleAddToCart}>
                {addedToCart ? <><Check size={18} /> Added!</> : <><ShoppingBag size={18} /> Add to Bag</>}
              </button>
              {isAuthenticated && (
                <button className={`btn btn-outline btn-icon`} style={{ width: 52, height: 52 }} onClick={() => dispatch(toggleWishlist(product._id))}>
                  <Heart size={20} fill={isWishlisted ? 'var(--red)' : 'none'} color={isWishlisted ? 'var(--red)' : 'currentColor'} />
                </button>
              )}
            </div>

            {/* Description */}
            <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--gray-700)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>About this shoe</h3>
              <p style={{ color: 'var(--gray-300)', fontSize: 15, lineHeight: 1.8 }}>{product.description}</p>

              {product.features?.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div className="label" style={{ marginBottom: 10 }}>Features</div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {product.features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--gray-300)' }}>
                        <Check size={14} color="var(--accent)" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <h2 className="heading-lg" style={{ marginBottom: 32 }}>Customer Reviews</h2>
            <div style={{ display: 'grid', gap: 16 }}>
              {product.reviews.map(r => (
                <div key={r._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--gray-700)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 20, color: '#000' }}>
                      {r.name?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= r.rating ? 'var(--accent)' : 'transparent'} color={s <= r.rating ? 'var(--accent)' : 'var(--gray-500)'} />)}
                      </div>
                    </div>
                  </div>
                  <p style={{ color: 'var(--gray-300)', fontSize: 14 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
