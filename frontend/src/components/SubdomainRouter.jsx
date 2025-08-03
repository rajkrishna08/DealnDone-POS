import React, { useState, useEffect } from 'react';

const SubdomainRouter = ({ children }) => {
  const [storeContext, setStoreContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const detectSubdomain = () => {
      const hostname = window.location.hostname;
      
      // Check if we're on a subdomain
      if (hostname.includes('.dealndone.com') || hostname.includes('localhost')) {
        const parts = hostname.split('.');
        const subdomain = parts[0];
        
        // Skip if it's the main domain or localhost without subdomain
        if (subdomain === 'www' || subdomain === 'dealndone' || subdomain === 'localhost') {
          return null;
        }
        
        return subdomain;
      }
      
      return null;
    };

    const loadStoreContext = async () => {
      try {
        setLoading(true);
        
        // Check if we're on a subdomain
        const subdomain = detectSubdomain();
        
        if (!subdomain) {
          // Not on a subdomain, show main app
          setStoreContext({ isSubdomain: false });
          setLoading(false);
          return;
        }

        // We're on a subdomain, load store info
        const response = await fetch(`http://127.0.0.1:8000/api/store/info`, {
          headers: {
            'Host': `${subdomain}.localhost:3000`
          }
        });

        if (!response.ok) {
          throw new Error('Store not found');
        }

        const data = await response.json();
        
        setStoreContext({
          isSubdomain: true,
          store: data.store,
          limits: data.limits,
          subdomain: data.subdomain
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
          <p className="text-gray-600 mb-6">
            The store you're looking for doesn't exist or is not available.
          </p>
          <button
            onClick={() => window.location.href = 'http://localhost:3000'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Main Site
          </button>
        </div>
      </div>
    );
  }

  // Pass store context to children
  return React.cloneElement(children, { storeContext });
};

export default SubdomainRouter; 