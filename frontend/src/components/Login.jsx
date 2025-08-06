import React, { useState, useEffect } from 'react';

const Login = ({ onNavigate, onLogin, onDemoLogin, subdomain, currentStore, user }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [storeInfo, setStoreInfo] = useState(null);

  // Get current subdomain
  useEffect(() => {
    const getSubdomain = () => {
      const host = window.location.host; // e.g., "honey.dealndone.com"
      const parts = host.split('.');
      
      // If it's a subdomain (more than 2 parts and not www)
      if (parts.length > 2 && parts[0] !== 'www' && !host.includes('localhost')) {
        return parts[0]; // Returns "honey"
      }
      return null; // No subdomain
    };

    const subdomain = getSubdomain();
    
    // If we're on a subdomain, fetch store info
    if (subdomain) {
      fetchStoreInfo(subdomain);
    } else {
      setStoreInfo({ name: 'Main Portal', subdomain: null });
    }
  }, []);

  const fetchStoreInfo = async (subdomain) => {
    try {
      // For now, just set basic store info since we don't have this endpoint
      setStoreInfo({ name: subdomain, subdomain });
    } catch (error) {
      console.error('Failed to fetch store info:', error);
      setStoreInfo({ name: subdomain, subdomain });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && (data.access_token || data.token)) {
        // Store authentication data
        const token = data.access_token || data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Store plan information for settings page
        if (data.user.planType) {
          localStorage.setItem('userPlan', data.user.planType);
        }
        
        // Use onLogin callback if provided, otherwise redirect
        if (onLogin) {
          onLogin({
            ...data.user,
            token: token,
            store: data.store,
            plan: data.user.planType
          });
        } else {
          // Redirect based on user role
          if (data.user.role === 'owner' || data.user.role === 'admin') {
            window.location.href = '/dashboard';
          } else {
            window.location.href = '/pos';
          }
        }
      } else {
        setError(data.detail || data.message || 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Use the demo login handler from App.js if available
    if (onDemoLogin) {
      onDemoLogin();
    } else {
      // Fallback demo login
      const demoUser = {
        id: 1,
        name: 'Demo User',
        email: 'demo@dealndone.com',
        role: 'owner',
        store: storeInfo?.name || 'Demo Store',
        subdomain: storeInfo?.subdomain || 'demo'
      };
      
      localStorage.setItem('token', 'demo-token-12345');
      localStorage.setItem('user', JSON.stringify(demoUser));
      
      window.location.href = '/dashboard';
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleForgotPassword = () => {
    // Pass subdomain context to forgot password
    onNavigate('forgot-password', { subdomain: storeInfo?.subdomain });
  };

  const handleCreateAccount = () => {
    if (storeInfo?.subdomain) {
      // If on a subdomain, go to signup for that store
      onNavigate('signup');
    } else {
      // If on main domain, go to landing page to create store
      onNavigate('landing');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Brand */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <span className="material-icons text-white text-2xl">store</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {storeInfo ? `Welcome to ${storeInfo.name}` : 'Welcome to Deal n Done'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {storeInfo 
              ? `Sign in to your ${storeInfo.name} store management dashboard`
              : 'Sign in to your store management dashboard'
            }
          </p>
          {storeInfo?.subdomain && (
            <div className="mt-2 text-xs text-gray-500">
              Store URL: {storeInfo.subdomain}.dealndone.com
            </div>
          )}
        </div>
        
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Sign In Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <button 
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500"
                onClick={handleForgotPassword}
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="material-icons animate-spin mr-2">refresh</span>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="material-icons mr-2">login</span>
                  Sign in
                </span>
              )}
            </button>
          </div>
        </form>
            
        {/* Demo Login Button */}
        <div className="text-center">
            <button
              type="button"
            onClick={handleDemoLogin}
            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
            Demo Login (Skip Authentication)
            </button>
          </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-500">
              New to Deal n Done?
            </span>
          </div>
        </div>

        {/* Sign Up Link */}
          <div className="text-center">
              <button
                type="button"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            onClick={handleCreateAccount}
              >
            {storeInfo?.subdomain 
              ? 'Sign up for this store' 
              : 'Create your store account'
            }
              </button>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Email:</strong> demo@dealndone.com</p>
            <p><strong>Password:</strong> demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 