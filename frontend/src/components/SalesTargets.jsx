import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Edit,
  Plus,
  Trophy,
  Download
} from 'lucide-react';

const SalesTargets = () => {
  const [targets] = useState([
    {
      id: 1,
      name: 'Monthly Revenue Target',
      type: 'revenue',
      target: 150000,
      current: 125000,
      period: 'August 2025',
      status: 'in-progress',
      progress: 83.3,
      team: 'All Sales',
      deadline: '2025-08-31'
    },
    {
      id: 2,
      name: 'New Customer Acquisition',
      type: 'customers',
      target: 500,
      current: 450,
      period: 'August 2025',
      status: 'on-track',
      progress: 90.0,
      team: 'Marketing Team',
      deadline: '2025-08-31'
    },
    {
      id: 3,
      name: 'Product Sales Target',
      type: 'units',
      target: 2000,
      current: 1800,
      period: 'August 2025',
      status: 'ahead',
      progress: 90.0,
      team: 'Sales Team',
      deadline: '2025-08-31'
    },
    {
      id: 4,
      name: 'Average Order Value',
      type: 'aov',
      target: 120,
      current: 100,
      period: 'August 2025',
      status: 'behind',
      progress: 83.3,
      team: 'Sales Team',
      deadline: '2025-08-31'
    }
  ]);

  const [selectedTarget, setSelectedTarget] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'ahead': return 'bg-green-100 text-green-800';
      case 'on-track': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'behind': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ahead': return <CheckCircle className="w-4 h-4" />;
      case 'on-track': return <TrendingUp className="w-4 h-4" />;
      case 'in-progress': return <AlertTriangle className="w-4 h-4" />;
      case 'behind': return <XCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ahead': return 'Ahead of Schedule';
      case 'on-track': return 'On Track';
      case 'in-progress': return 'In Progress';
      case 'behind': return 'Behind Schedule';
      default: return 'Unknown';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'bg-green-600';
    if (progress >= 75) return 'bg-blue-600';
    if (progress >= 50) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const filteredTargets = targets.filter(target => {
    if (activeTab === 'all') return true;
    return target.status === activeTab;
  });

  const stats = {
    total: targets.length,
    ahead: targets.filter(t => t.status === 'ahead').length,
    onTrack: targets.filter(t => t.status === 'on-track').length,
    behind: targets.filter(t => t.status === 'behind').length,
    averageProgress: targets.reduce((sum, target) => sum + target.progress, 0) / targets.length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Sales Targets</h1>
          <div className="text-sm text-gray-500">
            Set and track sales goals and performance targets
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button className="deal-n-done-btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
          <button className="deal-n-done-btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Target
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Targets</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ahead of Schedule</p>
                <p className="text-2xl font-bold text-gray-900">{stats.ahead}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Track</p>
                <p className="text-2xl font-bold text-gray-900">{stats.onTrack}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Behind Schedule</p>
                <p className="text-2xl font-bold text-gray-900">{stats.behind}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="deal-n-done-card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Progress</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${getProgressColor(stats.averageProgress)}`}
                  style={{ width: `${stats.averageProgress}%` }}
                ></div>
              </div>
            </div>
            <span className="text-lg font-bold text-gray-900">{stats.averageProgress.toFixed(1)}%</span>
          </div>
        </div>

        {/* Targets Table */}
        <div className="deal-n-done-card">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Targets ({stats.total})
              </button>
              <button
                onClick={() => setActiveTab('ahead')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ahead' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Ahead ({stats.ahead})
              </button>
              <button
                onClick={() => setActiveTab('on-track')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'on-track' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                On Track ({stats.onTrack})
              </button>
              <button
                onClick={() => setActiveTab('behind')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'behind' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Behind ({stats.behind})
              </button>
            </nav>
          </div>

          {/* Targets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTargets.map((target) => (
              <div key={target.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{target.name}</h3>
                    <p className="text-sm text-gray-600">{target.period}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(target.status)}`}>
                    {getStatusIcon(target.status)}
                    {getStatusText(target.status)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">{target.progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(target.progress)}`}
                      style={{ width: `${target.progress}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Current</p>
                      <p className="text-sm font-medium text-gray-900">
                        {target.type === 'revenue' ? '$' : ''}{target.current.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Target</p>
                      <p className="text-sm font-medium text-gray-900">
                        {target.type === 'revenue' ? '$' : ''}{target.target.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Team: {target.team}</span>
                    <span>Due: {target.deadline}</span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedTarget(target)}
                      className="flex-1 text-center py-2 px-3 text-sm font-medium text-blue-600 hover:text-blue-900 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 inline mr-1" />
                      View Details
                    </button>
                    <button className="flex-1 text-center py-2 px-3 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                      <Edit className="w-4 h-4 inline mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target Detail Modal */}
      {selectedTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Target Details</h2>
              <button
                onClick={() => setSelectedTarget(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Target Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Name:</strong> {selectedTarget.name}</p>
                    <p><strong>Type:</strong> {selectedTarget.type}</p>
                    <p><strong>Period:</strong> {selectedTarget.period}</p>
                    <p><strong>Team:</strong> {selectedTarget.team}</p>
                  </div>
                  <div>
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTarget.status)}`}>
                        {getStatusIcon(selectedTarget.status)}
                        {getStatusText(selectedTarget.status)}
                      </span>
                    </p>
                    <p><strong>Deadline:</strong> {selectedTarget.deadline}</p>
                    <p><strong>Progress:</strong> {selectedTarget.progress.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Current Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedTarget.type === 'revenue' ? '$' : ''}{selectedTarget.current.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Target Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedTarget.type === 'revenue' ? '$' : ''}{selectedTarget.target.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Progress Visualization</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">{selectedTarget.progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full ${getProgressColor(selectedTarget.progress)}`}
                      style={{ width: `${selectedTarget.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex space-x-2">
                  <button className="deal-n-done-btn-secondary">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Target
                  </button>
                  <button className="deal-n-done-btn-primary">
                    <Trophy className="w-4 h-4 mr-2" />
                    Update Progress
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTargets; 