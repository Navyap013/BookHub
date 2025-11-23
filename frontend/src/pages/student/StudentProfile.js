import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FaUser, FaGraduationCap, FaBook, FaChartLine, FaUnlock } from 'react-icons/fa';

const StudentProfile = () => {
  const { user, updateProfile, loadUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    studentClass: user?.studentProfile?.class || '',
    address: user?.address || {}
  });
  const [readingProgress, setReadingProgress] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'student') {
      fetchReadingProgress();
    }
  }, [user]);

  const fetchReadingProgress = async () => {
    try {
      // This would fetch from user's reading progress
      // For now, using mock data structure
      setReadingProgress(user?.studentProfile?.readingProgress || []);
    } catch (error) {
      console.error('Error fetching reading progress:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [addressField]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        ...formData,
        studentClass: formData.studentClass
      });
      await loadUser();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const classes = ['Pre-KG', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Student Profile</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-4">
              {user?.name?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Class</label>
              <select
                name="studentClass"
                value={formData.studentClass}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street || ''}
                onChange={handleChange}
                placeholder="Street"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city || ''}
                  onChange={handleChange}
                  placeholder="City"
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state || ''}
                  onChange={handleChange}
                  placeholder="State"
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Reading Progress */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <FaChartLine className="mr-2" />
            Reading Progress
          </h3>
          {readingProgress.length === 0 ? (
            <p className="text-gray-500">No reading progress yet. Start reading books to track your progress!</p>
          ) : (
            <div className="space-y-4">
              {readingProgress.map((progress, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Book {index + 1}</span>
                    <span className="text-primary-600">{progress.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${progress.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* E-Book Library Access */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center">
              <FaUnlock className="mr-2" />
              E-Book Library
            </h3>
            <Link
              to="/ebooks"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              View All →
            </Link>
          </div>
          <p className="text-gray-600 mb-4">
            Access your unlocked e-books. E-books can be unlocked by purchasing physical books, 
            based on your class, or if they're free.
          </p>
          <Link
            to="/ebooks"
            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Go to E-Book Library
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

