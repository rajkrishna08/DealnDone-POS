import BaseModel from '../base/BaseModel';

/**
 * User Model - Manages user data and state
 * Handles user profile, preferences, and authentication state
 */
class UserModel extends BaseModel {
  constructor() {
    super();
    
    // Initialize user state
    this._state = {
      currentUser: null,
      userProfile: null,
      userPreferences: {},
      userPermissions: [],
      userRoles: [],
      lastLogin: null,
      isOnline: false,
      sessionData: null
    };
  }

  // Getters
  get currentUser() {
    return this._state.currentUser;
  }

  get userProfile() {
    return this._state.userProfile;
  }

  get userPreferences() {
    return this._state.userPreferences;
  }

  get userPermissions() {
    return this._state.userPermissions;
  }

  get userRoles() {
    return this._state.userRoles;
  }

  get lastLogin() {
    return this._state.lastLogin;
  }

  get isOnline() {
    return this._state.isOnline;
  }

  get sessionData() {
    return this._state.sessionData;
  }

  get isAuthenticated() {
    return !!this._state.currentUser;
  }

  get hasRole() {
    return (role) => this._state.userRoles.includes(role);
  }

  get hasPermission() {
    return (permission) => this._state.userPermissions.includes(permission);
  }

  // Setters
  setCurrentUser(user) {
    this.setState({
      ...this._state,
      currentUser: user,
      isOnline: !!user
    });
  }

  setUserProfile(profile) {
    this.setState({
      ...this._state,
      userProfile: profile
    });
  }

  setUserPreferences(preferences) {
    this.setState({
      ...this._state,
      userPreferences: { ...this._state.userPreferences, ...preferences }
    });
  }

  setUserPermissions(permissions) {
    this.setState({
      ...this._state,
      userPermissions: permissions
    });
  }

  setUserRoles(roles) {
    this.setState({
      ...this._state,
      userRoles: roles
    });
  }

  setLastLogin(timestamp) {
    this.setState({
      ...this._state,
      lastLogin: timestamp
    });
  }

  setOnlineStatus(status) {
    this.setState({
      ...this._state,
      isOnline: status
    });
  }

  setSessionData(sessionData) {
    this.setState({
      ...this._state,
      sessionData: sessionData
    });
  }

  // User management methods
  updateUserProfile(updates) {
    if (this._state.userProfile) {
      this.setUserProfile({
        ...this._state.userProfile,
        ...updates
      });
    }
  }

  updateUserPreferences(preferences) {
    this.setUserPreferences(preferences);
  }

  addUserRole(role) {
    if (!this._state.userRoles.includes(role)) {
      this.setUserRoles([...this._state.userRoles, role]);
    }
  }

  removeUserRole(role) {
    this.setUserRoles(this._state.userRoles.filter(r => r !== role));
  }

  addUserPermission(permission) {
    if (!this._state.userPermissions.includes(permission)) {
      this.setUserPermissions([...this._state.userPermissions, permission]);
    }
  }

  removeUserPermission(permission) {
    this.setUserPermissions(this._state.userPermissions.filter(p => p !== permission));
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

    if (data.username && data.username.length < 3) {
      errors.push('Username must be at least 3 characters');
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

  // Data transformation
  transformForAPI(data) {
    return {
      email: data.email?.toLowerCase().trim(),
      username: data.username?.trim(),
      password: data.password,
      first_name: data.firstName?.trim(),
      last_name: data.lastName?.trim(),
      phone: data.phone?.trim(),
      organization_id: data.organizationId,
      role: data.role,
      preferences: data.preferences
    };
  }

  transformFromAPI(data) {
    return {
      id: data.id,
      email: data.email,
      username: data.username,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone,
      organizationId: data.organization_id,
      role: data.role,
      preferences: data.preferences || {},
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      isActive: data.is_active,
      lastLogin: data.last_login,
      verificationToken: data.verification_token,
      mfaEnabled: data.mfa_enabled,
      mfaPhone: data.mfa_phone
    };
  }

  // Clear user data (logout)
  clearUser() {
    this.setState({
      currentUser: null,
      userProfile: null,
      userPreferences: {},
      userPermissions: [],
      userRoles: [],
      lastLogin: null,
      isOnline: false,
      sessionData: null
    });
  }

  // Utility methods
  getUserDisplayName() {
    if (!this._state.currentUser) return '';
    
    const { firstName, lastName, username, email } = this._state.currentUser;
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    
    if (firstName) return firstName;
    if (lastName) return lastName;
    if (username) return username;
    
    return email;
  }

  getUserInitials() {
    const displayName = this.getUserDisplayName();
    return displayName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  isAdmin() {
    return this.hasRole('admin') || this.hasRole('super_admin');
  }

  isManager() {
    return this.hasRole('manager') || this.isAdmin();
  }

  canManageUsers() {
    return this.hasPermission('manage_users') || this.isAdmin();
  }

  canManageInventory() {
    return this.hasPermission('manage_inventory') || this.isManager();
  }

  canProcessSales() {
    return this.hasPermission('process_sales') || this.isManager();
  }

  canViewReports() {
    return this.hasPermission('view_reports') || this.isManager();
  }
}

export default UserModel; 