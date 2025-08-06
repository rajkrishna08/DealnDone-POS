import React, { useState, useEffect } from 'react';

const SubdomainRouter = ({ children }) => {
  const [storeContext, setStoreContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const detectSubdomain = () => {
      const hostname = window.location.hostname;
      
      // Handle localhost development
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // For development, check for subdomain parameter
        const urlParams = new URLSearchParams(window.location.search);
        const subdomainParam = urlParams.get('subdomain');
        return subdomainParam || null;
      }
      
      // Handle production subdomains
      if (hostname.includes('.dealndone.com')) {
        const parts = hostname.split('.');
        
        // If we have more than 2 parts, it's a subdomain
        // e.g., honey.dealndone.com -> parts = ['honey', 'dealndone', 'com']
        if (parts.length > 2 && parts[0] !== 'www') {
          return parts[0]; // Returns 'honey'
        }
      }
      
      return null;
    };

    const loadStoreContext = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if we're on a subdomain
        const subdomain = detectSubdomain();
        
        if (!subdomain) {
          // Not on a subdomain, show main app
          setStoreContext({ 
            isSubdomain: false,
            subdomain: null
          });
          setLoading(false);
          return;
        }

        // We're on a subdomain, load store info
        // Use relative path so it works with proxy
        const response = await fetch(`/api/stores/${subdomain}/info`);
        
        if (response.status === 404) {
          throw new Error('Store not found');
        }
        
        if (!response.ok) {
          throw new Error('Failed to load store information');
        }

        const data = await response.json();
        
        setStoreContext({
          isSubdomain: true,
          store: data.store,
          plan: data.store?.plan,
          planFeatures: data.store?.planFeatures,
          subdomain: subdomain,
          storeId: data.store?._id
        });
        
      } catch (error) {
        console.error('Error loading store context:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadStoreContext();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">🏪</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
          <p className="text-gray-600 mb-2">
            {error === 'Store not found' 
              ? "The store you're looking for doesn't exist."
              : "There was an error loading the store information."
            }
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Please check the URL or contact the store owner.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = window.location.origin.includes('localhost') 
                ? 'http://localhost:3000' 
                : 'https://dealndone.com'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
            >
              Go to Main Site
            </button>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pass store context to children
  return React.cloneElement(children, { storeContext });
};

export default SubdomainRouter; 