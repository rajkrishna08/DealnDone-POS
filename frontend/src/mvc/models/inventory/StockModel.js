import BaseModel from '../base/BaseModel';

/**
 * Stock Model
 * Manages stock levels, movements, and stock-related operations
 */
class StockModel extends BaseModel {
  constructor() {
    super();
    this._state = {
      stockLevels: {},
      stockMovements: [],
      stockAdjustments: [],
      stockReservations: [],
      stockAlerts: [],
      stockHistory: [],
      stockSettings: {
        lowStockThreshold: 10,
        outOfStockThreshold: 0,
        autoReorderEnabled: false,
        reorderQuantity: 50,
        stockTakeFrequency: 'monthly'
      },
      filters: {
        productId: '',
        movementType: 'all', // in, out, adjustment, transfer
        dateRange: {
          start: null,
          end: null
        },
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
   * Get stock levels for all products
   */
  get stockLevels() {
    return this._state.stockLevels;
  }

  /**
   * Get stock movements
   */
  get stockMovements() {
    return this._state.stockMovements;
  }

  /**
   * Get stock adjustments
   */
  get stockAdjustments() {
    return this._state.stockAdjustments;
  }

  /**
   * Get stock reservations
   */
  get stockReservations() {
    return this._state.stockReservations;
  }

  /**
   * Get stock alerts
   */
  get stockAlerts() {
    return this._state.stockAlerts;
  }

  /**
   * Get stock history
   */
  get stockHistory() {
    return this._state.stockHistory;
  }

  /**
   * Get stock settings
   */
  get stockSettings() {
    return this._state.stockSettings;
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
   * Get filtered stock movements
   */
  get filteredStockMovements() {
    let filtered = [...this._state.stockMovements];

    // Apply product filter
    if (this._state.filters.productId) {
      filtered = filtered.filter(movement => 
        movement.productId === this._state.filters.productId
      );
    }

    // Apply movement type filter
    if (this._state.filters.movementType !== 'all') {
      filtered = filtered.filter(movement => 
        movement.type === this._state.filters.movementType
      );
    }

    // Apply date range filter
    if (this._state.filters.dateRange.start && this._state.filters.dateRange.end) {
      filtered = filtered.filter(movement => {
        const movementDate = new Date(movement.timestamp);
        const startDate = new Date(this._state.filters.dateRange.start);
        const endDate = new Date(this._state.filters.dateRange.end);
        return movementDate >= startDate && movementDate <= endDate;
      });
    }

    // Apply search filter
    if (this._state.filters.search) {
      const searchTerm = this._state.filters.search.toLowerCase();
      filtered = filtered.filter(movement =>
        movement.reference?.toLowerCase().includes(searchTerm) ||
        movement.notes?.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }

  /**
   * Get stock level for a product
   */
  getStockLevel(productId) {
    return this._state.stockLevels[productId] || 0;
  }

  /**
   * Get stock movements for a product
   */
  getStockMovementsForProduct(productId) {
    return this._state.stockMovements.filter(movement => 
      movement.productId === productId
    );
  }

  /**
   * Get stock history for a product
   */
  getStockHistoryForProduct(productId) {
    return this._state.stockHistory.filter(entry => 
      entry.productId === productId
    );
  }

  /**
   * Get stock alerts for a product
   */
  getStockAlertsForProduct(productId) {
    return this._state.stockAlerts.filter(alert => 
      alert.productId === productId
    );
  }

  /**
   * Get low stock products
   */
  get lowStockProducts() {
    return Object.entries(this._state.stockLevels)
      .filter(([productId, level]) => 
        level > 0 && level <= this._state.stockSettings.lowStockThreshold
      )
      .map(([productId, level]) => ({ productId, level }));
  }

  /**
   * Get out of stock products
   */
  get outOfStockProducts() {
    return Object.entries(this._state.stockLevels)
      .filter(([productId, level]) => level === 0)
      .map(([productId, level]) => ({ productId, level }));
  }

  /**
   * Get total stock value
   */
  get totalStockValue() {
    // This would need product cost data to calculate
    return 0; // Placeholder
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
  updateStockLevel(productId, newLevel, reason = 'manual') {
    const oldLevel = this._state.stockLevels[productId] || 0;
    const stockLevels = { ...this._state.stockLevels };
    stockLevels[productId] = newLevel;
    
    // Add stock movement
    const movement = {
      id: Date.now().toString(),
      productId,
      type: newLevel > oldLevel ? 'in' : 'out',
      quantity: Math.abs(newLevel - oldLevel),
      oldLevel,
      newLevel,
      reason,
      timestamp: new Date().toISOString(),
      userId: localStorage.getItem('userId')
    };

    this.setState({
      stockLevels,
      stockMovements: [movement, ...this._state.stockMovements]
    });

    // Check for alerts
    this.checkStockAlerts(productId, newLevel);
  }

  /**
   * Add stock movement
   */
  addStockMovement(movement) {
    const movements = [movement, ...this._state.stockMovements];
    this.setState({ stockMovements: movements });

    // Update stock level
    const currentLevel = this._state.stockLevels[movement.productId] || 0;
    const newLevel = movement.type === 'in' ? 
      currentLevel + movement.quantity : 
      currentLevel - movement.quantity;
    
    this.updateStockLevel(movement.productId, newLevel, movement.reason);
  }

  /**
   * Set stock adjustments
   */
  setStockAdjustments(adjustments) {
    this.setState({ stockAdjustments: adjustments });
  }

  /**
   * Add stock adjustment
   */
  addStockAdjustment(adjustment) {
    const adjustments = [adjustment, ...this._state.stockAdjustments];
    this.setState({ stockAdjustments: adjustments });

    // Update stock level
    const currentLevel = this._state.stockLevels[adjustment.productId] || 0;
    const newLevel = currentLevel + adjustment.adjustment;
    
    this.updateStockLevel(adjustment.productId, newLevel, 'adjustment');
  }

  /**
   * Set stock reservations
   */
  setStockReservations(reservations) {
    this.setState({ stockReservations: reservations });
  }

  /**
   * Add stock reservation
   */
  addStockReservation(reservation) {
    const reservations = [reservation, ...this._state.stockReservations];
    this.setState({ stockReservations: reservations });
  }

  /**
   * Set stock alerts
   */
  setStockAlerts(alerts) {
    this.setState({ stockAlerts: alerts });
  }

  /**
   * Add stock alert
   */
  addStockAlert(alert) {
    const alerts = [alert, ...this._state.stockAlerts];
    this.setState({ stockAlerts: alerts });
  }

  /**
   * Set stock history
   */
  setStockHistory(history) {
    this.setState({ stockHistory: history });
  }

  /**
   * Add stock history entry
   */
  addStockHistoryEntry(entry) {
    const history = [entry, ...this._state.stockHistory];
    this.setState({ stockHistory: history });
  }

  /**
   * Set stock settings
   */
  setStockSettings(settings) {
    this.setState({ stockSettings: { ...this._state.stockSettings, ...settings } });
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
   * Check stock alerts for a product
   */
  checkStockAlerts(productId, stockLevel) {
    const alerts = [];

    // Check for low stock alert
    if (stockLevel > 0 && stockLevel <= this._state.stockSettings.lowStockThreshold) {
      alerts.push({
      id: Date.now().toString(),
        productId,
        type: 'low_stock',
        message: `Product is running low on stock (${stockLevel} remaining)`,
        timestamp: new Date().toISOString(),
        severity: 'warning'
      });
    }

    // Check for out of stock alert
    if (stockLevel === 0) {
      alerts.push({
      id: Date.now().toString(),
        productId,
        type: 'out_of_stock',
        message: 'Product is out of stock',
        timestamp: new Date().toISOString(),
        severity: 'critical'
      });
    }

    // Add alerts if any
    if (alerts.length > 0) {
      this.setState({ stockAlerts: [...alerts, ...this._state.stockAlerts] });
    }
  }

  /**
   * Get stock summary for a product
   */
  getStockSummary(productId) {
    const stockLevel = this.getStockLevel(productId);
    const movements = this.getStockMovementsForProduct(productId);
    const alerts = this.getStockAlertsForProduct(productId);

    const recentMovements = movements.slice(0, 10);
    const totalIn = movements
      .filter(m => m.type === 'in')
      .reduce((sum, m) => sum + m.quantity, 0);
    const totalOut = movements
      .filter(m => m.type === 'out')
      .reduce((sum, m) => sum + m.quantity, 0);

    return {
      productId,
      currentLevel: stockLevel,
      totalIn,
      totalOut,
      netChange: totalIn - totalOut,
      recentMovements,
      activeAlerts: alerts.filter(a => a.resolved === false),
      isLowStock: stockLevel > 0 && stockLevel <= this._state.stockSettings.lowStockThreshold,
      isOutOfStock: stockLevel === 0
    };
  }

  /**
   * Get overall stock summary
   */
  getOverallStockSummary() {
    const totalProducts = Object.keys(this._state.stockLevels).length;
    const lowStockCount = this.lowStockProducts.length;
    const outOfStockCount = this.outOfStockProducts.length;
    const totalStock = Object.values(this._state.stockLevels).reduce((sum, level) => sum + level, 0);
    const averageStock = totalProducts > 0 ? totalStock / totalProducts : 0;

    return {
      totalProducts,
      lowStockCount,
      outOfStockCount,
      totalStock,
      averageStock,
      totalValue: this.totalStockValue
    };
  }

  /**
   * Validate stock data
   */
  validate(data) {
    const errors = [];

    if (data.stockLevel !== undefined) {
      if (typeof data.stockLevel !== 'number' || data.stockLevel < 0) {
        errors.push('Stock level must be a non-negative number');
      }
    }

    if (data.quantity !== undefined) {
      if (typeof data.quantity !== 'number' || data.quantity <= 0) {
        errors.push('Quantity must be a positive number');
      }
    }

    if (data.productId && !this._state.stockLevels.hasOwnProperty(data.productId)) {
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
      store_id: localStorage.getItem('currentStoreId'),
      user_id: localStorage.getItem('userId')
    };
  }

  /**
   * Transform data from API
   */
  transformFromAPI(data) {
    return {
      ...data,
      timestamp: new Date(data.timestamp),
      stockLevel: parseInt(data.stockLevel) || 0,
      quantity: parseInt(data.quantity) || 0
    };
  }

  /**
   * Get model name
   */
  get modelName() {
    return 'Stock';
  }

  /**
   * Get summary for debugging
   */
  getSummary() {
    return {
      totalProducts: Object.keys(this._state.stockLevels).length,
      totalMovements: this._state.stockMovements.length,
      totalAdjustments: this._state.stockAdjustments.length,
      totalAlerts: this._state.stockAlerts.length,
      lowStockCount: this.lowStockProducts.length,
      outOfStockCount: this.outOfStockProducts.length,
      filters: this._state.filters,
      pagination: this._state.pagination
    };
  }
}

export default StockModel; 