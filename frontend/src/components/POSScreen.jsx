import React, { useState, useEffect } from 'react';
import axios from 'axios';

const POSScreen = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  const [saleResult, setSaleResult] = useState(null);

  // Sample products data
  const products = [
    {
      id: 'shirt_001',
      name: 'Classic White Dress Shirt',
      price: 25.00,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=200&fit=crop',
      category: 'Dress Shirts'
    },
    {
      id: 'shirt_002',
      name: 'Blue Oxford Shirt',
      price: 25.00,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop',
      category: 'Dress Shirts'
    },
    {
      id: 'shirt_003',
      name: 'Black Formal Shirt',
      price: 25.00,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=200&h=200&fit=crop',
      category: 'Dress Shirts'
    }
  ];

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

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Handle sale submission
  const handleSale = async () => {
    if (!selectedProduct) return;

    try {
      const saleData = {
        items: [{
          id: selectedProduct.id,
          quantity: quantity
        }]
      };

      const response = await axios.post('http://localhost:8000/sales', saleData);
      
      if (response.data.status === 'success') {
        setSaleResult({
          type: 'success',
          message: `Sale successful! Total: $${response.data.total}`,
          data: response.data
        });
        
        // Reset form
        setSelectedProduct(null);
        setQuantity(1);
      } else {
        setSaleResult({
          type: 'error',
          message: response.data.message
        });
      }
    } catch (error) {
      setSaleResult({
        type: 'error',
        message: 'Failed to process sale. Please check server connection.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">DealNDone POS</h1>
              <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                apiStatus === 'online' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {apiStatus === 'online' ? '🟢 Online' : '🔴 Offline'}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Stock: {selectedProduct ? selectedProduct.stock : 'Select Product'} Shirts
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Product Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Selection</h2>
                
                {/* Search Bar */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search by product name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className={`cursor-pointer border-2 rounded-lg p-4 transition-all hover:shadow-md ${
                        selectedProduct?.id === product.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                      <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">SKU: {product.id}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">${product.price}</span>
                        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow sticky top-8">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Checkout</h2>
                
                {selectedProduct ? (
                  <>
                    {/* Selected Product */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-3">
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          className="w-16 h-16 object-cover rounded-md mr-3"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{selectedProduct.name}</h3>
                          <p className="text-sm text-gray-500">SKU: {selectedProduct.id}</p>
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Quantity:</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium">{quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={quantity >= selectedProduct.stock}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      {/* Total */}
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Total:</span>
                          <span className="text-2xl font-bold text-green-600">
                            ${(selectedProduct.price * quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleSale}
                      disabled={apiStatus === 'offline'}
                      className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Sell Shirt - ${selectedProduct.price}
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">👔</div>
                    <p>Select a product to begin</p>
                  </div>
                )}

                {/* Sale Result */}
                {saleResult && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    saleResult.type === 'success' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <div className="flex items-center">
                      <span className="text-lg mr-2">
                        {saleResult.type === 'success' ? '✅' : '❌'}
                      </span>
                      <span className="font-medium">{saleResult.message}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSScreen; 