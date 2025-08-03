import React, { useEffect, useState } from 'react';
import { Activity, Users, Clock, CheckCircle, XCircle, Zap } from 'lucide-react';

const OrchestratorMonitor = () => {
  const [actions, setActions] = useState([]);
  const [health, setHealth] = useState({ status: "Loading...", uptime: "N/A" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orchestrator logs
        const logsRes = await fetch("/api/ai/orchestrator/logs", {
          headers: { 
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json"
          }
        });
        
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setActions(logsData.logs || []);
        }

        // Fetch health
        const healthRes = await fetch("/api/ai/orchestrator/health");
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setHealth(healthData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching orchestrator data:", error);
        setLoading(false);
      }
    };

    fetchData();

    // Poll every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'unhealthy':
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'unhealthy':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Master Orchestrator Monitor</h2>
      </div>
      
      {/* Health Status */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Orchestrator Health</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            {getStatusIcon(health.status)}
            <span>Status: <span className={`font-semibold ${health.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
              {health.status}
            </span></span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span>Sub-Agents: <span className="font-semibold">{health.sub_agents || 0}</span></span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>Last Check: <span className="font-semibold">
              {health.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'N/A'}
            </span></span>
          </div>
        </div>
      </div>

      {/* Action Logs */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">AI Orchestration Actions</h3>
          <span className="text-sm text-gray-500">({actions.length} actions)</span>
        </div>
        
        {actions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No orchestration actions yet</p>
            <p className="text-sm">Actions will appear here when the Master Orchestrator assigns tasks to sub-agents</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Agent</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Details</th>
                </tr>
              </thead>
              <tbody>
                {actions.map((action, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{action.action}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {action.user_id || 'orchestrator'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(action.success ? 'success' : 'failed')}`}>
                        {getStatusIcon(action.success ? 'success' : 'failed')}
                        <span className="ml-1">{action.success ? 'Success' : 'Failed'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {action.created_at ? new Date(action.created_at).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {action.details ? (
                          typeof action.details === 'object' ? 
                            JSON.stringify(action.details).substring(0, 50) + '...' :
                            action.details.substring(0, 50) + '...'
                        ) : 'No details'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => window.location.href = '/mcp-dashboard'}
            className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Zap className="w-4 h-4 text-blue-600" />
            <span>View MCP Dashboard</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/settings'}
            className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Activity className="w-4 h-4 text-green-600" />
            <span>System Settings</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/dealbot'}
            className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="w-4 h-4 text-purple-600" />
            <span>DealBot AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrchestratorMonitor; 