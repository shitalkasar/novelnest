import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Filter, DollarSign, ArrowUpDown, X } from 'lucide-react';

const BookFilters = () => {
  const { genres, filters, setFilters } = useContext(AppContext);

  const handleGenreSelect = (genre) => {
    setFilters((prev) => ({ ...prev, genre }));
  };

  const handlePriceChange = (e, field) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sort: e.target.value }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      genre: 'All',
      minPrice: '',
      maxPrice: '',
      sort: 'latest'
    });
  };

  const isFiltered = filters.search || filters.genre !== 'All' || filters.minPrice || filters.maxPrice || filters.sort !== 'latest';

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      height: 'fit-content',
      position: 'sticky',
      top: '124px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      minWidth: '260px'
    }}>
      {/* Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        paddingBottom: '14px'
      }}>
        <h3 style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '1.1rem',
          fontWeight: 700
        }}>
          <Filter size={18} color="var(--primary-hover)" />
          Filters
        </h3>
        {isFiltered && (
          <button 
            onClick={handleReset}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--danger-hover)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <X size={12} />
            Reset
          </button>
        )}
      </div>

      {/* Genres Section */}
      <div>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Genre</h4>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {genres.map((g) => {
            const isSelected = filters.genre === g;
            return (
              <button
                key={g}
                onClick={() => handleGenreSelect(g)}
                style={{
                  textAlign: 'left',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                  background: isSelected ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  color: isSelected ? 'var(--primary-hover)' : 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: isSelected ? 600 : 400,
                  fontSize: '0.9rem',
                  transition: 'all 0.15s ease'
                }}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Section */}
      <div>
        <h4 style={{ 
          fontSize: '0.9rem', 
          color: 'var(--text-muted)', 
          marginBottom: '12px', 
          fontWeight: 600, 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <DollarSign size={14} />
          Price Range
        </h4>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <input
            type="number"
            placeholder="Min ($)"
            value={filters.minPrice}
            onChange={(e) => handlePriceChange(e, 'minPrice')}
            className="glass-input"
            style={{ fontSize: '0.85rem', padding: '8px 12px' }}
            min="0"
          />
          <span style={{ color: 'var(--text-muted)' }}>—</span>
          <input
            type="number"
            placeholder="Max ($)"
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange(e, 'maxPrice')}
            className="glass-input"
            style={{ fontSize: '0.85rem', padding: '8px 12px' }}
            min="0"
          />
        </div>
      </div>

      {/* Sorting Section */}
      <div>
        <h4 style={{ 
          fontSize: '0.9rem', 
          color: 'var(--text-muted)', 
          marginBottom: '12px', 
          fontWeight: 600, 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <ArrowUpDown size={14} />
          Sort By
        </h4>
        <select
          value={filters.sort}
          onChange={handleSortChange}
          className="glass-input glass-select"
          style={{ fontSize: '0.85rem', padding: '10px 14px' }}
        >
          <option value="latest">Latest Additions</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Customer Rated</option>
        </select>
      </div>
    </div>
  );
};

export default BookFilters;
