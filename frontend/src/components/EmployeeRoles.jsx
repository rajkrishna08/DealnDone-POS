import React from 'react';

const EmployeeRoles = () => {
  const roles = [
    'Junior Cashier',
    'Cashier', 
    'Manager',
    'Admin',
    'Store Administrator',
    'Owner'
  ];

  const features = [
    'Web',
    'Locations',
    'Employees',
    'Sales',
    'Orders',
    'Quick Inventory Adjustments',
    'Products',
    'Gift Cards',
    'Reporting',
    'Customers',
    'Timesheets',
    'Business Settings',
    'Loyalty Program Settings',
    'Email Marketing',
    'Vendors',
    'Purchase Shipping Labels',
    'Conversations',
    'iPad',
    'Process Transactions',
    'Open/Close Register'
  ];

  const permissions = {
    'Web': {
      'Junior Cashier': 'none',
      'Cashier': 'view-only',
      'Manager': 'view-only',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Locations': {
      'Junior Cashier': 'none',
      'Cashier': 'view-only',
      'Manager': 'view-only',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Employees': {
      'Junior Cashier': 'none',
      'Cashier': 'none',
      'Manager': 'view-only',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Sales': {
      'Junior Cashier': 'view-only',
      'Cashier': 'add-edit',
      'Manager': 'full',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Orders': {
      'Junior Cashier': 'view-only',
      'Cashier': 'add-edit',
      'Manager': 'full',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Quick Inventory Adjustments': {
      'Junior Cashier': 'none',
      'Cashier': 'view-only',
      'Manager': 'add-edit',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Products': {
      'Junior Cashier': 'none',
      'Cashier': 'view-only',
      'Manager': 'add-edit',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Gift Cards': {
      'Junior Cashier': 'view-only',
      'Cashier': 'add-edit',
      'Manager': 'full',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Reporting': {
      'Junior Cashier': 'none',
      'Cashier': 'view-only',
      'Manager': 'full',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Customers': {
      'Junior Cashier': 'view-only',
      'Cashier': 'add-edit',
      'Manager': 'full',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Timesheets': {
      'Junior Cashier': 'none',
      'Cashier': 'view-only',
      'Manager': 'add-edit',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Business Settings': {
      'Junior Cashier': 'none',
      'Cashier': 'none',
      'Manager': 'view-only',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Loyalty Program Settings': {
      'Junior Cashier': 'none',
      'Cashier': 'none',
      'Manager': 'view-only',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Email Marketing': {
      'Junior Cashier': 'none',
      'Cashier': 'none',
      'Manager': 'view-only',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Vendors': {
      'Junior Cashier': 'none',
      'Cashier': 'none',
      'Manager': 'view-only',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Purchase Shipping Labels': {
      'Junior Cashier': 'none',
      'Cashier': 'none',
      'Manager': 'view-only',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Conversations': {
      'Junior Cashier': 'none',
      'Cashier': 'view-only',
      'Manager': 'add-edit',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'iPad': {
      'Junior Cashier': 'view-only',
      'Cashier': 'add-edit',
      'Manager': 'full',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Process Transactions': {
      'Junior Cashier': 'view-only',
      'Cashier': 'add-edit',
      'Manager': 'full',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Open/Close Register': {
      'Junior Cashier': 'none',
      'Cashier': 'view-only',
      'Manager': 'add-edit',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    }
  };

  const getPermissionText = (permission) => {
    switch (permission) {
      case 'none':
        return 'None';
      case 'view-only':
        return 'View Only';
      case 'add-edit':
        return 'Add/Edit';
      case 'full':
        return 'Full Access';
      default:
        return 'None';
    }
  };

  const getPermissionClass = (permission) => {
    switch (permission) {
      case 'none':
        return 'permission-badge none';
      case 'view-only':
        return 'permission-badge view-only';
      case 'add-edit':
        return 'permission-badge add-edit';
      case 'full':
        return 'permission-badge full';
      default:
        return 'permission-badge none';
    }
  };

  return (
    <div className="modern-card">
      <div className="modern-header">
        <h1 className="modern-header title">Employee Roles & Permissions Matrix</h1>
        <div className="modern-header actions">
          <button className="modern-btn-primary">
            <span>➕</span>
            Add New Role
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="modern-table">
          <thead>
            <tr>
              <th className="sticky left-0 bg-gray-50 z-10">Features</th>
              {roles.map((role) => (
                <th key={role} className="text-center min-w-[120px]">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature}>
                <td className="sticky left-0 bg-white font-medium border-r border-gray-200">
                  {feature}
                </td>
                {roles.map((role) => {
                  const permission = permissions[feature]?.[role] || 'none';
                  return (
                    <td key={`${feature}-${role}`} className="text-center">
                      <span className={getPermissionClass(permission)}>
                        {getPermissionText(permission)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Permission Levels:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="permission-badge none">None</span>
            <span className="text-gray-600">No access</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="permission-badge view-only">View Only</span>
            <span className="text-gray-600">Can view only</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="permission-badge add-edit">Add/Edit</span>
            <span className="text-gray-600">Can add and edit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="permission-badge full">Full Access</span>
            <span className="text-gray-600">Complete control</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRoles; 