import BaseModel from '../base/BaseModel';

/**
 * Store Model
 * Manages store/organization data and state
 */
class StoreModel extends BaseModel {
  constructor() {
    super();
    this._state = {
      currentStore: null,
      stores: [],
      storeConfig: {},
      storeStats: {},
      storePermissions: {}
    };
  }

  /**
   * Get current store
   * @returns {Object|null} Current store
   */
  get currentStore() {
    return this._state.currentStore;
  }

  /**
   * Get all stores
   * @returns {Array} All stores
   */
  get stores() {
    return this._state.stores;
  }

  /**
   * Get store configuration
   * @returns {Object} Store configuration
   */
  get storeConfig() {
    return this._state.storeConfig;
  }

  /**
   * Get store statistics
   * @returns {Object} Store statistics
   */
  get storeStats() {
    return this._state.storeStats;
  }

  /**
   * Get store permissions
   * @returns {Object} Store permissions
   */
  get storePermissions() {
    return this._state.storePermissions;
  }

  /**
   * Set current store
   * @param {Object} store - Store object
   */
  setCurrentStore(store) {
    this.setState({ currentStore: store });
  }

  /**
   * Set stores list
   * @param {Array} stores - Stores array
   */
  setStores(stores) {
    this.setState({ stores });
  }

  /**
   * Add store to list
   * @param {Object} store - Store object
   */
  addStore(store) {
    const stores = [...this._state.stores, store];
    this.setState({ stores });
  }

  /**
   * Update store in list
   * @param {string} storeId - Store ID
   * @param {Object} updates - Store updates
   */
  updateStore(storeId, updates) {
    const stores = this._state.stores.map(store => 
      store.id === storeId ? { ...store, ...updates } : store
    );
    this.setState({ stores });
    
    // Update current store if it's the one being updated
    if (this._state.currentStore?.id === storeId) {
      this.setState({ 
        currentStore: { ...this._state.currentStore, ...updates }
      });
    }
  }

  /**
   * Remove store from list
   * @param {string} storeId - Store ID
   */
  removeStore(storeId) {
    const stores = this._state.stores.filter(store => store.id !== storeId);
    this.setState({ stores });
    
    // Clear current store if it's the one being removed
    if (this._state.currentStore?.id === storeId) {
      this.setState({ currentStore: null });
    }
  }

  /**
   * Set store configuration
   * @param {Object} config - Store configuration
   */
  setStoreConfig(config) {
    this.setState({ storeConfig: config });
  }

  /**
   * Set store statistics
   * @param {Object} stats - Store statistics
   */
  setStoreStats(stats) {
    this.setState({ storeStats: stats });
  }

  /**
   * Set store permissions
   * @param {Object} permissions - Store permissions
   */
  setStorePermissions(permissions) {
    this.setState({ storePermissions: permissions });
  }

  /**
   * Get store by ID
   * @param {string} storeId - Store ID
   * @returns {Object|null} Store object
   */
  getStoreById(storeId) {
    return this._state.stores.find(store => store.id === storeId) || null;
  }

  /**
   * Get store by subdomain
   * @param {string} subdomain - Store subdomain
   * @returns {Object|null} Store object
   */
  getStoreBySubdomain(subdomain) {
    return this._state.stores.find(store => store.subdomain === subdomain) || null;
  }

  /**
   * Check if store exists
   * @param {string} storeId - Store ID
   * @returns {boolean} Store exists
   */
  hasStore(storeId) {
    return this._state.stores.some(store => store.id === storeId);
  }

  /**
   * Check if subdomain exists
   * @param {string} subdomain - Store subdomain
   * @returns {boolean} Subdomain exists
   */
  hasSubdomain(subdomain) {
    return this._state.stores.some(store => store.subdomain === subdomain);
  }

  /**
   * Validate store data
   * @param {Object} data - Store data
   * @returns {boolean} Validation result
   */
  validate(data) {
    const requiredFields = ['name', 'subdomain', 'business_type'];
    
    // Check required fields
    for (const field of requiredFields) {
      if (!data[field]) {
        return false;
      }
    }
    
    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9-]+$/;
    if (!subdomainRegex.test(data.subdomain)) {
      return false;
    }
    
    // Validate subdomain length
    if (data.subdomain.length < 3 || data.subdomain.length > 50) {
      return false;
    }
    
    return true;
  }

  /**
   * Transform store data for API
   * @param {Object} data - Store data
   * @returns {Object} Transformed data
   */
  transformForAPI(data) {
    return {
      name: data.name,
      subdomain: data.subdomain.toLowerCase(),
      business_type: data.business_type,
      max_outlets: data.max_outlets || 1,
      max_registers: data.max_registers || 1,
      max_products: data.max_products || 1000,
      max_employees: data.max_employees || 3
    };
  }

  /**
   * Transform store data from API
   * @param {Object} data - Store data from API
   * @returns {Object} Transformed data
   */
  transformFromAPI(data) {
    return {
      id: data.id,
      name: data.name,
      subdomain: data.subdomain,
      business_type: data.business_type,
      max_outlets: data.max_outlets,
      max_registers: data.max_registers,
      max_products: data.max_products,
      max_employees: data.max_employees,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  /**
   * Get store summary
   * @returns {Object} Store summary
   */
  getStoreSummary() {
    return {
      totalStores: this._state.stores.length,
      currentStore: this._state.currentStore ? {
        id: this._state.currentStore.id,
        name: this._state.currentStore.name,
        subdomain: this._state.currentStore.subdomain
      } : null,
      hasConfig: Object.keys(this._state.storeConfig).length > 0,
      hasStats: Object.keys(this._state.storeStats).length > 0,
      hasPermissions: Object.keys(this._state.storePermissions).length > 0
    };
  }

  /**
   * Reset store model
   */
  reset() {
    this._state = {
      currentStore: null,
      stores: [],
      storeConfig: {},
      storeStats: {},
      storePermissions: {}
    };
    super.reset();
  }
}

export default StoreModel; 