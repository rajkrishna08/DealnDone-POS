import React, { useState } from 'react';

const SalesOrders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Dummy data for sales orders
  const salesOrders = [
    {
      id: 'SO-001',
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      orderDate: '2025-01-30',
      status: 'Pending',
      totalAmount: 245.00,
      items: [
        { product: 'Classic White Shirt', quantity: 2, price: 25.00, total: 50.00 },
        { product: 'Blue Oxford Shirt', quantity: 1, price: 30.00, total: 30.00 },
        { product: 'Leather Belt', quantity: 1, price: 20.00, total: 20.00 }
      ],
      paymentMethod: 'Credit Card',
      shippingAddress: '123 Main St, New York, NY 10001',
      notes: 'Customer prefers express shipping'
    },
    {
      id: 'SO-002',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.johnson@email.com',
      orderDate: '2025-01-29',
      status: 'Processing',
      totalAmount: 180.00,
      items: [
        { product: 'Denim Jeans', quantity: 1, price: 45.00, total: 45.00 },
        { product: 'Silk Scarf', quantity: 2, price: 15.00, total: 30.00 }
      ],
      paymentMethod: 'PayPal',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
      notes: 'Gift order'
    },
    {
      id: 'SO-003',
      customerName: 'Emily Davis',
      customerEmail: 'emily.davis@email.com',
      orderDate: '2025-01-28',
      status: 'Shipped',
      totalAmount: 520.00,
      items: [
        { product: 'Black Formal Shirt', quantity: 3, price: 35.00, total: 105.00 },
        { product: 'Premium Suit', quantity: 1, price: 415.00, total: 415.00 }
      ],
      paymentMethod: 'Credit Card',
      shippingAddress: '321 Elm St, Miami, FL 33101',
      notes: 'VIP customer - priority handling'
    },
    {
      id: 'SO-004',
      customerName: 'David Wilson',
      customerEmail: 'david.wilson@email.com',
      orderDate: '2025-01-27',
      status: 'Delivered',
      totalAmount: 95.00,
      items: [
        { product: 'Casual T-Shirt', quantity: 2, price: 15.00, total: 30.00 },
        { product: 'Sneakers', quantity: 1, price: 65.00, total: 65.00 }
      ],
      paymentMethod: 'Cash',
      shippingAddress: '654 Maple Dr, Seattle, WA 98101',
      notes: 'Customer pickup at store'
    },
    {
      id: 'SO-005',
      customerName: 'Lisa Brown',
      customerEmail: 'lisa.brown@email.com',
      orderDate: '2025-01-26',
      status: 'Cancelled',
      totalAmount: 150.00,
      items: [
        { product: 'Summer Dress', quantity: 1, price: 75.00, total: 75.00 },
        { product: 'Accessories Set', quantity: 1, price: 75.00, total: 75.00 }
      ],
      paymentMethod: 'Credit Card',
      shippingAddress: '987 Cedar Ln, Austin, TX 73301',
      notes: 'Customer requested cancellation'
    }
  ];

  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerEmail: '',
    items: [],
    paymentMethod: 'Credit Card',
    shippingAddress: '',
    notes: ''
  });

  const handleCreateOrder = () => {
    const order = {
      id: `SO-${Date.now()}`,
      ...newOrder,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      totalAmount: newOrder.items.reduce((sum, item) => sum + item.total, 0)
    };
    console.log('New order created:', order);
    setNewOrder({ customerName: '', customerEmail: '', items: [], paymentMethod: 'Credit Card', shippingAddress: '', notes: '' });
    setShowCreateOrder(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = salesOrders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeTab === 'all' || order.status === activeTab;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Sales Orders</h1>
          <div className="text-sm text-gray-500">
            Manage customer orders and fulfillment
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setShowCreateOrder(true)}
            className="deal-n-done-btn-primary"
          >
            Create Order
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search orders by customer name or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('Pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'Pending'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab('Processing')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'Processing'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Processing
              </button>
              <button
                onClick={() => setActiveTab('Shipped')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'Shipped'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Shipped
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.orderDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📦</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Orders</div>
                <div className="text-2xl font-semibold text-gray-900">{salesOrders.length}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">⏳</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Pending Orders</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {salesOrders.filter(o => o.status === 'Pending').length}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Completed Orders</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {salesOrders.filter(o => o.status === 'Delivered').length}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Revenue</div>
                <div className="text-2xl font-semibold text-gray-900">
                  ${salesOrders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Order Modal */}
        {showCreateOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Order</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                  <input
                    type="text"
                    value={newOrder.customerName}
                    onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter customer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email</label>
                  <input
                    type="email"
                    value={newOrder.customerEmail}
                    onChange={(e) => setNewOrder({...newOrder, customerEmail: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter customer email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={newOrder.paymentMethod}
                    onChange={(e) => setNewOrder({...newOrder, paymentMethod: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address</label>
                  <textarea
                    value={newOrder.shippingAddress}
                    onChange={(e) => setNewOrder({...newOrder, shippingAddress: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="2"
                    placeholder="Enter shipping address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="3"
                    placeholder="Enter order notes"
                  />
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

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Order Details - {selectedOrder.id}</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Name:</span>
                      <div className="text-sm text-gray-900">{selectedOrder.customerName}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Email:</span>
                      <div className="text-sm text-gray-900">{selectedOrder.customerEmail}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Shipping Address:</span>
                      <div className="text-sm text-gray-900">{selectedOrder.shippingAddress}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Order Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Order Date:</span>
                      <div className="text-sm text-gray-900">{selectedOrder.orderDate}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Payment Method:</span>
                      <div className="text-sm text-gray-900">{selectedOrder.paymentMethod}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Total Amount:</span>
                      <div className="text-sm font-semibold text-gray-900">${selectedOrder.totalAmount.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.product}</div>
                          <div className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price}</div>
                        </div>
                        <div className="text-sm font-semibold text-gray-900">${item.total.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {selectedOrder.notes && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="deal-n-done-btn-secondary"
                >
                  Close
                </button>
                <button className="deal-n-done-btn-primary">
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesOrders; 