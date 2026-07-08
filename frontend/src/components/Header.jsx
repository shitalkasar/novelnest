import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { BookOpen, ShoppingCart, Plus, Search, ClipboardList } from 'lucide-react';

const Header = () => {
  const { 
    cart, 
    setIsCartOpen, 
    setIsAddBookOpen, 
    activeView, 
    setActiveView, 
    filters, 
    setFilters 
  } = useContext(AppContext);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: '16px',
      margin: '16px 24px 0 24px',
      zIndex: 100,
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
      flexWrap: 'wrap'
    }}>
      {/* Brand Logo */}
      <div 
        onClick={() => { setActiveView('store'); setFilters(f => ({ ...f, search: '', genre: 'All' })); }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
        }}
      >
        <div style={{
          background: 'var(--primary)',
          padding: '8px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px var(--primary-glow)'
        }}>
          <BookOpen size={22} color="#fff" />
        </div>
        <div>
          <h1 style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            background: 'linear-gradient(to right, #ffffff, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>NovelNest</h1>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginTop: '-2px' }}>Bookstore E-Com</span>
        </div>
      </div>

      {/* Middle Section: Search Input (Only relevant in store view) */}
      <div style={{
        flex: 1,
        maxWidth: '400px',
        minWidth: '240px',
        position: 'relative'
      }}>
        <Search size={18} color="var(--text-muted)" style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }} />
        <input
          type="text"
          placeholder="Search by title, author, description..."
          className="glass-input"
          value={filters.search}
          onChange={handleSearchChange}
          style={{
            paddingLeft: '44px',
            fontSize: '0.9rem'
          }}
        />
      </div>

      {/* Right Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* Navigation Tabs */}
        <button 
          onClick={() => setActiveView('store')}
          className={`btn ${activeView === 'store' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <BookOpen size={16} />
          Store
        </button>

        <button 
          onClick={() => setActiveView('orders')}
          className={`btn ${activeView === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <ClipboardList size={16} />
          Orders
        </button>

        {/* Add Book Action */}
        <button 
          onClick={() => setIsAddBookOpen(true)}
          className="btn btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.85rem', borderColor: 'rgba(139, 92, 246, 0.3)' }}
        >
          <Plus size={16} color="var(--primary-hover)" />
          Add Book
        </button>

        {/* Cart Drawer Trigger */}
        <button 
          onClick={() => setIsCartOpen(true)}
          className="btn btn-primary"
          style={{ 
            padding: '8px 16px', 
            fontSize: '0.85rem', 
            position: 'relative',
            background: 'linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)'
          }}
        >
          <ShoppingCart size={16} />
          Cart
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: 'var(--secondary)',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              minWidth: '20px',
              height: '20px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 6px',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)',
              border: '2px solid var(--bg-main)'
            }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
