import React, { useState, useEffect } from 'react';
import { products as dummyProducts } from '../data/dummyData';

const ProductsPage = () => {
  const [search, setSearch] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Active');
  const [activeFilters, setActiveFilters] = useState(['Electronics', 'Appliances']);
  const [loading, setLoading] = useState(true);
  
  const [products, setProducts] = useState([]);

  // Fetch products from backend or use dummy data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8005/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || data);
        } else {
          // Use dummy data if backend is not available
          const formattedProducts = dummyProducts.map(product => ({
            ...product,
            price: `$${product.price.toFixed(2)}`,
            tags: [product.category],
            status: product.stock > 0 ? "ONLINE" : "OFFLINE",
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
          status: product.stock > 0 ? "ONLINE" : "OFFLINE",
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
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center mb-6">
        <div className="relative col-span-2">
          <input 
            className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="Search by product, variant, etc." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
        </div>
        
        {/* Active Filter Chips */}
        {activeFilters.map((filter, index) => (
          <div key={index} className="filter-chip">
            <span className="ml-2">{filter}</span>
            <button 
              className="remove"
              onClick={() => removeFilter(filter)}
            >
              <span className="material-icons text-base">close</span>
            </button>
          </div>
        ))}
        
        <div>
          <select className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Brand</option>
          </select>
        </div>
        <div>
          <select className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>ID</option>
          </select>
        </div>
        <div className="flex items-center col-span-2 md:col-span-1">
          <input 
            className="w-full border border-gray-300 rounded-l-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            type="text" 
            value="Mar 7 - Mar 15, 17"
          />
          <span className="material-icons border-t border-b border-r border-gray-300 rounded-r-md p-2 bg-gray-100 text-gray-600">calendar_today</span>
        </div>
        <div>
          <select className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Online</option>
          </select>
        </div>
        <button className="deal-n-done-btn-primary text-sm font-semibold">Apply Filter</button>
      </div>

      {/* Store Filter Buttons */}
      <div className="flex space-x-2 mb-6 text-sm overflow-x-auto pb-2">
        <button className="bg-gray-200 px-3 py-1 rounded-full whitespace-nowrap hover:bg-gray-300 transition-colors">All Stores</button>
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
          <span className="material-icons text-lg">arrow_forward_ios</span>
        </button>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">Dashboard &gt; Products</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex border border-gray-300 rounded-md text-sm">
            <button 
              className={`px-4 py-1.5 rounded-l-md border-r border-gray-300 transition-colors ${
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
              className={`px-4 py-1.5 rounded-r-md transition-colors ${
                activeFilter === 'All' 
                  ? 'bg-white text-blue-600 border-blue-600' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => setActiveFilter('All')}
            >
              All
            </button>
          </div>
          <button className="deal-n-done-btn-secondary flex items-center text-sm">
            Actions <span className="material-icons text-lg ml-1">expand_more</span>
          </button>
          <button className="deal-n-done-btn-secondary flex items-center text-sm">
            <span className="material-icons text-lg mr-1">file_upload</span>Export
          </button>
          <button className="deal-n-done-btn-secondary flex items-center text-sm">
            <span className="material-icons text-lg mr-1">file_download</span>Import
          </button>
          <button className="deal-n-done-btn-secondary p-1.5">
            <span className="material-icons text-lg">settings</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="deal-n-done-table overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
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
            {filteredProducts && filteredProducts.map((product) => (
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
                      className="w-10 h-10 object-cover rounded-md mr-3" 
                      src={product.image} 
                      alt={product.name}
                      style={getImageStyle(product)}
                    />
                    <div className="whitespace-nowrap">
                      <div className={`font-medium ${product.highlighted ? 'text-blue-600' : 'text-gray-900'}`}>
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.status} 
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
                  {product.stock}
                </td>
                <td className="p-3 text-center">3</td>
                <td className="p-3 text-center">{product.price}</td>
                <td className="p-3 text-center">--</td>
                <td className="p-3 text-center text-gray-400">
                  <span className="material-icons cursor-pointer hover:text-gray-600 transition-colors">more_horiz</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="flex justify-between items-center p-4 bg-white rounded-b-lg border-t border-gray-200 text-sm">
        <div className="flex items-center space-x-2">
          <button className="deal-n-done-btn-secondary flex items-center">
            <span className="material-icons text-lg mr-1">file_upload</span> EXPORT LIST
          </button>
          <button className="deal-n-done-btn-secondary flex items-center text-red-500 hover:text-red-600">
            <span className="material-icons text-lg mr-1">delete</span> DELETE
          </button>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <button className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 transition-colors" disabled>
            <span className="material-icons text-lg">first_page</span>
          </button>
          <button className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 transition-colors" disabled>
            <span className="material-icons text-lg">chevron_left</span>
          </button>
          <button className="px-3 py-1 rounded-md bg-blue-100 text-blue-600 font-medium">1</button>
          <button className="px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">2</button>
          <button className="px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">3</button>
          <button className="px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">4</button>
          <button className="px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">5</button>
          <span className="px-1">...</span>
          <button className="px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">10</button>
          <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
            <span className="material-icons text-lg">chevron_right</span>
          </button>
          <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
            <span className="material-icons text-lg">last_page</span>
          </button>
          <span className="ml-4">1-10 of 250 items</span>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 