import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Edit, 
  Search,
  Filter,
  Grid,
  List,
  Plus,
  X,
  Star,
  RefreshCw,
  Eye
} from 'lucide-react';

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getStatusColor = (status) => {
  const colors = {
    'active': 'text-green-600 bg-green-100',
    'inactive': 'text-red-600 bg-red-100',
    'processing': 'text-yellow-600 bg-yellow-100',
    'error': 'text-red-600 bg-red-100'
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
};

const ProductImages = ({ onNavigate, user, currentStore }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const mockImages = [
        {
          id: 1,
          name: 'premium-shirt-blue.jpg',
          url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
          alt_text: 'Premium Blue Cotton Shirt',
          product_name: 'Premium Cotton Shirt',
          size: 245760,
          dimensions: { width: 1200, height: 800 },
          status: 'active',
          featured: true,
          created_at: '2024-01-15T10:30:00Z',
          tags: ['premium', 'blue', 'cotton']
        },
        {
          id: 2,
          name: 'designer-jeans-black.jpg',
          url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
          alt_text: 'Designer Black Jeans',
          product_name: 'Designer Jeans',
          size: 312320,
          dimensions: { width: 1000, height: 1200 },
          status: 'active',
          featured: false,
          created_at: '2024-01-16T09:15:00Z',
          tags: ['designer', 'black', 'jeans']
        },
        {
          id: 3,
          name: 'luxury-watch-gold.jpg',
          url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop',
          alt_text: 'Luxury Gold Watch',
          product_name: 'Limited Edition Watch',
          size: 512000,
          dimensions: { width: 1500, height: 1000 },
          status: 'active',
          featured: true,
          created_at: '2024-01-17T11:45:00Z',
          tags: ['luxury', 'gold', 'watch']
        },
        {
          id: 4,
          name: 'sneakers-white.jpg',
          url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
          alt_text: 'White Sneakers',
          product_name: 'Classic White Sneakers',
          size: 189440,
          dimensions: { width: 800, height: 600 },
          status: 'active',
          featured: false,
          created_at: '2024-01-18T08:20:00Z',
          tags: ['sneakers', 'white', 'casual']
        },
        {
          id: 5,
          name: 'leather-bag-brown.jpg',
          url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
          alt_text: 'Brown Leather Bag',
          product_name: 'Premium Leather Bag',
          size: 298240,
          dimensions: { width: 900, height: 700 },
          status: 'active',
          featured: true,
          created_at: '2024-01-19T14:30:00Z',
          tags: ['leather', 'brown', 'bag', 'premium']
        }
      ];
      
      setImages(mockImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.alt_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || image.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const sortedImages = [...filteredImages].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'size':
        return b.size - a.size;
      case 'product':
        return a.product_name.localeCompare(b.product_name);
      default:
        return 0;
    }
  });

  const handleFileUpload = (files) => {
    const newImages = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      url: URL.createObjectURL(file),
      alt_text: file.name.replace(/\.[^/.]+$/, ''),
      product_name: 'Unassigned',
      size: file.size,
      dimensions: { width: 0, height: 0 },
      status: 'pending',
      featured: false,
      created_at: new Date().toISOString(),
      tags: []
    }));

    setImages(prev => [...prev, ...newImages]);
    setShowUploadModal(false);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(0);
        setImages(prev => 
          prev.map(img => 
            img.status === 'pending' ? { ...img, status: 'active' } : img
          )
        );
      }
    }, 200);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleImageEdit = (imageData) => {
    setImages(prev => 
      prev.map(img => 
        img.id === editingImage.id 
          ? { ...img, ...imageData, updated_at: new Date().toISOString() }
          : img
      )
    );
    setShowEditModal(false);
    setEditingImage(null);
  };

  const handleImageDelete = (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setImages(prev => prev.filter(img => img.id !== imageId));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedImages.length === 0) return;
    
    switch (action) {
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedImages.length} images?`)) {
          setImages(prev => prev.filter(img => !selectedImages.includes(img.id)));
          setSelectedImages([]);
        }
        break;
      case 'activate':
        setImages(prev => 
          prev.map(img => 
            selectedImages.includes(img.id) ? { ...img, status: 'active' } : img
          )
        );
        setSelectedImages([]);
        break;
      case 'deactivate':
        setImages(prev => 
          prev.map(img => 
            selectedImages.includes(img.id) ? { ...img, status: 'inactive' } : img
          )
        );
        setSelectedImages([]);
        break;
    }
  };

  const toggleImageSelection = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedImages.length === sortedImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(sortedImages.map(img => img.id));
    }
  };

  const handleImagePreview = (image) => {
    setPreviewImage(image);
    setShowImagePreview(true);
  };

  if (loading) {
    return (
      <div className="deal-n-done-card">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Product Images</h1>
            <p className="text-gray-600">Manage product images, galleries, and visual assets</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('product-catalog')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Products</span>
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Images</span>
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
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="size">Sort by Size</option>
              <option value="product">Sort by Product</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </button>
            
            <button
              onClick={fetchImages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedImages.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedImages.length} image(s) selected
              </span>
              <button
                onClick={toggleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {selectedImages.length === sortedImages.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Images Grid/List */}
      <div className="bg-white rounded-xl shadow-lg">
        {viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedImages.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  selected={selectedImages.includes(image.id)}
                  onSelect={toggleImageSelection}
                  onEdit={(img) => {
                    setEditingImage(img);
                    setShowEditModal(true);
                  }}
                  onDelete={handleImageDelete}
                  onPreview={handleImagePreview}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedImages.length === sortedImages.length}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
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
                {sortedImages.map((image) => (
                  <ImageRow
                    key={image.id}
                    image={image}
                    selected={selectedImages.includes(image.id)}
                    onSelect={toggleImageSelection}
                    onEdit={(img) => {
                      setEditingImage(img);
                      setShowEditModal(true);
                    }}
                    onDelete={handleImageDelete}
                    onPreview={handleImagePreview}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onUpload={handleFileUpload}
          onCancel={() => setShowUploadModal(false)}
          dragOver={dragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          uploadProgress={uploadProgress}
          fileInputRef={fileInputRef}
        />
      )}

      {/* Edit Image Modal */}
      {showEditModal && editingImage && (
        <EditImageModal
          image={editingImage}
          onSave={handleImageEdit}
          onCancel={() => {
            setShowEditModal(false);
            setEditingImage(null);
          }}
        />
      )}

      {/* Image Preview Modal */}
      {showImagePreview && previewImage && (
        <ImagePreviewModal
          image={previewImage}
          onClose={() => {
            setShowImagePreview(false);
            setPreviewImage(null);
          }}
        />
      )}
    </div>
  );
};

// Image Card Component
const ImageCard = ({ image, selected, onSelect, onEdit, onDelete, onPreview }) => {
  return (
    <div className={`bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 ${
      selected ? 'ring-2 ring-blue-500' : ''
    }`}>
      <div className="relative group">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(image.id)}
          className="absolute top-2 left-2 z-10 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        
        <div className="aspect-w-1 aspect-h-1 bg-gray-200 cursor-pointer" onClick={() => onPreview(image)}>
          <img
            src={image.url}
            alt={image.alt_text}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        
        {image.featured && (
          <div className="absolute top-2 right-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(image)}
            className="p-1 bg-white bg-opacity-90 rounded hover:bg-opacity-100 transition-colors"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(image.id)}
            className="p-1 bg-white bg-opacity-90 rounded hover:bg-opacity-100 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 truncate">{image.name}</h3>
        <p className="text-xs text-gray-500 mt-1">{image.product_name}</p>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">{formatFileSize(image.size)}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(image.status)}`}>
            {image.status}
          </span>
        </div>
        
        <div className="mt-2 flex items-center space-x-1">
          {image.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
              {tag}
            </span>
          ))}
          {image.tags.length > 2 && (
            <span className="text-xs text-gray-500">+{image.tags.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Image Row Component
const ImageRow = ({ image, selected, onSelect, onEdit, onDelete, onPreview }) => {
  return (
    <tr className={selected ? 'bg-blue-50' : 'hover:bg-gray-50'} onClick={() => onPreview(image)}>
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(image.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img
            src={image.url}
            alt={image.alt_text}
            className="w-12 h-12 rounded object-cover mr-3 cursor-pointer hover:scale-110 transition-transform"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">{image.name}</div>
            <div className="text-sm text-gray-500">{image.dimensions.width} × {image.dimensions.height}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {image.alt_text}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {image.product_name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatFileSize(image.size)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(image.status)}`}>
          {image.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(image); }}
            className="text-blue-600 hover:text-blue-900 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(image.id); }}
            className="text-red-600 hover:text-red-900 transition-colors"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

// Upload Modal Component
const UploadModal = ({ onUpload, onCancel, dragOver, onDragOver, onDragLeave, onDrop, uploadProgress, fileInputRef }) => {
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Upload Images</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop images here or click to browse
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Supports JPG, PNG, GIF up to 10MB each
          </p>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Choose Files
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        
        {uploadProgress > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Edit Image Modal Component
const EditImageModal = ({ image, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: image.name,
    alt_text: image.alt_text,
    status: image.status,
    featured: image.featured,
    tags: image.tags.join(', ')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit Image</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src={image.url}
              alt={image.alt_text}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
                <input
                  type="text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
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
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Image</span>
                </label>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Image Preview Modal Component
const ImagePreviewModal = ({ image, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative max-w-4xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={image.url}
          alt={image.alt_text}
          className="max-w-full max-h-full object-contain rounded-lg"
        />
        <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 rounded-lg p-3">
          <h3 className="text-lg font-semibold">{image.name}</h3>
          <p className="text-sm opacity-90">{image.product_name}</p>
          <p className="text-xs opacity-75">{formatFileSize(image.size)} • {image.dimensions.width} × {image.dimensions.height}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductImages; 