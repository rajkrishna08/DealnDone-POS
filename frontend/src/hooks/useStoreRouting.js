import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  getCurrentStoreName,
  getCurrentStoreNameWithFallback,
  buildStoreUrl,
  navigateToStore,
  hasValidStore,
  isValidStoreName,
  sanitizeStoreName,
  getStoreConfig,
  getEnvironmentInfo
} from '../utils/subdomainUtils';

/**
 * Custom hook for managing store routing and subdomain handling
 * @returns {object} Store routing utilities and state
 */
export const useStoreRouting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStore, setCurrentStore] = useState(null);
  const [environmentInfo, setEnvironmentInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get current store name from URL
  const getStoreFromUrl = useCallback(() => {
    return getCurrentStoreName();
  }, []);

  // Get store with fallback
  const getStoreWithFallback = useCallback((fallback = 'demo') => {
    return getCurrentStoreNameWithFallback(fallback);
  }, []);

  // Check if current URL has valid store
  const hasStore = useCallback(() => {
    return hasValidStore();
  }, []);

  // Navigate to specific store
  const goToStore = useCallback((storeName, path = '') => {
    if (isValidStoreName(storeName)) {
      navigateToStore(storeName, path);
    } else {
      console.error('Invalid store name:', storeName);
    }
  }, []);

  // Build URL for store
  const buildUrlForStore = useCallback((storeName, path = '') => {
    return buildStoreUrl(storeName, path);
  }, []);

  // Validate store name
  const validateStoreName = useCallback((storeName) => {
    return isValidStoreName(storeName);
  }, []);

  // Sanitize store name
  const sanitizeStore = useCallback((storeName) => {
    return sanitizeStoreName(storeName);
  }, []);

  // Get store configuration
  const getConfig = useCallback((storeName) => {
    return getStoreConfig(storeName);
  }, []);

  // Update current store when URL changes
  useEffect(() => {
    const updateCurrentStore = () => {
      const storeName = getStoreFromUrl();
      setCurrentStore(storeName);
      setEnvironmentInfo(getEnvironmentInfo());
      setIsLoading(false);
    };

    updateCurrentStore();

    // Listen for URL changes
    const handleUrlChange = () => {
      updateCurrentStore();
    };

    window.addEventListener('popstate', handleUrlChange);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [getStoreFromUrl]);

  // Effect to handle store changes
  useEffect(() => {
    if (!isLoading && currentStore) {
      // Store changed, you can add logic here
      console.log('Store changed to:', currentStore);
    }
  }, [currentStore, isLoading]);

  return {
    // State
    currentStore,
    environmentInfo,
    isLoading,
    
    // Utilities
    getStoreFromUrl,
    getStoreWithFallback,
    hasStore,
    goToStore,
    buildUrlForStore,
    validateStoreName,
    sanitizeStore,
    getConfig,
    
    // Computed values
    isDevelopment: environmentInfo?.isDevelopment || false,
    isProduction: environmentInfo?.isProduction || false,
    hasValidStore: hasStore()
  };
};

export default useStoreRouting; 