import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Star, ShoppingCart, Info, Minus, Plus } from 'lucide-react';

const BookDetailModal = ({ book, onClose }) => {
  const { addToCart } = useContext(AppContext);
  const [quantity, setQuantity] = useState(1);

  if (!book) return null;

  const handleIncrement = () => {
    if (quantity < book.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(book, quantity);
    onClose();
  };

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2;
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<Star key={i} size={15} fill="var(--accent)" color="var(--accent)" />);
      } else {
        stars.push(<Star key={i} size={15} color="rgba(255, 255, 255, 0.2)" />);
      }
    }
    return stars;
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(5, 6, 10, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div 
        className="glass-panel anim-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '32px',
          background: 'rgba(18, 20, 36, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'var(--shadow-lg)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-main)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            zIndex: 10
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)'}
        >
          <X size={20} />
        </button>

        {/* Cover Column */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#16182a',
          borderRadius: '16px',
          overflow: 'hidden',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.03)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <img 
            src={book.coverUrl} 
            alt={book.title} 
            style={{
              width: '100%',
              maxWidth: '240px',
              height: '340px',
              objectFit: 'cover',
              borderRadius: '8px',
              boxShadow: '0 12px 24px rgba(0,0,0,0.5)'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
            }}
          />
        </div>

        {/* Details Column */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Genre & Rating */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <span className="badge badge-genre">{book.genre}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {renderStars(book.rating)}
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: 500 }}>
                  {book.rating} Rating
                </span>
              </div>
            </div>

            {/* Title & Author */}
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: '1.25',
              marginTop: '6px'
            }}>
              {book.title}
            </h3>
            
            <p style={{
              fontSize: '1rem',
              color: 'var(--primary-hover)',
              fontWeight: 500
            }}>
              by {book.author}
            </p>

            {/* Description */}
            <div style={{
              marginTop: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <h5 style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600
              }}>
                Synopsis
              </h5>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                lineHeight: '1.6',
                opacity: 0.9
              }}>
                {book.description}
              </p>
            </div>
          </div>

          {/* Checkout Block */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.04)',
            padding: '20px',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Price</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)' }}>
                  ${book.price.toFixed(2)}
                </span>
              </div>

              <div>
                {book.stock === 0 ? (
                  <span className="badge badge-outstock" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Out of stock</span>
                ) : book.stock <= 5 ? (
                  <span className="badge badge-lowstock" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Only {book.stock} Left</span>
                ) : (
                  <span className="badge badge-instock" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>{book.stock} in Stock</span>
                )}
              </div>
            </div>

            {book.stock > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                marginTop: '4px'
              }}>
                {/* Quantity adjuster */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(15, 17, 28, 0.6)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  padding: '4px'
                }}>
                  <button 
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-main)',
                      width: '28px',
                      height: '28px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: quantity <= 1 ? 0.3 : 1
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{
                    width: '36px',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  }}>
                    {quantity}
                  </span>
                  <button 
                    onClick={handleIncrement}
                    disabled={quantity >= book.stock}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-main)',
                      width: '28px',
                      height: '28px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: quantity >= book.stock ? 0.3 : 1
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Purchase Button */}
                <button 
                  onClick={handleAddToCart}
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    gap: '8px',
                    height: '42px'
                  }}
                >
                  <ShoppingCart size={16} />
                  Add to Cart — ${(book.price * quantity).toFixed(2)}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;
