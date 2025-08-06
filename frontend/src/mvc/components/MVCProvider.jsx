import React, { createContext, useContext, useState, useEffect } from 'react';
import StoreModel from '../models/store/StoreModel';
import StoreController from '../controllers/store/StoreController';
import UserModel from '../models/auth/UserModel';
import AuthModel from '../models/auth/AuthModel';
import AuthController from '../controllers/auth/AuthController';
import ProductModel from '../models/pos/ProductModel';
import SaleModel from '../models/pos/SaleModel';
import POSController from '../controllers/pos/POSController';
import InventoryModel from '../models/inventory/InventoryModel';
import StockModel from '../models/inventory/StockModel';
import VendorModel from '../models/inventory/VendorModel';
import InventoryController from '../controllers/inventory/InventoryController';
import CustomerModel from '../models/customers/CustomerModel';
import CustomerController from '../controllers/customer/CustomerController';
import SalesAnalyticsModel from '../models/analytics/SalesAnalyticsModel';
import AnalyticsController from '../controllers/analytics/AnalyticsController';
import apiService from '../services/api/ApiService';

/**
 * MVC Context
 * Provides MVC instances to the component tree
 */
const MVCContext = createContext();

/**
 * MVC Provider Component
 * Manages MVC instances and provides them to child components
 */
export const MVCProvider = ({ children }) => {
  const [mvcInstances, setMvcInstances] = useState({
    store: {
      model: new StoreModel(),
      controller: null
    },
    auth: {
      model: new AuthModel(),
      controller: null
    },
    user: {
      model: new UserModel(),
      controller: null
    },
    pos: {
      productModel: new ProductModel(),
      saleModel: new SaleModel(),
      controller: null
    },
    inventory: {
      inventoryModel: new InventoryModel(),
      stockModel: new StockModel(),
      vendorModel: new VendorModel(),
      controller: null
    },
    customer: {
      customerModel: new CustomerModel(),
      controller: null
    },
    analytics: {
      salesAnalyticsModel: new SalesAnalyticsModel(),
      controller: null
    }
  });

  // Initialize controllers
  useEffect(() => {
    const storeController = new StoreController(mvcInstances.store.model);
    const authController = new AuthController(mvcInstances.auth.model, mvcInstances.user.model);
    const posController = new POSController(mvcInstances.pos.productModel, mvcInstances.pos.saleModel);
    const inventoryController = new InventoryController(
      mvcInstances.inventory.inventoryModel,
      mvcInstances.inventory.stockModel,
      mvcInstances.inventory.vendorModel
    );
    const customerController = new CustomerController(mvcInstances.customer.customerModel);
    const analyticsController = new AnalyticsController(mvcInstances.analytics.salesAnalyticsModel);
    
    setMvcInstances(prev => ({
      ...prev,
      store: {
        ...prev.store,
        controller: storeController
      },
      auth: {
        ...prev.auth,
        controller: authController
      },
      pos: {
        ...prev.pos,
        controller: posController
      },
      inventory: {
        ...prev.inventory,
        controller: inventoryController
      },
      customer: {
        ...prev.customer,
        controller: customerController
      },
      analytics: {
        ...prev.analytics,
        controller: analyticsController
      }
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(mvcInstances).forEach(({ model, controller }) => {
        if (controller) {
          controller.cleanup();
        }
        if (model) {
          model.reset();
        }
      });
    };
  }, [mvcInstances]);

  const value = {
    // Store MVC
    storeModel: mvcInstances.store.model,
    storeController: mvcInstances.store.controller,
    
    // Auth MVC
    authModel: mvcInstances.auth.model,
    authController: mvcInstances.auth.controller,
    userModel: mvcInstances.user.model,
    
    // POS MVC
    productModel: mvcInstances.pos.productModel,
    saleModel: mvcInstances.pos.saleModel,
    posController: mvcInstances.pos.controller,
    
    // Inventory MVC
    inventoryModel: mvcInstances.inventory.inventoryModel,
    stockModel: mvcInstances.inventory.stockModel,
    vendorModel: mvcInstances.inventory.vendorModel,
    inventoryController: mvcInstances.inventory.controller,
    
    // Customer MVC
    customerModel: mvcInstances.customer.customerModel,
    customerController: mvcInstances.customer.controller,
    
    // Analytics MVC
    salesAnalyticsModel: mvcInstances.analytics.salesAnalyticsModel,
    analyticsController: mvcInstances.analytics.controller,
    
    // API Service
    apiService,
    
    // Utility functions
    getMVCInstance: (name) => mvcInstances[name],
    getAllInstances: () => mvcInstances,
    
    // Debug
    getDebugInfo: () => ({
      store: {
        model: mvcInstances.store.model?.getSummary(),
        controller: mvcInstances.store.controller?.getSummary()
      },
      auth: {
        model: mvcInstances.auth.model?.getSummary(),
        controller: mvcInstances.auth.controller?.getSummary()
      },
      user: {
        model: mvcInstances.user.model?.getSummary()
      },
             pos: {
         productModel: mvcInstances.pos.productModel?.getSummary(),
         saleModel: mvcInstances.pos.saleModel?.getSummary(),
         controller: mvcInstances.pos.controller?.getSummary()
       },
       inventory: {
         inventoryModel: mvcInstances.inventory.inventoryModel?.getSummary(),
         stockModel: mvcInstances.inventory.stockModel?.getSummary(),
         vendorModel: mvcInstances.inventory.vendorModel?.getSummary(),
         controller: mvcInstances.inventory.controller?.getSummary()
       },
       customer: {
         customerModel: mvcInstances.customer.customerModel?.getSummary(),
         controller: mvcInstances.customer.controller?.getSummary()
       },
       analytics: {
         salesAnalyticsModel: mvcInstances.analytics.salesAnalyticsModel?.getSummary(),
         controller: mvcInstances.analytics.controller?.getSummary()
       },
       apiService: apiService.getServiceInfo()
    })
  };

  return (
    <MVCContext.Provider value={value}>
      {children}
    </MVCContext.Provider>
  );
};

/**
 * Hook to use MVC context
 */
export const useMVCContext = () => {
  const context = useContext(MVCContext);
  if (!context) {
    throw new Error('useMVCContext must be used within an MVCProvider');
  }
  return context;
};

/**
 * Hook to use Store MVC
 */
export const useStoreMVC = () => {
  const { storeModel, storeController } = useMVCContext();
  
  if (!storeModel || !storeController) {
    throw new Error('Store MVC not initialized');
  }
  
  return {
    model: storeModel,
    controller: storeController,
    state: storeModel.state,
    loading: storeModel.loading,
    error: storeModel.error,
    clearError: () => storeController.clearError(),
    reset: () => storeController.reset()
  };
};

/**
 * Hook to use Auth MVC
 */
export const useAuthMVC = () => {
  const { authModel, authController, userModel } = useMVCContext();
  
  if (!authModel || !authController || !userModel) {
    throw new Error('Auth MVC not initialized');
  }
  
  return {
    model: authModel,
    controller: authController,
    userModel: userModel,
    state: authModel.state,
    loading: authModel.loading,
    error: authModel.error,
    clearError: () => authController.clearError(),
    reset: () => authController.reset()
  };
};

/**
 * Hook to use User MVC
 */
export const useUserMVC = () => {
  const { userModel, authController } = useMVCContext();
  
  if (!userModel || !authController) {
    throw new Error('User MVC not initialized');
  }
  
  return {
    model: userModel,
    controller: authController, // Auth controller handles user operations
    state: userModel.state,
    loading: userModel.loading,
    error: userModel.error,
    clearError: () => authController.clearError(),
    reset: () => authController.reset()
  };
};

/**
 * Hook to use POS MVC
 */
export const usePOSMVC = () => {
  const { productModel, saleModel, posController } = useMVCContext();
  
  if (!productModel || !saleModel || !posController) {
    throw new Error('POS MVC not initialized');
  }
  
  return {
    productModel,
    saleModel,
    posController,
    state: productModel.state,
    loading: productModel.loading,
    error: productModel.error,
    clearError: () => posController.clearError(),
    reset: () => posController.reset()
  };
};

/**
 * Hook to use Inventory MVC
 */
export const useInventoryMVC = () => {
  const { inventoryModel, stockModel, vendorModel, inventoryController } = useMVCContext();
  
  if (!inventoryModel || !stockModel || !vendorModel || !inventoryController) {
    throw new Error('Inventory MVC not initialized');
  }
  
  return {
    inventoryModel,
    stockModel,
    vendorModel,
    inventoryController,
    state: inventoryModel.state,
    loading: inventoryModel.loading,
    error: inventoryModel.error,
    clearError: () => inventoryController.clearError(),
    reset: () => inventoryController.reset()
  };
};

/**
 * Hook to use Customer MVC
 */
export const useCustomerMVC = () => {
  const { customerModel, customerController } = useMVCContext();
  
  if (!customerModel || !customerController) {
    throw new Error('Customer MVC not initialized');
  }
  
  return {
    customerModel,
    customerController,
    state: customerModel.state,
    loading: customerModel.loading,
    error: customerModel.error,
    clearError: () => customerController.clearError(),
    reset: () => customerController.reset()
  };
};

/**
 * Hook to use Analytics MVC
 */
export const useAnalyticsMVC = () => {
  const { salesAnalyticsModel, analyticsController } = useMVCContext();
  
  if (!salesAnalyticsModel || !analyticsController) {
    throw new Error('Analytics MVC not initialized');
  }
  
  return {
    salesAnalyticsModel,
    analyticsController,
    state: salesAnalyticsModel.state,
    loading: salesAnalyticsModel.loading,
    error: salesAnalyticsModel.error,
    clearError: () => analyticsController.clearError(),
    reset: () => analyticsController.reset()
  };
};

/**
 * Hook to use API Service
 */
export const useApiService = () => {
  const { apiService } = useMVCContext();
  return apiService;
};

/**
 * MVC Consumer Component
 * Alternative way to access MVC context
 */
export const MVCConsumer = ({ children }) => {
  const context = useMVCContext();
  return children(context);
};

export default MVCProvider; 