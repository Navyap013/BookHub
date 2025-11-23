import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FaBook, FaStar, FaArrowRight, FaGraduationCap, FaChild } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [personalized, setPersonalized] = useState({
    basedOnHistory: [],
    basedOnWishlist: [],
    trending: [],
    popular: [],
  });
  const [loading, setLoading] = useState(true);
  const [recoLoading, setRecoLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  const fetchBooks = async () => {
    try {
      const [featured, trending, recent] = await Promise.all([
        api.get('/books/featured/list'),
        api.get('/books/trending/list'),
        api.get('/books/recent/list')
      ]);

      setFeaturedBooks(featured.data.books);
      setTrendingBooks(trending.data.books);
      setRecentBooks(recent.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    setRecoLoading(true);
    try {
      const res = await api.get('/recommendations');
      setPersonalized(res.data.recommendations || {});
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setRecoLoading(false);
    }
  };

  const BookCard = ({ book }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
    >
      <Link to={`/books/${book._id}`}>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="text-sm">{book.rating?.average?.toFixed(1) || '0.0'}</span>
            </div>
            <span className="font-bold text-primary-600">₹{book.price}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to BookHub 2.0
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Your Ultimate Destination for Books and Learning
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/books"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Browse Books
              </Link>
              <Link
                to="/student-library"
                className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors"
              >
                Student Library
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/books" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FaBook className="text-4xl text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Browse All Books</h3>
              <p className="text-gray-600">Discover thousands of books across all genres</p>
            </Link>
            <Link to="/student-library" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FaGraduationCap className="text-4xl text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Student Library</h3>
              <p className="text-gray-600">Academic books from Pre-KG to Class 12</p>
            </Link>
            <Link to="/prekg-zone" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FaChild className="text-4xl text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Pre-KG Zone</h3>
              <p className="text-gray-600">Colorful, fun learning for little ones</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      {featuredBooks.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Featured Books</h2>
              <Link to="/books?featured=true" className="text-primary-600 hover:text-primary-700 flex items-center">
                View All <FaArrowRight className="ml-2" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {featuredBooks.slice(0, 6).map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Books */}
      {trendingBooks.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Trending Now</h2>
              <Link to="/books?trending=true" className="text-primary-600 hover:text-primary-700 flex items-center">
                View All <FaArrowRight className="ml-2" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {trendingBooks.slice(0, 6).map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Added */}
      {recentBooks.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Recently Added</h2>
              <Link to="/books?recentlyAdded=true" className="text-primary-600 hover:text-primary-700 flex items-center">
                View All <FaArrowRight className="ml-2" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {recentBooks.slice(0, 6).map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Personalized Recommendations */}
      {user && (personalized.basedOnHistory?.length > 0 ||
        personalized.basedOnWishlist?.length > 0 ||
        personalized.popular?.length > 0) && (
        <section className="py-12 bg-primary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Recommended for You</h2>
              {recoLoading && (
                <span className="text-sm text-primary-600">Updating recommendations...</span>
              )}
            </div>

            {personalized.basedOnHistory?.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Based on your reading & purchases</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {personalized.basedOnHistory.slice(0, 6).map((book) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
              </div>
            )}

            {personalized.basedOnWishlist?.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Because you liked similar books</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {personalized.basedOnWishlist.slice(0, 6).map((book) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
              </div>
            )}

            {personalized.popular?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Highly Rated by Other Readers</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {personalized.popular.slice(0, 6).map((book) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

