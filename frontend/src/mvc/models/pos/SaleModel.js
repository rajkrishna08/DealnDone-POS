import BaseModel from '../base/BaseModel';

/**
 * Sale Model - Manages sales transactions and cart data
 * Handles shopping cart, transactions, and sales processing
 */
class SaleModel extends BaseModel {
  constructor() {
    super();
    
    // Initialize sale state
    this._state = {
      cart: [],
      currentSale: null,
      salesHistory: [],
      transactions: [],
      paymentMethods: [
        { id: 'cash', name: 'Cash', icon: '💵' },
        { id: 'card', name: 'Card', icon: '💳' },
        { id: 'mobile', name: 'Mobile Payment', icon: '📱' },
        { id: 'transfer', name: 'Bank Transfer', icon: '🏦' }
      ],
      discounts: [],
      taxes: [],
      customer: null,
      saleStatus: 'pending', // pending, completed, cancelled, refunded
      paymentStatus: 'pending', // pending, paid, failed, refunded
      receiptData: null,
      salesStats: {
        totalSales: 0,
        totalItems: 0,
        averageOrderValue: 0,
        topProducts: []
      }
    };
  }

  // Getters
  get cart() {
    return this._state.cart;
  }

  get currentSale() {
    return this._state.currentSale;
  }

  get salesHistory() {
    return this._state.salesHistory;
  }

  get transactions() {
    return this._state.transactions;
  }

  get paymentMethods() {
    return this._state.paymentMethods;
  }

  get discounts() {
    return this._state.discounts;
  }

  get taxes() {
    return this._state.taxes;
  }

  get customer() {
    return this._state.customer;
  }

  get saleStatus() {
    return this._state.saleStatus;
  }

  get paymentStatus() {
    return this._state.paymentStatus;
  }

  get receiptData() {
    return this._state.receiptData;
  }

  get salesStats() {
    return this._state.salesStats;
  }

  get cartItemCount() {
    return this._state.cart.reduce((total, item) => total + item.quantity, 0);
  }

  get cartSubtotal() {
    return this._state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  get cartTax() {
    return this._state.cart.reduce((total, item) => {
      const taxRate = item.taxRate || 0;
      return total + (item.price * item.quantity * taxRate / 100);
    }, 0);
  }

  get cartDiscount() {
    return this._state.cart.reduce((total, item) => {
      const discount = item.discount || 0;
      return total + (item.price * item.quantity * discount / 100);
    }, 0);
  }

  get cartTotal() {
    return this.cartSubtotal + this.cartTax - this.cartDiscount;
  }

  get hasItemsInCart() {
    return this._state.cart.length > 0;
  }

  get isCartEmpty() {
    return this._state.cart.length === 0;
  }

  // Setters
  setCart(cart) {
    this.setState({
      ...this._state,
      cart: cart
    });
  }

  setCurrentSale(sale) {
    this.setState({
      ...this._state,
      currentSale: sale
    });
  }

  setSalesHistory(history) {
    this.setState({
      ...this._state,
      salesHistory: history
    });
  }

  setTransactions(transactions) {
    this.setState({
      ...this._state,
      transactions: transactions
    });
  }

  setPaymentMethods(methods) {
    this.setState({
      ...this._state,
      paymentMethods: methods
    });
  }

  setDiscounts(discounts) {
    this.setState({
      ...this._state,
      discounts: discounts
    });
  }

  setTaxes(taxes) {
    this.setState({
      ...this._state,
      taxes: taxes
    });
  }

  setCustomer(customer) {
    this.setState({
      ...this._state,
      customer: customer
    });
  }

  setSaleStatus(status) {
    this.setState({
      ...this._state,
      saleStatus: status
    });
  }

  setPaymentStatus(status) {
    this.setState({
      ...this._state,
      paymentStatus: status
    });
  }

  setReceiptData(data) {
    this.setState({
      ...this._state,
      receiptData: data
    });
  }

  setSalesStats(stats) {
    this.setState({
      ...this._state,
      salesStats: stats
    });
  }

  // Cart management methods
  addToCart(product, quantity = 1) {
    const existingItem = this._state.cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Update existing item quantity
      this.updateCartItemQuantity(existingItem.id, existingItem.quantity + quantity);
    } else {
      // Add new item to cart
      const cartItem = {
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        costPrice: product.costPrice,
        quantity: quantity,
        taxRate: product.taxRate || 0,
        discount: 0,
        subtotal: product.price * quantity,
        stockQuantity: product.stockQuantity
      };
      
      this.setState({
        ...this._state,
        cart: [...this._state.cart, cartItem]
      });
    }
  }

  removeFromCart(itemId) {
    this.setState({
      ...this._state,
      cart: this._state.cart.filter(item => item.id !== itemId)
    });
  }

  updateCartItemQuantity(itemId, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    this.setState({
      ...this._state,
      cart: this._state.cart.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              quantity: quantity,
              subtotal: item.price * quantity
            }
          : item
      )
    });
  }

  updateCartItemPrice(itemId, price) {
    this.setState({
      ...this._state,
      cart: this._state.cart.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              price: price,
              subtotal: price * item.quantity
            }
          : item
      )
    });
  }

  updateCartItemDiscount(itemId, discount) {
    this.setState({
      ...this._state,
      cart: this._state.cart.map(item => 
        item.id === itemId 
          ? { ...item, discount: discount }
          : item
      )
    });
  }

  clearCart() {
    this.setState({
      ...this._state,
      cart: []
    });
  }

  // Sale management methods
  createSale(saleData) {
    const sale = {
      id: Date.now().toString(),
      ...saleData,
      items: [...this._state.cart],
      subtotal: this.cartSubtotal,
      tax: this.cartTax,
      discount: this.cartDiscount,
      total: this.cartTotal,
      createdAt: new Date().toISOString(),
      status: 'pending',
      paymentStatus: 'pending'
    };

    this.setCurrentSale(sale);
    return sale;
  }

  completeSale(paymentData) {
    if (!this._state.currentSale) return null;

    const completedSale = {
      ...this._state.currentSale,
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: paymentData.method,
      paymentReference: paymentData.reference,
      completedAt: new Date().toISOString()
    };

    // Add to sales history
    this.setState({
      ...this._state,
      salesHistory: [...this._state.salesHistory, completedSale],
      currentSale: null,
      cart: []
    });

    return completedSale;
  }

  cancelSale() {
    if (!this._state.currentSale) return;

    const cancelledSale = {
      ...this._state.currentSale,
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    };

    this.setState({
      ...this._state,
      salesHistory: [...this._state.salesHistory, cancelledSale],
      currentSale: null,
      cart: []
    });
  }

  refundSale(saleId, refundData) {
    const sale = this._state.salesHistory.find(s => s.id === saleId);
    if (!sale) return null;

    const refund = {
      id: Date.now().toString(),
      saleId: saleId,
      amount: refundData.amount,
      reason: refundData.reason,
      refundedAt: new Date().toISOString(),
      refundedBy: refundData.refundedBy
    };

    const updatedSale = {
      ...sale,
      status: 'refunded',
      paymentStatus: 'refunded',
      refund: refund
    };

    this.setState({
      ...this._state,
      salesHistory: this._state.salesHistory.map(s => 
        s.id === saleId ? updatedSale : s
      )
    });

    return refund;
  }

  // Transaction management
  addTransaction(transaction) {
    this.setState({
      ...this._state,
      transactions: [...this._state.transactions, transaction]
    });
  }

  getTransactionById(transactionId) {
    return this._state.transactions.find(t => t.id === transactionId);
  }

  getSalesByDateRange(startDate, endDate) {
    return this._state.salesHistory.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      return saleDate >= startDate && saleDate <= endDate;
    });
  }

  // Customer management
  setCustomerForSale(customer) {
    this.setCustomer(customer);
    
    if (this._state.currentSale) {
      this.setCurrentSale({
        ...this._state.currentSale,
        customer: customer
      });
    }
  }

  // Validation
  validate(data) {
    const errors = [];

    if (!data.items || data.items.length === 0) {
      errors.push('Sale must have at least one item');
    }

    if (data.items) {
      data.items.forEach((item, index) => {
        if (!item.productId) {
          errors.push(`Item ${index + 1}: Product is required`);
        }
        if (!item.quantity || item.quantity <= 0) {
          errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
        }
        if (!item.price || item.price < 0) {
          errors.push(`Item ${index + 1}: Price must be non-negative`);
        }
      });
    }

    if (data.paymentMethod && !this._state.paymentMethods.find(pm => pm.id === data.paymentMethod)) {
      errors.push('Invalid payment method');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Data transformation
  transformForAPI(data) {
    return {
      customer_id: data.customerId,
      items: data.items.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount || 0,
        tax_rate: item.taxRate || 0
      })),
      subtotal: data.subtotal,
      tax: data.tax,
      discount: data.discount,
      total: data.total,
      payment_method: data.paymentMethod,
      payment_reference: data.paymentReference,
      notes: data.notes,
      status: data.status,
      payment_status: data.paymentStatus
    };
  }

  transformFromAPI(data) {
    return {
      id: data.id,
      customerId: data.customer_id,
      customer: data.customer,
      items: data.items.map(item => ({
        id: item.id,
        productId: item.product_id,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        taxRate: item.tax_rate,
        subtotal: item.subtotal
      })),
      subtotal: data.subtotal,
      tax: data.tax,
      discount: data.discount,
      total: data.total,
      paymentMethod: data.payment_method,
      paymentReference: data.payment_reference,
      notes: data.notes,
      status: data.status,
      paymentStatus: data.payment_status,
      createdAt: data.created_at,
      completedAt: data.completed_at,
      cancelledAt: data.cancelled_at,
      refund: data.refund
    };
  }

  // Utility methods
  getSaleById(saleId) {
    return this._state.salesHistory.find(sale => sale.id === saleId);
  }

  getCartItemById(itemId) {
    return this._state.cart.find(item => item.id === itemId);
  }

  getCartItemByProductId(productId) {
    return this._state.cart.find(item => item.productId === productId);
  }

  calculateItemSubtotal(item) {
    return item.price * item.quantity;
  }

  calculateItemTax(item) {
    return (item.price * item.quantity * item.taxRate) / 100;
  }

  calculateItemDiscount(item) {
    return (item.price * item.quantity * item.discount) / 100;
  }

  calculateItemTotal(item) {
    const subtotal = this.calculateItemSubtotal(item);
    const tax = this.calculateItemTax(item);
    const discount = this.calculateItemDiscount(item);
    return subtotal + tax - discount;
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Clear methods
  clearCurrentSale() {
    this.setState({
      ...this._state,
      currentSale: null
    });
  }

  clearReceiptData() {
    this.setState({
      ...this._state,
      receiptData: null
    });
  }
}

export default SaleModel; 