import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--gray-700)', padding: '64px 0 32px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 16 }}>
              KICKS<span style={{ color: 'var(--accent)' }}>CART</span>
            </div>
            <p style={{ color: 'var(--gray-300)', fontSize: 14, lineHeight: 1.8, maxWidth: 280 }}>
              The future of sneaker culture. Premium kicks, unmatched style, delivered to your door.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="btn btn-ghost btn-icon" style={{ border: '1px solid var(--gray-700)' }}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: 'Shop', links: [['All Shoes', '/products'], ['Running', '/products?category=Running'], ['Basketball', '/products?category=Basketball'], ['Limited Edition', '/products?category=Limited+Edition']] },
            { title: 'Account', links: [['Sign In', '/login'], ['Register', '/register'], ['My Orders', '/orders'], ['Wishlist', '/wishlist']] },
            { title: 'Support', links: [['FAQ', '#'], ['Size Guide', '#'], ['Returns', '#'], ['Contact', '#']] },
          ].map(col => (
            <div key={col.title}>
              <div className="label" style={{ marginBottom: 20 }}>{col.title}</div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} style={{ color: 'var(--gray-300)', fontSize: 14, transition: 'var(--transition)' }}
                      onMouseEnter={e => e.target.style.color = 'var(--white)'}
                      onMouseLeave={e => e.target.style.color = 'var(--gray-300)'}
                    >{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--gray-700)', paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ color: 'var(--gray-500)', fontSize: 13 }}>© 2025 KicksCart. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <a key={t} href="#" style={{ color: 'var(--gray-500)', fontSize: 13 }}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
