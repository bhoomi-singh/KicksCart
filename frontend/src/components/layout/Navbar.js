import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Search, User, Heart, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { toggleCart } from '../../store/slices/cartSlice';
import { selectCartCount } from '../../store/slices/cartSlice';
import { toggleMobileMenu, closeMobileMenu } from '../../store/slices/uiSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const cartCount = useSelector(selectCartCount);
  const { mobileMenuOpen } = useSelector(s => s.ui);
  const [scrolled, setScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?keyword=${searchVal}`);
      setSearchVal('');
    }
  };

  return (
    <nav className="navbar" style={{ boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.5)' : 'none' }}>
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          KICKS<span>CART</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-nav">
          <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} end>Home</NavLink>
          <NavLink to="/products" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Shop</NavLink>
          <NavLink to="/products?category=Running" className="nav-link">Running</NavLink>
          <NavLink to="/products?category=Limited+Edition" className="nav-link">Limited</NavLink>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, maxWidth: 280, position: 'relative' }}>
          <input
            value={searchVal} onChange={e => setSearchVal(e.target.value)}
            placeholder="Search kicks…"
            className="form-input" style={{ width: '100%', padding: '9px 40px 9px 14px', fontSize: 13 }}
          />
          <button type="submit" className="btn-ghost btn-icon" style={{ position: 'absolute', right: 0, top: 0, bottom: 0 }}>
            <Search size={16} />
          </button>
        </form>

        {/* Actions */}
        <div className="navbar-actions">
          {isAuthenticated && (
            <Link to="/wishlist" className="btn btn-ghost btn-icon" title="Wishlist">
              <Heart size={20} />
            </Link>
          )}

          <button className="btn btn-ghost btn-icon cart-btn" onClick={() => dispatch(toggleCart())} title="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>

          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: 4 }}>
              <Link to="/profile" className="btn btn-ghost btn-icon" title="Profile">
                <User size={20} />
              </Link>
              {(user?.role === 'admin' || user?.role === 'superadmin') && (
                <Link to="/admin" className="btn btn-ghost btn-icon" title="Admin">
                  <LayoutDashboard size={20} />
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-ghost btn-icon" title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
          )}

          <button className="btn btn-ghost btn-icon" style={{ display: 'none' }} onClick={() => dispatch(toggleMobileMenu())}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--gray-700)', padding: '16px 24px' }}>
          <Link to="/" className="nav-link" style={{ display: 'block', padding: '12px 0' }} onClick={() => dispatch(closeMobileMenu())}>Home</Link>
          <Link to="/products" className="nav-link" style={{ display: 'block', padding: '12px 0' }} onClick={() => dispatch(closeMobileMenu())}>Shop</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="nav-link" style={{ display: 'block', padding: '12px 0' }}>Profile</Link>
              <Link to="/orders" className="nav-link" style={{ display: 'block', padding: '12px 0' }}>Orders</Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', marginTop: 8 }}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ display: 'block', marginTop: 8, textAlign: 'center' }}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}
