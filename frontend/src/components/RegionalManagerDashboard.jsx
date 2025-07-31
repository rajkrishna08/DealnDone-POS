import React from 'react';

const RegionalManagerDashboard = () => {
  // Mock data for regional manager
  const regionalData = {
    region: "Northeast",
    totalStores: 5,
    totalRevenue: 125000,
    growthRate: 15.5,
    lastUpdated: new Date().toLocaleString()
  };

  const storeMetrics = [
    {
      name: "NYC Outlet",
      sales: 45000,
      orders: 125,
      growth: 12.5,
      status: "active"
    },
    {
      name: "Manhattan 11",
      sales: 38000,
      orders: 98,
      growth: 8.2,
      status: "active"
    },
    {
      name: "Philadelphia Outlet",
      sales: 32000,
      orders: 87,
      growth: 15.8,
      status: "active"
    },
    {
      name: "Boston Store",
      sales: 28000,
      orders: 76,
      growth: 22.1,
      status: "active"
    },
    {
      name: "DC Branch",
      sales: 25000,
      orders: 65,
      growth: 18.3,
      status: "maintenance"
    }
  ];

  const topPerformers = [
    {
      name: "Sarah Chen",
      store: "NYC Outlet",
      sales: 12500,
      improvement: "+25%"
    },
    {
      name: "Mike Johnson",
      store: "Manhattan 11",
      sales: 9800,
      improvement: "+18%"
    },
    {
      name: "Lisa Wang",
      store: "Philadelphia Outlet",
      sales: 8700,
      improvement: "+22%"
    }
  ];

  const regionalAlerts = [
    {
      type: "low_stock",
      store: "NYC Outlet",
      message: "iPhone 15 Pro running low on stock",
      priority: "high"
    },
    {
      type: "maintenance",
      store: "DC Branch",
      message: "Scheduled maintenance in progress",
      priority: "medium"
    },
    {
      type: "performance",
      store: "Boston Store",
      message: "Sales target exceeded by 15%",
      priority: "low"
    }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case "low_stock":
        return "⚠️";
      case "maintenance":
        return "🔧";
      case "performance":
        return "📈";
      default:
        return "📋";
    }
  };

  const getAlertColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Regional Manager Dashboard</h1>
          <div className="text-sm text-gray-500">
            {regionalData.region} Region • {regionalData.totalStores} Stores
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <div className="text-sm text-gray-500">
            Last updated: {regionalData.lastUpdated}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Regional Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="deal-n-done-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${regionalData.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500">
                <span className="text-white text-xl">💰</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">+{regionalData.growthRate}%</span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          <div className="deal-n-done-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Stores</p>
                <p className="text-2xl font-bold text-gray-900">{regionalData.totalStores}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500">
                <span className="text-white text-xl">🏪</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">All Active</span>
            </div>
          </div>

          <div className="deal-n-done-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">451</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-500">
                <span className="text-white text-xl">📦</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">+12%</span>
              <span className="text-sm text-gray-500 ml-1">from last week</span>
            </div>
          </div>

          <div className="deal-n-done-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">$277</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-500">
                <span className="text-white text-xl">📊</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">+8%</span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Store Performance */}
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Performance</h3>
            <div className="space-y-4">
              {storeMetrics.map((store, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">{store.name}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(store.status)}`}>
                        {store.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">${store.sales.toLocaleString()} • {store.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+{store.growth}%</p>
                    <p className="text-xs text-gray-500">growth</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">{performer.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{performer.name}</h4>
                    <p className="text-sm text-gray-500">{performer.store}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${performer.sales.toLocaleString()}</p>
                    <p className="text-sm text-green-600">{performer.improvement}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional Alerts */}
        <div className="deal-n-done-card mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Alerts</h3>
          <div className="space-y-3">
            {regionalAlerts.map((alert, index) => (
              <div key={index} className={`p-4 border rounded-lg ${getAlertColor(alert.priority)}`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-lg">{getAlertIcon(alert.type)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{alert.store}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                        alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalManagerDashboard; 