import express from 'express';
import Order from '../models/Order.js';
import Book from '../models/Book.js';

const router = express.Router();

// Helper to generate a unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `NN-${timestamp}-${random}`;
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { items, shippingDetails, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items found' });
    }

    if (!shippingDetails || !shippingDetails.fullName || !shippingDetails.address || !shippingDetails.phone) {
      return res.status(400).json({ message: 'Shipping details are incomplete' });
    }

    // Double check books stock and update stock
    for (const item of items) {
      const book = await Book.findById(item.bookId);
      if (!book) {
        return res.status(404).json({ message: `Book with ID ${item.bookId} not found` });
      }
      if (book.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for book "${book.title}". Available: ${book.stock}` });
      }
    }

    // Decrement stocks
    for (const item of items) {
      await Book.findByIdAndUpdate(item.bookId, {
        $inc: { stock: -item.quantity }
      });
    }

    const orderNumber = generateOrderNumber();

    const newOrder = new Order({
      orderNumber,
      items,
      shippingDetails,
      paymentMethod: 'COD', // Cash on Delivery is default and mandatory
      totalAmount: Number(totalAmount)
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error while placing order', error: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public (simplified for development)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching orders', error: error.message });
  }
});

export default router;
