import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Star, ShoppingCart } from 'lucide-react';

const BookCard = ({ book, onViewDetails }) => {
  const { addToCart } = useContext(AppContext);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent opening the details modal when clicking add to cart
    addToCart(book, 1);
  };

  // Build rating stars
  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2; // round to nearest 0.5
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<Star key={i} size={13} fill="var(--accent)" color="var(--accent)" />);
      } else {
        stars.push(<Star key={i} size={13} color="rgba(255, 255, 255, 0.2)" />);
      }
    }
    return stars;
  };

  // Determine stock badge element
  const renderStockBadge = (stock) => {
    if (stock === 0) {
      return <span className="badge badge-outstock">Out of stock</span>;
    } else if (stock <= 5) {
      return <span className="badge badge-lowstock">Only {stock} left</span>;
    } else {
      return <span className="badge badge-instock">In Stock</span>;
    }
  };

  return (
    <div 
      className="glass-card" 
      onClick={() => onViewDetails(book)}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Featured Ribbon */}
      {book.featured && (
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)',
          color: '#ffffff',
          fontSize: '0.65rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '4px 10px',
          borderRadius: '6px',
          boxShadow: '0 4px 10px rgba(139, 92, 246, 0.4)',
          zIndex: 2
        }}>
          Featured
        </span>
      )}

      {/* Book Cover Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '240px',
        overflow: 'hidden',
        background: '#16182a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          zIndex: 2
        }}>
          {renderStockBadge(book.stock)}
        </div>
      </div>

      {/* Info Body */}
      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        gap: '6px'
      }}>
        {/* Genre & Rating */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <span className="badge badge-genre" style={{ fontSize: '0.65rem' }}>{book.genre}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {renderStars(book.rating)}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
              ({book.rating})
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          color: '#ffffff',
          marginTop: '6px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }} title={book.title}>
          {book.title}
        </h4>

        {/* Author */}
        <p style={{
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginBottom: '10px'
        }}>
          by {book.author}
        </p>

        {/* Footer: Price & Cart Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '10px',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--secondary)' }}>
              ${book.price.toFixed(2)}
            </span>
          </div>

          <button 
            onClick={handleAddToCart}
            className="btn btn-primary"
            disabled={book.stock === 0}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              gap: '6px',
              background: book.stock === 0 ? 'rgba(255, 255, 255, 0.03)' : 'var(--primary)'
            }}
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
