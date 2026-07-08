import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X, BookPlus, AlignLeft, Image, DollarSign, Archive, Award } from 'lucide-react';

const AddBookForm = () => {
  const { isAddBookOpen, setIsAddBookOpen, addBook } = useContext(AppContext);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    price: '',
    stock: '10',
    coverUrl: '',
    rating: '4.5',
    description: '',
    featured: false
  });

  const [loading, setLoading] = useState(false);

  if (!isAddBookOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim() || !formData.author.trim() || !formData.genre.trim() || 
        !formData.price.trim() || !formData.description.trim()) {
      alert('Please fill out Title, Author, Genre, Price, and Description.');
      return;
    }

    setLoading(true);
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      rating: Number(formData.rating),
      coverUrl: formData.coverUrl.trim() || undefined
    };

    const res = await addBook(payload);
    setLoading(false);

    if (res.success) {
      // Reset form
      setFormData({
        title: '',
        author: '',
        genre: '',
        price: '',
        stock: '10',
        coverUrl: '',
        rating: '4.5',
        description: '',
        featured: false
      });
    }
  };

  return (
    <div 
      onClick={() => setIsAddBookOpen(false)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(5, 6, 10, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1200,
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
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          background: 'rgba(18, 20, 36, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          paddingBottom: '16px'
        }}>
          <h3 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '1.25rem',
            fontWeight: 700
          }}>
            <BookPlus size={22} color="var(--primary-hover)" />
            Add New Book to Shelf
          </h3>
          <button 
            onClick={() => setIsAddBookOpen(false)}
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Row 1: Title & Author */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Book Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. The Hobbit"
                value={formData.title}
                onChange={handleChange}
                className="glass-input"
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Author Name *</label>
              <input
                type="text"
                name="author"
                placeholder="e.g. J.R.R. Tolkien"
                value={formData.author}
                onChange={handleChange}
                className="glass-input"
                required
              />
            </div>
          </div>

          {/* Row 2: Genre & Price */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Genre / Category *</label>
              <input
                type="text"
                name="genre"
                placeholder="e.g. Fantasy, Sci-Fi, Mystery"
                value={formData.genre}
                onChange={handleChange}
                className="glass-input"
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Price ($) *</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={14} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="number"
                  name="price"
                  placeholder="12.99"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ paddingLeft: '32px' }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 3: Stock & Rating */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Stock Quantity</label>
              <div style={{ position: 'relative' }}>
                <Archive size={14} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="number"
                  name="stock"
                  placeholder="10"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ paddingLeft: '32px' }}
                />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Initial Rating (0-5)</label>
              <div style={{ position: 'relative' }}>
                <Award size={14} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="number"
                  name="rating"
                  placeholder="4.5"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ paddingLeft: '32px' }}
                />
              </div>
            </div>
          </div>

          {/* Row 4: Cover Image URL */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Cover Image URL</label>
            <div style={{ position: 'relative' }}>
              <Image size={14} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="url"
                name="coverUrl"
                placeholder="https://images.unsplash.com/... (optional)"
                value={formData.coverUrl}
                onChange={handleChange}
                className="glass-input"
                style={{ paddingLeft: '32px' }}
              />
            </div>
          </div>

          {/* Row 5: Description */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Description *</label>
            <div style={{ position: 'relative' }}>
              <AlignLeft size={14} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '16px' }} />
              <textarea
                name="description"
                placeholder="Brief synopsis of the book..."
                value={formData.description}
                onChange={handleChange}
                className="glass-input"
                rows="4"
                style={{ paddingLeft: '32px', resize: 'vertical' }}
                required
              />
            </div>
          </div>

          {/* Row 6: Featured Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              style={{
                width: '18px',
                height: '18px',
                accentColor: 'var(--primary)',
                cursor: 'pointer'
              }}
            />
            <label htmlFor="featured" style={{ fontSize: '0.9rem', color: 'var(--text-main)', cursor: 'pointer', userSelect: 'none' }}>
              Mark as Featured Book (will display custom badge & highlights)
            </label>
          </div>

          {/* Footer buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '20px',
            marginTop: '10px'
          }}>
            <button 
              type="button" 
              onClick={() => setIsAddBookOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding Book...' : 'Add to Shelf'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookForm;
