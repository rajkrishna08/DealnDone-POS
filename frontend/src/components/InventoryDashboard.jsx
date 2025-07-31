import React, { useState, useEffect } from 'react';

const InventoryDashboard = () => {
  const [inventoryData, setInventoryData] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0,
    recentPurchases: [],
    stockAlerts: [],
    topProducts: []
  });

  useEffect(() => {
    // Dummy data for inventory dashboard
    const inventoryDashboardData = {
      totalProducts: 1247,
      lowStockItems: 12,
      outOfStockItems: 3,
      totalValue: 45230,
      recentPurchases: [
        { id: 1, product: 'Classic White Shirt', quantity: 50, date: '2025-01-30', cost: 1250, supplier: 'Fashion Wholesale Co.' },
        { id: 2, product: 'Blue Oxford Shirt', quantity: 30, date: '2025-01-29', cost: 900, supplier: 'Textile Traders Ltd.' },
        { id: 3, product: 'Black Formal Shirt', quantity: 25, date: '2025-01-28', cost: 750, supplier: 'Premium Fabrics Inc.' },
        { id: 4, product: 'Denim Jeans', quantity: 40, date: '2025-01-27', cost: 1800, supplier: 'Fashion Wholesale Co.' },
        { id: 5, product: 'Leather Belt', quantity: 60, date: '2025-01-26', cost: 1200, supplier: 'Accessories Plus' }
      ],
      stockAlerts: [
        { id: 1, name: 'Classic White Shirt', currentStock: 3, minStock: 10, department: 'Men\'s Clothing' },
        { id: 2, name: 'Blue Oxford Shirt', currentStock: 2, minStock: 10, department: 'Men\'s Clothing' },
        { id: 3, name: 'Black Formal Shirt', currentStock: 1, minStock: 10, department: 'Men\'s Clothing' },
        { id: 4, name: 'Denim Jeans', currentStock: 4, minStock: 15, department: 'Men\'s Clothing' },
        { id: 5, name: 'Leather Belt', currentStock: 0, minStock: 20, department: 'Accessories' }
      ],
      topProducts: [
        { id: 1, name: 'Classic White Shirt', category: 'Men\'s Clothing', stock: 45, price: 25, value: 1125 },
        { id: 2, name: 'Blue Oxford Shirt', category: 'Men\'s Clothing', stock: 32, price: 30, value: 960 },
        { id: 3, name: 'Black Formal Shirt', category: 'Men\'s Clothing', stock: 28, price: 35, value: 980 },
        { id: 4, name: 'Denim Jeans', category: 'Men\'s Clothing', stock: 25, price: 45, value: 1125 },
        { id: 5, name: 'Leather Belt', category: 'Accessories', stock: 0, price: 20, value: 0 }
      ]
    };
    
    setInventoryData(inventoryDashboardData);
  }, []);

  const metrics = [
    {
      title: 'Total Products',
      value: inventoryData.totalProducts,
      icon: '📦',
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Low Stock Items',
      value: inventoryData.lowStockItems,
      icon: '⚠️',
      color: 'bg-yellow-500',
      change: '+3',
      changeType: 'negative'
    },
    {
      title: 'Out of Stock',
      value: inventoryData.outOfStockItems,
      icon: '❌',
      color: 'bg-red-500',
      change: '-2',
      changeType: 'positive'
    },
    {
      title: 'Total Value',
      value: `$${inventoryData.totalValue.toLocaleString()}`,
      icon: '💰',
      color: 'bg-green-500',
      change: '+8.5%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Inventory Dashboard</h1>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button className="deal-n-done-btn-primary">
            <span>📊</span>
            Generate Report
          </button>
          <button className="deal-n-done-btn-secondary">
            <span>⚙️</span>
            Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="deal-n-done-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm ${
                      metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-2xl">{metric.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stock Alerts */}
          <div className="deal-n-done-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Stock Alerts</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm">View All</button>
            </div>
            <div className="space-y-3">
              {inventoryData.stockAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{alert.name}</p>
                    <p className="text-sm text-gray-600">
                      Current: {alert.currentStock} | Min: {alert.minStock}
                    </p>
                  </div>
                  <button className="deal-n-done-btn-primary text-sm">
                    Reorder
                  </button>
                </div>
              ))}
              {inventoryData.stockAlerts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-4 block">✅</span>
                  <p>No stock alerts</p>
                  <p className="text-sm">All items are well stocked</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Purchases */}
          <div className="deal-n-done-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Purchases</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm">View All</button>
            </div>
            <div className="space-y-3">
              {inventoryData.recentPurchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{purchase.product}</p>
                    <p className="text-sm text-gray-600">
                      {purchase.quantity} units • ${purchase.cost}
                    </p>
                    <p className="text-xs text-gray-500">{purchase.date}</p>
                  </div>
                  <span className="text-green-600 text-sm font-medium">Received</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products by Value */}
        <div className="deal-n-done-card mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products by Stock Value</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Stock</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Unit Price</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {inventoryData.topProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <img 
                          src={`https://via.placeholder.com/50`} 
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover mr-3"
                        />
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{product.category}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock === 0 ? 'bg-red-100 text-red-800' :
                        product.stock <= 10 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">${product.price}</td>
                    <td className="py-3 px-4 text-center font-medium text-gray-900">
                      ${(product.price * product.stock).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="deal-n-done-card mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="deal-n-done-btn-primary">
              <span>📦</span>
              Add Product
            </button>
            <button className="deal-n-done-btn-secondary">
              <span>🛒</span>
              New Purchase
            </button>
            <button className="deal-n-done-btn-secondary">
              <span>🔄</span>
              Stock Transfer
            </button>
            <button className="deal-n-done-btn-secondary">
              <span>📱</span>
              Stock Take
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard; 