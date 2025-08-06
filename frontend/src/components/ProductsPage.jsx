import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Upload, 
  Settings,
  Grid,
  List,
  Star,
  Tag,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  SkipBack,
  SkipForward,
  RefreshCw,
  Eye,
  EyeOff,
  BarChart3,
  TrendingUp,
  TrendingDown,
  X
} from 'lucide-react';
import { products as dummyProducts } from '../data/dummyData';

const ProductsPage = ({ onNavigate, user, currentStore }) => {
  const [search, setSearch] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Active');
  const [activeFilters, setActiveFilters] = useState(['Electronics', 'Appliances']);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    brand: 'all',
    category: 'all',
    status: 'all',
    priceRange: { min: 0, max: 1000 },
    stockStatus: 'all'
  });
  
  const [products, setProducts] = useState([]);

  // Fetch products from backend or use dummy data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8005/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || data);
        } else {
          // Use dummy data if backend is not available
          const formattedProducts = dummyProducts.map(product => ({
            ...product,
            price: `$${product.price.toFixed(2)}`,
            tags: [product.category],
            status: product.stock > 0 ? "active" : "inactive",
            offline: product.stock === 0,
            selected: false
          }));
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.log('Using dummy data - Backend not available');
        // Use dummy data if backend is not available
        const formattedProducts = dummyProducts.map(product => ({
          ...product,
          price: `$${product.price.toFixed(2)}`,
          tags: [product.category],
          status: product.stock > 0 ? "active" : "inactive",
          offline: product.stock === 0,
          selected: false
        }));
        setProducts(formattedProducts);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const removeFilter = (filterToRemove) => {
    setActiveFilters(activeFilters.filter(f => f !== filterToRemove));
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const getImageStyle = (product) => {
    let style = {};
    if (product.grayscale) {
      style.filter = 'grayscale(1)';
    }
    if (product.sepia) {
      style.filter = 'sepia(1) hue-rotate(60deg) saturate(0.8)';
    }
    if (product.brightness) {
      style.filter = `grayscale(1) brightness(${product.brightness})`;
    }
    return style;
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { status: 'out-of-stock', color: 'text-red-600', bg: 'bg-red-100' };
    if (stock < 10) return { status: 'low-stock', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (stock < 50) return { status: 'medium-stock', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'in-stock', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'text-green-600 bg-green-100',
      'inactive': 'text-red-600 bg-red-100',
      'draft': 'text-yellow-600 bg-yellow-100',
      'archived': 'text-gray-600 bg-gray-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="deal-n-done-card">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="deal-n-done-card">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product inventory and catalog</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('product-catalog')}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Package className="w-4 h-4" />
              <span>Catalog</span>
            </button>
            <button
              onClick={() => onNavigate('product-variants')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Tag className="w-4 h-4" />
              <span>Variants</span>
            </button>
            <button
              onClick={() => onNavigate('product-categories')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Categories</span>
            </button>
            <button
              onClick={() => onNavigate('product-images')}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <Package className="w-4 h-4" />
              <span>Images</span>
            </button>
            <button
              onClick={() => onNavigate('product-catalog')}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Search by product, variant, etc." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
            
            <select 
              value={filterOptions.brand}
              onChange={(e) => setFilterOptions(prev => ({ ...prev, brand: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Brands</option>
              <option value="brand1">Brand 1</option>
              <option value="brand2">Brand 2</option>
            </select>
            
            <select 
              value={filterOptions.category}
              onChange={(e) => setFilterOptions(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
            </select>
            
            <select 
              value={filterOptions.status}
              onChange={(e) => setFilterOptions(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {viewMode === 'table' ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
            {activeFilters.map((filter, index) => (
              <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                <span>{filter}</span>
                <button 
                  className="ml-2 hover:text-blue-600"
                  onClick={() => removeFilter(filter)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filterOptions.priceRange.min}
                  onChange={(e) => setFilterOptions(prev => ({ 
                    ...prev, 
                    priceRange: { ...prev.priceRange, min: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filterOptions.priceRange.max}
                  onChange={(e) => setFilterOptions(prev => ({ 
                    ...prev, 
                    priceRange: { ...prev.priceRange, max: parseFloat(e.target.value) || 1000 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
              <select
                value={filterOptions.stockStatus}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, stockStatus: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Stock</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="flex items-center space-x-2">
                <input 
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  type="text" 
                  value="Mar 7 - Mar 15, 2024"
                />
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Store Filter Buttons */}
      <div className="flex space-x-2 mb-6 text-sm overflow-x-auto pb-2">
        <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full whitespace-nowrap hover:bg-blue-200 transition-colors">
          All Stores
        </button>
        <button className="bg-gray-200 px-3 py-1 rounded-full flex items-center whitespace-nowrap hover:bg-gray-300 transition-colors">
          Low Stock <span className="bg-red-500 text-white text-xs rounded-full px-2 ml-2">44</span>
        </button>
        <button className="bg-gray-200 px-3 py-1 rounded-full whitespace-nowrap hover:bg-gray-300 transition-colors">
          Low New York Wall Street <span className="bg-gray-300 text-gray-600 text-xs rounded-full px-2 ml-2">8</span>
        </button>
        <button className="bg-gray-200 px-3 py-1 rounded-full whitespace-nowrap hover:bg-gray-300 transition-colors">
          Low Philadelphia Outlet 1 <span className="bg-gray-300 text-gray-600 text-xs rounded-full px-2 ml-2">6</span>
        </button>
        <button className="bg-gray-200 px-3 py-1 rounded-full whitespace-nowrap hover:bg-gray-300 transition-colors">
          Low LA Main Street <span className="bg-gray-300 text-gray-600 text-xs rounded-full px-2 ml-2">66</span>
        </button>
        <button className="bg-gray-200 px-3 py-1 rounded-full whitespace-nowrap hover:bg-gray-300 transition-colors">
          Low San Francisco <span className="bg-red-500 text-white text-xs rounded-full px-2 ml-2">10</span>
        </button>
        <button className="bg-gray-200 px-2 py-1 rounded-full hover:bg-gray-300 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">Dashboard &gt; Products</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex border border-gray-300 rounded-lg text-sm">
            <button 
              className={`px-4 py-1.5 rounded-l-lg border-r border-gray-300 transition-colors ${
                activeFilter === 'Active' 
                  ? 'bg-white text-blue-600 border-blue-600' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => setActiveFilter('Active')}
            >
              Active
            </button>
            <button 
              className={`px-4 py-1.5 border-r border-gray-300 transition-colors ${
                activeFilter === 'Inactive' 
                  ? 'bg-white text-blue-600 border-blue-600' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => setActiveFilter('Inactive')}
            >
              Inactive
            </button>
            <button 
              className={`px-4 py-1.5 rounded-r-lg transition-colors ${
                activeFilter === 'All' 
                  ? 'bg-white text-blue-600 border-blue-600' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => setActiveFilter('All')}
            >
              All
            </button>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            Actions <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="p-3 w-12">
                  <input 
                    className="rounded border-gray-300 focus:ring-blue-500" 
                    type="checkbox"
                    checked={selectedProducts.length === products.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="p-3 font-medium text-gray-600 whitespace-nowrap">Product</th>
                <th className="p-3 font-medium text-gray-600 whitespace-nowrap">Tags</th>
                <th className="p-3 font-medium text-gray-600 text-center whitespace-nowrap" colSpan="3">NYC OUTLET</th>
                <th className="p-3 font-medium text-gray-600 text-center whitespace-nowrap" colSpan="3">MANHATTAN 11</th>
                <th className="p-3 font-medium text-gray-600 whitespace-nowrap">Action</th>
              </tr>
              <tr className="bg-gray-100 text-xs text-gray-500">
                <th></th>
                <th></th>
                <th></th>
                <th className="font-normal p-2 text-center whitespace-nowrap">Var</th>
                <th className="font-normal p-2 text-center whitespace-nowrap">Price</th>
                <th className="font-normal p-2 text-center whitespace-nowrap">Stock</th>
                <th className="font-normal p-2 text-center whitespace-nowrap">Var</th>
                <th className="font-normal p-2 text-center whitespace-nowrap">Price</th>
                <th className="font-normal p-2 text-center whitespace-nowrap">Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts && filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${
                    product.selected ? 'border-l-4 border-blue-500' : ''
                  }`}>
                    <td className="p-3">
                      <input 
                        className="rounded border-gray-300 focus:ring-blue-500" 
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <img 
                          className="w-10 h-10 object-cover rounded-lg mr-3" 
                          src={product.image} 
                          alt={product.name}
                          style={getImageStyle(product)}
                        />
                        <div className="whitespace-nowrap">
                          <div className={`font-medium ${product.highlighted ? 'text-blue-600' : 'text-gray-900'}`}>
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                              {product.status}
                            </span>
                            {product.offline && <span className="text-red-500 ml-1">OFFLINE</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {product.tags && product.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-200 px-2 py-1 rounded-full text-xs mr-1">
                          {tag}
                        </span>
                      ))}
                    </td>
                    <td className="p-3 text-center">3</td>
                    <td className="p-3 text-center">{product.price}</td>
                    <td className={`p-3 text-center ${product.stock < 150 ? 'text-red-500' : ''}`}>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-3 text-center">3</td>
                    <td className="p-3 text-center">{product.price}</td>
                    <td className="p-3 text-center">--</td>
                    <td className="p-3 text-center text-gray-400">
                      <button className="p-1 hover:text-gray-600 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Footer */}
      <div className="flex justify-between items-center p-4 bg-white rounded-b-lg border-t border-gray-200 text-sm">
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Upload className="w-4 h-4" />
            <span>EXPORT LIST</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
            <Trash2 className="w-4 h-4" />
            <span>DELETE</span>
          </button>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <button className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 transition-colors" disabled>
            <SkipBack className="w-4 h-4" />
          </button>
          <button className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 transition-colors" disabled>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="px-3 py-1 rounded-md bg-blue-100 text-blue-600 font-medium">1</button>
          <button className="px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">2</button>
          <button className="px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">3</button>
          <button className="px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">4</button>
          <button className="px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">5</button>
          <span className="px-1">...</span>
          <button className="px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">10</button>
          <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>
          <span className="ml-4">1-10 of 250 items</span>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 