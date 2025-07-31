import React, { useState, useEffect } from 'react';

const ExecutiveDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock data for executive
  const executiveData = {
    company: "Deal n Done, Inc.",
    executive: "Nick",
    totalStores: 24,
    totalRevenue: "$1,245,000",
    lastUpdated: new Date().toLocaleString()
  };

  const executiveMetrics = [
    {
      title: "Total Revenue",
      value: "$1,245,000",
      change: "+15.3%",
      changeType: "positive",
      icon: "trending_up"
    },
    {
      title: "Active Stores",
      value: "24/25",
      change: "+2",
      changeType: "positive",
      icon: "store"
    },
    {
      title: "Total Staff",
      value: "156",
      change: "+12",
      changeType: "positive",
      icon: "people"
    },
    {
      title: "Customer Satisfaction",
      value: "4.8/5.0",
      change: "+0.2",
      changeType: "positive",
      icon: "star"
    }
  ];

  const regionalPerformance = [
    {
      region: "Northeast",
      revenue: "$456,000",
      growth: "+18.2%",
      stores: 8,
      staff: 45
    },
    {
      region: "Southeast",
      revenue: "$389,000",
      growth: "+12.5%",
      stores: 6,
      staff: 38
    },
    {
      region: "Midwest",
      revenue: "$234,000",
      growth: "+8.7%",
      stores: 4,
      staff: 25
    },
    {
      region: "West",
      revenue: "$166,000",
      growth: "+22.1%",
      stores: 6,
      staff: 48
    }
  ];

  const strategicInsights = [
    {
      type: "growth",
      title: "Market Expansion Opportunity",
      description: "West region shows 22.1% growth - consider additional stores",
      impact: "High",
      timeframe: "Q2 2024"
    },
    {
      type: "efficiency",
      title: "Inventory Optimization",
      description: "Reduce stock levels by 15% to improve cash flow",
      impact: "Medium",
      timeframe: "Q1 2024"
    },
    {
      type: "customer",
      title: "Customer Retention",
      description: "Implement loyalty program to increase repeat customers",
      impact: "High",
      timeframe: "Q2 2024"
    }
  ];

  const financialSummary = [
    {
      category: "Revenue",
      current: "$1,245,000",
      target: "$1,200,000",
      status: "exceeded"
    },
    {
      category: "Expenses",
      current: "$890,000",
      target: "$900,000",
      status: "under"
    },
    {
      category: "Profit Margin",
      current: "28.5%",
      target: "25.0%",
      status: "exceeded"
    },
    {
      category: "Cash Flow",
      current: "$355,000",
      target: "$300,000",
      status: "exceeded"
    }
  ];

  const upcomingMilestones = [
    {
      title: "Q2 Store Expansion",
      description: "Open 3 new stores in West region",
      date: "June 2024",
      status: "on-track"
    },
    {
      title: "Digital Transformation",
      description: "Launch new mobile app and online ordering",
      date: "July 2024",
      status: "on-track"
    },
    {
      title: "Staff Training Program",
      description: "Complete leadership training for store managers",
      date: "August 2024",
      status: "delayed"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="deal-n-done-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
            <p className="text-gray-600">{executiveData.company}</p>
            <p className="text-sm text-gray-500">Last updated: {executiveData.lastUpdated}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-900">{executiveData.executive}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">N</span>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {executiveMetrics.map((metric, index) => (
          <div key={index} className="deal-n-done-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <div className="flex items-center mt-1">
                  <span className={`text-sm font-medium ${
                    metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last quarter</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                metric.changeType === 'positive' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className={`material-icons ${
                  metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.icon}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Regional Performance */}
      <div className="deal-n-done-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Regional Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Region</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Revenue</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Growth</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Stores</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Staff</th>
              </tr>
            </thead>
            <tbody>
              {regionalPerformance.map((region, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{region.region}</td>
                  <td className="text-right py-3 px-4 font-medium text-gray-900">{region.revenue}</td>
                  <td className="text-right py-3 px-4">
                    <span className={`text-sm font-medium ${
                      region.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {region.growth}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4 text-gray-900">{region.stores}</td>
                  <td className="text-center py-3 px-4 text-gray-900">{region.staff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Insights and Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="deal-n-done-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Strategic Insights</h2>
          <div className="space-y-3">
            {strategicInsights.map((insight, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">{insight.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    insight.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {insight.impact}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                <p className="text-xs text-gray-500">Timeline: {insight.timeframe}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="deal-n-done-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h2>
          <div className="space-y-3">
            {financialSummary.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.category}</p>
                  <p className="text-xs text-gray-500">Target: {item.target}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{item.current}</p>
                  <span className={`text-xs font-medium ${
                    item.status === 'exceeded' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.status === 'exceeded' ? '✓ Exceeded' : '✓ Under Budget'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Milestones */}
      <div className="deal-n-done-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Milestones</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingMilestones.map((milestone, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">{milestone.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  milestone.status === 'on-track' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {milestone.status === 'on-track' ? 'On Track' : 'Delayed'}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">{milestone.description}</p>
              <p className="text-xs text-gray-500">Due: {milestone.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Company Overview */}
      <div className="deal-n-done-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <span className="material-icons text-blue-600 text-2xl mb-2">store</span>
            <p className="text-sm font-medium text-gray-900">Total Stores</p>
            <p className="text-2xl font-bold text-blue-600">24</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <span className="material-icons text-green-600 text-2xl mb-2">trending_up</span>
            <p className="text-sm font-medium text-gray-900">Revenue Growth</p>
            <p className="text-2xl font-bold text-green-600">+15.3%</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <span className="material-icons text-purple-600 text-2xl mb-2">people</span>
            <p className="text-sm font-medium text-gray-900">Total Staff</p>
            <p className="text-2xl font-bold text-purple-600">156</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <span className="material-icons text-yellow-600 text-2xl mb-2">star</span>
            <p className="text-sm font-medium text-gray-900">Customer Rating</p>
            <p className="text-2xl font-bold text-yellow-600">4.8/5.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard; 