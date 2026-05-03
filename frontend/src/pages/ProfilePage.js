import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Package, Heart, MapPin, Settings, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { getMe } from '../store/slices/authSlice';

const NAV = [
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Package, label: 'Orders', path: '/orders' },
  { icon: Heart, label: 'Wishlist', path: '/wishlist' },
];

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.password) payload.password = form.password;
      await api.put('/users/profile', payload);
      await dispatch(getMe());
      toast.success('Profile updated!');
      setForm(f => ({ ...f, password: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh', paddingBottom: 80 }}>
      <div className="container" style={{ paddingTop: 48 }}>
        <h1 className="display-md" style={{ marginBottom: 40 }}>My Account</h1>
        <div className="profile-grid">
          {/* Sidebar */}
          <aside>
            <div className="profile-sidebar">
              <div className="profile-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{user?.name}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-300)' }}>{user?.email}</div>
                <span className="badge badge-accent" style={{ marginTop: 8 }}>{user?.role}</span>
              </div>
              {NAV.map(({ icon: Icon, label, path }) => (
                <Link key={path} to={path} className="profile-nav-link">
                  <Icon size={16} /> {label}
                </Link>
              ))}
            </div>
          </aside>

          {/* Main */}
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--gray-700)', borderRadius: 'var(--radius-lg)', padding: 32 }}>
              <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Settings size={20} color="var(--accent)" /> Edit Profile
              </h2>
              <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email (read-only)</label>
                    <input className="form-input" value={user?.email || ''} readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--gray-700)', paddingTop: 24 }}>
                  <h3 style={{ fontWeight: 600, marginBottom: 16, fontSize: 15 }}>Change Password</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input className="form-input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Leave blank to keep current" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm Password</label>
                      <input className="form-input" type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repeat new password" />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={loading}>
                  {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><Save size={16} /> Save Changes</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
