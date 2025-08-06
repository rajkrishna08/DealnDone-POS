import BaseModel from '../base/BaseModel';

/**
 * Product Model - Manages product data and state
 * Handles product catalog, pricing, inventory, and categories
 */
class ProductModel extends BaseModel {
  constructor() {
    super();
    
    // Initialize product state
    this._state = {
      products: [],
      currentProduct: null,
      categories: [],
      brands: [],
      searchResults: [],
      filters: {
        category: null,
        brand: null,
        priceRange: null,
        inStock: null,
        searchQuery: ''
      },
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
      },
      selectedProducts: [],
      bulkActions: {
        isSelecting: false,
        selectedCount: 0
      }
    };
  }

  // Getters
  get products() {
    return this._state.products;
  }

  get currentProduct() {
    return this._state.currentProduct;
  }

  get categories() {
    return this._state.categories;
  }

  get brands() {
    return this._state.brands;
  }

  get searchResults() {
    return this._state.searchResults;
  }

  get filters() {
    return this._state.filters;
  }

  get pagination() {
    return this._state.pagination;
  }

  get selectedProducts() {
    return this._state.selectedProducts;
  }

  get bulkActions() {
    return this._state.bulkActions;
  }

  get totalProducts() {
    return this._state.pagination.total;
  }

  get hasProducts() {
    return this._state.products.length > 0;
  }

  get hasSearchResults() {
    return this._state.searchResults.length > 0;
  }

  get hasSelectedProducts() {
    return this._state.selectedProducts.length > 0;
  }

  // Setters
  setProducts(products) {
    this.setState({
      ...this._state,
      products: products
    });
  }

  setCurrentProduct(product) {
    this.setState({
      ...this._state,
      currentProduct: product
    });
  }

  setCategories(categories) {
    this.setState({
      ...this._state,
      categories: categories
    });
  }

  setBrands(brands) {
    this.setState({
      ...this._state,
      brands: brands
    });
  }

  setSearchResults(results) {
    this.setState({
      ...this._state,
      searchResults: results
    });
  }

  setFilters(filters) {
    this.setState({
      ...this._state,
      filters: { ...this._state.filters, ...filters }
    });
  }

  setPagination(pagination) {
    this.setState({
      ...this._state,
      pagination: { ...this._state.pagination, ...pagination }
    });
  }

  setSelectedProducts(products) {
    this.setState({
      ...this._state,
      selectedProducts: products,
      bulkActions: {
        ...this._state.bulkActions,
        selectedCount: products.length
      }
    });
  }

  setBulkActions(actions) {
    this.setState({
      ...this._state,
      bulkActions: { ...this._state.bulkActions, ...actions }
    });
  }

  // Product management methods
  addProduct(product) {
    this.setState({
      ...this._state,
      products: [...this._state.products, product]
    });
  }

  updateProduct(productId, updates) {
    this.setState({
      ...this._state,
      products: this._state.products.map(product => 
        product.id === productId ? { ...product, ...updates } : product
      ),
      currentProduct: this._state.currentProduct?.id === productId 
        ? { ...this._state.currentProduct, ...updates }
        : this._state.currentProduct
    });
  }

  removeProduct(productId) {
    this.setState({
      ...this._state,
      products: this._state.products.filter(product => product.id !== productId),
      currentProduct: this._state.currentProduct?.id === productId 
        ? null 
        : this._state.currentProduct,
      selectedProducts: this._state.selectedProducts.filter(id => id !== productId)
    });
  }

  getProductById(productId) {
    return this._state.products.find(product => product.id === productId);
  }

  getProductsByCategory(categoryId) {
    return this._state.products.filter(product => product.categoryId === categoryId);
  }

  getProductsByBrand(brandId) {
    return this._state.products.filter(product => product.brandId === brandId);
  }

  searchProducts(query) {
    const searchTerm = query.toLowerCase();
    const results = this._state.products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.sku.toLowerCase().includes(searchTerm)
    );
    
    this.setSearchResults(results);
    return results;
  }

  filterProducts(filters) {
    let filtered = [...this._state.products];

    if (filters.category) {
      filtered = filtered.filter(product => product.categoryId === filters.category);
    }

    if (filters.brand) {
      filtered = filtered.filter(product => product.brandId === filters.brand);
    }

    if (filters.priceRange) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange.min && 
        product.price <= filters.priceRange.max
      );
    }

    if (filters.inStock !== null) {
      filtered = filtered.filter(product => 
        filters.inStock ? product.stockQuantity > 0 : product.stockQuantity === 0
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  // Selection methods
  selectProduct(productId) {
    if (!this._state.selectedProducts.includes(productId)) {
      this.setSelectedProducts([...this._state.selectedProducts, productId]);
    }
  }

  deselectProduct(productId) {
    this.setSelectedProducts(
      this._state.selectedProducts.filter(id => id !== productId)
    );
  }

  selectAllProducts() {
    const allProductIds = this._state.products.map(product => product.id);
    this.setSelectedProducts(allProductIds);
  }

  deselectAllProducts() {
    this.setSelectedProducts([]);
  }

  toggleProductSelection(productId) {
    if (this._state.selectedProducts.includes(productId)) {
      this.deselectProduct(productId);
    } else {
      this.selectProduct(productId);
    }
  }

  // Bulk actions
  startBulkSelection() {
    this.setBulkActions({ isSelecting: true });
  }

  stopBulkSelection() {
    this.setBulkActions({ 
      isSelecting: false,
      selectedCount: 0 
    });
    this.setSelectedProducts([]);
  }

  // Validation
  validate(data) {
    const errors = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Product name is required');
    }

    if (!data.sku || data.sku.trim().length === 0) {
      errors.push('SKU is required');
    }

    if (data.price === undefined || data.price === null) {
      errors.push('Price is required');
    } else if (data.price < 0) {
      errors.push('Price must be non-negative');
    }

    if (data.stockQuantity === undefined || data.stockQuantity === null) {
      errors.push('Stock quantity is required');
    } else if (data.stockQuantity < 0) {
      errors.push('Stock quantity must be non-negative');
    }

    if (data.categoryId && !this._state.categories.find(cat => cat.id === data.categoryId)) {
      errors.push('Invalid category selected');
    }

    if (data.brandId && !this._state.brands.find(brand => brand.id === data.brandId)) {
      errors.push('Invalid brand selected');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Data transformation
  transformForAPI(data) {
    return {
      name: data.name?.trim(),
      description: data.description?.trim(),
      sku: data.sku?.trim().toUpperCase(),
      price: parseFloat(data.price) || 0,
      cost_price: parseFloat(data.costPrice) || 0,
      stock_quantity: parseInt(data.stockQuantity) || 0,
      category_id: data.categoryId,
      brand_id: data.brandId,
      barcode: data.barcode?.trim(),
      weight: parseFloat(data.weight) || 0,
      dimensions: data.dimensions,
      images: data.images || [],
      tags: data.tags || [],
      is_active: data.isActive !== undefined ? data.isActive : true,
      tax_rate: parseFloat(data.taxRate) || 0,
      reorder_point: parseInt(data.reorderPoint) || 0,
      supplier_id: data.supplierId
    };
  }

  transformFromAPI(data) {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      sku: data.sku,
      price: parseFloat(data.price) || 0,
      costPrice: parseFloat(data.cost_price) || 0,
      stockQuantity: parseInt(data.stock_quantity) || 0,
      categoryId: data.category_id,
      brandId: data.brand_id,
      barcode: data.barcode,
      weight: parseFloat(data.weight) || 0,
      dimensions: data.dimensions,
      images: data.images || [],
      tags: data.tags || [],
      isActive: data.is_active,
      taxRate: parseFloat(data.tax_rate) || 0,
      reorderPoint: parseInt(data.reorder_point) || 0,
      supplierId: data.supplier_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      category: data.category,
      brand: data.brand,
      supplier: data.supplier
    };
  }

  // Utility methods
  getProductDisplayName(product) {
    return product ? `${product.name} (${product.sku})` : '';
  }

  getProductPrice(product) {
    return product ? parseFloat(product.price) || 0 : 0;
  }

  getProductStock(product) {
    return product ? parseInt(product.stockQuantity) || 0 : 0;
  }

  isProductInStock(product) {
    return this.getProductStock(product) > 0;
  }

  isProductLowStock(product) {
    const stock = this.getProductStock(product);
    const reorderPoint = parseInt(product.reorderPoint) || 0;
    return stock > 0 && stock <= reorderPoint;
  }

  getProductCategory(product) {
    if (!product || !product.categoryId) return null;
    return this._state.categories.find(cat => cat.id === product.categoryId);
  }

  getProductBrand(product) {
    if (!product || !product.brandId) return null;
    return this._state.brands.find(brand => brand.id === product.brandId);
  }

  // Clear methods
  clearCurrentProduct() {
    this.setState({
      ...this._state,
      currentProduct: null
    });
  }

  clearSearchResults() {
    this.setState({
      ...this._state,
      searchResults: []
    });
  }

  clearFilters() {
    this.setState({
      ...this._state,
      filters: {
        category: null,
        brand: null,
        priceRange: null,
        inStock: null,
        searchQuery: ''
      }
    });
  }

  clearSelection() {
    this.setState({
      ...this._state,
      selectedProducts: [],
      bulkActions: {
        ...this._state.bulkActions,
        selectedCount: 0
      }
    });
  }
}

export default ProductModel; 