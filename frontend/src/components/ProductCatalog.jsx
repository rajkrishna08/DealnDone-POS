import React, { useState } from 'react';

const ProductCatalog = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Dummy data for product catalog
  const products = [
    {
      id: 1,
      name: 'Classic White Shirt',
      category: 'Men\'s Clothing',
      sku: 'MENS-WHITE-001',
      price: 25.00,
      cost: 15.00,
      stock: 45,
      status: 'Active',
      image: 'https://via.placeholder.com/100',
      description: 'Premium cotton classic white shirt for men'
    },
    {
      id: 2,
      name: 'Blue Oxford Shirt',
      category: 'Men\'s Clothing',
      sku: 'MENS-BLUE-002',
      price: 30.00,
      cost: 18.00,
      stock: 32,
      status: 'Active',
      image: 'https://via.placeholder.com/100',
      description: 'Comfortable blue oxford shirt for casual wear'
    },
    {
      id: 3,
      name: 'Black Formal Shirt',
      category: 'Men\'s Clothing',
      sku: 'MENS-BLACK-003',
      price: 35.00,
      cost: 22.00,
      stock: 28,
      status: 'Active',
      image: 'https://via.placeholder.com/100',
      description: 'Elegant black formal shirt for professional settings'
    },
    {
      id: 4,
      name: 'Denim Jeans',
      category: 'Men\'s Clothing',
      sku: 'MENS-DENIM-004',
      price: 45.00,
      cost: 28.00,
      stock: 25,
      status: 'Active',
      image: 'https://via.placeholder.com/100',
      description: 'Classic denim jeans with perfect fit'
    },
    {
      id: 5,
      name: 'Leather Belt',
      category: 'Accessories',
      sku: 'ACC-LEATHER-005',
      price: 20.00,
      cost: 12.00,
      stock: 0,
      status: 'Out of Stock',
      image: 'https://via.placeholder.com/100',
      description: 'Genuine leather belt with classic buckle'
    },
    {
      id: 6,
      name: 'Silk Scarf',
      category: 'Accessories',
      sku: 'ACC-SILK-006',
      price: 15.00,
      cost: 8.00,
      stock: 15,
      status: 'Active',
      image: 'https://via.placeholder.com/100',
      description: 'Elegant silk scarf for women'
    }
  ];

  const categories = ['All', 'Men\'s Clothing', 'Women\'s Clothing', 'Accessories', 'Footwear', 'Electronics'];

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    sku: '',
    price: '',
    cost: '',
    stock: '',
    description: ''
  });

  const handleAddProduct = () => {
    const product = {
      id: Date.now(),
      ...newProduct,
      price: parseFloat(newProduct.price),
      cost: parseFloat(newProduct.cost),
      stock: parseInt(newProduct.stock),
      status: 'Active',
      image: 'https://via.placeholder.com/100'
    };
    console.log('New product added:', product);
    setNewProduct({ name: '', category: '', sku: '', price: '', cost: '', stock: '', description: '' });
    setShowAddProduct(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'all' || product.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Product Catalog</h1>
          <div className="text-sm text-gray-500">
            Manage your product catalog and inventory
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setShowAddProduct(true)}
            className="deal-n-done-btn-primary"
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{product.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-medium">{product.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-green-600">${product.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className={`font-medium ${product.stock === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-xs font-medium hover:bg-blue-700 transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-xs font-medium hover:bg-gray-200 transition-colors">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Product</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select category</option>
                    {categories.filter(cat => cat !== 'All').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter SKU"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
                    <input
                      type="number"
                      value={newProduct.cost}
                      onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Initial Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="3"
                    placeholder="Enter product description"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="deal-n-done-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="deal-n-done-btn-primary"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog; 