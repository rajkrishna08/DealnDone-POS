// Settings Service - Handles all settings API calls
const API_BASE_URL = 'http://127.0.0.1:8005';

class SettingsService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth headers
  getAuthHeaders() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token || ''}`,
      'X-User-ID': user.id || '',
      'X-Org-ID': user.org_id || '',
      'X-Store-Name': user.storeName || ''
    };
  }

  // Store Settings API calls
  async getStoreSettings(orgId) {
    try {
      const response = await fetch(`${this.baseURL}/api/store/settings/${orgId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching store settings:', error);
      throw error;
    }
  }

  async updateStoreSettings(orgId, settings, section) {
    try {
      const response = await fetch(`${this.baseURL}/api/store/settings/${orgId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          settings,
          section
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating store settings:', error);
      throw error;
    }
  }

  async getStorePlan(orgId) {
    try {
      const response = await fetch(`${this.baseURL}/api/store/plan/${orgId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching store plan:', error);
      throw error;
    }
  }

  async upgradeStorePlan(orgId, newPlan) {
    try {
      const response = await fetch(`${this.baseURL}/api/store/upgrade/${orgId}?new_plan=${newPlan}`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error upgrading store plan:', error);
      throw error;
    }
  }

  // Global Settings API calls
  async getGlobalSettings() {
    try {
      const response = await fetch(`${this.baseURL}/api/settings/global`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching global settings:', error);
      throw error;
    }
  }

  async updateGlobalSetting(key, value, encrypted = false, description = null) {
    try {
      const response = await fetch(`${this.baseURL}/api/settings/global/${key}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          value,
          encrypted,
          description
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating global setting:', error);
      throw error;
    }
  }

  // Organization Settings API calls
  async getOrganizationSettings(orgId) {
    try {
      const response = await fetch(`${this.baseURL}/api/settings/organization/${orgId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching organization settings:', error);
      throw error;
    }
  }

  async updateOrganizationSetting(orgId, key, value, encrypted = false, description = null) {
    try {
      const response = await fetch(`${this.baseURL}/api/settings/organization/${orgId}/${key}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          value,
          encrypted,
          description
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating organization setting:', error);
      throw error;
    }
  }

  // User Preferences API calls
  async getUserPreferences(userId) {
    try {
      const response = await fetch(`${this.baseURL}/api/settings/user/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  }

  async updateUserPreference(userId, key, value, encrypted = false, description = null) {
    try {
      const response = await fetch(`${this.baseURL}/api/settings/user/${userId}/${key}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          value,
          encrypted,
          description
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user preference:', error);
      throw error;
    }
  }

  // Resolved Settings API calls
  async getResolvedSetting(orgId, key, userId = null) {
    try {
      const url = userId 
        ? `${this.baseURL}/api/settings/resolved/${orgId}/${key}?user_id=${userId}`
        : `${this.baseURL}/api/settings/resolved/${orgId}/${key}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching resolved setting:', error);
      throw error;
    }
  }

  // Audit Logs API calls
  async getAuditLogs(orgId, limit = 100, offset = 0) {
    try {
      const response = await fetch(`${this.baseURL}/api/settings/audit-logs/${orgId}?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }

  // Feature Flags API calls
  async getFeatureFlags() {
    try {
      const response = await fetch(`${this.baseURL}/api/settings/feature-flags`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      throw error;
    }
  }

  async checkFeatureFlag(flagName, orgId) {
    try {
      const response = await fetch(`${this.baseURL}/api/settings/feature-flags/${flagName}/check/${orgId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking feature flag:', error);
      throw error;
    }
  }

  // Store Info API calls
  async getStoreInfo() {
    try {
      const response = await fetch(`${this.baseURL}/api/store/info`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching store info:', error);
      throw error;
    }
  }

  async getStoreLimits() {
    try {
      const response = await fetch(`${this.baseURL}/api/store/limits`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching store limits:', error);
      throw error;
    }
  }

  async checkStoreLimit(feature) {
    try {
      const response = await fetch(`${this.baseURL}/api/store/check-limit/${feature}`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking store limit:', error);
      throw error;
    }
  }

  // Helper methods
  getUser() {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return {};
    }
  }

  getOrgId() {
    const user = this.getUser();
    return user.org_id || user.id || 'default_org';
  }

  getUserId() {
    const user = this.getUser();
    return user.id || 'default_user';
  }

  // Default settings for new stores
  getDefaultSettings() {
    return {
      store_info: {
        store_name: '',
        store_phone: '',
        store_email: '',
        store_website: '',
        store_address: ''
      },
      regional: {
        timezone: 'America/New_York',
        currency: 'USD',
        date_format: 'MM/DD/YYYY',
        time_format: '12-hour',
        language: 'English',
        tax_rate: 8.5
      },
      business_hours: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '10:00', close: '16:00', closed: false },
        sunday: { open: '10:00', close: '16:00', closed: true }
      },
      receipts: {
        receipt_header: 'Deal n Done Store',
        receipt_footer: 'Thank you for your business!',
        receipt_logo: null
      },
      notifications: {
        email_notifications: true,
        sms_notifications: false,
        push_notifications: true,
        low_stock_alerts: true,
        sales_reports: true,
        customer_notifications: true
      },
      system: {
        auto_backup: true,
        backup_frequency: 'daily',
        backup_retention: 30,
        system_maintenance: 'sunday',
        maintenance_time: '02:00'
      }
    };
  }

  // Validate settings before saving
  validateSettings(settings, section) {
    const validations = {
      store_info: {
        store_name: (value) => value && value.length >= 3,
        store_email: (value) => value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        store_phone: (value) => !value || /^[+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''))
      },
      regional: {
        timezone: (value) => value && value.length > 0,
        currency: (value) => value && value.length === 3,
        tax_rate: (value) => value >= 0 && value <= 100
      },
      business_hours: {
        // Validate each day has proper structure
        validate: (hours) => {
          const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
          return days.every(day => {
            const dayHours = hours[day];
            return dayHours && typeof dayHours.closed === 'boolean';
          });
        }
      }
    };

    const sectionValidations = validations[section];
    if (!sectionValidations) return true;

    for (const [key, validator] of Object.entries(sectionValidations)) {
      if (key === 'validate') {
        if (!validator(settings)) {
          throw new Error(`Invalid ${section} settings`);
        }
      } else if (settings[key] !== undefined && !validator(settings[key])) {
        throw new Error(`Invalid ${key} in ${section}`);
      }
    }

    return true;
  }
}

// Create singleton instance
const settingsService = new SettingsService();

export default settingsService; 