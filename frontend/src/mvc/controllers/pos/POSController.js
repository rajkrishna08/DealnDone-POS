import BaseController from '../base/BaseController';
import apiService from '../../services/api/ApiService';

/**
 * POS Controller - Manages POS business logic
 * Handles product management, sales processing, and inventory updates
 */
class POSController extends BaseController {
  constructor(productModel, saleModel) {
    super(productModel);
    this.saleModel = saleModel;
  }

  async _onInitialize() {
    // Load initial data
    await this.loadProducts();
    await this.loadCategories();
    await this.loadBrands();
    await this.loadSalesHistory();
  }

  // Product management
  async loadProducts(filters = {}) {
    return await this.executeWithLoading(async () => {
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.brand) queryParams.append('brand', filters.brand);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const response = await apiService.get(`/pos/products?${queryParams.toString()}`);

      if (response.success) {
        const products = response.data.products.map(product => 
          this.model.transformFromAPI(product)
        );
        
        this.model.setProducts(products);
        this.model.setPagination({
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.total_pages
        });

        return response.data;
      } else {
        throw new Error(response.message || 'Failed to load products');
      }
    }, 'loading products');
  }

  async loadCategories() {
    return await this.executeWithLoading(async () => {
      const response = await apiService.get('/pos/categories');

      if (response.success) {
        this.model.setCategories(response.data.categories);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to load categories');
      }
    }, 'loading categories');
  }

  async loadBrands() {
    return await this.executeWithLoading(async () => {
      const response = await apiService.get('/pos/brands');

      if (response.success) {
        this.model.setBrands(response.data.brands);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to load brands');
      }
    }, 'loading brands');
  }

  async createProduct(productData) {
    return await this.executeWithLoading(async () => {
      const validation = this.model.validate(productData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const data = this.model.transformForAPI(productData);
      const response = await apiService.post('/pos/products', data);

      if (response.success) {
        const newProduct = this.model.transformFromAPI(response.data);
        this.model.addProduct(newProduct);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create product');
      }
    }, 'creating product');
  }

  async updateProduct(productId, updates) {
    return await this.executeWithLoading(async () => {
      const validation = this.model.validate(updates);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const data = this.model.transformForAPI(updates);
      const response = await apiService.put(`/pos/products/${productId}`, data);

      if (response.success) {
        const updatedProduct = this.model.transformFromAPI(response.data);
        this.model.updateProduct(productId, updatedProduct);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update product');
      }
    }, 'updating product');
  }

  async deleteProduct(productId) {
    return await this.executeWithLoading(async () => {
      const response = await apiService.delete(`/pos/products/${productId}`);

      if (response.success) {
        this.model.removeProduct(productId);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to delete product');
      }
    }, 'deleting product');
  }

  async searchProducts(query) {
    return await this.executeWithLoading(async () => {
      const response = await apiService.get(`/pos/products/search?q=${encodeURIComponent(query)}`);

      if (response.success) {
        const results = response.data.products.map(product => 
          this.model.transformFromAPI(product)
        );
        
        this.model.setSearchResults(results);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to search products');
      }
    }, 'searching products');
  }

  // Sales management
  async loadSalesHistory(filters = {}) {
    return await this.executeWithLoading(async () => {
      const queryParams = new URLSearchParams();
      
      if (filters.startDate) queryParams.append('start_date', filters.startDate);
      if (filters.endDate) queryParams.append('end_date', filters.endDate);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const response = await apiService.get(`/pos/sales?${queryParams.toString()}`);

      if (response.success) {
        const sales = response.data.sales.map(sale => 
          this.saleModel.transformFromAPI(sale)
        );
        
        this.saleModel.setSalesHistory(sales);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to load sales history');
      }
    }, 'loading sales history');
  }

  async createSale(saleData) {
    return await this.executeWithLoading(async () => {
      const validation = this.saleModel.validate(saleData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const data = this.saleModel.transformForAPI(saleData);
      const response = await apiService.post('/pos/sales', data);

      if (response.success) {
        const newSale = this.saleModel.transformFromAPI(response.data);
        this.saleModel.setCurrentSale(newSale);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create sale');
      }
    }, 'creating sale');
  }

  async completeSale(saleId, paymentData) {
    return await this.executeWithLoading(async () => {
      const response = await apiService.post(`/pos/sales/${saleId}/complete`, paymentData);

      if (response.success) {
        const completedSale = this.saleModel.transformFromAPI(response.data);
        
        // Update sales history
        this.saleModel.setSalesHistory([
          ...this.saleModel.salesHistory,
          completedSale
        ]);
        
        // Clear current sale and cart
        this.saleModel.setCurrentSale(null);
        this.saleModel.setCart([]);
        
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to complete sale');
      }
    }, 'completing sale');
  }

  async cancelSale(saleId) {
    return await this.executeWithLoading(async () => {
      const response = await apiService.post(`/pos/sales/${saleId}/cancel`);

      if (response.success) {
        const cancelledSale = this.saleModel.transformFromAPI(response.data);
        
        // Update sales history
        this.saleModel.setSalesHistory([
          ...this.saleModel.salesHistory,
          cancelledSale
        ]);
        
        // Clear current sale and cart
        this.saleModel.setCurrentSale(null);
        this.saleModel.setCart([]);
        
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to cancel sale');
      }
    }, 'cancelling sale');
  }

  async refundSale(saleId, refundData) {
    return await this.executeWithLoading(async () => {
      const response = await apiService.post(`/pos/sales/${saleId}/refund`, refundData);

      if (response.success) {
        const refundedSale = this.saleModel.transformFromAPI(response.data);
        
        // Update sales history
        this.saleModel.setSalesHistory(
          this.saleModel.salesHistory.map(sale => 
            sale.id === saleId ? refundedSale : sale
          )
        );
        
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to refund sale');
      }
    }, 'refunding sale');
  }

  // Cart management
  addToCart(product, quantity = 1) {
    // Check stock availability
    if (product.stockQuantity < quantity) {
      throw new Error(`Insufficient stock. Available: ${product.stockQuantity}`);
    }

    this.saleModel.addToCart(product, quantity);
  }

  removeFromCart(itemId) {
    this.saleModel.removeFromCart(itemId);
  }

  updateCartItemQuantity(itemId, quantity) {
    const item = this.saleModel.getCartItemById(itemId);
    if (!item) {
      throw new Error('Cart item not found');
    }

    // Check stock availability
    const product = this.model.getProductById(item.productId);
    if (product && product.stockQuantity < quantity) {
      throw new Error(`Insufficient stock. Available: ${product.stockQuantity}`);
    }

    this.saleModel.updateCartItemQuantity(itemId, quantity);
  }

  updateCartItemPrice(itemId, price) {
    if (price < 0) {
      throw new Error('Price must be non-negative');
    }

    this.saleModel.updateCartItemPrice(itemId, price);
  }

  updateCartItemDiscount(itemId, discount) {
    if (discount < 0 || discount > 100) {
      throw new Error('Discount must be between 0 and 100');
    }

    this.saleModel.updateCartItemDiscount(itemId, discount);
  }

  clearCart() {
    this.saleModel.clearCart();
  }

  // Customer management
  async searchCustomers(query) {
    return await this.executeWithLoading(async () => {
      const response = await apiService.get(`/pos/customers/search?q=${encodeURIComponent(query)}`);

      if (response.success) {
        return response.data.customers;
      } else {
        throw new Error(response.message || 'Failed to search customers');
      }
    }, 'searching customers');
  }

  async getCustomerById(customerId) {
    return await this.executeWithLoading(async () => {
      const response = await apiService.get(`/pos/customers/${customerId}`);

      if (response.success) {
        return response.data.customer;
      } else {
        throw new Error(response.message || 'Failed to get customer');
      }
    }, 'loading customer');
  }

  // Receipt management
  async generateReceipt(saleId) {
    return await this.executeWithLoading(async () => {
      const response = await apiService.get(`/pos/sales/${saleId}/receipt`);

      if (response.success) {
        this.saleModel.setReceiptData(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to generate receipt');
      }
    }, 'generating receipt');
  }

  async printReceipt(saleId) {
    return await this.executeWithLoading(async () => {
      const response = await apiService.post(`/pos/sales/${saleId}/print`);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to print receipt');
      }
    }, 'printing receipt');
  }

  // Analytics and reporting
  async getSalesStats(filters = {}) {
    return await this.executeWithLoading(async () => {
      const queryParams = new URLSearchParams();
      
      if (filters.startDate) queryParams.append('start_date', filters.startDate);
      if (filters.endDate) queryParams.append('end_date', filters.endDate);
      if (filters.groupBy) queryParams.append('group_by', filters.groupBy);

      const response = await apiService.get(`/pos/analytics/sales?${queryParams.toString()}`);

      if (response.success) {
        this.saleModel.setSalesStats(response.data.stats);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to load sales stats');
      }
    }, 'loading sales stats');
  }

  async getTopProducts(limit = 10) {
    return await this.executeWithLoading(async () => {
      const response = await apiService.get(`/pos/analytics/top-products?limit=${limit}`);

      if (response.success) {
        return response.data.products;
      } else {
        throw new Error(response.message || 'Failed to load top products');
      }
    }, 'loading top products');
  }

  // Inventory management
  async updateProductStock(productId, quantity, operation = 'add') {
    return await this.executeWithLoading(async () => {
      const data = {
        product_id: productId,
        quantity: quantity,
        operation: operation // add, subtract, set
      };

      const response = await apiService.post('/pos/inventory/update-stock', data);

      if (response.success) {
        const updatedProduct = this.model.transformFromAPI(response.data);
        this.model.updateProduct(productId, updatedProduct);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update stock');
      }
    }, 'updating stock');
  }

  async getLowStockProducts() {
    return await this.executeWithLoading(async () => {
      const response = await apiService.get('/pos/inventory/low-stock');

      if (response.success) {
        const products = response.data.products.map(product => 
          this.model.transformFromAPI(product)
        );
        
        return products;
      } else {
        throw new Error(response.message || 'Failed to load low stock products');
      }
    }, 'loading low stock products');
  }

  // Utility methods
  getProductById(productId) {
    return this.model.getProductById(productId);
  }

  getSaleById(saleId) {
    return this.saleModel.getSaleById(saleId);
  }

  getCartItemById(itemId) {
    return this.saleModel.getCartItemById(itemId);
  }

  getCartItemByProductId(productId) {
    return this.saleModel.getCartItemByProductId(productId);
  }

  formatCurrency(amount) {
    return this.saleModel.formatCurrency(amount);
  }

  // Clear methods
  clearCurrentProduct() {
    this.model.clearCurrentProduct();
  }

  clearSearchResults() {
    this.model.clearSearchResults();
  }

  clearFilters() {
    this.model.clearFilters();
  }

  clearSelection() {
    this.model.clearSelection();
  }

  clearCurrentSale() {
    this.saleModel.clearCurrentSale();
  }

  clearReceiptData() {
    this.saleModel.clearReceiptData();
  }
}

export default POSController; 