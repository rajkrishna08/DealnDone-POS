import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  FileText, 
  Lock, 
  Search,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const SecurityAccess = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionTimeout] = useState(30);

  const [auditLogs] = useState([
    {
      id: 1,
      user: 'john@abcelectronics.com',
      action: 'Login',
      timestamp: '2025-07-31 14:30:25',
      ip: '192.168.1.100',
      status: 'success',
      details: 'User logged in successfully'
    },
    {
      id: 2,
      user: 'sarah@techsolutions.com',
      action: 'Price Change',
      timestamp: '2025-07-31 14:25:10',
      ip: '192.168.1.101',
      status: 'success',
      details: 'Changed iPhone 15 Pro price from $999 to $949'
    },
    {
      id: 3,
      user: 'unknown@external.com',
      action: 'Login Attempt',
      timestamp: '2025-07-31 14:10:15',
      ip: '203.45.67.89',
      status: 'failed',
      details: 'Failed login attempt - invalid credentials'
    }
  ]);

  const [activeSessions] = useState([
    {
      id: 1,
      user: 'john@abcelectronics.com',
      device: 'Chrome on Windows',
      location: 'New York, NY',
      ip: '192.168.1.100',
      lastActive: '2025-07-31 14:30:25',
      status: 'active'
    },
    {
      id: 2,
      user: 'sarah@techsolutions.com',
      device: 'Safari on iPhone',
      location: 'Los Angeles, CA',
      ip: '192.168.1.101',
      lastActive: '2025-07-31 14:25:10',
      status: 'active'
    }
  ]);

  const [securityStats] = useState({
    totalLogins: 1247,
    failedAttempts: 23,
    activeSessions: 2,
    securityAlerts: 1,
    lastBackup: '2025-07-31 02:00:00',
    encryptionStatus: 'enabled',
    mfaEnabled: true,
    auditLogEntries: 1247
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'active': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success': return 'Success';
      case 'failed': return 'Failed';
      case 'active': return 'Active';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Security & Access</h1>
          <div className="text-sm text-gray-500">
            Manage security settings, access controls, and monitor system activity
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button className="deal-n-done-btn-secondary">
            <Download className="w-4 h-4" />
            Export Logs
          </button>
          <button className="deal-n-done-btn-primary">
            <Shield className="w-4 h-4" />
            Security Scan
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">MFA Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mfaEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{securityStats.activeSessions}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Security Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{securityStats.securityAlerts}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Audit Logs</p>
                <p className="text-2xl font-bold text-gray-900">{securityStats.auditLogEntries}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="deal-n-done-card">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Security Overview
              </button>
              <button
                onClick={() => setActiveTab('mfa')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'mfa' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Multi-Factor Authentication
              </button>
              <button
                onClick={() => setActiveTab('sessions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sessions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active Sessions
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'audit' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Audit Log
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'roles' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Role Permissions
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">System Security Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Data Encryption</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Enabled
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">MFA Protection</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Enabled
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Session Timeout</span>
                      <span className="text-sm font-medium text-gray-900">{sessionTimeout} minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Backup</span>
                      <span className="text-sm text-gray-900">{securityStats.lastBackup}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Logins (24h)</span>
                      <span className="text-sm font-medium text-gray-900">{securityStats.totalLogins}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Failed Attempts</span>
                      <span className="text-sm font-medium text-red-600">{securityStats.failedAttempts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Sessions</span>
                      <span className="text-sm font-medium text-gray-900">{securityStats.activeSessions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Security Alerts</span>
                      <span className="text-sm font-medium text-yellow-600">{securityStats.securityAlerts}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mfa' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi-Factor Authentication</h3>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">MFA Status</h4>
                    <p className="text-sm text-gray-600">Protect your account with an additional layer of security</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      mfaEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {mfaEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      onClick={() => setMfaEnabled(!mfaEnabled)}
                      className={`ml-3 px-4 py-2 text-sm font-medium rounded-md ${
                        mfaEnabled 
                          ? 'text-red-700 bg-red-100 hover:bg-red-200' 
                          : 'text-green-700 bg-green-100 hover:bg-green-200'
                      }`}
                    >
                      {mfaEnabled ? 'Disable' : 'Enable'} MFA
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-md font-semibold text-gray-900 mb-3">MFA Methods</h5>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-3" />
                        <span className="text-sm text-gray-700">SMS Verification</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-3" />
                        <span className="text-sm text-gray-700">Email Verification</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-3" />
                        <span className="text-sm text-gray-700">Authenticator App</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-md font-semibold text-gray-900 mb-3">MFA Settings</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Session Duration</label>
                        <select className="deal-n-done-input">
                          <option>15 minutes</option>
                          <option>30 minutes</option>
                          <option>1 hour</option>
                          <option>4 hours</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trusted Devices</label>
                        <input type="number" className="deal-n-done-input" placeholder="30 days" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Device
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {session.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {session.device}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {session.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {session.ip}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {session.lastActive}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                                                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {getStatusIcon(session.status)}
                          {getStatusText(session.status)}
                        </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-red-600 hover:text-red-900">
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Log</h3>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by user, action, or IP..."
                      className="deal-n-done-input pl-10"
                    />
                  </div>
                  <select className="deal-n-done-input">
                    <option>All Actions</option>
                    <option>Login</option>
                    <option>Sale</option>
                    <option>Price Change</option>
                    <option>User Management</option>
                  </select>
                </div>
                <button className="deal-n-done-btn-secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Export Logs
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.timestamp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {log.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.action}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.ip}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                                                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                          {getStatusIcon(log.status)}
                          {getStatusText(log.status)}
                        </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Role-Based Access Control</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Cashier</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" defaultChecked disabled className="mr-2" />
                      <span className="text-sm text-gray-700">Process Sales</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" defaultChecked disabled className="mr-2" />
                      <span className="text-sm text-gray-700">View Inventory</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" disabled className="mr-2" />
                      <span className="text-sm text-gray-400">Manage Settings</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" disabled className="mr-2" />
                      <span className="text-sm text-gray-400">User Management</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Manager</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" defaultChecked disabled className="mr-2" />
                      <span className="text-sm text-gray-700">Process Sales</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" defaultChecked disabled className="mr-2" />
                      <span className="text-sm text-gray-700">Manage Inventory</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" defaultChecked disabled className="mr-2" />
                      <span className="text-sm text-gray-700">View Reports</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" disabled className="mr-2" />
                      <span className="text-sm text-gray-400">User Management</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Admin</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" defaultChecked disabled className="mr-2" />
                      <span className="text-sm text-gray-700">Full Access</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" defaultChecked disabled className="mr-2" />
                      <span className="text-sm text-gray-700">User Management</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" defaultChecked disabled className="mr-2" />
                      <span className="text-sm text-gray-700">System Settings</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" defaultChecked disabled className="mr-2" />
                      <span className="text-sm text-gray-700">Security Settings</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityAccess; 