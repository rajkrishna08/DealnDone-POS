import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MVCProvider } from './mvc/components/MVCProvider';
import MVCIntegrationTest from './mvc/test/MVCIntegrationTest';

// Import all your original POS components
import ModernPOS from './components/ModernPOS';
import POSScreen from './components/POSScreen';
import POSScreenV2 from './components/POSScreenV2';
import StoreDashboard from './components/StoreDashboard';
import ProductCatalog from './components/ProductCatalog';
import SalesScreen from './components/SalesScreen';
import InventoryDashboard from './components/InventoryDashboard';
import CustomerDirectory from './components/CustomerDirectory';
import CustomerAnalytics from './components/CustomerAnalytics';
import CustomerLoyalty from './components/CustomerLoyalty';
import CustomerSupport from './components/CustomerSupport';
import CustomerFeedback from './components/CustomerFeedback';
import CustomerGroups from './components/CustomerGroups';
import CustomerIntelligence from './components/CustomerIntelligence';
import CustomerReports from './components/CustomerReports';
import SalesAnalytics from './components/SalesAnalytics';
import SalesHistory from './components/SalesHistory';
import SalesInvoices from './components/SalesInvoices';
import SalesOrders from './components/SalesOrders';
import SalesQuotes from './components/SalesQuotes';
import SalesReturns from './components/SalesReturns';
import SalesTargets from './components/SalesTargets';
import FinancialReports from './components/FinancialReports';
import AdvancedReports from './components/AdvancedReports';
import InventoryReports from './components/InventoryReports';
import RealTimeAnalytics from './components/RealTimeAnalytics';
import ProductsPage from './components/ProductsPage';
import ProductCategories from './components/ProductCategories';
import ProductVariants from './components/ProductVariants';
import ProductImages from './components/ProductImages';
import StockPurchases from './components/StockPurchases';
import StockReturns from './components/StockReturns';
import StockTake from './components/StockTake';
import StockTransfers from './components/StockTransfers';
import Vendors from './components/Vendors';
import CashManagement from './components/CashManagement';
import CashRegisters from './components/CashRegisters';
import PaymentTypes from './components/PaymentTypes';
import SalesTax from './components/SalesTax';
import LoyaltyProgram from './components/LoyaltyProgram';
import MarketingCampaigns from './components/MarketingCampaigns';
import Settings from './components/Settings';
import GeneralSetup from './components/GeneralSetup';
import SecuritySettings from './components/SecuritySettings';
import BrandingSettings from './components/BrandingSettings';
import EmployeesSettings from './components/EmployeesSettings';
import OutletsRegistersSettings from './components/OutletsRegistersSettings';
import PaymentTypesSettings from './components/PaymentTypesSettings';
import SalesTaxSettings from './components/SalesTaxSettings';
import LoyaltySettings from './components/LoyaltySettings';
import SubscriptionSettings from './components/SubscriptionSettings';
import PricingPlans from './components/PricingPlans';
import PricingPlansSettings from './components/PricingPlansSettings';
import GeneralSetupSettings from './components/GeneralSetupSettings';
import SecurityAccess from './components/SecurityAccess';
import EmployeeRoles from './components/EmployeeRoles';
import Departments from './components/Departments';
import UsageMeters from './components/UsageMeters';
import AICopilotPanel from './components/AICopilotPanel';
import DealBotAI from './components/DealBotAI';
import MCPDashboard from './components/MCPDashboard';
import OrchestratorMonitor from './components/OrchestratorMonitor';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import RegionalManagerDashboard from './components/RegionalManagerDashboard';
import StoreManagerDashboard from './components/StoreManagerDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import StoreAdminSegment from './components/StoreAdminSegment';
import StoreSetup from './components/StoreSetup';
import StoreSelector from './components/StoreSelector';
import SubdomainRouter from './components/SubdomainRouter';
import SubdomainDemo from './components/SubdomainDemo';
import SubdomainTest from './components/SubdomainTest';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignIn from './components/SignIn';
import TestSignIn from './components/TestSignIn';
import SignUp from './components/SignUp';
import MobilePOS from './components/MobilePOS';
import MobileInventoryScanner from './components/MobileInventoryScanner';
import ResponsiveLayout from './components/ResponsiveLayout';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Page from './components/Page';
import SettingsTest from './components/SettingsTest';
import POSLandingPage from './components/POSLandingPage';
import StoreDashboardReports from './components/StoreDashboardReports';

import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStore, setCurrentStore] = useState(null);
  const [subdomain, setSubdomain] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        setCurrentStore({ name: userData.store_name || 'Store' });
        setCurrentView('store-dashboard');
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      // For testing, let's set a default user
      const defaultUser = {
        name: 'Demo User',
        email: 'ceo@dealndone.com',
        role: 'Admin',
        store_name: 'Deal n Done Store'
      };
      setUser(defaultUser);
      setIsAuthenticated(true);
      setCurrentStore({ name: 'Deal n Done Store' });
      setCurrentView('store-dashboard');
    }
  }, []);

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentStore(userData.stores?.[0] || null);
    setCurrentView('store-dashboard'); // Go to dashboard after login
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    setCurrentStore(null);
    setCurrentView('landing');
  };

  const renderMainContent = () => {
    const commonProps = {
      onNavigate: handleNavigate,
      user: user,
      currentStore: currentStore
    };

    // If not authenticated, show auth flow
    if (!isAuthenticated) {
      switch (currentView) {
        case 'landing':
          return <LandingPage {...commonProps} />;
        case 'login':
          return <Login {...commonProps} onLogin={handleLogin} />;
        case 'signin':
          return <SignIn {...commonProps} onLogin={handleLogin} />;
        case 'signup':
          return <SignUp {...commonProps} onLogin={handleLogin} />;
        default:
          return <LandingPage {...commonProps} />;
      }
    }

    // If authenticated, show POS system
    switch (currentView) {
      case 'pos':
        return <ModernPOS {...commonProps} />;
      
      case 'pos-screen':
        return <POSScreen {...commonProps} />;
      
      case 'pos-screen-v2':
        return <POSScreenV2 {...commonProps} />;
      
      case 'mobile-pos':
        return <MobilePOS {...commonProps} />;
      
      case 'store-dashboard':
        return <StoreDashboard {...commonProps} />;
      
      case 'store-dashboard-reports':
        return <StoreDashboardReports {...commonProps} />;
      
      case 'product-catalog':
        return <ProductCatalog {...commonProps} />;
      
      case 'products':
        return <ProductsPage {...commonProps} />;
      
      case 'product-categories':
        return <ProductCategories {...commonProps} />;
      
      case 'product-variants':
        return <ProductVariants {...commonProps} />;
      
      case 'product-images':
        return <ProductImages {...commonProps} />;
      
      case 'sales-screen':
        return <SalesScreen {...commonProps} />;
      
      case 'sales-analytics':
        return <SalesAnalytics {...commonProps} />;
      
      case 'sales-history':
        return <SalesHistory {...commonProps} />;
      
      case 'sales-invoices':
        return <SalesInvoices {...commonProps} />;
      
      case 'sales-orders':
        return <SalesOrders {...commonProps} />;
      
      case 'sales-quotes':
        return <SalesQuotes {...commonProps} />;
      
      case 'sales-returns':
        return <SalesReturns {...commonProps} />;
      
      case 'sales-targets':
        return <SalesTargets {...commonProps} />;
      
      case 'inventory-dashboard':
        return <InventoryDashboard {...commonProps} />;
      
      case 'stock-purchases':
        return <StockPurchases {...commonProps} />;
      
      case 'stock-returns':
        return <StockReturns {...commonProps} />;
      
      case 'stock-take':
        return <StockTake {...commonProps} />;
      
      case 'stock-transfers':
        return <StockTransfers {...commonProps} />;
      
      case 'vendors':
        return <Vendors {...commonProps} />;
      
      case 'mobile-inventory-scanner':
        return <MobileInventoryScanner {...commonProps} />;
      
      case 'customer-directory':
        return <CustomerDirectory {...commonProps} />;
      
      case 'customer-analytics':
        return <CustomerAnalytics {...commonProps} />;
      
      case 'customer-loyalty':
        return <CustomerLoyalty {...commonProps} />;
      
      case 'customer-support':
        return <CustomerSupport {...commonProps} />;
      
      case 'customer-feedback':
        return <CustomerFeedback {...commonProps} />;
      
      case 'customer-groups':
        return <CustomerGroups {...commonProps} />;
      
      case 'customer-intelligence':
        return <CustomerIntelligence {...commonProps} />;
      
      case 'customer-reports':
        return <CustomerReports {...commonProps} />;
      
      case 'cash-management':
        return <CashManagement {...commonProps} />;
      
      case 'cash-registers':
        return <CashRegisters {...commonProps} />;
      
      case 'payment-types':
        return <PaymentTypes {...commonProps} />;
      
      case 'sales-tax':
        return <SalesTax {...commonProps} />;
      
      case 'loyalty-program':
        return <LoyaltyProgram {...commonProps} />;
      
      case 'marketing-campaigns':
        return <MarketingCampaigns {...commonProps} />;
      
      case 'financial-reports':
        return <FinancialReports {...commonProps} />;
      
      case 'advanced-reports':
        return <AdvancedReports {...commonProps} />;
      
      case 'inventory-reports':
        return <InventoryReports {...commonProps} />;
      
      case 'real-time-analytics':
        return <RealTimeAnalytics {...commonProps} />;
      
      case 'settings':
        return <Settings {...commonProps} />;
      
      case 'general-setup':
        return <GeneralSetup {...commonProps} />;
      
      case 'security-settings':
        return <SecuritySettings {...commonProps} />;
      
      case 'branding-settings':
        return <BrandingSettings {...commonProps} />;
      
      case 'employees-settings':
        return <EmployeesSettings {...commonProps} />;
      
      case 'outlets-registers-settings':
        return <OutletsRegistersSettings {...commonProps} />;
      
      case 'payment-types-settings':
        return <PaymentTypesSettings {...commonProps} />;
      
      case 'sales-tax-settings':
        return <SalesTaxSettings {...commonProps} />;
      
      case 'loyalty-settings':
        return <LoyaltySettings {...commonProps} />;
      
      case 'subscription-settings':
        return <SubscriptionSettings {...commonProps} />;
      
      case 'pricing-plans':
        return <PricingPlans {...commonProps} />;
      
      case 'pricing-plans-settings':
        return <PricingPlansSettings {...commonProps} />;
      
      case 'general-setup-settings':
        return <GeneralSetupSettings {...commonProps} />;
      
      case 'security-access':
        return <SecurityAccess {...commonProps} />;
      
      case 'employee-roles':
        return <EmployeeRoles {...commonProps} />;
      
      case 'departments':
        return <Departments {...commonProps} />;
      
      case 'usage-meters':
        return <UsageMeters {...commonProps} />;
      
      case 'ai-copilot-panel':
        return <AICopilotPanel {...commonProps} />;
      
      case 'dealbot-ai':
        return <DealBotAI {...commonProps} />;
      
      case 'mcp-dashboard':
        return <MCPDashboard {...commonProps} />;
      
      case 'orchestrator-monitor':
        return <OrchestratorMonitor {...commonProps} />;
      
      case 'executive-dashboard':
        return <ExecutiveDashboard {...commonProps} />;
      
      case 'regional-manager-dashboard':
        return <RegionalManagerDashboard {...commonProps} />;
      
      case 'store-manager-dashboard':
        return <StoreManagerDashboard {...commonProps} />;
      
      case 'owner-dashboard':
        return <OwnerDashboard {...commonProps} />;
      
      case 'store-admin-segment':
        return <StoreAdminSegment {...commonProps} />;
      
      case 'store-setup':
        return <StoreSetup {...commonProps} />;
      
      case 'store-selector':
        return <StoreSelector {...commonProps} />;
      
      case 'subdomain-router':
        return <SubdomainRouter {...commonProps} />;
      
      case 'subdomain-demo':
        return <SubdomainDemo {...commonProps} />;
      
      case 'subdomain-test':
        return <SubdomainTest {...commonProps} />;
      
      case 'settings-test':
        return <SettingsTest {...commonProps} />;
      
      case 'pos-landing-page':
        return <POSLandingPage {...commonProps} />;
      
      default:
        return <StoreDashboard {...commonProps} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading DealNDone 2025...</p>
        </div>
      </div>
    );
  }

  return (
    <MVCProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/test" element={<MVCIntegrationTest />} />
            <Route path="/" element={
              isAuthenticated ? (
                <div className="flex h-screen bg-gray-50">
                  <Sidebar 
                    currentView={currentView}
                    onNavigate={handleNavigate}
                    onLogout={handleLogout}
                    user={user}
                  />
                  <div className="flex-1 flex flex-col">
                    <Header 
                      user={user} 
                      selectedCurrency="USD"
                      setSelectedCurrency={() => {}}
                    />
                    <main className="flex-1 p-6 overflow-auto">
                      {renderMainContent()}
                    </main>
                  </div>
                </div>
              ) : (
                renderMainContent()
              )
            } />
          </Routes>
        </div>
      </Router>
    </MVCProvider>
  );
}

export default App; 