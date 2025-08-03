import React, { useState, useRef } from 'react';

const BrandingSettings = ({ onBackToSettings }) => {
  const [branding, setBranding] = useState({
    logo: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#1F2937',
    accentColor: '#10B981',
    fontFamily: 'Inter',
    customCSS: ''
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const fileInputRef = useRef(null);

  const fontOptions = [
    { value: 'Inter', label: 'Inter (Modern)' },
    { value: 'Roboto', label: 'Roboto (Clean)' },
    { value: 'Open Sans', label: 'Open Sans (Friendly)' },
    { value: 'Poppins', label: 'Poppins (Professional)' },
    { value: 'Montserrat', label: 'Montserrat (Elegant)' },
    { value: 'Arial', label: 'Arial (Classic)' }
  ];

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBranding(prev => ({
          ...prev,
          logo: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (field, value) => {
    setBranding(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveBranding = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/settings/organization/123/branding', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: branding,
          encrypted: false,
          description: 'Organization branding settings'
        })
      });

      if (response.ok) {
        alert('Branding settings saved successfully!');
      } else {
        alert('Failed to save branding settings');
      }
    } catch (error) {
      console.error('Error saving branding:', error);
      alert('Error saving branding settings');
    }
  };

  const resetToDefaults = () => {
    setBranding({
      logo: '',
      primaryColor: '#3B82F6',
      secondaryColor: '#1F2937',
      accentColor: '#10B981',
      fontFamily: 'Inter',
      customCSS: ''
    });
    setLogoFile(null);
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
          <h2 className="text-2xl font-bold text-gray-900">Branding & Customization</h2>
          <p className="text-sm text-gray-500">Customize your app's appearance and brand identity</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {previewMode ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button 
            onClick={handleSaveBranding}
            className="deal-n-done-btn-primary flex items-center"
          >
            <span className="text-lg mr-1">💾</span>
            Save Branding
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Logo Upload */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo & Brand Assets</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo
                </label>
                <div className="flex items-center space-x-4">
                  {branding.logo && (
                    <img 
                      src={branding.logo} 
                      alt="Company Logo" 
                      className="w-16 h-16 object-contain border border-gray-200 rounded"
                    />
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Upload Logo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 200x200px, PNG or SVG format
                </p>
              </div>
            </div>
          </div>

          {/* Color Scheme */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Scheme</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={branding.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="#1F2937"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accent Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={branding.accentColor}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.accentColor}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="#10B981"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Typography</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={branding.fontFamily}
                onChange={(e) => handleColorChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {fontOptions.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom CSS */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom CSS</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Styles
              </label>
              <textarea
                value={branding.customCSS}
                onChange={(e) => handleColorChange('customCSS', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                placeholder="/* Add custom CSS here */"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add custom CSS to further customize your app's appearance
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        {previewMode && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
            
            <div 
              className="border border-gray-200 rounded-lg p-6"
              style={{
                fontFamily: branding.fontFamily,
                '--primary-color': branding.primaryColor,
                '--secondary-color': branding.secondaryColor,
                '--accent-color': branding.accentColor
              }}
            >
              {/* Header Preview */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  {branding.logo && (
                    <img 
                      src={branding.logo} 
                      alt="Logo" 
                      className="w-8 h-8 object-contain"
                    />
                  )}
                  <h1 className="text-xl font-bold" style={{ color: branding.primaryColor }}>
                    Deal n Done
                  </h1>
                </div>
                <button 
                  className="px-4 py-2 rounded-md text-white text-sm font-medium"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Settings
                </button>
              </div>

              {/* Content Preview */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2" style={{ color: branding.secondaryColor }}>
                    Sample Content
                  </h3>
                  <p className="text-sm text-gray-600">
                    This is how your app will look with the selected branding.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    className="p-3 rounded-lg border text-sm font-medium"
                    style={{ 
                      borderColor: branding.primaryColor,
                      color: branding.primaryColor
                    }}
                  >
                    Primary Button
                  </button>
                  <button 
                    className="p-3 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: branding.accentColor }}
                  >
                    Accent Button
                  </button>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: branding.primaryColor + '10' }}>
                  <h4 className="font-medium mb-2" style={{ color: branding.primaryColor }}>
                    Highlighted Section
                  </h4>
                  <p className="text-sm" style={{ color: branding.secondaryColor }}>
                    This section uses your primary color with reduced opacity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandingSettings; 