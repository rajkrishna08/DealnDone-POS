import React, { useState } from 'react';
import POSScreen from './components/POSScreen';
import OwnerDashboard from './components/OwnerDashboard';

function App() {
  const [currentView, setCurrentView] = useState('pos');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  return (
    <div className="App">
      {/* Navigation Header */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">DealNDone 2025</h1>
          
          {/* Main Navigation */}
          <div className="flex space-x-4">
            <button 
              onClick={() => handleViewChange('pos')}
              className={`px-4 py-2 rounded ${currentView === 'pos' ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
            >
              POS
            </button>
            <button 
              onClick={() => handleViewChange('dashboard')}
              className={`px-4 py-2 rounded ${currentView === 'dashboard' ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
            >
              Dashboard
            </button>
            
            {/* Settings Dropdown */}
            <div className="relative group">
              <button className="px-4 py-2 rounded hover:bg-blue-500">
                Settings
              </button>
              
              {/* Settings Sub-menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="py-2">
                  {/* Store Settings Sub-sub-menu */}
                  <div className="relative group/sub">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center">
                      Store Settings
                      <span>▶</span>
                    </button>
                    
                    {/* Store Settings Sub-sub-menu */}
                    <div className="absolute left-full top-0 w-48 bg-white border rounded shadow-lg opacity-0 group-hover/sub:opacity-100 transition-opacity">
                      <div className="py-2">
                        <button 
                          onClick={() => handleCurrencyChange('USD')}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedCurrency === 'USD' ? 'bg-blue-100' : ''}`}
                        >
                          Currency: USD
                        </button>
                        <button 
                          onClick={() => handleCurrencyChange('INR')}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedCurrency === 'INR' ? 'bg-blue-100' : ''}`}
                        >
                          Currency: INR
                        </button>
                        <button 
                          onClick={() => handleCurrencyChange('EUR')}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedCurrency === 'EUR' ? 'bg-blue-100' : ''}`}
                        >
                          Currency: EUR
                        </button>
                        <button 
                          onClick={() => handleCurrencyChange('GBP')}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedCurrency === 'GBP' ? 'bg-blue-100' : ''}`}
                        >
                          Currency: GBP
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    User Management
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Security Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Backup & Restore
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-4">
        {currentView === 'pos' && (
          <POSScreen selectedCurrency={selectedCurrency} />
        )}
        {currentView === 'dashboard' && (
          <OwnerDashboard />
        )}
      </div>
    </div>
  );
}

export default App; 