import React, { useState, useEffect } from 'react';
import { employees, timeSheets, outlets } from '../data/dummyData';

const EmployeesSettings = ({ onBackToSettings, user, onBackToEmployees, onNavigateToEmployeesSubmodule, employeesView }) => {
  const [activeTab, setActiveTab] = useState(employeesView || 'employees');

  // Update active tab when employeesView prop changes
  useEffect(() => {
    if (employeesView) {
      setActiveTab(employeesView);
    }
  }, [employeesView]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [showAddTimeSheet, setShowAddTimeSheet] = useState(false);

  // Use outlets data from dummy data
  const outletsData = outlets;

  // Predefined roles with permissions
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Owner Admin",
      description: "Full system access and control",
      permissions: [
        "dashboard_access", "pos_access", "products_manage", "orders_manage",
        "reports_access", "customers_manage", "settings_manage", "employees_manage",
        "outlets_manage", "loyalty_manage", "billing_manage", "analytics_access"
      ],
      color: "bg-red-500"
    },
    {
      id: 2,
      name: "Admin",
      description: "Full operational access",
      permissions: [
        "dashboard_access", "pos_access", "products_manage", "orders_manage",
        "reports_access", "customers_manage", "settings_manage", "employees_view"
      ],
      color: "bg-blue-500"
    },
    {
      id: 3,
      name: "Manager",
      description: "Store management and operations",
      permissions: [
        "dashboard_access", "pos_access", "products_view", "orders_manage",
        "reports_access", "customers_manage"
      ],
      color: "bg-green-500"
    },
    {
      id: 4,
      name: "Cashier",
      description: "Point of sale operations",
      permissions: [
        "pos_access", "products_view", "orders_create", "customers_view"
      ],
      color: "bg-yellow-500"
    }
  ]);

  // Use dummy data for employees
  const [employeesData, setEmployeesData] = useState(employees);
  const [timeSheetsData, setTimeSheetsData] = useState(timeSheets);

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    outlet: '',
    password: '',
    confirmPassword: ''
  });

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: []
  });

  const [newTimeSheet, setNewTimeSheet] = useState({
    employeeId: '',
    date: '',
    clockIn: '',
    clockOut: '',
    breakTime: 60,
    notes: ''
  });

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

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.email && newEmployee.role && newEmployee.outlet) {
      const employee = {
        id: Date.now(),
        name: newEmployee.name,
        email: newEmployee.email,
        phone: newEmployee.phone,
        role: newEmployee.role,
        outlet: newEmployee.outlet,
        status: 'Active',
        joinDate: new Date().toISOString().split('T')[0]
      };
      setEmployeesData([...employeesData, employee]);
      setNewEmployee({
        name: '',
        email: '',
        phone: '',
        role: '',
        outlet: '',
        password: '',
        confirmPassword: ''
      });
      setShowAddEmployee(false);
    }
  };

  const handleAddRole = () => {
    if (newRole.name && newRole.description) {
      const role = {
        id: Date.now(),
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions,
        color: `bg-${['red', 'blue', 'green', 'yellow', 'purple', 'pink'][Math.floor(Math.random() * 6)]}-500`
      };
      setRoles([...roles, role]);
      setNewRole({
        name: '',
        description: '',
        permissions: []
      });
      setShowAddRole(false);
    }
  };

  const handleDeleteEmployee = (employeeId) => {
    setEmployeesData(employeesData.filter(emp => emp.id !== employeeId));
  };

  const handleDeleteRole = (roleId) => {
    setRoles(roles.filter(role => role.id !== roleId));
  };

  const handleTogglePermission = (permissionId) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const getRoleColor = (roleName) => {
    const role = roles.find(r => r.name === roleName);
    return role ? role.color : 'bg-gray-500';
  };

  const handleAddTimeSheet = () => {
    if (newTimeSheet.employeeId && newTimeSheet.date && newTimeSheet.clockIn && newTimeSheet.clockOut) {
      const timeSheet = {
        id: Date.now(),
        employeeId: newTimeSheet.employeeId,
        employeeName: employeesData.find(emp => emp.id === parseInt(newTimeSheet.employeeId))?.name || 'Unknown',
        date: newTimeSheet.date,
        clockIn: newTimeSheet.clockIn,
        clockOut: newTimeSheet.clockOut,
        breakTime: newTimeSheet.breakTime,
        totalHours: calculateTotalHours(newTimeSheet.clockIn, newTimeSheet.clockOut, newTimeSheet.breakTime),
        notes: newTimeSheet.notes,
        status: 'Pending'
      };
      setTimeSheetsData([...timeSheetsData, timeSheet]);
      setNewTimeSheet({
        employeeId: '',
        date: '',
        clockIn: '',
        clockOut: '',
        breakTime: 60,
        notes: ''
      });
      setShowAddTimeSheet(false);
    }
  };

  const calculateTotalHours = (clockIn, clockOut, breakTime) => {
    const [inHour, inMin] = clockIn.split(':').map(Number);
    const [outHour, outMin] = clockOut.split(':').map(Number);
    const totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin) - breakTime;
    return Math.max(0, totalMinutes / 60);
  };

  const handleDeleteTimeSheet = (timeSheetId) => {
    setTimeSheetsData(timeSheetsData.filter(ts => ts.id !== timeSheetId));
  };

  const handleApproveTimeSheet = (timeSheetId) => {
    setTimeSheetsData(timeSheetsData.map(ts => 
      ts.id === timeSheetId ? { ...ts, status: 'Approved' } : ts
    ));
  };

  const renderEmployeesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Employees</h2>
        <button
          onClick={() => setShowAddEmployee(true)}
          className="deal-n-done-btn-primary"
        >
          <span>➕</span>
          Add Employee
        </button>
      </div>

      <div className="deal-n-done-table">
        <table className="w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Outlet</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employeesData.map((employee) => (
              <tr key={employee.id}>
                <td className="font-medium">{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getRoleColor(employee.role)}`}>
                    {employee.role}
                  </span>
                </td>
                <td>{employee.outlet}</td>
                <td>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.status}
                  </span>
                </td>
                <td>{employee.joinDate}</td>
                <td>
                  <button
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Employee</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <select
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.name}>{role.name}</option>
                ))}
              </select>
              <select
                value={newEmployee.outlet}
                onChange={(e) => setNewEmployee({...newEmployee, outlet: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Outlet</option>
                {outletsData.map(outlet => (
                  <option key={outlet.id} value={outlet.name}>{outlet.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddEmployee(false)}
                className="deal-n-done-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEmployee}
                className="deal-n-done-btn-primary"
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderRolesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Roles & Permissions</h2>
        <button
          onClick={() => setShowAddRole(true)}
          className="deal-n-done-btn-primary"
        >
          <span>➕</span>
          Add Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <div key={role.id} className="deal-n-done-card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{role.name}</h3>
                <p className="text-sm text-gray-600">{role.description}</p>
              </div>
              <button
                onClick={() => handleDeleteRole(role.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Permissions:</h4>
              <div className="flex flex-wrap gap-1">
                {role.permissions.map((permission) => {
                  const perm = availablePermissions.find(p => p.id === permission);
                  return perm ? (
                    <span key={permission} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                      {perm.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add New Role</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Role Name"
                value={newRole.name}
                onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <textarea
                placeholder="Role Description"
                value={newRole.description}
                onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
                rows="3"
              />
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Permissions:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availablePermissions.map((permission) => (
                    <label key={permission.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newRole.permissions.includes(permission.id)}
                        onChange={() => handleTogglePermission(permission.id)}
                        className="rounded"
                      />
                      <span className="text-sm">
                        <span className="font-medium">{permission.name}</span>
                        <span className="text-gray-600 block">{permission.description}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddRole(false)}
                className="deal-n-done-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRole}
                className="deal-n-done-btn-primary"
              >
                Add Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTimesheetsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Timesheets</h2>
        <button
          onClick={() => setShowAddTimeSheet(true)}
          className="deal-n-done-btn-primary"
        >
          <span>➕</span>
          Add Timesheet
        </button>
      </div>

      <div className="deal-n-done-table">
        <table className="w-full">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Break Time</th>
              <th>Total Hours</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timeSheetsData.map((timeSheet) => (
              <tr key={timeSheet.id}>
                <td className="font-medium">{timeSheet.employeeName}</td>
                <td>{timeSheet.date}</td>
                <td>{timeSheet.clockIn}</td>
                <td>{timeSheet.clockOut}</td>
                <td>{timeSheet.breakTime} min</td>
                <td>{timeSheet.totalHours.toFixed(2)} hrs</td>
                <td>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    timeSheet.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                    timeSheet.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {timeSheet.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    {timeSheet.status === 'Pending' && (
                      <button
                        onClick={() => handleApproveTimeSheet(timeSheet.id)}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTimeSheet(timeSheet.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddTimeSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Timesheet</h3>
            <div className="space-y-4">
              <select
                value={newTimeSheet.employeeId}
                onChange={(e) => setNewTimeSheet({...newTimeSheet, employeeId: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Employee</option>
                {employeesData.map(employee => (
                  <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={newTimeSheet.date}
                onChange={(e) => setNewTimeSheet({...newTimeSheet, date: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="time"
                placeholder="Clock In"
                value={newTimeSheet.clockIn}
                onChange={(e) => setNewTimeSheet({...newTimeSheet, clockIn: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="time"
                placeholder="Clock Out"
                value={newTimeSheet.clockOut}
                onChange={(e) => setNewTimeSheet({...newTimeSheet, clockOut: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                placeholder="Break Time (minutes)"
                value={newTimeSheet.breakTime}
                onChange={(e) => setNewTimeSheet({...newTimeSheet, breakTime: parseInt(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <textarea
                placeholder="Notes"
                value={newTimeSheet.notes}
                onChange={(e) => setNewTimeSheet({...newTimeSheet, notes: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
                rows="3"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddTimeSheet(false)}
                className="deal-n-done-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTimeSheet}
                className="deal-n-done-btn-primary"
              >
                Add Timesheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          {onBackToSettings && (
            <button
              onClick={onBackToSettings}
              className="deal-n-done-btn-secondary"
            >
              ← Back to Settings
            </button>
          )}
          {onBackToEmployees && (
            <button
              onClick={onBackToEmployees}
              className="deal-n-done-btn-secondary"
            >
              ← Back to Employees
            </button>
          )}
          <h1 className="deal-n-done-header title">Employees & Roles</h1>
        </div>
        <div className="deal-n-done-header actions">
          <div className="deal-n-done-header user-profile">
            <div className="deal-n-done-header user-avatar">{user?.name?.charAt(0) || 'U'}</div>
            <span className="text-sm font-medium">{user?.name || 'User'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="deal-n-done-card">
          {/* Tab Navigation */}
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
                Employees
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

          {/* Tab Content */}
          {activeTab === 'employees' && renderEmployeesTab()}
          {activeTab === 'roles' && renderRolesTab()}
          {activeTab === 'timesheets' && renderTimesheetsTab()}
        </div>
      </div>
    </div>
  );
};

export default EmployeesSettings; 