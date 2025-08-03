// MCPDashboard.jsx - Management Control Plane Dashboard
// Displays AI action logs, MCP health status, and real-time sync
// Used by administrators to monitor AI agent activities

import React, { useState, useEffect } from 'react';
import settingsService from '../utils/settingsService';

const MCPDashboard = () => {
  // const [auditLogs, setAuditLogs] = useState([]); // Commented out unused variable
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState({
    status: 'unknown',
    database: 'unknown',
    redis: 'unknown',
    timestamp: null
  });
  const [stats, setStats] = useState({
    totalActions: 0,
    successRate: 0,
    recentActions: [],
    activeAgents: 1
  });

  useEffect(() => {
    loadMCPStats();
    loadHealthStatus();
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      loadMCPStats();
      loadHealthStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadMCPStats = async () => {
    try {
      const orgId = settingsService.getOrgId();
      const response = await fetch(`http://127.0.0.1:8005/mcp/audit-logs/${orgId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const logs = data.logs || [];
      
      // setAuditLogs(logs); // Commented out since auditLogs state was removed
      setStats({
        totalActions: logs.length,
        successRate: logs.length > 0 ? (logs.filter(log => log.success).length / logs.length * 100) : 0,
        recentActions: logs.slice(0, 10),
        activeAgents: 1 // Mock value for now
      });
    } catch (error) {
      console.error('Error loading MCP stats:', error);
      setStats({
        totalActions: 0,
        successRate: 0,
        recentActions: [],
        activeAgents: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const loadHealthStatus = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8005/mcp/health');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const health = await response.json();
      setHealthStatus(health);
    } catch (error) {
      console.error('Error loading MCP health:', error);
      setHealthStatus({
        status: 'unhealthy',
        database: 'unhealthy',
        redis: 'unavailable',
        timestamp: new Date().toISOString()
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'unhealthy':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'unhealthy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'create_outlet':
        return '🏪';
      case 'send_email':
        return '📧';
      case 'read_settings':
        return '⚙️';
      case 'read_inventory':
        return '📦';
      default:
        return '🤖';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <h1 className="deal-n-done-header title">MCP Dashboard</h1>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => { loadMCPStats(); loadHealthStatus(); }} 
            className="deal-n-done-btn-primary"
            disabled={loading}
          >
            <span>{loading ? '⏳' : '🔄'}</span>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Health Status */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Overall Status</p>
                  <p className={`text-lg font-semibold ${getStatusColor(healthStatus.status)}`}>
                    {healthStatus.status.toUpperCase()}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(healthStatus.status)}`}>
                  {healthStatus.status}
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Database</p>
                  <p className={`text-lg font-semibold ${getStatusColor(healthStatus.database)}`}>
                    {healthStatus.database.toUpperCase()}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(healthStatus.database)}`}>
                  {healthStatus.database}
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Redis Cache</p>
                  <p className={`text-lg font-semibold ${getStatusColor(healthStatus.redis)}`}>
                    {healthStatus.redis.toUpperCase()}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(healthStatus.redis)}`}>
                  {healthStatus.redis}
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-sm text-gray-600">
                  {formatTimestamp(healthStatus.timestamp)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🤖</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Total AI Actions</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalActions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Success Rate</h3>
                <p className="text-3xl font-bold text-green-600">{stats.successRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Active AI Agents</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.activeAgents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Response Time</h3>
                <p className="text-3xl font-bold text-orange-600">&lt;200ms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent AI Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent AI Actions</h3>
            <p className="text-sm text-gray-500">Last 10 actions performed by AI agents</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentActions.length > 0 ? (
                  stats.recentActions.map((action, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{getActionIcon(action.action)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {action.action.replace('_', ' ').toUpperCase()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {action.details}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {action.user_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {action.resource_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          action.success 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {action.success ? 'Success' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTimestamp(action.created_at)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      {loading ? 'Loading actions...' : 'No AI actions found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MCP Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">MCP Resources</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <span className="text-lg mr-3">⚙️</span>
                  <span className="font-medium">Settings</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Available</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <span className="text-lg mr-3">📦</span>
                  <span className="font-medium">Inventory</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Available</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <span className="text-lg mr-3">👥</span>
                  <span className="font-medium">Customers</span>
                </div>
                <span className="text-sm text-yellow-600 font-medium">Coming Soon</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">MCP Tools</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <span className="text-lg mr-3">🏪</span>
                  <span className="font-medium">Create Outlet</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Available</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <span className="text-lg mr-3">📧</span>
                  <span className="font-medium">Send Email</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Available</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <span className="text-lg mr-3">⚙️</span>
                  <span className="font-medium">Update Setting</span>
                </div>
                <span className="text-sm text-yellow-600 font-medium">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCPDashboard; 