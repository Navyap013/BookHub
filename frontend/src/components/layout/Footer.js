import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaBook className="text-2xl" />
              <span className="text-xl font-bold">BookHub 2.0</span>
            </div>
            <p className="text-gray-400">
              Your ultimate destination for books and learning. Discover, read, and grow with us.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/books" className="text-gray-400 hover:text-white">Browse Books</Link></li>
              <li><Link to="/student-library" className="text-gray-400 hover:text-white">Student Library</Link></li>
              <li><Link to="/prekg-zone" className="text-gray-400 hover:text-white">Pre-KG Zone</Link></li>
              <li><Link to="/forum" className="text-gray-400 hover:text-white">Community Forum</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><FaFacebook className="text-2xl" /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaTwitter className="text-2xl" /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaInstagram className="text-2xl" /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaLinkedin className="text-2xl" /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 BookHub 2.0. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

