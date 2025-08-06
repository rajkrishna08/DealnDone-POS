import React from 'react';

function AppTest() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">DealNDone 2025 - System Test</h1>
        <p className="text-gray-600 mb-4">If you can see this, the basic app is working!</p>
        <div className="space-y-2">
          <div className="text-sm">✅ React Loading</div>
          <div className="text-sm">✅ Tailwind CSS Working</div>
          <div className="text-sm">✅ Components Rendering</div>
        </div>
      </div>
    </div>
  );
}

export default AppTest;