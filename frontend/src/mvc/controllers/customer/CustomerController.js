import BaseController from '../base/BaseController';
import apiService from '../../services/api/ApiService';

/**
 * Customer Controller
 * Handles customer business logic, API interactions, and data management
 */
class CustomerController extends BaseController {
  constructor(customerModel) {
    super(customerModel);
    this.customerModel = customerModel;
    this.apiService = apiService;
  }

  /**
   * Initialize customer data
   */
  async initialize() {
    try {
      this.setLoading(true);
      
      // Load all customer data in parallel
      const [customers, groups, tags, notes, history] = await Promise.all([
        this.loadCustomers(),
        this.loadCustomerGroups(),
        this.loadCustomerTags(),
        this.loadCustomerNotes(),
        this.loadCustomerHistory()
      ]);

      // Update model with loaded data
      this.customerModel.setCustomers(customers);
      this.customerModel.setCustomerGroups(groups);
      this.customerModel.setCustomerTags(tags);
      this.customerModel.setCustomerNotes(notes);
      this.customerModel.setCustomerHistory(history);

      this.setLoading(false);
      this.clearError();
    } catch (error) {
      this.handleError('Failed to initialize customer data', error);
    }
  }

  /**
   * Load customers from API
   */
  async loadCustomers() {
    try {
      const response = await this.apiService.get('/customers');
      return response.data.map(customer => this.customerModel.transformFromAPI(customer));
    } catch (error) {
      console.error('Failed to load customers:', error);
      return [];
    }
  }

  /**
   * Load customer groups from API
   */
  async loadCustomerGroups() {
    try {
      const response = await this.apiService.get('/customers/groups');
      return response.data;
    } catch (error) {
      console.error('Failed to load customer groups:', error);
      return [];
    }
  }

  /**
   * Load customer tags from API
   */
  async loadCustomerTags() {
    try {
      const response = await this.apiService.get('/customers/tags');
      return response.data;
    } catch (error) {
      console.error('Failed to load customer tags:', error);
      return [];
    }
  }

  /**
   * Load customer notes from API
   */
  async loadCustomerNotes() {
    try {
      const response = await this.apiService.get('/customers/notes');
      return response.data;
    } catch (error) {
      console.error('Failed to load customer notes:', error);
      return [];
    }
  }

  /**
   * Load customer history from API
   */
  async loadCustomerHistory() {
    try {
      const response = await this.apiService.get('/customers/history');
      return response.data;
    } catch (error) {
      console.error('Failed to load customer history:', error);
      return [];
    }
  }

  /**
   * Add new customer
   */
  async addCustomer(customerData) {
    try {
      this.setLoading(true);
      
      // Validate customer data
      const errors = this.customerModel.validate(customerData);
      if (errors.length > 0) {
        throw new Error(`Validation errors: ${errors.join(', ')}`);
      }

      // Transform data for API
      const apiData = this.customerModel.transformForAPI(customerData);
      
      const response = await this.apiService.post('/customers', apiData);
      const newCustomer = this.customerModel.transformFromAPI(response.data);
      
      // Add to model
      this.customerModel.addCustomer(newCustomer);
      
      this.setLoading(false);
      this.clearError();
      return newCustomer;
    } catch (error) {
      this.handleError('Failed to add customer', error);
      throw error;
    }
  }

  /**
   * Update customer
   */
  async updateCustomer(customerId, customerData) {
    try {
      this.setLoading(true);
      
      // Validate customer data
      const errors = this.customerModel.validate(customerData);
      if (errors.length > 0) {
        throw new Error(`Validation errors: ${errors.join(', ')}`);
      }

      // Transform data for API
      const apiData = this.customerModel.transformForAPI(customerData);
      
      const response = await this.apiService.put(`/customers/${customerId}`, apiData);
      const updatedCustomer = this.customerModel.transformFromAPI(response.data);
      
      // Update in model
      this.customerModel.updateCustomer(customerId, updatedCustomer);
      
      this.setLoading(false);
      this.clearError();
      return updatedCustomer;
    } catch (error) {
      this.handleError('Failed to update customer', error);
      throw error;
    }
  }

  /**
   * Delete customer
   */
  async deleteCustomer(customerId) {
    try {
      this.setLoading(true);
      
      await this.apiService.delete(`/customers/${customerId}`);
      
      // Remove from model
      this.customerModel.deleteCustomer(customerId);
      
      this.setLoading(false);
      this.clearError();
    } catch (error) {
      this.handleError('Failed to delete customer', error);
      throw error;
    }
  }

  /**
   * Add customer to group
   */
  async addCustomerToGroup(customerId, groupId) {
    try {
      await this.apiService.post(`/customers/${customerId}/groups/${groupId}`);
      
      // Update model
      this.customerModel.addCustomerToGroup(customerId, groupId);
      
      this.clearError();
    } catch (error) {
      this.handleError('Failed to add customer to group', error);
      throw error;
    }
  }

  /**
   * Remove customer from group
   */
  async removeCustomerFromGroup(customerId, groupId) {
    try {
      await this.apiService.delete(`/customers/${customerId}/groups/${groupId}`);
      
      // Update model
      this.customerModel.removeCustomerFromGroup(customerId, groupId);
      
      this.clearError();
    } catch (error) {
      this.handleError('Failed to remove customer from group', error);
      throw error;
    }
  }

  /**
   * Add tag to customer
   */
  async addCustomerTag(customerId, tag) {
    try {
      const response = await this.apiService.post(`/customers/${customerId}/tags`, { tag });
      
      // Update model
      this.customerModel.addCustomerTag(customerId, response.data);
      
      this.clearError();
    } catch (error) {
      this.handleError('Failed to add customer tag', error);
      throw error;
    }
  }

  /**
   * Remove tag from customer
   */
  async removeCustomerTag(customerId, tagId) {
    try {
      await this.apiService.delete(`/customers/${customerId}/tags/${tagId}`);
      
      // Update model
      this.customerModel.removeCustomerTag(customerId, tagId);
      
      this.clearError();
    } catch (error) {
      this.handleError('Failed to remove customer tag', error);
      throw error;
    }
  }

  /**
   * Add note to customer
   */
  async addCustomerNote(customerId, noteData) {
    try {
      const response = await this.apiService.post(`/customers/${customerId}/notes`, noteData);
      
      // Update model
      this.customerModel.addCustomerNote(customerId, response.data);
      
      this.clearError();
    } catch (error) {
      this.handleError('Failed to add customer note', error);
      throw error;
    }
  }

  /**
   * Update customer note
   */
  async updateCustomerNote(customerId, noteId, noteData) {
    try {
      const response = await this.apiService.put(`/customers/${customerId}/notes/${noteId}`, noteData);
      
      // Update model
      this.customerModel.updateCustomerNote(customerId, noteId, response.data);
      
      this.clearError();
    } catch (error) {
      this.handleError('Failed to update customer note', error);
      throw error;
    }
  }

  /**
   * Delete customer note
   */
  async deleteCustomerNote(customerId, noteId) {
    try {
      await this.apiService.delete(`/customers/${customerId}/notes/${noteId}`);
      
      // Update model
      this.customerModel.deleteCustomerNote(customerId, noteId);
      
      this.clearError();
    } catch (error) {
      this.handleError('Failed to delete customer note', error);
      throw error;
    }
  }

  /**
   * Get customer analytics
   */
  async getCustomerAnalytics(customerId) {
    try {
      const response = await this.apiService.get(`/customers/${customerId}/analytics`);
      return response.data;
    } catch (error) {
      this.handleError('Failed to get customer analytics', error);
      throw error;
    }
  }

  /**
   * Get customer loyalty status
   */
  async getCustomerLoyaltyStatus(customerId) {
    try {
      const response = await this.apiService.get(`/customers/${customerId}/loyalty`);
      return response.data;
    } catch (error) {
      this.handleError('Failed to get customer loyalty status', error);
      throw error;
    }
  }

  /**
   * Update customer loyalty points
   */
  async updateCustomerLoyaltyPoints(customerId, points, reason) {
    try {
      const response = await this.apiService.post(`/customers/${customerId}/loyalty/points`, {
        points,
        reason
      });
      
      // Update model
      this.customerModel.updateCustomerLoyaltyPoints(customerId, response.data);
      
      this.clearError();
      return response.data;
    } catch (error) {
      this.handleError('Failed to update customer loyalty points', error);
      throw error;
    }
  }

  /**
   * Search customers
   */
  async searchCustomers(query, filters = {}) {
    try {
      this.setLoading(true);
      
      const params = new URLSearchParams({
        q: query,
        ...filters
      });
      
      const response = await this.apiService.get(`/customers/search?${params}`);
      const customers = response.data.map(customer => this.customerModel.transformFromAPI(customer));
      
      // Update model with search results
      this.customerModel.setCustomers(customers);
      
      this.setLoading(false);
      this.clearError();
      return customers;
    } catch (error) {
      this.handleError('Failed to search customers', error);
      throw error;
    }
  }

  /**
   * Export customers
   */
  async exportCustomers(format = 'csv', filters = {}) {
    try {
      const params = new URLSearchParams({
        format,
        ...filters
      });
      
      const response = await this.apiService.get(`/customers/export?${params}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `customers.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      this.clearError();
    } catch (error) {
      this.handleError('Failed to export customers', error);
      throw error;
    }
  }

  /**
   * Import customers
   */
  async importCustomers(file) {
    try {
      this.setLoading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await this.apiService.post('/customers/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Reload customers after import
      await this.loadCustomers();
      
      this.setLoading(false);
      this.clearError();
      return response.data;
    } catch (error) {
      this.handleError('Failed to import customers', error);
      throw error;
    }
  }

  /**
   * Set customer filters
   */
  setCustomerFilters(filters) {
    this.customerModel.setFilters(filters);
  }

  /**
   * Set customer pagination
   */
  setCustomerPagination(pagination) {
    this.customerModel.setPagination(pagination);
  }

  /**
   * Get customer summary
   */
  getCustomerSummary() {
    return this.customerModel.getCustomerSummary();
  }

  /**
   * Get controller summary for debugging
   */
  getSummary() {
    return {
      modelName: this.customerModel.modelName,
      totalCustomers: this.customerModel.customers.length,
      totalGroups: this.customerModel.customerGroups.length,
      totalTags: this.customerModel.customerTags.length,
      totalNotes: this.customerModel.customerNotes.length,
      filters: this.customerModel.filters,
      pagination: this.customerModel.pagination,
      loading: this.loading,
      error: this.error
    };
  }
}

export default CustomerController; 