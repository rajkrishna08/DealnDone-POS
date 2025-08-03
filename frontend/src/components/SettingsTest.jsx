import React, { useState, useEffect } from 'react';

const SettingsTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [websocket, setWebsocket] = useState(null);
  const [wsMessages, setWsMessages] = useState([]);

  const API_BASE = 'http://127.0.0.1:8003';

  // Test API endpoints
  const testApiEndpoints = async () => {
    setIsLoading(true);
    const results = {};

    try {
      // Test health endpoint
      const healthResponse = await fetch(`${API_BASE}/health`);
      results.health = {
        status: healthResponse.status,
        success: healthResponse.ok,
        data: await healthResponse.json()
      };

      // Test database endpoint
      const dbResponse = await fetch(`${API_BASE}/test-db`);
      results.database = {
        status: dbResponse.status,
        success: dbResponse.ok,
        data: await dbResponse.json()
      };

      // Test settings endpoint
      const settingsResponse = await fetch(`${API_BASE}/api/settings/global`, {
        headers: {
          'X-User-ID': 'test-user',
          'X-Role': 'admin',
          'X-Org-ID': 'test-org'
        }
      });
      results.settings = {
        status: settingsResponse.status,
        success: settingsResponse.ok,
        data: await settingsResponse.json()
      };

      // Test WebSocket connection
      const ws = new WebSocket(`ws://127.0.0.1:8003/ws/settings`);
      
      ws.onopen = () => {
        results.websocket = { status: 'connected', success: true };
        setWebsocket(ws);
        
        // Send test message
        ws.send(JSON.stringify({
          type: 'ping',
          message: 'Test connection'
        }));
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setWsMessages(prev => [...prev, message]);
      };

      ws.onerror = (error) => {
        results.websocket = { status: 'error', success: false, error: error.message };
      };

      ws.onclose = () => {
        results.websocket = { status: 'closed', success: false };
      };

    } catch (error) {
      results.error = error.message;
    }

    setTestResults(results);
    setIsLoading(false);
  };

  // Test settings update
  const testSettingsUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/settings/global/test-setting`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': 'test-user',
          'X-Role': 'admin',
          'X-Org-ID': 'test-org'
        },
        body: JSON.stringify({
          value: { test: 'value', timestamp: new Date().toISOString() },
          encrypted: false,
          description: 'Test setting from frontend'
        })
      });

      const result = await response.json();
      setTestResults(prev => ({
        ...prev,
        settingsUpdate: {
          status: response.status,
          success: response.ok,
          data: result
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        settingsUpdate: {
          status: 'error',
          success: false,
          error: error.message
        }
      }));
    }
  };

  // Send WebSocket message
  const sendWsMessage = (message) => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify(message));
    }
  };

  useEffect(() => {
    testApiEndpoints();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings System Test</h2>
      
      {/* Test Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">API Test Results</h3>
        
        {isLoading && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Running tests...</span>
          </div>
        )}

        {/* Health Endpoint */}
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900">Health Endpoint</h4>
          {testResults.health && (
            <div className={`mt-2 p-2 rounded ${testResults.health.success ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="text-sm">
                <span className="font-medium">Status:</span> {testResults.health.status}
              </div>
              <div className="text-sm">
                <span className="font-medium">Success:</span> {testResults.health.success ? '✅' : '❌'}
              </div>
              {testResults.health.data && (
                <pre className="text-xs mt-1 bg-gray-100 p-2 rounded">
                  {JSON.stringify(testResults.health.data, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* Database Test */}
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900">Database Test</h4>
          {testResults.database && (
            <div className={`mt-2 p-2 rounded ${testResults.database.success ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="text-sm">
                <span className="font-medium">Status:</span> {testResults.database.status}
              </div>
              <div className="text-sm">
                <span className="font-medium">Success:</span> {testResults.database.success ? '✅' : '❌'}
              </div>
              {testResults.database.data && (
                <pre className="text-xs mt-1 bg-gray-100 p-2 rounded">
                  {JSON.stringify(testResults.database.data, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* Settings API */}
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900">Settings API</h4>
          {testResults.settings && (
            <div className={`mt-2 p-2 rounded ${testResults.settings.success ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="text-sm">
                <span className="font-medium">Status:</span> {testResults.settings.status}
              </div>
              <div className="text-sm">
                <span className="font-medium">Success:</span> {testResults.settings.success ? '✅' : '❌'}
              </div>
              {testResults.settings.data && (
                <div className="text-xs mt-1">
                  <span className="font-medium">Settings Count:</span> {testResults.settings.data.length}
                </div>
              )}
            </div>
          )}
        </div>

        {/* WebSocket Test */}
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900">WebSocket Test</h4>
          {testResults.websocket && (
            <div className={`mt-2 p-2 rounded ${testResults.websocket.success ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="text-sm">
                <span className="font-medium">Status:</span> {testResults.websocket.status}
              </div>
              <div className="text-sm">
                <span className="font-medium">Success:</span> {testResults.websocket.success ? '✅' : '❌'}
              </div>
            </div>
          )}
          
          {/* WebSocket Messages */}
          {wsMessages.length > 0 && (
            <div className="mt-2">
              <h5 className="text-sm font-medium">Messages:</h5>
              <div className="max-h-32 overflow-y-auto">
                {wsMessages.map((msg, index) => (
                  <div key={index} className="text-xs bg-gray-100 p-1 rounded mt-1">
                    {JSON.stringify(msg)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings Update Test */}
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900">Settings Update Test</h4>
          <button
            onClick={testSettingsUpdate}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            Test Settings Update
          </button>
          {testResults.settingsUpdate && (
            <div className={`mt-2 p-2 rounded ${testResults.settingsUpdate.success ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="text-sm">
                <span className="font-medium">Status:</span> {testResults.settingsUpdate.status}
              </div>
              <div className="text-sm">
                <span className="font-medium">Success:</span> {testResults.settingsUpdate.success ? '✅' : '❌'}
              </div>
              {testResults.settingsUpdate.data && (
                <pre className="text-xs mt-1 bg-gray-100 p-2 rounded">
                  {JSON.stringify(testResults.settingsUpdate.data, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>

      {/* WebSocket Controls */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">WebSocket Controls</h3>
        <div className="space-y-2">
          <button
            onClick={() => sendWsMessage({ type: 'ping', message: 'Hello from frontend!' })}
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
          >
            Send Ping
          </button>
          <button
            onClick={() => sendWsMessage({ 
              type: 'settings_update', 
              key: 'test_setting', 
              value: { updated: true, timestamp: new Date().toISOString() }
            })}
            className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 ml-2"
          >
            Send Settings Update
          </button>
        </div>
      </div>

      {/* Error Display */}
      {testResults.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {testResults.error}
        </div>
      )}
    </div>
  );
};

export default SettingsTest; 