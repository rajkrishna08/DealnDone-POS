import React, { useState } from 'react';

const CustomerFeedback = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddResponse, setShowAddResponse] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Dummy data for customer feedback
  const feedbackData = [
    {
      id: 1,
      customerName: 'Emily Davis',
      customerEmail: 'emily.davis@email.com',
      rating: 5,
      title: 'Excellent service and quality products',
      message: 'I had an amazing experience shopping here. The staff was very helpful and the products exceeded my expectations. Will definitely recommend to friends!',
      category: 'Service',
      status: 'Responded',
      date: '2025-01-30',
      sentiment: 'positive',
      response: 'Thank you for your wonderful feedback, Emily! We\'re thrilled to hear about your positive experience. We look forward to serving you again.',
      responseDate: '2025-01-30',
      tags: ['Service', 'Quality', 'Recommendation']
    },
    {
      id: 2,
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      rating: 4,
      title: 'Good experience, but could improve website',
      message: 'Overall good experience. The products are great and delivery was fast. However, the website could be more user-friendly and the checkout process was a bit confusing.',
      category: 'Website',
      status: 'Pending',
      date: '2025-01-29',
      sentiment: 'neutral',
      response: null,
      responseDate: null,
      tags: ['Website', 'User Experience', 'Checkout']
    },
    {
      id: 3,
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.johnson@email.com',
      rating: 2,
      title: 'Disappointed with product quality',
      message: 'I was not satisfied with the quality of the product I received. It didn\'t match the description and the material felt cheap. Expected better for the price.',
      category: 'Product',
      status: 'Urgent',
      date: '2025-01-28',
      sentiment: 'negative',
      response: 'We sincerely apologize for your experience, Sarah. We\'re investigating this issue and would like to offer you a full refund and replacement. Please contact our support team.',
      responseDate: '2025-01-28',
      tags: ['Quality', 'Refund', 'Replacement']
    },
    {
      id: 4,
      customerName: 'Mike Chen',
      customerEmail: 'mike.chen@email.com',
      rating: 5,
      title: 'Outstanding customer support',
      message: 'The customer support team was incredibly helpful when I had an issue with my order. They resolved it quickly and professionally. Highly recommend!',
      category: 'Support',
      status: 'Responded',
      date: '2025-01-27',
      sentiment: 'positive',
      response: 'Thank you for your kind words, Mike! Our support team works hard to provide excellent service. We\'re glad we could help resolve your issue quickly.',
      responseDate: '2025-01-27',
      tags: ['Support', 'Professional', 'Quick Resolution']
    },
    {
      id: 5,
      customerName: 'Lisa Brown',
      customerEmail: 'lisa.brown@email.com',
      rating: 3,
      title: 'Average experience',
      message: 'The product was okay but nothing special. Delivery took longer than expected and the packaging could be better. Service was decent.',
      category: 'Delivery',
      status: 'Pending',
      date: '2025-01-26',
      sentiment: 'neutral',
      response: null,
      responseDate: null,
      tags: ['Delivery', 'Packaging', 'Average']
    },
    {
      id: 6,
      customerName: 'David Wilson',
      customerEmail: 'david.wilson@email.com',
      rating: 1,
      title: 'Terrible experience - avoid this store',
      message: 'Worst shopping experience ever. Wrong product delivered, customer service was rude, and getting a refund was a nightmare. Never shopping here again.',
      category: 'Service',
      status: 'Urgent',
      date: '2025-01-25',
      sentiment: 'negative',
      response: 'We deeply apologize for your experience, David. This is not the standard we strive for. We\'re investigating this matter and will ensure you receive a full refund immediately.',
      responseDate: '2025-01-25',
      tags: ['Refund', 'Service', 'Investigation']
    }
  ];

  const [newResponse, setNewResponse] = useState('');

  const handleAddResponse = () => {
    if (selectedFeedback && newResponse.trim()) {
      console.log('Adding response to feedback:', selectedFeedback.id, newResponse);
      setNewResponse('');
      setShowAddResponse(false);
      setSelectedFeedback(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Responded':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'neutral':
        return 'bg-yellow-100 text-yellow-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const filteredFeedback = feedbackData.filter(feedback => {
    const matchesStatus = filterStatus === 'all' || feedback.status === filterStatus;
    return matchesStatus;
  });

  const stats = {
    totalFeedback: feedbackData.length,
    averageRating: (feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length).toFixed(1),
    respondedCount: feedbackData.filter(f => f.status === 'Responded').length,
    urgentCount: feedbackData.filter(f => f.status === 'Urgent').length,
    positiveCount: feedbackData.filter(f => f.sentiment === 'positive').length,
    negativeCount: feedbackData.filter(f => f.sentiment === 'negative').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Customer Feedback</h1>
          <div className="text-sm text-gray-500">
            Manage customer reviews, ratings, and feedback responses
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setFilterStatus('all')}
            className="deal-n-done-btn-secondary"
          >
            View All
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'feedback', 'analytics'].map((tab) => (
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
                      <span className="text-white text-sm font-medium">📝</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Total Feedback</div>
                    <div className="text-2xl font-semibold text-gray-900">{stats.totalFeedback}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">⭐</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Average Rating</div>
                    <div className="text-2xl font-semibold text-gray-900">{stats.averageRating}</div>
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
                    <div className="text-sm font-medium text-gray-500">Responded</div>
                    <div className="text-2xl font-semibold text-gray-900">{stats.respondedCount}</div>
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
                    <div className="text-sm font-medium text-gray-500">Urgent</div>
                    <div className="text-2xl font-semibold text-gray-900">{stats.urgentCount}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sentiment Analysis */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{stats.positiveCount}</div>
                  <div className="text-sm text-gray-500">Positive</div>
                  <div className="text-xs text-gray-400">({((stats.positiveCount / stats.totalFeedback) * 100).toFixed(1)}%)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.totalFeedback - stats.positiveCount - stats.negativeCount}</div>
                  <div className="text-sm text-gray-500">Neutral</div>
                  <div className="text-xs text-gray-400">({(((stats.totalFeedback - stats.positiveCount - stats.negativeCount) / stats.totalFeedback) * 100).toFixed(1)}%)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">{stats.negativeCount}</div>
                  <div className="text-sm text-gray-500">Negative</div>
                  <div className="text-xs text-gray-400">({((stats.negativeCount / stats.totalFeedback) * 100).toFixed(1)}%)</div>
                </div>
              </div>
            </div>

            {/* Recent Feedback */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h3>
              <div className="space-y-4">
                {feedbackData.slice(0, 3).map((feedback) => (
                  <div key={feedback.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {feedback.customerName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{feedback.customerName}</div>
                          <div className="text-sm text-gray-500">{feedback.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500 text-sm">{getRatingStars(feedback.rating)}</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(feedback.status)}`}>
                          {feedback.status}
                        </span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="font-medium text-gray-900">{feedback.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{feedback.message}</div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {feedback.tags.map((tag, index) => (
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

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search feedback..."
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
                    onClick={() => setFilterStatus('Pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === 'Pending'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilterStatus('Urgent')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === 'Urgent'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Urgent
                  </button>
                  <button
                    onClick={() => setFilterStatus('Responded')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === 'Responded'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Responded
                  </button>
                </div>
              </div>
            </div>

            {/* Feedback List */}
            <div className="space-y-4">
              {filteredFeedback.map((feedback) => (
                <div key={feedback.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {feedback.customerName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{feedback.customerName}</div>
                        <div className="text-sm text-gray-500">{feedback.customerEmail}</div>
                        <div className="text-sm text-gray-500">{feedback.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 text-sm">{getRatingStars(feedback.rating)}</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(feedback.status)}`}>
                        {feedback.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSentimentColor(feedback.sentiment)}`}>
                        {feedback.sentiment}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="font-medium text-gray-900 text-lg mb-2">{feedback.title}</div>
                    <div className="text-gray-600">{feedback.message}</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {feedback.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {feedback.response && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="font-medium text-gray-900 mb-2">Response:</div>
                      <div className="text-gray-600">{feedback.response}</div>
                      <div className="text-xs text-gray-500 mt-2">Responded on {feedback.responseDate}</div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {!feedback.response && (
                      <button 
                        onClick={() => {
                          setSelectedFeedback(feedback);
                          setShowAddResponse(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        Respond
                      </button>
                    )}
                    <button className="text-green-600 hover:text-green-900 text-sm font-medium">
                      Edit Response
                    </button>
                    <button className="text-purple-600 hover:text-purple-900 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = feedbackData.filter(f => f.rating === rating).length;
                    const percentage = ((count / feedbackData.length) * 100).toFixed(1);
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-16">
                          <span className="text-sm text-gray-600">{rating}</span>
                          <span className="text-yellow-500 text-xs">★</span>
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-600 w-12 text-right">
                          {count} ({percentage}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Analysis</h3>
                <div className="space-y-3">
                  {['Service', 'Product', 'Website', 'Support', 'Delivery'].map((category) => {
                    const count = feedbackData.filter(f => f.category === category).length;
                    const percentage = ((count / feedbackData.length) * 100).toFixed(1);
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">
                            {count} ({percentage}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Response Modal */}
        {showAddResponse && selectedFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Respond to Feedback</h3>
                <button
                  onClick={() => setShowAddResponse(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <div className="font-medium text-gray-900 mb-2">Original Feedback:</div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-medium text-gray-900">{selectedFeedback.title}</div>
                  <div className="text-gray-600 mt-1">{selectedFeedback.message}</div>
                  <div className="text-sm text-gray-500 mt-2">
                    By {selectedFeedback.customerName} on {selectedFeedback.date}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Response:</label>
                <textarea
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="4"
                  placeholder="Enter your response to the customer..."
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddResponse(false)}
                  className="deal-n-done-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddResponse}
                  className="deal-n-done-btn-primary"
                >
                  Send Response
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerFeedback; 