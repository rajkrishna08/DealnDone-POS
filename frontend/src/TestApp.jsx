import React, { useState, useEffect } from 'react';

// Import only essential components for testing
import LandingPage from './components/LandingPage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import StoreDashboard from './components/StoreDashboard';
import POSScreen from './components/POSScreen';
import Settings from './components/Settings';

import './index.css';

function TestApp() {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        setCurrentView('store-dashboard');
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentView('store-dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('landing');
  };

  const renderContent = () => {
    const commonProps = {
      onNavigate: handleNavigate,
      user: user
    };

    if (!isAuthenticated) {
      switch (currentView) {
        case 'landing':
          return <LandingPage {...commonProps} />;
        case 'signin':
          return <SignIn {...commonProps} onLogin={handleLogin} />;
        case 'signup':
          return <SignUp {...commonProps} onLogin={handleLogin} />;
        default:
          return <LandingPage {...commonProps} />;
      }
    }

    // Authenticated views
    switch (currentView) {
      case 'pos':
        return <POSScreen {...commonProps} />;
      case 'store-dashboard':
        return <StoreDashboard {...commonProps} />;
      case 'settings':
        return <Settings {...commonProps} />;
      default:
        return <StoreDashboard {...commonProps} />;
    }
  };

  return (
    <div className="App">
      {/* Simple header for testing */}
      <div className="bg-blue-600 text-white p-4">
        <h1>DealNDone 2025 - Test Mode</h1>
        <div className="flex gap-4 mt-2">
          {!isAuthenticated ? (
            <>
              <button onClick={() => handleNavigate('landing')} className="bg-blue-500 px-3 py-1 rounded">
                Landing
              </button>
              <button onClick={() => handleNavigate('signin')} className="bg-blue-500 px-3 py-1 rounded">
                Sign In
              </button>
              <button onClick={() => handleNavigate('signup')} className="bg-blue-500 px-3 py-1 rounded">
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleNavigate('store-dashboard')} className="bg-blue-500 px-3 py-1 rounded">
                Dashboard
              </button>
              <button onClick={() => handleNavigate('pos')} className="bg-blue-500 px-3 py-1 rounded">
                POS
              </button>
              <button onClick={() => handleNavigate('settings')} className="bg-blue-500 px-3 py-1 rounded">
                Settings
              </button>
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default TestApp;