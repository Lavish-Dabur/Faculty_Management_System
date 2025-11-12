import React, { useState, useCallback } from 'react';
import PrimaryButton from './components/PrimaryButton';
import FormInput from './components/FormInput';
import Navbar from './components/Navbar';
import AuthGate from './components/AuthGate.jsx';
import RetrievePage from './pages/RetrievePage';
import ProfilePage from './pages/ProfilePage'; 

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const navigate = useCallback(view => setCurrentView(view), []);

  let Content;
  switch (currentView) {
    case 'auth_gate':   Content = <AuthGate navigate={navigate} />; break;
    case 'login':       Content = <LoginPage navigate={navigate} onLogin={handleLogin} />; break;
    case 'signup':      Content = <SignupPage navigate={navigate} />; break;
    case 'retrieve':    Content = <RetrievePage navigate={navigate} />; break;
    // case 'profile': Content = <ProfilePage navigate={navigate} />; break;
    case 'admin-dashboard': Content = <AdminDashboard user={user} navigate={navigate} />; break;
    case 'faculty-profile': Content = <FacultyProfile user={user} navigate={navigate} />; break;
    case 'home':
    default:           Content = <HomePage navigate={navigate} />; break;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border-4 border-white transition-all duration-300">
        <div className="p-6 md:p-12">
          <Navbar />
          {Content}
        </div>
      </div>
    </div>
  );
}

export default App;