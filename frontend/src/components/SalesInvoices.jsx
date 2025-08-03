import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Mail,
  Eye,
  Plus
} from 'lucide-react';

const SalesInvoices = () => {
  const [invoices] = useState([
    {
      id: 'INV-001',
      customerName: 'ABC Electronics',
      customerEmail: 'john@abcelectronics.com',
      customerPhone: '+1 (555) 123-4567',
      status: 'paid',
      totalAmount: 2499.99,
      paidAmount: 2499.99,
      dueDate: '2025-08-15',
      issueDate: '2025-07-31',
      items: [
        { name: 'iPhone 15 Pro', quantity: 2, price: 999.99, total: 1999.98 },
        { name: 'AirPods Pro', quantity: 1, price: 249.99, total: 249.99 },
        { name: 'Screen Protector', quantity: 2, price: 19.99, total: 39.98 },
        { name: 'Wireless Charger', quantity: 1, price: 49.99, total: 49.99 }
      ],
      notes: 'Payment received via credit card',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'INV-002',
      customerName: 'Tech Solutions Inc',
      customerEmail: 'sarah@techsolutions.com',
      customerPhone: '+1 (555) 987-6543',
      status: 'overdue',
      totalAmount: 1899.95,
      paidAmount: 0,
      dueDate: '2025-07-25',
      issueDate: '2025-07-20',
      items: [
        { name: 'MacBook Air M2', quantity: 1, price: 1199.99, total: 1199.99 },
        { name: 'Magic Mouse', quantity: 1, price: 79.99, total: 79.99 },
        { name: 'USB-C Hub', quantity: 1, price: 89.99, total: 89.99 },
        { name: 'Laptop Sleeve', quantity: 1, price: 29.99, total: 29.99 }
      ],
      notes: 'Payment overdue - follow up required',
      paymentMethod: 'Net 30'
    },
    {
      id: 'INV-003',
      customerName: 'Digital Marketing Co',
      customerEmail: 'mike@digitalmarketing.com',
      customerPhone: '+1 (555) 456-7890',
      status: 'pending',
      totalAmount: 899.97,
      paidAmount: 0,
      dueDate: '2025-08-20',
      issueDate: '2025-08-01',
      items: [
        { name: 'iPad Air', quantity: 1, price: 599.99, total: 599.99 },
        { name: 'Apple Pencil', quantity: 1, price: 129.99, total: 129.99 },
        { name: 'iPad Case', quantity: 1, price: 49.99, total: 49.99 }
      ],
      notes: 'Invoice sent - awaiting payment',
      paymentMethod: 'Net 30'
    }
  ]);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      case 'overdue': return <XCircle className="w-4 h-4" />;
      case 'draft': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'overdue': return 'Overdue';
      case 'draft': return 'Draft';
      default: return 'Unknown';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (activeTab === 'all') return true;
    return invoice.status === activeTab;
  });

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    pending: invoices.filter(i => i.status === 'pending').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalValue: invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0),
    paidValue: invoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0),
    outstandingValue: invoices.reduce((sum, invoice) => sum + (invoice.totalAmount - invoice.paidAmount), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Sales Invoices</h1>
          <div className="text-sm text-gray-500">
            Create and manage professional invoices for customers
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button className="deal-n-done-btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export Invoices
          </button>
          <button className="deal-n-done-btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
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
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Value</h3>
            <p className="text-3xl font-bold text-gray-900">${stats.totalValue.toFixed(2)}</p>
            <p className="text-sm text-gray-600">All invoices</p>
          </div>
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Paid Amount</h3>
            <p className="text-3xl font-bold text-green-600">${stats.paidValue.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Received payments</p>
          </div>
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Outstanding</h3>
            <p className="text-3xl font-bold text-red-600">${stats.outstandingValue.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Pending payments</p>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="deal-n-done-card">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Invoices ({stats.total})
              </button>
              <button
                onClick={() => setActiveTab('paid')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'paid' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Paid ({stats.paid})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setActiveTab('overdue')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overdue' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overdue ({stats.overdue})
              </button>
            </nav>
          </div>

          {/* Invoices Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.customerName}</div>
                        <div className="text-sm text-gray-500">{invoice.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${invoice.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {getStatusText(invoice.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {selectedInvoice.customerName}</p>
                  <p><strong>Email:</strong> {selectedInvoice.customerEmail}</p>
                  <p><strong>Phone:</strong> {selectedInvoice.customerPhone}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Invoice Information</h3>
                <div className="space-y-2">
                  <p><strong>Invoice ID:</strong> {selectedInvoice.id}</p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedInvoice.status)}`}>
                      {getStatusIcon(selectedInvoice.status)}
                      {getStatusText(selectedInvoice.status)}
                    </span>
                  </p>
                  <p><strong>Issue Date:</strong> {selectedInvoice.issueDate}</p>
                  <p><strong>Due Date:</strong> {selectedInvoice.dueDate}</p>
                  <p><strong>Payment Method:</strong> {selectedInvoice.paymentMethod}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Invoice Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">Total Amount: ${selectedInvoice.totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Paid: ${selectedInvoice.paidAmount.toFixed(2)}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="deal-n-done-btn-secondary">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </button>
                  <button className="deal-n-done-btn-primary">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesInvoices; 