class UsageTracker {
  constructor() {
    this.usageData = this.loadUsageData();
    this.milestones = {
      products: [3, 10, 50, 100, 500, 1000],
      sales: [1, 5, 10, 25, 50, 100],
      features: ['pos', 'inventory', 'customers', 'reports', 'analytics'],
      daysActive: [1, 3, 7, 14, 30]
    };
    this.planTriggers = {
      basic: {
        products: 3,
        sales: 1,
        daysActive: 1
      },
      professional: {
        products: 50,
        sales: 10,
        daysActive: 7
      },
      enterprise: {
        products: 200,
        sales: 50,
        daysActive: 14
      }
    };
  }

  // Load usage data from localStorage
  loadUsageData() {
    try {
      const stored = localStorage.getItem('dealndone_usage');
      return stored ? JSON.parse(stored) : {
        products: 0,
        sales: 0,
        features: [],
        daysActive: 0,
        firstLogin: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        milestones: [],
        planTriggers: []
      };
    } catch (error) {
      console.error('Error loading usage data:', error);
      return {
        products: 0,
        sales: 0,
        features: [],
        daysActive: 0,
        firstLogin: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        milestones: [],
        planTriggers: []
      };
    }
  }

  // Save usage data to localStorage
  saveUsageData() {
    try {
      localStorage.setItem('dealndone_usage', JSON.stringify(this.usageData));
    } catch (error) {
      console.error('Error saving usage data:', error);
    }
  }

  // Update usage data
  updateUsage(type, value = 1) {
    const oldValue = this.usageData[type] || 0;
    this.usageData[type] = oldValue + value;
    this.usageData.lastActivity = new Date().toISOString();
    
    // Check for milestones
    this.checkMilestones(type, this.usageData[type]);
    
    // Check for plan triggers
    this.checkPlanTriggers();
    
    this.saveUsageData();
    return this.usageData[type];
  }

  // Track feature usage
  trackFeature(feature) {
    if (!this.usageData.features.includes(feature)) {
      this.usageData.features.push(feature);
      this.usageData.lastActivity = new Date().toISOString();
      this.saveUsageData();
    }
  }

  // Check for milestones
  checkMilestones(type, value) {
    const milestones = this.milestones[type] || [];
    const newMilestones = milestones.filter(milestone => 
      value >= milestone && !this.usageData.milestones.includes(`${type}_${milestone}`)
    );

    newMilestones.forEach(milestone => {
      this.usageData.milestones.push(`${type}_${milestone}`);
      this.triggerMilestoneNotification(type, milestone);
    });
  }

  // Check for plan triggers
  checkPlanTriggers() {
    const currentPlan = this.getCurrentPlan();
    const nextPlan = this.getNextPlan(currentPlan);
    
    if (!nextPlan) return;

    const triggers = this.planTriggers[nextPlan];
    const shouldTrigger = Object.entries(triggers).every(([key, threshold]) => {
      return this.usageData[key] >= threshold;
    });

    if (shouldTrigger && !this.usageData.planTriggers.includes(nextPlan)) {
      this.usageData.planTriggers.push(nextPlan);
      this.triggerPlanSelection(nextPlan);
    }
  }

  // Get current plan based on usage
  getCurrentPlan() {
    if (this.usageData.products >= 200 || this.usageData.sales >= 50) {
      return 'enterprise';
    } else if (this.usageData.products >= 50 || this.usageData.sales >= 10) {
      return 'professional';
    } else if (this.usageData.products >= 3 || this.usageData.sales >= 1) {
      return 'basic';
    } else {
      return 'free';
    }
  }

  // Get next recommended plan
  getNextPlan(currentPlan) {
    const planOrder = ['free', 'basic', 'professional', 'enterprise'];
    const currentIndex = planOrder.indexOf(currentPlan);
    return currentIndex < planOrder.length - 1 ? planOrder[currentIndex + 1] : null;
  }

  // Calculate days active
  calculateDaysActive() {
    const firstLogin = new Date(this.usageData.firstLogin);
    const now = new Date();
    const diffTime = Math.abs(now - firstLogin);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.usageData.daysActive = diffDays;
    return diffDays;
  }

  // Get usage statistics
  getUsageStats() {
    return {
      products: this.usageData.products,
      sales: this.usageData.sales,
      features: this.usageData.features.length,
      daysActive: this.calculateDaysActive(),
      milestones: this.usageData.milestones.length,
      currentPlan: this.getCurrentPlan(),
      nextPlan: this.getNextPlan(this.getCurrentPlan())
    };
  }

  // Get plan recommendations
  getPlanRecommendations() {
    const stats = this.getUsageStats();
    const recommendations = [];

    // Check if user should upgrade
    if (stats.products >= 50 && stats.sales >= 10) {
      recommendations.push({
        plan: 'professional',
        reason: 'High product count and sales volume',
        features: ['Multi-user Access', 'Advanced Analytics', 'API Access'],
        price: 79
      });
    }

    if (stats.products >= 200 && stats.sales >= 50) {
      recommendations.push({
        plan: 'enterprise',
        reason: 'Large-scale operations detected',
        features: ['Unlimited Everything', 'AI Forecasting', 'White-label'],
        price: 199
      });
    }

    // Check feature usage
    if (stats.features >= 4) {
      recommendations.push({
        plan: 'professional',
        reason: 'Using advanced features',
        features: ['Advanced Features', 'Priority Support'],
        price: 79
      });
    }

    return recommendations;
  }

  // Trigger milestone notification
  triggerMilestoneNotification(type, milestone) {
    const event = new CustomEvent('usageMilestone', {
      detail: {
        type,
        milestone,
        currentValue: this.usageData[type],
        message: `Congratulations! You've reached ${milestone} ${type}.`
      }
    });
    window.dispatchEvent(event);
  }

  // Trigger plan selection
  triggerPlanSelection(plan) {
    const event = new CustomEvent('planSelectionTrigger', {
      detail: {
        plan,
        currentUsage: this.getUsageStats(),
        recommendations: this.getPlanRecommendations()
      }
    });
    window.dispatchEvent(event);
  }

  // Reset usage data (for testing)
  resetUsage() {
    this.usageData = {
      products: 0,
      sales: 0,
      features: [],
      daysActive: 0,
      firstLogin: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      milestones: [],
      planTriggers: []
    };
    this.saveUsageData();
  }

  // Export usage data
  exportUsageData() {
    return {
      ...this.usageData,
      stats: this.getUsageStats(),
      recommendations: this.getPlanRecommendations()
    };
  }
}

// Create global instance
const usageTracker = new UsageTracker();

// Export the instance and class
export default usageTracker;
export { UsageTracker }; 