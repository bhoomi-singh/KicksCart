import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutDashboard, Package, ShoppingBag, Users, TrendingUp, DollarSign, RefreshCw } from 'lucide-react';
import api from '../../utils/api';

const ADMIN_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
  { icon: Users, label: 'Users', path: '/admin/users' },
];

function AdminLayout({ children }) {
  const location = useLocation();
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 32 }}>
          KICKS<span style={{ color: 'var(--accent)' }}>CART</span>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--gray-300)', letterSpacing: 2, marginTop: 2 }}>ADMIN PANEL</div>
        </div>
        {ADMIN_NAV.map(({ icon: Icon, label, path }) => (
          <Link key={path} to={path}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 'var(--radius-sm)', marginBottom: 4, fontWeight: 600, fontSize: 14, color: location.pathname === path ? 'var(--accent)' : 'var(--gray-300)', background: location.pathname === path ? 'var(--accent-glow)' : 'transparent', transition: 'var(--transition)' }}>
            <Icon size={16} /> {label}
          </Link>
        ))}
      </aside>
      <main className="admin-content">{children}</main>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(res => { setStats(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { icon: DollarSign, label: 'Total Revenue', value: `₹${stats.stats.totalRevenue?.toLocaleString()}`, color: '#c8f53d' },
    { icon: ShoppingBag, label: 'Total Orders', value: stats.stats.totalOrders, color: '#00c8ff' },
    { icon: Users, label: 'Customers', value: stats.stats.totalUsers, color: '#ff6464' },
    { icon: Package, label: 'Products', value: stats.stats.totalProducts, color: '#ffaa00' },
  ] : [];

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div>
          <h1 className="heading-lg">Dashboard</h1>
          <p style={{ color: 'var(--gray-300)', fontSize: 14, marginTop: 4 }}>Welcome back, Admin!</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => window.location.reload()}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" /></div>
      ) : (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
            {statCards.map(card => (
              <div key={card.label} className="stat-card">
                <div className="stat-icon" style={{ background: `${card.color}20` }}>
                  <card.icon size={22} color={card.color} />
                </div>
                <div className="stat-value">{card.value}</div>
                <div className="stat-label">{card.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Recent Orders */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--gray-700)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontWeight: 700, fontSize: 16 }}>Recent Orders</h2>
                <Link to="/admin/orders" style={{ fontSize: 13, color: 'var(--accent)' }}>View All</Link>
              </div>
              {stats?.recentOrders?.slice(0, 6).map(order => (
                <div key={order._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>#{order._id?.slice(-6).toUpperCase()}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-300)' }}>{order.user?.name}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className={`badge status-${order.orderStatus}`} style={{ fontSize: 11 }}>{order.orderStatus}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>₹{order.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Top Products */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--gray-700)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontWeight: 700, fontSize: 16 }}>Top Selling Products</h2>
                <Link to="/admin/products" style={{ fontSize: 13, color: 'var(--accent)' }}>Manage</Link>
              </div>
              {stats?.topProducts?.map((product, i) => (
                <div key={product._id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? 'var(--accent)' : 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: i === 0 ? '#000' : 'var(--gray-300)', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{product.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-300)' }}>{product.sold} units sold</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>₹{product.price?.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export { AdminLayout };
