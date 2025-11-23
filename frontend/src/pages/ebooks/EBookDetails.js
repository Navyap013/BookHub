import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FaBook, FaLock, FaUnlock, FaDownload, FaStar, FaChevronLeft } from 'react-icons/fa';

const EBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [ebook, setEbook] = useState(null);
  const [accessInfo, setAccessInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEBook();
    if (user) {
      checkAccess();
    }
  }, [id, user]);

  const fetchEBook = async () => {
    try {
      const res = await api.get(`/ebooks/${id}`);
      setEbook(res.data.ebook);
    } catch (error) {
      toast.error('E-book not found');
      navigate('/ebooks');
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = async () => {
    try {
      const res = await api.get(`/ebooks/${id}/check-access`);
      setAccessInfo(res.data);
    } catch (error) {
      console.error('Error checking access:', error);
    }
  };

  const handleUnlock = async () => {
    try {
      await api.post(`/ebooks/${id}/unlock`);
      toast.success('E-book unlocked successfully!');
      checkAccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to unlock e-book');
    }
  };

  const handleDownload = async () => {
    try {
      const res = await api.post(`/ebooks/${id}/download`);
      window.open(res.data.downloadUrl, '_blank');
      toast.success('Download started!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to download');
    }
  };

  const handleRead = async () => {
    if (!accessInfo?.hasAccess) {
      toast.error('Please unlock this e-book first');
      return;
    }

    try {
      await api.post(`/ebooks/${id}/access`);
      // Open e-book in new tab or reader
      window.open(ebook.fileUrl, '_blank');
    } catch (error) {
      console.error('Error accessing e-book:', error);
      window.open(ebook.fileUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!ebook) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <FaChevronLeft className="mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 p-8 bg-gray-100 flex items-center justify-center">
              {ebook.coverImage ? (
                <img src={ebook.coverImage} alt={ebook.title} className="max-w-full h-auto rounded-lg shadow-md" />
              ) : (
                <FaBook className="text-8xl text-gray-400" />
              )}
            </div>

            <div className="md:w-2/3 p-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">{ebook.title}</h1>
                {accessInfo?.hasAccess ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                    <FaUnlock className="mr-1" />
                    Unlocked
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center">
                    <FaLock className="mr-1" />
                    Locked
                  </span>
                )}
              </div>

              <p className="text-xl text-gray-600 mb-4">by {ebook.author}</p>

              <div className="flex items-center mb-4">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="text-gray-600">
                  {ebook.rating?.average?.toFixed(1) || '0.0'} ({ebook.rating?.count || 0} reviews)
                </span>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">{ebook.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">File Type:</span> {ebook.fileType}
                  </div>
                  {ebook.pages > 0 && (
                    <div>
                      <span className="font-semibold">Pages:</span> {ebook.pages}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">Unlock Method:</span> {ebook.unlockMethod}
                  </div>
                  {ebook.class && (
                    <div>
                      <span className="font-semibold">Class:</span> {ebook.class}
                    </div>
                  )}
                  {ebook.isFree && (
                    <div>
                      <span className="font-semibold">Price:</span> <span className="text-green-600">Free</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                {accessInfo?.hasAccess ? (
                  <>
                    <button
                      onClick={handleRead}
                      className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 flex items-center justify-center"
                    >
                      <FaBook className="mr-2" />
                      Read Online
                    </button>
                    <button
                      onClick={handleDownload}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                    >
                      <FaDownload className="mr-2" />
                      Download
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleUnlock}
                    className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 flex items-center justify-center"
                  >
                    <FaUnlock className="mr-2" />
                    Unlock E-Book
                  </button>
                )}
              </div>

              {!accessInfo?.hasAccess && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    {ebook.unlockMethod === 'free' && 'This e-book is free to unlock.'}
                    {ebook.unlockMethod === 'class' && `This e-book is available for students in ${ebook.class}.`}
                    {ebook.unlockMethod === 'purchase' && 'Purchase the physical book to unlock this e-book.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EBookDetails;

