import React from 'react';
import { Store, Globe, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import useStoreRouting from '../hooks/useStoreRouting';

/**
 * Subdomain Demo Component
 * Demonstrates the subdomain routing functionality
 */
const SubdomainDemo = () => {
  const {
    currentStore,
    environmentInfo,
    isLoading,
    isDevelopment,
    isProduction,
    hasValidStore,
    getStoreFromUrl,
    buildUrlForStore,
    validateStoreName,
    sanitizeStore,
    goToStore
  } = useStoreRouting();

  const testStores = [
    { name: 'honey', displayName: 'Honey Store' },
    { name: 'test', displayName: 'Test Store' },
    { name: 'demo', displayName: 'Demo Store' },
    { name: 'fashion', displayName: 'Fashion Store' },
    { name: 'electronics', displayName: 'Electronics Store' }
  ];

  const handleTestStore = (storeName) => {
    if (validateStoreName(storeName)) {
      goToStore(storeName);
    }
  };

  const getStatusIcon = () => {
    if (isLoading) {
      return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
    }
    return hasValidStore ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-yellow-500" />
    );
  };

  const getEnvironmentInfo = () => {
    if (isDevelopment) {
      return {
        name: 'Development',
        description: 'Using query parameters for store routing',
        urlFormat: 'localhost:3002/?store=name',
        color: 'bg-yellow-100 text-yellow-800'
      };
    }
    return {
      name: 'Production',
      description: 'Using subdomains for store routing',
      urlFormat: 'name.dealndone.com',
      color: 'bg-green-100 text-green-800'
    };
  };

  const envInfo = getEnvironmentInfo();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Subdomain Routing Demo</h1>
        <p className="text-gray-600">Test the subdomain routing functionality for both development and production environments</p>
      </div>

      {/* Current Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Current Status</h2>
          {getStatusIcon()}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Store className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Current Store:</span>
              <span className="text-sm text-gray-900">
                {currentStore || 'None detected'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Environment:</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${envInfo.color}`}>
                {envInfo.name}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">URL Format:</span>
              <span className="text-sm text-gray-900 font-mono">
                {envInfo.urlFormat}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Hostname:</span>
              <span className="ml-2 text-gray-900 font-mono">
                {environmentInfo?.hostname || 'Unknown'}
              </span>
            </div>
            
            <div className="text-sm">
              <span className="font-medium text-gray-700">Protocol:</span>
              <span className="ml-2 text-gray-900 font-mono">
                {environmentInfo?.protocol || 'Unknown'}
              </span>
            </div>
            
            <div className="text-sm">
              <span className="font-medium text-gray-700">Port:</span>
              <span className="ml-2 text-gray-900 font-mono">
                {environmentInfo?.port || 'None'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Environment Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Environment Information</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">{envInfo.name} Mode</h3>
          <p className="text-sm text-gray-600 mb-3">{envInfo.description}</p>
          <div className="text-sm">
            <span className="font-medium text-gray-700">URL Format:</span>
            <code className="ml-2 bg-gray-200 px-2 py-1 rounded text-gray-800">
              {envInfo.urlFormat}
            </code>
          </div>
        </div>
      </div>

      {/* Test Stores */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Store Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testStores.map((store) => (
            <div
              key={store.name}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                currentStore === store.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleTestStore(store.name)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{store.displayName}</h3>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-sm text-gray-500 font-mono">
                {isDevelopment ? (
                  `localhost:3002/?store=${store.name}`
                ) : (
                  `${store.name}.dealndone.com`
                )}
              </div>
              {currentStore === store.name && (
                <div className="mt-2 flex items-center text-sm text-blue-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Current Store
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* URL Testing */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">URL Testing</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Development URLs (for testing):</h3>
            <div className="space-y-2">
              {testStores.slice(0, 3).map((store) => (
                <div key={store.name} className="text-sm">
                  <a
                    href={`http://localhost:3002/?store=${store.name}`}
                    className="text-blue-600 hover:text-blue-800 font-mono"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    http://localhost:3002/?store={store.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Production URLs (example):</h3>
            <div className="space-y-2">
              {testStores.slice(0, 3).map((store) => (
                <div key={store.name} className="text-sm">
                  <span className="text-gray-600 font-mono">
                    https://{store.name}.dealndone.com
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubdomainDemo; 