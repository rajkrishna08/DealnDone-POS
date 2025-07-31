import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AICopilotPanel from './components/AICopilotPanel';
import POSScreen from './components/POSScreen';
import ProductsPage from './components/ProductsPage';
import ProductCatalog from './components/ProductCatalog';
import ProductCategories from './components/ProductCategories';
import CustomerDirectory from './components/CustomerDirectory';
import SalesOrders from './components/SalesOrders';
import SalesHistory from './components/SalesHistory';
import CashRegisters from './components/CashRegisters';
import CashManagement from './components/CashManagement';
import MarketingCampaigns from './components/MarketingCampaigns';
import Settings from './components/Settings';
import StoreAdminSegment from './components/StoreAdminSegment';
import StoreDashboardReports from './components/StoreDashboardReports';
import PricingPlansSettings from './components/PricingPlansSettings';
import POSLandingPage from './components/POSLandingPage';
import MobileInventoryScanner from './components/MobileInventoryScanner';
import StoreManagerDashboard from './components/StoreManagerDashboard';
import RegionalManagerDashboard from './components/RegionalManagerDashboard';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import OutletsRegistersSettings from './components/OutletsRegistersSettings';
import LoyaltySettings from './components/LoyaltySettings';
import EmployeesSettings from './components/EmployeesSettings';
import EmployeeRoles from './components/EmployeeRoles';
import SalesTaxSettings from './components/SalesTaxSettings';
import PaymentTypesSettings from './components/PaymentTypesSettings';
import GeneralSetupSettings from './components/GeneralSetupSettings';
// Import new inventory components
import InventoryDashboard from './components/InventoryDashboard';
import StockPurchases from './components/StockPurchases';
import StockTransfers from './components/StockTransfers';
import StockReturns from './components/StockReturns';
import StockTake from './components/StockTake';
import Departments from './components/Departments';
import Vendors from './components/Vendors';
import LandingPage from './components/LandingPage';
import DealBotAI from './components/DealBotAI';
import { users } from './data/dummyData';
import SignUp from './components/SignUp';
import Login from './components/Login';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [settingsView, setSettingsView] = useState('main'); // 'main', 'pricing', 'outlets', 'loyalty', 'employees', 'sales-tax', 'payment-types', 'general-setup'
  const [employeesView, setEmployeesView] = useState('employees'); // 'employees', 'roles', 'timesheets'

  // Mock user data - can be changed to test different roles
  // Change the role here to test different dashboards: "Store Manager", "Regional Manager", "CEO"
  const userRole = "Store Manager";
  const user = users[userRole === "Store Manager" ? "storeManager" : userRole === "Regional Manager" ? "regionalManager" : "ceo"];

  const handleNavigateToPricing = () => {
    setSettingsView('pricing');
  };

  const handleNavigateToOutletsRegisters = () => {
    setSettingsView('outlets');
  };

  const handleNavigateToLoyalty = () => {
    setSettingsView('loyalty');
  };

  const handleNavigateToEmployees = () => {
    setSettingsView('employees');
  };

  const handleNavigateToSalesTax = () => {
    setSettingsView('sales-tax');
  };

  const handleNavigateToPaymentTypes = () => {
    setSettingsView('payment-types');
  };

  const handleNavigateToGeneralSetup = () => {
    setSettingsView('general-setup');
  };

  const handleNavigateToSettingsSubmodule = (submodule) => {
    switch (submodule) {
      case 'General Settings':
        setSettingsView('main');
        break;
      case 'Pricing Plans':
        setSettingsView('pricing');
        break;
      case 'Outlets & Registers':
        setSettingsView('outlets');
        break;
      case 'Loyalty Program':
        setSettingsView('loyalty');
        break;
      case 'Employees & Roles':
        setSettingsView('employees');
        break;
      case 'Sales Tax':
        setSettingsView('sales-tax');
        break;
      case 'Payment Types':
        setSettingsView('payment-types');
        break;
      case 'General Setup':
        setSettingsView('general-setup');
        break;
      default:
        setSettingsView('main');
    }
  };

  const handleNavigateToEmployeesSubmodule = (submodule) => {
    setEmployeesView(submodule);
  };

  const handleBackToSettings = () => {
    setSettingsView('main');
  };

  const handleBackToEmployees = () => {
    setEmployeesView('employees');
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'pos':
        return <POSScreen />;
      case 'products':
        return <ProductsPage />;
      case 'product-catalog':
        return <ProductCatalog />;
      case 'product-categories':
        return <ProductCategories />;
      case 'customer-directory':
        return <CustomerDirectory />;
      case 'sales-orders':
        return <SalesOrders />;
      case 'sales-history':
        return <SalesHistory />;
      case 'cash-registers':
        return <CashRegisters />;
      case 'cash-management':
        return <CashManagement />;
      case 'marketing-campaigns':
        return <MarketingCampaigns />;
      // Inventory submodules
      case 'inventory-dashboard':
        return <InventoryDashboard />;
      case 'stock-purchases':
        return <StockPurchases />;
      case 'stock-transfers':
        return <StockTransfers />;
      case 'stock-returns':
        return <StockReturns />;
      case 'stock-take':
        return <StockTake />;
      case 'departments':
        return <Departments />;
      case 'vendors':
        return <Vendors />;
      case 'landing':
        return <LandingPage />;
      case 'employees':
        if (employeesView === 'roles') {
          return <EmployeeRoles />;
        }
        return <EmployeesSettings 
          onBackToEmployees={handleBackToEmployees}
          onNavigateToEmployeesSubmodule={handleNavigateToEmployeesSubmodule}
          employeesView={employeesView}
          user={user} 
        />;
      case 'dashboard':
        // Role-based dashboard routing
        switch (user.role) {
          case 'Store Manager':
            return <StoreManagerDashboard />;
          case 'Regional Manager':
            return <RegionalManagerDashboard />;
          case 'CEO':
            return <ExecutiveDashboard />;
          default:
            return <StoreManagerDashboard />;
        }
      case 'settings':
        if (settingsView === 'pricing') {
          return <PricingPlansSettings onBackToSettings={handleBackToSettings} />;
        }
        if (settingsView === 'outlets') {
          return <OutletsRegistersSettings onBackToSettings={handleBackToSettings} user={user} />;
        }
        if (settingsView === 'loyalty') {
          return <LoyaltySettings onBackToSettings={handleBackToSettings} user={user} />;
        }
        if (settingsView === 'employees') {
          return <EmployeesSettings onBackToSettings={handleBackToSettings} user={user} />;
        }
        if (settingsView === 'sales-tax') {
          return <SalesTaxSettings onBackToSettings={handleBackToSettings} user={user} />;
        }
        if (settingsView === 'payment-types') {
          return <PaymentTypesSettings onBackToSettings={handleBackToSettings} user={user} />;
        }
        if (settingsView === 'general-setup') {
          return <GeneralSetupSettings onBackToSettings={handleBackToSettings} user={user} />;
        }
        return <Settings
          onNavigateToPricing={handleNavigateToPricing}
          onNavigateToOutletsRegisters={handleNavigateToOutletsRegisters}
          onNavigateToLoyalty={handleNavigateToLoyalty}
          onNavigateToEmployees={handleNavigateToEmployees}
          onNavigateToSalesTax={handleNavigateToSalesTax}
          onNavigateToPaymentTypes={handleNavigateToPaymentTypes}
          onNavigateToGeneralSetup={handleNavigateToGeneralSetup}
        />;
      case 'segments':
        return <StoreAdminSegment />;
      case 'scanner':
        return <MobileInventoryScanner />;
      case 'signup':
        return <SignUp />;
      case 'login':
        return <Login />;
      default:
        // Default to role-based dashboard
        switch (user.role) {
          case 'Store Manager':
            return <StoreManagerDashboard />;
          case 'Regional Manager':
            return <RegionalManagerDashboard />;
          case 'CEO':
            return <ExecutiveDashboard />;
          default:
            return <StoreManagerDashboard />;
        }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <Sidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          onNavigateToEmployeesSubmodule={handleNavigateToEmployeesSubmodule}
          onNavigateToSettingsSubmodule={handleNavigateToSettingsSubmodule}
        />
        <div className="flex-1 flex flex-col">
          <Header user={user} selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} />
          <main className="flex-1 p-6">
            {renderMainContent()}
          </main>
        </div>
        <AICopilotPanel />
        <DealBotAI />
      </div>
    </div>
  );
};

export default App; 