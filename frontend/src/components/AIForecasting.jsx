import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar,
  Package,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Filter,
  Search,
  Eye,
  Settings,
  X
} from 'lucide-react';
import { AIForecastingGate } from './FeatureGate';

const AIForecasting = ({ currentPlan = 'basic' }) => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [timeRange, setTimeRange] = useState('30');
  const [forecastType, setForecastType] = useState('all');

  // Mock forecast data
  const mockForecasts = [
    {
      id: 1,
      type: 'inventory',
      product: 'Premium Cotton T-Shirt',
      currentStock: 150,
      predictedDemand: 200,
      recommendedOrder: 50,
      confidence: 85,
      trend: 'up',
      lastUpdated: '2024-01-20',
      nextUpdate: '2024-01-25'
    },
    {
      id: 2,
      type: 'sales',
      product: 'Wireless Headphones',
      currentSales: 45,
      predictedSales: 78,
      growthRate: 73,
      confidence: 92,
      trend: 'up',
      lastUpdated: '2024-01-20',
      nextUpdate: '2024-01-25'
    },
    {
      id: 3,
      type: 'inventory',
      product: 'Smart Watch',
      currentStock: 25,
      predictedDemand: 80,
      recommendedOrder: 55,
      confidence: 78,
      trend: 'up',
      lastUpdated: '2024-01-20',
      nextUpdate: '2024-01-25'
    },
    {
      id: 4,
      type: 'sales',
      product: 'Running Shoes',
      currentSales: 120,
      predictedSales: 95,
      growthRate: -21,
      confidence: 88,
      trend: 'down',
      lastUpdated: '2024-01-20',
      nextUpdate: '2024-01-25'
    }
  ];

  useEffect(() => {
    setForecasts(mockForecasts);
  }, []);

  const generateForecast = async () => {
    setLoading(true);
    try {
      // Simulate AI forecast generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add new forecast
      const newForecast = {
        id: Date.now(),
        type: forecastType === 'all' ? (Math.random() > 0.5 ? 'inventory' : 'sales') : forecastType,
        product: 'New Product Forecast',
        currentStock: Math.floor(Math.random() * 200),
        predictedDemand: Math.floor(Math.random() * 300),
        recommendedOrder: Math.floor(Math.random() * 100),
        currentSales: Math.floor(Math.random() * 150),
        predictedSales: Math.floor(Math.random() * 200),
        growthRate: Math.floor(Math.random() * 100) - 50,
        confidence: Math.floor(Math.random() * 20) + 80,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        lastUpdated: new Date().toISOString().split('T')[0],
        nextUpdate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      
      setForecasts([newForecast, ...forecasts]);
    } catch (error) {
      console.error('Forecast generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredForecasts = forecasts.filter(forecast => {
    if (forecastType !== 'all' && forecast.type !== forecastType) {
      return false;
    }
    return true;
  });

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 
      <TrendingUp className="w-4 h-4 text-green-600" /> : 
      <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <AIForecastingGate currentPlan={currentPlan}>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Forecasting</h1>
            <p className="text-gray-600 mt-2">Predictive analytics for inventory and sales optimization</p>
          </div>
          <button
            onClick={generateForecast}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Forecast
              </>
            )}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inventory Forecasts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {forecasts.filter(f => f.type === 'inventory').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sales Forecasts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {forecasts.filter(f => f.type === 'sales').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(forecasts.reduce((sum, f) => sum + f.confidence, 0) / forecasts.length)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Next Update</p>
                <p className="text-2xl font-bold text-gray-900">5 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search forecasts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={forecastType}
                onChange={(e) => setForecastType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="inventory">Inventory</option>
                <option value="sales">Sales</option>
              </select>
              
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Forecasts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredForecasts.map((forecast) => (
            <div key={forecast.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{forecast.product}</h3>
                  <p className="text-sm text-gray-500 capitalize">{forecast.type} Forecast</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(forecast.trend)}
                  <span className={`text-sm font-medium ${getConfidenceColor(forecast.confidence)}`}>
                    {forecast.confidence}% confidence
                  </span>
                </div>
              </div>

              {forecast.type === 'inventory' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Current Stock</p>
                      <p className="text-2xl font-bold text-gray-900">{forecast.currentStock}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Predicted Demand</p>
                      <p className="text-2xl font-bold text-blue-600">{forecast.predictedDemand}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Recommended Order</p>
                      <p className="text-2xl font-bold text-green-600">{forecast.recommendedOrder}</p>
                    </div>
                  </div>
                  
                  {forecast.currentStock < forecast.predictedDemand * 0.5 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                        <span className="text-sm text-red-800">
                          Low stock alert! Consider ordering {forecast.recommendedOrder} units.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Current Sales</p>
                      <p className="text-2xl font-bold text-gray-900">{forecast.currentSales}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Predicted Sales</p>
                      <p className="text-2xl font-bold text-blue-600">{forecast.predictedSales}</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Growth Rate</p>
                    <p className={`text-lg font-bold ${forecast.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {forecast.growthRate >= 0 ? '+' : ''}{forecast.growthRate}%
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Last updated: {forecast.lastUpdated}</span>
                  <span>Next update: {forecast.nextUpdate}</span>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => setSelectedForecast(forecast)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4 mr-1 inline" />
                  View Details
                </button>
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Forecast Detail Modal */}
        {selectedForecast && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Forecast Details</h2>
                    <p className="text-gray-600 mt-1">{selectedForecast.product}</p>
                  </div>
                  <button
                    onClick={() => setSelectedForecast(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Forecast Type</h3>
                      <p className="text-sm text-gray-600 capitalize">{selectedForecast.type}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Confidence Level</h3>
                      <p className={`text-sm font-medium ${getConfidenceColor(selectedForecast.confidence)}`}>
                        {selectedForecast.confidence}%
                      </p>
                    </div>
                  </div>

                  {selectedForecast.type === 'inventory' ? (
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Inventory Analysis</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Current Stock</p>
                          <p className="text-2xl font-bold text-blue-600">{selectedForecast.currentStock}</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600">Predicted Demand</p>
                          <p className="text-2xl font-bold text-green-600">{selectedForecast.predictedDemand}</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <p className="text-sm text-gray-600">Recommended Order</p>
                          <p className="text-2xl font-bold text-purple-600">{selectedForecast.recommendedOrder}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Sales Analysis</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Current Sales</p>
                          <p className="text-2xl font-bold text-blue-600">{selectedForecast.currentSales}</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600">Predicted Sales</p>
                          <p className="text-2xl font-bold text-green-600">{selectedForecast.predictedSales}</p>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-gray-600">Growth Rate</p>
                        <p className={`text-2xl font-bold ${selectedForecast.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedForecast.growthRate >= 0 ? '+' : ''}{selectedForecast.growthRate}%
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Recommendations</h3>
                    <div className="space-y-2">
                      {selectedForecast.type === 'inventory' && selectedForecast.currentStock < selectedForecast.predictedDemand * 0.5 && (
                        <div className="flex items-center p-3 bg-red-50 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                          <span className="text-sm text-red-800">
                            Order {selectedForecast.recommendedOrder} units to meet predicted demand
                          </span>
                        </div>
                      )}
                      {selectedForecast.type === 'sales' && selectedForecast.growthRate < 0 && (
                        <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="text-sm text-yellow-800">
                            Consider promotional strategies to boost sales
                          </span>
                        </div>
                      )}
                      <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm text-green-800">
                          Forecast will be updated on {selectedForecast.nextUpdate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AIForecastingGate>
  );
};

export default AIForecasting; 