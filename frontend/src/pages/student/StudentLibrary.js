import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaStar, FaFilter, FaSearch } from 'react-icons/fa';
import studentBooks from '../../data/studentBooks';

const StudentLibrary = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    class: '',
    subject: '',
    language: 'English',
    sort: 'newest'
  });

  useEffect(() => {
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      setBooks(studentBooks);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const filteredBooks = filterAndSortBooks(books);
    setFilteredBooks(filteredBooks);
  }, [books, filters, searchTerm]);

  const filterAndSortBooks = (books) => {
    let result = [...books];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(book => 
        book.title.toLowerCase().includes(term) || 
        book.author.toLowerCase().includes(term) ||
        (book.description && book.description.toLowerCase().includes(term))
      );
    }
    
    // Apply class filter
    if (filters.class) {
      result = result.filter(book => book.class === filters.class);
    }
    
    // Apply subject filter
    if (filters.subject) {
      result = result.filter(book => book.subject === filters.subject);
    }
    
    // Apply language filter
    if (filters.language) {
      result = result.filter(book => book.language === filters.language);
    }
    
    // Apply sorting
    if (filters.sort === 'newest') {
      result.sort((a, b) => b.publishedYear - a.publishedYear);
    } else if (filters.sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'rating') {
      result.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
    }
    
    return result;
  };

  const classes = [...new Set(studentBooks.map(book => book.class))].sort((a, b) => {
    const classOrder = [
      'Pre-KG', 'LKG', 'UKG', 
      'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
      'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 
      'Class 11', 'Class 12'
    ];
    return classOrder.indexOf(a) - classOrder.indexOf(b);
  }).filter(cls => cls);

  const subjects = [...new Set(studentBooks.map(book => book.subject).filter(Boolean))].sort();
  const languages = [...new Set(studentBooks.map(book => book.language).filter(Boolean))].sort();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Student Library</h1>

        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search books by title, author, or description..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center">
              <FaFilter className="text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700 mr-2">Filters:</span>
            </div>
            
            <select
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            
            <select
              value={filters.language}
              onChange={(e) => setFilters({ ...filters, language: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Languages</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-auto"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          
          {/* Active filters */}
          {(filters.class || filters.subject || filters.language) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.class && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Class: {filters.class}
                  <button 
                    onClick={() => setFilters({...filters, class: ''})}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-600 hover:bg-blue-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.subject && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Subject: {filters.subject}
                  <button 
                    onClick={() => setFilters({...filters, subject: ''})}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-green-200 text-green-600 hover:bg-green-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.language && filters.language !== 'English' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Language: {filters.language}
                  <button 
                    onClick={() => setFilters({...filters, language: 'English'})}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-purple-200 text-purple-600 hover:bg-purple-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {(filters.class || filters.subject || (filters.language && filters.language !== 'English')) && (
                <button 
                  onClick={() => setFilters({class: '', subject: '', language: 'English'})}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FaBook className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No books found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setFilters({class: '', subject: '', language: 'English', sort: 'newest'});
                  setSearchTerm('');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <motion.div
                key={book._id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <Link to={`/student-library/${book._id}`}>
                  <div className="relative h-72 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {book.coverImage ? (
                      <>
                        <img 
                          src={book.coverImage} 
                          alt={book.title} 
                          className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/200x300?text=No+Cover';
                            e.target.className = 'h-full w-full object-contain p-4';
                          }}
                        />
                        {book.format === 'ebook' && (
                          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            E-book
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400 p-4">
                        <FaBook className="text-6xl mb-2" />
                        <span className="text-xs text-center">No cover available</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 h-10" title={book.title}>
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-1">{book.author}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center">
                        <div className="flex items-center bg-yellow-50 px-2 py-0.5 rounded">
                          <FaStar className="text-yellow-400 text-xs mr-1" />
                          <span className="text-xs font-medium text-yellow-700">
                            {book.rating?.average?.toFixed(1) || '0.0'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          ({book.rating?.count || 0} reviews)
                        </span>
                      </div>
                      <span className="font-bold text-blue-600 text-sm">₹{book.price}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {book.class}
                      </span>
                      {book.subject && (
                        <span className="text-xs text-gray-500 truncate ml-2">
                          {book.subject}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentLibrary;

