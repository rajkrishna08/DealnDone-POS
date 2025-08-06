import BaseController from '../base/BaseController';
import apiService from '../../services/api/ApiService';

/**
 * Store Controller
 * Manages store business logic and API interactions
 */
class StoreController extends BaseController {
  constructor(storeModel) {
    super(storeModel, apiService);
  }

  /**
   * Initialize controller
   * @returns {Promise<void>}
   */
  async _onInitialize() {
    // Load current store from URL if available
    const currentStore = this._getCurrentStoreFromURL();
    if (currentStore) {
      await this.loadStoreBySubdomain(currentStore);
    }
  }

  /**
   * Get current store from URL
   * @returns {string|null} Store subdomain
   */
  _getCurrentStoreFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('store');
  }

  /**
   * Load all stores
   * @returns {Promise<Object>} Operation result
   */
  async loadStores() {
    return this.executeWithLoading(async () => {
      const stores = await this.service.get('/stores');
      const transformedStores = stores.map(store => 
        this.model.transformFromAPI(store)
      );
      
      this.model.setStores(transformedStores);
      return transformedStores;
    }, 'loadStores');
  }

  /**
   * Load store by ID
   * @param {string} storeId - Store ID
   * @returns {Promise<Object>} Operation result
   */
  async loadStoreById(storeId) {
    return this.executeWithLoading(async () => {
      const store = await this.service.get(`/stores/${storeId}`);
      const transformedStore = this.model.transformFromAPI(store);
      
      this.model.setCurrentStore(transformedStore);
      return transformedStore;
    }, 'loadStoreById');
  }

  /**
   * Load store by subdomain
   * @param {string} subdomain - Store subdomain
   * @returns {Promise<Object>} Operation result
   */
  async loadStoreBySubdomain(subdomain) {
    return this.executeWithLoading(async () => {
      const store = await this.service.get(`/stores/subdomain/${subdomain}`);
      const transformedStore = this.model.transformFromAPI(store);
      
      this.model.setCurrentStore(transformedStore);
      return transformedStore;
    }, 'loadStoreBySubdomain');
  }

  /**
   * Create new store
   * @param {Object} storeData - Store data
   * @returns {Promise<Object>} Operation result
   */
  async createStore(storeData) {
    return this.executeWithLoading(async () => {
      // Validate store data
      if (!this.model.validate(storeData)) {
        throw new Error('Invalid store data');
      }

      // Check if subdomain already exists
      if (this.model.hasSubdomain(storeData.subdomain)) {
        throw new Error('Subdomain already exists');
      }

      const transformedData = this.model.transformForAPI(storeData);
      const store = await this.service.post('/stores', transformedData);
      const transformedStore = this.model.transformFromAPI(store);
      
      this.model.addStore(transformedStore);
      return transformedStore;
    }, 'createStore');
  }

  /**
   * Update store
   * @param {string} storeId - Store ID
   * @param {Object} updates - Store updates
   * @returns {Promise<Object>} Operation result
   */
  async updateStore(storeId, updates) {
    return this.executeWithLoading(async () => {
      // Validate updates
      if (updates.subdomain && !this.model.validate({ subdomain: updates.subdomain })) {
        throw new Error('Invalid subdomain format');
      }

      const transformedData = this.model.transformForAPI(updates);
      const store = await this.service.put(`/stores/${storeId}`, transformedData);
      const transformedStore = this.model.transformFromAPI(store);
      
      this.model.updateStore(storeId, transformedStore);
      return transformedStore;
    }, 'updateStore');
  }

  /**
   * Delete store
   * @param {string} storeId - Store ID
   * @returns {Promise<Object>} Operation result
   */
  async deleteStore(storeId) {
    return this.executeWithLoading(async () => {
      await this.service.delete(`/stores/${storeId}`);
      this.model.removeStore(storeId);
      return { success: true };
    }, 'deleteStore');
  }

  /**
   * Switch to store
   * @param {string} storeId - Store ID
   * @returns {Promise<Object>} Operation result
   */
  async switchStore(storeId) {
    return this.executeWithLoading(async () => {
      const store = this.model.getStoreById(storeId);
      if (!store) {
        throw new Error('Store not found');
      }

      this.model.setCurrentStore(store);
      
      // Update URL for development environment
      if (window.location.hostname === 'localhost') {
        const url = new URL(window.location);
        url.searchParams.set('store', store.subdomain);
        window.history.pushState({}, '', url);
      }

      return store;
    }, 'switchStore');
  }

  /**
   * Switch to store by subdomain
   * @param {string} subdomain - Store subdomain
   * @returns {Promise<Object>} Operation result
   */
  async switchStoreBySubdomain(subdomain) {
    return this.executeWithLoading(async () => {
      const store = this.model.getStoreBySubdomain(subdomain);
      if (!store) {
        // Try to load store from API
        await this.loadStoreBySubdomain(subdomain);
        return this.model.currentStore;
      }

      this.model.setCurrentStore(store);
      
      // Update URL for development environment
      if (window.location.hostname === 'localhost') {
        const url = new URL(window.location);
        url.searchParams.set('store', store.subdomain);
        window.history.pushState({}, '', url);
      }

      return store;
    }, 'switchStoreBySubdomain');
  }

  /**
   * Load store configuration
   * @param {string} storeId - Store ID
   * @returns {Promise<Object>} Operation result
   */
  async loadStoreConfig(storeId) {
    return this.executeWithLoading(async () => {
      const config = await this.service.get(`/stores/${storeId}/config`);
      this.model.setStoreConfig(config);
      return config;
    }, 'loadStoreConfig');
  }

  /**
   * Load store statistics
   * @param {string} storeId - Store ID
   * @returns {Promise<Object>} Operation result
   */
  async loadStoreStats(storeId) {
    return this.executeWithLoading(async () => {
      const stats = await this.service.get(`/stores/${storeId}/stats`);
      this.model.setStoreStats(stats);
      return stats;
    }, 'loadStoreStats');
  }

  /**
   * Load store permissions
   * @param {string} storeId - Store ID
   * @returns {Promise<Object>} Operation result
   */
  async loadStorePermissions(storeId) {
    return this.executeWithLoading(async () => {
      const permissions = await this.service.get(`/stores/${storeId}/permissions`);
      this.model.setStorePermissions(permissions);
      return permissions;
    }, 'loadStorePermissions');
  }

  /**
   * Update store configuration
   * @param {string} storeId - Store ID
   * @param {Object} config - Store configuration
   * @returns {Promise<Object>} Operation result
   */
  async updateStoreConfig(storeId, config) {
    return this.executeWithLoading(async () => {
      const updatedConfig = await this.service.put(`/stores/${storeId}/config`, config);
      this.model.setStoreConfig(updatedConfig);
      return updatedConfig;
    }, 'updateStoreConfig');
  }

  /**
   * Validate store subdomain
   * @param {string} subdomain - Subdomain to validate
   * @returns {Object} Validation result
   */
  validateSubdomain(subdomain) {
    const isValid = this.model.validate({ subdomain });
    const exists = this.model.hasSubdomain(subdomain);
    
    return {
      isValid,
      exists,
      available: isValid && !exists,
      message: !isValid ? 'Invalid subdomain format' : 
               exists ? 'Subdomain already exists' : 
               'Subdomain available'
    };
  }

  /**
   * Get store dashboard data
   * @param {string} storeId - Store ID
   * @returns {Promise<Object>} Operation result
   */
  async loadDashboardData(storeId) {
    return this.executeWithLoading(async () => {
      const [config, stats, permissions] = await Promise.all([
        this.service.get(`/stores/${storeId}/config`),
        this.service.get(`/stores/${storeId}/stats`),
        this.service.get(`/stores/${storeId}/permissions`)
      ]);

      this.model.setStoreConfig(config);
      this.model.setStoreStats(stats);
      this.model.setStorePermissions(permissions);

      return { config, stats, permissions };
    }, 'loadDashboardData');
  }

  /**
   * Get controller summary
   * @returns {Object} Controller summary
   */
  getSummary() {
    return {
      ...super.getSummary(),
      storeSummary: this.model.getStoreSummary(),
      currentStore: this.model.currentStore,
      totalStores: this.model.stores.length
    };
  }
}

export default StoreController; 