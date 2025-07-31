// Comprehensive dummy data for Deal n Done, Inc.

export const users = {
  storeManager: {
    name: "Nick Johnson",
    email: "nick@dealndone.com",
    role: "Store Manager",
    store: "Deal n Done, Inc.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    permissions: ["view_dashboard", "manage_products", "process_sales", "view_reports"]
  },
  regionalManager: {
    name: "Sarah Chen",
    email: "sarah@dealndone.com",
    role: "Regional Manager",
    store: "Deal n Done, Inc.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    permissions: ["view_dashboard", "manage_products", "process_sales", "view_reports", "manage_stores", "view_regional_reports"]
  },
  ceo: {
    name: "Michael Rodriguez",
    email: "michael@dealndone.com",
    role: "CEO",
    store: "Deal n Done, Inc.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    permissions: ["view_dashboard", "manage_products", "process_sales", "view_reports", "manage_stores", "view_regional_reports", "manage_users", "view_financial_reports"]
  }
};

export const products = [
  {
    id: 1,
    name: "Samsung 55\" 4K Smart TV",
    price: 699.99,
    category: "Electronics",
    stock: 15,
    barcode: "1234567890123",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop",
    description: "Ultra HD 4K resolution with Smart TV features",
    locations: ["Main Store - Aisle 3", "Downtown Branch - Aisle 1"]
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    price: 999.99,
    category: "Electronics",
    stock: 8,
    barcode: "1234567890124",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop",
    description: "Latest iPhone with advanced camera system",
    locations: ["Main Store - Aisle 2", "Downtown Branch - Aisle 1"]
  },
  {
    id: 3,
    name: "MacBook Air M2",
    price: 1199.99,
    category: "Electronics",
    stock: 5,
    barcode: "1234567890125",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop",
    description: "Lightweight laptop with M2 chip",
    locations: ["Main Store - Aisle 4"]
  },
  {
    id: 4,
    name: "Sony WH-1000XM5 Headphones",
    price: 349.99,
    category: "Electronics",
    stock: 12,
    barcode: "1234567890126",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
    description: "Premium noise-cancelling wireless headphones",
    locations: ["Main Store - Aisle 1", "Downtown Branch - Aisle 2"]
  },
  {
    id: 5,
    name: "LG Front Load Washer",
    price: 799.99,
    category: "Appliances",
    stock: 3,
    barcode: "1234567890127",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
    description: "Energy-efficient front load washing machine",
    locations: ["Main Store - Aisle 5"]
  },
  {
    id: 6,
    name: "KitchenAid Stand Mixer",
    price: 399.99,
    category: "Appliances",
    stock: 7,
    barcode: "1234567890128",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
    description: "Professional stand mixer for baking",
    locations: ["Main Store - Aisle 6", "Downtown Branch - Aisle 3"]
  },
  {
    id: 7,
    name: "Dyson V15 Detect",
    price: 699.99,
    category: "Appliances",
    stock: 4,
    barcode: "1234567890129",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
    description: "Cordless vacuum with laser detection",
    locations: ["Main Store - Aisle 7"]
  },
  {
    id: 8,
    name: "Nintendo Switch OLED",
    price: 349.99,
    category: "Electronics",
    stock: 10,
    barcode: "1234567890130",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=300&h=200&fit=crop",
    description: "Handheld gaming console with OLED screen",
    locations: ["Main Store - Aisle 2", "Downtown Branch - Aisle 1"]
  }
];

export const orders = [
  {
    id: "ORD-001",
    customer: "John Smith",
    items: [
      { productId: 1, name: "Samsung 55\" 4K Smart TV", quantity: 1, price: 699.99 },
      { productId: 4, name: "Sony WH-1000XM5 Headphones", quantity: 1, price: 349.99 }
    ],
    total: 1049.98,
    status: "completed",
    date: "2024-01-15",
    paymentMethod: "Credit Card"
  },
  {
    id: "ORD-002",
    customer: "Emily Davis",
    items: [
      { productId: 2, name: "iPhone 15 Pro", quantity: 1, price: 999.99 }
    ],
    total: 999.99,
    status: "processing",
    date: "2024-01-16",
    paymentMethod: "Digital Wallet"
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    items: [
      { productId: 6, name: "KitchenAid Stand Mixer", quantity: 1, price: 399.99 },
      { productId: 8, name: "Nintendo Switch OLED", quantity: 1, price: 349.99 }
    ],
    total: 749.98,
    status: "completed",
    date: "2024-01-17",
    paymentMethod: "Cash"
  }
];

export const salesData = {
  daily: [
    { date: "2024-01-01", sales: 12500 },
    { date: "2024-01-02", sales: 13800 },
    { date: "2024-01-03", sales: 11200 },
    { date: "2024-01-04", sales: 15600 },
    { date: "2024-01-05", sales: 18900 },
    { date: "2024-01-06", sales: 22100 },
    { date: "2024-01-07", sales: 19800 }
  ],
  monthly: [
    { month: "Jan 2024", sales: 425000 },
    { month: "Feb 2024", sales: 438000 },
    { month: "Mar 2024", sales: 412000 },
    { month: "Apr 2024", sales: 456000 },
    { month: "May 2024", sales: 489000 },
    { month: "Jun 2024", sales: 521000 }
  ]
};

export const customers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    totalSpent: 2549.97,
    orders: 3,
    lastVisit: "2024-01-15",
    segment: "Premium"
  },
  {
    id: 2,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 (555) 234-5678",
    totalSpent: 999.99,
    orders: 1,
    lastVisit: "2024-01-16",
    segment: "Regular"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@email.com",
    phone: "+1 (555) 345-6789",
    totalSpent: 749.98,
    orders: 1,
    lastVisit: "2024-01-17",
    segment: "Regular"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    phone: "+1 (555) 456-7890",
    totalSpent: 1899.98,
    orders: 2,
    lastVisit: "2024-01-14",
    segment: "Premium"
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@email.com",
    phone: "+1 (555) 567-8901",
    totalSpent: 349.99,
    orders: 1,
    lastVisit: "2024-01-13",
    segment: "Regular"
  }
];

export const employees = [
  {
    id: 1,
    name: "Nick Johnson",
    email: "nick@dealndone.com",
    phone: "+1 (555) 111-1111",
    role: "Store Manager",
    outlet: "Main Store",
    status: "active",
    hireDate: "2023-01-15",
    permissions: ["view_dashboard", "manage_products", "process_sales", "view_reports"]
  },
  {
    id: 2,
    name: "Lisa Chen",
    email: "lisa@dealndone.com",
    phone: "+1 (555) 222-2222",
    role: "Cashier",
    outlet: "Main Store",
    status: "active",
    hireDate: "2023-03-20",
    permissions: ["process_sales", "view_reports"]
  },
  {
    id: 3,
    name: "Tom Wilson",
    email: "tom@dealndone.com",
    phone: "+1 (555) 333-3333",
    role: "Sales Associate",
    outlet: "Downtown Branch",
    status: "active",
    hireDate: "2023-06-10",
    permissions: ["process_sales", "view_reports"]
  },
  {
    id: 4,
    name: "Maria Garcia",
    email: "maria@dealndone.com",
    phone: "+1 (555) 444-4444",
    role: "Cashier",
    outlet: "Downtown Branch",
    status: "active",
    hireDate: "2023-08-05",
    permissions: ["process_sales", "view_reports"]
  }
];

export const timeSheets = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Nick Johnson",
    date: "2024-01-17",
    clockIn: "09:00",
    clockOut: "17:00",
    totalHours: 8,
    breakTime: 60,
    status: "approved",
    outlet: "Main Store",
    notes: "Regular shift"
  },
  {
    id: 2,
    employeeId: 1,
    employeeName: "Nick Johnson",
    date: "2024-01-16",
    clockIn: "08:30",
    clockOut: "17:30",
    totalHours: 8.5,
    breakTime: 60,
    status: "approved",
    outlet: "Main Store",
    notes: "Early start for inventory"
  },
  {
    id: 3,
    employeeId: 2,
    employeeName: "Lisa Chen",
    date: "2024-01-17",
    clockIn: "10:00",
    clockOut: "18:00",
    totalHours: 8,
    breakTime: 60,
    status: "pending",
    outlet: "Main Store",
    notes: "Regular shift"
  },
  {
    id: 4,
    employeeId: 2,
    employeeName: "Lisa Chen",
    date: "2024-01-16",
    clockIn: "09:00",
    clockOut: "17:00",
    totalHours: 8,
    breakTime: 60,
    status: "approved",
    outlet: "Main Store",
    notes: "Regular shift"
  },
  {
    id: 5,
    employeeId: 3,
    employeeName: "Tom Wilson",
    date: "2024-01-17",
    clockIn: "11:00",
    clockOut: "19:00",
    totalHours: 8,
    breakTime: 60,
    status: "approved",
    outlet: "Downtown Branch",
    notes: "Regular shift"
  },
  {
    id: 6,
    employeeId: 3,
    employeeName: "Tom Wilson",
    date: "2024-01-16",
    clockIn: "10:00",
    clockOut: "18:00",
    totalHours: 8,
    breakTime: 60,
    status: "approved",
    outlet: "Downtown Branch",
    notes: "Regular shift"
  },
  {
    id: 7,
    employeeId: 4,
    employeeName: "Maria Garcia",
    date: "2024-01-17",
    clockIn: "12:00",
    clockOut: "20:00",
    totalHours: 8,
    breakTime: 60,
    status: "pending",
    outlet: "Downtown Branch",
    notes: "Regular shift"
  },
  {
    id: 8,
    employeeId: 4,
    employeeName: "Maria Garcia",
    date: "2024-01-16",
    clockIn: "11:00",
    clockOut: "19:00",
    totalHours: 8,
    breakTime: 60,
    status: "approved",
    outlet: "Downtown Branch",
    notes: "Regular shift"
  }
];

export const outlets = [
  {
    id: 1,
    name: "Main Store",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA",
    phone: "+1 (555) 123-4567",
    status: "active",
    registers: 3,
    employees: 2
  },
  {
    id: 2,
    name: "Downtown Branch",
    address: "456 Broadway Ave",
    city: "New York",
    state: "NY",
    zip: "10002",
    country: "USA",
    phone: "+1 (555) 123-4568",
    status: "active",
    registers: 2,
    employees: 2
  }
];

export const registers = [
  {
    id: 1,
    name: "Register 1",
    outlet: "Main Store",
    status: "active",
    lastTransaction: "2024-01-17 14:30:00"
  },
  {
    id: 2,
    name: "Register 2",
    outlet: "Main Store",
    status: "active",
    lastTransaction: "2024-01-17 15:45:00"
  },
  {
    id: 3,
    name: "Register 3",
    outlet: "Main Store",
    status: "inactive",
    lastTransaction: "2024-01-16 18:20:00"
  },
  {
    id: 4,
    name: "Register 1",
    outlet: "Downtown Branch",
    status: "active",
    lastTransaction: "2024-01-17 16:15:00"
  },
  {
    id: 5,
    name: "Register 2",
    outlet: "Downtown Branch",
    status: "active",
    lastTransaction: "2024-01-17 13:25:00"
  }
];

export const businessHours = [
  {
    id: 1,
    day: "Monday",
    open: "09:00",
    close: "18:00",
    status: "open"
  },
  {
    id: 2,
    day: "Tuesday",
    open: "09:00",
    close: "18:00",
    status: "open"
  },
  {
    id: 3,
    day: "Wednesday",
    open: "09:00",
    close: "18:00",
    status: "open"
  },
  {
    id: 4,
    day: "Thursday",
    open: "09:00",
    close: "18:00",
    status: "open"
  },
  {
    id: 5,
    day: "Friday",
    open: "09:00",
    close: "20:00",
    status: "open"
  },
  {
    id: 6,
    day: "Saturday",
    open: "10:00",
    close: "16:00",
    status: "open"
  },
  {
    id: 7,
    day: "Sunday",
    open: "12:00",
    close: "16:00",
    status: "closed"
  }
];

export const contactInfo = [
  {
    id: 1,
    type: "Phone",
    value: "+1 (555) 123-4567",
    primary: true,
    description: "Main business phone"
  },
  {
    id: 2,
    type: "Email",
    value: "info@dealndone.com",
    primary: true,
    description: "General inquiries"
  },
  {
    id: 3,
    type: "Support Email",
    value: "support@dealndone.com",
    primary: false,
    description: "Technical support"
  },
  {
    id: 4,
    type: "Fax",
    value: "+1 (555) 123-4568",
    primary: false,
    description: "Business fax"
  }
];

export const socialMedia = [
  {
    id: 1,
    platform: "Facebook",
    url: "https://facebook.com/dealndone",
    status: "active"
  },
  {
    id: 2,
    platform: "Instagram",
    url: "https://instagram.com/dealndone",
    status: "active"
  },
  {
    id: 3,
    platform: "Twitter",
    url: "https://twitter.com/dealndone",
    status: "inactive"
  },
  {
    id: 4,
    platform: "LinkedIn",
    url: "https://linkedin.com/company/dealndone",
    status: "active"
  }
];

export const loyaltyProgram = {
  name: "Deal n Done Rewards",
  status: "active",
  pointsPerDollar: 1,
  pointsToDollarValue: 0.01,
  welcomeBonus: 100,
  minimumRedemption: 500,
  expiration: "12 months",
  members: 1247,
  tiers: [
    {
      id: 1,
      name: "Bronze",
      minSpend: 0,
      pointsMultiplier: 1,
      benefits: ["Standard rewards", "Email updates"]
    },
    {
      id: 2,
      name: "Silver",
      minSpend: 1000,
      pointsMultiplier: 1.2,
      benefits: ["20% bonus points", "Free shipping", "Priority support"]
    },
    {
      id: 3,
      name: "Gold",
      minSpend: 2500,
      pointsMultiplier: 1.5,
      benefits: ["50% bonus points", "Free shipping", "Priority support", "Exclusive offers"]
    },
    {
      id: 4,
      name: "Platinum",
      minSpend: 5000,
      pointsMultiplier: 2,
      benefits: ["100% bonus points", "Free shipping", "Priority support", "Exclusive offers", "VIP events"]
    }
  ],
  rewards: [
    {
      id: 1,
      name: "Discount Coupon",
      type: "percentage",
      value: 10,
      pointsCost: 1000,
      description: "10% off your next purchase"
    },
    {
      id: 2,
      name: "Free Shipping",
      type: "shipping",
      value: 0,
      pointsCost: 500,
      description: "Free shipping on your next order"
    },
    {
      id: 3,
      name: "Cash Back",
      type: "cash",
      value: 5,
      pointsCost: 500,
      description: "$5 cash back"
    }
  ]
};

export const taxRates = [
  {
    id: 1,
    name: "Standard Sales Tax",
    rate: 8.5,
    type: "percentage",
    appliesTo: "All Products",
    effectiveDate: "2024-01-01",
    status: "active"
  },
  {
    id: 2,
    name: "Food & Beverage Tax",
    rate: 6.0,
    type: "percentage",
    appliesTo: "Food & Beverages",
    effectiveDate: "2024-01-01",
    status: "active"
  },
  {
    id: 3,
    name: "Luxury Goods Tax",
    rate: 12.0,
    type: "percentage",
    appliesTo: "Luxury Items",
    effectiveDate: "2024-01-01",
    status: "active"
  }
];

export const paymentMethods = [
  {
    id: 1,
    name: "Cash",
    type: "cash",
    status: "active",
    defaultChange: 20,
    allowPartialPayment: true,
    description: "Physical cash payments"
  },
  {
    id: 2,
    name: "Credit Card",
    type: "card",
    status: "active",
    gateway: "Stripe",
    processingFee: 2.9,
    allowPartialPayment: false,
    description: "Credit and debit card payments"
  },
  {
    id: 3,
    name: "Digital Wallet",
    type: "digital",
    status: "active",
    gateway: "PayPal",
    processingFee: 2.5,
    allowPartialPayment: true,
    description: "Apple Pay, Google Pay, PayPal"
  },
  {
    id: 4,
    name: "Check",
    type: "check",
    status: "inactive",
    requireApproval: true,
    allowPartialPayment: false,
    description: "Physical check payments"
  }
];

export const storeInfo = {
  storeName: "Deal n Done, Inc.",
  businessType: "Retail",
  industry: "Electronics & Appliances",
  founded: "2020",
  website: "www.dealndone.com",
  description: "Your trusted partner for quality electronics and appliances with exceptional customer service.",
  logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop"
};

export const dashboardMetrics = {
  storeManager: {
    todaySales: 12500,
    pendingOrders: 3,
    lowStockItems: 2,
    staffOnDuty: 4,
    recentActivities: [
      { id: 1, type: "sale", message: "New sale: Samsung TV - $699.99", time: "2 hours ago" },
      { id: 2, type: "order", message: "Order #ORD-002 processed", time: "4 hours ago" },
      { id: 3, type: "stock", message: "Low stock alert: iPhone 15 Pro", time: "6 hours ago" },
      { id: 4, type: "customer", message: "New customer registered", time: "8 hours ago" }
    ]
  },
  regionalManager: {
    totalStores: 2,
    totalSales: 26300,
    averageOrderValue: 875,
    topPerformingStore: "Main Store",
    storePerformance: [
      { name: "Main Store", sales: 12500, orders: 15, growth: 12 },
      { name: "Downtown Branch", sales: 13800, orders: 18, growth: 8 }
    ]
  },
  ceo: {
    totalRevenue: 425000,
    totalStores: 2,
    totalEmployees: 4,
    growthRate: 15,
    regionalPerformance: [
      { region: "Northeast", revenue: 425000, stores: 2, growth: 15 },
      { region: "Southeast", revenue: 0, stores: 0, growth: 0 },
      { region: "Midwest", revenue: 0, stores: 0, growth: 0 },
      { region: "West", revenue: 0, stores: 0, growth: 0 }
    ]
  }
};

export const inventoryLocations = [
  {
    id: 1,
    storeId: 1,
    name: "Main Store - Aisle 1",
    description: "Electronics accessories and headphones",
    products: [4, 8]
  },
  {
    id: 2,
    storeId: 1,
    name: "Main Store - Aisle 2",
    description: "Mobile phones and gaming",
    products: [2, 8]
  },
  {
    id: 3,
    storeId: 1,
    name: "Main Store - Aisle 3",
    description: "TVs and home entertainment",
    products: [1]
  },
  {
    id: 4,
    storeId: 1,
    name: "Main Store - Aisle 4",
    description: "Computers and laptops",
    products: [3]
  },
  {
    id: 5,
    storeId: 1,
    name: "Main Store - Aisle 5",
    description: "Large appliances",
    products: [5]
  },
  {
    id: 6,
    storeId: 1,
    name: "Main Store - Aisle 6",
    description: "Kitchen appliances",
    products: [6]
  },
  {
    id: 7,
    storeId: 1,
    name: "Main Store - Aisle 7",
    description: "Cleaning appliances",
    products: [7]
  },
  {
    id: 8,
    storeId: 2,
    name: "Downtown Branch - Aisle 1",
    description: "Electronics and mobile",
    products: [1, 2, 8]
  },
  {
    id: 9,
    storeId: 2,
    name: "Downtown Branch - Aisle 2",
    description: "Audio equipment",
    products: [4]
  },
  {
    id: 10,
    storeId: 2,
    name: "Downtown Branch - Aisle 3",
    description: "Kitchen and home",
    products: [6]
  }
];

export const stockTakingSessions = [
  {
    id: 1,
    storeId: 1,
    date: "2024-01-17",
    status: "completed",
    totalItems: 45,
    scannedItems: 45,
    accuracy: 100
  },
  {
    id: 2,
    storeId: 2,
    date: "2024-01-16",
    status: "in_progress",
    totalItems: 38,
    scannedItems: 25,
    accuracy: 65
  }
];

export const pricingPlans = {
  regions: [
    { code: "US", name: "United States", currency: "USD", symbol: "$" },
    { code: "CA", name: "Canada", currency: "CAD", symbol: "C$" },
    { code: "UK", name: "United Kingdom", currency: "GBP", symbol: "£" },
    { code: "EU", name: "European Union", currency: "EUR", symbol: "€" },
    { code: "IN", name: "India", currency: "INR", symbol: "₹" },
    { code: "AU", name: "Australia", currency: "AUD", symbol: "A$" }
  ],
  plans: [
    {
      id: "free",
      name: "Free",
      price: 0,
      features: [
        "Basic POS functionality",
        "Up to 100 products",
        "Basic reporting",
        "Email support"
      ],
      limits: {
        locations: 1,
        registers: 1,
        employees: 1
      }
    },
    {
      id: "starter",
      name: "Starter",
      price: 29,
      features: [
        "Full POS functionality",
        "Unlimited products",
        "Advanced reporting",
        "Multi-location support",
        "Email & phone support"
      ],
      limits: {
        locations: 2,
        registers: 3,
        employees: 3
      }
    },
    {
      id: "professional",
      name: "Professional",
      price: 79,
      features: [
        "Everything in Starter",
        "Advanced analytics",
        "Inventory management",
        "Customer loyalty program",
        "API access",
        "Priority support"
      ],
      limits: {
        locations: 5,
        registers: 10,
        employees: 10
      }
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 199,
      features: [
        "Everything in Professional",
        "Custom integrations",
        "Advanced security",
        "Dedicated support",
        "Custom reporting",
        "White-label options"
      ],
      limits: {
        locations: -1, // Unlimited
        registers: -1, // Unlimited
        employees: -1  // Unlimited
      }
    }
  ]
};

const dummyData = {
  users,
  products,
  orders,
  salesData,
  customers,
  employees,
  timeSheets,
  outlets,
  registers,
  businessHours,
  contactInfo,
  socialMedia,
  loyaltyProgram,
  taxRates,
  paymentMethods,
  storeInfo,
  dashboardMetrics,
  inventoryLocations,
  stockTakingSessions,
  pricingPlans,
  // Inventory Module Data
  inventoryDashboard: {
    totalProducts: 1247,
    lowStockItems: 12,
    outOfStockItems: 3,
    totalValue: 45230,
    recentPurchases: [
      { id: 1, product: 'Classic White Shirt', quantity: 50, date: '2025-01-30', cost: 1250, supplier: 'Fashion Wholesale Co.' },
      { id: 2, product: 'Blue Oxford Shirt', quantity: 30, date: '2025-01-29', cost: 900, supplier: 'Textile Traders Ltd.' },
      { id: 3, product: 'Black Formal Shirt', quantity: 25, date: '2025-01-28', cost: 750, supplier: 'Premium Fabrics Inc.' },
      { id: 4, product: 'Denim Jeans', quantity: 40, date: '2025-01-27', cost: 1800, supplier: 'Fashion Wholesale Co.' },
      { id: 5, product: 'Leather Belt', quantity: 60, date: '2025-01-26', cost: 1200, supplier: 'Accessories Plus' }
    ],
    stockAlerts: [
      { id: 1, name: 'Classic White Shirt', currentStock: 3, minStock: 10, department: 'Men\'s Clothing' },
      { id: 2, name: 'Blue Oxford Shirt', currentStock: 2, minStock: 10, department: 'Men\'s Clothing' },
      { id: 3, name: 'Black Formal Shirt', currentStock: 1, minStock: 10, department: 'Men\'s Clothing' },
      { id: 4, name: 'Denim Jeans', currentStock: 4, minStock: 15, department: 'Men\'s Clothing' },
      { id: 5, name: 'Leather Belt', currentStock: 0, minStock: 20, department: 'Accessories' }
    ],
    topProducts: [
      { id: 1, name: 'Classic White Shirt', category: 'Men\'s Clothing', stock: 45, price: 25, value: 1125 },
      { id: 2, name: 'Blue Oxford Shirt', category: 'Men\'s Clothing', stock: 32, price: 30, value: 960 },
      { id: 3, name: 'Black Formal Shirt', category: 'Men\'s Clothing', stock: 28, price: 35, value: 980 },
      { id: 4, name: 'Denim Jeans', category: 'Men\'s Clothing', stock: 25, price: 45, value: 1125 },
      { id: 5, name: 'Leather Belt', category: 'Accessories', stock: 0, price: 20, value: 0 }
    ]
  },
  stockPurchases: {
    purchaseOrders: [
      {
        id: 'PO-001',
        supplier: 'Fashion Wholesale Co.',
        orderDate: '2025-01-30',
        expectedDelivery: '2025-02-05',
        status: 'Pending',
        totalAmount: 2500,
        items: [
          { product: 'Classic White Shirt', quantity: 50, unitPrice: 25, total: 1250 },
          { product: 'Blue Oxford Shirt', quantity: 30, unitPrice: 30, total: 900 },
          { product: 'Black Formal Shirt', quantity: 20, unitPrice: 35, total: 700 }
        ]
      },
      {
        id: 'PO-002',
        supplier: 'Textile Traders Ltd.',
        orderDate: '2025-01-28',
        expectedDelivery: '2025-02-02',
        status: 'In Transit',
        totalAmount: 1800,
        items: [
          { product: 'Denim Jeans', quantity: 40, unitPrice: 45, total: 1800 }
        ]
      },
      {
        id: 'PO-003',
        supplier: 'Accessories Plus',
        orderDate: '2025-01-25',
        expectedDelivery: '2025-01-30',
        status: 'Delivered',
        totalAmount: 1200,
        items: [
          { product: 'Leather Belt', quantity: 60, unitPrice: 20, total: 1200 }
        ]
      },
      {
        id: 'PO-004',
        supplier: 'Premium Fabrics Inc.',
        orderDate: '2025-01-22',
        expectedDelivery: '2025-01-28',
        status: 'Delivered',
        totalAmount: 2100,
        items: [
          { product: 'Silk Blouse', quantity: 30, unitPrice: 40, total: 1200 },
          { product: 'Cotton Dress', quantity: 25, unitPrice: 36, total: 900 }
        ]
      }
    ],
    suppliers: [
      { id: 1, name: 'Fashion Wholesale Co.', contact: 'John Smith', email: 'john@fashionwholesale.com', phone: '+1-555-0123', rating: 4.5, totalOrders: 25, totalSpent: 45000 },
      { id: 2, name: 'Textile Traders Ltd.', contact: 'Sarah Johnson', email: 'sarah@textiletraders.com', phone: '+1-555-0124', rating: 4.2, totalOrders: 18, totalSpent: 32000 },
      { id: 3, name: 'Accessories Plus', contact: 'Mike Chen', email: 'mike@accessoriesplus.com', phone: '+1-555-0125', rating: 4.8, totalOrders: 32, totalSpent: 28000 },
      { id: 4, name: 'Premium Fabrics Inc.', contact: 'Emily Davis', email: 'emily@premiumfabrics.com', phone: '+1-555-0126', rating: 4.6, totalOrders: 15, totalSpent: 22000 },
      { id: 5, name: 'Global Textiles', contact: 'David Wilson', email: 'david@globaltextiles.com', phone: '+1-555-0127', rating: 4.3, totalOrders: 22, totalSpent: 35000 }
    ],
    purchaseHistory: [
      { id: 'PUR-001', supplier: 'Fashion Wholesale Co.', purchaseDate: '2025-01-30', items: 3, totalAmount: 2500, status: 'Completed' },
      { id: 'PUR-002', supplier: 'Textile Traders Ltd.', purchaseDate: '2025-01-28', items: 1, totalAmount: 1800, status: 'Completed' },
      { id: 'PUR-003', supplier: 'Accessories Plus', purchaseDate: '2025-01-25', items: 1, totalAmount: 1200, status: 'Completed' },
      { id: 'PUR-004', supplier: 'Premium Fabrics Inc.', purchaseDate: '2025-01-22', items: 2, totalAmount: 2100, status: 'Completed' }
    ]
  },
  stockTransfers: {
    transfers: [
      {
        id: 'TR-001',
        fromLocation: 'Main Store',
        toLocation: 'Downtown Branch',
        transferDate: '2025-01-30',
        status: 'In Transit',
        items: [
          { product: 'Classic White Shirt', quantity: 20, currentStock: 45 },
          { product: 'Blue Oxford Shirt', quantity: 15, currentStock: 32 }
        ],
        totalValue: 1050
      },
      {
        id: 'TR-002',
        fromLocation: 'Warehouse',
        toLocation: 'Main Store',
        transferDate: '2025-01-28',
        status: 'Completed',
        items: [
          { product: 'Denim Jeans', quantity: 30, currentStock: 28 }
        ],
        totalValue: 1350
      },
      {
        id: 'TR-003',
        fromLocation: 'Main Store',
        toLocation: 'Online Store',
        transferDate: '2025-01-25',
        status: 'Completed',
        items: [
          { product: 'Leather Belt', quantity: 25, currentStock: 0 },
          { product: 'Silk Scarf', quantity: 10, currentStock: 15 }
        ],
        totalValue: 750
      }
    ],
    locations: [
      'Main Store',
      'Downtown Branch', 
      'Warehouse',
      'Online Store',
      'Outlet Mall',
      'Airport Location'
    ]
  },
  stockReturns: {
    returns: [
      {
        id: 'RT-001',
        supplier: 'Fashion Wholesale Co.',
        returnDate: '2025-01-30',
        status: 'Pending',
        reason: 'Damaged goods',
        items: [
          { product: 'Classic White Shirt', quantity: 5, reason: 'Stains' },
          { product: 'Blue Oxford Shirt', quantity: 3, reason: 'Torn fabric' }
        ],
        totalValue: 200
      },
      {
        id: 'RT-002',
        supplier: 'Textile Traders Ltd.',
        returnDate: '2025-01-28',
        status: 'Approved',
        reason: 'Wrong size received',
        items: [
          { product: 'Denim Jeans', quantity: 10, reason: 'Size mismatch' }
        ],
        totalValue: 450
      },
      {
        id: 'RT-003',
        supplier: 'Accessories Plus',
        returnDate: '2025-01-25',
        status: 'Completed',
        reason: 'Quality issues',
        items: [
          { product: 'Leather Belt', quantity: 8, reason: 'Poor stitching' }
        ],
        totalValue: 160
      }
    ],
    suppliers: [
      'Fashion Wholesale Co.',
      'Textile Traders Ltd.',
      'Accessories Plus',
      'Premium Fabrics Inc.',
      'Global Textiles'
    ]
  },
  stockTake: {
    sessions: [
      {
        id: 'ST-001',
        location: 'Main Store',
        startDate: '2025-01-30',
        status: 'In Progress',
        assignedTo: 'John Smith',
        totalItems: 150,
        countedItems: 120,
        variance: 5
      },
      {
        id: 'ST-002',
        location: 'Downtown Branch',
        startDate: '2025-01-28',
        status: 'Completed',
        assignedTo: 'Sarah Johnson',
        totalItems: 200,
        countedItems: 200,
        variance: 0
      },
      {
        id: 'ST-003',
        location: 'Warehouse',
        startDate: '2025-01-25',
        status: 'Completed',
        assignedTo: 'Mike Chen',
        totalItems: 300,
        countedItems: 298,
        variance: 2
      }
    ],
    locations: [
      'Main Store',
      'Downtown Branch',
      'Warehouse',
      'Online Store',
      'Outlet Mall',
      'Airport Location'
    ],
    varianceReports: {
      totalVariance: 15,
      valueImpact: 2450,
      accuracyRate: 98.5
    }
  },
  departments: {
    departments: [
      {
        id: 1,
        name: 'Men\'s Clothing',
        code: 'MEN',
        manager: 'John Smith',
        totalProducts: 45,
        totalValue: 12500,
        status: 'Active'
      },
      {
        id: 2,
        name: 'Women\'s Clothing',
        code: 'WOMEN',
        manager: 'Sarah Johnson',
        totalProducts: 52,
        totalValue: 15800,
        status: 'Active'
      },
      {
        id: 3,
        name: 'Accessories',
        code: 'ACC',
        manager: 'Mike Chen',
        totalProducts: 28,
        totalValue: 4200,
        status: 'Active'
      },
      {
        id: 4,
        name: 'Footwear',
        code: 'SHOES',
        manager: 'Emily Davis',
        totalProducts: 35,
        totalValue: 8900,
        status: 'Active'
      },
      {
        id: 5,
        name: 'Electronics',
        code: 'ELEC',
        manager: 'David Wilson',
        totalProducts: 40,
        totalValue: 25000,
        status: 'Active'
      },
      {
        id: 6,
        name: 'Home & Garden',
        code: 'HOME',
        manager: 'Lisa Brown',
        totalProducts: 30,
        totalValue: 6800,
        status: 'Active'
      }
    ],
    categories: [
      { name: 'Shirts', department: 'Men\'s Clothing', products: 15, value: 4200 },
      { name: 'Pants', department: 'Men\'s Clothing', products: 12, value: 3800 },
      { name: 'Dresses', department: 'Women\'s Clothing', products: 18, value: 6500 },
      { name: 'Tops', department: 'Women\'s Clothing', products: 20, value: 4800 },
      { name: 'Belts', department: 'Accessories', products: 8, value: 1200 },
      { name: 'Scarves', department: 'Accessories', products: 10, value: 800 },
      { name: 'Sneakers', department: 'Footwear', products: 15, value: 4500 },
      { name: 'Formal Shoes', department: 'Footwear', products: 12, value: 3600 }
    ]
  },
  vendors: {
    vendors: [
      {
        id: 1,
        name: 'Fashion Wholesale Co.',
        contact: 'John Smith',
        email: 'john@fashionwholesale.com',
        phone: '+1-555-0123',
        address: '123 Fashion St, New York, NY 10001',
        rating: 4.5,
        totalOrders: 25,
        totalSpent: 45000,
        status: 'Active'
      },
      {
        id: 2,
        name: 'Textile Traders Ltd.',
        contact: 'Sarah Johnson',
        email: 'sarah@textiletraders.com',
        phone: '+1-555-0124',
        address: '456 Textile Ave, Los Angeles, CA 90210',
        rating: 4.2,
        totalOrders: 18,
        totalSpent: 32000,
        status: 'Active'
      },
      {
        id: 3,
        name: 'Accessories Plus',
        contact: 'Mike Chen',
        email: 'mike@accessoriesplus.com',
        phone: '+1-555-0125',
        address: '789 Accessory Blvd, Chicago, IL 60601',
        rating: 4.8,
        totalOrders: 32,
        totalSpent: 28000,
        status: 'Active'
      },
      {
        id: 4,
        name: 'Premium Fabrics Inc.',
        contact: 'Emily Davis',
        email: 'emily@premiumfabrics.com',
        phone: '+1-555-0126',
        address: '321 Fabric Way, Miami, FL 33101',
        rating: 4.6,
        totalOrders: 15,
        totalSpent: 22000,
        status: 'Active'
      },
      {
        id: 5,
        name: 'Global Textiles',
        contact: 'David Wilson',
        email: 'david@globaltextiles.com',
        phone: '+1-555-0127',
        address: '654 Global St, Houston, TX 77001',
        rating: 4.3,
        totalOrders: 22,
        totalSpent: 35000,
        status: 'Active'
      }
    ],
    performance: {
      topVendor: 'Fashion Wholesale Co.',
      bestRating: 'Accessories Plus',
      mostOrders: 'Accessories Plus',
      totalVendors: 5,
      averageRating: 4.48
    }
  }
};

export default dummyData;

// Additional comprehensive dummy data for site-wide testing
export const salesAnalytics = {
  dailySales: [
    { date: '2025-01-01', sales: 12500, orders: 45, customers: 38 },
    { date: '2025-01-02', sales: 13800, orders: 52, customers: 44 },
    { date: '2025-01-03', sales: 11200, orders: 41, customers: 35 },
    { date: '2025-01-04', sales: 15600, orders: 58, customers: 49 },
    { date: '2025-01-05', sales: 18900, orders: 67, customers: 55 },
    { date: '2025-01-06', sales: 22100, orders: 78, customers: 62 },
    { date: '2025-01-07', sales: 19800, orders: 71, customers: 58 }
  ],
  topSellingProducts: [
    { id: 1, name: 'Samsung 55" 4K Smart TV', sales: 15, revenue: 10499.85 },
    { id: 2, name: 'iPhone 15 Pro', sales: 12, revenue: 11999.88 },
    { id: 3, name: 'MacBook Air M2', sales: 8, revenue: 9599.92 },
    { id: 4, name: 'Sony WH-1000XM5 Headphones', sales: 20, revenue: 6999.80 },
    { id: 5, name: 'KitchenAid Stand Mixer', sales: 6, revenue: 2399.94 }
  ],
  customerSegments: [
    { segment: 'Premium', customers: 45, avgSpend: 850, totalRevenue: 38250 },
    { segment: 'Regular', customers: 120, avgSpend: 320, totalRevenue: 38400 },
    { segment: 'New', customers: 35, avgSpend: 180, totalRevenue: 6300 }
  ]
};

export const notifications = [
  {
    id: 1,
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: 'iPhone 15 Pro is running low on stock (3 units remaining)',
    timestamp: '2025-01-30T10:30:00Z',
    read: false,
    priority: 'high'
  },
  {
    id: 2,
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD-2025-001 has been placed for $1,049.98',
    timestamp: '2025-01-30T09:15:00Z',
    read: false,
    priority: 'medium'
  },
  {
    id: 3,
    type: 'inventory',
    title: 'Stock Transfer Completed',
    message: 'Transfer TR-001 from Main Store to Downtown Branch completed',
    timestamp: '2025-01-30T08:45:00Z',
    read: true,
    priority: 'low'
  },
  {
    id: 4,
    type: 'employee',
    title: 'Employee Clock In',
    message: 'Sarah Chen has clocked in at Downtown Branch',
    timestamp: '2025-01-30T08:00:00Z',
    read: true,
    priority: 'low'
  },
  {
    id: 5,
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance completed successfully',
    timestamp: '2025-01-30T02:00:00Z',
    read: true,
    priority: 'medium'
  }
];

export const reports = {
  salesReport: {
    period: 'January 2025',
    totalSales: 125000,
    totalOrders: 450,
    avgOrderValue: 277.78,
    topCategory: 'Electronics',
    growthRate: 12.5
  },
  inventoryReport: {
    totalProducts: 1247,
    lowStockItems: 12,
    outOfStockItems: 3,
    totalValue: 45230,
    turnoverRate: 4.2
  },
  customerReport: {
    totalCustomers: 200,
    newCustomers: 35,
    repeatCustomers: 165,
    avgCustomerValue: 625,
    topCustomer: 'John Smith'
  },
  employeeReport: {
    totalEmployees: 4,
    activeEmployees: 4,
    totalHours: 640,
    avgHoursPerEmployee: 160,
    topPerformer: 'Nick Johnson'
  }
};

export const systemSettings = {
  general: {
    storeName: 'Deal n Done, Inc.',
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'English',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour'
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    lowStockAlerts: true,
    orderNotifications: true,
    systemAlerts: true
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    loginAttempts: 5,
    ipWhitelist: []
  },
  integrations: {
    accounting: 'QuickBooks',
    paymentGateway: 'Stripe',
    shipping: 'FedEx',
    email: 'Mailchimp',
    analytics: 'Google Analytics'
  }
};

export const auditLog = [
  {
    id: 1,
    action: 'product_updated',
    user: 'Nick Johnson',
    timestamp: '2025-01-30T10:30:00Z',
    details: 'Updated stock quantity for Samsung TV from 15 to 12',
    ipAddress: '192.168.1.100'
  },
  {
    id: 2,
    action: 'order_created',
    user: 'Lisa Chen',
    timestamp: '2025-01-30T09:15:00Z',
    details: 'Created new order ORD-2025-001 for $1,049.98',
    ipAddress: '192.168.1.101'
  },
  {
    id: 3,
    action: 'user_login',
    user: 'Sarah Chen',
    timestamp: '2025-01-30T08:00:00Z',
    details: 'User logged in from Downtown Branch',
    ipAddress: '192.168.1.102'
  },
  {
    id: 4,
    action: 'inventory_transfer',
    user: 'Mike Chen',
    timestamp: '2025-01-30T07:45:00Z',
    details: 'Initiated transfer TR-001 from Main Store to Downtown Branch',
    ipAddress: '192.168.1.103'
  },
  {
    id: 5,
    action: 'settings_updated',
    user: 'Nick Johnson',
    timestamp: '2025-01-30T06:30:00Z',
    details: 'Updated business hours for Main Store',
    ipAddress: '192.168.1.100'
  }
];

export const helpArticles = [
  {
    id: 1,
    title: 'How to Process a Sale',
    category: 'POS',
    content: 'Step-by-step guide to processing sales transactions...',
    tags: ['pos', 'sales', 'transactions'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 2,
    title: 'Managing Inventory',
    category: 'Inventory',
    content: 'Learn how to manage your inventory effectively...',
    tags: ['inventory', 'stock', 'management'],
    lastUpdated: '2025-01-10'
  },
  {
    id: 3,
    title: 'Setting Up Payment Methods',
    category: 'Settings',
    content: 'Configure payment methods for your store...',
    tags: ['payments', 'settings', 'configuration'],
    lastUpdated: '2025-01-08'
  },
  {
    id: 4,
    title: 'Generating Reports',
    category: 'Reports',
    content: 'How to generate and interpret various reports...',
    tags: ['reports', 'analytics', 'data'],
    lastUpdated: '2025-01-05'
  }
];

export const apiEndpoints = {
  products: '/api/products',
  orders: '/api/orders',
  customers: '/api/customers',
  inventory: '/api/inventory',
  employees: '/api/employees',
  sales: '/api/sales',
  reports: '/api/reports',
  settings: '/api/settings'
};

export const testData = {
  // Test data for development and testing
  sampleProducts: [
    {
      id: 'TEST-001',
      name: 'Test Product 1',
      price: 99.99,
      category: 'Test Category',
      stock: 10,
      barcode: '1234567890001',
      description: 'This is a test product for development purposes'
    },
    {
      id: 'TEST-002',
      name: 'Test Product 2',
      price: 149.99,
      category: 'Test Category',
      stock: 5,
      barcode: '1234567890002',
      description: 'Another test product for development purposes'
    }
  ],
  sampleOrders: [
    {
      id: 'TEST-ORD-001',
      customer: 'Test Customer',
      items: [
        { productId: 'TEST-001', name: 'Test Product 1', quantity: 2, price: 99.99 }
      ],
      total: 199.98,
      status: 'completed',
      date: '2025-01-30',
      paymentMethod: 'Test Payment'
    }
  ],
  sampleCustomers: [
    {
      id: 'TEST-CUST-001',
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '+1-555-TEST',
      totalSpent: 199.98,
      orders: 1,
      lastVisit: '2025-01-30',
      segment: 'Test'
    }
  ]
}; 