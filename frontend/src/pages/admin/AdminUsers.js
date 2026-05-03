import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AdminLayout } from './AdminDashboard';
import api from '../../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users').then(res => { setUsers(res.data.users); setLoading(false); }).catch(() => { toast.error('Failed to load users'); setLoading(false); });
  }, []);

  return (
    <AdminLayout>
      <h1 className="heading-lg" style={{ marginBottom: 32 }}>Users</h1>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--gray-700)', borderRadius: 'var(--radius-lg)', overflow: 'auto' }}>
        {loading ? <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
          <table className="data-table">
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 18, color: '#000', flexShrink: 0 }}>
                        {u.name?.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--gray-300)', fontSize: 13 }}>{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-accent' : 'badge-gray'}`}>{u.role}</span></td>
                  <td style={{ color: 'var(--gray-300)', fontSize: 13 }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td><span className={`badge ${u.isActive ? 'badge-accent' : 'badge-red'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
