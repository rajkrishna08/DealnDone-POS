import BaseModel from '../base/BaseModel';

/**
 * Auth Model - Manages authentication state and session
 * Handles login state, tokens, and authentication flow
 */
class AuthModel extends BaseModel {
  constructor() {
    super();
    
    // Initialize authentication state
    this._state = {
      isAuthenticated: false,
      isLoggingIn: false,
      isLoggingOut: false,
      isRegistering: false,
      isVerifying: false,
      isResettingPassword: false,
      isChangingPassword: false,
      isEnablingMFA: false,
      isDisablingMFA: false,
      authToken: null,
      refreshToken: null,
      tokenExpiry: null,
      loginError: null,
      registerError: null,
      verificationError: null,
      resetError: null,
      mfaEnabled: false,
      mfaSecret: null,
      mfaBackupCodes: [],
      sessionTimeout: null,
      lastActivity: null,
      loginAttempts: 0,
      lockoutUntil: null,
      rememberMe: false,
      autoLogout: true,
      sessionDuration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      idleTimeout: 30 * 60 * 1000 // 30 minutes in milliseconds
    };
  }

  // Getters
  get isAuthenticated() {
    return this._state.isAuthenticated;
  }

  get isLoggingIn() {
    return this._state.isLoggingIn;
  }

  get isLoggingOut() {
    return this._state.isLoggingOut;
  }

  get isRegistering() {
    return this._state.isRegistering;
  }

  get isVerifying() {
    return this._state.isVerifying;
  }

  get isResettingPassword() {
    return this._state.isResettingPassword;
  }

  get isChangingPassword() {
    return this._state.isChangingPassword;
  }

  get isEnablingMFA() {
    return this._state.isEnablingMFA;
  }

  get isDisablingMFA() {
    return this._state.isDisablingMFA;
  }

  get authToken() {
    return this._state.authToken;
  }

  get refreshToken() {
    return this._state.refreshToken;
  }

  get tokenExpiry() {
    return this._state.tokenExpiry;
  }

  get loginError() {
    return this._state.loginError;
  }

  get registerError() {
    return this._state.registerError;
  }

  get verificationError() {
    return this._state.verificationError;
  }

  get resetError() {
    return this._state.resetError;
  }

  get mfaEnabled() {
    return this._state.mfaEnabled;
  }

  get mfaSecret() {
    return this._state.mfaSecret;
  }

  get mfaBackupCodes() {
    return this._state.mfaBackupCodes;
  }

  get sessionTimeout() {
    return this._state.sessionTimeout;
  }

  get lastActivity() {
    return this._state.lastActivity;
  }

  get loginAttempts() {
    return this._state.loginAttempts;
  }

  get lockoutUntil() {
    return this._state.lockoutUntil;
  }

  get rememberMe() {
    return this._state.rememberMe;
  }

  get autoLogout() {
    return this._state.autoLogout;
  }

  get sessionDuration() {
    return this._state.sessionDuration;
  }

  get idleTimeout() {
    return this._state.idleTimeout;
  }

  get isLockedOut() {
    return this._state.lockoutUntil && new Date() < this._state.lockoutUntil;
  }

  get isTokenExpired() {
    return this._state.tokenExpiry && new Date() > this._state.tokenExpiry;
  }

  get isSessionExpired() {
    return this._state.lastActivity && 
           (new Date().getTime() - this._state.lastActivity.getTime()) > this._state.idleTimeout;
  }

  // Setters
  setAuthenticated(status) {
    this.setState({
      ...this._state,
      isAuthenticated: status,
      loginError: status ? null : this._state.loginError
    });
  }

  setLoggingIn(status) {
    this.setState({
      ...this._state,
      isLoggingIn: status
    });
  }

  setLoggingOut(status) {
    this.setState({
      ...this._state,
      isLoggingOut: status
    });
  }

  setRegistering(status) {
    this.setState({
      ...this._state,
      isRegistering: status
    });
  }

  setVerifying(status) {
    this.setState({
      ...this._state,
      isVerifying: status
    });
  }

  setResettingPassword(status) {
    this.setState({
      ...this._state,
      isResettingPassword: status
    });
  }

  setChangingPassword(status) {
    this.setState({
      ...this._state,
      isChangingPassword: status
    });
  }

  setEnablingMFA(status) {
    this.setState({
      ...this._state,
      isEnablingMFA: status
    });
  }

  setDisablingMFA(status) {
    this.setState({
      ...this._state,
      isDisablingMFA: status
    });
  }

  setAuthToken(token) {
    this.setState({
      ...this._state,
      authToken: token
    });
  }

  setRefreshToken(token) {
    this.setState({
      ...this._state,
      refreshToken: token
    });
  }

  setTokenExpiry(expiry) {
    this.setState({
      ...this._state,
      tokenExpiry: expiry
    });
  }

  setLoginError(error) {
    this.setState({
      ...this._state,
      loginError: error
    });
  }

  setRegisterError(error) {
    this.setState({
      ...this._state,
      registerError: error
    });
  }

  setVerificationError(error) {
    this.setState({
      ...this._state,
      verificationError: error
    });
  }

  setResetError(error) {
    this.setState({
      ...this._state,
      resetError: error
    });
  }

  setMFAEnabled(enabled) {
    this.setState({
      ...this._state,
      mfaEnabled: enabled
    });
  }

  setMFASecret(secret) {
    this.setState({
      ...this._state,
      mfaSecret: secret
    });
  }

  setMFABackupCodes(codes) {
    this.setState({
      ...this._state,
      mfaBackupCodes: codes
    });
  }

  setSessionTimeout(timeout) {
    this.setState({
      ...this._state,
      sessionTimeout: timeout
    });
  }

  setLastActivity(timestamp) {
    this.setState({
      ...this._state,
      lastActivity: timestamp
    });
  }

  setLoginAttempts(attempts) {
    this.setState({
      ...this._state,
      loginAttempts: attempts
    });
  }

  setLockoutUntil(timestamp) {
    this.setState({
      ...this._state,
      lockoutUntil: timestamp
    });
  }

  setRememberMe(remember) {
    this.setState({
      ...this._state,
      rememberMe: remember
    });
  }

  setAutoLogout(auto) {
    this.setState({
      ...this._state,
      autoLogout: auto
    });
  }

  // Authentication methods
  incrementLoginAttempts() {
    const attempts = this._state.loginAttempts + 1;
    this.setLoginAttempts(attempts);
    
    // Lockout after 5 failed attempts for 15 minutes
    if (attempts >= 5) {
      const lockoutTime = new Date();
      lockoutTime.setMinutes(lockoutTime.getMinutes() + 15);
      this.setLockoutUntil(lockoutTime);
    }
  }

  resetLoginAttempts() {
    this.setLoginAttempts(0);
    this.setLockoutUntil(null);
  }

  updateLastActivity() {
    this.setLastActivity(new Date());
  }

  // Token management
  setTokens(authToken, refreshToken, expiry) {
    this.setState({
      ...this._state,
      authToken,
      refreshToken,
      tokenExpiry: expiry ? new Date(expiry) : null
    });
  }

  clearTokens() {
    this.setState({
      ...this._state,
      authToken: null,
      refreshToken: null,
      tokenExpiry: null
    });
  }

  // MFA management
  setupMFA(secret, backupCodes) {
    this.setState({
      ...this._state,
      mfaSecret: secret,
      mfaBackupCodes: backupCodes
    });
  }

  enableMFA() {
    this.setState({
      ...this._state,
      mfaEnabled: true
    });
  }

  disableMFA() {
    this.setState({
      ...this._state,
      mfaEnabled: false,
      mfaSecret: null,
      mfaBackupCodes: []
    });
  }

  // Session management
  startSession() {
    this.updateLastActivity();
    
    if (this._state.autoLogout) {
      const timeout = setTimeout(() => {
        this.handleSessionTimeout();
      }, this._state.idleTimeout);
      
      this.setSessionTimeout(timeout);
    }
  }

  extendSession() {
    this.updateLastActivity();
    
    if (this._state.sessionTimeout) {
      clearTimeout(this._state.sessionTimeout);
    }
    
    if (this._state.autoLogout) {
      const timeout = setTimeout(() => {
        this.handleSessionTimeout();
      }, this._state.idleTimeout);
      
      this.setSessionTimeout(timeout);
    }
  }

  handleSessionTimeout() {
    this.setState({
      ...this._state,
      isAuthenticated: false,
      sessionTimeout: null
    });
  }

  // Error management
  clearErrors() {
    this.setState({
      ...this._state,
      loginError: null,
      registerError: null,
      verificationError: null,
      resetError: null
    });
  }

  clearLoginError() {
    this.setState({
      ...this._state,
      loginError: null
    });
  }

  clearRegisterError() {
    this.setState({
      ...this._state,
      registerError: null
    });
  }

  clearVerificationError() {
    this.setState({
      ...this._state,
      verificationError: null
    });
  }

  clearResetError() {
    this.setState({
      ...this._state,
      resetError: null
    });
  }

  // Validation
  validate(data) {
    const errors = [];

    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (data.password && data.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    if (data.confirmPassword && data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }

    if (data.mfaCode && !this.isValidMFACode(data.mfaCode)) {
      errors.push('Invalid MFA code format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidMFACode(code) {
    return /^\d{6}$/.test(code);
  }

  // Data transformation
  transformForAPI(data) {
    return {
      email: data.email?.toLowerCase().trim(),
      password: data.password,
      confirm_password: data.confirmPassword,
      mfa_code: data.mfaCode,
      remember_me: data.rememberMe,
      reset_token: data.resetToken,
      new_password: data.newPassword,
      current_password: data.currentPassword
    };
  }

  transformFromAPI(data) {
    return {
      authToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenExpiry: data.expires_at,
      mfaEnabled: data.mfa_enabled,
      mfaSecret: data.mfa_secret,
      mfaBackupCodes: data.mfa_backup_codes || [],
      sessionDuration: data.session_duration,
      idleTimeout: data.idle_timeout
    };
  }

  // Clear all auth data (logout)
  clearAuth() {
    this.setState({
      isAuthenticated: false,
      isLoggingIn: false,
      isLoggingOut: false,
      isRegistering: false,
      isVerifying: false,
      isResettingPassword: false,
      isChangingPassword: false,
      isEnablingMFA: false,
      isDisablingMFA: false,
      authToken: null,
      refreshToken: null,
      tokenExpiry: null,
      loginError: null,
      registerError: null,
      verificationError: null,
      resetError: null,
      mfaEnabled: false,
      mfaSecret: null,
      mfaBackupCodes: [],
      sessionTimeout: null,
      lastActivity: null,
      loginAttempts: 0,
      lockoutUntil: null,
      rememberMe: false,
      autoLogout: true,
      sessionDuration: 24 * 60 * 60 * 1000,
      idleTimeout: 30 * 60 * 1000
    });
  }
}

export default AuthModel; 