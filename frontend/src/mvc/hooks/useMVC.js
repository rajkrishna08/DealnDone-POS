import { useEffect, useState, useCallback } from 'react';

/**
 * MVC Integration Hook
 * Provides a way to integrate MVC components with React
 */
export const useMVC = (model, controller) => {
  const [state, setState] = useState(model.state);
  const [loading, setLoading] = useState(model.loading);
  const [error, setError] = useState(model.error);

  // Subscribe to model changes
  useEffect(() => {
    const handleModelChange = (newState, newLoading, newError) => {
      setState(newState);
      setLoading(newLoading);
      setError(newError);
    };

    // Set initial state
    setState(model.state);
    setLoading(model.loading);
    setError(model.error);

    // Subscribe to model changes
    model.addListener(handleModelChange);

    // Initialize controller if not already done
    if (!controller.isInitialized) {
      controller.initialize();
    }

    return () => {
      model.removeListener(handleModelChange);
    };
  }, [model, controller]);

  // Create controller wrapper functions
  const createControllerWrapper = useCallback((methodName) => {
    return async (...args) => {
      try {
        const result = await controller[methodName](...args);
        return result;
      } catch (error) {
        console.error(`Error in ${methodName}:`, error);
        throw error;
      }
    };
  }, [controller]);

  // Get all controller methods
  const getControllerMethods = useCallback(() => {
    const methods = {};
    const controllerMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(controller))
      .filter(name => 
        name !== 'constructor' && 
        typeof controller[name] === 'function' &&
        !name.startsWith('_')
      );

    controllerMethods.forEach(methodName => {
      methods[methodName] = createControllerWrapper(methodName);
    });

    return methods;
  }, [controller, createControllerWrapper]);

  return {
    // State
    state,
    loading,
    error,
    
    // Model
    model,
    
    // Controller
    controller,
    controllerMethods: getControllerMethods(),
    
    // Utilities
    clearError: () => controller.clearError(),
    reset: () => controller.reset(),
    
    // Debug
    getSummary: () => ({
      modelSummary: model.getSummary(),
      controllerSummary: controller.getSummary(),
      state: state,
      loading: loading,
      error: error
    })
  };
};

/**
 * MVC Store Hook
 * Specialized hook for store management
 */
export const useStoreMVC = () => {
  const [storeModel] = useState(() => {
    // Import dynamically to avoid circular dependencies
    const StoreModel = require('../models/store/StoreModel').default;
    return new StoreModel();
  });

  const [storeController] = useState(() => {
    // Import dynamically to avoid circular dependencies
    const StoreController = require('../controllers/store/StoreController').default;
    return new StoreController(storeModel);
  });

  return useMVC(storeModel, storeController);
};

/**
 * MVC Auth Hook
 * Specialized hook for authentication
 */
export const useAuthMVC = () => {
  const [authModel] = useState(() => {
    // Import dynamically to avoid circular dependencies
    const AuthModel = require('../models/auth/AuthModel').default;
    return new AuthModel();
  });

  const [userModel] = useState(() => {
    // Import dynamically to avoid circular dependencies
    const UserModel = require('../models/auth/UserModel').default;
    return new UserModel();
  });

  const [authController] = useState(() => {
    // Import dynamically to avoid circular dependencies
    const AuthController = require('../controllers/auth/AuthController').default;
    return new AuthController(authModel, userModel);
  });

  return useMVC(authModel, authController);
};

/**
 * MVC Product Hook
 * Specialized hook for product management
 */
export const useProductMVC = () => {
  const [productModel] = useState(() => {
    // Import dynamically to avoid circular dependencies
    const ProductModel = require('../models/pos/ProductModel').default;
    return new ProductModel();
  });

  const [productController] = useState(() => {
    // Import dynamically to avoid circular dependencies
    const ProductController = require('../controllers/pos/ProductController').default;
    return new ProductController(productModel);
  });

  return useMVC(productModel, productController);
};

/**
 * MVC POS Hook
 * Specialized hook for POS management
 */
export const usePOSMVC = () => {
  const [productModel] = useState(() => {
    // Import dynamically to avoid circular dependencies
    const ProductModel = require('../models/pos/ProductModel').default;
    return new ProductModel();
  });

  const [saleModel] = useState(() => {
    // Import dynamically to avoid circular dependencies
    const SaleModel = require('../models/pos/SaleModel').default;
    return new SaleModel();
  });

  const [posController] = useState(() => {
    // Import dynamically to avoid circular dependencies
    const POSController = require('../controllers/pos/POSController').default;
    return new POSController(productModel, saleModel);
  });

  return {
    productModel,
    saleModel,
    posController,
    ...useMVC(productModel, posController)
  };
};

/**
 * MVC Customer Hook
 * Specialized hook for customer management
 */
export const useCustomerMVC = () => {
  const [customerModel] = useState(() => {
    // Import dynamically to avoid circular dependencies
    const CustomerModel = require('../models/customers/CustomerModel').default;
    return new CustomerModel();
  });

  const [customerController] = useState(() => {
    // Import dynamically to avoid circular dependencies
    const CustomerController = require('../controllers/customers/CustomerController').default;
    return new CustomerController(customerModel);
  });

  return useMVC(customerModel, customerController);
};

/**
 * MVC Inventory Hook
 * Specialized hook for inventory management
 */
export const useInventoryMVC = () => {
  const [inventoryModel] = useState(() => {
    // Import dynamically to avoid circular dependencies
    const InventoryModel = require('../models/inventory/InventoryModel').default;
    return new InventoryModel();
  });

  const [inventoryController] = useState(() => {
    // Import dynamically to avoid circular dependencies
    const InventoryController = require('../controllers/inventory/InventoryController').default;
    return new InventoryController(inventoryModel);
  });

  return useMVC(inventoryModel, inventoryController);
};

export default useMVC; 