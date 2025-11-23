import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaFire } from 'react-icons/fa';
import api from '../../utils/api';
import VoiceSearch from './VoiceSearch';

const EnhancedSearchBar = ({ className = '' }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showTrending, setShowTrending] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    fetchTrendingSearches();
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      fetchSuggestions();
      setShowSuggestions(true);
      setShowTrending(false);
    } else {
      setSuggestions([]);
      if (searchQuery.length === 0) {
        setShowTrending(true);
        setShowSuggestions(false);
      } else {
        setShowSuggestions(false);
        setShowTrending(false);
      }
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setShowTrending(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await api.get(`/search/suggestions?q=${encodeURIComponent(searchQuery)}&limit=5`);
      setSuggestions(res.data.suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const fetchTrendingSearches = async () => {
    try {
      const res = await api.get('/search/trending?limit=5');
      setTrending(res.data.trending || []);
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Log the search
      try {
        await api.post('/search/log', {
          query: searchQuery.trim(),
          searchType: 'all'
        });
      } catch (error) {
        // Ignore logging errors
      }

      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setShowTrending(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    handleSearch(new Event('submit'));
  };

  const handleTrendingClick = (trend) => {
    setSearchQuery(trend);
    handleSearch(new Event('submit'));
  };

  const handleVoiceTranscript = (transcript) => {
    setSearchQuery(transcript);
    // Auto-search after voice input
    setTimeout(() => {
      const form = document.createElement('form');
      form.method = 'POST';
      form.onsubmit = handleSearch;
      const event = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(event);
      handleSearch(event);
    }, 100);
  };

  const handleVoiceError = (error) => {
    console.error('Voice search error:', error);
    // Could show a toast notification here
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSearch} className="flex">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.length === 0) {
                setShowTrending(true);
              } else if (searchQuery.length >= 2) {
                setShowSuggestions(true);
              }
            }}
            placeholder="Search books, authors, or topics..."
            className="w-full px-4 py-2 pl-10 pr-20 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setShowSuggestions(false);
              }}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <div className="flex">
          <VoiceSearch
            onTranscript={handleVoiceTranscript}
            onError={handleVoiceError}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 flex items-center"
          >
            <FaSearch />
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {(showSuggestions || showTrending) && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {showTrending && trending.length > 0 && (
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FaFire className="text-orange-500 mr-2" />
                Trending Searches
              </div>
              <div className="space-y-1">
                {trending.map((trend, index) => (
                  <button
                    key={index}
                    onClick={() => handleTrendingClick(trend)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700 flex items-center"
                  >
                    <FaSearch className="mr-2 text-gray-400" />
                    {trend}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showSuggestions && suggestions.length > 0 && (
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center space-x-3"
                >
                  {suggestion.image ? (
                    <img
                      src={suggestion.image}
                      alt={suggestion.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      <FaSearch className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{suggestion.title}</div>
                    <div className="text-sm text-gray-500">
                      {suggestion.author}
                      {suggestion.class && ` • ${suggestion.class}`}
                    </div>
                  </div>
                  <span className="text-xs text-primary-600 capitalize">
                    {suggestion.type === 'student-book' ? 'Student' : 'Book'}
                  </span>
                </button>
              ))}
            </div>
          )}

          {showSuggestions && suggestions.length === 0 && searchQuery.length >= 2 && (
            <div className="p-4 text-center text-gray-500 text-sm">
              No suggestions found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBar;

