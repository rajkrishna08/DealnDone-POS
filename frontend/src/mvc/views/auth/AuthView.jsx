import React, { useState, useEffect } from 'react';
import { Shield, User, LogOut, Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import LoginView from './LoginView';
import SignUpView from './SignUpView';

/**
 * Auth View Component
 * Main authentication view that handles login, signup, and user management
 */
const AuthView = ({ authModel, authController, userModel, onAuthSuccess, onLogout }) => {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'signup', 'profile'
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Subscribe to model changes
  useEffect(() => {
    const handleModelChange = () => {
      // Handle successful authentication
      if (authModel.isAuthenticated && onAuthSuccess) {
        onAuthSuccess();
      }
    };

    authModel.addListener(handleModelChange);
    return () => authModel.removeListener(handleModelChange);
  }, [authModel, onAuthSuccess]);

  // Handle view switching
  const handleSwitchToLogin = () => {
    setCurrentView('login');
    authModel.clearErrors();
  };

  const handleSwitchToSignUp = () => {
    setCurrentView('signup');
    authModel.clearErrors();
  };

  const handleSwitchToProfile = () => {
    setCurrentView('profile');
  };

  const handleSwitchToForgotPassword = () => {
    setCurrentView('forgot-password');
  };

  // Handle authentication success
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (onAuthSuccess) {
      onAuthSuccess();
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await authController.logout();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Render authentication modal
  const renderAuthModal = () => {
    if (!showAuthModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {currentView === 'login' && 'Sign In'}
              {currentView === 'signup' && 'Create Account'}
              {currentView === 'profile' && 'User Profile'}
              {currentView === 'forgot-password' && 'Reset Password'}
            </h2>
            <button
              onClick={() => setShowAuthModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            {currentView === 'login' && (
              <LoginView
                authModel={authModel}
                authController={authController}
                onLoginSuccess={handleAuthSuccess}
                onSwitchToRegister={handleSwitchToSignUp}
                onSwitchToForgotPassword={handleSwitchToForgotPassword}
              />
            )}
            
            {currentView === 'signup' && (
              <SignUpView
                authModel={authModel}
                authController={authController}
                onSignUpSuccess={handleAuthSuccess}
                onSwitchToLogin={handleSwitchToLogin}
              />
            )}
            
            {currentView === 'profile' && (
              <UserProfileView
                userModel={userModel}
                authController={authController}
                onLogout={handleLogout}
              />
            )}
            
            {currentView === 'forgot-password' && (
              <ForgotPasswordView
                authModel={authModel}
                authController={authController}
                onBackToLogin={handleSwitchToLogin}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render user menu when authenticated
  const renderUserMenu = () => {
    if (!authModel.isAuthenticated) {
      return (
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setCurrentView('login');
              setShowAuthModal(true);
            }}
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setCurrentView('signup');
              setShowAuthModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Sign Up
          </button>
        </div>
      );
    }

    return (
      <div className="relative">
        <button
          onClick={() => setShowAuthModal(!showAuthModal)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium text-sm">
              {userModel.getUserInitials()}
            </span>
          </div>
          <span>{userModel.getUserDisplayName()}</span>
        </button>

        {showAuthModal && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <button
              onClick={() => {
                setCurrentView('profile');
                setShowAuthModal(false);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </button>
            <button
              onClick={() => {
                setCurrentView('settings');
                setShowAuthModal(false);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
            <hr className="my-1" />
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {renderUserMenu()}
      {renderAuthModal()}
    </>
  );
};

/**
 * User Profile View Component
 */
const UserProfileView = ({ userModel, authController, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userModel.currentUser?.firstName || '',
    lastName: userModel.currentUser?.lastName || '',
    email: userModel.currentUser?.email || '',
    phone: userModel.currentUser?.phone || ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await authController.updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: userModel.currentUser?.firstName || '',
      lastName: userModel.currentUser?.lastName || '',
      email: userModel.currentUser?.email || '',
      phone: userModel.currentUser?.phone || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-medium text-xl">
            {userModel.getUserInitials()}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {userModel.getUserDisplayName()}
          </h3>
          <p className="text-sm text-gray-500">
            {userModel.currentUser?.email}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              disabled={!isEditing}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              disabled={!isEditing}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Save Changes
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Forgot Password View Component
 */
const ForgotPasswordView = ({ authModel, authController, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authController.requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset error:', error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Check your email</h3>
        <p className="mt-2 text-sm text-gray-600">
          We've sent a password reset link to {email}
        </p>
        <button
          onClick={onBackToLogin}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter your email address"
        />
      </div>

      {authModel.resetError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Reset failed</h3>
              <div className="mt-2 text-sm text-red-700">{authModel.resetError}</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-blue-600 hover:text-blue-500 text-sm font-medium"
        >
          Back to Sign In
        </button>
        <button
          type="submit"
          disabled={authModel.isResettingPassword}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
        >
          {authModel.isResettingPassword ? 'Sending...' : 'Send Reset Link'}
        </button>
      </div>
    </form>
  );
};

export default AuthView; 