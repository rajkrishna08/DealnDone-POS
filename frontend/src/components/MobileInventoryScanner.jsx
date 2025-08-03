import React, { useState, useRef, useMemo } from 'react';

const MobileInventoryScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [scanMode, setScanMode] = useState('barcode'); // 'barcode' or 'qr'
  const [cameraPermission, setCameraPermission] = useState(false);
  const [error, setError] = useState('');

  // Memoize products to prevent unnecessary re-renders
  const memoizedProducts = useMemo(() => [
    { id: 1, name: 'iPhone 15 Pro', barcode: '123456789', price: 999.99, stock: 25, category: 'Electronics' },
    { id: 2, name: 'Samsung Galaxy S24', barcode: '987654321', price: 899.99, stock: 18, category: 'Electronics' },
    { id: 3, name: 'MacBook Air M2', barcode: '456789123', price: 1199.99, stock: 12, category: 'Computers' },
    { id: 4, name: 'Nike Air Max', barcode: '789123456', price: 129.99, stock: 45, category: 'Footwear' },
    { id: 5, name: 'Sony WH-1000XM5', barcode: '321654987', price: 349.99, stock: 30, category: 'Audio' }
  ], []);

  const videoRef = useRef(null);

  // Simulate barcode scanning
  const simulateScan = () => {
    setIsScanning(true);
    setError('');
    
    // Simulate scanning delay
    setTimeout(() => {
      const randomProduct = memoizedProducts[Math.floor(Math.random() * memoizedProducts.length)];
      const scannedCode = randomProduct.barcode;
      
      setScanResult(randomProduct);
      
      // Add to scan history
      setScanHistory(prev => [{
        id: Date.now(),
        code: scannedCode,
        product: randomProduct.name,
        timestamp: new Date().toLocaleString(),
        success: true
      }, ...prev.slice(0, 9)]);
      
      setIsScanning(false);
    }, 2000);
  };

  // Handle manual code entry
  const handleManualEntry = (code) => {
    const product = memoizedProducts.find(p => p.barcode === code);
    
    if (product) {
      setScanResult(product);
      setError('');
      
      // Add to scan history
      setScanHistory(prev => [{
        id: Date.now(),
        code: code,
        product: product.name,
        timestamp: new Date().toLocaleString(),
        success: true
      }, ...prev.slice(0, 9)]);
    } else {
      setError('Product not found');
      setScanResult(null);
    }
  };

  // Request camera permission
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Camera permission denied');
      setCameraPermission(false);
    }
  };

  // Handle scan history item click
  const handleHistoryItemClick = (item) => {
    if (item.success) {
      const product = memoizedProducts.find(p => p.barcode === item.code);
      if (product) {
        setSelectedProduct(product);
        setShowProductDetails(true);
      }
    }
  };

  // Clear scan results
  const clearResults = () => {
    setScanResult(null);
    setError('');
  };

  // Update stock quantity
  const updateStock = (productId, newQuantity) => {
    // In a real app, this would update the backend
    console.log(`Updating stock for product ${productId} to ${newQuantity}`);
    setShowProductDetails(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Mobile Inventory Scanner</h1>
          <div className="text-sm text-gray-500">
            Scan barcodes and manage inventory on the go
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={clearResults}
            className="deal-n-done-btn-secondary"
          >
            Clear Results
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner Section */}
          <div className="space-y-6">
            {/* Scan Controls */}
            <div className="deal-n-done-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scanner Controls</h3>
              
              <div className="space-y-4">
                {/* Scan Mode Toggle */}
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Scan Mode:</label>
                  <div className="flex bg-gray-200 rounded-lg p-1">
                    <button
                      onClick={() => setScanMode('barcode')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        scanMode === 'barcode'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Barcode
                    </button>
                    <button
                      onClick={() => setScanMode('qr')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        scanMode === 'qr'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      QR Code
                    </button>
                  </div>
                </div>

                {/* Camera Permission */}
                {!cameraPermission && (
                  <button
                    onClick={requestCameraPermission}
                    className="deal-n-done-btn-primary w-full"
                  >
                    Enable Camera
                  </button>
                )}

                {/* Scan Button */}
                <button
                  onClick={simulateScan}
                  disabled={isScanning}
                  className={`deal-n-done-btn-primary w-full ${
                    isScanning ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isScanning ? 'Scanning...' : `Scan ${scanMode === 'barcode' ? 'Barcode' : 'QR Code'}`}
                </button>

                {/* Manual Entry */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Manual Entry
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter barcode manually"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleManualEntry(e.target.value);
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Enter barcode manually"]');
                        if (input && input.value) {
                          handleManualEntry(input.value);
                        }
                      }}
                      className="deal-n-done-btn-secondary"
                    >
                      Enter
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Scan Results */}
            {scanResult && (
              <div className="deal-n-done-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan Results</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={scanResult.image}
                      alt={scanResult.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{scanResult.name}</h4>
                      <p className="text-sm text-gray-500">Barcode: {scanResult.barcode}</p>
                      <p className="text-sm text-gray-500">Category: {scanResult.category}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="text-lg font-bold text-blue-600">${scanResult.price}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-500">Stock</p>
                      <p className="text-lg font-bold text-green-600">{scanResult.stock}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(scanResult);
                        setShowProductDetails(true);
                      }}
                      className="deal-n-done-btn-primary flex-1"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        // In a real app, this would update stock
                        console.log('Updating stock for', scanResult.name);
                      }}
                      className="deal-n-done-btn-secondary flex-1"
                    >
                      Update Stock
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="deal-n-done-card bg-red-50 border-red-200">
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">⚠️</span>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Scan History */}
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan History</h3>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {scanHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No scan history yet</p>
              ) : (
                scanHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleHistoryItemClick(item)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      item.success
                        ? 'border-green-200 bg-green-50 hover:bg-green-100'
                        : 'border-red-200 bg-red-50 hover:bg-red-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.product}</p>
                        <p className="text-sm text-gray-500">{item.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{item.timestamp}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.success
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.success ? 'Success' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {showProductDetails && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
              <button
                onClick={() => setShowProductDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              
              <div>
                <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
                <p className="text-sm text-gray-500">{selectedProduct.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium text-gray-900">${selectedProduct.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock</p>
                  <p className="font-medium text-gray-900">{selectedProduct.stock}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">{selectedProduct.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Barcode</p>
                  <p className="font-medium text-gray-900">{selectedProduct.barcode}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Update Stock Quantity
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    defaultValue={selectedProduct.stock}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => updateStock(selectedProduct.id, selectedProduct.stock)}
                    className="deal-n-done-btn-primary"
                  >
                    Update
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

export default MobileInventoryScanner; 