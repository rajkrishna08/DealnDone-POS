import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Search, Filter, Plus, Minus, Trash2, CreditCard, Receipt, Users, TrendingUp } from 'lucide-react';

/**
 * POS View Component
 * Main point-of-sale interface with product catalog and shopping cart
 */
const POSView = ({ productModel, saleModel, posController }) => {
  const [currentView, setCurrentView] = useState('catalog'); // catalog, cart, checkout, history
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Subscribe to model changes
  useEffect(() => {
    const handleModelChange = () => {
      // Handle model state changes
    };

    productModel.addListener(handleModelChange);
    saleModel.addListener(handleModelChange);

    return () => {
      productModel.removeListener(handleModelChange);
      saleModel.removeListener(handleModelChange);
    };
  }, [productModel, saleModel]);

  // Handle search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        await posController.searchProducts(query);
      } catch (error) {
        console.error('Search error:', error);
      }
    } else {
      productModel.clearSearchResults();
    }
  };

  // Handle product selection
  const handleProductSelect = (product) => {
    try {
      posController.addToCart(product, 1);
      setCurrentView('cart');
    } catch (error) {
      console.error('Add to cart error:', error);
      // Show error message to user
    }
  };

  // Handle cart item quantity change
  const handleQuantityChange = (itemId, newQuantity) => {
    try {
      posController.updateCartItemQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Quantity update error:', error);
      // Show error message to user
    }
  };

  // Handle cart item removal
  const handleRemoveFromCart = (itemId) => {
    posController.removeFromCart(itemId);
  };

  // Handle checkout
  const handleCheckout = () => {
    setCurrentView('checkout');
  };

  // Handle payment
  const handlePayment = async (paymentData) => {
    try {
      if (!saleModel.currentSale) {
        // Create new sale
        const saleData = {
          customerId: saleModel.customer?.id,
          items: saleModel.cart,
          subtotal: saleModel.cartSubtotal,
          tax: saleModel.cartTax,
          discount: saleModel.cartDiscount,
          total: saleModel.cartTotal
        };

        const sale = await posController.createSale(saleData);
        await posController.completeSale(sale.id, paymentData);
      } else {
        await posController.completeSale(saleModel.currentSale.id, paymentData);
      }

      setCurrentView('receipt');
    } catch (error) {
      console.error('Payment error:', error);
      // Show error message to user
    }
  };

  // Handle new sale
  const handleNewSale = () => {
    posController.clearCart();
    posController.clearCurrentSale();
    setCurrentView('catalog');
  };

  // Render product catalog
  const renderProductCatalog = () => {
    const products = productModel.hasSearchResults ? productModel.searchResults : productModel.products;

    return (
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Product Catalog</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              History
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {productModel.categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select
                    value={selectedBrand || ''}
                    onChange={(e) => setSelectedBrand(e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Brands</option>
                    {productModel.brands.map(brand => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={handleProductSelect}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search terms.' : 'Get started by adding some products.'}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Render shopping cart
  const renderShoppingCart = () => {
    return (
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
          <button
            onClick={() => setCurrentView('catalog')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Continue Shopping
          </button>
        </div>

        {saleModel.isCartEmpty ? (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
            <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
            <button
              onClick={() => setCurrentView('catalog')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {saleModel.cart.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveFromCart}
              />
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium text-gray-900">Subtotal:</span>
                <span className="text-lg font-medium text-gray-900">
                  {saleModel.formatCurrency(saleModel.cartSubtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">Tax:</span>
                <span className="text-sm text-gray-600">
                  {saleModel.formatCurrency(saleModel.cartTax)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">Discount:</span>
                <span className="text-sm text-gray-600">
                  -{saleModel.formatCurrency(saleModel.cartDiscount)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-gray-900">
                  {saleModel.formatCurrency(saleModel.cartTotal)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render checkout
  const renderCheckout = () => {
    return (
      <CheckoutView
        saleModel={saleModel}
        onPayment={handlePayment}
        onBack={() => setCurrentView('cart')}
      />
    );
  };

  // Render receipt
  const renderReceipt = () => {
    return (
      <ReceiptView
        sale={saleModel.currentSale}
        receiptData={saleModel.receiptData}
        onNewSale={handleNewSale}
      />
    );
  };

  // Render sales history
  const renderSalesHistory = () => {
    return (
      <SalesHistoryView
        sales={saleModel.salesHistory}
        onBack={() => setCurrentView('catalog')}
      />
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">POS System</h1>
          
          <nav className="space-y-2">
            <button
              onClick={() => setCurrentView('catalog')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentView === 'catalog'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Package className="w-5 h-5 mr-3" />
              Products
            </button>
            <button
              onClick={() => setCurrentView('cart')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentView === 'cart'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ShoppingCart className="w-5 h-5 mr-3" />
              Cart ({saleModel.cartItemCount})
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentView === 'history'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-5 h-5 mr-3" />
              Sales History
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'catalog' && renderProductCatalog()}
        {currentView === 'cart' && renderShoppingCart()}
        {currentView === 'checkout' && renderCheckout()}
        {currentView === 'receipt' && renderReceipt()}
        {currentView === 'history' && renderSalesHistory()}
      </div>
    </div>
  );
};

/**
 * Product Card Component
 */
const ProductCard = ({ product, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
          <span className="text-sm text-gray-500">{product.sku}</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <span className={`text-sm px-2 py-1 rounded-full ${
            product.stockQuantity > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
          </span>
        </div>
        
        <button
          onClick={() => onSelect(product)}
          disabled={product.stockQuantity <= 0}
          className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

/**
 * Cart Item Component
 */
const CartItem = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
      <div className="flex-1">
        <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
        <p className="text-sm text-gray-600">{item.sku}</p>
        <p className="text-lg font-bold text-gray-900">
          {saleModel.formatCurrency(item.price)}
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/**
 * Checkout View Component
 */
const CheckoutView = ({ saleModel, onPayment, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerSearch, setCustomerSearch] = useState('');

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    onPayment({
      method: paymentMethod,
      reference: `PAY-${Date.now()}`,
      amount: saleModel.cartTotal
    });
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back to Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            <div className="bg-white rounded-lg shadow-sm p-6">
              {saleModel.cart.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="text-sm font-medium">
                    {saleModel.formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm font-medium">
                    {saleModel.formatCurrency(saleModel.cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Tax:</span>
                  <span className="text-sm font-medium">
                    {saleModel.formatCurrency(saleModel.cartTax)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Discount:</span>
                  <span className="text-sm font-medium">
                    -{saleModel.formatCurrency(saleModel.cartDiscount)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t pt-2">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {saleModel.formatCurrency(saleModel.cartTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment</h3>
            <form onSubmit={handlePaymentSubmit} className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {saleModel.paymentMethods.map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-3 border rounded-md text-center ${
                        paymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-2xl mb-1">{method.icon}</div>
                      <div className="text-sm font-medium">{method.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                Complete Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Receipt View Component
 */
const ReceiptView = ({ sale, receiptData, onNewSale }) => {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <Receipt className="mx-auto h-12 w-12 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900 mt-2">Payment Successful!</h2>
          <p className="text-sm text-gray-600">Transaction completed successfully</p>
        </div>

        {sale && (
          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sale ID:</span>
                <span className="text-sm font-medium">{sale.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Date:</span>
                <span className="text-sm font-medium">
                  {new Date(sale.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total:</span>
                <span className="text-lg font-bold text-gray-900">
                  ${sale.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {sale.items.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="text-sm font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <button
            onClick={onNewSale}
            className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            New Sale
          </button>
          <button
            onClick={() => window.print()}
            className="w-full px-4 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Sales History View Component
 */
const SalesHistoryView = ({ sales, onBack }) => {
  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Sales History</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Back to POS
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sale ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map(sale => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sale.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.items.length} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${sale.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      sale.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : sale.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default POSView; 