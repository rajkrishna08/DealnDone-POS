import BaseModel from '../base/BaseModel';

/**
 * Customer Model
 * Manages customer data, profiles, and customer-related operations
 */
class CustomerModel extends BaseModel {
  constructor() {
    super();
    this._state = {
      customers: [],
      customerGroups: [],
      customerTags: [],
      customerNotes: [],
      customerHistory: [],
      customerSettings: {
        loyaltyEnabled: true,
        autoDiscountEnabled: false,
        customerRatingEnabled: true,
        defaultDiscount: 0
      },
      filters: {
        group: '',
        status: 'all', // active, inactive, vip
        search: '',
        rating: 'all' // 1-5 stars
      },
      pagination: {
        page: 1,
        limit: 20,
        total: 0
      }
    };
  }

  /**
   * Get all customers
   */
  get customers() {
    return this._state.customers;
  }

  /**
   * Get customer groups
   */
  get customerGroups() {
    return this._state.customerGroups;
  }

  /**
   * Get customer tags
   */
  get customerTags() {
    return this._state.customerTags;
  }

  /**
   * Get customer notes
   */
  get customerNotes() {
    return this._state.customerNotes;
  }

  /**
   * Get customer history
   */
  get customerHistory() {
    return this._state.customerHistory;
  }

  /**
   * Get customer settings
   */
  get customerSettings() {
    return this._state.customerSettings;
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
   * Get filtered customers
   */
  get filteredCustomers() {
    let filtered = [...this._state.customers];

    // Apply group filter
    if (this._state.filters.group) {
      filtered = filtered.filter(customer => 
        customer.group === this._state.filters.group
      );
    }

    // Apply status filter
    if (this._state.filters.status !== 'all') {
      filtered = filtered.filter(customer => {
        switch (this._state.filters.status) {
          case 'active':
            return customer.status === 'active';
          case 'inactive':
            return customer.status === 'inactive';
          case 'vip':
            return customer.isVip === true;
          default:
            return true;
        }
      });
    }

    // Apply rating filter
    if (this._state.filters.rating !== 'all') {
      const rating = parseInt(this._state.filters.rating);
      filtered = filtered.filter(customer => 
        customer.rating >= rating
      );
    }

    // Apply search filter
    if (this._state.filters.search) {
      const searchTerm = this._state.filters.search.toLowerCase();
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.phone.toLowerCase().includes(searchTerm) ||
        customer.address.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }

  /**
   * Get active customers
   */
  get activeCustomers() {
    return this._state.customers.filter(customer => customer.status === 'active');
  }

  /**
   * Get VIP customers
   */
  get vipCustomers() {
    return this._state.customers.filter(customer => customer.isVip === true);
  }

  /**
   * Get customers by group
   */
  getCustomersByGroup(group) {
    return this._state.customers.filter(customer => customer.group === group);
  }

  /**
   * Get customer by ID
   */
  getCustomerById(id) {
    return this._state.customers.find(customer => customer.id === id);
  }

  /**
   * Get customer notes
   */
  getCustomerNotes(customerId) {
    return this._state.customerNotes.filter(note => note.customerId === customerId);
  }

  /**
   * Get customer history
   */
  getCustomerHistory(customerId) {
    return this._state.customerHistory.filter(entry => entry.customerId === customerId);
  }

  /**
   * Set customers
   */
  setCustomers(customers) {
    this.setState({ customers });
  }

  /**
   * Add customer
   */
  addCustomer(customer) {
    const customers = [customer, ...this._state.customers];
    this.setState({ customers });
  }

  /**
   * Update customer
   */
  updateCustomer(customerId, updates) {
    const customers = this._state.customers.map(customer => 
      customer.id === customerId ? { ...customer, ...updates } : customer
    );
    this.setState({ customers });
  }

  /**
   * Delete customer
   */
  deleteCustomer(customerId) {
    const customers = this._state.customers.filter(customer => customer.id !== customerId);
    this.setState({ customers });
  }

  /**
   * Set customer groups
   */
  setCustomerGroups(groups) {
    this.setState({ customerGroups: groups });
  }

  /**
   * Set customer tags
   */
  setCustomerTags(tags) {
    this.setState({ customerTags: tags });
  }

  /**
   * Set customer notes
   */
  setCustomerNotes(notes) {
    this.setState({ customerNotes: notes });
  }

  /**
   * Add customer note
   */
  addCustomerNote(note) {
    const notes = [note, ...this._state.customerNotes];
    this.setState({ customerNotes: notes });
  }

  /**
   * Set customer history
   */
  setCustomerHistory(history) {
    this.setState({ customerHistory: history });
  }

  /**
   * Add customer history entry
   */
  addCustomerHistoryEntry(entry) {
    const history = [entry, ...this._state.customerHistory];
    this.setState({ customerHistory: history });
  }

  /**
   * Set customer settings
   */
  setCustomerSettings(settings) {
    this.setState({ customerSettings: { ...this._state.customerSettings, ...settings } });
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
   * Get customer summary
   */
  getCustomerSummary(customerId) {
    const customer = this.getCustomerById(customerId);
    if (!customer) return null;

    const notes = this.getCustomerNotes(customerId);
    const history = this.getCustomerHistory(customerId);

    const totalOrders = history.filter(entry => entry.type === 'order').length;
    const totalSpent = history
      .filter(entry => entry.type === 'order')
      .reduce((sum, entry) => sum + (entry.amount || 0), 0);
    const recentOrders = history
      .filter(entry => entry.type === 'order')
      .slice(0, 5);
    const recentNotes = notes.slice(0, 5);

    return {
      customer,
      notes,
      totalOrders,
      totalSpent,
      recentOrders,
      recentNotes,
      history: history.slice(0, 10)
    };
  }

  /**
   * Get overall customer summary
   */
  getOverallCustomerSummary() {
    const totalCustomers = this._state.customers.length;
    const activeCustomers = this.activeCustomers.length;
    const vipCustomers = this.vipCustomers.length;
    const totalOrders = this._state.customerHistory.filter(entry => entry.type === 'order').length;
    const totalRevenue = this._state.customerHistory
      .filter(entry => entry.type === 'order')
      .reduce((sum, entry) => sum + (entry.amount || 0), 0);

    const averageRating = this._state.customers.length > 0 ? 
      this._state.customers.reduce((sum, customer) => sum + (customer.rating || 0), 0) / this._state.customers.length : 0;

    return {
      totalCustomers,
      activeCustomers,
      vipCustomers,
      totalOrders,
      totalRevenue,
      averageRating
    };
  }

  /**
   * Validate customer data
   */
  validate(data) {
    const errors = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Customer name is required');
    }

    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.push('Invalid phone format');
    }

    if (data.rating !== undefined) {
      if (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
        errors.push('Rating must be between 1 and 5');
      }
    }

    return errors;
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone format
   */
  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  /**
   * Transform data for API
   */
  transformForAPI(data) {
    return {
      ...data,
      name: data.name?.trim(),
      email: data.email?.trim().toLowerCase(),
      phone: data.phone?.trim(),
      address: data.address?.trim(),
      created_at: new Date().toISOString(),
      store_id: localStorage.getItem('currentStoreId')
    };
  }

  /**
   * Transform data from API
   */
  transformFromAPI(data) {
    return {
      ...data,
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      group: data.group,
      status: data.status || 'active',
      rating: parseFloat(data.rating) || 0,
      isVip: data.is_vip || false,
      loyaltyPoints: parseInt(data.loyalty_points) || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  /**
   * Get model name
   */
  get modelName() {
    return 'Customer';
  }

  /**
   * Get summary for debugging
   */
  getSummary() {
    return {
      totalCustomers: this._state.customers.length,
      activeCustomers: this.activeCustomers.length,
      vipCustomers: this.vipCustomers.length,
      totalGroups: this._state.customerGroups.length,
      totalNotes: this._state.customerNotes.length,
      totalHistory: this._state.customerHistory.length,
      filters: this._state.filters,
      pagination: this._state.pagination
    };
  }
}

export default CustomerModel; 