import BaseController from '../base/BaseController';
import apiService from '../../services/api/ApiService';

/**
 * Analytics Controller
 * Handles analytics business logic, API interactions, and data management
 */
class AnalyticsController extends BaseController {
  constructor(salesAnalyticsModel) {
    super(salesAnalyticsModel);
    this.salesAnalyticsModel = salesAnalyticsModel;
    this.apiService = apiService;
  }

  /**
   * Initialize analytics data
   */
  async initialize() {
    try {
      this.setLoading(true);
      
      // Load all analytics data in parallel
      const [salesData, metrics, reports] = await Promise.all([
        this.loadSalesData(),
        this.loadSalesMetrics(),
        this.loadAnalyticsReports()
      ]);

      // Update model with loaded data
      this.salesAnalyticsModel.setSalesData(salesData);
      this.salesAnalyticsModel.setSalesMetrics(metrics);
      this.salesAnalyticsModel.setReports(reports);

      this.setLoading(false);
      this.clearError();
    } catch (error) {
      this.handleError('Failed to initialize analytics data', error);
    }
  }

  /**
   * Load sales data from API
   */
  async loadSalesData() {
    try {
      const response = await this.apiService.get('/analytics/sales');
      return response.data.map(sale => this.salesAnalyticsModel.transformFromAPI(sale));
    } catch (error) {
      console.error('Failed to load sales data:', error);
      return [];
    }
  }

  /**
   * Load sales metrics from API
   */
  async loadSalesMetrics() {
    try {
      const response = await this.apiService.get('/analytics/metrics');
      return response.data;
    } catch (error) {
      console.error('Failed to load sales metrics:', error);
      return {};
    }
  }

  /**
   * Load analytics reports from API
   */
  async loadAnalyticsReports() {
    try {
      const response = await this.apiService.get('/analytics/reports');
      return response.data;
    } catch (error) {
      console.error('Failed to load analytics reports:', error);
      return {};
    }
  }

  /**
   * Generate daily sales report
   */
  async generateDailySalesReport() {
    try {
      this.setLoading(true);
      
      const response = await this.apiService.get('/analytics/reports/daily-sales');
      const report = response.data;
      
      // Update model
      this.salesAnalyticsModel.setReports({ dailySales: report });
      
      this.setLoading(false);
      this.clearError();
      return report;
    } catch (error) {
      this.handleError('Failed to generate daily sales report', error);
      throw error;
    }
  }

  /**
   * Generate weekly sales report
   */
  async generateWeeklySalesReport() {
    try {
      this.setLoading(true);
      
      const response = await this.apiService.get('/analytics/reports/weekly-sales');
      const report = response.data;
      
      // Update model
      this.salesAnalyticsModel.setReports({ weeklySales: report });
      
      this.setLoading(false);
      this.clearError();
      return report;
    } catch (error) {
      this.handleError('Failed to generate weekly sales report', error);
      throw error;
    }
  }

  /**
   * Generate monthly sales report
   */
  async generateMonthlySalesReport() {
    try {
      this.setLoading(true);
      
      const response = await this.apiService.get('/analytics/reports/monthly-sales');
      const report = response.data;
      
      // Update model
      this.salesAnalyticsModel.setReports({ monthlySales: report });
      
      this.setLoading(false);
      this.clearError();
      return report;
    } catch (error) {
      this.handleError('Failed to generate monthly sales report', error);
      throw error;
    }
  }

  /**
   * Generate product performance report
   */
  async generateProductPerformanceReport() {
    try {
      this.setLoading(true);
      
      const response = await this.apiService.get('/analytics/reports/product-performance');
      const report = response.data;
      
      // Update model
      this.salesAnalyticsModel.setReports({ productPerformance: report });
      
      this.setLoading(false);
      this.clearError();
      return report;
    } catch (error) {
      this.handleError('Failed to generate product performance report', error);
      throw error;
    }
  }

  /**
   * Generate customer analytics report
   */
  async generateCustomerAnalyticsReport() {
    try {
      this.setLoading(true);
      
      const response = await this.apiService.get('/analytics/reports/customer-analytics');
      const report = response.data;
      
      // Update model
      this.salesAnalyticsModel.setReports({ customerAnalytics: report });
      
      this.setLoading(false);
      this.clearError();
      return report;
    } catch (error) {
      this.handleError('Failed to generate customer analytics report', error);
      throw error;
    }
  }

  /**
   * Get real-time analytics
   */
  async getRealTimeAnalytics() {
    try {
      const response = await this.apiService.get('/analytics/realtime');
      return response.data;
    } catch (error) {
      this.handleError('Failed to get real-time analytics', error);
      throw error;
    }
  }

  /**
   * Get dashboard metrics
   */
  async getDashboardMetrics() {
    try {
      const response = await this.apiService.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      this.handleError('Failed to get dashboard metrics', error);
      throw error;
    }
  }

  /**
   * Get revenue trends
   */
  async getRevenueTrends(period = '30d') {
    try {
      const response = await this.apiService.get(`/analytics/revenue-trends?period=${period}`);
      return response.data;
    } catch (error) {
      this.handleError('Failed to get revenue trends', error);
      throw error;
    }
  }

  /**
   * Get top performing products
   */
  async getTopPerformingProducts(limit = 10) {
    try {
      const response = await this.apiService.get(`/analytics/top-products?limit=${limit}`);
      return response.data;
    } catch (error) {
      this.handleError('Failed to get top performing products', error);
      throw error;
    }
  }

  /**
   * Get customer segmentation
   */
  async getCustomerSegmentation() {
    try {
      const response = await this.apiService.get('/analytics/customer-segmentation');
      return response.data;
    } catch (error) {
      this.handleError('Failed to get customer segmentation', error);
      throw error;
    }
  }

  /**
   * Get inventory analytics
   */
  async getInventoryAnalytics() {
    try {
      const response = await this.apiService.get('/analytics/inventory');
      return response.data;
    } catch (error) {
      this.handleError('Failed to get inventory analytics', error);
      throw error;
    }
  }

  /**
   * Get sales forecasting
   */
  async getSalesForecasting(period = '30d') {
    try {
      const response = await this.apiService.get(`/analytics/forecasting?period=${period}`);
      return response.data;
    } catch (error) {
      this.handleError('Failed to get sales forecasting', error);
      throw error;
    }
  }

  /**
   * Export analytics report
   */
  async exportAnalyticsReport(reportType, format = 'csv', filters = {}) {
    try {
      const params = new URLSearchParams({
        type: reportType,
        format,
        ...filters
      });
      
      const response = await this.apiService.get(`/analytics/export?${params}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      this.clearError();
    } catch (error) {
      this.handleError('Failed to export analytics report', error);
      throw error;
    }
  }

  /**
   * Set analytics filters
   */
  setAnalyticsFilters(filters) {
    this.salesAnalyticsModel.setFilters(filters);
  }

  /**
   * Set analytics pagination
   */
  setAnalyticsPagination(pagination) {
    this.salesAnalyticsModel.setPagination(pagination);
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary() {
    return this.salesAnalyticsModel.getAnalyticsSummary();
  }

  /**
   * Calculate metrics
   */
  calculateMetrics() {
    this.salesAnalyticsModel.calculateMetrics();
  }

  /**
   * Get controller summary for debugging
   */
  getSummary() {
    return {
      modelName: this.salesAnalyticsModel.modelName,
      totalSalesData: this.salesAnalyticsModel.salesData.length,
      totalSales: this.salesAnalyticsModel.totalSales,
      totalOrders: this.salesAnalyticsModel.totalOrders,
      averageOrderValue: this.salesAnalyticsModel.averageOrderValue,
      revenueGrowth: this.salesAnalyticsModel.revenueGrowth,
      filters: this.salesAnalyticsModel.filters,
      pagination: this.salesAnalyticsModel.pagination,
      loading: this.loading,
      error: this.error
    };
  }
}

export default AnalyticsController; 