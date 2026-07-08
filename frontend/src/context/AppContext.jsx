import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AppContext = createContext();
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState(['All']);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('store'); // 'store' or 'orders'
  
  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    genre: 'All',
    minPrice: '',
    maxPrice: '',
    sort: 'latest'
  });

  // Shopping Cart State: loaded from localStorage if exists
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('novelnest_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Save cart changes to localStorage
  useEffect(() => {
    localStorage.setItem('novelnest_cart', JSON.stringify(cart));
  }, [cart]);

  // Toast notification trigger
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // Fetch books matching current filters
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const { search, genre, minPrice, maxPrice, sort } = filters;
      const params = new URLSearchParams();
      
      if (search.trim()) params.append('search', search.trim());
      if (genre && genre !== 'All') params.append('genre', genre);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sort) params.append('sort', sort);

      const res = await fetch(`${API_BASE}/books?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch books');
      const data = await res.json();
      setBooks(data);

      // Extract unique genres for filtering from raw response (if all books are shown)
      if (genre === 'All' && !search && !minPrice && !maxPrice) {
        const uniqueGenres = ['All', ...new Set(data.map((b) => b.genre))];
        setGenres(uniqueGenres);
      }
    } catch (err) {
      console.error(err);
      showToast('Could not retrieve catalog. Is backend online?', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  // Fetch orders from database
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      showToast('Could not load orders log.', 'error');
    }
  }, [showToast]);

  // Initial loads
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    if (activeView === 'orders') {
      fetchOrders();
    }
  }, [activeView, fetchOrders]);

  // Cart operations
  const addToCart = (book, quantity = 1) => {
    const qty = Number(quantity);
    if (book.stock <= 0) {
      showToast(`"${book.title}" is currently out of stock`, 'error');
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.bookId === book._id);
      if (existing) {
        const newQty = existing.quantity + qty;
        if (newQty > book.stock) {
          showToast(`Cannot add more. Only ${book.stock} items available in stock.`, 'error');
          return prevCart;
        }
        showToast(`Updated quantity for "${book.title}" in cart`, 'success');
        return prevCart.map((item) =>
          item.bookId === book._id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (qty > book.stock) {
          showToast(`Only ${book.stock} items available.`, 'error');
          return prevCart;
        }
        showToast(`Added "${book.title}" to cart`, 'success');
        return [
          ...prevCart,
          {
            bookId: book._id,
            title: book.title,
            price: book.price,
            quantity: qty,
            coverUrl: book.coverUrl,
            stock: book.stock
          }
        ];
      }
    });
  };

  const updateCartQuantity = (bookId, quantity) => {
    const qty = Math.max(1, Number(quantity));
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.bookId === bookId);
      if (!item) return prevCart;
      
      if (qty > item.stock) {
        showToast(`Insufficient stock! Maximum available: ${item.stock}`, 'error');
        return prevCart.map((i) => i.bookId === bookId ? { ...i, quantity: item.stock } : i);
      }

      return prevCart.map((i) =>
        i.bookId === bookId ? { ...i, quantity: qty } : i
      );
    });
  };

  const removeFromCart = (bookId) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.bookId === bookId);
      if (item) {
        showToast(`Removed "${item.title}" from cart`, 'info');
      }
      return prevCart.filter((i) => i.bookId !== bookId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Checkout order submission
  const placeOrder = async (shippingDetails) => {
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderPayload = {
      items: cart.map((i) => ({
        bookId: i.bookId,
        title: i.title,
        price: i.price,
        quantity: i.quantity
      })),
      shippingDetails,
      totalAmount
    };

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error submitting order');
      }

      showToast(`Order placed successfully! Order: ${data.orderNumber}`, 'success');
      clearCart();
      setIsCartOpen(false);
      
      // Refresh book listing to reflect decremented stock
      fetchBooks();
      
      // Redirect to orders screen
      setActiveView('orders');
      return { success: true, order: data };
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Could not checkout order', 'error');
      return { success: false, error: err.message };
    }
  };

  // Add new product
  const addBook = async (bookData) => {
    try {
      const res = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error creating book');
      }

      showToast(`"${data.title}" added to catalog`, 'success');
      fetchBooks(); // Refresh catalog
      setIsAddBookOpen(false);
      return { success: true, book: data };
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Could not add book', 'error');
      return { success: false, error: err.message };
    }
  };

  return (
    <AppContext.Provider
      value={{
        books,
        genres,
        orders,
        loading,
        filters,
        setFilters,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        addBook,
        isCartOpen,
        setIsCartOpen,
        isAddBookOpen,
        setIsAddBookOpen,
        activeView,
        setActiveView,
        toasts,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
