import React, { useState, useEffect, useCallback } from 'react';
import { products as dummyProducts, paymentMethods } from '../data/dummyData';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Package,
  Trophy,
  Star,
  Gift,
  Zap,
  Target,
  Bell,
  Filter,
  Barcode,
  Users,
  TrendingUp,
  Award,
  Printer,
  Receipt,
  DollarSign,
  Clock,
  User,
  Phone,
  Mail,
  QrCode,
  Camera,
  Scan,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckSquare,
  Square
} from 'lucide-react';

const ModernPOS = () => {
  // Core state
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiStatus, setApiStatus] = useState('online');
  const [saleResult, setSaleResult] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    loyaltyNumber: ''
  });
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  
  // Enhanced features state
  const [activeFilters, setActiveFilters] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(5000);
  const [dailySales, setDailySales] = useState(3200);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscounts, setAppliedDiscounts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [saleCount, setSaleCount] = useState(0);
  const [currentStep, setCurrentStep] = useState('products'); // products, payment, receipt
  const [cashAmount, setCashAmount] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);

  // Performance optimization
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Check API status
  useEffect(() => {
    checkApiStatus();
    loadLeaderboard();
    console.log('Modern POS loaded with products:', dummyProducts.length);
  }, []);

  // Optimized product filtering
  useEffect(() => {
    const filtered = dummyProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.id.toString().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilters = activeFilters.length === 0 || 
                           activeFilters.some(filter => {
                             switch(filter) {
                               case 'onSale': return product.onSale || false;
                               case 'new': return product.isNew || false;
                               case 'lowStock': return product.stock <= 5;
                               default: return true;
                             }
                           });
      return matchesSearch && matchesFilters;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, activeFilters]);

  const checkApiStatus = async () => {
    try {
      setApiStatus('online');
    } catch (error) {
      setApiStatus('offline');
    }
  };

  const loadLeaderboard = async () => {
    setLeaderboard([
      { id: 1, name: 'Sarah Chen', sales: 12500, rank: 1, avatar: '👩‍💼' },
      { id: 2, name: 'Mike Johnson', sales: 9800, rank: 2, avatar: '👨‍💼' },
      { id: 3, name: 'Lisa Wang', sales: 8700, rank: 3, avatar: '👩‍💼' }
    ]);
  };

  const getCurrencySymbol = () => '$';

  const getGoalProgress = () => {
    return Math.min((dailySales / dailyGoal) * 100, 100);
  };

  // Quick add to cart (single click)
  const quickAddToCart = useCallback((product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    showNotification('Product added to cart', '✅');
  }, [cart]);

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Update cart item quantity
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  // Calculate cart total with discounts and tax
  const cartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discountTotal = appliedDiscounts.reduce((total, discount) => total + discount.amount, 0);
  const taxAmount = (cartSubtotal - discountTotal) * 0.08; // 8% tax
  const cartTotal = cartSubtotal - discountTotal + taxAmount;

  // Apply discount code
  const applyDiscount = () => {
    if (!discountCode.trim()) return;

    const discountAmount = cartSubtotal * 0.1; // 10% discount
    const newDiscount = {
      id: Date.now(),
      code: discountCode,
      amount: discountAmount,
      type: 'percentage'
    };

    setAppliedDiscounts([...appliedDiscounts, newDiscount]);
    setDiscountCode('');
    showNotification('Discount applied!', '🎫');
  };

  // Calculate change for cash payments
  const calculateChange = (amount) => {
    setCashAmount(amount);
    setChangeAmount(amount - cartTotal);
  };

  // Show notification
  const showNotification = (message, emoji) => {
    const notification = {
      id: Date.now(),
      message,
      emoji,
      type: 'success'
    };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 3000);
  };

  // Handle sale submission
  const handleSale = async () => {
    if (cart.length === 0) return;

    setIsProcessing(true);
    try {
      const saleData = {
        id: `SALE-${Date.now()}`,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        customer: customerInfo,
        paymentMethod: selectedPaymentMethod,
        subtotal: cartSubtotal,
        discounts: appliedDiscounts,
        tax: taxAmount,
        total: cartTotal,
        timestamp: new Date().toISOString(),
        cashier: 'Current User',
        store: 'Deal n Done'
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCurrentSale(saleData);
      setSaleResult({
        type: 'success',
        message: `Sale completed! Total: $${cartTotal.toFixed(2)}`,
        data: saleData
      });
      
      // Update daily sales
      setDailySales(prev => prev + cartTotal);
      setSaleCount(prev => prev + 1);
      
      // Move to receipt step
      setCurrentStep('receipt');
      
      // Reset form
      setCart([]);
      setAppliedDiscounts([]);
      setSelectedPaymentMethod(null);
      setCustomerInfo({ name: '', email: '', phone: '', loyaltyNumber: '' });
      setShowCustomerForm(false);
      setCashAmount(0);
      setChangeAmount(0);
      
      showNotification('Sale completed successfully!', '✅');
    } catch (error) {
      setSaleResult({
        type: 'error',
        message: 'Sale failed. Please try again.',
        error: error.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Print receipt
  const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - Deal n Done</title>
          <style>
            body { font-family: monospace; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; }
            .total { border-top: 1px solid #000; margin-top: 10px; padding-top: 10px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Deal n Done</h2>
            <p>Receipt #${currentSale?.id}</p>
            <p>${new Date(currentSale?.timestamp).toLocaleString()}</p>
          </div>
          ${currentSale?.items.map(item => `
            <div class="item">
              <span>${item.name} x${item.quantity}</span>
              <span>$${item.total.toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="total">
            <div class="item">
              <span>Subtotal:</span>
              <span>$${currentSale?.subtotal.toFixed(2)}</span>
            </div>
            ${currentSale?.discounts.map(discount => `
              <div class="item">
                <span>Discount (${discount.code}):</span>
                <span>-$${discount.amount.toFixed(2)}</span>
              </div>
            `).join('')}
            <div class="item">
              <span>Tax:</span>
              <span>$${currentSale?.tax.toFixed(2)}</span>
            </div>
            <div class="item">
              <strong>Total:</strong>
              <strong>$${currentSale?.total.toFixed(2)}</strong>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>Visit us again at dealndone.com</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Start new sale
  const startNewSale = () => {
    setCurrentStep('products');
    setCurrentSale(null);
    setSaleResult(null);
  };

  const filterOptions = [
    { id: 'onSale', label: 'On Sale', icon: '🏷️' },
    { id: 'new', label: 'New', icon: '🆕' },
    { id: 'lowStock', label: 'Low Stock', icon: '⚠️' }
  ];

  // Receipt Component
  const ReceiptView = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Deal n Done</h2>
        <p className="text-sm text-gray-600">Receipt #{currentSale?.id}</p>
        <p className="text-sm text-gray-600">{new Date(currentSale?.timestamp).toLocaleString()}</p>
      </div>

      <div className="space-y-3 mb-6">
        {currentSale?.items.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div>
              <span className="font-medium">{item.name}</span>
              <span className="text-sm text-gray-600 ml-2">x{item.quantity}</span>
            </div>
            <span className="font-medium">${item.total.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${currentSale?.subtotal.toFixed(2)}</span>
        </div>
        {currentSale?.discounts.map(discount => (
          <div key={discount.id} className="flex justify-between text-green-600">
            <span>Discount ({discount.code}):</span>
            <span>-${discount.amount.toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>${currentSale?.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total:</span>
          <span>${currentSale?.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center mt-6 space-y-3">
        <button
          onClick={printReceipt}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
        >
          <Printer className="w-5 h-5 mr-2" />
          Print Receipt
        </button>
        <button
          onClick={startNewSale}
          className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Sale
        </button>
      </div>
    </div>
  );

  // Payment Component
  const PaymentView = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
        <button
          onClick={() => setCurrentStep('products')}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Products
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
          <div className="space-y-3">
            {paymentMethods.filter(method => method.status === 'active').map((method) => (
              <label key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedPaymentMethod === method.id}
                  onChange={(e) => setSelectedPaymentMethod(parseInt(e.target.value))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{method.name}</div>
                  <div className="text-xs text-gray-600">{method.description}</div>
                </div>
              </label>
            ))}
          </div>

          {/* Cash Payment */}
          {selectedPaymentMethod === 1 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Cash Payment</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received</label>
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => calculateChange(parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                {cashAmount > 0 && (
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Change:</span>
                    <span className="font-bold text-green-600">${changeAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-gray-600 ml-2">x{item.quantity}</span>
                </div>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discounts:</span>
                  <span>-${discountTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (8%):</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSale}
            disabled={!selectedPaymentMethod || isProcessing}
            className={`w-full mt-4 py-4 text-lg font-semibold rounded-lg transition-colors ${
              selectedPaymentMethod && !isProcessing
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-100 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete Sale
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Main Products View
  const ProductsView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Product Universe - Left Pane */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Search and Filters */}
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Smart Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products or scan barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Barcode className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              
              {/* Filter Chips */}
              <div className="flex flex-wrap gap-2">
                {filterOptions.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => {
                      if (activeFilters.includes(filter.id)) {
                        setActiveFilters(activeFilters.filter(f => f !== filter.id));
                      } else {
                        setActiveFilters([...activeFilters, filter.id]);
                      }
                    }}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeFilters.includes(filter.id)
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-1">{filter.icon}</span>
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 group cursor-pointer product-card-hover"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                    {/* Sale Badge */}
                    {(product.onSale || false) && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        SALE
                      </div>
                    )}
                    {/* Quick Add Button */}
                    <button
                      onClick={() => quickAddToCart(product)}
                      className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-700 quick-add-btn"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      {(product.onSale || false) ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-red-600">
                            {getCurrencySymbol()}{(product.price * 0.8).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {getCurrencySymbol()}{product.price}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          {getCurrencySymbol()}{product.price}
                        </span>
                      )}
                    </div>
                    
                    <span className={`text-sm ${
                      product.stock > 10 ? 'text-green-600' : 
                      product.stock > 5 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cart and Checkout - Right Pane */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shopping Cart</h3>
            
            {/* Cart Items */}
            {cart.length > 0 ? (
              <div className="space-y-4 mb-6">
                <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 text-sm">{item.name}</h5>
                        <p className="text-xs text-gray-600">{item.category}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-gray-600 hover:text-gray-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-600 hover:text-gray-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {getCurrencySymbol()}{(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {getCurrencySymbol()}{item.price} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 mb-6">
                <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Cart is empty</p>
              </div>
            )}

            {/* Discount Section */}
            {cart.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Discounts</h4>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={applyDiscount}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  </div>
                  
                  {appliedDiscounts.map(discount => (
                    <div key={discount.id} className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                      <span className="text-sm text-green-800">{discount.code}</span>
                      <span className="text-sm font-medium text-green-800">
                        -{getCurrencySymbol()}{discount.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Information */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Customer Information</h4>
                <button
                  onClick={() => setShowCustomerForm(!showCustomerForm)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {showCustomerForm ? 'Hide' : 'Add Customer'}
                </button>
              </div>
              
              {showCustomerForm ? (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Name</label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Customer name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="customer@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Loyalty Number</label>
                    <input
                      type="text"
                      value={customerInfo.loyaltyNumber}
                      onChange={(e) => setCustomerInfo({...customerInfo, loyaltyNumber: e.target.value})}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Loyalty number"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  {customerInfo.name ? (
                    <div>
                      <p><strong>Name:</strong> {customerInfo.name}</p>
                      <p><strong>Email:</strong> {customerInfo.email}</p>
                      <p><strong>Phone:</strong> {customerInfo.phone}</p>
                      {customerInfo.loyaltyNumber && (
                        <p><strong>Loyalty:</strong> {customerInfo.loyaltyNumber}</p>
                      )}
                    </div>
                  ) : (
                    <p>No customer information added</p>
                  )}
                </div>
              )}
            </div>

            {/* Cart Total */}
            {cart.length > 0 && (
              <div className="border-t pt-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="text-sm text-gray-900">{getCurrencySymbol()}{cartSubtotal.toFixed(2)}</span>
                  </div>
                  {discountTotal > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Discounts:</span>
                      <span className="text-sm text-green-600">-{getCurrencySymbol()}{discountTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tax (8%):</span>
                    <span className="text-sm text-gray-900">{getCurrencySymbol()}{taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-lg font-medium text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {getCurrencySymbol()}{cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Proceed to Payment Button */}
            {cart.length > 0 && (
              <button
                onClick={() => setCurrentStep('payment')}
                className="w-full py-4 text-lg font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Proceed to Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Add error boundary
  if (!dummyProducts || dummyProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Modern POS...</h2>
          <p className="text-gray-600">Please wait while we load the products.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with KPI Ring */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Modern POS</h1>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                apiStatus === 'online' ? 'bg-green-100 text-green-800' : 
                apiStatus === 'offline' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {apiStatus === 'online' ? '🟢 Online' : 
                 apiStatus === 'offline' ? '🔴 Offline' : '🟡 Checking...'}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* KPI Ring */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - getGoalProgress() / 100)}`}
                      className="text-blue-600 transition-all duration-500 kpi-ring"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold">{Math.round(getGoalProgress())}%</span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Daily Goal</div>
                  <div className="text-gray-600">{getCurrencySymbol()}{dailySales.toFixed(0)} / {getCurrencySymbol()}{dailyGoal}</div>
                </div>
              </div>

              {/* Notification Bell */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2">
          {notifications.map(notification => (
            <div key={notification.id} className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm animate-slide-in">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{notification.emoji}</span>
                <div>
                  <div className="font-medium text-gray-900">{notification.message}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentStep === 'receipt' ? (
          <ReceiptView />
        ) : currentStep === 'payment' ? (
          <PaymentView />
        ) : (
          <ProductsView />
        )}
      </div>
    </div>
  );
};

export default ModernPOS; 