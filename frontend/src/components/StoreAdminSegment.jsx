import React, { useState } from 'react';

const StoreAdminSegment = () => {
  const [selectedSegment, setSelectedSegment] = useState('');
  const [selectedCriteria, setSelectedCriteria] = useState('');

  const segments = [
    { id: 'new-customers', name: 'New Customers', count: 245 },
    { id: 'returning-customers', name: 'Returning Customers', count: 1234 },
    { id: 'high-value', name: 'High Value Customers', count: 89 },
    { id: 'inactive', name: 'Inactive Customers', count: 567 }
  ];

  const criteriaOptions = [
    'Purchase Frequency',
    'Total Spent',
    'Last Purchase Date',
    'Product Category',
    'Location',
    'Age Group'
  ];

  return (
    <div className="deal-n-done-card p-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Segments</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and analyze customer groups</p>
        </div>
        <button className="deal-n-done-btn-primary">
          <span className="material-icons align-middle mr-2">add</span>
          Create Segment
        </button>
      </div>

      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <button className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
              <span className="material-icons align-middle mr-2">home</span>
              Dashboard
            </button>
          </li>
          <li>
            <div className="flex items-center">
              <span className="material-icons text-gray-400">chevron_right</span>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Customer Segments</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Segment Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Segment
          </label>
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a segment...</option>
            {segments.map((segment) => (
              <option key={segment.id} value={segment.id}>
                {segment.name} ({segment.count})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter Criteria
          </label>
          <select
            value={selectedCriteria}
            onChange={(e) => setSelectedCriteria(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select criteria...</option>
            {criteriaOptions.map((criteria) => (
              <option key={criteria} value={criteria}>
                {criteria}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {segments.map((segment) => (
          <div key={segment.id} className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{segment.name}</h3>
                <p className="text-2xl font-bold text-blue-600">{segment.count.toLocaleString()}</p>
                <p className="text-sm text-gray-500">customers</p>
              </div>
              <div className="text-right">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
        <button className="deal-n-done-btn-secondary">
          <span className="material-icons align-middle mr-2">download</span>
          Export Data
        </button>
        <button className="deal-n-done-btn-primary">
          <span className="material-icons align-middle mr-2">analytics</span>
          Run Analysis
        </button>
      </div>
    </div>
  );
};

export default StoreAdminSegment; 