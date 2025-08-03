import React, { useState } from 'react';

const CustomerSupport = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddTicket, setShowAddTicket] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Dummy data for support tickets
  const supportTickets = [
    {
      id: 1,
      customerName: 'Emily Davis',
      customerEmail: 'emily.davis@email.com',
      subject: 'Order not received after 5 days',
      message: 'I placed an order on January 25th and it still hasn\'t arrived. The tracking shows it\'s been stuck at the local post office for 3 days.',
      priority: 'High',
      status: 'Open',
      category: 'Shipping',
      assignedTo: 'Sarah Johnson',
      createdAt: '2025-01-30 14:30',
      responseTime: '2h 15m',
      tags: ['Shipping', 'Tracking', 'Delayed']
    },
    {
      id: 2,
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      subject: 'Wrong product received',
      message: 'I ordered a Samsung 55" TV but received a different model. The box says Samsung but the TV inside is a different brand.',
      priority: 'Urgent',
      status: 'In Progress',
      category: 'Product',
      assignedTo: 'Mike Chen',
      createdAt: '2025-01-29 09:15',
      responseTime: '1h 15m',
      tags: ['Wrong Product', 'Refund', 'Replacement']
    },
    {
      id: 3,
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.johnson@email.com',
      subject: 'Website login issues',
      message: 'I can\'t log into my account. The password reset email never arrives and I\'ve tried multiple times.',
      priority: 'Medium',
      status: 'Resolved',
      category: 'Technical',
      assignedTo: 'David Wilson',
      createdAt: '2025-01-28 16:20',
      responseTime: '18h 40m',
      tags: ['Login', 'Password', 'Technical']
    }
  ];

  const [newTicket, setNewTicket] = useState({
    customerName: '',
    customerEmail: '',
    subject: '',
    message: '',
    priority: 'Medium',
    category: 'General'
  });

  const handleAddTicket = () => {
    const ticket = {
      id: Date.now(),
      ...newTicket,
      status: 'Open',
      assignedTo: 'Unassigned',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      responseTime: 'Pending',
      tags: []
    };
    console.log('New ticket added:', ticket);
    setNewTicket({ customerName: '', customerEmail: '', subject: '', message: '', priority: 'Medium', category: 'General' });
    setShowAddTicket(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    return matchesStatus;
  });

  const stats = {
    totalTickets: supportTickets.length,
    openTickets: supportTickets.filter(t => t.status === 'Open').length,
    resolvedTickets: supportTickets.filter(t => t.status === 'Resolved').length,
    avgResponseTime: '4h 23m',
    urgentTickets: supportTickets.filter(t => t.priority === 'Urgent').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Customer Support</h1>
          <div className="text-sm text-gray-500">
            Manage support tickets and customer service
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setShowAddTicket(true)}
            className="deal-n-done-btn-primary"
          >
            Create Ticket
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'tickets'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">🎫</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Total Tickets</div>
                    <div className="text-2xl font-semibold text-gray-900">{stats.totalTickets}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">🚨</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Open Tickets</div>
                    <div className="text-2xl font-semibold text-gray-900">{stats.openTickets}</div>
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
                    <div className="text-sm font-medium text-gray-500">Resolved</div>
                    <div className="text-2xl font-semibold text-gray-900">{stats.resolvedTickets}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">⏱️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Avg Response</div>
                    <div className="text-2xl font-semibold text-gray-900">{stats.avgResponseTime}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Tickets */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Support Tickets</h3>
              <div className="space-y-4">
                {supportTickets.slice(0, 3).map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {ticket.customerName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{ticket.customerName}</div>
                          <div className="text-sm text-gray-500">{ticket.createdAt}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="font-medium text-gray-900">{ticket.subject}</div>
                      <div className="text-sm text-gray-600 mt-1">{ticket.message.substring(0, 100)}...</div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {ticket.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus('Open')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === 'Open'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => setFilterStatus('In Progress')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === 'In Progress'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => setFilterStatus('Resolved')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === 'Resolved'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>
            </div>

            {/* Tickets List */}
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {ticket.customerName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{ticket.customerName}</div>
                        <div className="text-sm text-gray-500">{ticket.customerEmail}</div>
                        <div className="text-sm text-gray-500">{ticket.createdAt}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="font-medium text-gray-900 text-lg mb-2">{ticket.subject}</div>
                    <div className="text-gray-600">{ticket.message}</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {ticket.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Assigned to: <span className="font-medium">{ticket.assignedTo}</span> | 
                      Response time: <span className="font-medium">{ticket.responseTime}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                        View Details
                      </button>
                      <button className="text-green-600 hover:text-green-900 text-sm font-medium">
                        Reply
                      </button>
                      <button className="text-purple-600 hover:text-purple-900 text-sm font-medium">
                        Assign
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Ticket Modal */}
        {showAddTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Create Support Ticket</h3>
                <button
                  onClick={() => setShowAddTicket(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                    <input
                      type="text"
                      value={newTicket.customerName}
                      onChange={(e) => setNewTicket({...newTicket, customerName: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email</label>
                    <input
                      type="email"
                      value={newTicket.customerEmail}
                      onChange={(e) => setNewTicket({...newTicket, customerEmail: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter customer email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter ticket subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={newTicket.message}
                    onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="4"
                    placeholder="Enter detailed message"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="General">General</option>
                      <option value="Shipping">Shipping</option>
                      <option value="Product">Product</option>
                      <option value="Technical">Technical</option>
                      <option value="Returns">Returns</option>
                      <option value="Quality">Quality</option>
                      <option value="Loyalty">Loyalty</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddTicket(false)}
                  className="deal-n-done-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTicket}
                  className="deal-n-done-btn-primary"
                >
                  Create Ticket
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSupport; 