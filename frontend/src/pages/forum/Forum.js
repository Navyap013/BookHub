import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { FaThumbsUp, FaComment, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Forum = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    genre: '',
    readingClub: '',
    sort: 'newest'
  });

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      );
      const res = await api.get(`/forum?${params}`);
      setPosts(res.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (postId) => {
    if (!user) {
      alert('Please login to upvote');
      return;
    }

    try {
      await api.post(`/forum/${postId}/upvote`);
      fetchPosts();
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Book Discussion Forum</h1>
          {user && (
            <Link
              to="/forum/create"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
            >
              <FaPlus className="mr-2" />
              New Post
            </Link>
          )}
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <select
            value={filters.genre}
            onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
          </select>
          <select
            value={filters.readingClub}
            onChange={(e) => setFilters({ ...filters, readingClub: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Clubs</option>
            <option value="Fiction Club">Fiction Club</option>
            <option value="Science Club">Science Club</option>
            <option value="History Club">History Club</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <motion.div
                key={post._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <Link to={`/forum/${post._id}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{post.content}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <img
                          src={post.user?.avatar || ''}
                          alt={post.user?.name}
                          className="w-8 h-8 rounded-full mr-2 bg-primary-600 text-white flex items-center justify-center"
                        />
                        <span>{post.user?.name || 'Anonymous'}</span>
                      </div>
                      <span>{post.genre}</span>
                      <span>{post.readingClub}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleUpvote(post._id);
                        }}
                        className="flex items-center text-gray-600 hover:text-primary-600"
                      >
                        <FaThumbsUp className="mr-2" />
                        {post.upvotes?.length || 0}
                      </button>
                      <div className="flex items-center text-gray-600">
                        <FaComment className="mr-2" />
                        {post.comments?.length || 0}
                      </div>
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

export default Forum;

