import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Folder,
  FolderOpen,
  Package,
  Tag,
  BarChart3,
  Settings,
  MoreHorizontal,
  Copy,
  Share2,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Star,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Helper functions
const getStatusColor = (status) => {
  const colors = {
    'active': 'text-green-600 bg-green-100',
    'inactive': 'text-red-600 bg-red-100',
    'draft': 'text-yellow-600 bg-yellow-100',
    'archived': 'text-gray-600 bg-gray-100'
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
};

const ProductCategories = ({ onNavigate, user, currentStore }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('tree');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        // Simulate categories data
        setCategories([
          {
            id: 1,
            name: 'Clothing',
            slug: 'clothing',
            description: 'All clothing and apparel items',
            parent_id: null,
            level: 0,
            sort_order: 1,
            status: 'active',
            image: '/images/categories/clothing.jpg',
            product_count: 156,
            revenue: 45000,
            featured: true,
            seo_title: 'Clothing & Apparel',
            seo_description: 'Shop the latest fashion trends',
            created_at: '2024-01-15',
            updated_at: '2024-01-20',
            children: [
              {
                id: 2,
                name: 'Shirts',
                slug: 'shirts',
                description: 'T-shirts, polo shirts, and formal shirts',
                parent_id: 1,
                level: 1,
                sort_order: 1,
                status: 'active',
                image: '/images/categories/shirts.jpg',
                product_count: 45,
                revenue: 12000,
                featured: false,
                seo_title: 'Shirts Collection',
                seo_description: 'Comfortable and stylish shirts',
                created_at: '2024-01-16',
                updated_at: '2024-01-18',
                children: []
              },
              {
                id: 3,
                name: 'Pants',
                slug: 'pants',
                description: 'Jeans, trousers, and casual pants',
                parent_id: 1,
                level: 1,
                sort_order: 2,
                status: 'active',
                image: '/images/categories/pants.jpg',
                product_count: 38,
                revenue: 18000,
                featured: true,
                seo_title: 'Pants & Trousers',
                seo_description: 'Quality pants for every occasion',
                created_at: '2024-01-16',
                updated_at: '2024-01-19',
                children: []
              }
            ]
          },
          {
            id: 4,
            name: 'Accessories',
            slug: 'accessories',
            description: 'Jewelry, watches, and fashion accessories',
            parent_id: null,
            level: 0,
            sort_order: 2,
            status: 'active',
            image: '/images/categories/accessories.jpg',
            product_count: 89,
            revenue: 32000,
            featured: true,
            seo_title: 'Fashion Accessories',
            seo_description: 'Complete your look with our accessories',
            created_at: '2024-01-15',
            updated_at: '2024-01-20',
            children: [
              {
                id: 5,
                name: 'Watches',
                slug: 'watches',
                description: 'Luxury and casual timepieces',
                parent_id: 4,
                level: 1,
                sort_order: 1,
                status: 'active',
                image: '/images/categories/watches.jpg',
                product_count: 23,
                revenue: 15000,
                featured: true,
                seo_title: 'Watches Collection',
                seo_description: 'Premium watches for every style',
                created_at: '2024-01-16',
                updated_at: '2024-01-17',
                children: []
              }
            ]
          },
          {
            id: 6,
            name: 'Footwear',
            slug: 'footwear',
            description: 'Shoes, boots, and sandals',
            parent_id: null,
            level: 0,
            sort_order: 3,
            status: 'active',
            image: '/images/categories/footwear.jpg',
            product_count: 67,
            revenue: 28000,
            featured: false,
            seo_title: 'Footwear Collection',
            seo_description: 'Comfortable and stylish footwear',
            created_at: '2024-01-15',
            updated_at: '2024-01-18',
            children: []
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpanded = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };



  const handleAddCategory = (categoryData) => {
    const newCategory = {
      id: Date.now(),
      ...categoryData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      children: []
    };
    setCategories(prev => [...prev, newCategory]);
    setShowAddModal(false);
  };

  const handleEditCategory = (categoryData) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...categoryData, updated_at: new Date().toISOString() }
          : cat
      )
    );
    setShowEditModal(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all subcategories.')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
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
            <h1 className="text-3xl font-bold text-gray-900">Product Categories</h1>
            <p className="text-gray-600">Organize your products with categories and subcategories</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('product-catalog')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setViewMode(viewMode === 'tree' ? 'grid' : 'tree')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {viewMode === 'tree' ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
            </button>
            
            <button
              onClick={fetchCategories}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Content */}
      <div className="bg-white rounded-xl shadow-lg">
        {viewMode === 'tree' ? (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Hierarchy</h2>
            <div className="space-y-2">
              {filteredCategories.map((category) => (
                <CategoryTreeItem
                  key={category.id}
                  category={category}
                  level={0}
                  expandedCategories={expandedCategories}
                  onToggleExpanded={toggleExpanded}
                  onSelect={setSelectedCategory}
                  onEdit={(cat) => {
                    setEditingCategory(cat);
                    setShowEditModal(true);
                  }}
                  onDelete={handleDeleteCategory}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Grid</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onSelect={setSelectedCategory}
                  onEdit={(cat) => {
                    setEditingCategory(cat);
                    setShowEditModal(true);
                  }}
                  onDelete={handleDeleteCategory}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Category Details */}
      {selectedCategory && (
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="ml-2 text-sm font-medium">{selectedCategory.name}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Slug:</span>
                  <span className="ml-2 text-sm font-medium">{selectedCategory.slug}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Description:</span>
                  <span className="ml-2 text-sm font-medium">{selectedCategory.description}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCategory.status)}`}>
                    {selectedCategory.status}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Statistics</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Products:</span>
                  <span className="ml-2 text-sm font-medium">{selectedCategory.product_count}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Revenue:</span>
                  <span className="ml-2 text-sm font-medium">${selectedCategory.revenue.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Subcategories:</span>
                  <span className="ml-2 text-sm font-medium">{selectedCategory.children?.length || 0}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Featured:</span>
                  <span className="ml-2 text-sm font-medium">{selectedCategory.featured ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <CategoryModal
          mode="add"
          onSave={handleAddCategory}
          onCancel={() => setShowAddModal(false)}
          parentCategories={categories}
        />
      )}

      {/* Edit Category Modal */}
      {showEditModal && editingCategory && (
        <CategoryModal
          mode="edit"
          category={editingCategory}
          onSave={handleEditCategory}
          onCancel={() => {
            setShowEditModal(false);
            setEditingCategory(null);
          }}
          parentCategories={categories}
        />
      )}
    </div>
  );
};

// Category Tree Item Component
const CategoryTreeItem = ({ category, level, expandedCategories, onToggleExpanded, onSelect, onEdit, onDelete }) => {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedCategories.has(category.id);
  const indent = level * 20;

  return (
    <div>
      <div 
        className={`flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer ${
          level > 0 ? 'ml-6' : ''
        }`}
        style={{ paddingLeft: `${indent + 12}px` }}
      >
        {hasChildren && (
          <button
            onClick={() => onToggleExpanded(category.id)}
            className="p-1 mr-2 hover:bg-gray-200 rounded"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
        
        <div className="flex items-center flex-1" onClick={() => onSelect(category)}>
          {hasChildren ? (
            isExpanded ? <FolderOpen className="w-5 h-5 text-blue-500 mr-2" /> : <Folder className="w-5 h-5 text-gray-500 mr-2" />
          ) : (
            <Package className="w-5 h-5 text-gray-400 mr-2" />
          )}
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{category.name}</span>
              {category.featured && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(category.status)}`}>
                {category.status}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {category.product_count} products • ${category.revenue.toLocaleString()} revenue
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(category);
            }}
            className="p-1 text-gray-400 hover:text-blue-600"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(category.id);
            }}
            className="p-1 text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div>
          {category.children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              level={level + 1}
              expandedCategories={expandedCategories}
              onToggleExpanded={onToggleExpanded}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Category Card Component
const CategoryCard = ({ category, onSelect, onEdit, onDelete }) => {
  return (
    <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          <img
            src={category.image || '/placeholder-category.jpg'}
            alt={category.name}
            className="w-full h-32 object-cover"
          />
        </div>
        
        {category.featured && (
          <div className="absolute top-2 right-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(category)}
              className="p-1 text-gray-400 hover:text-blue-600"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(category.id)}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{category.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{category.product_count} products</span>
            <span>${category.revenue.toLocaleString()}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(category.status)}`}>
            {category.status}
          </span>
        </div>
        
        <button
          onClick={() => onSelect(category)}
          className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// Category Modal Component
const CategoryModal = ({ mode, category, onSave, onCancel, parentCategories }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    parent_id: category?.parent_id || null,
    status: category?.status || 'active',
    featured: category?.featured || false,
    seo_title: category?.seo_title || '',
    seo_description: category?.seo_description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'add' ? 'Add New Category' : 'Edit Category'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parent Category</label>
              <select
                value={formData.parent_id || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, parent_id: e.target.value || null }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No Parent</option>
                {parentCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Category</span>
            </label>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
                <input
                  type="text"
                  value={formData.seo_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
                <textarea
                  value={formData.seo_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {mode === 'add' ? 'Create Category' : 'Update Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCategories; 