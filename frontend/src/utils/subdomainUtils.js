/**
 * Subdomain Utilities for DealNDone 2025
 * Handles subdomain routing for both development and production environments
 */

// Check if we're in development environment
const isDevelopment = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname.includes('localhost');
};

// Check if we're in production environment
const isProduction = () => {
  return !isDevelopment();
};

/**
 * Get the current store name from URL
 * @returns {string|null} Store name or null if not found
 */
export const getCurrentStoreName = () => {
  if (isDevelopment()) {
    // Development: Extract from query parameter
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('store');
  } else {
    // Production: Extract from subdomain
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    
    // Check if it's a valid subdomain (not www, api, etc.)
    const reservedSubdomains = ['www', 'api', 'admin', 'app', 'staging', 'dev'];
    if (reservedSubdomains.includes(subdomain)) {
      return null;
    }
    
    return subdomain;
  }
};

/**
 * Get the current store name with fallback
 * @param {string} fallback - Fallback store name
 * @returns {string} Store name or fallback
 */
export const getCurrentStoreNameWithFallback = (fallback = 'demo') => {
  const storeName = getCurrentStoreName();
  return storeName || fallback;
};

/**
 * Build URL for a specific store
 * @param {string} storeName - Store name
 * @param {string} path - Optional path to append
 * @returns {string} Complete URL
 */
export const buildStoreUrl = (storeName, path = '') => {
  if (isDevelopment()) {
    // Development: Use query parameter
    const baseUrl = window.location.origin;
    const queryParams = new URLSearchParams({ store: storeName });
    return `${baseUrl}${path}?${queryParams.toString()}`;
  } else {
    // Production: Use subdomain
    const domain = window.location.hostname.split('.').slice(-2).join('.');
    return `https://${storeName}.${domain}${path}`;
  }
};

/**
 * Navigate to a specific store
 * @param {string} storeName - Store name
 * @param {string} path - Optional path to append
 */
export const navigateToStore = (storeName, path = '') => {
  const url = buildStoreUrl(storeName, path);
  window.location.href = url;
};

/**
 * Get the base domain for production
 * @returns {string} Base domain
 */
export const getBaseDomain = () => {
  if (isDevelopment()) {
    return window.location.origin;
  } else {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }
    return hostname;
  }
};

/**
 * Check if current URL has a valid store
 * @returns {boolean} True if valid store is present
 */
export const hasValidStore = () => {
  const storeName = getCurrentStoreName();
  return storeName && storeName.length > 0;
};

/**
 * Get store-specific API base URL
 * @param {string} storeName - Store name
 * @returns {string} API base URL
 */
export const getStoreApiUrl = (storeName) => {
  if (isDevelopment()) {
    // Development: Use localhost with store parameter
    return `http://localhost:8005/api`;
  } else {
    // Production: Use subdomain for API
    const baseDomain = getBaseDomain();
    return `https://api.${baseDomain}`;
  }
};

/**
 * Get current environment info
 * @returns {object} Environment information
 */
export const getEnvironmentInfo = () => {
  return {
    isDevelopment: isDevelopment(),
    isProduction: isProduction(),
    currentStore: getCurrentStoreName(),
    baseDomain: getBaseDomain(),
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    port: window.location.port
  };
};

/**
 * Validate store name format
 * @param {string} storeName - Store name to validate
 * @returns {boolean} True if valid
 */
export const isValidStoreName = (storeName) => {
  if (!storeName) return false;
  
  // Store name validation rules
  const validPattern = /^[a-z0-9-]+$/;
  const minLength = 3;
  const maxLength = 50;
  
  return (
    validPattern.test(storeName) &&
    storeName.length >= minLength &&
    storeName.length <= maxLength &&
    !storeName.startsWith('-') &&
    !storeName.endsWith('-')
  );
};

/**
 * Sanitize store name for URL usage
 * @param {string} storeName - Store name to sanitize
 * @returns {string} Sanitized store name
 */
export const sanitizeStoreName = (storeName) => {
  if (!storeName) return '';
  
  return storeName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Get store-specific configuration
 * @param {string} storeName - Store name
 * @returns {object} Store configuration
 */
export const getStoreConfig = (storeName) => {
  return {
    name: storeName,
    apiUrl: getStoreApiUrl(storeName),
    baseUrl: buildStoreUrl(storeName),
    environment: isDevelopment() ? 'development' : 'production'
  };
};

export default {
  getCurrentStoreName,
  getCurrentStoreNameWithFallback,
  buildStoreUrl,
  navigateToStore,
  getBaseDomain,
  hasValidStore,
  getStoreApiUrl,
  getEnvironmentInfo,
  isValidStoreName,
  sanitizeStoreName,
  getStoreConfig,
  isDevelopment,
  isProduction
}; 