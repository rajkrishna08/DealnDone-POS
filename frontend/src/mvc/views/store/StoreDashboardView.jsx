import React, { useEffect, useState } from 'react';
import { Store, Users, Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

/**
 * Store Dashboard View
 * MVC View component for store dashboard
 */
const StoreDashboardView = ({ storeModel, storeController }) => {
  const [dashboardData, setDashboardData] = useState({
    config: {},
    stats: {},
    permissions: {}
  });

  // Subscribe to model changes
  useEffect(() => {
    const handleModelChange = (state, loading, error) => {
      setDashboardData({
        config: state.storeConfig,
        stats: state.storeStats,
        permissions: state.storePermissions
      });
    };

    storeModel.addListener(handleModelChange);

    // Initialize controller if not already done
    if (!storeController.isInitialized) {
      storeController.initialize();
    }

    // Load dashboard data if current store exists
    if (storeModel.currentStore) {
      storeController.loadDashboardData(storeModel.currentStore.id);
    }

    return () => {
      storeModel.removeListener(handleModelChange);
    };
  }, [storeModel, storeController]);

  // Handle store switching
  const handleStoreSwitch = async (storeId) => {
    try {
      await storeController.switchStore(storeId);
    } catch (error) {
      console.error('Error switching store:', error);
    }
  };

  // Handle store creation
  const handleStoreCreate = async (storeData) => {
    try {
      await storeController.createStore(storeData);
    } catch (error) {
      console.error('Error creating store:', error);
    }
  };

  // Get current store info
  const currentStore = storeModel.currentStore;
  const { config, stats, permissions } = dashboardData;

  // Loading state
  if (storeModel.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (storeModel.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <h3 className="text-sm font-medium text-red-800">Error</h3>
        </div>
        <p className="mt-2 text-sm text-red-700">{storeModel.error.message}</p>
      </div>
    );
  }

  // No current store
  if (!currentStore) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <Store className="h-5 w-5 text-yellow-400 mr-2" />
          <h3 className="text-sm font-medium text-yellow-800">No Store Selected</h3>
        </div>
        <p className="mt-2 text-sm text-yellow-700">
          Please select a store to view the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentStore.name} Dashboard
            </h1>
            <p className="text-gray-600">
              Subdomain: {currentStore.subdomain}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Store className="w-3 h-3 mr-1" />
              {currentStore.business_type}
            </span>
          </div>
        </div>
      </div>

      {/* Store Selection */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Switch Store</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {storeModel.stores.map((store) => (
            <button
              key={store.id}
              onClick={() => handleStoreSwitch(store.id)}
              className={`p-3 border rounded-lg text-left transition-colors ${
                store.id === currentStore.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-gray-900">{store.name}</div>
              <div className="text-sm text-gray-500">{store.subdomain}</div>
              {store.id === currentStore.id && (
                <div className="text-xs text-blue-600 mt-1">Current Store</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Employees</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.employeeCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Products</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.productCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats.totalRevenue || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Sales</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.salesCount || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Store Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Configuration</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Max Outlets:</span>
              <span className="text-sm font-medium text-gray-900">
                {currentStore.max_outlets}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Max Registers:</span>
              <span className="text-sm font-medium text-gray-900">
                {currentStore.max_registers}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Max Products:</span>
              <span className="text-sm font-medium text-gray-900">
                {currentStore.max_products}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Max Employees:</span>
              <span className="text-sm font-medium text-gray-900">
                {currentStore.max_employees}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Permissions</h3>
          <div className="space-y-2">
            {Object.entries(permissions).map(([permission, enabled]) => (
              <div key={permission} className="flex items-center justify-between">
                <span className="text-sm text-gray-500 capitalize">
                  {permission.replace(/_/g, ' ')}:
                </span>
                <span className={`text-sm font-medium ${
                  enabled ? 'text-green-600' : 'text-red-600'
                }`}>
                  {enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Debug Info</h4>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify({
              modelSummary: storeModel.getSummary(),
              controllerSummary: storeController.getSummary(),
              currentStore: currentStore,
              dashboardData: dashboardData
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default StoreDashboardView; 