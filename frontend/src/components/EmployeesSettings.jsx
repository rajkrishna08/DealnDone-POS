import React, { useState, useEffect } from 'react';
import { timeSheets } from '../data/dummyData';

const EmployeesSettings = ({ onBackToSettings, user, onBackToEmployees, onNavigateToEmployeesSubmodule, employeesView }) => {
  const [employees] = useState([
    { id: 1, name: 'John Smith', role: 'Manager', email: 'john@dealndone.com', status: 'Active' },
    { id: 2, name: 'Sarah Johnson', role: 'Cashier', email: 'sarah@dealndone.com', status: 'Active' },
    { id: 3, name: 'Mike Davis', role: 'Sales Associate', email: 'mike@dealndone.com', status: 'Active' }
  ]);

  const [roles, setRoles] = useState([
    { id: 1, name: 'Manager', permissions: ['sales', 'inventory', 'reports', 'settings'] },
    { id: 2, name: 'Cashier', permissions: ['sales', 'basic_reports'] },
    { id: 3, name: 'Sales Associate', permissions: ['sales'] }
  ]);

  // Timesheets data - commented out to avoid unused variable warning
  // const [timesheets] = useState([
  //   { id: 1, employee: 'John Smith', date: '2025-08-01', hours: 8, status: 'Approved' },
  //   { id: 2, employee: 'Sarah Johnson', date: '2025-08-01', hours: 7.5, status: 'Pending' },
  //   { id: 3, employee: 'Mike Davis', date: '2025-08-01', hours: 8, status: 'Approved' }
  // ]);

  const [activeTab, setActiveTab] = useState('employees');

  // Update active tab when employeesView prop changes
  useEffect(() => {
    if (employeesView) {
      setActiveTab(employeesView);
    }
  }, [employeesView]);

  // Use dummy data for employees
  const [employeesData] = useState(employees);
  // const [timeSheetsData, setTimeSheetsData] = useState(timeSheets); // Commented out unused variable

  // Commented out unused state variables
  // const [newEmployee, setNewEmployee] = useState({
  //   name: '',
  //   email: '',
  //   phone: '',
  //   role: '',
  //   outlet: '',
  //   password: '',
  //   confirmPassword: ''
  // });

  // const [newRole, setNewRole] = useState({
  //   name: '',
  //   description: '',
  //   permissions: []
  // });

  // const [newTimeSheet, setNewTimeSheet] = useState({ // Commented out unused variables
  //   employeeId: '',
  //   date: '',
  //   clockIn: '',
  //   clockOut: '',
  //   breakTime: 60,
  //   notes: ''
  // });

  const availablePermissions = [
    { id: "dashboard_access", name: "Dashboard Access", description: "View dashboard and analytics" },
    { id: "pos_access", name: "POS Access", description: "Access point of sale system" },
    { id: "products_manage", name: "Products Management", description: "Add, edit, delete products" },
    { id: "products_view", name: "Products View", description: "View products only" },
    { id: "orders_manage", name: "Orders Management", description: "Manage all orders" },
    { id: "orders_create", name: "Orders Create", description: "Create new orders only" },
    { id: "reports_access", name: "Reports Access", description: "View and generate reports" },
    { id: "customers_manage", name: "Customers Management", description: "Manage customer data" },
    { id: "customers_view", name: "Customers View", description: "View customer data only" },
    { id: "settings_manage", name: "Settings Management", description: "Manage system settings" },
    { id: "employees_manage", name: "Employees Management", description: "Manage employee data" },
    { id: "employees_view", name: "Employees View", description: "View employee data only" },
    { id: "outlets_manage", name: "Outlets Management", description: "Manage store outlets" },
    { id: "loyalty_manage", name: "Loyalty Management", description: "Manage loyalty programs" },
    { id: "billing_manage", name: "Billing Management", description: "Manage billing and payments" },
    { id: "analytics_access", name: "Analytics Access", description: "Access advanced analytics" }
  ];

  const handleDeleteEmployee = (employeeId) => {
    console.log('Delete employee:', employeeId);
  };

  const handleDeleteRole = (roleId) => {
    setRoles(roles.filter(role => role.id !== roleId));
  };

  // Commented out unused function
  // const handleTogglePermission = (permissionId) => {
  //   setNewRole(prev => ({
  //     ...prev,
  //     permissions: prev.permissions.includes(permissionId)
  //       ? prev.permissions.filter(p => p !== permissionId)
  //       : [...prev.permissions, permissionId]
  //   }));
  // };

  const getRoleColor = (roleName) => {
    const role = roles.find(r => r.name === roleName);
    return role ? role.color : 'bg-gray-500';
  };

  // Commented out unused function
  // const handleAddTimeSheet = () => {
  //   if (newTimeSheet.employeeId && newTimeSheet.date && newTimeSheet.clockIn && newTimeSheet.clockOut) {
  //     const timeSheet = {
  //       id: Date.now(),
  //       employeeId: newTimeSheet.employeeId,
  //       employeeName: employeesData.find(emp => emp.id === parseInt(newTimeSheet.employeeId))?.name || 'Unknown',
  //       date: newTimeSheet.date,
  //       clockIn: newTimeSheet.clockIn,
  //       clockOut: newTimeSheet.clockOut,
  //       breakTime: newTimeSheet.breakTime,
  //       totalHours: calculateTotalHours(newTimeSheet.clockIn, newTimeSheet.clockOut, newTimeSheet.breakTime),
  //       notes: newTimeSheet.notes,
  //       status: 'Pending'
  //     };
  //     setTimeSheetsData([...timeSheetsData, timeSheet]);
  //     setNewTimeSheet({
  //       employeeId: '',
  //       date: '',
  //       clockIn: '',
  //       clockOut: '',
  //       breakTime: 60,
  //       notes: ''
  //     });
  //   }
  // };

  const calculateTotalHours = (clockIn, clockOut, breakTime) => {
    const [inHour, inMin] = clockIn.split(':').map(Number);
    const [outHour, outMin] = clockOut.split(':').map(Number);
    const totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin) - breakTime;
    return Math.max(0, totalMinutes / 60);
  };

  const handleDeleteTimeSheet = (timeSheetId) => {
    console.log('Delete timesheet:', timeSheetId);
  };

  const handleApproveTimeSheet = (timeSheetId) => {
    console.log('Approve timesheet:', timeSheetId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Employees & Roles</h1>
          <div className="text-sm text-gray-500">
            Manage employees, roles, permissions, and timesheets
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => console.log('Add Employee clicked')}
            className="deal-n-done-btn-primary"
          >
            <span>👥</span>
            Add Employee
          </button>
          <button 
            onClick={() => console.log('Add Role clicked')}
            className="deal-n-done-btn-secondary"
          >
            <span>🛡️</span>
            Add Role
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{employeesData.length}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Employees</p>
                <p className="text-2xl font-bold text-gray-900">{employeesData.filter(emp => emp.status === 'Active').length}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">🛡️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Roles</p>
                <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Hours</p>
                <p className="text-2xl font-bold text-gray-900">127.5h</p>
              </div>
            </div>
          </div>
        </div>

        <div className="deal-n-done-card">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('employees')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'employees'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Employee Management
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'roles'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Roles & Permissions
              </button>
              <button
                onClick={() => setActiveTab('timesheets')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'timesheets'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Timesheets
              </button>
            </nav>
          </div>

          {activeTab === 'employees' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Employee Management</h3>
                <button 
                  onClick={() => console.log('Add Employee clicked')}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Employee
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Outlet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employeesData.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {employee.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.email}</div>
                          <div className="text-sm text-gray-500">{employee.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getRoleColor(employee.role)}`}>
                            {employee.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.outlet}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {employee.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.joinDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 mr-2">
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                          >
                            Delete
                          </button>
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
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Roles & Permissions</h3>
                <button 
                  onClick={() => console.log('Add Role clicked')}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Role
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <div key={role.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{role.name}</h4>
                        <p className="text-sm text-gray-600">{role.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full ${role.color}`}></div>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-gray-900">Permissions:</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {role.permissions.map((permission) => {
                          const permInfo = availablePermissions.find(p => p.id === permission);
                          return (
                            <div key={permission} className="flex items-center">
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                              <span className="text-xs text-gray-600">{permInfo?.name || permission}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteRole(role.id)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'timesheets' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Timesheets</h3>
                <button 
                  onClick={() => console.log('Add Timesheet clicked')}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Timesheet
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clock In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clock Out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Hours
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
                    {timeSheets.map((timeSheet) => (
                      <tr key={timeSheet.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {timeSheet.employeeName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {timeSheet.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {timeSheet.clockIn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {timeSheet.clockOut}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {calculateTotalHours(timeSheet.clockIn, timeSheet.clockOut, timeSheet.breakTime)}h
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            timeSheet.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                            timeSheet.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {timeSheet.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleApproveTimeSheet(timeSheet.id)}
                            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 mr-2"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleDeleteTimeSheet(timeSheet.id)}
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeesSettings; 