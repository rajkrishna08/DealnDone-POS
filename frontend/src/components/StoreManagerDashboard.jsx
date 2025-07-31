import React from 'react';

const StoreManagerDashboard = () => {
  // Mock data for store manager
  const storeData = {
    storeName: "Deal n Done, Inc. - NYC Outlet",
    location: "New York, NY",
    manager: "Nick",
    lastUpdated: new Date().toLocaleString()
  };

  const metrics = [
    {
      title: "Today's Sales",
      value: "$2,450",
      change: "+12.5%",
      changeType: "positive",
      icon: "trending_up"
    },
    {
      title: "Pending Orders",
      value: "8",
      change: "-2",
      changeType: "negative",
      icon: "pending"
    },
    {
      title: "Low Stock Items",
      value: "12",
      change: "+3",
      changeType: "warning",
      icon: "inventory"
    },
    {
      title: "Staff on Duty",
      value: "4",
      change: "100%",
      changeType: "positive",
      icon: "people"
    }
  ];

  const recentActivities = [
    {
      type: "sale",
      message: "Sale completed - Classic White Shirt x2",
      time: "2 minutes ago",
      amount: "$50.00"
    },
    {
      type: "order",
      message: "New order received - #ORD-2024-001",
      time: "5 minutes ago",
      amount: "$75.00"
    },
    {
      type: "inventory",
      message: "Low stock alert - Blue Oxford Shirt",
      time: "15 minutes ago",
      amount: "5 units left"
    },
    {
      type: "staff",
      message: "Sarah clocked in",
      time: "30 minutes ago",
      amount: "9:00 AM"
    }
  ];

  const quickActions = [
    {
      title: "Process Sale",
      icon: "point_of_sale",
      color: "bg-blue-500",
      action: () => console.log("Process sale clicked")
    },
    {
      title: "Add Product",
      icon: "add_shopping_cart",
      color: "bg-green-500",
      action: () => console.log("Add product clicked")
    },
    {
      title: "View Reports",
      icon: "analytics",
      color: "bg-purple-500",
      action: () => console.log("View reports clicked")
    },
    {
      title: "Manage Staff",
      icon: "people",
      color: "bg-orange-500",
      action: () => console.log("Manage staff clicked")
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "sale":
        return "💰";
      case "order":
        return "📦";
      case "inventory":
        return "⚠️";
      case "staff":
        return "👤";
      default:
        return "📋";
    }
  };

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Store Manager Dashboard</h1>
          <div className="text-sm text-gray-500">
            {storeData.storeName} • {storeData.location}
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <div className="text-sm text-gray-500">
            Last updated: {storeData.lastUpdated}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="deal-n-done-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${metric.color}`}>
                  <span className="text-white text-xl">{metric.icon}</span>
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                  {metric.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from yesterday</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action.color} mb-2`}>
                    <span className="text-white text-lg">{action.icon}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{action.title}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">{activity.amount}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Store Info */}
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Store Name</p>
                <p className="font-medium text-gray-900">{storeData.storeName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{storeData.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Manager</p>
                <p className="font-medium text-gray-900">{storeData.manager}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreManagerDashboard; 