import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FaBook, FaMapMarkerAlt, FaUser, FaHeart, FaChevronLeft, FaEdit, FaTrash } from 'react-icons/fa';
import MarketplaceMessaging from '../../components/marketplace/MarketplaceMessaging';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInterested, setIsInterested] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);

  useEffect(() => {
    fetchListing();
    if (user) {
      checkInterest();
    }
  }, [id, user]);

  const fetchListing = async () => {
    try {
      const res = await api.get(`/marketplace/${id}`);
      setListing(res.data.listing);
    } catch (error) {
      toast.error('Listing not found');
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const checkInterest = async () => {
    try {
      const res = await api.get(`/marketplace/${id}`);
      const interested = res.data.listing.interestedUsers?.some(
        userId => userId.toString() === user.id
      );
      setIsInterested(interested);
    } catch (error) {
      console.error('Error checking interest:', error);
    }
  };

  const handleInterest = async () => {
    if (!user) {
      toast.error('Please login to mark interest');
      navigate('/login');
      return;
    }

    try {
      const res = await api.post(`/marketplace/${id}/interest`);
      setIsInterested(res.data.isInterested);
      toast.success(res.data.isInterested ? 'Marked as interested' : 'Removed interest');
      fetchListing();
    } catch (error) {
      toast.error('Failed to update interest');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await api.delete(`/marketplace/${id}`);
        toast.success('Listing deleted');
        navigate('/marketplace');
      } catch (error) {
        toast.error('Failed to delete listing');
      }
    }
  };

  const getConditionColor = (condition) => {
    const colors = {
      'New': 'bg-green-100 text-green-800',
      'Like New': 'bg-blue-100 text-blue-800',
      'Good': 'bg-yellow-100 text-yellow-800',
      'Fair': 'bg-orange-100 text-orange-800',
      'Poor': 'bg-red-100 text-red-800'
    };
    return colors[condition] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!listing) return null;

  const isOwner = user && listing.seller._id === user.id;

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                  <p className="text-xl text-gray-600">by {listing.author}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getConditionColor(listing.condition)}`}>
                  {listing.condition}
                </span>
              </div>

              {listing.images && listing.images.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    {listing.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${listing.title} ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                {listing.category && (
                  <div>
                    <span className="font-semibold">Category:</span> {listing.category}
                  </div>
                )}
                {listing.class && (
                  <div>
                    <span className="font-semibold">Class:</span> {listing.class}
                  </div>
                )}
                {listing.isbn && (
                  <div>
                    <span className="font-semibold">ISBN:</span> {listing.isbn}
                  </div>
                )}
                <div>
                  <span className="font-semibold">Views:</span> {listing.views || 0}
                </div>
              </div>
            </div>

            {showMessaging && (
              <MarketplaceMessaging listingId={id} sellerId={listing.seller._id} />
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <div className="mb-6">
                <div className="text-3xl font-bold text-primary-600 mb-2">₹{listing.price}</div>
                {listing.originalPrice && (
                  <div className="text-gray-500 line-through">₹{listing.originalPrice}</div>
                )}
              </div>

              {isOwner ? (
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/marketplace/${id}/edit`)}
                    className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center justify-center"
                  >
                    <FaEdit className="mr-2" />
                    Edit Listing
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center"
                  >
                    <FaTrash className="mr-2" />
                    Delete Listing
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleInterest}
                    className={`w-full px-4 py-2 rounded-lg flex items-center justify-center ${
                      isInterested
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    <FaHeart className={`mr-2 ${isInterested ? 'fill-current' : ''}`} />
                    {isInterested ? 'Remove Interest' : 'Mark Interest'}
                  </button>
                  <button
                    onClick={() => setShowMessaging(!showMessaging)}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    {showMessaging ? 'Hide Messages' : 'Message Seller'}
                  </button>
                </div>
              )}

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">Seller Information</h3>
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {listing.seller?.name?.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <div>
                    <p className="font-semibold">{listing.seller?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-600">{listing.seller?.email}</p>
                  </div>
                </div>
                {listing.location?.city && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FaMapMarkerAlt className="mr-2" />
                    {listing.location.city}, {listing.location.state}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;

