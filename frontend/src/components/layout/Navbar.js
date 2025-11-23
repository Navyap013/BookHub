import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaBook, FaShoppingCart, FaHeart, FaUser, FaSignOutAlt, FaBars, FaTimes, FaChevronDown, FaBookOpen, FaGraduationCap, FaChild } from 'react-icons/fa';
import api from '../../utils/api';
import EnhancedSearchBar from '../search/EnhancedSearchBar';

// Book categories with featured books and cover images
const bookCategories = [
  { 
    name: 'Pre-KG', 
    icon: <FaChild className="mr-2" />, 
    path: '/prekg-zone',
    featuredBook: {
      title: 'The Very Hungry Caterpillar',
      author: 'Eric Carle',
      cover: 'https://covers.openlibrary.org/b/id/12842404-L.jpg',
      isbn: '9780399208539'
    }
  },
  { 
    name: 'KG to 2nd', 
    icon: <FaBookOpen className="mr-2" />, 
    path: '/books?class=kg-2',
    featuredBook: {
      title: 'Green Eggs and Ham',
      author: 'Dr. Seuss',
      cover: 'https://covers.openlibrary.org/b/id/8263736-L.jpg',
      isbn: '9780394800165'
    }
  },
  { 
    name: '3rd to 5th', 
    icon: <FaGraduationCap className="mr-2" />, 
    path: '/books?class=3-5',
    featuredBook: {
      title: 'Charlotte\'s Web',
      author: 'E.B. White',
      cover: 'https://covers.openlibrary.org/b/id/8264304-L.jpg',
      isbn: '9780061124952'
    }
  },
  { 
    name: '6th to 8th', 
    icon: <FaGraduationCap className="mr-2" />, 
    path: '/books?class=6-8',
    featuredBook: {
      title: 'The Giver',
      author: 'Lois Lowry',
      cover: 'https://covers.openlibrary.org/b/id/249747-L.jpg',
      isbn: '9780544336261'
    }
  },
  { 
    name: '9th to 10th', 
    icon: <FaGraduationCap className="mr-2" />, 
    path: '/books?class=9-10',
    featuredBook: {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      cover: 'https://covers.openlibrary.org/b/id/7904045-L.jpg',
      isbn: '9780061120084'
    }
  },
  { 
    name: '11th to 12th', 
    icon: <FaGraduationCap className="mr-2" />, 
    path: '/books?class=11-12',
    featuredBook: {
      title: '1984',
      author: 'George Orwell',
      cover: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
      isbn: '9780451524935'
    }
  },
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  React.useEffect(() => {
    if (user) {
      fetchCartCount();
    }
  }, [user]);

  const fetchCartCount = async () => {
    try {
      const res = await api.get('/cart');
      const totalItems = res.data.cart.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaBook className="text-blue-600 text-2xl" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">BookHub 2.0</span>
          </Link>

          {/* Enhanced Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <EnhancedSearchBar />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/prekg-zone" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-lg hover:bg-blue-50 flex items-center"
            >
              <FaChild className="mr-2" />
              Pre-KG Books
            </Link>
            
            <Link to="/student-library" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-lg hover:bg-blue-50">Student Library</Link>
            
            <div className="relative group">
              <Link to="/ebooks" className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-lg hover:bg-blue-50">
                E-Books
                {user && <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">New</span>}
              </Link>
            </div>
            
            <Link to="/marketplace" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-lg hover:bg-blue-50">Marketplace</Link>
            <Link to="/forum" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-lg hover:bg-blue-50">Forum</Link>

            {user ? (
              <div className="flex items-center space-x-1 ml-2">
                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                  <FaShoppingCart className="text-xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/favourites" className="p-2 text-gray-600 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
                  <FaHeart className="text-xl" />
                </Link>
                
                {user.role === 'admin' && (
                  <Link to="/admin" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:opacity-90 transition-opacity">
                    Admin Panel
                  </Link>
                )}
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline">{user.name.split(' ')[0]}</span>
                    <FaChevronDown className="text-xs text-gray-500" />
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    {user.role === 'student' && (
                      <Link to="/student-profile" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <FaUser className="mr-3 text-gray-400" />
                        My Profile
                      </Link>
                    )}
                    <Link to="/orders" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <FaShoppingCart className="mr-3 text-gray-400" />
                      My Orders
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <FaSignOutAlt className="mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <EnhancedSearchBar />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-gray-50">
          <div className="px-2 pt-2 pb-4 space-y-1">
            <div className="px-3 py-2">
            <Link 
              to="/prekg-zone"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg group"
            >
              <FaChild className="mr-3 text-blue-500 group-hover:text-blue-600" />
              Pre-KG Books
            </Link>
          </div>
            
            <div className="border-t border-gray-100 my-2"></div>
            
            <Link to="/student-library" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg group">
              <FaBookOpen className="mr-3 text-blue-500 group-hover:text-blue-600" />
              Student Library
            </Link>
            
            <Link to="/ebooks" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg group">
              <FaBook className="mr-3 text-blue-500 group-hover:text-blue-600" />
              E-Books
              {user && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">New</span>}
            </Link>
            
            <Link to="/marketplace" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg group">
              <FaShoppingCart className="mr-3 text-blue-500 group-hover:text-blue-600" />
              Marketplace
            </Link>
            
            <Link to="/forum" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg group">
              <FaUser className="mr-3 text-blue-500 group-hover:text-blue-600" />
              Community Forum
            </Link>
            {user ? (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                <div className="px-3 py-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">My Account</h3>
                  <div className="space-y-1">
                    <Link to="/cart" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg group">
                      <FaShoppingCart className="mr-3 text-blue-500 group-hover:text-blue-600" />
                      My Cart
                      {cartCount > 0 && <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{cartCount} items</span>}
                    </Link>
                    <Link to="/favourites" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg group">
                      <FaHeart className="mr-3 text-red-400 group-hover:text-red-500" />
                      Favourites
                    </Link>
                    <Link to="/orders" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg group">
                      <FaShoppingCart className="mr-3 text-blue-500 group-hover:text-blue-600" />
                      My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg group">
                        <FaUser className="mr-3 text-blue-500 group-hover:text-blue-600" />
                        Admin Dashboard
                      </Link>
                    )}
                    {user.role === 'student' && (
                      <Link to="/student-profile" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg group">
                        <FaUser className="mr-3 text-blue-500 group-hover:text-blue-600" />
                        My Profile
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg group"
                    >
                      <FaSignOutAlt className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="px-3 pt-4 pb-2 border-t border-gray-100">
                <div className="space-y-2">
                  <Link 
                    to="/login" 
                    className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

