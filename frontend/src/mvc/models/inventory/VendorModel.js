import BaseModel from '../base/BaseModel';

/**
 * Vendor Model
 * Manages vendor data, relationships, and vendor operations
 */
class VendorModel extends BaseModel {
  constructor() {
    super();
    this._state = {
      vendors: [],
      vendorCategories: [],
      vendorContacts: [],
      vendorProducts: [],
      vendorOrders: [],
      vendorPayments: [],
      vendorHistory: [],
      vendorSettings: {
        defaultPaymentTerms: 30,
        autoReorderEnabled: false,
        preferredVendors: [],
        vendorRatingEnabled: true
      },
      filters: {
        category: '',
        status: 'all', // active, inactive, preferred
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
   * Get all vendors
   */
  get vendors() {
    return this._state.vendors;
  }

  /**
   * Get vendor categories
   */
  get vendorCategories() {
    return this._state.vendorCategories;
  }

  /**
   * Get vendor contacts
   */
  get vendorContacts() {
    return this._state.vendorContacts;
  }

  /**
   * Get vendor products
   */
  get vendorProducts() {
    return this._state.vendorProducts;
  }

  /**
   * Get vendor orders
   */
  get vendorOrders() {
    return this._state.vendorOrders;
  }

  /**
   * Get vendor payments
   */
  get vendorPayments() {
    return this._state.vendorPayments;
  }

  /**
   * Get vendor history
   */
  get vendorHistory() {
    return this._state.vendorHistory;
  }

  /**
   * Get vendor settings
   */
  get vendorSettings() {
    return this._state.vendorSettings;
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
   * Get filtered vendors
   */
  get filteredVendors() {
    let filtered = [...this._state.vendors];

    // Apply category filter
    if (this._state.filters.category) {
      filtered = filtered.filter(vendor => 
        vendor.category === this._state.filters.category
      );
    }

    // Apply status filter
    if (this._state.filters.status !== 'all') {
      filtered = filtered.filter(vendor => {
        switch (this._state.filters.status) {
          case 'active':
            return vendor.status === 'active';
          case 'inactive':
            return vendor.status === 'inactive';
          case 'preferred':
            return vendor.isPreferred === true;
          default:
            return true;
        }
      });
    }

    // Apply rating filter
    if (this._state.filters.rating !== 'all') {
      const rating = parseInt(this._state.filters.rating);
      filtered = filtered.filter(vendor => 
        vendor.rating >= rating
      );
    }

    // Apply search filter
    if (this._state.filters.search) {
      const searchTerm = this._state.filters.search.toLowerCase();
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm) ||
        vendor.email.toLowerCase().includes(searchTerm) ||
        vendor.phone.toLowerCase().includes(searchTerm) ||
        vendor.address.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }

  /**
   * Get active vendors
   */
  get activeVendors() {
    return this._state.vendors.filter(vendor => vendor.status === 'active');
  }

  /**
   * Get preferred vendors
   */
  get preferredVendors() {
    return this._state.vendors.filter(vendor => vendor.isPreferred === true);
  }

  /**
   * Get vendors by category
   */
  getVendorsByCategory(category) {
    return this._state.vendors.filter(vendor => vendor.category === category);
  }

  /**
   * Get vendor by ID
   */
  getVendorById(id) {
    return this._state.vendors.find(vendor => vendor.id === id);
  }

  /**
   * Get vendor contacts
   */
  getVendorContacts(vendorId) {
    return this._state.vendorContacts.filter(contact => contact.vendorId === vendorId);
  }

  /**
   * Get vendor products
   */
  getVendorProducts(vendorId) {
    return this._state.vendorProducts.filter(product => product.vendorId === vendorId);
  }

  /**
   * Get vendor orders
   */
  getVendorOrders(vendorId) {
    return this._state.vendorOrders.filter(order => order.vendorId === vendorId);
  }

  /**
   * Get vendor payments
   */
  getVendorPayments(vendorId) {
    return this._state.vendorPayments.filter(payment => payment.vendorId === vendorId);
  }

  /**
   * Get vendor history
   */
  getVendorHistory(vendorId) {
    return this._state.vendorHistory.filter(entry => entry.vendorId === vendorId);
  }

  /**
   * Set vendors
   */
  setVendors(vendors) {
    this.setState({ vendors });
  }

  /**
   * Add vendor
   */
  addVendor(vendor) {
    const vendors = [vendor, ...this._state.vendors];
    this.setState({ vendors });
  }

  /**
   * Update vendor
   */
  updateVendor(vendorId, updates) {
    const vendors = this._state.vendors.map(vendor => 
      vendor.id === vendorId ? { ...vendor, ...updates } : vendor
    );
    this.setState({ vendors });
  }

  /**
   * Delete vendor
   */
  deleteVendor(vendorId) {
    const vendors = this._state.vendors.filter(vendor => vendor.id !== vendorId);
    this.setState({ vendors });
  }

  /**
   * Set vendor categories
   */
  setVendorCategories(categories) {
    this.setState({ vendorCategories: categories });
  }

  /**
   * Set vendor contacts
   */
  setVendorContacts(contacts) {
    this.setState({ vendorContacts: contacts });
  }

  /**
   * Add vendor contact
   */
  addVendorContact(contact) {
    const contacts = [contact, ...this._state.vendorContacts];
    this.setState({ vendorContacts: contacts });
  }

  /**
   * Set vendor products
   */
  setVendorProducts(products) {
    this.setState({ vendorProducts: products });
  }

  /**
   * Add vendor product
   */
  addVendorProduct(product) {
    const products = [product, ...this._state.vendorProducts];
    this.setState({ vendorProducts: products });
  }

  /**
   * Set vendor orders
   */
  setVendorOrders(orders) {
    this.setState({ vendorOrders: orders });
  }

  /**
   * Add vendor order
   */
  addVendorOrder(order) {
    const orders = [order, ...this._state.vendorOrders];
    this.setState({ vendorOrders: orders });
  }

  /**
   * Set vendor payments
   */
  setVendorPayments(payments) {
    this.setState({ vendorPayments: payments });
  }

  /**
   * Add vendor payment
   */
  addVendorPayment(payment) {
    const payments = [payment, ...this._state.vendorPayments];
    this.setState({ vendorPayments: payments });
  }

  /**
   * Set vendor history
   */
  setVendorHistory(history) {
    this.setState({ vendorHistory: history });
  }

  /**
   * Add vendor history entry
   */
  addVendorHistoryEntry(entry) {
    const history = [entry, ...this._state.vendorHistory];
    this.setState({ vendorHistory: history });
  }

  /**
   * Set vendor settings
   */
  setVendorSettings(settings) {
    this.setState({ vendorSettings: { ...this._state.vendorSettings, ...settings } });
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
   * Get vendor summary
   */
  getVendorSummary(vendorId) {
    const vendor = this.getVendorById(vendorId);
    if (!vendor) return null;

    const contacts = this.getVendorContacts(vendorId);
    const products = this.getVendorProducts(vendorId);
    const orders = this.getVendorOrders(vendorId);
    const payments = this.getVendorPayments(vendorId);
    const history = this.getVendorHistory(vendorId);

    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const recentOrders = orders.slice(0, 5);
    const recentPayments = payments.slice(0, 5);

    return {
      vendor,
      contacts,
      totalOrders,
      totalProducts,
      totalPayments,
      recentOrders,
      recentPayments,
      history: history.slice(0, 10)
    };
  }

  /**
   * Get overall vendor summary
   */
  getOverallVendorSummary() {
    const totalVendors = this._state.vendors.length;
    const activeVendors = this.activeVendors.length;
    const preferredVendors = this.preferredVendors.length;
    const totalOrders = this._state.vendorOrders.length;
    const totalPayments = this._state.vendorPayments.reduce((sum, payment) => sum + payment.amount, 0);

    const averageRating = this._state.vendors.length > 0 ? 
      this._state.vendors.reduce((sum, vendor) => sum + (vendor.rating || 0), 0) / this._state.vendors.length : 0;

    return {
      totalVendors,
      activeVendors,
      preferredVendors,
      totalOrders,
      totalPayments,
      averageRating
    };
  }

  /**
   * Validate vendor data
   */
  validate(data) {
    const errors = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Vendor name is required');
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
      category: data.category,
      status: data.status || 'active',
      rating: parseFloat(data.rating) || 0,
      isPreferred: data.is_preferred || false,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  /**
   * Get model name
   */
  get modelName() {
    return 'Vendor';
  }

  /**
   * Get summary for debugging
   */
  getSummary() {
    return {
      totalVendors: this._state.vendors.length,
      activeVendors: this.activeVendors.length,
      preferredVendors: this.preferredVendors.length,
      totalContacts: this._state.vendorContacts.length,
      totalProducts: this._state.vendorProducts.length,
      totalOrders: this._state.vendorOrders.length,
      totalPayments: this._state.vendorPayments.length,
      filters: this._state.filters,
      pagination: this._state.pagination
    };
  }
}

export default VendorModel; 