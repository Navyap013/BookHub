import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/common/ErrorBoundary';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BookBrowse from './pages/books/BookBrowse';
import BookDetails from './pages/books/BookDetails';
import StudentLibrary from './pages/student/StudentLibrary';
import PreKGZone from './pages/student/PreKGZone';
import StudentProfile from './pages/student/StudentProfile';
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';
import Orders from './pages/orders/Orders';
import OrderDetails from './pages/orders/OrderDetails';
import Favourites from './pages/favourites/Favourites';
import Forum from './pages/forum/Forum';
import ForumPost from './pages/forum/ForumPost';
import CreatePost from './pages/forum/CreatePost';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooks from './pages/admin/AdminBooks';
import AdminStudentBooks from './pages/admin/AdminStudentBooks';
import AdminOrders from './pages/admin/AdminOrders';
import EBookLibrary from './pages/ebooks/EBookLibrary';
import EBookDetails from './pages/ebooks/EBookDetails';
import Marketplace from './pages/marketplace/Marketplace';
import CreateListing from './pages/marketplace/CreateListing';
import ListingDetails from './pages/marketplace/ListingDetails';
import Chatbot from './components/chat/Chatbot';
import About from './pages/static/About';
import Contact from './pages/static/Contact';
import FAQ from './pages/static/FAQ';
import Privacy from './pages/static/Privacy';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/books" element={<BookBrowse />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/student-library" element={<StudentLibrary />} />
              <Route path="/prekg-zone" element={<PreKGZone />} />
              <Route path="/ebooks" element={<PrivateRoute><EBookLibrary /></PrivateRoute>} />
              <Route path="/ebooks/:id" element={<PrivateRoute><EBookDetails /></PrivateRoute>} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/marketplace/create" element={<PrivateRoute><CreateListing /></PrivateRoute>} />
              <Route path="/marketplace/:id" element={<ListingDetails />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/create" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
              <Route path="/forum/:id" element={<ForumPost />} />
              
              <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
              <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
              <Route path="/orders/:id" element={<PrivateRoute><OrderDetails /></PrivateRoute>} />
              <Route path="/favourites" element={<PrivateRoute><Favourites /></PrivateRoute>} />
              <Route path="/student-profile" element={<PrivateRoute><StudentProfile /></PrivateRoute>} />

              {/* Static content pages */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<Privacy />} />
              
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/books" element={<AdminRoute><AdminBooks /></AdminRoute>} />
              <Route path="/admin/student-books" element={<AdminRoute><AdminStudentBooks /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <Chatbot />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

