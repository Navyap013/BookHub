import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FaThumbsUp, FaReply } from 'react-icons/fa';
import io from 'socket.io-client';

const ForumPost = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchPost();
    const socket = io('http://localhost:5000');
    socket.emit('join-room', id);
    socket.on('comment-added', () => fetchPost());
    socket.on('reply-added', () => fetchPost());
    return () => socket.disconnect();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/forum/${id}`);
      setPost(res.data.post);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    try {
      await api.post(`/forum/${id}/comment`, { content: comment });
      toast.success('Comment added!');
      setComment('');
      fetchPost();
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleReply = async (commentId) => {
    if (!user) {
      toast.error('Please login to reply');
      return;
    }

    try {
      await api.post(`/forum/${id}/comment/${commentId}/reply`, { content: replyContent });
      toast.success('Reply added!');
      setReplyContent('');
      setReplyTo(null);
      fetchPost();
    } catch (error) {
      toast.error('Failed to add reply');
    }
  };

  const handleUpvote = async () => {
    if (!user) {
      toast.error('Please login to upvote');
      return;
    }

    try {
      await api.post(`/forum/${id}/upvote`);
      fetchPost();
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{post.user?.name || 'Anonymous'}</span>
              <span>{post.genre}</span>
              <span>{post.readingClub}</span>
            </div>
            <button
              onClick={handleUpvote}
              className="flex items-center text-gray-600 hover:text-primary-600"
            >
              <FaThumbsUp className="mr-2" />
              {post.upvotes?.length || 0}
            </button>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        </div>

        {user && (
          <form onSubmit={handleComment} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              required
            />
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              Post Comment
            </button>
          </form>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Comments ({post.comments?.length || 0})</h2>
          {post.comments?.map((comment) => (
            <div key={comment._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-semibold">{comment.user?.name || 'Anonymous'}</span>
                </div>
                <button
                  onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                  className="text-primary-600 hover:text-primary-700 flex items-center text-sm"
                >
                  <FaReply className="mr-1" />
                  Reply
                </button>
              </div>
              <p className="text-gray-700 mb-4">{comment.content}</p>

              {replyTo === comment._id && user && (
                <div className="mb-4 pl-4 border-l-2 border-primary-200">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                  />
                  <button
                    onClick={() => handleReply(comment._id)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm"
                  >
                    Post Reply
                  </button>
                </div>
              )}

              {comment.replies?.length > 0 && (
                <div className="pl-4 border-l-2 border-gray-200 mt-4 space-y-2">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="bg-gray-50 p-3 rounded">
                      <div className="flex items-center mb-1">
                        <span className="font-semibold text-sm">{reply.user?.name || 'Anonymous'}</span>
                      </div>
                      <p className="text-sm text-gray-700">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForumPost;

