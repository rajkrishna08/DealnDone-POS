import React, { useState, useRef, useEffect } from 'react';

const DealBotAI = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m DealBot, your AI assistant for Deal n Done. How can I help you today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI responses based on keywords
  const getAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('inventory') || lowerMessage.includes('stock')) {
      return {
        type: 'bot',
        content: 'I can help you with inventory management! You can:\n• View stock levels\n• Create purchase orders\n• Transfer items between locations\n• Conduct stock takes\n• Manage suppliers\n\nWhat specific inventory task do you need help with?',
        timestamp: new Date().toLocaleTimeString()
      };
    }
    
    if (lowerMessage.includes('sale') || lowerMessage.includes('pos') || lowerMessage.includes('transaction')) {
      return {
        type: 'bot',
        content: 'For sales and POS operations:\n• Process new sales\n• Handle returns\n• Manage payment methods\n• Generate receipts\n• View sales reports\n\nWould you like me to guide you through any of these processes?',
        timestamp: new Date().toLocaleTimeString()
      };
    }
    
    if (lowerMessage.includes('report') || lowerMessage.includes('analytics')) {
      return {
        type: 'bot',
        content: 'I can help you with reports and analytics:\n• Sales reports\n• Inventory reports\n• Customer analytics\n• Employee performance\n• Financial summaries\n\nWhich type of report are you looking for?',
        timestamp: new Date().toLocaleTimeString()
      };
    }
    
    if (lowerMessage.includes('customer') || lowerMessage.includes('client')) {
      return {
        type: 'bot',
        content: 'Customer management features:\n• View customer profiles\n• Track purchase history\n• Manage loyalty programs\n• Handle customer support\n• Send notifications\n\nHow can I help with customer management?',
        timestamp: new Date().toLocaleTimeString()
      };
    }
    
    if (lowerMessage.includes('employee') || lowerMessage.includes('staff')) {
      return {
        type: 'bot',
        content: 'Employee management capabilities:\n• View staff schedules\n• Track time sheets\n• Manage roles and permissions\n• Monitor performance\n• Handle payroll\n\nWhat employee-related task do you need assistance with?',
        timestamp: new Date().toLocaleTimeString()
      };
    }
    
    if (lowerMessage.includes('setting') || lowerMessage.includes('config')) {
      return {
        type: 'bot',
        content: 'System settings and configuration:\n• Store information\n• Payment methods\n• Tax settings\n• Business hours\n• Notification preferences\n\nWhich settings would you like to configure?',
        timestamp: new Date().toLocaleTimeString()
      };
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return {
        type: 'bot',
        content: 'I\'m here to help! Here are some common tasks:\n\n📦 **Inventory**: Stock management, purchases, transfers\n🛒 **Sales**: POS operations, transactions, returns\n📊 **Reports**: Analytics, performance metrics\n👥 **Customers**: Profiles, loyalty, support\n👨‍💼 **Employees**: Schedules, time tracking\n⚙️ **Settings**: Configuration, preferences\n\nJust ask me about any of these areas!',
        timestamp: new Date().toLocaleTimeString()
      };
    }
    
    // Default response
    return {
      type: 'bot',
      content: 'I understand you\'re asking about "' + message + '". Let me help you with that. Could you please be more specific about what you need assistance with? I can help with inventory, sales, reports, customers, employees, and settings.',
      timestamp: new Date().toLocaleTimeString()
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = getAIResponse(inputMessage);
      setMessages(prev => [...prev, { ...aiResponse, id: Date.now() + 1 }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: 'Inventory Status', action: () => setInputMessage('Show me current inventory status') },
    { label: 'Sales Report', action: () => setInputMessage('Generate today\'s sales report') },
    { label: 'Low Stock Alert', action: () => setInputMessage('Check for low stock items') },
    { label: 'Customer Help', action: () => setInputMessage('Help me with customer management') }
  ];

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isMinimized ? 'w-16 h-16' : 'w-96 h-96'}`}>
      {/* Minimized State */}
      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="w-16 h-16 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
        >
          <span className="text-2xl">🤖</span>
        </button>
      )}

      {/* Expanded Chat Interface */}
      {!isMinimized && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-96 h-96 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-semibold">DealBot AI</h3>
                <p className="text-xs opacity-90">AI-powered assistance</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
              >
                <span className="text-lg">−</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="whitespace-pre-line">{message.content}</div>
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Deal n Done..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="text-sm">Send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealBotAI; 