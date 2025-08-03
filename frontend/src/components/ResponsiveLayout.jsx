import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

const ResponsiveLayout = ({ children }) => {
  const [deviceType, setDeviceType] = useState('desktop');
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({ width, height });

      // Determine device type
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getDeviceClass = () => {
    switch (deviceType) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'max-w-7xl mx-auto';
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${getDeviceClass()}`}>
      {/* Device Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-lg border">
          {getDeviceIcon()}
          <span className="text-xs font-medium capitalize">{deviceType}</span>
          <span className="text-xs text-gray-500">
            {screenSize.width}×{screenSize.height}
          </span>
        </div>
      </div>

      {/* Responsive Content */}
      <div className="relative">
        {children}
      </div>

      {/* Mobile-specific optimizations */}
      {deviceType === 'mobile' && (
        <div className="fixed bottom-4 left-4 right-4 z-40">
          <div className="bg-white rounded-lg shadow-lg border p-2">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Touch optimized</span>
              <span>Mobile POS ready</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveLayout; 