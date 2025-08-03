import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import InventoryDashboard from './components/InventoryDashboard';
import StockPurchases from './components/StockPurchases';
import StockTransfers from './components/StockTransfers';
import StockReturns from './components/StockReturns';
import StockTake from './components/StockTake';
import Departments from './components/Departments';
import Vendors from './components/Vendors';
import MobileInventoryScanner from './components/MobileInventoryScanner';
import StoreManagerDashboard from './components/StoreManagerDashboard';
import RegionalManagerDashboard from './components/RegionalManagerDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import POSScreen from './components/POSScreen';
import ProductsPage from './components/ProductsPage';
import DealBotAI from './components/DealBotAI';
import LandingPage from './components/LandingPage';
import ProductCatalog from './components/ProductCatalog';
import ProductCategories from './components/ProductCategories';
import CustomerDirectory from './components/CustomerDirectory';
import CustomerGroups from './components/CustomerGroups';
import CustomerLoyalty from './components/CustomerLoyalty';
import CustomerFeedback from './components/CustomerFeedback';
import CustomerAnalytics from './components/CustomerAnalytics';
import CustomerSupport from './components/CustomerSupport';
import SalesOrders from './components/SalesOrders';
import MarketingCampaigns from './components/MarketingCampaigns';
import SalesHistory from './components/SalesHistory';
import CashRegisters from './components/CashRegisters';
import CashManagement from './components/CashManagement';
import SignUp from './components/SignUp';
import Login from './components/Login';
import PricingPlansSettings from './components/PricingPlansSettings';
import GeneralSetup from './components/GeneralSetup';
import OutletsRegisters from './components/OutletsRegisters';
import LoyaltyProgram from './components/LoyaltyProgram';
import SalesTax from './components/SalesTax';
import PaymentTypes from './components/PaymentTypes';
import EmployeesSettings from './components/EmployeesSettings';
import EmployeeRoles from './components/EmployeeRoles';
import SalesQuotes from './components/SalesQuotes';
import SecurityAccess from './components/SecurityAccess';
import SalesInvoices from './components/SalesInvoices';
import SalesReturns from './components/SalesReturns';
import SalesAnalytics from './components/SalesAnalytics';
import SalesTargets from './components/SalesTargets';
import Settings from './components/Settings';
import StoreDashboard from './components/StoreDashboard';
import SubdomainRouter from './components/SubdomainRouter';
import SubdomainTest from './components/SubdomainTest';
import MCPDashboard from './components/MCPDashboard';
import OrchestratorMonitor from './components/OrchestratorMonitor';
import MobilePOS from './components/MobilePOS';
import POSScreenV2 from './components/POSScreenV2';
import ModernPOS from './components/ModernPOS';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Redirect based on user role
      if (userData.role === 'superadmin') {
        setCurrentView('owner-dashboard');
      } else {
        setCurrentView('store-dashboard');
      }
    }
    
    // Check for store parameter in URL (original format)
    const urlParams = new URLSearchParams(window.location.search);
    const storeParam = urlParams.get('store');
    if (storeParam) {
      // Redirect to subdomain format
      window.location.href = `http://${storeParam}.localhost:3000`;
    }
  }, []);

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('landing');
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'signup':
        return <SignUp onNavigate={handleNavigate} />;
      case 'owner-dashboard':
        return <OwnerDashboard />;
      case 'store-manager-dashboard':
        return <StoreManagerDashboard />;
      case 'regional-manager-dashboard':
        return <RegionalManagerDashboard />;
      case 'pos-screen':
        return <POSScreen />;
      case 'pos-v2':
        return <POSScreenV2 />;
      case 'modern-pos':
        return <ModernPOS />;
      case 'products':
        return <ProductsPage />;
      case 'product-catalog':
        return <ProductCatalog />;
      case 'product-categories':
        return <ProductCategories />;
      case 'customer-directory':
        return <CustomerDirectory />;
      case 'customer-groups':
        return <CustomerGroups />;
      case 'customer-loyalty':
        return <CustomerLoyalty />;
      case 'customer-feedback':
        return <CustomerFeedback />;
      case 'customer-analytics':
        return <CustomerAnalytics />;
      case 'customer-support':
        return <CustomerSupport />;
      case 'sales-orders':
        return <SalesOrders />;
      case 'marketing-campaigns':
        return <MarketingCampaigns />;
      case 'sales-history':
        return <SalesHistory />;
      case 'cash-registers':
        return <CashRegisters />;
      case 'cash-management':
        return <CashManagement />;
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
      case 'mobile-scanner':
        return <MobileInventoryScanner />;
      case 'dealbot-ai':
        return <DealBotAI />;
      case 'pricing-plans-settings':
        return <PricingPlansSettings />;
      case 'general-setup':
        return <GeneralSetup />;
      case 'outlets-registers':
        return <OutletsRegisters />;
      case 'loyalty-program':
        return <LoyaltyProgram />;
      case 'sales-tax':
        return <SalesTax />;
      case 'payment-types':
        return <PaymentTypes />;
      case 'employees':
        return <EmployeesSettings onBackToSettings={() => handleNavigate('settings')} />;
      case 'employee-roles':
        return <EmployeeRoles />;
      case 'timesheets':
        return <EmployeesSettings onBackToSettings={() => handleNavigate('settings')} employeesView="timesheets" />;
      case 'roles':
        return <EmployeeRoles />;
      case 'sales-quotes':
        return <SalesQuotes />;
      case 'sales-invoices':
        return <SalesInvoices />;
      case 'sales-returns':
        return <SalesReturns />;
      case 'sales-analytics':
        return <SalesAnalytics />;
      case 'sales-targets':
        return <SalesTargets />;
      case 'settings':
        return <Settings onNavigate={handleNavigate} />;
      case 'store-dashboard':
        return <StoreDashboard onNavigate={handleNavigate} />;
      case 'mcp-dashboard':
        return <MCPDashboard />;
      case 'orchestrator-monitor':
        return <OrchestratorMonitor />;
      case 'subdomain-test':
        return <SubdomainTest />;
      case 'security-access':
        return <SecurityAccess />;
      case 'mobile-pos':
        return <MobilePOS />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  // If user is not authenticated and not on landing/login/signup, show landing
  if (!isAuthenticated && !['landing', 'login', 'signup'].includes(currentView)) {
    return <LandingPage onNavigate={handleNavigate} />;
  }

  // If on landing/login/signup/store-dashboard pages, don't show sidebar
  if (['landing', 'login', 'signup', 'store-dashboard'].includes(currentView)) {
    return renderMainContent();
  }

  return (
    <SubdomainRouter>
      <div className="flex h-screen bg-gray-100">
        <Sidebar 
          currentView={currentView} 
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          user={user}
        />
        <main className="flex-1 overflow-auto">
          {renderMainContent()}
        </main>
      </div>
    </SubdomainRouter>
  );
}

export default App; 