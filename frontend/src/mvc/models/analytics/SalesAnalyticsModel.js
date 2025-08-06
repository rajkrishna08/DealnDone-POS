import BaseModel from '../base/BaseModel';

/**
 * Sales Analytics Model
 * Manages sales analytics, reporting, and business intelligence
 */
class SalesAnalyticsModel extends BaseModel {
  constructor() {
    super();
    this._state = {
      salesData: [],
      salesMetrics: {
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        conversionRate: 0,
        revenueGrowth: 0,
        topProducts: [],
        topCategories: [],
        salesByPeriod: [],
        salesByLocation: [],
        salesByCustomer: []
      },
      reports: {
        dailySales: [],
        weeklySales: [],
        monthlySales: [],
        yearlySales: [],
        productPerformance: [],
        customerAnalytics: [],
        locationPerformance: []
      },
      filters: {
        dateRange: {
          start: null,
          end: null
        },
        location: 'all',
        category: 'all',
        customer: 'all',
        product: 'all'
      },
      pagination: {
        page: 1,
        limit: 20,
        total: 0
      }
    };
  }

  /**
   * Get sales data
   */
  get salesData() {
    return this._state.salesData;
  }

  /**
   * Get sales metrics
   */
  get salesMetrics() {
    return this._state.salesMetrics;
  }

  /**
   * Get reports
   */
  get reports() {
    return this._state.reports;
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
   * Get filtered sales data
   */
  get filteredSalesData() {
    let filtered = [...this._state.salesData];

    // Apply date range filter
    if (this._state.filters.dateRange.start && this._state.filters.dateRange.end) {
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.date);
        const startDate = new Date(this._state.filters.dateRange.start);
        const endDate = new Date(this._state.filters.dateRange.end);
        return saleDate >= startDate && saleDate <= endDate;
      });
    }

    // Apply location filter
    if (this._state.filters.location !== 'all') {
      filtered = filtered.filter(sale => sale.location === this._state.filters.location);
    }

    // Apply category filter
    if (this._state.filters.category !== 'all') {
      filtered = filtered.filter(sale => sale.category === this._state.filters.category);
    }

    // Apply customer filter
    if (this._state.filters.customer !== 'all') {
      filtered = filtered.filter(sale => sale.customerId === this._state.filters.customer);
    }

    // Apply product filter
    if (this._state.filters.product !== 'all') {
      filtered = filtered.filter(sale => sale.productId === this._state.filters.product);
    }

    return filtered;
  }

  /**
   * Get total sales
   */
  get totalSales() {
    return this._state.salesMetrics.totalSales;
  }

  /**
   * Get total orders
   */
  get totalOrders() {
    return this._state.salesMetrics.totalOrders;
  }

  /**
   * Get average order value
   */
  get averageOrderValue() {
    return this._state.salesMetrics.averageOrderValue;
  }

  /**
   * Get conversion rate
   */
  get conversionRate() {
    return this._state.salesMetrics.conversionRate;
  }

  /**
   * Get revenue growth
   */
  get revenueGrowth() {
    return this._state.salesMetrics.revenueGrowth;
  }

  /**
   * Get top products
   */
  get topProducts() {
    return this._state.salesMetrics.topProducts;
  }

  /**
   * Get top categories
   */
  get topCategories() {
    return this._state.salesMetrics.topCategories;
  }

  /**
   * Set sales data
   */
  setSalesData(data) {
    this.setState({ salesData: data });
    this.calculateMetrics();
  }

  /**
   * Add sales data
   */
  addSalesData(sale) {
    const salesData = [sale, ...this._state.salesData];
    this.setState({ salesData });
    this.calculateMetrics();
  }

  /**
   * Set sales metrics
   */
  setSalesMetrics(metrics) {
    this.setState({ salesMetrics: { ...this._state.salesMetrics, ...metrics } });
  }

  /**
   * Set reports
   */
  setReports(reports) {
    this.setState({ reports: { ...this._state.reports, ...reports } });
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
   * Calculate sales metrics
   */
  calculateMetrics() {
    const salesData = this._state.salesData;
    
    if (salesData.length === 0) {
      this.setSalesMetrics({
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        conversionRate: 0,
        revenueGrowth: 0,
        topProducts: [],
        topCategories: []
      });
      return;
    }

    // Calculate basic metrics
    const totalSales = salesData.reduce((sum, sale) => sum + sale.amount, 0);
    const totalOrders = salesData.length;
    const averageOrderValue = totalSales / totalOrders;

    // Calculate top products
    const productSales = {};
    salesData.forEach(sale => {
      if (sale.productId) {
        productSales[sale.productId] = (productSales[sale.productId] || 0) + sale.amount;
      }
    });
    const topProducts = Object.entries(productSales)
      .map(([productId, amount]) => ({ productId, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    // Calculate top categories
    const categorySales = {};
    salesData.forEach(sale => {
      if (sale.category) {
        categorySales[sale.category] = (categorySales[sale.category] || 0) + sale.amount;
      }
    });
    const topCategories = Object.entries(categorySales)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    // Calculate revenue growth (simplified)
    const currentPeriod = salesData.filter(sale => {
      const saleDate = new Date(sale.date);
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return saleDate >= thirtyDaysAgo;
    });
    const previousPeriod = salesData.filter(sale => {
      const saleDate = new Date(sale.date);
      const now = new Date();
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return saleDate >= sixtyDaysAgo && saleDate < thirtyDaysAgo;
    });

    const currentRevenue = currentPeriod.reduce((sum, sale) => sum + sale.amount, 0);
    const previousRevenue = previousPeriod.reduce((sum, sale) => sum + sale.amount, 0);
    const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    this.setSalesMetrics({
      totalSales,
      totalOrders,
      averageOrderValue,
      conversionRate: 0, // Would need visitor data to calculate
      revenueGrowth,
      topProducts,
      topCategories
    });
  }

  /**
   * Generate daily sales report
   */
  generateDailySalesReport() {
    const salesData = this.filteredSalesData;
    const dailySales = {};

    salesData.forEach(sale => {
      const date = new Date(sale.date).toDateString();
      if (!dailySales[date]) {
        dailySales[date] = {
          date,
          sales: 0,
          orders: 0,
          customers: new Set()
        };
      }
      dailySales[date].sales += sale.amount;
      dailySales[date].orders += 1;
      dailySales[date].customers.add(sale.customerId);
    });

    const report = Object.values(dailySales).map(day => ({
      ...day,
      customers: day.customers.size,
      averageOrderValue: day.sales / day.orders
    }));

    this.setReports({ dailySales: report });
    return report;
  }

  /**
   * Generate weekly sales report
   */
  generateWeeklySalesReport() {
    const salesData = this.filteredSalesData;
    const weeklySales = {};

    salesData.forEach(sale => {
      const date = new Date(sale.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toDateString();

      if (!weeklySales[weekKey]) {
        weeklySales[weekKey] = {
          weekStart: weekKey,
          sales: 0,
          orders: 0,
          customers: new Set()
        };
      }
      weeklySales[weekKey].sales += sale.amount;
      weeklySales[weekKey].orders += 1;
      weeklySales[weekKey].customers.add(sale.customerId);
    });

    const report = Object.values(weeklySales).map(week => ({
      ...week,
      customers: week.customers.size,
      averageOrderValue: week.sales / week.orders
    }));

    this.setReports({ weeklySales: report });
    return report;
  }

  /**
   * Generate monthly sales report
   */
  generateMonthlySalesReport() {
    const salesData = this.filteredSalesData;
    const monthlySales = {};

    salesData.forEach(sale => {
      const date = new Date(sale.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlySales[monthKey]) {
        monthlySales[monthKey] = {
          month: monthKey,
          sales: 0,
          orders: 0,
          customers: new Set()
        };
      }
      monthlySales[monthKey].sales += sale.amount;
      monthlySales[monthKey].orders += 1;
      monthlySales[monthKey].customers.add(sale.customerId);
    });

    const report = Object.values(monthlySales).map(month => ({
      ...month,
      customers: month.customers.size,
      averageOrderValue: month.sales / month.orders
    }));

    this.setReports({ monthlySales: report });
    return report;
  }

  /**
   * Generate product performance report
   */
  generateProductPerformanceReport() {
    const salesData = this.filteredSalesData;
    const productPerformance = {};

    salesData.forEach(sale => {
      if (sale.productId) {
        if (!productPerformance[sale.productId]) {
          productPerformance[sale.productId] = {
            productId: sale.productId,
            productName: sale.productName || 'Unknown',
            sales: 0,
            quantity: 0,
            orders: 0
          };
        }
        productPerformance[sale.productId].sales += sale.amount;
        productPerformance[sale.productId].quantity += sale.quantity || 1;
        productPerformance[sale.productId].orders += 1;
      }
    });

    const report = Object.values(productPerformance)
      .map(product => ({
        ...product,
        averageOrderValue: product.sales / product.orders,
        averageQuantity: product.quantity / product.orders
      }))
      .sort((a, b) => b.sales - a.sales);

    this.setReports({ productPerformance: report });
    return report;
  }

  /**
   * Generate customer analytics report
   */
  generateCustomerAnalyticsReport() {
    const salesData = this.filteredSalesData;
    const customerAnalytics = {};

    salesData.forEach(sale => {
      if (sale.customerId) {
        if (!customerAnalytics[sale.customerId]) {
          customerAnalytics[sale.customerId] = {
            customerId: sale.customerId,
            customerName: sale.customerName || 'Unknown',
            totalSpent: 0,
            orders: 0,
            firstOrder: sale.date,
            lastOrder: sale.date
          };
        }
        customerAnalytics[sale.customerId].totalSpent += sale.amount;
        customerAnalytics[sale.customerId].orders += 1;
        customerAnalytics[sale.customerId].lastOrder = sale.date;
      }
    });

    const report = Object.values(customerAnalytics)
      .map(customer => ({
        ...customer,
        averageOrderValue: customer.totalSpent / customer.orders
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent);

    this.setReports({ customerAnalytics: report });
    return report;
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary() {
    return {
      totalSales: this.totalSales,
      totalOrders: this.totalOrders,
      averageOrderValue: this.averageOrderValue,
      conversionRate: this.conversionRate,
      revenueGrowth: this.revenueGrowth,
      topProducts: this.topProducts.slice(0, 5),
      topCategories: this.topCategories.slice(0, 5),
      recentSales: this._state.salesData.slice(0, 10)
    };
  }

  /**
   * Validate analytics data
   */
  validate(data) {
    const errors = [];

    if (data.amount !== undefined) {
      if (typeof data.amount !== 'number' || data.amount < 0) {
        errors.push('Sales amount must be a non-negative number');
      }
    }

    if (data.date && !this.isValidDate(data.date)) {
      errors.push('Invalid date format');
    }

    return errors;
  }

  /**
   * Validate date format
   */
  isValidDate(date) {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
  }

  /**
   * Transform data for API
   */
  transformForAPI(data) {
    return {
      ...data,
      date: new Date(data.date).toISOString(),
      store_id: localStorage.getItem('currentStoreId')
    };
  }

  /**
   * Transform data from API
   */
  transformFromAPI(data) {
    return {
      ...data,
      date: new Date(data.date),
      amount: parseFloat(data.amount) || 0,
      quantity: parseInt(data.quantity) || 1
    };
  }

  /**
   * Get model name
   */
  get modelName() {
    return 'SalesAnalytics';
  }

  /**
   * Get summary for debugging
   */
  getSummary() {
    return {
      totalSalesData: this._state.salesData.length,
      totalSales: this.totalSales,
      totalOrders: this.totalOrders,
      averageOrderValue: this.averageOrderValue,
      revenueGrowth: this.revenueGrowth,
      filters: this._state.filters,
      pagination: this._state.pagination
    };
  }
}

export default SalesAnalyticsModel; 