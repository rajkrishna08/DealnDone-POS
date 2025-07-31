import React, { useState } from 'react';

const StockPurchases = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showRecordPurchase, setShowRecordPurchase] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data for stock purchases
  const purchaseOrders = [
    {
      id: 'PO-001',
      supplier: 'Fashion Wholesale Co.',
      orderDate: '2025-01-30',
      expectedDelivery: '2025-02-05',
      status: 'Pending',
      totalAmount: 2500,
      items: [
        { product: 'Classic White Shirt', quantity: 50, unitPrice: 25, total: 1250 },
        { product: 'Blue Oxford Shirt', quantity: 30, unitPrice: 30, total: 900 },
        { product: 'Black Formal Shirt', quantity: 20, unitPrice: 35, total: 700 }
      ]
    },
    {
      id: 'PO-002',
      supplier: 'Textile Traders Ltd.',
      orderDate: '2025-01-28',
      expectedDelivery: '2025-02-02',
      status: 'In Transit',
      totalAmount: 1800,
      items: [
        { product: 'Denim Jeans', quantity: 40, unitPrice: 45, total: 1800 }
      ]
    },
    {
      id: 'PO-003',
      supplier: 'Accessories Plus',
      orderDate: '2025-01-25',
      expectedDelivery: '2025-01-30',
      status: 'Delivered',
      totalAmount: 1200,
      items: [
        { product: 'Leather Belt', quantity: 60, unitPrice: 20, total: 1200 }
      ]
    },
    {
      id: 'PO-004',
      supplier: 'Premium Fabrics Inc.',
      orderDate: '2025-01-22',
      expectedDelivery: '2025-01-28',
      status: 'Delivered',
      totalAmount: 2100,
      items: [
        { product: 'Silk Blouse', quantity: 30, unitPrice: 40, total: 1200 },
        { product: 'Cotton Dress', quantity: 25, unitPrice: 36, total: 900 }
      ]
    }
  ];

  const suppliers = [
    { id: 1, name: 'Fashion Wholesale Co.', contact: 'John Smith', email: 'john@fashionwholesale.com', phone: '+1-555-0123', rating: 4.5, totalOrders: 25, totalSpent: 45000 },
    { id: 2, name: 'Textile Traders Ltd.', contact: 'Sarah Johnson', email: 'sarah@textiletraders.com', phone: '+1-555-0124', rating: 4.2, totalOrders: 18, totalSpent: 32000 },
    { id: 3, name: 'Accessories Plus', contact: 'Mike Chen', email: 'mike@accessoriesplus.com', phone: '+1-555-0125', rating: 4.8, totalOrders: 32, totalSpent: 28000 },
    { id: 4, name: 'Premium Fabrics Inc.', contact: 'Emily Davis', email: 'emily@premiumfabrics.com', phone: '+1-555-0126', rating: 4.6, totalOrders: 15, totalSpent: 22000 },
    { id: 5, name: 'Global Textiles', contact: 'David Wilson', email: 'david@globaltextiles.com', phone: '+1-555-0127', rating: 4.3, totalOrders: 22, totalSpent: 35000 }
  ];

  const purchaseHistory = [
    { id: 'PUR-001', supplier: 'Fashion Wholesale Co.', purchaseDate: '2025-01-30', items: 3, totalAmount: 2500, status: 'Completed' },
    { id: 'PUR-002', supplier: 'Textile Traders Ltd.', purchaseDate: '2025-01-28', items: 1, totalAmount: 1800, status: 'Completed' },
    { id: 'PUR-003', supplier: 'Accessories Plus', purchaseDate: '2025-01-25', items: 1, totalAmount: 1200, status: 'Completed' },
    { id: 'PUR-004', supplier: 'Premium Fabrics Inc.', purchaseDate: '2025-01-22', items: 2, totalAmount: 2100, status: 'Completed' }
  ];

  const [newOrder, setNewOrder] = useState({
    supplier: '',
    expectedDelivery: '',
    items: []
  });

  const [newPurchase, setNewPurchase] = useState({
    supplier: '',
    purchaseDate: '',
    items: []
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddOrderItem = () => {
    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, { product: '', quantity: 1, unitPrice: 0, total: 0 }]
    }));
  };

  const handleAddPurchaseItem = () => {
    setNewPurchase(prev => ({
      ...prev,
      items: [...prev.items, { product: '', quantity: 1, unitPrice: 0, total: 0 }]
    }));
  };

  const handleCreateOrder = () => {
    const order = {
      id: `PO-${Date.now()}`,
      supplier: newOrder.supplier,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: newOrder.expectedDelivery,
      status: 'Pending',
      totalAmount: newOrder.items.reduce((sum, item) => sum + item.total, 0),
      items: newOrder.items
    };
    // setPurchaseOrders([order, ...purchaseOrders]); // This line was removed as per the edit hint
    setNewOrder({ supplier: '', expectedDelivery: '', items: [] });
    setShowCreateOrder(false);
  };

  const handleCreatePurchase = () => {
    // Handle creating a new purchase record
    setNewPurchase({ supplier: '', purchaseDate: '', items: [] });
    setShowRecordPurchase(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Stock Purchases</h1>
          <div className="text-sm text-gray-500">
            Manage purchase orders and stock acquisitions
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setShowCreateOrder(true)}
            className="deal-n-done-btn-primary"
          >
            <span>📋</span>
            New Order
          </button>
          <button 
            onClick={() => setShowRecordPurchase(true)}
            className="deal-n-done-btn-secondary"
          >
            <span>📦</span>
            Record Purchase
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Tab Navigation */}
        <div className="deal-n-done-card mb-6">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Purchase Orders
              </button>
              <button
                onClick={() => setActiveTab('suppliers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'suppliers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Suppliers
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Purchase History
              </button>
            </nav>
          </div>

          {/* Search and Filters */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search orders, suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Suppliers</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Supplier</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Order Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Expected Delivery</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Total Amount</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
                      <td className="py-3 px-4 text-gray-600">{order.supplier}</td>
                      <td className="py-3 px-4 text-gray-600">{order.orderDate}</td>
                      <td className="py-3 px-4 text-gray-600">{order.expectedDelivery}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-gray-900">
                        ${order.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                          <button className="text-green-600 hover:text-green-800 text-sm">Receive</button>
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

        {activeTab === 'suppliers' && (
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Suppliers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map((supplier) => (
                <div key={supplier.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600 ml-1">{supplier.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Contact:</span> {supplier.contact}</p>
                    <p><span className="font-medium">Email:</span> {supplier.email}</p>
                    <p><span className="font-medium">Phone:</span> {supplier.phone}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="deal-n-done-btn-primary text-sm">Edit</button>
                    <button className="deal-n-done-btn-secondary text-sm">View Orders</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Purchase ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Supplier</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Purchase Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Items</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Total Amount</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseHistory.map((purchase) => (
                    <tr key={purchase.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{purchase.id}</td>
                      <td className="py-3 px-4 text-gray-600">{purchase.supplier}</td>
                      <td className="py-3 px-4 text-gray-600">{purchase.purchaseDate}</td>
                      <td className="py-3 px-4 text-gray-600">{purchase.items} items</td>
                      <td className="py-3 px-4 text-center font-medium text-gray-900">${purchase.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* New Order Modal */}
      {showCreateOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Purchase Order</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <select
                    value={newOrder.supplier}
                    onChange={(e) => setNewOrder({...newOrder, supplier: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery</label>
                  <input
                    type="date"
                    value={newOrder.expectedDelivery}
                    onChange={(e) => setNewOrder({...newOrder, expectedDelivery: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Order Items</label>
                  <button
                    onClick={handleAddOrderItem}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Item
                  </button>
                </div>
                {newOrder.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Product name"
                      value={item.product}
                      onChange={(e) => {
                        const updatedItems = [...newOrder.items];
                        updatedItems[index].product = e.target.value;
                        setNewOrder({...newOrder, items: updatedItems});
                      }}
                      className="p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => {
                        const updatedItems = [...newOrder.items];
                        updatedItems[index].quantity = parseInt(e.target.value) || 0;
                        updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
                        setNewOrder({...newOrder, items: updatedItems});
                      }}
                      className="p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Unit price"
                      value={item.unitPrice}
                      onChange={(e) => {
                        const updatedItems = [...newOrder.items];
                        updatedItems[index].unitPrice = parseFloat(e.target.value) || 0;
                        updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
                        setNewOrder({...newOrder, items: updatedItems});
                      }}
                      className="p-2 border border-gray-300 rounded"
                    />
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      ${item.total.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateOrder(false)}
                className="deal-n-done-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrder}
                className="deal-n-done-btn-primary"
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Purchase Modal */}
      {showRecordPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Record New Purchase</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <select
                    value={newPurchase.supplier}
                    onChange={(e) => setNewPurchase({...newPurchase, supplier: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                  <input
                    type="date"
                    value={newPurchase.purchaseDate}
                    onChange={(e) => setNewPurchase({...newPurchase, purchaseDate: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Purchase Items</label>
                  <button
                    onClick={handleAddPurchaseItem}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Item
                  </button>
                </div>
                {newPurchase.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Product name"
                      value={item.product}
                      onChange={(e) => {
                        const updatedItems = [...newPurchase.items];
                        updatedItems[index].product = e.target.value;
                        setNewPurchase({...newPurchase, items: updatedItems});
                      }}
                      className="p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => {
                        const updatedItems = [...newPurchase.items];
                        updatedItems[index].quantity = parseInt(e.target.value) || 0;
                        updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
                        setNewPurchase({...newPurchase, items: updatedItems});
                      }}
                      className="p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Unit price"
                      value={item.unitPrice}
                      onChange={(e) => {
                        const updatedItems = [...newPurchase.items];
                        updatedItems[index].unitPrice = parseFloat(e.target.value) || 0;
                        updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
                        setNewPurchase({...newPurchase, items: updatedItems});
                      }}
                      className="p-2 border border-gray-300 rounded"
                    />
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      ${item.total.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowRecordPurchase(false)}
                className="deal-n-done-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePurchase}
                className="deal-n-done-btn-primary"
              >
                Record Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockPurchases; 