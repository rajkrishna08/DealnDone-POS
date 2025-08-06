# Subdomain Routing Implementation

## Overview

The DealNDone 2025 system implements a flexible subdomain routing system that works seamlessly in both development and production environments. This allows each store to have its own unique URL while maintaining a single codebase.

## Architecture

### URL Patterns

#### Development Environment
- **Format**: `http://localhost:3002/?store=storename`
- **Examples**:
  - `http://localhost:3002/?store=honey`
  - `http://localhost:3002/?store=test`
  - `http://localhost:3002/?store=demo`

#### Production Environment
- **Format**: `https://storename.dealndone.com`
- **Examples**:
  - `https://honey.dealndone.com`
  - `https://test.dealndone.com`
  - `https://demo.dealndone.com`

## Implementation Components

### 1. Utility Functions (`frontend/src/utils/subdomainUtils.js`)

Core utility functions for handling subdomain routing:

```javascript
// Environment detection
const isDevelopment = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname.includes('localhost');
};

// Store name extraction
export const getCurrentStoreName = () => {
  if (isDevelopment()) {
    // Development: Extract from query parameter
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('store');
  } else {
    // Production: Extract from subdomain
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    
    // Check if it's a valid subdomain (not www, api, etc.)
    const reservedSubdomains = ['www', 'api', 'admin', 'app', 'staging', 'dev'];
    if (reservedSubdomains.includes(subdomain)) {
      return null;
    }
    
    return subdomain;
  }
};

// URL building
export const buildStoreUrl = (storeName, path = '') => {
  if (isDevelopment()) {
    // Development: Use query parameter
    const baseUrl = window.location.origin;
    const queryParams = new URLSearchParams({ store: storeName });
    return `${baseUrl}${path}?${queryParams.toString()}`;
  } else {
    // Production: Use subdomain
    const domain = window.location.hostname.split('.').slice(-2).join('.');
    return `https://${storeName}.${domain}${path}`;
  }
};
```

### 2. React Hook (`frontend/src/hooks/useStoreRouting.js`)

Custom React hook that encapsulates subdomain routing logic:

```javascript
export const useStoreRouting = () => {
  const [currentStore, setCurrentStore] = useState(null);
  const [environmentInfo, setEnvironmentInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get current store name from URL
  const getStoreFromUrl = useCallback(() => {
    return getCurrentStoreName();
  }, []);

  // Navigate to specific store
  const goToStore = useCallback((storeName, path = '') => {
    if (isValidStoreName(storeName)) {
      navigateToStore(storeName, path);
    } else {
      console.error('Invalid store name:', storeName);
    }
  }, []);

  return {
    currentStore,
    environmentInfo,
    isLoading,
    getStoreFromUrl,
    goToStore,
    buildUrlForStore,
    validateStoreName,
    sanitizeStore,
    isDevelopment: environmentInfo?.isDevelopment || false,
    isProduction: environmentInfo?.isProduction || false,
    hasValidStore: hasStore()
  };
};
```

### 3. Store Selector Component (`frontend/src/components/StoreSelector.jsx`)

UI component for store selection and navigation:

```javascript
const StoreSelector = ({ className = '' }) => {
  const {
    currentStore,
    isDevelopment,
    isProduction,
    goToStore,
    validateStoreName,
    sanitizeStore,
    buildUrlForStore
  } = useStoreRouting();

  // Sample stores for demo
  const sampleStores = [
    { name: 'honey', displayName: 'Honey Store' },
    { name: 'test', displayName: 'Test Store' },
    { name: 'demo', displayName: 'Demo Store' },
    { name: 'fashion', displayName: 'Fashion Store' },
    { name: 'electronics', displayName: 'Electronics Store' }
  ];

  const handleStoreSelect = (storeName) => {
    if (validateStoreName(storeName)) {
      goToStore(storeName);
      setIsOpen(false);
      setInputValue('');
    }
  };
};
```

### 4. Demo Component (`frontend/src/components/SubdomainDemo.jsx`)

Comprehensive demo component for testing subdomain functionality:

```javascript
const SubdomainDemo = () => {
  const {
    currentStore,
    environmentInfo,
    isLoading,
    isDevelopment,
    isProduction,
    hasValidStore,
    goToStore
  } = useStoreRouting();

  // Test stores
  const testStores = [
    { name: 'honey', displayName: 'Honey Store' },
    { name: 'test', displayName: 'Test Store' },
    { name: 'demo', displayName: 'Demo Store' },
    { name: 'fashion', displayName: 'Fashion Store' },
    { name: 'electronics', displayName: 'Electronics Store' }
  ];
};
```

## Store Name Validation

### Validation Rules

Store names must follow these rules:
- **Pattern**: `^[a-z0-9-]+$` (lowercase letters, numbers, hyphens only)
- **Length**: 3-50 characters
- **Format**: Cannot start or end with hyphen
- **Reserved**: Cannot use reserved subdomains (www, api, admin, app, staging, dev)

### Validation Function

```javascript
export const isValidStoreName = (storeName) => {
  if (!storeName) return false;
  
  // Store name validation rules
  const validPattern = /^[a-z0-9-]+$/;
  const minLength = 3;
  const maxLength = 50;
  
  return (
    validPattern.test(storeName) &&
    storeName.length >= minLength &&
    storeName.length <= maxLength &&
    !storeName.startsWith('-') &&
    !storeName.endsWith('-')
  );
};
```

### Sanitization Function

```javascript
export const sanitizeStoreName = (storeName) => {
  if (!storeName) return '';
  
  return storeName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};
```

## Integration with App.jsx

The main App component integrates the subdomain routing:

```javascript
function App() {
  // Use the new store routing hook
  const storeRouting = useStoreRouting();

  // Detect subdomain and initialize app
  useEffect(() => {
    const initializeApp = async () => {
      // Use the new store routing system
      const detectedStore = storeRouting.getStoreFromUrl();
      const detectedSubdomain = detectedStore;
      setSubdomain(detectedSubdomain);
      
      // Check authentication
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
          
          // If on a subdomain, fetch store info
          if (detectedSubdomain) {
            await fetchCurrentStore(detectedSubdomain, token);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          handleLogout();
        }
      }
      
      setLoading(false);
    };
    
    initializeApp();
  }, [storeRouting]);
}
```

## Integration with Sidebar

The StoreSelector is integrated into the sidebar for easy store switching:

```javascript
// In Sidebar.jsx
import StoreSelector from './StoreSelector';

// In the header section
<div className="mt-4">
  <StoreSelector />
</div>
```

## Testing

### Manual Testing

1. **Development URLs**:
   - Visit: `http://localhost:3002/?store=honey`
   - Visit: `http://localhost:3002/?store=test`
   - Visit: `http://localhost:3002/?store=demo`

2. **Store Selector**:
   - Click the store selector in the sidebar
   - Try different store names
   - Test invalid store names

3. **Demo Page**:
   - Navigate to "Subdomain Demo" in the sidebar
   - Test all functionality

### Automated Testing

Run the test script:

```bash
python test_subdomain_routing.py
```

This script tests:
- Development URL patterns
- Backend API connectivity
- Store creation
- URL validation
- Production URL simulation

## Backend Integration

### Store Creation

The backend validates store names during signup:

```python
# In backend/main.py
@app.post("/signup")
async def signup(user_data: UserSignup):
    # Validate store name format
    if not re.match(r'^[a-z0-9-]+$', user_data.store_name):
        raise HTTPException(
            status_code=400, 
            detail="Store name must contain only lowercase letters, numbers, and hyphens"
        )
    
    # Check store name length
    if len(user_data.store_name) < 3 or len(user_data.store_name) > 50:
        raise HTTPException(
            status_code=400, 
            detail="Store name must be between 3 and 50 characters"
        )
```

### Database Schema

The organizations table stores store information:

```sql
CREATE TABLE organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subdomain TEXT UNIQUE NOT NULL,
    business_type TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    max_outlets INTEGER DEFAULT 1,
    max_registers INTEGER DEFAULT 1,
    max_products INTEGER DEFAULT 1000,
    max_employees INTEGER DEFAULT 3
);
```

## Production Deployment

### DNS Configuration

For production deployment, configure DNS wildcards:

```
*.dealndone.com    IN  A    YOUR_SERVER_IP
dealndone.com      IN  A    YOUR_SERVER_IP
```

### Web Server Configuration

Configure your web server (nginx/Apache) to handle subdomains:

```nginx
# nginx configuration example
server {
    listen 80;
    server_name *.dealndone.com;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Security Considerations

1. **Store Name Validation**: Strict validation prevents malicious store names
2. **Reserved Subdomains**: Protected against using system subdomains
3. **Input Sanitization**: All store names are sanitized before use
4. **Environment Detection**: Automatic detection prevents confusion

## Performance Considerations

1. **Caching**: Store information can be cached for better performance
2. **Lazy Loading**: Store-specific data loaded only when needed
3. **CDN**: Static assets served from CDN for better global performance

## Future Enhancements

1. **Custom Domains**: Allow stores to use their own domains
2. **SSL Certificates**: Automatic SSL certificate generation for subdomains
3. **Store Templates**: Pre-built store templates for different business types
4. **Multi-tenant Architecture**: Enhanced isolation between stores

## Troubleshooting

### Common Issues

1. **Store not detected**:
   - Check URL format (development vs production)
   - Verify store name validation
   - Check browser console for errors

2. **Navigation not working**:
   - Ensure `useStoreRouting` hook is properly imported
   - Check if `goToStore` function is called correctly
   - Verify store name validation

3. **Backend errors**:
   - Check if backend is running on port 8005
   - Verify database schema is up to date
   - Check backend logs for errors

### Debug Information

The SubdomainDemo component provides comprehensive debug information:
- Current store detection
- Environment information
- URL format details
- Test store navigation

## Conclusion

The subdomain routing system provides a robust, flexible solution for multi-tenant store management. It seamlessly handles both development and production environments while maintaining security and performance standards.

The implementation is modular, well-documented, and easily extensible for future enhancements. 