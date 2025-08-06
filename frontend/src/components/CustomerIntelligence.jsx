import React, { useState, useEffect } from 'react';
import { 
  Users, 
  User, 
  Heart, 
  Star, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  MapPin,
  Calendar,
  Clock,
  Filter,
  Search,
  Download,
  Share2,
  Eye,
  EyeOff,
  Target,
  Award,
  Crown,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  PieChart,
  BarChart3,
  LineChart,
  Activity,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Gift,
  Tag,
  CreditCard,
  Package
} from 'lucide-react';

// Helper functions
const getGrowthIcon = (value) => {
  if (value > 0) return <ArrowUp className="w-4 h-4 text-green-500" />;
  if (value < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-gray-500" />;
};

const getSegmentColor = (segment) => {
  const colors = {
    'vip': 'bg-purple-100 text-purple-600',
    'loyal': 'bg-blue-100 text-blue-600',
    'regular': 'bg-green-100 text-green-600',
    'new': 'bg-orange-100 text-orange-600',
    'at-risk': 'bg-red-100 text-red-600'
  };
  return colors[segment] || 'bg-gray-100 text-gray-600';
};

const CustomerIntelligence = ({ onNavigate, user, currentStore }) => {
  const [activeTab, setActiveTab] = useState('segments');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState({
    segments: [],
    behaviors: [],
    lifetimeValue: [],
    satisfaction: [],
    predictions: [],
    insights: []
  });

  useEffect(() => {
    fetchCustomerData();
  }, [dateRange, selectedSegment]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchSegments(),
        fetchBehaviors(),
        fetchLifetimeValue(),
        fetchSatisfaction(),
        fetchPredictions(),
        fetchInsights()
      ]);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSegments = async () => {
    setCustomerData(prev => ({
      ...prev,
      segments: [
        {
          id: 'vip',
          name: 'VIP Customers',
          count: 45,
          revenue: 125000,
          avgOrder: 450,
          retention: 95,
          color: 'purple',
          criteria: 'Spent >$1000, 10+ orders'
        },
        {
          id: 'loyal',
          name: 'Loyal Customers',
          count: 234,
          revenue: 89000,
          avgOrder: 180,
          retention: 88,
          color: 'blue',
          criteria: '5-10 orders, 6+ months'
        },
        {
          id: 'regular',
          name: 'Regular Customers',
          count: 567,
          revenue: 67000,
          avgOrder: 95,
          retention: 72,
          color: 'green',
          criteria: '2-5 orders, 3+ months'
        },
        {
          id: 'new',
          name: 'New Customers',
          count: 1234,
          revenue: 45000,
          avgOrder: 65,
          retention: 45,
          color: 'orange',
          criteria: '1-2 orders, <3 months'
        },
        {
          id: 'at-risk',
          name: 'At-Risk Customers',
          count: 89,
          revenue: 12000,
          avgOrder: 45,
          retention: 25,
          color: 'red',
          criteria: 'No orders in 3+ months'
        }
      ]
    }));
  };

  const fetchBehaviors = async () => {
    setCustomerData(prev => ({
      ...prev,
      behaviors: [
        {
          pattern: 'Weekend Shoppers',
          count: 456,
          avgSpend: 125,
          frequency: '2.3x/month',
          peakHours: 'Sat 2-6 PM'
        },
        {
          pattern: 'Morning Buyers',
          count: 234,
          avgSpend: 89,
          frequency: '1.8x/month',
          peakHours: 'Mon-Fri 9-11 AM'
        },
        {
          pattern: 'Evening Shoppers',
          count: 345,
          avgSpend: 156,
          frequency: '2.1x/month',
          peakHours: 'Mon-Fri 6-9 PM'
        },
        {
          pattern: 'Sale Hunters',
          count: 178,
          avgSpend: 67,
          frequency: '1.2x/month',
          peakHours: 'Any time'
        }
      ]
    }));
  };

  const fetchLifetimeValue = async () => {
    setCustomerData(prev => ({
      ...prev,
      lifetimeValue: [
        { segment: 'VIP', avgLTV: 2500, projected: 3200, growth: 28 },
        { segment: 'Loyal', avgLTV: 850, projected: 1100, growth: 29 },
        { segment: 'Regular', avgLTV: 420, projected: 580, growth: 38 },
        { segment: 'New', avgLTV: 120, projected: 280, growth: 133 },
        { segment: 'At-Risk', avgLTV: 180, projected: 150, growth: -17 }
      ]
    }));
  };

  const fetchSatisfaction = async () => {
    setCustomerData(prev => ({
      ...prev,
      satisfaction: [
        { metric: 'Overall Satisfaction', score: 4.6, trend: 'up', reviews: 1247 },
        { metric: 'Product Quality', score: 4.8, trend: 'up', reviews: 1156 },
        { metric: 'Customer Service', score: 4.4, trend: 'stable', reviews: 892 },
        { metric: 'Delivery Speed', score: 4.2, trend: 'down', reviews: 678 },
        { metric: 'Value for Money', score: 4.5, trend: 'up', reviews: 1034 }
      ]
    }));
  };

  const fetchPredictions = async () => {
    setCustomerData(prev => ({
      ...prev,
      predictions: [
        {
          type: 'churn_risk',
          customers: 23,
          risk: 'High',
          reason: 'No activity in 60+ days',
          action: 'Re-engagement campaign'
        },
        {
          type: 'upsell_opportunity',
          customers: 156,
          potential: 'Medium',
          reason: 'High engagement, low spend',
          action: 'Premium product recommendations'
        },
        {
          type: 'loyalty_opportunity',
          customers: 89,
          potential: 'High',
          reason: 'Consistent purchases, no loyalty signup',
          action: 'Loyalty program invitation'
        }
      ]
    }));
  };

  const fetchInsights = async () => {
    setCustomerData(prev => ({
      ...prev,
      insights: [
        {
          type: 'trend',
          title: 'VIP customers prefer premium products',
          description: '85% of VIP segment purchases premium items',
          impact: 'High',
          action: 'Increase premium inventory'
        },
        {
          type: 'opportunity',
          title: 'New customers respond well to welcome offers',
          description: 'Conversion rate increases 40% with welcome discount',
          impact: 'Medium',
          action: 'Optimize welcome flow'
        },
        {
          type: 'risk',
          title: 'At-risk segment showing signs of recovery',
          description: '15% of at-risk customers made purchases this month',
          impact: 'Low',
          action: 'Continue retention campaigns'
        }
      ]
    }));
  };



  const tabs = [
    { id: 'segments', name: 'Customer Segments', icon: Users },
    { id: 'behaviors', name: 'Behavior Analysis', icon: Activity },
    { id: 'lifetime', name: 'Lifetime Value', icon: DollarSign },
    { id: 'satisfaction', name: 'Satisfaction', icon: Star },
    { id: 'predictions', name: 'AI Predictions', icon: Target },
    { id: 'insights', name: 'Insights', icon: Award }
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
            <h1 className="text-3xl font-bold text-gray-900">Customer Intelligence</h1>
            <p className="text-gray-600">Deep insights into customer behavior and preferences</p>
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
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
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
        {activeTab === 'segments' && <SegmentsTab data={customerData.segments} />}
        {activeTab === 'behaviors' && <BehaviorsTab data={customerData.behaviors} />}
        {activeTab === 'lifetime' && <LifetimeTab data={customerData.lifetimeValue} />}
        {activeTab === 'satisfaction' && <SatisfactionTab data={customerData.satisfaction} />}
        {activeTab === 'predictions' && <PredictionsTab data={customerData.predictions} />}
        {activeTab === 'insights' && <InsightsTab data={customerData.insights} />}
      </div>
    </div>
  );
};

// Segments Tab Component
const SegmentsTab = ({ data }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Segments</h2>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Segments Overview */}
      <div className="space-y-4">
        {data.map((segment) => (
          <div key={segment.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSegmentColor(segment.color)}`}>
                  {segment.name}
                </div>
                <span className="text-sm text-gray-500">{segment.count} customers</span>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Details
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-lg font-bold text-gray-900">${segment.revenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Order</p>
                <p className="text-lg font-bold text-gray-900">${segment.avgOrder}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Retention</p>
                <p className="text-lg font-bold text-gray-900">{segment.retention}%</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p><strong>Criteria:</strong> {segment.criteria}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Segment Analytics */}
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Segment Distribution</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Interactive Pie Chart
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue by Segment</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Interactive Bar Chart
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Behaviors Tab Component
const BehaviorsTab = ({ data }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Behavior Analysis</h2>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Behavior Patterns */}
      <div className="space-y-4">
        {data.map((behavior, index) => (
          <div key={index} className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{behavior.pattern}</h3>
              <span className="text-sm text-gray-500">{behavior.count} customers</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Avg Spend</p>
                <p className="text-lg font-bold text-gray-900">${behavior.avgSpend}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Frequency</p>
                <p className="text-lg font-bold text-gray-900">{behavior.frequency}</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p><strong>Peak Hours:</strong> {behavior.peakHours}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Behavior Analytics */}
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Shopping Patterns</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Interactive Heatmap
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Purchase Frequency</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Interactive Line Chart
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Lifetime Value Tab Component
const LifetimeTab = ({ data }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Lifetime Value</h2>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LTV Data */}
      <div className="space-y-4">
        {data.map((segment, index) => (
          <div key={index} className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{segment.segment}</h3>
              <div className="flex items-center space-x-2">
                {getGrowthIcon(segment.growth)}
                <span className={`text-sm font-medium ${segment.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {segment.growth}%
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Current LTV</p>
                <p className="text-lg font-bold text-gray-900">${segment.avgLTV}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Projected LTV</p>
                <p className="text-lg font-bold text-blue-600">${segment.projected}</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(segment.avgLTV / 3000) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* LTV Analytics */}
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">LTV Growth Trend</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Interactive Line Chart
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">LTV by Segment</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Interactive Bar Chart
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Satisfaction Tab Component
const SatisfactionTab = ({ data }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Satisfaction</h2>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Satisfaction Metrics */}
      <div className="space-y-4">
        {data.map((metric, index) => (
          <div key={index} className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{metric.metric}</h3>
              <div className="flex items-center space-x-2">
                {getGrowthIcon(metric.trend === 'up' ? 1 : metric.trend === 'down' ? -1 : 0)}
                <span className="text-sm text-gray-500">{metric.reviews} reviews</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl font-bold text-gray-900">{metric.score}</div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-5 h-5 ${
                      star <= metric.score 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(metric.score / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Satisfaction Analytics */}
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Satisfaction Trends</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Interactive Line Chart
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Review Sentiment</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Interactive Pie Chart
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Predictions Tab Component
const PredictionsTab = ({ data }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Predictions & Opportunities</h2>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Predictions */}
      <div className="space-y-4">
        {data.map((prediction, index) => (
          <div key={index} className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {prediction.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                prediction.risk === 'High' || prediction.potential === 'High'
                  ? 'bg-red-100 text-red-600'
                  : prediction.risk === 'Medium' || prediction.potential === 'Medium'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-green-100 text-green-600'
              }`}>
                {prediction.risk || prediction.potential}
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">{prediction.reason}</p>
              <p className="text-sm font-medium text-gray-900">{prediction.customers} customers affected</p>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Recommended Action:</span>
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                {prediction.action}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Prediction Analytics */}
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Prediction Accuracy</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Interactive Accuracy Chart
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Opportunity Impact</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Interactive Impact Chart
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Insights Tab Component
const InsightsTab = ({ data }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Insights</h2>
    
    <div className="space-y-4">
      {data.map((insight, index) => (
        <div key={index} className="bg-white border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                insight.type === 'trend' ? 'bg-blue-100' :
                insight.type === 'opportunity' ? 'bg-green-100' :
                'bg-orange-100'
              }`}>
                {insight.type === 'trend' && <TrendingUp className="w-5 h-5 text-blue-600" />}
                {insight.type === 'opportunity' && <Award className="w-5 h-5 text-green-600" />}
                {insight.type === 'risk' && <AlertCircle className="w-5 h-5 text-orange-600" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              insight.impact === 'High' ? 'bg-red-100 text-red-600' :
              insight.impact === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
              'bg-green-100 text-green-600'
            }`}>
              {insight.impact} Impact
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Recommended Action:</span>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
              {insight.action}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CustomerIntelligence; 