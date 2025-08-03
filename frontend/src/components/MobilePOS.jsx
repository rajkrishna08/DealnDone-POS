import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Package, 
  Users, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Search,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';

const MobilePOS = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('pos');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock products for demo
  useEffect(() => {
    setProducts([
      { id: 1, name: 'Classic Suit', price: 299.99, category: 'Suits', stock: 15 },
      { id: 2, name: 'Business Shirt', price: 89.99, category: 'Shirts', stock: 25 },
      { id: 3, name: 'Dress Pants', price: 129.99, category: 'Pants', stock: 20 },
      { id: 4, name: 'Tie Collection', price: 49.99, category: 'Accessories', stock: 30 },
      { id: 5, name: 'Leather Belt', price: 39.99, category: 'Accessories', stock: 18 }
    ]);
  }, []);

  const addToCart = (product) => {
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
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
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

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const processPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call backend API
      const response = await fetch('/api/pos/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total: getTotal(),
          payment_method: 'card'
        })
      });

      if (response.ok) {
        setCart([]);
        alert('Payment processed successfully!');
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      alert('Network error. Please check connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-100"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-lg font-semibold">Honey Tailors POS</h1>
              <p className="text-xs text-gray-500">Mobile Point of Sale</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-500">Online</span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg z-50">
          <div className="p-4 space-y-4">
            <button
              onClick={() => { setCurrentView('pos'); setIsMenuOpen(false); }}
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-50"
            >
              <CreditCard size={20} />
              <span>Point of Sale</span>
            </button>
            <button
              onClick={() => { setCurrentView('inventory'); setIsMenuOpen(false); }}
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-50"
            >
              <Package size={20} />
              <span>Inventory</span>
            </button>
            <button
              onClick={() => { setCurrentView('customers'); setIsMenuOpen(false); }}
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-50"
            >
              <Users size={20} />
              <span>Customers</span>
            </button>
            <button
              onClick={() => { setCurrentView('reports'); setIsMenuOpen(false); }}
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-50"
            >
              <BarChart3 size={20} />
              <span>Reports</span>
            </button>
            <button
              onClick={() => { setCurrentView('settings'); setIsMenuOpen(false); }}
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-50"
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4">
        {currentView === 'pos' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white p-3 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => addToCart(product)}
                >
                  <div className="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                    <Package size={24} className="text-gray-400" />
                  </div>
                  <h3 className="font-medium text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500">{product.category}</p>
                  <p className="font-semibold text-sm">${product.price}</p>
                  <p className="text-xs text-gray-400">Stock: {product.stock}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cart Sidebar (Mobile Bottom Sheet) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Cart ({cart.length} items)</h3>
              <button
                onClick={() => setCart([])}
                className="text-red-500 text-sm"
              >
                Clear
              </button>
            </div>

            {/* Cart Items */}
            <div className="max-h-32 overflow-y-auto space-y-2 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total and Payment */}
            <div className="border-t pt-3">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">${getTotal().toFixed(2)}</span>
              </div>
              <button
                onClick={processPayment}
                disabled={cart.length === 0 || isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    <span>Process Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePOS; 