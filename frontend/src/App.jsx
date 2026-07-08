import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Header from './components/Header';
import Hero from './components/Hero';
import BookFilters from './components/BookFilters';
import BookCard from './components/BookCard';
import BookDetailModal from './components/BookDetailModal';
import CartDrawer from './components/CartDrawer';
import AddBookForm from './components/AddBookForm';
import OrdersList from './components/OrdersList';
import { AlertCircle } from 'lucide-react';

const StoreFront = ({ onViewDetails }) => {
  const { books, loading } = useContext(AppContext);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '24px',
      flex: 1
    }}>
      {loading ? (
        <div style={{
          gridColumn: '1 / -1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '100px 0',
          color: 'var(--text-muted)',
          fontSize: '1.1rem',
          fontWeight: 500
        }}>
          Refreshing catalog shelf...
        </div>
      ) : books.length === 0 ? (
        <div style={{
          gridColumn: '1 / -1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px',
          textAlign: 'center',
          gap: '16px',
          background: 'rgba(255,255,255,0.01)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: '16px'
        }}>
          <AlertCircle size={40} color="var(--accent)" />
          <h4 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No books found</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '300px', lineHeight: 1.5 }}>
            We couldn't find any books matching your search query or filter settings. Try relaxing your filters!
          </p>
        </div>
      ) : (
        books.map((book) => (
          <div key={book._id} className="anim-fade">
            <BookCard book={book} onViewDetails={onViewDetails} />
          </div>
        ))
      )}
    </div>
  );
};

const MainLayout = () => {
  const { activeView, toasts } = useContext(AppContext);
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Navigation Header */}
      <Header />

      {/* Main Panel Content */}
      <main style={{ flex: 1 }}>
        {activeView === 'store' ? (
          <>
            {/* Introductory Banner */}
            <Hero />

            {/* Split Content: Filters + Catalog Grid */}
            <div style={{
              display: 'flex',
              padding: '0 24px',
              gap: '24px',
              alignItems: 'flex-start',
              flexWrap: 'wrap'
            }}>
              {/* Sidebar filter controls */}
              <div style={{
                flex: '0 0 280px',
                width: '100%',
                position: 'sticky',
                top: '124px'
              }}>
                <BookFilters />
              </div>

              {/* Products Shelf */}
              <div style={{ flex: 1, minWidth: '280px' }}>
                <StoreFront onViewDetails={setSelectedBook} />
              </div>
            </div>
          </>
        ) : (
          /* Placed Orders log panel */
          <OrdersList />
        )}
      </main>

      {/* Drawer Overlay for Cart & Checkouts */}
      <CartDrawer />

      {/* Modal Overlay for Catalog Additions */}
      <AddBookForm />

      {/* Modal Overlay for Book Details review */}
      {selectedBook && (
        <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}

      {/* Toast Alert stack popup */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.4, flex: 1 }}>
              {toast.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
