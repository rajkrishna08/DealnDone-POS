# DealNDone 2025 - Complete Stack Architecture & Resources

## 🏗️ System Architecture Overview

### Core Technology Stack

#### Backend Stack
- **Framework**: FastAPI (Python 3.12)
- **Database**: SQLite (Primary) + PostgreSQL (Migration Ready)
- **Authentication**: JWT Tokens + MFA Support
- **API Documentation**: OpenAPI/Swagger
- **Server**: Uvicorn ASGI Server
- **Port**: 8005

#### Frontend Stack
- **Framework**: React 18 + Vite 5
- **Language**: JavaScript/JSX
- **Styling**: Tailwind CSS
- **UI Components**: Custom Material Design Components
- **State Management**: React Hooks + Context API
- **Port**: 3001 (Vite), 3003 (Expected)

#### Development Tools
- **Package Manager**: npm (Frontend), pip (Backend)
- **Version Control**: Git
- **Environment**: Python Virtual Environment (.venv)
- **IDE Support**: VS Code/Cursor

## 📁 Project Structure

```
dealndone2025/
├── backend/                    # Backend API Server
│   ├── main.py                # FastAPI Application Entry
│   ├── database.py            # Database Connection & Schema
│   ├── auth_main.py           # Authentication System
│   ├── security.py            # Security Middleware
│   ├── settings.py            # Configuration Management
│   ├── requirements.txt       # Python Dependencies
│   └── dealndone.db          # SQLite Database
├── frontend/                   # React Frontend Application
│   ├── src/
│   │   ├── components/        # React Components
│   │   ├── data/             # Mock Data & Dummy Data
│   │   └── utils/            # Utility Functions
│   ├── package.json          # Node.js Dependencies
│   └── vite.config.js        # Vite Configuration
├── docs/                      # Documentation
├── test_*.py                  # Test Scripts
└── *.md                      # Documentation Files
```

## 🔧 Backend Architecture

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    store_name TEXT UNIQUE NOT NULL,
    business_type TEXT NOT NULL,
    plan_type TEXT NOT NULL DEFAULT 'free',
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'retailer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email_verified BOOLEAN DEFAULT FALSE,
    subdomain TEXT,
    verification_token TEXT,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_phone TEXT,
    org_id TEXT,
    FOREIGN KEY (org_id) REFERENCES organizations (id)
)
```

#### Organizations Table
```sql
CREATE TABLE organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    store_name TEXT UNIQUE NOT NULL,
    business_type TEXT NOT NULL,
    plan_type TEXT NOT NULL DEFAULT 'free',
    owner_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subdomain TEXT,
    max_outlets INTEGER DEFAULT 1,
    max_registers INTEGER DEFAULT 1,
    max_products INTEGER DEFAULT 1000,
    max_employees INTEGER DEFAULT 3,
    FOREIGN KEY (owner_id) REFERENCES users (id)
)
```

#### Additional Tables
- `usage_tracking` - Feature usage limits
- `store_settings` - Organization settings
- `audit_logs` - System audit trail
- `feature_flags` - Feature flag management
- `products` - Inventory management
- `orders` - Sales transactions

### API Endpoints

#### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email` - Email verification
- `POST /api/auth/verify-mfa` - MFA verification

#### Store Management
- `GET /api/store/info` - Store information
- `GET /api/store/limits` - Usage limits
- `GET /api/store/settings/{org_id}` - Store settings
- `PUT /api/store/settings/{org_id}` - Update settings

#### Settings Management
- `GET /api/settings/global` - Global settings
- `GET /api/settings/organization/{org_id}` - Organization settings
- `PUT /api/settings/organization/{org_id}/{key}` - Update settings

#### MCP (Model Context Protocol) Integration
- `GET /mcp/resources/settings` - Settings resources
- `GET /mcp/resources/inventory` - Inventory resources
- `POST /mcp/tools/create-outlet` - Create outlet
- `POST /mcp/tools/send-email` - Send email

#### AI/ML Integration
- `POST /ai/orchestrator/plan` - AI planning
- `POST /ai/orchestrator/execute` - AI execution
- `GET /ai/orchestrator/logs` - AI logs

#### POS System
- `POST /api/pos/process-payment` - Payment processing
- `GET /api/pos/products` - Mobile products
- `POST /api/pos/scan-barcode` - Barcode scanning

### Security Features
- JWT Token Authentication
- Password Hashing (bcrypt)
- MFA Support (TOTP)
- Rate Limiting
- Input Validation
- SQL Injection Prevention
- CORS Configuration

## 🎨 Frontend Architecture

### Component Structure

#### Core Components
- `App.jsx` - Main application component
- `Header.jsx` - Navigation header
- `Sidebar.jsx` - Navigation sidebar
- `Page.jsx` - Page wrapper component

#### Authentication Components
- `SignIn.jsx` - Login form
- `SignUp.jsx` - Registration form
- `Login.jsx` - Alternative login

#### Dashboard Components
- `OwnerDashboard.jsx` - Owner dashboard
- `StoreDashboard.jsx` - Store dashboard
- `RegionalManagerDashboard.jsx` - Manager dashboard
- `ExecutiveDashboard.jsx` - Executive dashboard

#### Settings Components
- `Settings.jsx` - Main settings
- `GeneralSetup.jsx` - General setup
- `BrandingSettings.jsx` - Branding settings
- `SecuritySettings.jsx` - Security settings

#### POS Components
- `POSScreen.jsx` - POS interface
- `POSScreenV2.jsx` - Enhanced POS
- `MobilePOS.jsx` - Mobile POS
- `POSLandingPage.jsx` - POS landing

#### Inventory Components
- `InventoryDashboard.jsx` - Inventory overview
- `ProductCatalog.jsx` - Product catalog
- `ProductCategories.jsx` - Category management
- `StockTake.jsx` - Stock taking

#### Sales Components
- `SalesScreen.jsx` - Sales interface
- `SalesAnalytics.jsx` - Sales analytics
- `SalesHistory.jsx` - Sales history
- `SalesReports.jsx` - Sales reporting

#### Customer Components
- `CustomerDirectory.jsx` - Customer management
- `CustomerAnalytics.jsx` - Customer analytics
- `CustomerLoyalty.jsx` - Loyalty program
- `CustomerSupport.jsx` - Customer support

#### AI Components
- `AICopilotPanel.jsx` - AI assistant
- `DealBotAI.jsx` - Deal bot interface
- `OrchestratorMonitor.jsx` - AI monitoring

### State Management
- React Context API for global state
- Local state with useState/useEffect
- Custom hooks for data fetching
- Settings service for configuration

### Styling System
- Tailwind CSS for utility-first styling
- Custom CSS classes for specific components
- Material Design icons
- Responsive design patterns

## 🚀 Development Environment

### Prerequisites
- Python 3.12+
- Node.js 18+
- npm or yarn
- Git

### Environment Setup
```bash
# Backend Setup
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate      # Windows
pip install -r requirements.txt

# Frontend Setup
cd frontend
npm install
```

### Running the Application

#### Development Mode
```bash
# Terminal 1 - Backend
cd backend
python main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Production Mode
```bash
# Backend
cd backend
python main.py

# Frontend
cd frontend
npm run build
npm run preview
```

## 📊 Database Resources

### Current Database Files
- `dealndone.db` - Main SQLite database
- `dealndone_auth.db` - Authentication database
- `dealndone_simple.db` - Simple test database

### Database Features
- SQLite for development
- PostgreSQL migration ready
- Automatic schema creation
- Migration scripts available
- Backup and restore capabilities

## 🔌 Integration Points

### External Services
- **Email Service**: SMTP integration (SendGrid ready)
- **Payment Processing**: Stripe integration ready
- **SMS Service**: Twilio integration ready
- **File Storage**: AWS S3 integration ready
- **Analytics**: Google Analytics integration

### Third-Party APIs
- **MCP (Model Context Protocol)**: AI integration
- **OpenAI API**: AI/ML capabilities
- **Redis**: Caching and session management
- **Celery**: Background task processing

## 🧪 Testing Infrastructure

### Test Scripts
- `test_signup_flow.py` - Complete signup testing
- `test_auth.py` - Authentication testing
- `test_main.py` - Main functionality testing
- `test_server.py` - Server testing

### Testing Features
- Automated API testing
- Frontend component testing
- Database integration testing
- Performance testing
- Security testing

## 📈 Monitoring & Analytics

### Backend Monitoring
- Health check endpoints
- Performance metrics
- Error logging
- Audit trails
- Rate limiting

### Frontend Monitoring
- Error boundary components
- Performance monitoring
- User analytics
- A/B testing capabilities

## 🔒 Security Architecture

### Authentication Flow
1. User registration with email verification
2. JWT token generation
3. MFA setup (optional)
4. Session management
5. Token refresh mechanism

### Security Measures
- Password strength validation
- Input sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Audit logging

## 🚀 Deployment Architecture

### Development Deployment
- Local development servers
- Hot reloading
- Debug mode enabled
- Development database

### Production Deployment
- Docker containerization
- Load balancing ready
- Database clustering
- CDN integration
- SSL/TLS encryption

## 📚 Documentation Resources

### Technical Documentation
- API documentation (OpenAPI/Swagger)
- Database schema documentation
- Component documentation
- Deployment guides
- Troubleshooting guides

### User Documentation
- User manuals
- Feature guides
- Video tutorials
- FAQ sections

## 🛠️ Development Tools

### Code Quality
- ESLint for JavaScript
- Prettier for code formatting
- TypeScript support ready
- Unit testing framework
- Integration testing

### DevOps Tools
- Git version control
- CI/CD pipeline ready
- Docker containerization
- Kubernetes deployment ready
- Monitoring and logging

## 📊 Performance Metrics

### Backend Performance
- API response times
- Database query optimization
- Memory usage monitoring
- CPU utilization tracking

### Frontend Performance
- Page load times
- Bundle size optimization
- Image optimization
- Caching strategies

## 🔄 Data Flow Architecture

### User Registration Flow
1. Frontend form submission
2. Backend validation
3. Database user creation
4. Email verification
5. Organization setup
6. Trial activation

### Authentication Flow
1. Login credentials
2. Password verification
3. JWT token generation
4. Session establishment
5. MFA verification (if enabled)

### Data Processing Flow
1. Input validation
2. Business logic processing
3. Database operations
4. Response formatting
5. Error handling

## 🎯 Business Logic

### Subscription Management
- Plan selection
- Payment processing
- Usage tracking
- Feature limits
- Upgrade/downgrade logic

### Inventory Management
- Product catalog
- Stock tracking
- Barcode scanning
- Inventory reports
- Stock taking

### Sales Processing
- POS interface
- Payment processing
- Receipt generation
- Sales reporting
- Customer management

### Analytics & Reporting
- Sales analytics
- Customer analytics
- Inventory analytics
- Financial reporting
- Performance metrics

## 🔮 Future Enhancements

### Planned Features
- Advanced AI integration
- Mobile app development
- Multi-language support
- Advanced analytics
- Third-party integrations

### Scalability Plans
- Microservices architecture
- Cloud deployment
- Database sharding
- Load balancing
- Auto-scaling

## 📞 Support & Maintenance

### Support Channels
- Technical documentation
- User guides
- Video tutorials
- Community forums
- Direct support

### Maintenance Procedures
- Regular backups
- Security updates
- Performance monitoring
- Bug fixes
- Feature updates

---

This comprehensive stack architecture provides a solid foundation for the DealNDone 2025 POS system with room for growth and scalability. 