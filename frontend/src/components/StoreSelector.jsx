import React, { useState } from 'react';
import { Search, Store, Globe, ArrowRight } from 'lucide-react';
import useStoreRouting from '../hooks/useStoreRouting';

/**
 * Store Selector Component
 * Allows users to switch between stores in development and production
 */
const StoreSelector = ({ className = '' }) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const {
    currentStore,
    isDevelopment,
    isProduction,
    goToStore,
    validateStoreName,
    sanitizeStore,
    buildUrlForStore
  } = useStoreRouting();

  // Sample stores for demo
  const sampleStores = [
    { name: 'honey', displayName: 'Honey Store' },
    { name: 'test', displayName: 'Test Store' },
    { name: 'demo', displayName: 'Demo Store' },
    { name: 'fashion', displayName: 'Fashion Store' },
    { name: 'electronics', displayName: 'Electronics Store' }
  ];

  const handleStoreSelect = (storeName) => {
    if (validateStoreName(storeName)) {
      goToStore(storeName);
      setIsOpen(false);
      setInputValue('');
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const sanitizedStore = sanitizeStore(inputValue);
    if (sanitizedStore && validateStoreName(sanitizedStore)) {
      handleStoreSelect(sanitizedStore);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const getCurrentStoreDisplay = () => {
    if (!currentStore) return 'Select Store';
    
    const store = sampleStores.find(s => s.name === currentStore);
    return store ? store.displayName : currentStore;
  };

  const getEnvironmentBadge = () => {
    if (isDevelopment) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Globe className="w-3 h-3 mr-1" />
          Dev
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <Store className="w-3 h-3 mr-1" />
        Prod
      </span>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Current Store Display */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <Store className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-900">
            {getCurrentStoreDisplay()}
          </span>
          {getEnvironmentBadge()}
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="p-4">
            {/* Environment Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Environment
                </span>
                {getEnvironmentBadge()}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {isDevelopment ? (
                  <div>
                    <p>Development Mode</p>
                    <p>URL Format: localhost:3002/?store=name</p>
                  </div>
                ) : (
                  <div>
                    <p>Production Mode</p>
                    <p>URL Format: name.dealndone.com</p>
                  </div>
                )}
              </div>
            </div>

            {/* Store Input */}
            <form onSubmit={handleInputSubmit} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Enter store name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Go to Store
              </button>
            </form>

            {/* Sample Stores */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Sample Stores
              </h3>
              <div className="space-y-1">
                {sampleStores.map((store) => (
                  <button
                    key={store.name}
                    onClick={() => handleStoreSelect(store.name)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-gray-50 ${
                      currentStore === store.name ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {store.displayName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {isDevelopment ? (
                          `localhost:3002/?store=${store.name}`
                        ) : (
                          `${store.name}.dealndone.com`
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Current Store Info */}
            {currentStore && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  Current Store
                </h4>
                <div className="text-xs text-blue-700">
                  <p>Name: {currentStore}</p>
                  <p>URL: {buildUrlForStore(currentStore)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default StoreSelector; 