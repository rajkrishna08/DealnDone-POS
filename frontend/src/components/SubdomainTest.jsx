import React from 'react';

const SubdomainTest = ({ storeContext }) => {
  if (!storeContext || !storeContext.isSubdomain) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-blue-500 text-6xl mb-4">🏪</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Deal n Done</h1>
          <p className="text-gray-600 mb-6">
            This is the main site. To test subdomain functionality, visit:
          </p>
          <div className="space-y-2 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <strong>Test URLs:</strong>
              <br />
              • <a href="http://honey.localhost:3000" className="text-blue-600 hover:underline">honey.localhost:3000</a>
              <br />
              • <a href="http://teststore.localhost:3000" className="text-blue-600 hover:underline">teststore.localhost:3000</a>
              <br />
              • <a href="http://prostore.localhost:3000" className="text-blue-600 hover:underline">prostore.localhost:3000</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { store, limits, subdomain } = storeContext;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏪</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to {store.store_name}
            </h1>
            <p className="text-gray-600">
              Your store URL: <strong className="font-mono">{subdomain}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Store Information */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Store Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Store Name:</span>
                  <span className="ml-2">{store.store_name}</span>
                </div>
                <div>
                  <span className="font-medium">Business Type:</span>
                  <span className="ml-2 capitalize">{store.business_type}</span>
                </div>
                <div>
                  <span className="font-medium">Plan:</span>
                  <span className="ml-2 capitalize">{store.plan_type}</span>
                </div>
                <div>
                  <span className="font-medium">Owner:</span>
                  <span className="ml-2">{store.email}</span>
                </div>
                <div>
                  <span className="font-medium">Role:</span>
                  <span className="ml-2 capitalize">{store.role}</span>
                </div>
              </div>
            </div>

            {/* Plan Limits */}
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Plan Limits</h2>
              <div className="space-y-3">
                {Object.entries(limits).map(([feature, limit]) => (
                  <div key={feature}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium capitalize">{feature}:</span>
                      <span className="text-sm">
                        {limit.used} / {limit.limit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          limit.percentage > 80 ? 'bg-red-500' :
                          limit.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(limit.percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {limit.percentage}% used
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Open POS
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Manage Inventory
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                View Analytics
              </button>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                Settings
              </button>
            </div>
          </div>

          {/* Back to Main Site */}
          <div className="mt-8 text-center">
            <a
              href="http://localhost:3000"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              ← Back to Main Site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubdomainTest; 