import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * Login View Component
 * Handles user login with email/password and MFA support
 */
const LoginView = ({ authModel, authController, onLoginSuccess, onSwitchToRegister, onSwitchToForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [localErrors, setLocalErrors] = useState({});

  // Subscribe to model changes
  useEffect(() => {
    const handleModelChange = () => {
      // Handle successful login
      if (authModel.isAuthenticated && onLoginSuccess) {
        onLoginSuccess();
      }
    };

    authModel.addListener(handleModelChange);
    return () => authModel.removeListener(handleModelChange);
  }, [authModel, onLoginSuccess]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field-specific error
    if (localErrors[field]) {
      setLocalErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Handle MFA code input
  const handleMFAChange = (value) => {
    setMfaCode(value);
    if (localErrors.mfaCode) {
      setLocalErrors(prev => ({
        ...prev,
        mfaCode: null
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!authModel.isValidEmail(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (showMFA && !mfaCode.trim()) {
      errors.mfaCode = 'MFA code is required';
    } else if (showMFA && !authModel.isValidMFACode(mfaCode)) {
      errors.mfaCode = 'Invalid MFA code format';
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (showMFA) {
        await authController.loginWithMFA(formData, mfaCode);
      } else {
        await authController.login(formData);
      }
    } catch (error) {
      // Error is already handled by the controller
      console.error('Login error:', error);
    }
  };

  // Handle MFA requirement
  const handleMFARequired = () => {
    setShowMFA(true);
  };

  // Handle back to regular login
  const handleBackToLogin = () => {
    setShowMFA(false);
    setMfaCode('');
    setLocalErrors({});
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    if (onSwitchToForgotPassword) {
      onSwitchToForgotPassword();
    }
  };

  // Handle register link
  const handleRegister = () => {
    if (onSwitchToRegister) {
      onSwitchToRegister();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {showMFA ? 'Enter MFA Code' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {showMFA ? 'Enter the 6-digit code from your authenticator app' : 'Welcome back to DealNDone'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!showMFA ? (
            // Regular login form
            <>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`appearance-none relative block w-full px-3 py-2 pl-10 border ${
                        localErrors.email ? 'border-red-300' : 'border-gray-300'
                      } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {localErrors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {localErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`appearance-none relative block w-full px-3 py-2 pl-10 pr-10 border ${
                        localErrors.password ? 'border-red-300' : 'border-gray-300'
                      } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {localErrors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {localErrors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
            </>
          ) : (
            // MFA form
            <div className="space-y-4">
              <div>
                <label htmlFor="mfa-code" className="block text-sm font-medium text-gray-700">
                  MFA Code
                </label>
                <div className="mt-1">
                  <input
                    id="mfa-code"
                    name="mfa-code"
                    type="text"
                    autoComplete="one-time-code"
                    required
                    value={mfaCode}
                    onChange={(e) => handleMFAChange(e.target.value)}
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      localErrors.mfaCode ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                </div>
                {localErrors.mfaCode && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {localErrors.mfaCode}
                  </p>
                )}
              </div>

              <div className="text-sm text-center">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  ← Back to login
                </button>
              </div>
            </div>
          )}

          {/* Error display */}
          {authModel.loginError && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Login failed
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {authModel.loginError}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success message */}
          {authModel.isAuthenticated && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Login successful
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    Redirecting to dashboard...
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={authModel.isLoggingIn}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authModel.isLoggingIn ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {showMFA ? 'Verifying...' : 'Signing in...'}
                </div>
              ) : (
                showMFA ? 'Verify Code' : 'Sign in'
              )}
            </button>
          </div>

          {/* Register link */}
          {!showMFA && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={handleRegister}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </button>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginView; 