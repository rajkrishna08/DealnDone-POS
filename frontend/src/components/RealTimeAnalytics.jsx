import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Clock,
  MapPin,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RefreshCw,
  Download,
  Share2,
  Settings,
  Eye,
  EyeOff,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Target,
  Award,
  Star,
  Heart,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

const RealTimeAnalytics = ({ onNavigate, user, currentStore }) => {
  const [isLive, setIsLive] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [liveData, setLiveData] = useState({
    activeUsers: 0,
    currentSales: 0,
    pendingOrders: 0,
    conversionRate: 0,
    avgSessionTime: 0,
    topProducts: [],
    recentActivity: [],
    salesVelocity: 0,
    customerSatisfaction: 0,
    inventoryAlerts: []
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [visibleMetrics, setVisibleMetrics] = useState({
    sales: true,
    users: true,
    products: true,
    satisfaction: true
  });
  
  const intervalRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (isLive) {
      startLiveStream();
    } else {
      stopLiveStream();
    }

    return () => stopLiveStream();
  }, [isLive]);

  const startLiveStream = () => {
    // Simulate WebSocket connection
    setConnectionStatus('connecting');
    
    setTimeout(() => {
      setConnectionStatus('connected');
      // Start data updates
      intervalRef.current = setInterval(updateLiveData, 2000);
    }, 1000);
  };

  const stopLiveStream = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionStatus('disconnected');
  };

  const updateLiveData = () => {
    setLiveData(prev => ({
      activeUsers: Math.floor(Math.random() * 50) + 10,
      currentSales: prev.currentSales + Math.floor(Math.random() * 100),
      pendingOrders: Math.floor(Math.random() * 20) + 5,
      conversionRate: (Math.random() * 5 + 2).toFixed(1),
      avgSessionTime: Math.floor(Math.random() * 15) + 5,
      topProducts: [
        { name: 'Premium Shirt', sales: Math.floor(Math.random() * 10) + 5 },
        { name: 'Casual Pants', sales: Math.floor(Math.random() * 8) + 3 },
        { name: 'Designer Jacket', sales: Math.floor(Math.random() * 5) + 2 }
      ],
      recentActivity: [
        {
          type: 'sale',
          message: 'New sale: Premium Shirt - $125',
          time: new Date().toLocaleTimeString(),
          amount: 125
        },
        {
          type: 'user',
          message: 'New customer registered',
          time: new Date().toLocaleTimeString(),
          user: 'john.doe@email.com'
        },
        {
          type: 'inventory',
          message: 'Low stock alert: Limited Edition Hat',
          time: new Date().toLocaleTimeString(),
          product: 'Limited Edition Hat'
        }
      ].slice(0, 5),
      salesVelocity: (Math.random() * 50 + 20).toFixed(1),
      customerSatisfaction: (Math.random() * 20 + 80).toFixed(1),
      inventoryAlerts: [
        { product: 'Premium Shirt', stock: 5, threshold: 10 },
        { product: 'Exclusive Watch', stock: 1, threshold: 5 }
      ]
    }));
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'connecting': return 'text-yellow-600 bg-yellow-100';
      case 'disconnected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="w-4 h-4" />;
      case 'connecting': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'disconnected': return <WifiOff className="w-4 h-4" />;
      default: return <Wifi className="w-4 h-4" />;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'sale': return <ShoppingCart className="w-4 h-4 text-green-500" />;
      case 'user': return <Users className="w-4 h-4 text-blue-500" />;
      case 'inventory': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Real-Time Analytics</h1>
            <p className="text-gray-600">Live insights and monitoring for {currentStore?.name || 'your store'}</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getConnectionStatusColor()}`}>
              {getConnectionStatusIcon()}
              <span className="text-sm font-medium capitalize">{connectionStatus}</span>
            </div>

            {/* Live Toggle */}
            <button
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                isLive 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isLive ? 'Stop Live' : 'Start Live'}</span>
            </button>

            {/* Timeframe Selector */}
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>

            {/* Export Button */}
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <LiveMetricCard
          title="Active Users"
          value={liveData.activeUsers}
          icon={Users}
          color="blue"
          trend="up"
          visible={visibleMetrics.users}
        />
        <LiveMetricCard
          title="Current Sales"
          value={`$${liveData.currentSales.toLocaleString()}`}
          icon={DollarSign}
          color="green"
          trend="up"
          visible={visibleMetrics.sales}
        />
        <LiveMetricCard
          title="Pending Orders"
          value={liveData.pendingOrders}
          icon={ShoppingCart}
          color="orange"
          trend="stable"
          visible={visibleMetrics.sales}
        />
        <LiveMetricCard
          title="Conversion Rate"
          value={`${liveData.conversionRate}%`}
          icon={Target}
          color="purple"
          trend="up"
          visible={visibleMetrics.sales}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Activity Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Live Activity Feed</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {liveData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  {activity.amount && (
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">${activity.amount}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-6">
          {/* Sales Velocity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Velocity</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">${liveData.salesVelocity}</p>
              <p className="text-sm text-gray-600">per hour</p>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(liveData.salesVelocity / 100) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Customer Satisfaction */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{liveData.customerSatisfaction}%</p>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-5 h-5 ${
                      star <= liveData.customerSatisfaction / 20 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Session Time */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Avg Session Time</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{liveData.avgSessionTime}m</p>
              <p className="text-sm text-gray-600">average</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products (Live)</h3>
          <div className="space-y-3">
            {liveData.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">${(product.sales * 25).toFixed(0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Alerts</h3>
          <div className="space-y-3">
            {liveData.inventoryAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900">{alert.product}</p>
                    <p className="text-sm text-red-600">{alert.stock} units left</p>
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
};

// Live Metric Card Component
const LiveMetricCard = ({ title, value, icon: Icon, color, trend, visible }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!visible) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`p-3 bg-${color}-100 rounded-lg`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
          {getTrendIcon()}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Live data</span>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAnalytics; 