import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FaStar, FaHeart, FaShoppingCart, FaStarHalfAlt, FaChevronLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [similarBooks, setSimilarBooks] = useState([]);

  useEffect(() => {
    fetchBook();
    fetchReviews();
    if (user) {
      checkFavourite();
    }
  }, [id, user]);

  const fetchBook = async () => {
    try {
      const res = await api.get(`/books/${id}`);
      setBook(res.data.book);
      // Fetch similar books by category (simple content-based recommendation)
      if (res.data.book?.category) {
        const similarRes = await api.get('/books', {
          params: {
            category: res.data.book.category,
            limit: 8,
          },
        });
        // Filter out the current book from similar list
        const filtered = similarRes.data.books.filter((b) => b._id !== res.data.book._id);
        setSimilarBooks(filtered);
      }
    } catch (error) {
      toast.error('Book not found');
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/book/${id}`);
      setReviews(res.data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkFavourite = async () => {
    try {
      const res = await api.get(`/favourites/check?bookId=${id}`);
      setIsFavourite(res.data.isFavourite);
    } catch (error) {
      console.error('Error checking favourite:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await api.post('/cart', { bookId: id, quantity: 1 });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleToggleFavourite = async () => {
    if (!user) {
      toast.error('Please login to add favourites');
      navigate('/login');
      return;
    }

    try {
      if (isFavourite) {
        const res = await api.get(`/favourites/check?bookId=${id}`);
        if (res.data.favouriteId) {
          await api.delete(`/favourites/${res.data.favouriteId}`);
          setIsFavourite(false);
          toast.success('Removed from favourites');
        }
      } else {
        await api.post('/favourites', { bookId: id });
        setIsFavourite(true);
        toast.success('Added to favourites');
      }
    } catch (error) {
      toast.error('Failed to update favourites');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }

    try {
      await api.post('/reviews', {
        bookId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      setShowReviewForm(false);
      fetchReviews();
      fetchBook();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<FaStar key={i} className="text-gray-300" />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!book) return null;

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
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="max-w-full h-auto rounded-lg shadow-md" />
              ) : (
                <div className="text-center text-gray-400">
                  <p className="text-6xl mb-4">📚</p>
                  <p>No Image</p>
                </div>
              )}
            </div>

            <div className="md:w-2/3 p-8">
              <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

              <div className="flex items-center mb-4">
                {renderStars(book.rating?.average || 0)}
                <span className="ml-2 text-gray-600">
                  {book.rating?.average?.toFixed(1) || '0.0'} ({book.rating?.count || 0} reviews)
                </span>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-primary-600">₹{book.price}</span>
                {book.originalPrice && book.originalPrice > book.price && (
                  <>
                    <span className="ml-2 text-gray-500 line-through">₹{book.originalPrice}</span>
                    <span className="ml-2 text-green-600 font-semibold">
                      {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% off
                    </span>
                  </>
                )}
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">{book.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Category:</span> {book.category}
                  </div>
                  <div>
                    <span className="font-semibold">Language:</span> {book.language}
                  </div>
                  {book.publisher && (
                    <div>
                      <span className="font-semibold">Publisher:</span> {book.publisher}
                    </div>
                  )}
                  {book.pages && (
                    <div>
                      <span className="font-semibold">Pages:</span> {book.pages}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">Stock:</span> {book.stock > 0 ? `${book.stock} available` : 'Out of stock'}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleToggleFavourite}
                  className={`px-6 py-3 rounded-lg border-2 flex items-center justify-center ${
                    isFavourite
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-gray-300 text-gray-700 hover:border-red-500'
                  }`}
                >
                  <FaHeart className={isFavourite ? 'fill-current' : ''} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>
            {user && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                Write a Review
              </button>
            )}
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rating</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Similar Books / You May Also Like */}
        {similarBooks.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {similarBooks.slice(0, 5).map((similar) => (
                <div
                  key={similar._id}
                  onClick={() => navigate(`/books/${similar._id}`)}
                  className="cursor-pointer bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
                >
                  <div className="h-40 bg-gray-200 flex items-center justify-center">
                    {similar.coverImage ? (
                      <img
                        src={similar.coverImage}
                        alt={similar.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <p className="text-3xl">📚</p>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm line-clamp-2">{similar.title}</p>
                    <p className="text-xs text-gray-600 mb-1">by {similar.author}</p>
                    <p className="text-primary-600 font-bold text-sm">₹{similar.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;

