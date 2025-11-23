import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { FaBook, FaStar } from 'react-icons/fa';

const PreKGZone = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get('/student-books/prekg/list');
      setBooks(res.data.books);
    } catch (error) {
      console.error('Error fetching Pre-KG books:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-purple-600 mb-4">🌟 Pre-KG Zone 🌟</h1>
          <p className="text-2xl text-purple-500">Fun Learning for Little Ones!</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {books.map((book) => (
              <motion.div
                key={book._id}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-yellow-300"
              >
                <Link to={`/student-library/${book._id}`}>
                  <div className="h-56 bg-gradient-to-br from-yellow-200 to-pink-200 flex items-center justify-center p-4">
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <div className="text-center">
                        <span className="text-6xl">📚</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-bold text-lg mb-2 text-purple-600 line-clamp-2">{book.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="text-sm">{book.rating?.average?.toFixed(1) || '0.0'}</span>
                      </div>
                      <span className="font-bold text-green-600 text-lg">₹{book.price}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {books.length === 0 && !loading && (
          <div className="text-center py-20">
            <span className="text-8xl mb-4 block">🎨</span>
            <p className="text-2xl text-purple-600 font-semibold">More books coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreKGZone;

