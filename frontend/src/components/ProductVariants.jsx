import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Check,
  AlertTriangle,
  Palette,
  Layers,
  Settings,
  Copy,
  Eye,
  EyeOff,
  Grid,
  List,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Ruler,
  Weight,
  Hash,
  Star,
  StarOff
} from 'lucide-react';

// Helper functions
const getStockStatus = (stock, minStock) => {
  if (stock === 0) return { status: 'out-of-stock', color: 'text-red-600', bg: 'bg-red-100' };
  if (stock <= minStock) return { status: 'low-stock', color: 'text-orange-600', bg: 'bg-orange-100' };
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

const ProductVariants = ({ onNavigate, user, currentStore }) => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    status: 'all',
    category: 'all',
    priceRange: { min: 0, max: 1000 },
    stockStatus: 'all'
  });
  const [editingVariant, setEditingVariant] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    fetchVariants();
  }, []);

  const fetchVariants = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockVariants = [
        {
          id: 1,
          name: 'Premium Cotton Shirt - Blue',
          parentProduct: 'Premium Cotton Shirt',
          sku: 'SHIRT-001-BLUE',
          price: 49.99,
          comparePrice: 69.99,
          cost: 25.00,
          stock: 45,
          minStock: 10,
          status: 'active',
          featured: true,
          images: ['/images/shirt-blue-1.jpg'],
          options: {
            color: 'Blue',
            size: 'M',
            material: 'Cotton'
          },
          dimensions: {
            weight: '0.5kg',
            length: '70cm',
            width: '50cm',
            height: '5cm'
          },
          barcode: '1234567890123',
          tags: ['premium', 'cotton', 'blue', 'medium']
        },
        {
          id: 2,
          name: 'Premium Cotton Shirt - Red',
          parentProduct: 'Premium Cotton Shirt',
          sku: 'SHIRT-001-RED',
          price: 49.99,
          comparePrice: 69.99,
          cost: 25.00,
          stock: 23,
          minStock: 10,
          status: 'active',
          featured: false,
          images: ['/images/shirt-red-1.jpg'],
          options: {
            color: 'Red',
            size: 'M',
            material: 'Cotton'
          },
          dimensions: {
            weight: '0.5kg',
            length: '70cm',
            width: '50cm',
            height: '5cm'
          },
          barcode: '1234567890124',
          tags: ['premium', 'cotton', 'red', 'medium']
        },
        {
          id: 3,
          name: 'Designer Jeans - Dark Blue',
          parentProduct: 'Designer Jeans',
          sku: 'JEANS-001-DARK',
          price: 89.99,
          comparePrice: 119.99,
          cost: 45.00,
          stock: 15,
          minStock: 5,
          status: 'active',
          featured: true,
          images: ['/images/jeans-dark-1.jpg'],
          options: {
            color: 'Dark Blue',
            size: '32',
            material: 'Denim'
          },
          dimensions: {
            weight: '0.8kg',
            length: '100cm',
            width: '40cm',
            height: '3cm'
          },
          barcode: '1234567890125',
          tags: ['denim', 'premium', 'dark-blue', '32']
        }
      ];
      
      setVariants(mockVariants);
    } catch (error) {
      console.error('Error fetching variants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVariants = variants.filter(variant => {
    const matchesSearch = variant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variant.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterOptions.status === 'all' || variant.status === filterOptions.status;
    const matchesPrice = variant.price >= filterOptions.priceRange.min && 
                        variant.price <= filterOptions.priceRange.max;
    
    const matchesStock = filterOptions.stockStatus === 'all' || 
                        (filterOptions.stockStatus === 'in-stock' && variant.stock > variant.minStock) ||
                        (filterOptions.stockStatus === 'low-stock' && variant.stock <= variant.minStock && variant.stock > 0) ||
                        (filterOptions.stockStatus === 'out-of-stock' && variant.stock === 0);
    
    return matchesSearch && matchesStatus && matchesPrice && matchesStock;
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedVariants(filteredVariants.map(v => v.id));
    } else {
      setSelectedVariants([]);
    }
  };

  const handleSelectVariant = (variantId, checked) => {
    if (checked) {
      setSelectedVariants([...selectedVariants, variantId]);
    } else {
      setSelectedVariants(selectedVariants.filter(id => id !== variantId));
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'activate':
        console.log('Activate variants:', selectedVariants);
        break;
      case 'deactivate':
        console.log('Deactivate variants:', selectedVariants);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete the selected variants?')) {
          console.log('Delete variants:', selectedVariants);
        }
        break;
      case 'export':
        console.log('Export variants:', selectedVariants);
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Variants</h1>
            <p className="text-gray-600">Manage product variants, options, and combinations</p>
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
              onClick={() => onNavigate('product-categories')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Layers className="w-4 h-4" />
              <span>Categories</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Variant</span>
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
                type="text"
                placeholder="Search variants by name, SKU, or options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterOptions.status}
              onChange={(e) => setFilterOptions(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
            
            <select
              value={filterOptions.stockStatus}
              onChange={(e) => setFilterOptions(prev => ({ ...prev, stockStatus: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Stock</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
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
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </button>
            
            <button
              onClick={fetchVariants}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filterOptions.category}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="clothing">Clothing</option>
                <option value="electronics">Electronics</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Variants</option>
                <option value="featured">Featured Only</option>
                <option value="non-featured">Non-Featured</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedVariants.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedVariants.length} variant(s) selected
              </span>
              <button
                onClick={() => setSelectedVariants([])}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear selection
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Export
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Variants Grid/List */}
      <div className="bg-white rounded-xl shadow-lg">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {filteredVariants.map((variant) => (
              <VariantCard
                key={variant.id}
                variant={variant}
                selected={selectedVariants.includes(variant.id)}
                onSelect={(checked) => handleSelectVariant(variant.id, checked)}
                onEdit={() => setEditingVariant(variant)}
                onDelete={() => {
                  if (window.confirm('Are you sure you want to delete this variant?')) {
                    console.log('Delete variant:', variant.id);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedVariants.length === filteredVariants.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Options
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVariants.map((variant) => (
                  <VariantRow
                    key={variant.id}
                    variant={variant}
                    selected={selectedVariants.includes(variant.id)}
                    onSelect={(checked) => handleSelectVariant(variant.id, checked)}
                    onEdit={() => setEditingVariant(variant)}
                    onDelete={() => {
                      if (window.confirm('Are you sure you want to delete this variant?')) {
                        console.log('Delete variant:', variant.id);
                      }
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{variants.length}</p>
            <p className="text-sm text-gray-600">Total Variants</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {variants.filter(v => v.status === 'active').length}
            </p>
            <p className="text-sm text-gray-600">Active Variants</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {variants.filter(v => v.stock <= v.minStock && v.stock > 0).length}
            </p>
            <p className="text-sm text-gray-600">Low Stock</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {variants.filter(v => v.stock === 0).length}
            </p>
            <p className="text-sm text-gray-600">Out of Stock</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {variants.filter(v => v.featured).length}
            </p>
            <p className="text-sm text-gray-600">Featured</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Variant Card Component
const VariantCard = ({ variant, selected, onSelect, onEdit, onDelete }) => {
  const stockStatus = getStockStatus(variant.stock, variant.minStock);
  
  return (
    <div className={`bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
      selected ? 'ring-2 ring-blue-500' : ''
    }`}>
      <div className="relative">
        <div className="aspect-w-1 aspect-h-1 bg-gray-200">
          <img
            src={variant.images[0] || '/placeholder-product.jpg'}
            alt={variant.name}
            className="w-full h-48 object-cover"
          />
        </div>
        
        <div className="absolute top-2 left-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-gray-300 focus:ring-blue-500"
          />
        </div>
        
        {variant.featured && (
          <div className="absolute top-2 right-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
          </div>
        )}
        
        <div className="absolute bottom-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
            {stockStatus.status}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{variant.name}</h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-blue-600"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">{variant.parentProduct}</p>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">${variant.price}</span>
            {variant.comparePrice > variant.price && (
              <span className="text-sm text-gray-500 line-through">${variant.comparePrice}</span>
            )}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(variant.status)}`}>
            {variant.status}
          </span>
        </div>
        
        <div className="mb-3">
          <div className="text-sm text-gray-500 mb-1">Options:</div>
          <div className="flex flex-wrap gap-1">
            {Object.entries(variant.options).map(([key, value]) => (
              <span key={key} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                {key}: {value}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>SKU: {variant.sku}</span>
          <span>Stock: {variant.stock}</span>
        </div>
      </div>
    </div>
  );
};

// Variant Row Component
const VariantRow = ({ variant, selected, onSelect, onEdit, onDelete }) => {
  const stockStatus = getStockStatus(variant.stock, variant.minStock);
  
  return (
    <tr className={selected ? 'bg-blue-50' : ''}>
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
          className="rounded border-gray-300 focus:ring-blue-500"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img
            src={variant.images[0] || '/placeholder-product.jpg'}
            alt={variant.name}
            className="w-10 h-10 rounded object-cover mr-3"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">{variant.name}</div>
            <div className="text-sm text-gray-500">{variant.parentProduct}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {variant.sku}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-wrap gap-1">
          {Object.entries(variant.options).map(([key, value]) => (
            <span key={key} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
              {key}: {value}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">${variant.price}</div>
        {variant.comparePrice > variant.price && (
          <div className="text-sm text-gray-500 line-through">${variant.comparePrice}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
            {stockStatus.status}
          </span>
          <span className="ml-2 text-sm text-gray-900">{variant.stock}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(variant.status)}`}>
          {variant.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-900"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductVariants; 