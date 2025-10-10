// src/App.jsx - Fixed imports
import React, { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";
import AuthGate from "./components/AuthGate";
import LoadingSpinner from "./components/LoadingSpinner";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RetrievePage from "./pages/RetrievePage";
import AdminDashboard from "./pages/AdminDashboard";
import FacultyProfile from "./pages/FacultyProfile";
import { facultyAPI } from './services/api';
import backgroundImage from './assets/—Slidesdocs—simple\ geometric\ blue\ business\ atmosphere_8afafb99c8.jpg';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = (page) => {
    console.log('Navigating to:', page);
    setCurrentPage(page);
  };

  const handleLogin = (userData) => {
    console.log('Login successful:', userData);
    setUser(userData);
    if (userData.role === 'Admin') {
      navigate('admin-dashboard');
    } else {
      navigate('faculty-profile');
    }
  };

  const handleSignup = (userData) => {
    console.log('Signup successful:', userData);
    setUser(userData);
    if (userData.role === 'Admin') {
      navigate('admin-dashboard');
    } else {
      navigate('pending-approval');
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('home');
  };

  const renderPage = () => {
    console.log('Rendering page:', currentPage);
    
    if (loading) return <LoadingSpinner />;

    switch (currentPage) {
      case 'home':
        return <HomePage navigate={navigate} />;
      case 'auth_gate':
        return <AuthGate navigate={navigate} />;
      case 'login':
        return <LoginPage navigate={navigate} onLogin={handleLogin} />;
      case 'signup':
        return <SignupPage navigate={navigate} onSignup={handleSignup} />;
      case 'retrieve':
        return <RetrievePage navigate={navigate} />;
      case 'admin-dashboard':
        return <AdminDashboard user={user} navigate={navigate} />;
      case 'faculty-profile':
        return <FacultyProfile user={user} navigate={navigate} />;
      case 'pending-approval':
        return (
          <div className="home-container">
            <h2>Account Pending Approval</h2>
            <p>Your account is waiting for admin approval.</p>
            <button onClick={() => navigate('home')} className="primary-button bg-indigo-600">
              Back to Home
            </button>
          </div>
        );
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="app-container"
    style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh'
      }}>
      <Navbar 
        user={user}
        currentPage={currentPage}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
      <div className="main-container">
        {renderPage()}
      </div>
    </div>
  );
};

export default App;