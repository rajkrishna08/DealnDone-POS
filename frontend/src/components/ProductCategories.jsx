import React, { useState } from 'react';

const ProductCategories = () => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Dummy data for product categories
  const categories = [
    {
      id: 1,
      name: 'Men\'s Clothing',
      description: 'All men\'s clothing items including shirts, pants, and formal wear',
      productCount: 45,
      status: 'Active',
      image: 'https://via.placeholder.com/100',
      parentCategory: null
    },
    {
      id: 2,
      name: 'Women\'s Clothing',
      description: 'Women\'s fashion items including dresses, tops, and skirts',
      productCount: 38,
      status: 'Active',
      image: 'https://via.placeholder.com/100',
      parentCategory: null
    },
    {
      id: 3,
      name: 'Accessories',
      description: 'Fashion accessories including belts, scarves, and jewelry',
      productCount: 22,
      status: 'Active',
      image: 'https://via.placeholder.com/100',
      parentCategory: null
    },
    {
      id: 4,
      name: 'Footwear',
      description: 'Shoes, boots, and other footwear for men and women',
      productCount: 15,
      status: 'Active',
      image: 'https://via.placeholder.com/100',
      parentCategory: null
    },
    {
      id: 5,
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      productCount: 8,
      status: 'Active',
      image: 'https://via.placeholder.com/100',
      parentCategory: null
    },
    {
      id: 6,
      name: 'Formal Shirts',
      description: 'Professional and formal shirts for men',
      productCount: 12,
      status: 'Active',
      image: 'https://via.placeholder.com/100',
      parentCategory: 'Men\'s Clothing'
    },
    {
      id: 7,
      name: 'Casual Shirts',
      description: 'Casual and everyday shirts for men',
      productCount: 18,
      status: 'Active',
      image: 'https://via.placeholder.com/100',
      parentCategory: 'Men\'s Clothing'
    }
  ];

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parentCategory: '',
    status: 'Active'
  });

  const handleAddCategory = () => {
    const category = {
      id: Date.now(),
      ...newCategory,
      productCount: 0,
      image: 'https://via.placeholder.com/100'
    };
    console.log('New category added:', category);
    setNewCategory({ name: '', description: '', parentCategory: '', status: 'Active' });
    setShowAddCategory(false);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description,
      parentCategory: category.parentCategory || '',
      status: category.status
    });
    setShowAddCategory(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const parentCategories = categories.filter(cat => !cat.parentCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Product Categories</h1>
          <div className="text-sm text-gray-500">
            Organize your products with categories and subcategories
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setShowAddCategory(true)}
            className="deal-n-done-btn-primary"
          >
            Add Category
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(category.status)}`}>
                    {category.status}
                  </span>
                </div>
                
                {category.parentCategory && (
                  <p className="text-xs text-blue-600 mb-2">Subcategory of: {category.parentCategory}</p>
                )}
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{category.productCount} products</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditCategory(category)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-xs font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Category Hierarchy */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Hierarchy</h3>
          <div className="space-y-3">
            {parentCategories.map((parent) => (
              <div key={parent.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{parent.name}</h4>
                  <span className="text-sm text-gray-500">{parent.productCount} products</span>
                </div>
                <div className="ml-6 space-y-2">
                  {categories
                    .filter(cat => cat.parentCategory === parent.name)
                    .map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center justify-between py-2 border-l-2 border-gray-200 pl-4">
                        <span className="text-sm text-gray-700">{subcategory.name}</span>
                        <span className="text-xs text-gray-500">{subcategory.productCount} products</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Category Modal */}
        {showAddCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter category name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="3"
                    placeholder="Enter category description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent Category (Optional)</label>
                  <select
                    value={newCategory.parentCategory}
                    onChange={(e) => setNewCategory({...newCategory, parentCategory: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">No parent (Main category)</option>
                    {parentCategories.map(category => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newCategory.status}
                    onChange={(e) => setNewCategory({...newCategory, status: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddCategory(false);
                    setEditingCategory(null);
                    setNewCategory({ name: '', description: '', parentCategory: '', status: 'Active' });
                  }}
                  className="deal-n-done-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="deal-n-done-btn-primary"
                >
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCategories; 