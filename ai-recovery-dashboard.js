const fs = require('fs');
const path = require('path');
const AutomatedBackupSystem = require('./automated-backup-system');
const GitRecoverySystem = require('./git-recovery-system');

class AIRecoveryDashboard {
  constructor() {
    this.backupSystem = new AutomatedBackupSystem();
    this.gitSystem = new GitRecoverySystem();
    this.recoveryHistory = [];
    this.healthChecks = [];
  }

  // Initialize the AI recovery dashboard
  async init() {
    console.log('🤖 Initializing AI Recovery Dashboard...');
    
    try {
      // Initialize backup systems
      await this.backupSystem.init();
      await this.gitSystem.init();
      
      // Start health monitoring
      this.startHealthMonitoring();
      
      // Start AI analysis
      this.startAIAnalysis();
      
      console.log('✅ AI Recovery Dashboard Active');
      
    } catch (error) {
      console.error('❌ AI Recovery Dashboard initialization failed:', error);
    }
  }

  // Start health monitoring
  startHealthMonitoring() {
    setInterval(() => {
      this.performHealthCheck();
    }, 60000); // Every minute
  }

  // Perform health check
  async performHealthCheck() {
    const health = {
      timestamp: new Date().toISOString(),
      backupSystem: await this.checkBackupSystemHealth(),
      gitSystem: await this.checkGitSystemHealth(),
      fileIntegrity: await this.checkFileIntegrity(),
      recommendations: []
    };

    // Generate AI recommendations
    health.recommendations = this.generateAIRecommendations(health);
    
    this.healthChecks.push(health);
    
    // Keep only last 100 health checks
    if (this.healthChecks.length > 100) {
      this.healthChecks = this.healthChecks.slice(-100);
    }

    // Log critical issues
    if (health.backupSystem.status === 'critical' || 
        health.gitSystem.status === 'critical' ||
        health.fileIntegrity.status === 'critical') {
      console.log('🚨 CRITICAL HEALTH ISSUE DETECTED');
      console.log(JSON.stringify(health, null, 2));
    }
  }

  // Check backup system health
  async checkBackupSystemHealth() {
    try {
      const backups = this.backupSystem.getAvailableBackups();
      const latestBackup = backups[0];
      
      if (!latestBackup) {
        return { status: 'critical', message: 'No backups available' };
      }

      const backupAge = Date.now() - latestBackup.time.getTime();
      const hoursSinceBackup = backupAge / (1000 * 60 * 60);

      if (hoursSinceBackup > 24) {
        return { 
          status: 'warning', 
          message: `Last backup was ${hoursSinceBackup.toFixed(1)} hours ago` 
        };
      }

      return { 
        status: 'healthy', 
        message: `Last backup: ${hoursSinceBackup.toFixed(1)} hours ago`,
        backupCount: backups.length
      };
    } catch (error) {
      return { status: 'critical', message: error.message };
    }
  }

  // Check git system health
  async checkGitSystemHealth() {
    try {
      const status = await this.gitSystem.getGitStatus();
      
      if (status.trim()) {
        return { 
          status: 'warning', 
          message: 'Uncommitted changes detected' 
        };
      }

      return { status: 'healthy', message: 'Git repository clean' };
    } catch (error) {
      return { status: 'critical', message: error.message };
    }
  }

  // Check file integrity
  async checkFileIntegrity() {
    const criticalFiles = [
      'frontend/src/App.jsx',
      'frontend/src/components/Sidebar.jsx',
      'frontend/src/components/Header.jsx',
      'frontend/src/components/StoreDashboard.jsx',
      'frontend/src/index.css'
    ];

    const missingFiles = [];
    const corruptedFiles = [];

    for (const file of criticalFiles) {
      if (!fs.existsSync(file)) {
        missingFiles.push(file);
      } else {
        try {
          const content = fs.readFileSync(file, 'utf8');
          if (content.length === 0) {
            corruptedFiles.push(file);
          }
        } catch (error) {
          corruptedFiles.push(file);
        }
      }
    }

    if (missingFiles.length > 0) {
      return { 
        status: 'critical', 
        message: `Missing files: ${missingFiles.join(', ')}` 
      };
    }

    if (corruptedFiles.length > 0) {
      return { 
        status: 'warning', 
        message: `Corrupted files: ${corruptedFiles.join(', ')}` 
      };
    }

    return { status: 'healthy', message: 'All critical files intact' };
  }

  // Generate AI recommendations
  generateAIRecommendations(health) {
    const recommendations = [];

    // Backup recommendations
    if (health.backupSystem.status === 'critical') {
      recommendations.push({
        priority: 'high',
        action: 'create_emergency_backup',
        message: 'Create emergency backup immediately',
        command: 'npm run emergency-backup'
      });
    }

    if (health.backupSystem.status === 'warning') {
      recommendations.push({
        priority: 'medium',
        action: 'create_backup',
        message: 'Create backup to ensure recent changes are saved',
        command: 'npm run backup'
      });
    }

    // Git recommendations
    if (health.gitSystem.status === 'warning') {
      recommendations.push({
        priority: 'medium',
        action: 'commit_changes',
        message: 'Commit uncommitted changes to prevent loss',
        command: 'git add . && git commit -m "Auto-commit: Changes detected"'
      });
    }

    // File integrity recommendations
    if (health.fileIntegrity.status === 'critical') {
      recommendations.push({
        priority: 'high',
        action: 'emergency_restore',
        message: 'Emergency restore required - critical files missing',
        command: 'npm run emergency-restore'
      });
    }

    if (health.fileIntegrity.status === 'warning') {
      recommendations.push({
        priority: 'medium',
        action: 'verify_files',
        message: 'Verify and repair corrupted files',
        command: 'npm run verify-files'
      });
    }

    return recommendations;
  }

  // Start AI analysis
  startAIAnalysis() {
    setInterval(() => {
      this.analyzeRecoveryPatterns();
    }, 300000); // Every 5 minutes
  }

  // Analyze recovery patterns
  analyzeRecoveryPatterns() {
    if (this.healthChecks.length < 10) return;

    const recentChecks = this.healthChecks.slice(-10);
    const criticalIssues = recentChecks.filter(check => 
      check.backupSystem.status === 'critical' ||
      check.gitSystem.status === 'critical' ||
      check.fileIntegrity.status === 'critical'
    );

    if (criticalIssues.length > 3) {
      console.log('🚨 AI DETECTION: Multiple critical issues detected');
      console.log('🤖 AI RECOMMENDATION: Consider emergency rollback');
      this.suggestEmergencyRollback();
    }
  }

  // Suggest emergency rollback
  async suggestEmergencyRollback() {
    console.log('🤖 AI SUGGESTION: Emergency rollback recommended');
    console.log('📋 Available recovery options:');
    
    const backups = this.backupSystem.getAvailableBackups();
    const recoveryPoints = await this.gitSystem.getRecoveryPoints();
    
    console.log(`📦 File backups: ${backups.length} available`);
    console.log(`🔧 Git recovery points: ${recoveryPoints.length} available`);
    
    console.log('🚨 To perform emergency rollback:');
    console.log('   npm run emergency-rollback');
  }

  // Get dashboard status
  getDashboardStatus() {
    const latestHealth = this.healthChecks[this.healthChecks.length - 1];
    const backups = this.backupSystem.getAvailableBackups();
    
    return {
      status: 'active',
      lastHealthCheck: latestHealth?.timestamp || 'Never',
      backupCount: backups.length,
      recentIssues: this.healthChecks.filter(h => 
        h.backupSystem.status === 'critical' ||
        h.gitSystem.status === 'critical' ||
        h.fileIntegrity.status === 'critical'
      ).length,
      recommendations: latestHealth?.recommendations || []
    };
  }

  // Emergency rollback with AI assistance
  async performEmergencyRollback() {
    console.log('🤖 AI INITIATED: Emergency rollback');
    
    try {
      // First try git rollback
      await this.gitSystem.emergencyRollback();
      console.log('✅ Git rollback successful');
    } catch (error) {
      console.log('⚠️  Git rollback failed, trying file backup...');
      
      // Fallback to file backup
      const backups = this.backupSystem.getAvailableBackups();
      if (backups.length > 0) {
        await this.backupSystem.emergencyRollback();
        console.log('✅ File backup rollback successful');
      } else {
        throw new Error('No recovery options available');
      }
    }
  }

  // Create intelligent backup
  async createIntelligentBackup() {
    console.log('🤖 AI: Creating intelligent backup...');
    
    // Analyze current state
    const health = await this.performHealthCheck();
    
    // Determine backup strategy
    if (health.backupSystem.status === 'critical') {
      console.log('🚨 CRITICAL: Creating emergency backup');
      await this.backupSystem.createBackup('emergency');
    } else {
      console.log('📦 NORMAL: Creating routine backup');
      await this.backupSystem.createBackup('intelligent');
    }
    
    // Also create git backup
    await this.gitSystem.createRecoveryPoint('AI: Intelligent backup');
    
    console.log('✅ Intelligent backup completed');
  }

  // Get recovery statistics
  getRecoveryStatistics() {
    const totalChecks = this.healthChecks.length;
    const criticalIssues = this.healthChecks.filter(h => 
      h.backupSystem.status === 'critical' ||
      h.gitSystem.status === 'critical' ||
      h.fileIntegrity.status === 'critical'
    ).length;
    
    const warningIssues = this.healthChecks.filter(h => 
      h.backupSystem.status === 'warning' ||
      h.gitSystem.status === 'warning' ||
      h.fileIntegrity.status === 'warning'
    ).length;
    
    return {
      totalHealthChecks: totalChecks,
      criticalIssues: criticalIssues,
      warningIssues: warningIssues,
      healthPercentage: totalChecks > 0 ? 
        ((totalChecks - criticalIssues - warningIssues) / totalChecks * 100).toFixed(1) : 100,
      lastBackup: this.backupSystem.lastBackup,
      availableBackups: this.backupSystem.getAvailableBackups().length
    };
  }
}

// Export the AI recovery dashboard
module.exports = AIRecoveryDashboard;

// Auto-start if this file is run directly
if (require.main === module) {
  const aiDashboard = new AIRecoveryDashboard();
  aiDashboard.init();
} 