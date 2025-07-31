import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { products as dummyProducts, paymentMethods } from '../data/dummyData';

const POSScreen = ({ selectedCurrency = 'USD' }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  const [saleResult, setSaleResult] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  // Check API status
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8000/health');
      if (response.data.status === 'healthy') {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
      }
    } catch (error) {
      setApiStatus('offline');
    }
  };

  // Use dummy products data
  const products = dummyProducts;

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toString().includes(searchTerm.toLowerCase())
  );

  // Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setSaleResult(null);
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= selectedProduct.stock) {
      setQuantity(newQuantity);
    }
  };

  // Add to cart
  const addToCart = () => {
    if (!selectedProduct) return;

    const existingItem = cart.find(item => item.id === selectedProduct.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === selectedProduct.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        ...selectedProduct,
        quantity: quantity
      }]);
    }

    setSelectedProduct(null);
    setQuantity(1);
    setSaleResult(null);
  };

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

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Handle sale submission
  const handleSale = async () => {
    if (cart.length === 0) return;

    try {
      const saleData = {
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        customer: customerInfo,
        paymentMethod: selectedPaymentMethod,
        total: cartTotal
      };

      // Simulate API call
      setTimeout(() => {
        setSaleResult({
          type: 'success',
          message: `Sale successful! Total: ${getCurrencySymbol()}${cartTotal.toFixed(2)}`,
          data: saleData
        });
        
        // Reset form
        setCart([]);
        setSelectedProduct(null);
        setQuantity(1);
        setSelectedPaymentMethod(null);
        setCustomerInfo({ name: '', email: '', phone: '' });
        setShowCustomerForm(false);
      }, 1000);
    } catch (error) {
      setSaleResult({
        type: 'error',
        message: 'Sale failed. Please try again.',
        error: error.message
      });
    }
  };

  const getCurrencySymbol = () => {
    const symbols = { 'USD': '$', 'INR': '₹', 'EUR': '€', 'GBP': '£' };
    return symbols[selectedCurrency] || '$';
  };

  return (
    <div className="deal-n-done-card">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Point of Sale</h2>
          <p className="text-sm text-gray-600">Process sales and transactions</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            apiStatus === 'online' ? 'bg-green-100 text-green-800' : 
            apiStatus === 'offline' ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}>
            {apiStatus === 'online' ? '🟢 Online' : 
             apiStatus === 'offline' ? '🔴 Offline' : '🟡 Checking...'}
          </div>
          <div className="text-sm text-gray-600">
            Currency: {getCurrencySymbol()}{selectedCurrency}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2">
          <div className="deal-n-done-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Product</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 border border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedProduct?.id === product.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-500 hover:shadow-md'
                  }`}
                  onClick={() => handleProductSelect(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                  <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      {getCurrencySymbol()}{product.price}
                    </span>
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

        {/* Cart and Payment */}
        <div className="lg:col-span-1">
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shopping Cart</h3>
            
            {/* Selected Product */}
            {selectedProduct ? (
              <div className="space-y-4 mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
                    <p className="text-sm text-gray-600">{selectedProduct.category}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <span className="text-sm">-</span>
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        min="1"
                        max={selectedProduct.stock}
                        className="w-20 text-center border border-gray-300 rounded-md py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= selectedProduct.stock}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <span className="text-sm">+</span>
                      </button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Unit Price:</span>
                      <span className="text-sm text-gray-900">{getCurrencySymbol()}{selectedProduct.price}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <span className="text-sm text-gray-900">{quantity}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="font-medium text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-gray-900">
                        {getCurrencySymbol()}{(selectedProduct.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={addToCart}
                    className="deal-n-done-btn-primary w-full py-3 text-lg font-semibold"
                  >
                    <span className="text-lg mr-2">🛒</span>
                    Add to Cart
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 mb-6">
                <span className="text-4xl mb-2">📦</span>
                <p>Select a product to add to cart</p>
              </div>
            )}

            {/* Cart Items */}
            {cart.length > 0 && (
              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-gray-900">Cart Items ({cart.length})</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
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
                          <span className="text-sm">-</span>
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-600 hover:text-gray-900"
                        >
                          <span className="text-sm">+</span>
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <span className="text-sm">🗑️</span>
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
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  {customerInfo.name ? (
                    <div>
                      <p><strong>Name:</strong> {customerInfo.name}</p>
                      <p><strong>Email:</strong> {customerInfo.email}</p>
                      <p><strong>Phone:</strong> {customerInfo.phone}</p>
                    </div>
                  ) : (
                    <p>No customer information added</p>
                  )}
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
              <div className="space-y-2">
                {paymentMethods.filter(method => method.status === 'active').map((method) => (
                  <label key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={(e) => setSelectedPaymentMethod(parseInt(e.target.value))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{method.name}</div>
                      <div className="text-xs text-gray-600">{method.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Cart Total */}
            {cart.length > 0 && (
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-medium text-gray-900">Cart Total:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {getCurrencySymbol()}{cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {cart.length} item{cart.length !== 1 ? 's' : ''} in cart
                </div>
              </div>
            )}

            {/* Complete Sale Button */}
            {cart.length > 0 && (
              <button
                onClick={handleSale}
                disabled={!selectedPaymentMethod}
                className={`w-full py-3 text-lg font-semibold rounded-md transition-colors ${
                  selectedPaymentMethod
                    ? 'deal-n-done-btn-primary'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span className="text-lg mr-2">💳</span>
                Complete Sale
              </button>
            )}

            {/* Sale Result */}
            {saleResult && (
              <div className={`mt-4 p-4 rounded-md ${
                saleResult.type === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center">
                  <span className={`text-lg mr-2 ${
                    saleResult.type === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {saleResult.type === 'success' ? '✅' : '❌'}
                  </span>
                  <span className={`text-sm font-medium ${
                    saleResult.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {saleResult.message}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSScreen; 