import React, { useState } from 'react';

const StockTake = () => {
  const [activeTab, setActiveTab] = useState('sessions');
  const [showCreateSession, setShowCreateSession] = useState(false);

  // Dummy data for stock take
  const [stockTakeSessions] = useState([
    {
      id: 'ST-001',
      location: 'Main Store',
      assignedTo: 'John Smith',
      startDate: '2025-01-30',
      status: 'In Progress',
      itemsCount: 1250,
      countedItems: 850,
      varianceCount: 12,
      notes: 'Annual stock take for main store location'
    },
    {
      id: 'ST-002',
      location: 'Warehouse',
      assignedTo: 'Sarah Johnson',
      startDate: '2025-01-28',
      status: 'Completed',
      itemsCount: 2100,
      countedItems: 2100,
      varianceCount: 8,
      notes: 'Quarterly warehouse stock take'
    },
    {
      id: 'ST-003',
      location: 'Downtown Branch',
      assignedTo: 'Mike Chen',
      startDate: '2025-01-25',
      status: 'Completed',
      itemsCount: 850,
      countedItems: 850,
      varianceCount: 5,
      notes: 'Monthly branch stock take'
    }
  ]);

  const locations = [
    'Main Store', 'Warehouse', 'Downtown Branch', 'Online Store', 'Outlet Mall', 'Airport Location'
  ];

  const [newSession, setNewSession] = useState({
    location: '',
    assignedTo: '',
    notes: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Stock Take</h1>
          <div className="text-sm text-gray-500">
            Manage inventory counting and reconciliation
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setShowCreateSession(true)}
            className="deal-n-done-btn-primary"
          >
            <span>📱</span>
            New Session
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="deal-n-done-card">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('sessions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sessions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Stock Take Sessions
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reports'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Variance Reports
              </button>
            </nav>
          </div>

          {activeTab === 'sessions' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Take Sessions</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Session ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Start Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Assigned To</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Progress</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Variance</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockTakeSessions.map((session) => (
                      <tr key={session.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{session.id}</td>
                        <td className="py-3 px-4 text-gray-600">{session.location}</td>
                        <td className="py-3 px-4 text-gray-600">{session.startDate}</td>
                        <td className="py-3 px-4 text-gray-600">{session.assignedTo}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(session.countedItems / session.itemsCount) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {session.countedItems}/{session.itemsCount}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            session.varianceCount === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {session.varianceCount} items
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                            <button className="text-green-600 hover:text-green-800 text-sm">Continue</button>
                            <button className="text-red-600 hover:text-red-800 text-sm">Cancel</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Variance Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="deal-n-done-card">
                  <h4 className="font-semibold text-gray-900 mb-2">Total Variance</h4>
                  <p className="text-3xl font-bold text-red-600">15 items</p>
                  <p className="text-sm text-gray-600">Across all locations</p>
                </div>
                <div className="deal-n-done-card">
                  <h4 className="font-semibold text-gray-900 mb-2">Value Impact</h4>
                  <p className="text-3xl font-bold text-red-600">$2,450</p>
                  <p className="text-sm text-gray-600">Total variance value</p>
                </div>
                <div className="deal-n-done-card">
                  <h4 className="font-semibold text-gray-900 mb-2">Accuracy Rate</h4>
                  <p className="text-3xl font-bold text-green-600">98.5%</p>
                  <p className="text-sm text-gray-600">Overall accuracy</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Session Modal */}
      {showCreateSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Stock Take Session</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  value={newSession.location}
                  onChange={(e) => setNewSession({...newSession, location: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <input
                  type="text"
                  value={newSession.assignedTo}
                  onChange={(e) => setNewSession({...newSession, assignedTo: e.target.value})}
                  placeholder="Enter name"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newSession.notes}
                  onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
                  placeholder="Optional notes"
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateSession(false)}
                className="deal-n-done-btn-secondary"
              >
                Cancel
              </button>
              <button className="deal-n-done-btn-primary">
                Create Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockTake; 