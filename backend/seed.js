import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';
import Order from './models/Order.js';

dotenv.config();

const sampleBooks = [
  {
    title: 'The Shadow of the Wind',
    author: 'Carlos Ruiz Zafón',
    description: 'In Barcelona, 1945, a young boy named Daniel is taken by his father to the secret Cemetery of Forgotten Books. There, he chooses a book that will change the course of his life, dragging him into a dark web of mystery, murder, and doom.',
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
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness.',
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
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    price: 16.20,
    genre: 'Self-Help',
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    stock: 30,
    featured: true
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    description: 'Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom. Her family was so isolated from mainstream society that there was no one to ensure the children received an education. When one of her brothers got into college, Tara decided to try a new kind of life.',
    price: 15.50,
    genre: 'Biography',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
    rating: 4.6,
    stock: 8,
    featured: false
  },
  {
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    description: 'Alicia Berenson\'s life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house in one of London\'s most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word.',
    price: 12.99,
    genre: 'Mystery',
    coverUrl: 'https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?auto=format&fit=crop&q=80&w=400',
    rating: 4.5,
    stock: 15,
    featured: false
  },
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission to save humanity from an extinction-level event. Only, right now, he doesn\'t know that. He can\'t even remember his own name, let alone the nature of his assignment or how to complete it. All he knows is that he\'s been asleep for a very, very long time.',
    price: 19.95,
    genre: 'Sci-Fi',
    coverUrl: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    stock: 18,
    featured: true
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'Set in the glamorous, roaring twenties on Long Island, F. Scott Fitzgerald\'s masterpiece chronicles the tragic story of Jay Gatsby, a self-made millionaire, and his pursuit of Daisy Buchanan, the wealthy young woman he loved in his youth.',
    price: 9.99,
    genre: 'Classics',
    coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=400',
    rating: 4.4,
    stock: 20,
    featured: false
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    description: 'Daniel Kahneman, recipient of the Nobel Prize in Economic Sciences, takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think. System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and more logical.',
    price: 21.00,
    genre: 'Self-Help',
    coverUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400',
    rating: 4.6,
    stock: 10,
    featured: false
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected for seeding.');

    // Clear existing collections
    await Book.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing books and orders.');

    // Seed books
    await Book.insertMany(sampleBooks);
    console.log('Seeded sample books successfully!');

    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding database:', error);
    process.exit(1);
  }
};

seedDB();
