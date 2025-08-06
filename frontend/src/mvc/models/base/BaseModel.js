/**
 * Base Model Class
 * Provides common functionality for all models in the MVC architecture
 */
class BaseModel {
  constructor() {
    this._state = {};
    this._listeners = new Set();
    this._loading = false;
    this._error = null;
    this._lastUpdated = null;
  }

  /**
   * Get current state
   * @returns {Object} Current state
   */
  get state() {
    return { ...this._state };
  }

  /**
   * Get loading status
   * @returns {boolean} Loading status
   */
  get loading() {
    return this._loading;
  }

  /**
   * Get error status
   * @returns {Error|null} Current error
   */
  get error() {
    return this._error;
  }

  /**
   * Get last updated timestamp
   * @returns {Date|null} Last updated timestamp
   */
  get lastUpdated() {
    return this._lastUpdated;
  }

  /**
   * Update state and notify listeners
   * @param {Object} newState - New state to merge
   */
  setState(newState) {
    this._state = { ...this._state, ...newState };
    this._lastUpdated = new Date();
    this._notifyListeners();
  }

  /**
   * Set loading status
   * @param {boolean} loading - Loading status
   */
  setLoading(loading) {
    this._loading = loading;
    this._notifyListeners();
  }

  /**
   * Set error status
   * @param {Error|null} error - Error object
   */
  setError(error) {
    this._error = error;
    this._notifyListeners();
  }

  /**
   * Clear error
   */
  clearError() {
    this._error = null;
    this._notifyListeners();
  }

  /**
   * Add state change listener
   * @param {Function} listener - Listener function
   */
  addListener(listener) {
    this._listeners.add(listener);
  }

  /**
   * Remove state change listener
   * @param {Function} listener - Listener function
   */
  removeListener(listener) {
    this._listeners.delete(listener);
  }

  /**
   * Notify all listeners of state change
   */
  _notifyListeners() {
    this._listeners.forEach(listener => {
      try {
        listener(this.state, this.loading, this.error);
      } catch (error) {
        console.error('Error in model listener:', error);
      }
    });
  }

  /**
   * Reset model state
   */
  reset() {
    this._state = {};
    this._loading = false;
    this._error = null;
    this._lastUpdated = null;
    this._notifyListeners();
  }

  /**
   * Validate data
   * @param {Object} data - Data to validate
   * @returns {boolean} Validation result
   */
  validate(data) {
    // Override in child classes
    return true;
  }

  /**
   * Transform data for API
   * @param {Object} data - Data to transform
   * @returns {Object} Transformed data
   */
  transformForAPI(data) {
    // Override in child classes
    return data;
  }

  /**
   * Transform data from API
   * @param {Object} data - Data from API
   * @returns {Object} Transformed data
   */
  transformFromAPI(data) {
    // Override in child classes
    return data;
  }

  /**
   * Get model name
   * @returns {string} Model name
   */
  get modelName() {
    return this.constructor.name;
  }

  /**
   * Get model summary
   * @returns {Object} Model summary
   */
  getSummary() {
    return {
      modelName: this.modelName,
      stateKeys: Object.keys(this._state),
      loading: this._loading,
      hasError: !!this._error,
      lastUpdated: this._lastUpdated,
      listenerCount: this._listeners.size
    };
  }
}

export default BaseModel; 