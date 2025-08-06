/**
 * Base Controller Class
 * Provides common functionality for all controllers in the MVC architecture
 */
class BaseController {
  constructor(model, service) {
    this.model = model;
    this.service = service;
    this._isInitialized = false;
  }

  /**
   * Initialize controller
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this._isInitialized) return;
    
    try {
      await this._onInitialize();
      this._isInitialized = true;
    } catch (error) {
      console.error(`Error initializing ${this.constructor.name}:`, error);
      throw error;
    }
  }

  /**
   * Check if controller is initialized
   * @returns {boolean} Initialization status
   */
  get isInitialized() {
    return this._isInitialized;
  }

  /**
   * Get controller name
   * @returns {string} Controller name
   */
  get controllerName() {
    return this.constructor.name;
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @param {string} operation - Operation name
   */
  handleError(error, operation = 'operation') {
    console.error(`Error in ${this.controllerName}.${operation}:`, error);
    
    const errorMessage = error.response?.data?.detail || error.message || 'An error occurred';
    this.model.setError(new Error(errorMessage));
    
    return {
      success: false,
      error: errorMessage,
      operation
    };
  }

  /**
   * Clear error
   */
  clearError() {
    this.model.clearError();
  }

  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  setLoading(loading) {
    this.model.setLoading(loading);
  }

  /**
   * Execute operation with loading state
   * @param {Function} operation - Operation to execute
   * @param {string} operationName - Operation name for error handling
   * @returns {Promise<Object>} Operation result
   */
  async executeWithLoading(operation, operationName = 'operation') {
    this.setLoading(true);
    this.clearError();
    
    try {
      const result = await operation();
      return {
        success: true,
        data: result,
        operation: operationName
      };
    } catch (error) {
      return this.handleError(error, operationName);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Validate data using model
   * @param {Object} data - Data to validate
   * @returns {boolean} Validation result
   */
  validate(data) {
    return this.model.validate(data);
  }

  /**
   * Transform data for API using model
   * @param {Object} data - Data to transform
   * @returns {Object} Transformed data
   */
  transformForAPI(data) {
    return this.model.transformForAPI(data);
  }

  /**
   * Transform data from API using model
   * @param {Object} data - Data from API
   * @returns {Object} Transformed data
   */
  transformFromAPI(data) {
    return this.model.transformFromAPI(data);
  }

  /**
   * Update model state
   * @param {Object} newState - New state
   */
  updateModelState(newState) {
    this.model.setState(newState);
  }

  /**
   * Reset controller and model
   */
  reset() {
    this.model.reset();
    this._isInitialized = false;
  }

  /**
   * Get controller summary
   * @returns {Object} Controller summary
   */
  getSummary() {
    return {
      controllerName: this.controllerName,
      isInitialized: this._isInitialized,
      modelSummary: this.model.getSummary(),
      hasService: !!this.service
    };
  }

  /**
   * Hook for controller initialization
   * Override in child classes
   * @returns {Promise<void>}
   */
  async _onInitialize() {
    // Override in child classes
  }

  /**
   * Hook for controller cleanup
   * Override in child classes
   * @returns {Promise<void>}
   */
  async cleanup() {
    // Override in child classes
  }

  /**
   * Log controller action
   * @param {string} action - Action name
   * @param {Object} data - Action data
   */
  logAction(action, data = {}) {
    console.log(`[${this.controllerName}] ${action}:`, data);
  }

  /**
   * Execute action with logging
   * @param {string} actionName - Action name
   * @param {Function} action - Action to execute
   * @returns {Promise<Object>} Action result
   */
  async executeAction(actionName, action) {
    this.logAction(actionName, 'started');
    
    try {
      const result = await action();
      this.logAction(actionName, { success: true, result });
      return result;
    } catch (error) {
      this.logAction(actionName, { success: false, error: error.message });
      throw error;
    }
  }
}

export default BaseController; 