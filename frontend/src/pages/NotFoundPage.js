import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{ paddingTop: 68, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(120px, 20vw, 220px)', lineHeight: 1, color: 'var(--gray-700)', marginBottom: 16 }}>404</div>
        <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 12 }}>Page Not Found</h2>
        <p style={{ color: 'var(--gray-300)', marginBottom: 40 }}>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary btn-lg">Back to Home <ArrowRight size={18} /></Link>
      </div>
    </div>
  );
}
