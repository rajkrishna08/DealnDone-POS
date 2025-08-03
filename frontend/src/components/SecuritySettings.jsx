import React, { useState, useEffect } from 'react';

const SecuritySettings = ({ onBackToSettings }) => {
  const [security, setSecurity] = useState({
    mfaEnabled: false,
    mfaMethod: 'authenticator', // 'authenticator', 'sms', 'email'
    sessionTimeout: 30, // minutes
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90 // days
    },
    ipWhitelist: [],
    suspiciousActivityAlerts: true,
    auditLogRetention: 365, // days
    apiRateLimit: 1000, // requests per hour
    encryptionLevel: 'AES-256'
  });

  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [mfaSecret, setMfaSecret] = useState('');
  const [mfaQrCode, setMfaQrCode] = useState('');
  const [newIpAddress, setNewIpAddress] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const mfaMethods = [
    { value: 'authenticator', label: 'Authenticator App (Google, Authy)', icon: '📱' },
    { value: 'sms', label: 'SMS Text Message', icon: '📞' },
    { value: 'email', label: 'Email Verification', icon: '📧' }
  ];

  const encryptionLevels = [
    { value: 'AES-128', label: 'AES-128 (Standard)' },
    { value: 'AES-256', label: 'AES-256 (High Security)' },
    { value: 'ChaCha20', label: 'ChaCha20 (Modern)' }
  ];

  useEffect(() => {
    loadSecuritySettings();
    loadAuditLogs();
  }, []);

  const loadSecuritySettings = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/settings/organization/123/security');
      if (response.ok) {
        const data = await response.json();
        setSecurity(data);
      }
    } catch (error) {
      console.error('Error loading security settings:', error);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/settings/audit-logs/123?limit=10');
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data);
      }
    } catch (error) {
      console.error('Error loading audit logs:', error);
    }
  };

  const handleSecurityChange = (field, value) => {
    setSecurity(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordPolicyChange = (field, value) => {
    setSecurity(prev => ({
      ...prev,
      passwordPolicy: {
        ...prev.passwordPolicy,
        [field]: value
      }
    }));
  };

  const handleMfaToggle = async () => {
    if (!security.mfaEnabled) {
      // Enable MFA
      setShowMfaSetup(true);
      await generateMfaSecret();
    } else {
      // Disable MFA
      if (window.confirm('Are you sure you want to disable MFA? This will reduce security.')) {
        setSecurity(prev => ({ ...prev, mfaEnabled: false }));
        await saveSecuritySettings();
      }
    }
  };

  const generateMfaSecret = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/settings/mfa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: security.mfaMethod })
      });
      
      if (response.ok) {
        const data = await response.json();
        setMfaSecret(data.secret);
        setMfaQrCode(data.qr_code);
      }
    } catch (error) {
      console.error('Error generating MFA secret:', error);
    }
  };

  const verifyMfaCode = async (code) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/settings/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          secret: mfaSecret, 
          code: code,
          method: security.mfaMethod 
        })
      });
      
      if (response.ok) {
        setSecurity(prev => ({ ...prev, mfaEnabled: true }));
        setShowMfaSetup(false);
        await saveSecuritySettings();
        alert('MFA enabled successfully!');
      } else {
        alert('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying MFA code:', error);
      alert('Error verifying MFA code');
    }
  };

  const addIpAddress = () => {
    if (newIpAddress && !security.ipWhitelist.includes(newIpAddress)) {
      setSecurity(prev => ({
        ...prev,
        ipWhitelist: [...prev.ipWhitelist, newIpAddress]
      }));
      setNewIpAddress('');
    }
  };

  const removeIpAddress = (ip) => {
    setSecurity(prev => ({
      ...prev,
      ipWhitelist: prev.ipWhitelist.filter(addr => addr !== ip)
    }));
  };

  const saveSecuritySettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/settings/organization/123/security', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: security,
          encrypted: true,
          description: 'Security and privacy settings'
        })
      });

      if (response.ok) {
        alert('Security settings saved successfully!');
      } else {
        alert('Failed to save security settings');
      }
    } catch (error) {
      console.error('Error saving security settings:', error);
      alert('Error saving security settings');
    } finally {
      setIsLoading(false);
    }
  };

  const exportAuditLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "User,Action,Resource,IP Address,Timestamp\n"
      + auditLogs.map(log => 
          `${log.user_id || 'System'},${log.action},${log.resource_type},${log.ip_address || 'N/A'},${log.timestamp}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "audit_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <button 
            onClick={onBackToSettings}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
          >
            ← Back to Settings
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Security & Privacy</h2>
          <p className="text-sm text-gray-500">Manage authentication, access controls, and security policies</p>
        </div>
        <button 
          onClick={saveSecuritySettings}
          disabled={isLoading}
          className="deal-n-done-btn-primary flex items-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <span className="text-lg mr-1">🔒</span>
              Save Security
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Security Settings */}
        <div className="space-y-6">
          {/* Multi-Factor Authentication */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi-Factor Authentication</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Enable MFA</h4>
                  <p className="text-sm text-gray-500">Require additional verification for login</p>
                </div>
                <button
                  onClick={handleMfaToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    security.mfaEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    security.mfaEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {security.mfaEnabled && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      MFA Method
                    </label>
                    <select
                      value={security.mfaMethod}
                      onChange={(e) => handleSecurityChange('mfaMethod', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      {mfaMethods.map(method => (
                        <option key={method.value} value={method.value}>
                          {method.icon} {method.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Session Management */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Management</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={security.sessionTimeout}
                  onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                  min="5"
                  max="480"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Automatically log out users after inactivity
                </p>
              </div>
            </div>
          </div>

          {/* Password Policy */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Policy</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Length
                </label>
                <input
                  type="number"
                  value={security.passwordPolicy.minLength}
                  onChange={(e) => handlePasswordPolicyChange('minLength', parseInt(e.target.value))}
                  min="6"
                  max="32"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={security.passwordPolicy.requireUppercase}
                    onChange={(e) => handlePasswordPolicyChange('requireUppercase', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Require uppercase letters</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={security.passwordPolicy.requireLowercase}
                    onChange={(e) => handlePasswordPolicyChange('requireLowercase', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Require lowercase letters</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={security.passwordPolicy.requireNumbers}
                    onChange={(e) => handlePasswordPolicyChange('requireNumbers', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Require numbers</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={security.passwordPolicy.requireSpecialChars}
                    onChange={(e) => handlePasswordPolicyChange('requireSpecialChars', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Require special characters</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Max Age (days)
                </label>
                <input
                  type="number"
                  value={security.passwordPolicy.maxAge}
                  onChange={(e) => handlePasswordPolicyChange('maxAge', parseInt(e.target.value))}
                  min="30"
                  max="365"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>

          {/* IP Whitelisting */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">IP Address Whitelist</h3>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newIpAddress}
                  onChange={(e) => setNewIpAddress(e.target.value)}
                  placeholder="192.168.1.1"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <button
                  onClick={addIpAddress}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {security.ipWhitelist.map((ip, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-mono">{ip}</span>
                    <button
                      onClick={() => removeIpAddress(ip)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Security */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Security</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Encryption Level
                </label>
                <select
                  value={security.encryptionLevel}
                  onChange={(e) => handleSecurityChange('encryptionLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {encryptionLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Rate Limit (requests/hour)
                </label>
                <input
                  type="number"
                  value={security.apiRateLimit}
                  onChange={(e) => handleSecurityChange('apiRateLimit', parseInt(e.target.value))}
                  min="100"
                  max="10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={security.suspiciousActivityAlerts}
                  onChange={(e) => handleSecurityChange('suspiciousActivityAlerts', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Enable suspicious activity alerts</span>
              </label>
            </div>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Security Audit Logs</h3>
              <button
                onClick={exportAuditLogs}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Export CSV
              </button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {auditLogs.map((log, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">
                        {log.user_id || 'System'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {log.action} - {log.resource_type}
                      </div>
                      <div className="text-xs text-gray-500">
                        {log.ip_address && `IP: ${log.ip_address}`}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MFA Setup Modal */}
      {showMfaSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Multi-Factor Authentication</h3>
            
            <div className="space-y-4">
              <div className="text-center">
                {mfaQrCode && (
                  <img src={mfaQrCode} alt="QR Code" className="mx-auto mb-4" />
                )}
                <p className="text-sm text-gray-600 mb-4">
                  Scan this QR code with your authenticator app, then enter the verification code below.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  maxLength="6"
                  onChange={(e) => {
                    if (e.target.value.length === 6) {
                      verifyMfaCode(e.target.value);
                    }
                  }}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowMfaSetup(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => generateMfaSecret()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Regenerate QR Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettings; 