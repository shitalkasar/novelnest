import express from 'express';
import Book from '../models/Book.js';

const router = express.Router();

// @desc    Get all books (with search & filtering)
// @route   GET /api/books
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, genre, minPrice, maxPrice, sort } = req.query;
    let query = {};

    // Apply text search
    if (search) {
      query.$text = { $search: search };
    }

    // Apply genre filter
    if (genre && genre !== 'All') {
      query.genre = genre;
    }

    // Apply price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let bookQuery = Book.find(query);

    // Apply sorting
    if (sort) {
      if (sort === 'price-asc') {
        bookQuery = bookQuery.sort({ price: 1 });
      } else if (sort === 'price-desc') {
        bookQuery = bookQuery.sort({ price: -1 });
      } else if (sort === 'latest') {
        bookQuery = bookQuery.sort({ createdAt: -1 });
      } else if (sort === 'rating') {
        bookQuery = bookQuery.sort({ rating: -1 });
      }
    } else {
      // Default to latest
      bookQuery = bookQuery.sort({ createdAt: -1 });
    }

    const books = await bookQuery;
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching books', error: error.message });
  }
});

// @desc    Get a single book by ID
// @route   GET /api/books/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(500).json({ message: 'Server error while fetching book', error: error.message });
  }
});

// @desc    Create a new book
// @route   POST /api/books
// @access  Public (simplified for development)
router.post('/', async (req, res) => {
  try {
    const { title, author, description, price, genre, coverUrl, rating, stock, featured } = req.body;

    if (!title || !author || !description || price === undefined || !genre) {
      return res.status(400).json({ message: 'Please provide title, author, description, price, and genre' });
    }

    const newBook = new Book({
      title,
      author,
      description,
      price: Number(price),
      genre,
      coverUrl: coverUrl || undefined,
      rating: rating ? Number(rating) : undefined,
      stock: stock !== undefined ? Number(stock) : undefined,
      featured: featured || false
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating book', error: error.message });
  }
});

export default router;
