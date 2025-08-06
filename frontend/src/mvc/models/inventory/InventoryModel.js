import BaseModel from '../base/BaseModel';

/**
 * Inventory Model
 * Manages inventory data, stock levels, and inventory operations
 */
class InventoryModel extends BaseModel {
  constructor() {
    super();
    this._state = {
      products: [],
      categories: [],
      stockLevels: {},
      lowStockAlerts: [],
      inventoryHistory: [],
      vendors: [],
      purchaseOrders: [],
      stockTransfers: [],
      stockReturns: [],
      stockTakes: [],
      filters: {
        category: '',
        vendor: '',
        stockLevel: 'all', // all, low, out, in-stock
        search: ''
      },
      pagination: {
        page: 1,
        limit: 20,
        total: 0
      }
    };
  }

  /**
   * Get products with current stock levels
   */
  get products() {
    return this._state.products;
  }

  /**
   * Get product categories
   */
  get categories() {
    return this._state.categories;
  }

  /**
   * Get stock levels for all products
   */
  get stockLevels() {
    return this._state.stockLevels;
  }

  /**
   * Get low stock alerts
   */
  get lowStockAlerts() {
    return this._state.lowStockAlerts;
  }

  /**
   * Get inventory history
   */
  get inventoryHistory() {
    return this._state.inventoryHistory;
  }

  /**
   * Get vendors
   */
  get vendors() {
    return this._state.vendors;
  }

  /**
   * Get purchase orders
   */
  get purchaseOrders() {
    return this._state.purchaseOrders;
  }

  /**
   * Get stock transfers
   */
  get stockTransfers() {
    return this._state.stockTransfers;
  }

  /**
   * Get stock returns
   */
  get stockReturns() {
    return this._state.stockReturns;
  }

  /**
   * Get stock takes
   */
  get stockTakes() {
    return this._state.stockTakes;
  }

  /**
   * Get current filters
   */
  get filters() {
    return this._state.filters;
  }

  /**
   * Get pagination info
   */
  get pagination() {
    return this._state.pagination;
  }

  /**
   * Get filtered products based on current filters
   */
  get filteredProducts() {
    let filtered = [...this._state.products];

    // Apply category filter
    if (this._state.filters.category) {
      filtered = filtered.filter(product => 
        product.category === this._state.filters.category
      );
    }

    // Apply vendor filter
    if (this._state.filters.vendor) {
      filtered = filtered.filter(product => 
        product.vendor === this._state.filters.vendor
      );
    }

    // Apply stock level filter
    if (this._state.filters.stockLevel !== 'all') {
      filtered = filtered.filter(product => {
        const stockLevel = this._state.stockLevels[product.id] || 0;
        switch (this._state.filters.stockLevel) {
          case 'low':
            return stockLevel > 0 && stockLevel <= product.lowStockThreshold;
          case 'out':
            return stockLevel === 0;
          case 'in-stock':
            return stockLevel > product.lowStockThreshold;
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (this._state.filters.search) {
      const searchTerm = this._state.filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }

  /**
   * Get products with low stock
   */
  get lowStockProducts() {
    return this._state.products.filter(product => {
      const stockLevel = this._state.stockLevels[product.id] || 0;
      return stockLevel > 0 && stockLevel <= product.lowStockThreshold;
    });
  }

  /**
   * Get out of stock products
   */
  get outOfStockProducts() {
    return this._state.products.filter(product => {
      const stockLevel = this._state.stockLevels[product.id] || 0;
      return stockLevel === 0;
    });
  }

  /**
   * Get total inventory value
   */
  get totalInventoryValue() {
    return this._state.products.reduce((total, product) => {
      const stockLevel = this._state.stockLevels[product.id] || 0;
      return total + (stockLevel * product.costPrice);
    }, 0);
  }

  /**
   * Set products
   */
  setProducts(products) {
    this.setState({ products });
  }

  /**
   * Set categories
   */
  setCategories(categories) {
    this.setState({ categories });
  }

  /**
   * Set stock levels
   */
  setStockLevels(stockLevels) {
    this.setState({ stockLevels });
  }

  /**
   * Update stock level for a product
   */
  updateStockLevel(productId, newLevel) {
    const stockLevels = { ...this._state.stockLevels };
    stockLevels[productId] = newLevel;
    this.setState({ stockLevels });
  }

  /**
   * Set low stock alerts
   */
  setLowStockAlerts(alerts) {
    this.setState({ lowStockAlerts: alerts });
  }

  /**
   * Set inventory history
   */
  setInventoryHistory(history) {
    this.setState({ inventoryHistory: history });
  }

  /**
   * Add inventory history entry
   */
  addInventoryHistoryEntry(entry) {
    const history = [entry, ...this._state.inventoryHistory];
    this.setState({ inventoryHistory: history });
  }

  /**
   * Set vendors
   */
  setVendors(vendors) {
    this.setState({ vendors });
  }

  /**
   * Set purchase orders
   */
  setPurchaseOrders(orders) {
    this.setState({ purchaseOrders: orders });
  }

  /**
   * Add purchase order
   */
  addPurchaseOrder(order) {
    const orders = [order, ...this._state.purchaseOrders];
    this.setState({ purchaseOrders: orders });
  }

  /**
   * Set stock transfers
   */
  setStockTransfers(transfers) {
    this.setState({ stockTransfers: transfers });
  }

  /**
   * Add stock transfer
   */
  addStockTransfer(transfer) {
    const transfers = [transfer, ...this._state.stockTransfers];
    this.setState({ stockTransfers: transfers });
  }

  /**
   * Set stock returns
   */
  setStockReturns(returns) {
    this.setState({ stockReturns: returns });
  }

  /**
   * Add stock return
   */
  addStockReturn(returnItem) {
    const returns = [returnItem, ...this._state.stockReturns];
    this.setState({ stockReturns: returns });
  }

  /**
   * Set stock takes
   */
  setStockTakes(stockTakes) {
    this.setState({ stockTakes });
  }

  /**
   * Add stock take
   */
  addStockTake(stockTake) {
    const takes = [stockTake, ...this._state.stockTakes];
    this.setState({ stockTakes: takes });
  }

  /**
   * Set filters
   */
  setFilters(filters) {
    this.setState({ filters: { ...this._state.filters, ...filters } });
  }

  /**
   * Set pagination
   */
  setPagination(pagination) {
    this.setState({ pagination: { ...this._state.pagination, ...pagination } });
  }

  /**
   * Get product by ID
   */
  getProductById(id) {
    return this._state.products.find(product => product.id === id);
  }

  /**
   * Get stock level for product
   */
  getStockLevel(productId) {
    return this._state.stockLevels[productId] || 0;
  }

  /**
   * Check if product is low in stock
   */
  isLowStock(productId) {
    const product = this.getProductById(productId);
    if (!product) return false;
    
    const stockLevel = this.getStockLevel(productId);
    return stockLevel > 0 && stockLevel <= product.lowStockThreshold;
  }

  /**
   * Check if product is out of stock
   */
  isOutOfStock(productId) {
    return this.getStockLevel(productId) === 0;
  }

  /**
   * Get inventory summary
   */
  getInventorySummary() {
    const totalProducts = this._state.products.length;
    const lowStockCount = this.lowStockProducts.length;
    const outOfStockCount = this.outOfStockProducts.length;
    const totalValue = this.totalInventoryValue;

    return {
      totalProducts,
      lowStockCount,
      outOfStockCount,
      totalValue,
      averageStockLevel: totalProducts > 0 ? 
        Object.values(this._state.stockLevels).reduce((sum, level) => sum + level, 0) / totalProducts : 0
    };
  }

  /**
   * Validate inventory data
   */
  validate(data) {
    const errors = [];

    if (data.stockLevel !== undefined) {
      if (typeof data.stockLevel !== 'number' || data.stockLevel < 0) {
        errors.push('Stock level must be a non-negative number');
      }
    }

    if (data.productId && !this.getProductById(data.productId)) {
      errors.push('Invalid product ID');
    }

    return errors;
  }

  /**
   * Transform data for API
   */
  transformForAPI(data) {
    return {
      ...data,
      timestamp: new Date().toISOString(),
      store_id: localStorage.getItem('currentStoreId')
    };
  }

  /**
   * Transform data from API
   */
  transformFromAPI(data) {
    return {
      ...data,
      timestamp: new Date(data.timestamp),
      stockLevel: parseInt(data.stockLevel) || 0
    };
  }

  /**
   * Get model name
   */
  get modelName() {
    return 'Inventory';
  }

  /**
   * Get summary for debugging
   */
  getSummary() {
    return {
      totalProducts: this._state.products.length,
      totalStockLevels: Object.keys(this._state.stockLevels).length,
      lowStockCount: this.lowStockProducts.length,
      outOfStockCount: this.outOfStockProducts.length,
      totalValue: this.totalInventoryValue,
      filters: this._state.filters,
      pagination: this._state.pagination
    };
  }
}

export default InventoryModel; 