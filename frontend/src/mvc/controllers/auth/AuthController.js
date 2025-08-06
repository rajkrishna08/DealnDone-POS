import BaseController from '../base/BaseController';
import apiService from '../../services/api/ApiService';

/**
 * Auth Controller - Manages authentication business logic
 * Handles login, registration, password reset, and MFA operations
 */
class AuthController extends BaseController {
  constructor(authModel, userModel) {
    super(authModel);
    this.userModel = userModel;
  }

  async _onInitialize() {
    // Check for existing session
    await this.checkExistingSession();
  }

  // Session management
  async checkExistingSession() {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await apiService.get('/auth/verify');
        if (response.success) {
          this.authModel.setAuthenticated(true);
          this.authModel.setAuthToken(token);
          this.userModel.setCurrentUser(response.data.user);
          this.authModel.startSession();
        } else {
          this.clearSession();
        }
      }
    } catch (error) {
      this.clearSession();
    }
  }

  clearSession() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    this.authModel.clearAuth();
    this.userModel.clearUser();
  }

  // Login operations
  async login(credentials) {
    return await this.executeWithLoading(async () => {
      // Validate input
      const validation = this.authModel.validate(credentials);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Check lockout
      if (this.authModel.isLockedOut) {
        throw new Error('Account temporarily locked. Please try again later.');
      }

      this.authModel.setLoggingIn(true);
      this.authModel.clearLoginError();

      try {
        const data = this.authModel.transformForAPI(credentials);
        const response = await apiService.post('/auth/login', data);

        if (response.success) {
          const authData = this.authModel.transformFromAPI(response.data);
          
          // Set tokens
          this.authModel.setTokens(
            authData.authToken,
            authData.refreshToken,
            authData.tokenExpiry
          );

          // Store tokens
          localStorage.setItem('authToken', authData.authToken);
          if (authData.refreshToken) {
            localStorage.setItem('refreshToken', authData.refreshToken);
          }

          // Set user data
          this.userModel.setCurrentUser(response.data.user);
          this.authModel.setAuthenticated(true);
          this.authModel.resetLoginAttempts();
          this.authModel.startSession();

          return response.data;
        } else {
          this.authModel.incrementLoginAttempts();
          throw new Error(response.message || 'Login failed');
        }
      } catch (error) {
        this.authModel.setLoginError(error.message);
        throw error;
      } finally {
        this.authModel.setLoggingIn(false);
      }
    }, 'login');
  }

  async loginWithMFA(credentials, mfaCode) {
    return await this.executeWithLoading(async () => {
      const loginData = {
        ...credentials,
        mfaCode
      };

      const validation = this.authModel.validate(loginData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      this.authModel.setLoggingIn(true);
      this.authModel.clearLoginError();

      try {
        const data = this.authModel.transformForAPI(loginData);
        const response = await apiService.post('/auth/login-mfa', data);

        if (response.success) {
          const authData = this.authModel.transformFromAPI(response.data);
          
          this.authModel.setTokens(
            authData.authToken,
            authData.refreshToken,
            authData.tokenExpiry
          );

          localStorage.setItem('authToken', authData.authToken);
          if (authData.refreshToken) {
            localStorage.setItem('refreshToken', authData.refreshToken);
          }

          this.userModel.setCurrentUser(response.data.user);
          this.authModel.setAuthenticated(true);
          this.authModel.resetLoginAttempts();
          this.authModel.startSession();

          return response.data;
        } else {
          this.authModel.incrementLoginAttempts();
          throw new Error(response.message || 'MFA login failed');
        }
      } catch (error) {
        this.authModel.setLoginError(error.message);
        throw error;
      } finally {
        this.authModel.setLoggingIn(false);
      }
    }, 'MFA login');
  }

  // Registration operations
  async register(userData) {
    return await this.executeWithLoading(async () => {
      const validation = this.userModel.validate(userData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      this.authModel.setRegistering(true);
      this.authModel.clearRegisterError();

      try {
        const data = this.userModel.transformForAPI(userData);
        const response = await apiService.post('/auth/register', data);

        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Registration failed');
        }
      } catch (error) {
        this.authModel.setRegisterError(error.message);
        throw error;
      } finally {
        this.authModel.setRegistering(false);
      }
    }, 'registration');
  }

  async verifyEmail(token) {
    return await this.executeWithLoading(async () => {
      this.authModel.setVerifying(true);
      this.authModel.clearVerificationError();

      try {
        const response = await apiService.post('/auth/verify-email', { token });

        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Email verification failed');
        }
      } catch (error) {
        this.authModel.setVerificationError(error.message);
        throw error;
      } finally {
        this.authModel.setVerifying(false);
      }
    }, 'email verification');
  }

  // Password operations
  async requestPasswordReset(email) {
    return await this.executeWithLoading(async () => {
      const validation = this.authModel.validate({ email });
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      this.authModel.setResettingPassword(true);
      this.authModel.clearResetError();

      try {
        const response = await apiService.post('/auth/request-reset', { email });

        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Password reset request failed');
        }
      } catch (error) {
        this.authModel.setResetError(error.message);
        throw error;
      } finally {
        this.authModel.setResettingPassword(false);
      }
    }, 'password reset request');
  }

  async resetPassword(token, newPassword) {
    return await this.executeWithLoading(async () => {
      const validation = this.authModel.validate({ password: newPassword });
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      this.authModel.setResettingPassword(true);
      this.authModel.clearResetError();

      try {
        const response = await apiService.post('/auth/reset-password', {
          token,
          new_password: newPassword
        });

        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Password reset failed');
        }
      } catch (error) {
        this.authModel.setResetError(error.message);
        throw error;
      } finally {
        this.authModel.setResettingPassword(false);
      }
    }, 'password reset');
  }

  async changePassword(currentPassword, newPassword) {
    return await this.executeWithLoading(async () => {
      const validation = this.authModel.validate({ 
        currentPassword, 
        password: newPassword 
      });
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      this.authModel.setChangingPassword(true);

      try {
        const response = await apiService.post('/auth/change-password', {
          current_password: currentPassword,
          new_password: newPassword
        });

        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Password change failed');
        }
      } catch (error) {
        throw error;
      } finally {
        this.authModel.setChangingPassword(false);
      }
    }, 'password change');
  }

  // MFA operations
  async setupMFA() {
    return await this.executeWithLoading(async () => {
      this.authModel.setEnablingMFA(true);

      try {
        const response = await apiService.post('/auth/setup-mfa');

        if (response.success) {
          this.authModel.setupMFA(
            response.data.mfa_secret,
            response.data.backup_codes
          );
          return response.data;
        } else {
          throw new Error(response.message || 'MFA setup failed');
        }
      } catch (error) {
        throw error;
      } finally {
        this.authModel.setEnablingMFA(false);
      }
    }, 'MFA setup');
  }

  async enableMFA(mfaCode) {
    return await this.executeWithLoading(async () => {
      const validation = this.authModel.validate({ mfaCode });
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      this.authModel.setEnablingMFA(true);

      try {
        const response = await apiService.post('/auth/enable-mfa', {
          mfa_code: mfaCode
        });

        if (response.success) {
          this.authModel.enableMFA();
          return response.data;
        } else {
          throw new Error(response.message || 'MFA activation failed');
        }
      } catch (error) {
        throw error;
      } finally {
        this.authModel.setEnablingMFA(false);
      }
    }, 'MFA activation');
  }

  async disableMFA(mfaCode) {
    return await this.executeWithLoading(async () => {
      const validation = this.authModel.validate({ mfaCode });
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      this.authModel.setDisablingMFA(true);

      try {
        const response = await apiService.post('/auth/disable-mfa', {
          mfa_code: mfaCode
        });

        if (response.success) {
          this.authModel.disableMFA();
          return response.data;
        } else {
          throw new Error(response.message || 'MFA deactivation failed');
        }
      } catch (error) {
        throw error;
      } finally {
        this.authModel.setDisablingMFA(false);
      }
    }, 'MFA deactivation');
  }

  // Logout operations
  async logout() {
    return await this.executeWithLoading(async () => {
      this.authModel.setLoggingOut(true);

      try {
        // Call logout endpoint
        await apiService.post('/auth/logout');
      } catch (error) {
        // Continue with logout even if API call fails
        console.warn('Logout API call failed:', error);
      } finally {
        // Clear local session
        this.clearSession();
        this.authModel.setLoggingOut(false);
      }
    }, 'logout');
  }

  // Token refresh
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.post('/auth/refresh', {
        refresh_token: refreshToken
      });

      if (response.success) {
        const authData = this.authModel.transformFromAPI(response.data);
        
        this.authModel.setTokens(
          authData.authToken,
          authData.refreshToken,
          authData.tokenExpiry
        );

        localStorage.setItem('authToken', authData.authToken);
        if (authData.refreshToken) {
          localStorage.setItem('refreshToken', authData.refreshToken);
        }

        return response.data;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      this.clearSession();
      throw error;
    }
  }

  // User profile operations
  async updateProfile(profileData) {
    return await this.executeWithLoading(async () => {
      const validation = this.userModel.validate(profileData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      try {
        const data = this.userModel.transformForAPI(profileData);
        const response = await apiService.put('/auth/profile', data);

        if (response.success) {
          const updatedUser = this.userModel.transformFromAPI(response.data);
          this.userModel.setCurrentUser(updatedUser);
          return response.data;
        } else {
          throw new Error(response.message || 'Profile update failed');
        }
      } catch (error) {
        throw error;
      }
    }, 'profile update');
  }

  async updatePreferences(preferences) {
    return await this.executeWithLoading(async () => {
      try {
        const response = await apiService.put('/auth/preferences', preferences);

        if (response.success) {
          this.userModel.setUserPreferences(preferences);
          return response.data;
        } else {
          throw new Error(response.message || 'Preferences update failed');
        }
      } catch (error) {
        throw error;
      }
    }, 'preferences update');
  }

  // Session management
  extendSession() {
    this.authModel.extendSession();
  }

  // Utility methods
  isAuthenticated() {
    return this.authModel.isAuthenticated;
  }

  getCurrentUser() {
    return this.userModel.currentUser;
  }

  getUserDisplayName() {
    return this.userModel.getUserDisplayName();
  }

  getUserInitials() {
    return this.userModel.getUserInitials();
  }

  hasRole(role) {
    return this.userModel.hasRole(role);
  }

  hasPermission(permission) {
    return this.userModel.hasPermission(permission);
  }

  isAdmin() {
    return this.userModel.isAdmin();
  }

  isManager() {
    return this.userModel.isManager();
  }
}

export default AuthController; 