import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import CheckoutForm from './CheckoutForm';

const CartDrawer = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart 
  } = useContext(AppContext);

  const [isCheckout, setIsCheckout] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = 0; // Free delivery for standard promo
  const total = subtotal + tax + shipping;

  return (
    <div 
      onClick={() => setIsCartOpen(false)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(5, 6, 10, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <div 
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          borderRadius: '24px 0 0 24px',
          background: 'rgba(18, 20, 36, 0.98)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.5)',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '1.25rem',
            fontWeight: 700
          }}>
            <ShoppingBag size={20} color="var(--primary-hover)" />
            {isCheckout ? 'Shipping Details' : 'Shopping Cart'}
          </h3>
          <button 
            onClick={() => { setIsCartOpen(false); setIsCheckout(false); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.03)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        {cart.length === 0 ? (
          /* Empty State */
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            textAlign: 'center',
            gap: '16px'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              padding: '24px',
              borderRadius: '50%',
              color: 'var(--text-muted)'
            }}>
              <ShoppingBag size={48} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Your cart is empty</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '280px', lineHeight: 1.5 }}>
              Looks like you haven't added anything to your cart yet. Explore our shelves and find your next read!
            </p>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="btn btn-primary"
              style={{ marginTop: '12px', fontSize: '0.9rem' }}
            >
              Start Shopping
            </button>
          </div>
        ) : isCheckout ? (
          /* Checkout view */
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px'
          }}>
            <CheckoutForm onBack={() => setIsCheckout(false)} totalAmount={total} />
          </div>
        ) : (
          /* Cart items list view */
          <>
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {cart.map((item) => (
                <div 
                  key={item.bookId}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    alignItems: 'center'
                  }}
                >
                  {/* Book Image */}
                  <img 
                    src={item.coverUrl} 
                    alt={item.title} 
                    style={{
                      width: '60px',
                      height: '84px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
                    }}
                  />

                  {/* Info details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.title}
                    </h4>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--secondary)',
                      fontWeight: 700,
                      marginTop: '2px'
                    }}>
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginTop: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '6px',
                        padding: '2px'
                      }}>
                        <button 
                          onClick={() => updateCartQuantity(item.bookId, item.quantity - 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-main)',
                            width: '22px',
                            height: '22px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.8rem', width: '24px', textAlign: 'center', fontWeight: 600 }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateCartQuantity(item.bookId, item.quantity + 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-main)',
                            width: '22px',
                            height: '22px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button 
                    onClick={() => removeFromCart(item.bookId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '8px',
                      borderRadius: '8px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Calculations and Actions Footer */}
            <div style={{
              padding: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'rgba(15, 17, 28, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {/* Calculations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span>Estimated Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span>Shipping</span>
                  <span style={{ color: 'var(--secondary)' }}>FREE</span>
                </div>
                <div style={{
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '1.15rem', 
                  fontWeight: 800,
                  color: '#ffffff',
                  marginTop: '6px',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(255,255,255,0.04)'
                }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--secondary)' }}>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Secure tags */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                background: 'rgba(255,255,255,0.01)',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.02)'
              }}>
                <ShieldCheck size={16} color="var(--secondary)" />
                <span>Only Cash on Delivery supported. Pay securely when it arrives.</span>
              </div>

              {/* Checkout Trigger button */}
              <button 
                onClick={() => setIsCheckout(true)}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  height: '46px',
                  fontSize: '0.95rem',
                  gap: '10px'
                }}
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
