import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import NotFound from './components/NotFound';
import Home from './components/pages/Home';
import Booking from './components/pages/Booking';
import Packages from './components/pages/Packages';
import BookingConfirmation from './components/pages/BookingConfirmation';
import AdminLogin from './components/pages/AdminLogin';
import AdminDashboard from './components/pages/AdminDashboard';
import Header from './components/layout/Header';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import './styles/party-theme.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
          <Header />
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/confirmation" element={<BookingConfirmation />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
