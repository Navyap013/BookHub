import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FaHeart, FaTrash, FaBook } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      const res = await api.get('/favourites');
      setFavourites(res.data.favourites);
    } catch (error) {
      console.error('Error fetching favourites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavourite = async (favouriteId) => {
    try {
      await api.delete(`/favourites/${favouriteId}`);
      toast.success('Removed from favourites');
      fetchFavourites();
    } catch (error) {
      toast.error('Failed to remove favourite');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <FaHeart className="text-red-500 mr-3" />
          My Favourites
        </h1>

        {favourites.length === 0 ? (
          <div className="text-center py-20">
            <FaHeart className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No favourites yet</p>
            <Link to="/books" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {favourites.map((fav) => {
              const book = fav.book || fav.studentBook;
              if (!book) return null;

              return (
                <motion.div
                  key={fav._id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden relative"
                >
                  <button
                    onClick={() => removeFavourite(fav._id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 z-10"
                  >
                    <FaTrash className="text-red-500" />
                  </button>
                  <Link to={fav.book ? `/books/${book._id}` : `/student-library/${book._id}`}>
                    <div className="h-64 bg-gray-200 flex items-center justify-center">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                      ) : (
                        <FaBook className="text-6xl text-gray-400" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
                      <span className="font-bold text-primary-600">₹{book.price}</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourites;

