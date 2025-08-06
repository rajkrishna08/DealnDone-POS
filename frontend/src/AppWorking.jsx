import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import working components only
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import StoreDashboard from './components/StoreDashboard';
import POSScreen from './components/POSScreen';
import Settings from './components/Settings';
import ResponsiveLayout from './components/ResponsiveLayout';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStore, setCurrentStore] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        setCurrentStore({ name: userData.store_name || 'Store' });
        if (userData.role === 'owner' || userData.role === 'admin' || userData.role === 'retailer') {
          setCurrentView('store-dashboard');
        } else {
          setCurrentView('pos');
        }
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
    setCurrentStore(userData.stores?.[0] || { name: userData.store_name || 'Store' });
    setCurrentView('store-dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentStore(null);
    setCurrentView('landing');
  };

  const renderMainContent = () => {
    const commonProps = {
      onNavigate: handleNavigate,
      user: user,
      currentStore: currentStore
    };

    // If not authenticated, show auth flow
    if (!isAuthenticated) {
      switch (currentView) {
        case 'landing':
          return <LandingPage {...commonProps} />;
        case 'login':
          return <Login {...commonProps} onLogin={handleLogin} />;
        case 'signin':
          return <SignIn {...commonProps} onLogin={handleLogin} />;
        case 'signup':
          return <SignUp {...commonProps} onLogin={handleLogin} />;
        default:
          return <LandingPage {...commonProps} />;
      }
    }

    // If authenticated, show POS system
    switch (currentView) {
      case 'pos':
      case 'pos-screen':
        return <POSScreen {...commonProps} />;
      case 'store-dashboard':
        return <StoreDashboard {...commonProps} />;
      case 'settings':
        return <Settings {...commonProps} />;
      default:
        return <StoreDashboard {...commonProps} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading DealNDone 2025...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            isAuthenticated ? (
              <ResponsiveLayout>
                <Header 
                  user={user} 
                  selectedCurrency="USD"
                  setSelectedCurrency={() => {}}
                />
                <div className="flex">
                  <Sidebar 
                    currentView={currentView}
                    onNavigate={handleNavigate}
                    onLogout={handleLogout}
                    user={user}
                  />
                  <main className="flex-1 p-6">
                    {renderMainContent()}
                  </main>
                </div>
              </ResponsiveLayout>
            ) : (
              renderMainContent()
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;