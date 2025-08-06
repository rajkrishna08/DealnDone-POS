import React, { useState, useEffect } from 'react';
import { useInventoryMVC, useAuthMVC, usePOSMVC, useStoreMVC, useCustomerMVC, useAnalyticsMVC } from '../components/MVCProvider';

/**
 * MVC Integration Test Component
 * Tests all MVC modules and their interactions
 */
const MVCIntegrationTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  // Get MVC instances
  const inventoryMVC = useInventoryMVC();
  const authMVC = useAuthMVC();
  const posMVC = usePOSMVC();
  const storeMVC = useStoreMVC();
  const customerMVC = useCustomerMVC();
  const analyticsMVC = useAnalyticsMVC();

  const runTests = async () => {
    setIsRunning(true);
    const results = {};

    try {
      // Test 1: Inventory MVC
      console.log('🧪 Testing Inventory MVC...');
      results.inventory = await testInventoryMVC();

      // Test 2: Auth MVC
      console.log('🧪 Testing Auth MVC...');
      results.auth = await testAuthMVC();

      // Test 3: POS MVC
      console.log('🧪 Testing POS MVC...');
      results.pos = await testPOSMVC();

      // Test 4: Store MVC
      console.log('🧪 Testing Store MVC...');
      results.store = await testStoreMVC();

      // Test 5: Customer MVC
      console.log('🧪 Testing Customer MVC...');
      results.customer = await testCustomerMVC();

      // Test 6: Analytics MVC
      console.log('🧪 Testing Analytics MVC...');
      results.analytics = await testAnalyticsMVC();

      // Test 7: Cross-module interactions
      console.log('🧪 Testing Cross-module interactions...');
      results.crossModule = await testCrossModuleInteractions();

    } catch (error) {
      console.error('❌ Test failed:', error);
      results.error = error.message;
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const testInventoryMVC = async () => {
    const results = {};

    try {
      // Test Inventory Model
      results.model = {
        state: inventoryMVC.inventoryModel.state,
        loading: inventoryMVC.inventoryModel.loading,
        error: inventoryMVC.inventoryModel.error,
        summary: inventoryMVC.inventoryModel.getSummary()
      };

      // Test Stock Model
      results.stock = {
        state: inventoryMVC.stockModel.state,
        stockLevels: inventoryMVC.stockModel.stockLevels,
        summary: inventoryMVC.stockModel.getOverallStockSummary()
      };

      // Test Vendor Model
      results.vendor = {
        state: inventoryMVC.vendorModel.state,
        vendors: inventoryMVC.vendorModel.vendors,
        summary: inventoryMVC.vendorModel.getOverallVendorSummary()
      };

      // Test Controller
      results.controller = {
        loading: inventoryMVC.inventoryController.loading,
        error: inventoryMVC.inventoryController.error
      };

      results.success = true;
    } catch (error) {
      results.success = false;
      results.error = error.message;
    }

    return results;
  };

  const testAuthMVC = async () => {
    const results = {};

    try {
      // Test Auth Model
      results.authModel = {
        state: authMVC.model.state,
        loading: authMVC.model.loading,
        error: authMVC.model.error
      };

      // Test User Model
      results.userModel = {
        state: authMVC.userModel.state,
        loading: authMVC.userModel.loading,
        error: authMVC.userModel.error
      };

      // Test Controller
      results.controller = {
        loading: authMVC.controller.loading,
        error: authMVC.controller.error
      };

      results.success = true;
    } catch (error) {
      results.success = false;
      results.error = error.message;
    }

    return results;
  };

  const testPOSMVC = async () => {
    const results = {};

    try {
      // Test Product Model
      results.productModel = {
        state: posMVC.productModel.state,
        loading: posMVC.productModel.loading,
        error: posMVC.productModel.error
      };

      // Test Sale Model
      results.saleModel = {
        state: posMVC.saleModel.state,
        loading: posMVC.saleModel.loading,
        error: posMVC.saleModel.error
      };

      // Test Controller
      results.controller = {
        loading: posMVC.posController.loading,
        error: posMVC.posController.error
      };

      results.success = true;
    } catch (error) {
      results.success = false;
      results.error = error.message;
    }

    return results;
  };

  const testStoreMVC = async () => {
    const results = {};

    try {
      // Test Store Model
      results.model = {
        state: storeMVC.model.state,
        loading: storeMVC.model.loading,
        error: storeMVC.model.error
      };

      // Test Controller
      results.controller = {
        loading: storeMVC.controller.loading,
        error: storeMVC.controller.error
      };

      results.success = true;
    } catch (error) {
      results.success = false;
      results.error = error.message;
    }

    return results;
  };

  const testCustomerMVC = async () => {
    const results = {};

    try {
      // Test Customer Model
      results.model = {
        state: customerMVC.customerModel.state,
        loading: customerMVC.customerModel.loading,
        error: customerMVC.customerModel.error,
        summary: customerMVC.customerModel.getCustomerSummary()
      };

      // Test Controller
      results.controller = {
        loading: customerMVC.customerController.loading,
        error: customerMVC.customerController.error
      };

      results.success = true;
    } catch (error) {
      results.success = false;
      results.error = error.message;
    }

    return results;
  };

  const testAnalyticsMVC = async () => {
    const results = {};

    try {
      // Test Analytics Model
      results.model = {
        state: analyticsMVC.salesAnalyticsModel.state,
        loading: analyticsMVC.salesAnalyticsModel.loading,
        error: analyticsMVC.salesAnalyticsModel.error,
        summary: analyticsMVC.salesAnalyticsModel.getAnalyticsSummary()
      };

      // Test Controller
      results.controller = {
        loading: analyticsMVC.analyticsController.loading,
        error: analyticsMVC.analyticsController.error
      };

      results.success = true;
    } catch (error) {
      results.success = false;
      results.error = error.message;
    }

    return results;
  };

  const testCrossModuleInteractions = async () => {
    const results = {};

    try {
      // Test that all MVC instances are accessible
      results.allInstancesAccessible = !!(
        inventoryMVC && authMVC && posMVC && storeMVC && customerMVC && analyticsMVC
      );

      // Test that models can be updated
      inventoryMVC.inventoryModel.setProducts([]);
      authMVC.model.setState({ test: true });
      posMVC.productModel.setProducts([]);
      storeMVC.model.setState({ test: true });
      customerMVC.customerModel.setCustomers([]);
      analyticsMVC.salesAnalyticsModel.setSalesData([]);

      results.modelsUpdatable = true;

      // Test that controllers can be called
      inventoryMVC.inventoryController.setLoading(false);
      authMVC.controller.setLoading(false);
      posMVC.posController.setLoading(false);
      storeMVC.controller.setLoading(false);
      customerMVC.customerController.setLoading(false);
      analyticsMVC.analyticsController.setLoading(false);

      results.controllersCallable = true;

      results.success = true;
    } catch (error) {
      results.success = false;
      results.error = error.message;
    }

    return results;
  };

  const getTestStatus = (test) => {
    if (!test) return 'pending';
    if (test.success === false) return 'failed';
    if (test.success === true) return 'passed';
    return 'running';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'running': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': return '✅';
      case 'failed': return '❌';
      case 'running': return '🔄';
      default: return '⏳';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🧪 MVC Integration Test Suite
          </h1>
          
          <div className="mb-6">
            <button
              onClick={runTests}
              disabled={isRunning}
              className={`px-6 py-3 rounded-lg font-semibold ${
                isRunning
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </button>
          </div>

          <div className="space-y-6">
            {/* Inventory MVC Test */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">
                {getStatusIcon(getTestStatus(testResults.inventory))} Inventory MVC
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">Model Tests</h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {testResults.inventory?.model ? 
                      JSON.stringify(testResults.inventory.model, null, 2) : 
                      'Not tested'
                    }
                  </pre>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Controller Tests</h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {testResults.inventory?.controller ? 
                      JSON.stringify(testResults.inventory.controller, null, 2) : 
                      'Not tested'
                    }
                  </pre>
                </div>
              </div>
            </div>

            {/* Auth MVC Test */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">
                {getStatusIcon(getTestStatus(testResults.auth))} Auth MVC
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">Auth Model</h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {testResults.auth?.authModel ? 
                      JSON.stringify(testResults.auth.authModel, null, 2) : 
                      'Not tested'
                    }
                  </pre>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">User Model</h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {testResults.auth?.userModel ? 
                      JSON.stringify(testResults.auth.userModel, null, 2) : 
                      'Not tested'
                    }
                  </pre>
                </div>
              </div>
            </div>

            {/* POS MVC Test */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">
                {getStatusIcon(getTestStatus(testResults.pos))} POS MVC
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">Product Model</h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {testResults.pos?.productModel ? 
                      JSON.stringify(testResults.pos.productModel, null, 2) : 
                      'Not tested'
                    }
                  </pre>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Sale Model</h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {testResults.pos?.saleModel ? 
                      JSON.stringify(testResults.pos.saleModel, null, 2) : 
                      'Not tested'
                    }
                  </pre>
                </div>
              </div>
            </div>

            {/* Store MVC Test */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">
                {getStatusIcon(getTestStatus(testResults.store))} Store MVC
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">Store Model</h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {testResults.store?.model ? 
                      JSON.stringify(testResults.store.model, null, 2) : 
                      'Not tested'
                    }
                  </pre>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Store Controller</h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {testResults.store?.controller ? 
                      JSON.stringify(testResults.store.controller, null, 2) : 
                      'Not tested'
                    }
                  </pre>
                </div>
              </div>
            </div>

            {/* Customer MVC Test */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">
                {getStatusIcon(getTestStatus(testResults.customer))} Customer MVC
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">Customer Model</h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {testResults.customer?.model ? 
                      JSON.stringify(testResults.customer.model, null, 2) : 
                      'Not tested'
                    }
                  </pre>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Customer Controller</h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {testResults.customer?.controller ? 
                      JSON.stringify(testResults.customer.controller, null, 2) : 
                      'Not tested'
                    }
                  </pre>
                </div>
              </div>
            </div>

            {/* Analytics MVC Test */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">
                {getStatusIcon(getTestStatus(testResults.analytics))} Analytics MVC
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">Analytics Model</h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {testResults.analytics?.model ? 
                      JSON.stringify(testResults.analytics.model, null, 2) : 
                      'Not tested'
                    }
                  </pre>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Analytics Controller</h3>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {testResults.analytics?.controller ? 
                      JSON.stringify(testResults.analytics.controller, null, 2) : 
                      'Not tested'
                    }
                  </pre>
                </div>
              </div>
            </div>

            {/* Cross-module Test */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">
                {getStatusIcon(getTestStatus(testResults.crossModule))} Cross-module Interactions
              </h2>
              <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                {testResults.crossModule ? 
                  JSON.stringify(testResults.crossModule, null, 2) : 
                  'Not tested'
                }
              </pre>
            </div>
          </div>

          {/* Summary */}
          {Object.keys(testResults).length > 0 && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Test Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(testResults).map(([testName, result]) => (
                  <div key={testName} className="text-center">
                    <div className={`text-sm font-medium ${getStatusColor(getTestStatus(result))}`}>
                      {testName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getTestStatus(result)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MVCIntegrationTest; 