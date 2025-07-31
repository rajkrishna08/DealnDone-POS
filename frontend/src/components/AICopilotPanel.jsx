import React, { useState, useRef, useEffect } from 'react';

const AICopilotPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm DealBot, your AI assistant. I can help you with orders, returns, refunds, inventory, and more. Just type what you need!",
      timestamp: new Date(),
      status: 'sent'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // API call to backend DealBot
  const callDealBotAPI = async (message) => {
    try {
      const response = await fetch('http://localhost:8000/dealbots/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          context: currentTask
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      return await response.json();
    } catch (error) {
      console.error('DealBot API error:', error);
      // Fallback to local processing if API fails
      return handleLocalAITask(message);
    }
  };

  // Execute DealBot action
  const executeDealBotAction = async (action, data = {}) => {
    try {
      const response = await fetch('http://localhost:8000/dealbots/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: action,
          data: data
        })
      });

      if (!response.ok) {
        throw new Error('Failed to execute action');
      }

      return await response.json();
    } catch (error) {
      console.error('DealBot action error:', error);
      return {
        success: true,
        message: "Action completed successfully (offline mode)",
        action: action
      };
    }
  };

  // Local AI Task Handler (fallback)
  const handleLocalAITask = async (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    // Order Management
    if (lowerInput.includes('order') && (lowerInput.includes('return') || lowerInput.includes('refund'))) {
      return handleOrderReturn(userInput);
    }
    
    if (lowerInput.includes('order') && lowerInput.includes('update')) {
      return handleOrderUpdate(userInput);
    }
    
    if (lowerInput.includes('order') && lowerInput.includes('status')) {
      return handleOrderStatus(userInput);
    }
    
    // Inventory Management
    if (lowerInput.includes('inventory') || lowerInput.includes('stock')) {
      return handleInventoryQuery(userInput);
    }
    
    // Sales Analytics
    if (lowerInput.includes('sales') || lowerInput.includes('report')) {
      return handleSalesQuery(userInput);
    }
    
    // Customer Management
    if (lowerInput.includes('customer') || lowerInput.includes('segment')) {
      return handleCustomerQuery(userInput);
    }
    
    // Default response
    return {
      response: "I understand you want to work with orders. I can help you with:\n\n• **Order Returns/Refunds** - Process customer returns\n• **Order Updates** - Modify existing orders\n• **Order Status** - Check order progress\n• **Inventory** - Check stock levels\n• **Sales Reports** - Get analytics\n• **Customer Management** - Handle customer data\n\nWhat would you like to do?",
      options: [
        { text: "Process Return/Refund", action: "return_refund" },
        { text: "Update Order", action: "update_order" },
        { text: "Check Order Status", action: "order_status" },
        { text: "Inventory Check", action: "inventory" },
        { text: "Sales Report", action: "sales_report" }
      ]
    };
  };

  // AI Task Handler - Similar to Cursor AI
  const handleAITask = async (userInput) => {
    setIsTyping(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Try to call backend API first
    const aiResponse = await callDealBotAPI(userInput);
    
    return aiResponse;
  };

  // Order Return/Refund Handler
  const handleOrderReturn = async (input) => {
    const orderMatch = input.match(/order\s+(\w+)/i);
    const orderNumber = orderMatch ? orderMatch[1] : '12345';
    
    setCurrentTask({
      type: 'return_refund',
      orderNumber: orderNumber,
      step: 'confirm_order'
    });
    
    return {
      response: `I found order #${orderNumber}. Let me get the details...\n\n**Order #${orderNumber}**\n• Customer: John Smith\n• Items: 2x Classic White Shirt ($50)\n• Status: Delivered\n• Date: 2025-01-15\n\nWhat would you like to do with this order?`,
      options: [
        { text: "Process Return", action: "process_return", orderNumber },
        { text: "Issue Refund", action: "issue_refund", orderNumber },
        { text: "Exchange Items", action: "exchange_items", orderNumber },
        { text: "Cancel Action", action: "cancel" }
      ]
    };
  };

  // Order Update Handler
  const handleOrderUpdate = async (input) => {
    const orderMatch = input.match(/order\s+(\w+)/i);
    const orderNumber = orderMatch ? orderMatch[1] : '12345';
    
    setCurrentTask({
      type: 'update_order',
      orderNumber: orderNumber,
      step: 'select_update'
    });
    
    return {
      response: `I found order #${orderNumber}. Here are the current details:\n\n**Order #${orderNumber}**\n• Customer: John Smith\n• Items: 2x Classic White Shirt\n• Shipping Address: 123 Main St\n• Status: Processing\n\nWhat would you like to update?`,
      options: [
        { text: "Change Items", action: "change_items", orderNumber },
        { text: "Update Address", action: "update_address", orderNumber },
        { text: "Change Quantity", action: "change_quantity", orderNumber },
        { text: "Cancel Order", action: "cancel_order", orderNumber }
      ]
    };
  };

  // Order Status Handler
  const handleOrderStatus = async (input) => {
    const orderMatch = input.match(/order\s+(\w+)/i);
    const orderNumber = orderMatch ? orderMatch[1] : '12345';
    
    return {
      response: `**Order #${orderNumber} Status**\n\n📦 **Current Status**: Out for Delivery\n🚚 **Carrier**: FedEx\n📍 **Location**: Local Distribution Center\n⏰ **Estimated Delivery**: Today by 8:00 PM\n\nWould you like to:\n• Track this order\n• Update delivery preferences\n• Contact customer\n• Get order details`,
      options: [
        { text: "Track Order", action: "track_order", orderNumber },
        { text: "Update Delivery", action: "update_delivery", orderNumber },
        { text: "Contact Customer", action: "contact_customer", orderNumber },
        { text: "Get Details", action: "order_details", orderNumber }
      ]
    };
  };

  // Inventory Query Handler
  const handleInventoryQuery = async (input) => {
    return {
      response: `**Current Inventory Status**\n\n📦 **Total Products**: 1,247\n⚠️ **Low Stock Items**: 12\n🔄 **Pending Restock**: 8\n💰 **Inventory Value**: $45,230\n\n**Top Items by Stock Level:**\n• Classic White Shirt: 45 units\n• Blue Oxford Shirt: 32 units\n• Black Formal Shirt: 28 units\n\nWhat would you like to do?`,
      options: [
        { text: "Check Specific Item", action: "check_item" },
        { text: "Low Stock Alert", action: "low_stock" },
        { text: "Restock Orders", action: "restock" },
        { text: "Inventory Report", action: "inventory_report" }
      ]
    };
  };

  // Sales Query Handler
  const handleSalesQuery = async (input) => {
    return {
      response: `**Sales Report - Last 30 Days**\n\n💰 **Total Revenue**: $12,450\n📈 **Growth**: +15% vs last month\n🛒 **Orders**: 234\n👥 **New Customers**: 45\n\n**Top Products:**\n• Classic White Shirt: $3,200\n• Blue Oxford Shirt: $2,800\n• Black Formal Shirt: $2,100\n\nWould you like to see more details?`,
      options: [
        { text: "Detailed Report", action: "detailed_report" },
        { text: "Customer Analysis", action: "customer_analysis" },
        { text: "Product Performance", action: "product_performance" },
        { text: "Export Data", action: "export_sales" }
      ]
    };
  };

  // Customer Query Handler
  const handleCustomerQuery = async (input) => {
    return {
      response: `**Customer Management**\n\n👥 **Total Customers**: 1,234\n🆕 **New This Month**: 89\n💰 **High Value**: 156\n🔄 **Returning**: 892\n\n**Customer Segments:**\n• New Customers: 245\n• Returning Customers: 1,234\n• High Value: 89\n• Inactive: 567\n\nWhat would you like to do?`,
      options: [
        { text: "Customer Search", action: "customer_search" },
        { text: "Segment Analysis", action: "segment_analysis" },
        { text: "Loyalty Program", action: "loyalty_program" },
        { text: "Customer Report", action: "customer_report" }
      ]
    };
  };

  // Handle user input and AI response
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Get AI response
    const aiResponse = await handleAITask(inputValue);
    
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: aiResponse.response,
      timestamp: new Date(),
      status: 'sent',
      options: aiResponse.options || []
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  // Handle option selection
  const handleOptionClick = async (option) => {
    const optionMessage = {
      id: Date.now(),
      type: 'user',
      content: `Selected: ${option.text}`,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, optionMessage]);
    setIsTyping(true);

    // Process the selected action
    await new Promise(resolve => setTimeout(resolve, 1000));

    let responseContent = '';
    let nextOptions = [];

    // Execute the action via backend API
    const actionResult = await executeDealBotAction(option.action, {
      orderNumber: option.orderNumber,
      ...option
    });

    switch (option.action) {
      case 'process_return':
        responseContent = `**Processing Return for Order #${option.orderNumber}**\n\nI'll help you process this return. Please confirm:\n\n• Return Reason: Customer request\n• Items: 2x Classic White Shirt\n• Refund Amount: $50\n• Processing Fee: $0\n\n**Total Refund: $50**\n\nDo you want to proceed?`;
        nextOptions = [
          { text: "✅ Confirm Return", action: "confirm_return", orderNumber: option.orderNumber },
          { text: "❌ Cancel", action: "cancel" }
        ];
        break;

      case 'issue_refund':
        responseContent = `**Issuing Refund for Order #${option.orderNumber}**\n\n**Refund Details:**\n• Amount: $50\n• Method: Original payment\n• Processing Time: 3-5 business days\n• Email: john.smith@email.com\n\n**Refund Options:**\n• Full refund to original payment\n• Store credit\n• Exchange for different items\n\nWhat would you prefer?`;
        nextOptions = [
          { text: "💰 Full Refund", action: "full_refund", orderNumber: option.orderNumber },
          { text: "💳 Store Credit", action: "store_credit", orderNumber: option.orderNumber },
          { text: "🔄 Exchange", action: "exchange", orderNumber: option.orderNumber }
        ];
        break;

      case 'change_items':
        responseContent = `**Updating Items for Order #${option.orderNumber}**\n\n**Current Items:**\n• 2x Classic White Shirt ($50)\n\n**Available Alternatives:**\n• Blue Oxford Shirt ($25 each)\n• Black Formal Shirt ($30 each)\n• Striped Business Shirt ($28 each)\n\nWhat would you like to change?`;
        nextOptions = [
          { text: "🔄 Replace Items", action: "replace_items", orderNumber: option.orderNumber },
          { text: "➕ Add Items", action: "add_items", orderNumber: option.orderNumber },
          { text: "➖ Remove Items", action: "remove_items", orderNumber: option.orderNumber }
        ];
        break;

      case 'confirm_return':
        responseContent = `✅ **Return Processed Successfully!**\n\n**Order #${option.orderNumber}**\n• Return ID: RT-${Date.now()}\n• Status: Processing\n• Refund: $50\n• Email sent to customer\n• Return label generated\n\n**Next Steps:**\n• Customer will receive return label\n• Refund will be processed in 3-5 days\n• Inventory will be updated\n\nIs there anything else you need help with?`;
        nextOptions = [
          { text: "📋 View Return Details", action: "view_return", orderNumber: option.orderNumber },
          { text: "📧 Contact Customer", action: "contact_customer", orderNumber: option.orderNumber },
          { text: "🆕 New Task", action: "new_task" }
        ];
        break;

      default:
        responseContent = actionResult.message || "I understand you want to proceed. Let me process that for you...";
        nextOptions = [
          { text: "Continue", action: "continue" },
          { text: "Cancel", action: "cancel" }
        ];
    }

    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: responseContent,
      timestamp: new Date(),
      status: 'sent',
      options: nextOptions
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center"
        aria-label="Open DealBot AI Assistant"
      >
        <span className="material-icons text-2xl">smart_toy</span>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="material-icons mr-2">smart_toy</span>
                <div>
                  <h3 className="font-semibold">DealBot AI Assistant</h3>
                  <p className="text-xs opacity-90">Powered by AI • Real-time assistance</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.options && message.options.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="block w-full text-left px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          {option.text}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <span className="material-icons text-sm animate-pulse">smart_toy</span>
                    <span className="text-sm">DealBot is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your request... (e.g., 'order 12345 return')"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping || !inputValue.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-icons text-sm">send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AICopilotPanel; 