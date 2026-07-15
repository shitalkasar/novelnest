import React, { createContext, useState, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export const AppContext = createContext();

// Sample books for initial seeding
const sampleBooks = [
  {
    title: 'The Shadow of the Wind',
    author: 'Carlos Ruiz Zafón',
    description: 'In Barcelona, 1945, a young boy named Daniel is taken by his father to the secret Cemetery of Forgotten Books...',
    price: 18.99,
    genre: 'Mystery',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    stock: 12,
    featured: true
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides...',
    price: 14.99,
    genre: 'Sci-Fi',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    stock: 25,
    featured: true
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving—every day.',
    price: 16.20,
    genre: 'Self-Help',
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    stock: 30,
    featured: true
  }
];

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

  // Seed Database if empty
  const seedDatabase = async () => {
    try {
      showToast('Initializing database with sample books...', 'info');
      for (const book of sampleBooks) {
        await addDoc(collection(db, 'books'), { ...book, createdAt: Date.now() });
      }
      showToast('Database ready!', 'success');
    } catch (err) {
      console.error('Error seeding:', err);
    }
  };

  // Fetch books matching current filters from Firestore
  const fetchBooks = useCallback(async (isInitialLoad = false) => {
    setLoading(true);
    try {
      const { search, genre, minPrice, maxPrice, sort } = filters;
      
      // Get all books
      const querySnapshot = await getDocs(collection(db, 'books'));
      let data = querySnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

      // Auto-seed if database is empty on first load
      if (data.length === 0 && isInitialLoad) {
        await seedDatabase();
        const newSnapshot = await getDocs(collection(db, 'books'));
        data = newSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
      }

      // Client-side filtering
      if (search.trim()) {
        const lowerSearch = search.toLowerCase();
        data = data.filter(b => b.title?.toLowerCase().includes(lowerSearch) || b.author?.toLowerCase().includes(lowerSearch));
      }
      if (genre && genre !== 'All') {
        data = data.filter(b => b.genre === genre);
      }
      if (minPrice) {
        data = data.filter(b => b.price >= Number(minPrice));
      }
      if (maxPrice) {
        data = data.filter(b => b.price <= Number(maxPrice));
      }

      // Client-side sorting
      if (sort === 'price-asc') data.sort((a, b) => a.price - b.price);
      else if (sort === 'price-desc') data.sort((a, b) => b.price - a.price);
      else if (sort === 'rating') data.sort((a, b) => b.rating - a.rating);
      else data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); // latest

      setBooks(data);

      // Extract unique genres for filtering from raw response
      if (genre === 'All' && !search && !minPrice && !maxPrice) {
        const uniqueGenres = ['All', ...new Set(data.map((b) => b.genre))];
        setGenres(uniqueGenres);
      }
    } catch (err) {
      console.error(err);
      showToast('Could not retrieve catalog. Is Firebase configured?', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  // Fetch orders from Firestore
  const fetchOrders = useCallback(async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
      setOrders(data);
    } catch (err) {
      console.error(err);
      showToast('Could not load orders log.', 'error');
    }
  }, [showToast]);

  // Initial loads
  useEffect(() => {
    fetchBooks(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount for initial load

  useEffect(() => {
    fetchBooks(false);
  }, [filters, fetchBooks]);

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
    const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const orderPayload = {
      orderNumber,
      items: cart.map((i) => ({
        bookId: i.bookId,
        title: i.title,
        price: i.price,
        quantity: i.quantity
      })),
      shippingDetails,
      totalAmount,
      createdAt: Date.now(),
      status: 'Processing'
    };

    try {
      // 1. Create order
      const docRef = await addDoc(collection(db, 'orders'), orderPayload);
      const data = { _id: docRef.id, ...orderPayload };
      
      // 2. Decrement stock for each book in cart
      for (const item of cart) {
        const bookRef = doc(db, 'books', item.bookId);
        await updateDoc(bookRef, {
          stock: item.stock - item.quantity
        });
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
      showToast('Could not checkout order', 'error');
      return { success: false, error: err.message };
    }
  };

  // Add new product
  const addBook = async (bookData) => {
    try {
      const newBook = {
        ...bookData,
        price: Number(bookData.price),
        stock: Number(bookData.stock),
        rating: Number(bookData.rating || 0),
        createdAt: Date.now()
      };

      const docRef = await addDoc(collection(db, 'books'), newBook);
      const data = { _id: docRef.id, ...newBook };

      showToast(`"${data.title}" added to catalog`, 'success');
      fetchBooks(); // Refresh catalog
      setIsAddBookOpen(false);
      return { success: true, book: data };
    } catch (err) {
      console.error(err);
      showToast('Could not add book', 'error');
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

