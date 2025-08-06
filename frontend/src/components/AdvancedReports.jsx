import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package,
  Calendar,
  Filter,
  Download,
  Eye,
  EyeOff,
  RefreshCw,
  PieChart,
  Activity,
  Target,
  Award,
  Clock,
  MapPin,
  ShoppingCart,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

// Helper functions - moved outside component
const getAlertIcon = (type) => {
  switch (type) {
    case 'low_stock': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    case 'expiring': return <Clock className="w-4 h-4 text-red-500" />;
    case 'overstock': return <Package className="w-4 h-4 text-blue-500" />;
    default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
  }
};

const getGrowthIcon = (value) => {
  if (value > 0) return <ArrowUp className="w-4 h-4 text-green-500" />;
  if (value < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-gray-500" />;
};

const AdvancedReports = ({ onNavigate, user, currentStore }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    sales: { total: 0, growth: 0, trend: [] },
    products: { top: [], lowStock: [] },
    customers: { total: 0, new: 0, retention: 0 },
    performance: { conversion: 0, avgOrder: 0, peakHours: [] },
    inventory: { turnover: 0, value: 0, alerts: [] },
    analytics: { heatmap: [], predictions: [] }
  });

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      // Simulate API calls for different report sections
      await Promise.all([
        fetchSalesData(),
        fetchProductData(),
        fetchCustomerData(),
        fetchPerformanceData(),
        fetchInventoryData(),
        fetchAnalyticsData()
      ]);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesData = async () => {
    // Simulate sales data
    setReportData(prev => ({
      ...prev,
      sales: {
        total: 15420.50,
        growth: 12.5,
        trend: [
          { date: '2024-01-01', value: 1200 },
          { date: '2024-01-02', value: 1350 },
          { date: '2024-01-03', value: 1100 },
          { date: '2024-01-04', value: 1600 },
          { date: '2024-01-05', value: 1800 }
        ]
      }
    }));
  };

  const fetchProductData = async () => {
    setReportData(prev => ({
      ...prev,
      products: {
        top: [
          { name: 'Premium Shirt', sales: 45, revenue: 2250 },
          { name: 'Casual Pants', sales: 38, revenue: 1900 },
          { name: 'Designer Jacket', sales: 22, revenue: 3300 }
        ],
        lowStock: [
          { name: 'Limited Edition Hat', stock: 3, threshold: 10 },
          { name: 'Exclusive Watch', stock: 1, threshold: 5 },
          { name: 'Rare Sneakers', stock: 2, threshold: 8 }
        ]
      }
    }));
  };

  const fetchCustomerData = async () => {
    setReportData(prev => ({
      ...prev,
      customers: {
        total: 1247,
        new: 89,
        retention: 78.5
      }
    }));
  };

  const fetchPerformanceData = async () => {
    setReportData(prev => ({
      ...prev,
      performance: {
        conversion: 3.2,
        avgOrder: 124.50,
        peakHours: [
          { hour: '10:00', sales: 12 },
          { hour: '11:00', sales: 18 },
          { hour: '12:00', sales: 25 },
          { hour: '13:00', sales: 22 },
          { hour: '14:00', sales: 19 },
          { hour: '15:00', sales: 16 },
          { hour: '16:00', sales: 14 },
          { hour: '17:00', sales: 20 }
        ]
      }
    }));
  };

  const fetchInventoryData = async () => {
    setReportData(prev => ({
      ...prev,
      inventory: {
        turnover: 4.2,
        value: 45600,
        alerts: [
          { type: 'low_stock', product: 'Premium Shirt', current: 5, threshold: 10 },
          { type: 'expiring', product: 'Seasonal Items', daysLeft: 7 },
          { type: 'overstock', product: 'Old Collection', current: 150, threshold: 50 }
        ]
      }
    }));
  };

  const fetchAnalyticsData = async () => {
    setReportData(prev => ({
      ...prev,
      analytics: {
        heatmap: [
          { day: 'Mon', hour: 10, intensity: 0.8 },
          { day: 'Mon', hour: 14, intensity: 0.9 },
          { day: 'Tue', hour: 11, intensity: 0.7 },
          { day: 'Wed', hour: 12, intensity: 1.0 },
          { day: 'Thu', hour: 15, intensity: 0.6 },
          { day: 'Fri', hour: 16, intensity: 0.9 },
          { day: 'Sat', hour: 13, intensity: 0.8 },
          { day: 'Sun', hour: 14, intensity: 0.5 }
        ],
        predictions: [
          { metric: 'Sales', current: 15420, predicted: 16800, confidence: 0.85 },
          { metric: 'Customers', current: 1247, predicted: 1320, confidence: 0.78 },
          { metric: 'Conversion', current: 3.2, predicted: 3.5, confidence: 0.72 }
        ]
      }
    }));
  };

  // Fix User reference
  const currentUser = {
    name: 'Store Manager',
    role: 'manager',
    store: 'Main Store'
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'sales', name: 'Sales Analytics', icon: TrendingUp },
    { id: 'products', name: 'Product Performance', icon: Package },
    { id: 'customers', name: 'Customer Insights', icon: Users },
    { id: 'inventory', name: 'Inventory Management', icon: Activity },
    { id: 'predictions', name: 'AI Predictions', icon: Target }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Reports</h1>
            <p className="text-gray-600">Comprehensive analytics and insights for {currentStore?.name || 'your store'}</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={fetchReportData}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-lg">
        {activeTab === 'overview' && <OverviewTab data={reportData} />}
        {activeTab === 'sales' && <SalesTab data={reportData.sales} />}
        {activeTab === 'products' && <ProductsTab data={reportData.products} />}
        {activeTab === 'customers' && <CustomersTab data={reportData.customers} />}
        {activeTab === 'inventory' && <InventoryTab data={reportData.inventory} />}
        {activeTab === 'predictions' && <PredictionsTab data={reportData.analytics} />}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ data }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Overview</h2>
    
    {/* Key Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total Sales"
        value={`$${data.sales.total.toLocaleString()}`}
        growth={data.sales.growth}
        icon={DollarSign}
        color="blue"
      />
      <MetricCard
        title="Total Customers"
        value={data.customers.total.toLocaleString()}
        growth={12.3}
        icon={Users}
        color="green"
      />
      <MetricCard
        title="Conversion Rate"
        value={`${data.performance.conversion}%`}
        growth={0.8}
        icon={Target}
        color="purple"
      />
      <MetricCard
        title="Avg Order Value"
        value={`$${data.performance.avgOrder}`}
        growth={-2.1}
        icon={ShoppingCart}
        color="orange"
      />
    </div>

    {/* Charts Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Sales Trend" type="line" />
      <ChartCard title="Top Products" type="bar" />
      <ChartCard title="Customer Retention" type="doughnut" />
      <ChartCard title="Peak Hours" type="heatmap" />
    </div>
  </div>
);

// Sales Tab Component
const SalesTab = ({ data }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Sales Analytics</h2>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Interactive Chart Placeholder
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900">Sales Growth</h4>
          <p className="text-2xl font-bold text-blue-600">{data.growth}%</p>
          <p className="text-sm text-blue-700">vs last period</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-900">Total Revenue</h4>
          <p className="text-2xl font-bold text-green-600">${data.total.toLocaleString()}</p>
          <p className="text-sm text-green-700">This period</p>
        </div>
      </div>
    </div>
  </div>
);

// Products Tab Component
const ProductsTab = ({ data }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Performance</h2>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Products */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
        <div className="space-y-4">
          {data.top.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">{product.sales} units sold</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">${product.revenue}</p>
                <p className="text-xs text-gray-500">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Low Stock Alerts</h3>
        <div className="space-y-3">
          {data.lowStock.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-red-600">{item.stock} units left</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                Reorder
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Customers Tab Component
const CustomersTab = ({ data }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Insights</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <MetricCard
        title="Total Customers"
        value={data.total.toLocaleString()}
        growth={12.3}
        icon={Users}
        color="blue"
      />
      <MetricCard
        title="New Customers"
        value={data.new.toLocaleString()}
        growth={8.7}
        icon={Users}
        color="green"
      />
      <MetricCard
        title="Retention Rate"
        value={`${data.retention}%`}
        growth={2.1}
        icon={Star}
        color="purple"
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Segments</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Customer Segmentation Chart
        </div>
      </div>
      
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Lifetime Value</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          CLV Analysis Chart
        </div>
      </div>
    </div>
  </div>
);

// Inventory Tab Component
const InventoryTab = ({ data }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Inventory Management</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <MetricCard
        title="Turnover Rate"
        value={`${data.turnover}x`}
        growth={0.3}
        icon={RefreshCw}
        color="blue"
      />
      <MetricCard
        title="Inventory Value"
        value={`$${data.value.toLocaleString()}`}
        growth={-5.2}
        icon={Package}
        color="green"
      />
      <MetricCard
        title="Stock Alerts"
        value={data.alerts.length}
        growth={2}
        icon={AlertTriangle}
        color="red"
      />
    </div>

    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Inventory Alerts</h3>
      <div className="space-y-3">
        {data.alerts.map((alert, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {getAlertIcon(alert.type)}
              <div>
                <p className="font-medium">{alert.product}</p>
                <p className="text-sm text-gray-600">
                  {alert.type === 'low_stock' && `${alert.current}/${alert.threshold} units`}
                  {alert.type === 'expiring' && `${alert.daysLeft} days left`}
                  {alert.type === 'overstock' && `${alert.current} units (threshold: ${alert.threshold})`}
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Take Action
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Predictions Tab Component
const PredictionsTab = ({ data }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Predictions & Insights</h2>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Sales Forecast</h3>
        <div className="space-y-4">
          {data.predictions.map((prediction, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{prediction.metric}</p>
                <p className="text-sm text-gray-600">
                  Current: {prediction.current.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600">
                  {prediction.predicted.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {prediction.confidence * 100}% confidence
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Peak Hours Heatmap</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Interactive Heatmap Chart
        </div>
      </div>
    </div>
  </div>
);

// Reusable Components
const MetricCard = ({ title, value, growth, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 bg-${color}-100 rounded-lg`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
    </div>
    <div className="mt-4 flex items-center space-x-2">
      {getGrowthIcon(growth)}
      <span className={`text-sm font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {Math.abs(growth)}%
      </span>
      <span className="text-sm text-gray-500">vs last period</span>
    </div>
  </div>
);

const ChartCard = ({ title, type }) => (
  <div className="bg-white border rounded-lg p-6">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="h-64 flex items-center justify-center text-gray-500">
      {type.charAt(0).toUpperCase() + type.slice(1)} Chart Placeholder
    </div>
  </div>
);

export default AdvancedReports; 