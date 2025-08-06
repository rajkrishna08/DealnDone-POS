import BaseController from '../base/BaseController';
import apiService from '../../services/api/ApiService';

/**
 * Inventory Controller
 * Handles inventory business logic, API interactions, and data management
 */
class InventoryController extends BaseController {
  constructor(inventoryModel, stockModel, vendorModel) {
    super(inventoryModel);
    this.inventoryModel = inventoryModel;
    this.stockModel = stockModel;
    this.vendorModel = vendorModel;
    this.apiService = apiService;
  }

  /**
   * Initialize inventory data
   */
  async initialize() {
    try {
      this.setLoading(true);
      
      // Load all inventory data in parallel
      const [products, stockLevels, categories, vendors] = await Promise.all([
        this.loadProducts(),
        this.loadStockLevels(),
        this.loadCategories(),
        this.loadVendors()
      ]);

      // Update models with loaded data
      this.inventoryModel.setProducts(products);
      this.inventoryModel.setStockLevels(stockLevels);
      this.inventoryModel.setCategories(categories);
      this.inventoryModel.setVendors(vendors);

      this.setLoading(false);
      this.clearError();
    } catch (error) {
      this.handleError('Failed to initialize inventory', error);
    }
  }

  /**
   * Load products from API
   */
  async loadProducts() {
    try {
      const response = await this.apiService.get('/inventory/products');
      return response.data || [];
    } catch (error) {
      console.error('Failed to load products:', error);
      return [];
    }
  }

  /**
   * Load stock levels from API
   */
  async loadStockLevels() {
    try {
      const response = await this.apiService.get('/inventory/stock-levels');
      return response.data || {};
    } catch (error) {
      console.error('Failed to load stock levels:', error);
      return {};
    }
  }

  /**
   * Load categories from API
   */
  async loadCategories() {
    try {
      const response = await this.apiService.get('/inventory/categories');
      return response.data || [];
    } catch (error) {
      console.error('Failed to load categories:', error);
      return [];
    }
  }

  /**
   * Load vendors from API
   */
  async loadVendors() {
    try {
      const response = await this.apiService.get('/inventory/vendors');
      return response.data || [];
    } catch (error) {
      console.error('Failed to load vendors:', error);
      return [];
    }
  }

  /**
   * Get filtered products
   */
  getFilteredProducts() {
    return this.inventoryModel.filteredProducts;
  }

  /**
   * Get inventory summary
   */
  getInventorySummary() {
    return this.inventoryModel.getInventorySummary();
  }

  /**
   * Update stock level for a product
   */
  async updateStockLevel(productId, newLevel, reason = 'manual') {
    try {
      this.setLoading(true);

      // Validate input
      const errors = this.inventoryModel.validate({ stockLevel: newLevel, productId });
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Update local state immediately (optimistic update)
      this.inventoryModel.updateStockLevel(productId, newLevel);
      this.stockModel.updateStockLevel(productId, newLevel, reason);

      // Send update to API
      const response = await this.apiService.put(`/inventory/stock-levels/${productId}`, {
        stockLevel: newLevel,
        reason,
        timestamp: new Date().toISOString()
      });

      // Add to inventory history
      this.inventoryModel.addInventoryHistoryEntry({
        id: Date.now().toString(),
        productId,
        type: 'stock_update',
        oldLevel: response.data.oldLevel,
        newLevel: response.data.newLevel,
        reason,
        timestamp: new Date().toISOString(),
        userId: localStorage.getItem('userId')
      });

      this.setLoading(false);
      this.clearError();
      return response.data;
    } catch (error) {
      this.handleError('Failed to update stock level', error);
      throw error;
    }
  }

  /**
   * Add stock movement
   */
  async addStockMovement(movement) {
    try {
      this.setLoading(true);

      // Validate movement
      const errors = this.validateStockMovement(movement);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Add to local state
      this.stockModel.addStockMovement(movement);

      // Send to API
      const response = await this.apiService.post('/inventory/stock-movements', movement);

      this.setLoading(false);
      this.clearError();
      return response.data;
    } catch (error) {
      this.handleError('Failed to add stock movement', error);
      throw error;
    }
  }

  /**
   * Add stock adjustment
   */
  async addStockAdjustment(adjustment) {
    try {
      this.setLoading(true);

      // Validate adjustment
      const errors = this.validateStockAdjustment(adjustment);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Add to local state
      this.stockModel.addStockAdjustment(adjustment);

      // Send to API
      const response = await this.apiService.post('/inventory/stock-adjustments', adjustment);

      this.setLoading(false);
      this.clearError();
      return response.data;
    } catch (error) {
      this.handleError('Failed to add stock adjustment', error);
      throw error;
    }
  }

  /**
   * Create purchase order
   */
  async createPurchaseOrder(orderData) {
    try {
      this.setLoading(true);

      // Validate order data
      const errors = this.validatePurchaseOrder(orderData);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Send to API
      const response = await this.apiService.post('/inventory/purchase-orders', orderData);

      // Add to local state
      this.inventoryModel.addPurchaseOrder(response.data);

      this.setLoading(false);
      this.clearError();
      return response.data;
    } catch (error) {
      this.handleError('Failed to create purchase order', error);
      throw error;
    }
  }

  /**
   * Create stock transfer
   */
  async createStockTransfer(transferData) {
    try {
      this.setLoading(true);

      // Validate transfer data
      const errors = this.validateStockTransfer(transferData);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Send to API
      const response = await this.apiService.post('/inventory/stock-transfers', transferData);

      // Add to local state
      this.inventoryModel.addStockTransfer(response.data);

      this.setLoading(false);
      this.clearError();
      return response.data;
    } catch (error) {
      this.handleError('Failed to create stock transfer', error);
      throw error;
    }
  }

  /**
   * Create stock return
   */
  async createStockReturn(returnData) {
    try {
      this.setLoading(true);

      // Validate return data
      const errors = this.validateStockReturn(returnData);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Send to API
      const response = await this.apiService.post('/inventory/stock-returns', returnData);

      // Add to local state
      this.inventoryModel.addStockReturn(response.data);

      this.setLoading(false);
      this.clearError();
      return response.data;
    } catch (error) {
      this.handleError('Failed to create stock return', error);
      throw error;
    }
  }

  /**
   * Create stock take
   */
  async createStockTake(stockTakeData) {
    try {
      this.setLoading(true);

      // Validate stock take data
      const errors = this.validateStockTake(stockTakeData);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Send to API
      const response = await this.apiService.post('/inventory/stock-takes', stockTakeData);

      // Add to local state
      this.inventoryModel.addStockTake(response.data);

      this.setLoading(false);
      this.clearError();
      return response.data;
    } catch (error) {
      this.handleError('Failed to create stock take', error);
      throw error;
    }
  }

  /**
   * Get low stock alerts
   */
  async getLowStockAlerts() {
    try {
      const response = await this.apiService.get('/inventory/low-stock-alerts');
      this.inventoryModel.setLowStockAlerts(response.data || []);
      return response.data;
    } catch (error) {
      this.handleError('Failed to get low stock alerts', error);
      return [];
    }
  }

  /**
   * Get inventory history
   */
  async getInventoryHistory(filters = {}) {
    try {
      const response = await this.apiService.get('/inventory/history', { params: filters });
      this.inventoryModel.setInventoryHistory(response.data || []);
      return response.data;
    } catch (error) {
      this.handleError('Failed to get inventory history', error);
      return [];
    }
  }

  /**
   * Set inventory filters
   */
  setFilters(filters) {
    this.inventoryModel.setFilters(filters);
  }

  /**
   * Set pagination
   */
  setPagination(pagination) {
    this.inventoryModel.setPagination(pagination);
  }

  /**
   * Validate stock movement
   */
  validateStockMovement(movement) {
    const errors = [];

    if (!movement.productId) {
      errors.push('Product ID is required');
    }

    if (!movement.type || !['in', 'out', 'adjustment', 'transfer'].includes(movement.type)) {
      errors.push('Valid movement type is required');
    }

    if (!movement.quantity || movement.quantity <= 0) {
      errors.push('Valid quantity is required');
    }

    if (!movement.reason) {
      errors.push('Reason is required');
    }

    return errors;
  }

  /**
   * Validate stock adjustment
   */
  validateStockAdjustment(adjustment) {
    const errors = [];

    if (!adjustment.productId) {
      errors.push('Product ID is required');
    }

    if (adjustment.adjustment === undefined || adjustment.adjustment === null) {
      errors.push('Adjustment value is required');
    }

    if (!adjustment.reason) {
      errors.push('Reason is required');
    }

    return errors;
  }

  /**
   * Validate purchase order
   */
  validatePurchaseOrder(order) {
    const errors = [];

    if (!order.vendorId) {
      errors.push('Vendor is required');
    }

    if (!order.items || order.items.length === 0) {
      errors.push('At least one item is required');
    }

    if (!order.expectedDeliveryDate) {
      errors.push('Expected delivery date is required');
    }

    return errors;
  }

  /**
   * Validate stock transfer
   */
  validateStockTransfer(transfer) {
    const errors = [];

    if (!transfer.fromLocation) {
      errors.push('Source location is required');
    }

    if (!transfer.toLocation) {
      errors.push('Destination location is required');
    }

    if (!transfer.items || transfer.items.length === 0) {
      errors.push('At least one item is required');
    }

    return errors;
  }

  /**
   * Validate stock return
   */
  validateStockReturn(returnItem) {
    const errors = [];

    if (!returnItem.productId) {
      errors.push('Product is required');
    }

    if (!returnItem.quantity || returnItem.quantity <= 0) {
      errors.push('Valid quantity is required');
    }

    if (!returnItem.reason) {
      errors.push('Return reason is required');
    }

    return errors;
  }

  /**
   * Validate stock take
   */
  validateStockTake(stockTake) {
    const errors = [];

    if (!stockTake.location) {
      errors.push('Location is required');
    }

    if (!stockTake.items || stockTake.items.length === 0) {
      errors.push('At least one item is required');
    }

    return errors;
  }

  /**
   * Get stock summary for a product
   */
  getStockSummary(productId) {
    return this.stockModel.getStockSummary(productId);
  }

  /**
   * Get overall stock summary
   */
  getOverallStockSummary() {
    return this.stockModel.getOverallStockSummary();
  }

  /**
   * Get vendor summary
   */
  getVendorSummary(vendorId) {
    return this.vendorModel.getVendorSummary(vendorId);
  }

  /**
   * Get overall vendor summary
   */
  getOverallVendorSummary() {
    return this.vendorModel.getOverallVendorSummary();
  }

  /**
   * Export inventory data
   */
  async exportInventory(format = 'csv') {
    try {
      this.setLoading(true);

      const response = await this.apiService.get('/inventory/export', {
        params: { format },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inventory-export-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      this.setLoading(false);
      this.clearError();
    } catch (error) {
      this.handleError('Failed to export inventory', error);
    }
  }

  /**
   * Import inventory data
   */
  async importInventory(file) {
    try {
      this.setLoading(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await this.apiService.post('/inventory/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Refresh inventory data
      await this.initialize();

      this.setLoading(false);
      this.clearError();
      return response.data;
    } catch (error) {
      this.handleError('Failed to import inventory', error);
      throw error;
    }
  }

  /**
   * Cleanup controller
   */
  cleanup() {
    // Cleanup any subscriptions or timers
    this.clearError();
  }
}

export default InventoryController; 