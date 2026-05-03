import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid, List } from 'lucide-react';
import { fetchProducts, setFilters } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';

const CATEGORIES = ['Running', 'Casual', 'Basketball', 'Training', 'Lifestyle', 'Limited Edition'];
const GENDERS = ['Men', 'Women', 'Unisex', 'Kids'];
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductsPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { products, loading, total, page, pages, filters } = useSelector(s => s.products);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);

  // Sync URL params to filters
  useEffect(() => {
    const params = {};
    ['keyword', 'category', 'gender'].forEach(k => { if (searchParams.get(k)) params[k] = searchParams.get(k); });
    if (Object.keys(params).length > 0) dispatch(setFilters(params));
  }, [searchParams, dispatch]);

  useEffect(() => {
    const params = { page: currentPage, limit: 12 };
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.category) params.category = filters.category;
    if (filters.gender) params.gender = filters.gender;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.sort && filters.sort !== 'newest') params.sort = filters.sort;
    dispatch(fetchProducts(params));
  }, [filters, currentPage, dispatch]);

  const handleFilter = (key, value) => {
    dispatch(setFilters({ [key]: filters[key] === value ? '' : value }));
    setCurrentPage(1);
  };

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--gray-700)', padding: '32px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="section-tag">KicksCart Store</div>
              <h1 className="display-md">All Sneakers</h1>
              <p style={{ color: 'var(--gray-300)', fontSize: 14, marginTop: 4 }}>{total} styles available</p>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <select className="form-select" style={{ minWidth: 180 }}
                value={filters.sort} onChange={e => dispatch(setFilters({ sort: e.target.value }))}>
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <div style={{ display: 'grid', gridTemplateColumns: showFilters ? '240px 1fr' : '1fr', gap: 32 }}>
          {/* Sidebar Filters */}
          {showFilters && (
            <aside>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--gray-700)', borderRadius: 'var(--radius-lg)', padding: 24, position: 'sticky', top: 88 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 24 }}>Filters</h3>

                {/* Category */}
                <div style={{ marginBottom: 28 }}>
                  <div className="label" style={{ marginBottom: 12 }}>Category</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => handleFilter('category', cat)}
                        className={`filter-chip ${filters.category === cat ? 'active' : ''}`}
                        style={{ textAlign: 'left', borderRadius: 'var(--radius-sm)' }}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div style={{ marginBottom: 28 }}>
                  <div className="label" style={{ marginBottom: 12 }}>Gender</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {GENDERS.map(g => (
                      <button key={g} onClick={() => handleFilter('gender', g)}
                        className={`filter-chip ${filters.gender === g ? 'active' : ''}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div style={{ marginBottom: 28 }}>
                  <div className="label" style={{ marginBottom: 12 }}>Price Range (₹)</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input className="form-input" type="number" placeholder="Min"
                      value={filters.minPrice} onChange={e => dispatch(setFilters({ minPrice: e.target.value }))}
                      style={{ width: '100%' }} />
                    <input className="form-input" type="number" placeholder="Max"
                      value={filters.maxPrice} onChange={e => dispatch(setFilters({ maxPrice: e.target.value }))}
                      style={{ width: '100%' }} />
                  </div>
                </div>

                <button className="btn btn-outline" style={{ width: '100%' }}
                  onClick={() => { dispatch(setFilters({ category: '', gender: '', minPrice: '', maxPrice: '' })); setCurrentPage(1); }}>
                  Clear Filters
                </button>
              </div>
            </aside>
          )}

          {/* Products */}
          <div>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 24 }}>
                {Array(8).fill(0).map((_, i) => (
                  <div key={i}>
                    <div className="skeleton" style={{ height: 260, borderRadius: 'var(--radius-lg)', marginBottom: 12 }} />
                    <div className="skeleton" style={{ height: 16, width: '70%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 14, width: '50%' }} />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--gray-300)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>👟</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No products found</h3>
                <p>Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 }}>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`btn ${currentPage === p ? 'btn-primary' : 'btn-outline'} btn-sm`}>
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
