/**
 * Monitoring and Analytics Utilities
 * Handles error tracking, performance monitoring, and analytics
 */

// Initialize monitoring based on environment
const isProduction = process.env.NODE_ENV === 'production';
const enableAnalytics = process.env.REACT_APP_ENABLE_ANALYTICS === 'true';
const enableErrorTracking = process.env.REACT_APP_ENABLE_ERROR_TRACKING === 'true';
const enablePerformanceMonitoring = process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === 'true';

/**
 * Analytics Service
 */
class AnalyticsService {
  constructor() {
    this.initialized = false;
    this.analyticsId = process.env.REACT_APP_ANALYTICS_ID;
  }

  /**
   * Initialize analytics
   */
  init() {
    if (!isProduction || !enableAnalytics || !this.analyticsId) {
      console.log('Analytics disabled or not configured');
      return;
    }

    try {
      // Initialize Google Analytics
      if (window.gtag) {
        window.gtag('config', this.analyticsId, {
          page_title: document.title,
          page_location: window.location.href
        });
        this.initialized = true;
        console.log('Analytics initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  /**
   * Track page view
   */
  trackPageView(pageTitle, pagePath) {
    if (!this.initialized) return;

    try {
      window.gtag('config', this.analyticsId, {
        page_title: pageTitle,
        page_location: pagePath
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  /**
   * Track custom event
   */
  trackEvent(eventName, parameters = {}) {
    if (!this.initialized) return;

    try {
      window.gtag('event', eventName, parameters);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  /**
   * Track user action
   */
  trackUserAction(action, category, label = null, value = null) {
    this.trackEvent('user_action', {
      action,
      category,
      label,
      value
    });
  }

  /**
   * Track error
   */
  trackError(error, context = {}) {
    this.trackEvent('error', {
      error_message: error.message,
      error_stack: error.stack,
      ...context
    });
  }
}

/**
 * Error Tracking Service
 */
class ErrorTrackingService {
  constructor() {
    this.initialized = false;
    this.sentryDsn = process.env.REACT_APP_SENTRY_DSN;
  }

  /**
   * Initialize error tracking
   */
  async init() {
    if (!isProduction || !enableErrorTracking || !this.sentryDsn) {
      console.log('Error tracking disabled or not configured');
      return;
    }

    try {
      // Dynamic import to avoid bundling in development
      const Sentry = await import('@sentry/react');
      
      Sentry.init({
        dsn: this.sentryDsn,
        environment: process.env.REACT_APP_ENVIRONMENT || 'development',
        tracesSampleRate: 0.1,
        integrations: [
          new Sentry.BrowserTracing({
            tracePropagationTargets: ['localhost', 'your-domain.com']
          })
        ]
      });

      this.initialized = true;
      console.log('Error tracking initialized successfully');
    } catch (error) {
      console.error('Failed to initialize error tracking:', error);
    }
  }

  /**
   * Capture error
   */
  captureError(error, context = {}) {
    if (!this.initialized) {
      console.error('Error tracking not initialized:', error);
      return;
    }

    try {
      const Sentry = require('@sentry/react');
      Sentry.captureException(error, {
        extra: context
      });
    } catch (err) {
      console.error('Failed to capture error:', err);
    }
  }

  /**
   * Set user context
   */
  setUser(user) {
    if (!this.initialized) return;

    try {
      const Sentry = require('@sentry/react');
      Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.name
      });
    } catch (error) {
      console.error('Failed to set user context:', error);
    }
  }

  /**
   * Set tag
   */
  setTag(key, value) {
    if (!this.initialized) return;

    try {
      const Sentry = require('@sentry/react');
      Sentry.setTag(key, value);
    } catch (error) {
      console.error('Failed to set tag:', error);
    }
  }
}

/**
 * Performance Monitoring Service
 */
class PerformanceMonitoringService {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize performance monitoring
   */
  async init() {
    if (!isProduction || !enablePerformanceMonitoring) {
      console.log('Performance monitoring disabled');
      return;
    }

    try {
      // Dynamic import to avoid bundling in development
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
      
      // Core Web Vitals
      getCLS(this.handleMetric);
      getFID(this.handleMetric);
      getFCP(this.handleMetric);
      getLCP(this.handleMetric);
      getTTFB(this.handleMetric);

      this.initialized = true;
      console.log('Performance monitoring initialized successfully');
    } catch (error) {
      console.error('Failed to initialize performance monitoring:', error);
    }
  }

  /**
   * Handle performance metric
   */
  handleMetric = (metric) => {
    if (!this.initialized) return;

    // Send to analytics
    if (window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.value),
        non_interaction: true
      });
    }

    // Log for debugging
    console.log('Performance metric:', metric);
  }

  /**
   * Measure custom performance
   */
  measurePerformance(name, startTime) {
    if (!this.initialized) return;

    const duration = performance.now() - startTime;
    
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', 'performance', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(duration)
      });
    }

    return duration;
  }
}

/**
 * Monitoring Manager
 * Centralized monitoring service
 */
class MonitoringManager {
  constructor() {
    this.analytics = new AnalyticsService();
    this.errorTracking = new ErrorTrackingService();
    this.performance = new PerformanceMonitoringService();
    this.initialized = false;
  }

  /**
   * Initialize all monitoring services
   */
  async init() {
    try {
      // Initialize analytics
      this.analytics.init();

      // Initialize error tracking
      await this.errorTracking.init();

      // Initialize performance monitoring
      await this.performance.init();

      this.initialized = true;
      console.log('Monitoring services initialized successfully');
    } catch (error) {
      console.error('Failed to initialize monitoring services:', error);
    }
  }

  /**
   * Track page view
   */
  trackPageView(pageTitle, pagePath) {
    this.analytics.trackPageView(pageTitle, pagePath);
  }

  /**
   * Track user action
   */
  trackUserAction(action, category, label = null, value = null) {
    this.analytics.trackUserAction(action, category, label, value);
  }

  /**
   * Track error
   */
  trackError(error, context = {}) {
    this.analytics.trackError(error, context);
    this.errorTracking.captureError(error, context);
  }

  /**
   * Set user context
   */
  setUser(user) {
    this.errorTracking.setUser(user);
  }

  /**
   * Set tag
   */
  setTag(key, value) {
    this.errorTracking.setTag(key, value);
  }

  /**
   * Measure performance
   */
  measurePerformance(name, startTime) {
    return this.performance.measurePerformance(name, startTime);
  }

  /**
   * Start performance measurement
   */
  startPerformanceMeasurement(name) {
    return {
      name,
      startTime: performance.now(),
      end: () => this.measurePerformance(name, performance.now())
    };
  }
}

// Create singleton instance
const monitoringManager = new MonitoringManager();

// Initialize monitoring when the module is loaded
if (typeof window !== 'undefined') {
  monitoringManager.init();
}

export default monitoringManager;

// Export individual services for direct access
export { AnalyticsService, ErrorTrackingService, PerformanceMonitoringService }; 