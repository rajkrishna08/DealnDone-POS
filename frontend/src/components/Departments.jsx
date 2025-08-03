import React, { useState } from 'react';
import dummyData from '../data/dummyData';

const Departments = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [showCreateDepartment, setShowCreateDepartment] = useState(false);

  // Use centralized dummy data
  const { departments } = dummyData.departments;

  const [newDepartment, setNewDepartment] = useState({
    name: '',
    code: '',
    manager: '',
    description: ''
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Departments</h1>
          <div className="text-sm text-gray-500">
            Manage inventory departments and categories
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setShowCreateDepartment(true)}
            className="deal-n-done-btn-primary"
          >
            <span>➕</span>
            New Department
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="deal-n-done-card">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('departments')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'departments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Departments
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'categories'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Categories
              </button>
            </nav>
          </div>

          {activeTab === 'departments' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Departments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => (
                  <div key={dept.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                        <p className="text-sm text-gray-600">Code: {dept.code}</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {dept.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Manager:</span> {dept.manager}</p>
                      <p><span className="font-medium">Products:</span> {dept.totalProducts}</p>
                      <p><span className="font-medium">Value:</span> ${dept.totalValue.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="deal-n-done-btn-primary text-sm">Edit</button>
                      <button className="deal-n-done-btn-secondary text-sm">View Products</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Department</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Products</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Value</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">Shirts</td>
                      <td className="py-3 px-4 text-gray-600">Men's Clothing</td>
                      <td className="py-3 px-4 text-center text-gray-600">15</td>
                      <td className="py-3 px-4 text-center font-medium text-gray-900">$4,200</td>
                      <td className="py-3 px-4 text-center">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">Pants</td>
                      <td className="py-3 px-4 text-gray-600">Men's Clothing</td>
                      <td className="py-3 px-4 text-center text-gray-600">12</td>
                      <td className="py-3 px-4 text-center font-medium text-gray-900">$3,800</td>
                      <td className="py-3 px-4 text-center">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">Dresses</td>
                      <td className="py-3 px-4 text-gray-600">Women's Clothing</td>
                      <td className="py-3 px-4 text-center text-gray-600">18</td>
                      <td className="py-3 px-4 text-center font-medium text-gray-900">$6,500</td>
                      <td className="py-3 px-4 text-center">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Department Modal */}
      {showCreateDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Department</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                <input
                  type="text"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                  placeholder="Enter department name"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Code</label>
                <input
                  type="text"
                  value={newDepartment.code}
                  onChange={(e) => setNewDepartment({...newDepartment, code: e.target.value})}
                  placeholder="Enter code (e.g., MEN)"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                <input
                  type="text"
                  value={newDepartment.manager}
                  onChange={(e) => setNewDepartment({...newDepartment, manager: e.target.value})}
                  placeholder="Enter manager name"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newDepartment.description}
                  onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                  placeholder="Enter description"
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateDepartment(false)}
                className="deal-n-done-btn-secondary"
              >
                Cancel
              </button>
              <button className="deal-n-done-btn-primary">
                Create Department
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments; 