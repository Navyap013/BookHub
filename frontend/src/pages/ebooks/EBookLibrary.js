import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FaBook, FaLock, FaUnlock, FaDownload, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const EBookLibrary = () => {
  const { user } = useContext(AuthContext);
  const [ebooks, setEbooks] = useState([]);
  const [myLibrary, setMyLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my-library'
  const [filters, setFilters] = useState({
    class: '',
    category: '',
    unlockMethod: ''
  });

  useEffect(() => {
    if (activeTab === 'all') {
      fetchEBooks();
    } else {
      fetchMyLibrary();
    }
  }, [activeTab, filters]);

  const fetchEBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      );
      const res = await api.get(`/ebooks?${params}`);
      setEbooks(res.data.ebooks);
    } catch (error) {
      console.error('Error fetching e-books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyLibrary = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/ebooks/my-library');
      setMyLibrary(res.data.ebooks);
    } catch (error) {
      console.error('Error fetching my library:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (ebookId) => {
    try {
      const res = await api.post(`/ebooks/${ebookId}/unlock`);
      toast.success('E-book unlocked successfully!');
      if (activeTab === 'all') {
        fetchEBooks();
      } else {
        fetchMyLibrary();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to unlock e-book');
    }
  };

  const handleDownload = async (ebookId) => {
    try {
      const res = await api.post(`/ebooks/${ebookId}/download`);
      // Open download URL
      window.open(res.data.downloadUrl, '_blank');
      toast.success('Download started!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to download');
    }
  };

  const EBookCard = ({ ebook, isUnlocked = false }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative">
        <div className="h-64 bg-gray-200 flex items-center justify-center">
          {ebook.coverImage ? (
            <img src={ebook.coverImage} alt={ebook.title} className="h-full w-full object-cover" />
          ) : (
            <FaBook className="text-6xl text-gray-400" />
          )}
        </div>
        {isUnlocked && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center">
            <FaUnlock className="mr-1" />
            Unlocked
          </div>
        )}
        {!isUnlocked && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center">
            <FaLock className="mr-1" />
            Locked
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{ebook.title}</h3>
        <p className="text-gray-600 text-sm mb-2">by {ebook.author}</p>
        <div className="flex items-center mb-2">
          <FaStar className="text-yellow-400 mr-1" />
          <span className="text-sm">{ebook.rating?.average?.toFixed(1) || '0.0'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 capitalize">{ebook.unlockMethod}</span>
          {ebook.isFree && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Free</span>}
        </div>
        <div className="mt-3 flex gap-2">
          {isUnlocked ? (
            <button
              onClick={() => handleDownload(ebook._id)}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center justify-center"
            >
              <FaDownload className="mr-2" />
              Download
            </button>
          ) : (
            <button
              onClick={() => handleUnlock(ebook._id)}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center justify-center"
            >
              <FaUnlock className="mr-2" />
              Unlock
            </button>
          )}
          <Link
            to={`/ebooks/${ebook._id}`}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 flex items-center justify-center">
        <div className="text-center">
          <FaBook className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">E-Book Library</h2>
          <p className="text-gray-600 mb-4">Please login to access the e-book library</p>
          <Link to="/login" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">E-Book Library</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'all'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All E-Books
          </button>
          <button
            onClick={() => setActiveTab('my-library')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'my-library'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Library ({myLibrary.length})
          </button>
        </div>

        {/* Filters */}
        {activeTab === 'all' && (
          <div className="mb-6 flex flex-wrap gap-4">
            <select
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Classes</option>
              <option value="Pre-KG">Pre-KG</option>
              <option value="Class 1">Class 1</option>
              <option value="Class 5">Class 5</option>
              <option value="Class 10">Class 10</option>
            </select>
            <select
              value={filters.unlockMethod}
              onChange={(e) => setFilters({ ...filters, unlockMethod: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Types</option>
              <option value="free">Free</option>
              <option value="class">By Class</option>
              <option value="purchase">By Purchase</option>
            </select>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {(activeTab === 'all' ? ebooks : myLibrary).map((ebook) => (
              <EBookCard
                key={ebook._id}
                ebook={ebook}
                isUnlocked={activeTab === 'my-library'}
              />
            ))}
          </div>
        )}

        {!loading && (activeTab === 'all' ? ebooks : myLibrary).length === 0 && (
          <div className="text-center py-20">
            <FaBook className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">
              {activeTab === 'my-library' ? 'No e-books in your library yet' : 'No e-books found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EBookLibrary;

