import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './components/pages/Home';
import Booking from './components/pages/Booking';
import Packages from './components/pages/Packages';
import BookingConfirmation from './components/pages/BookingConfirmation';
import AdminLogin from './components/pages/AdminLogin';
import AdminDashboard from './components/pages/AdminDashboard';
import NotFound from './components/NotFound';
import './App.css';
import './styles/party-theme.css';

function App() {
  // State to track the current view/section
  const [currentView, setCurrentView] = useState('home');
  // State to store booking data for confirmation
  const [bookingData, setBookingData] = useState(null);
  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // Check for admin token on load
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      setIsAdminAuthenticated(true);
    }
  }, []);

  // Handle admin login
  const handleAdminLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAdminAuthenticated(true);
    setCurrentView('adminDashboard');
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminAuthenticated(false);
    setCurrentView('home');
  };

  // Handle booking submission
  const handleBookingSubmit = (data) => {
    setBookingData(data);
    setCurrentView('bookingConfirmation');
  };

  // Navigation handler
  const navigateTo = (view) => {
    // If trying to access admin dashboard without authentication
    if (view === 'adminDashboard' && !isAdminAuthenticated) {
      setCurrentView('adminLogin');
      return;
    }
    setCurrentView(view);
  };

  // Render the appropriate component based on current view
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home navigateTo={navigateTo} />;
      case 'booking':
        return <Booking onSubmit={handleBookingSubmit} navigateTo={navigateTo} />;
      case 'packages':
        return <Packages navigateTo={navigateTo} />;
      case 'bookingConfirmation':
        return <BookingConfirmation bookingData={bookingData} navigateTo={navigateTo} />;
      case 'adminLogin':
        return <AdminLogin onLogin={handleAdminLogin} navigateTo={navigateTo} />;
      case 'adminDashboard':
        return isAdminAuthenticated ? 
          <AdminDashboard onLogout={handleAdminLogout} navigateTo={navigateTo} /> : 
          <AdminLogin onLogin={handleAdminLogin} navigateTo={navigateTo} />;
      default:
        return <NotFound navigateTo={navigateTo} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
        <Header 
          currentView={currentView} 
          navigateTo={navigateTo} 
          isAdmin={isAdminAuthenticated} 
          onLogout={handleAdminLogout}
        />
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

export default App;
