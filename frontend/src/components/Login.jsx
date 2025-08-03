import React, { useState } from 'react';

const Login = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

  const validateForm = () => {
    const newErrors = {};

    // At least one of store name or email is required
    if (!formData.storeName.trim() && !formData.email.trim()) {
      newErrors.storeName = 'Please enter either store name or email';
      newErrors.email = 'Please enter either store name or email';
    } else {
      // If store name is provided, validate it
      if (formData.storeName.trim() && formData.storeName.includes(' ')) {
        newErrors.storeName = 'Store name cannot contain spaces';
      }
      
      // If email is provided, validate it
      if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Real API call to backend
              const response = await fetch('http://127.0.0.1:8005/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.storeName || formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different types of error responses
        let errorMessage = 'Login failed';
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === 'object') {
          errorMessage = JSON.stringify(data);
        }
        throw new Error(errorMessage);
      }

      // Check if email verification is required
      if (data.requires_verification) {
        setErrors({ submit: data.message });
        return;
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Get current URL to determine the correct redirect
      // const currentUrl = window.location.origin; // Commented out unused variable
      
      // Redirect based on role
      if (data.user.role === 'superadmin') {
        // For demo, redirect to owner dashboard
        onNavigate('owner-dashboard');
      } else {
        // Redirect to main dashboard with store context
        onNavigate('store-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: error.message || 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFASubmit = async (e) => {
    e.preventDefault();
    
    if (!mfaCode.trim()) {
      setErrors({ mfa: 'Please enter the MFA code' });
      return;
    }

    setIsLoading(true);

    try {
      // Mock MFA verification
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // Simulate successful MFA verification
      const mockResponse = {
        success: true,
        user: {
          email: formData.email,
          storeName: formData.storeName,
          role: 'superadmin'
        }
      };

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      // Redirect based on role
      if (mockResponse.user.role === 'superadmin') {
        onNavigate('owner-dashboard');
      } else {
        onNavigate('store-dashboard');
      }
    } catch (error) {
      console.error('MFA verification error:', error);
      setErrors({ mfa: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowMFA(false);
    setMfaCode('');
    setErrors({});
  };

  const handleSignupClick = () => {
    onNavigate('landing');
  };

  const handleBypassLogin = () => {
    // Create mock user data for bypass
    const mockUser = {
      id: 'bypass-user-001',
      email: 'demo@dealndone.com',
      store_name: 'dealndone',
      role: 'superadmin',
      org_id: 'bypass-org-001',
      plan: {
        type: 'enterprise',
        limits: {
          outlets: 10,
          registers: 50,
          products: 10000,
          employees: 100
        }
      }
    };
    
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // Redirect to owner dashboard
    onNavigate('owner-dashboard');
  };

  if (showMFA) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Two-Factor Authentication
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleMFASubmit}>
            <div>
              <label htmlFor="mfa-code" className="sr-only">
                MFA Code
              </label>
              <input
                id="mfa-code"
                name="mfaCode"
                type="text"
                required
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="000000"
                maxLength="6"
                pattern="[0-9]{6}"
              />
              {errors.mfa && (
                <p className="mt-1 text-sm text-red-600">{errors.mfa}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-indigo-600 hover:text-indigo-500 text-sm"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <h1 className="text-4xl font-bold text-gray-900">Deal n Done</h1>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your store dashboard and manage your business
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            {/* Store Name */}
            <div>
              <label htmlFor="store-name" className="block text-sm font-medium text-gray-700">
                Store Name (or Email)
              </label>
              <div className="mt-1 relative">
                <input
                  id="store-name"
                  name="storeName"
                  type="text"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  className={`appearance-none rounded-lg relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:z-10 sm:text-sm ${
                    errors.storeName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="mystore or your@email.com"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">.dealndone.com</span>
                </div>
              </div>
              {errors.storeName && (
                <p className="mt-1 text-sm text-red-600">{errors.storeName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                Email address (optional if using store name)
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`appearance-none rounded-lg relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:z-10 sm:text-sm ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
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
                className={`appearance-none rounded-lg relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:z-10 sm:text-sm ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </button>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
            
            {/* Bypass Login Button */}
            <button
              type="button"
              onClick={handleBypassLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              🚀 Demo Mode - Skip Login
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={handleSignupClick}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Create one now
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 