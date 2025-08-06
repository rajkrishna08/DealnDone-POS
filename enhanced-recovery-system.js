const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const AutomatedBackupSystem = require('./automated-backup-system');
const GitRecoverySystem = require('./git-recovery-system');

class EnhancedRecoverySystem {
  constructor() {
    this.backupSystem = new AutomatedBackupSystem();
    this.gitSystem = new GitRecoverySystem();
    this.recoveryPoints = new Map();
    this.loadRecoveryPoints();
  }

  // Load predefined recovery points
  loadRecoveryPoints() {
    this.recoveryPoints.set('v2.0-working', {
      type: 'git-tag',
      description: 'Working version with restored layout',
      date: '2025-08-07',
      command: 'git reset --hard v2.0-working'
    });

    this.recoveryPoints.set('before-sprint-3', {
      type: 'backup',
      description: 'Version before Sprint 3 implementation',
      date: '2025-08-07 21:00:00',
      backupName: 'backup-2025-08-07-210000-before-sprint-3'
    });

    this.recoveryPoints.set('original-landing-page', {
      type: 'backup',
      description: 'Original landing page design',
      date: '2025-08-07 09:00:00',
      backupName: 'backup-2025-08-07-090000-original-landing'
    });

    this.recoveryPoints.set('dark-sidebar-version', {
      type: 'backup',
      description: 'Version with dark sidebar restored',
      date: '2025-08-07 01:30:00',
      backupName: 'backup-2025-08-07-013000-dark-sidebar'
    });

    this.recoveryPoints.set('current-working', {
      type: 'backup',
      description: 'Current working version (latest)',
      date: 'now',
      backupName: 'latest'
    });
  }

  // List all available recovery points
  async listRecoveryPoints() {
    console.log('📋 Available Recovery Points:');
    console.log('');

    // Git tags
    console.log('🏷️  Git Tags:');
    try {
      const tags = await this.getGitTags();
      tags.forEach(tag => {
        console.log(`   • ${tag.name} - ${tag.message}`);
      });
    } catch (error) {
      console.log('   • No git tags available');
    }

    console.log('');

    // Backup points
    console.log('📦 Backup Points:');
    const backups = this.backupSystem.getAvailableBackups();
    backups.forEach(backup => {
      const date = new Date(backup.metadata.timestamp).toLocaleString();
      console.log(`   • ${backup.name} - ${date} (${backup.metadata.reason})`);
    });

    console.log('');

    // Predefined points
    console.log('🎯 Predefined Recovery Points:');
    this.recoveryPoints.forEach((point, name) => {
      console.log(`   • ${name} - ${point.description} (${point.date})`);
    });

    console.log('');
    console.log('💡 Usage: npm run recover -- "point-name"');
    console.log('💡 Example: npm run recover -- "v2.0-working"');
  }

  // Get git tags
  async getGitTags() {
    return new Promise((resolve, reject) => {
      exec('git tag -l --format="%(refname:short)|%(contents:subject)"', (error, stdout, stderr) => {
        if (error) {
          resolve([]);
        } else {
          const tags = stdout.split('\n')
            .filter(line => line.trim())
            .map(line => {
              const [name, message] = line.split('|');
              return { name, message };
            });
          resolve(tags);
        }
      });
    });
  }

  // Recover to specific point
  async recoverToPoint(target) {
    console.log(`🔄 Initiating recovery to: ${target}`);

    // Check if it's a predefined point
    if (this.recoveryPoints.has(target)) {
      return this.recoverToPredefinedPoint(target);
    }

    // Check if it's a git tag
    if (target.startsWith('v')) {
      return this.recoverToGitTag(target);
    }

    // Check if it's a backup name
    if (target.includes('backup-')) {
      return this.recoverToBackup(target);
    }

    // Check if it's a timestamp
    if (target.includes('-') || target.includes(':')) {
      return this.recoverToTimestamp(target);
    }

    // Check if it's a commit hash
    if (target.length === 40 || target.length === 7) {
      return this.recoverToCommit(target);
    }

    throw new Error(`Unknown recovery point: ${target}`);
  }

  // Recover to predefined point
  async recoverToPredefinedPoint(pointName) {
    const point = this.recoveryPoints.get(pointName);
    console.log(`🎯 Recovering to predefined point: ${pointName}`);
    console.log(`📝 Description: ${point.description}`);
    console.log(`📅 Date: ${point.date}`);

    if (point.type === 'git-tag') {
      return this.recoverToGitTag(pointName);
    } else if (point.type === 'backup') {
      return this.recoverToBackup(point.backupName);
    }
  }

  // Recover to git tag
  async recoverToGitTag(tag) {
    console.log(`🏷️  Recovering to git tag: ${tag}`);
    
    try {
      // Stash current changes
      await this.gitSystem.stashChanges();
      
      // Reset to tag
      return new Promise((resolve, reject) => {
        exec(`git reset --hard ${tag}`, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            console.log(`✅ Successfully recovered to git tag: ${tag}`);
            this.restartDevServer();
            resolve();
          }
        });
      });
    } catch (error) {
      console.error(`❌ Failed to recover to git tag: ${error.message}`);
      throw error;
    }
  }

  // Recover to backup
  async recoverToBackup(backupName) {
    console.log(`📦 Recovering to backup: ${backupName}`);
    
    try {
      await this.backupSystem.restoreFromBackup(backupName);
      console.log(`✅ Successfully recovered to backup: ${backupName}`);
    } catch (error) {
      console.error(`❌ Failed to recover to backup: ${error.message}`);
      throw error;
    }
  }

  // Recover to timestamp
  async recoverToTimestamp(timestamp) {
    console.log(`⏰ Recovering to timestamp: ${timestamp}`);
    
    // Find closest backup to timestamp
    const backups = this.backupSystem.getAvailableBackups();
    const targetTime = new Date(timestamp);
    
    let closestBackup = null;
    let minDiff = Infinity;
    
    backups.forEach(backup => {
      const backupTime = new Date(backup.metadata.timestamp);
      const diff = Math.abs(targetTime - backupTime);
      
      if (diff < minDiff) {
        minDiff = diff;
        closestBackup = backup;
      }
    });
    
    if (closestBackup) {
      console.log(`📅 Found closest backup: ${closestBackup.name}`);
      console.log(`⏰ Target: ${timestamp}`);
      console.log(`📦 Actual: ${closestBackup.metadata.timestamp}`);
      
      return this.recoverToBackup(closestBackup.name);
    } else {
      throw new Error(`No backup found near timestamp: ${timestamp}`);
    }
  }

  // Recover to commit
  async recoverToCommit(commitHash) {
    console.log(`🔧 Recovering to commit: ${commitHash}`);
    
    try {
      // Stash current changes
      await this.gitSystem.stashChanges();
      
      // Reset to commit
      return new Promise((resolve, reject) => {
        exec(`git reset --hard ${commitHash}`, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            console.log(`✅ Successfully recovered to commit: ${commitHash}`);
            this.restartDevServer();
            resolve();
          }
        });
      });
    } catch (error) {
      console.error(`❌ Failed to recover to commit: ${error.message}`);
      throw error;
    }
  }

  // Create recovery point with custom name
  async createRecoveryPoint(name, description) {
    console.log(`📝 Creating recovery point: ${name}`);
    
    // Create backup
    await this.backupSystem.createBackup(name);
    
    // Create git commit
    await this.gitSystem.createRecoveryPoint(`Recovery point: ${name}`);
    
    // Add to predefined points
    this.recoveryPoints.set(name, {
      type: 'backup',
      description: description || `Custom recovery point: ${name}`,
      date: new Date().toISOString(),
      backupName: `backup-${new Date().toISOString().replace(/[:.]/g, '-')}-${name}`
    });
    
    console.log(`✅ Recovery point created: ${name}`);
  }

  // Search recovery points
  async searchRecoveryPoints(query) {
    console.log(`🔍 Searching for recovery points containing: "${query}"`);
    
    const results = [];
    
    // Search in predefined points
    this.recoveryPoints.forEach((point, name) => {
      if (name.toLowerCase().includes(query.toLowerCase()) ||
          point.description.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'predefined', name, point });
      }
    });
    
    // Search in backups
    const backups = this.backupSystem.getAvailableBackups();
    backups.forEach(backup => {
      if (backup.name.toLowerCase().includes(query.toLowerCase()) ||
          backup.metadata.reason.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'backup', name: backup.name, backup });
      }
    });
    
    // Search in git tags
    try {
      const tags = await this.getGitTags();
      tags.forEach(tag => {
        if (tag.name.toLowerCase().includes(query.toLowerCase()) ||
            tag.message.toLowerCase().includes(query.toLowerCase())) {
          results.push({ type: 'git-tag', name: tag.name, tag });
        }
      });
    } catch (error) {
      // Ignore git errors
    }
    
    return results;
  }

  // Restart development server
  restartDevServer() {
    console.log('🔄 Restarting development server...');
    exec('npm start', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Failed to restart server:', error);
      } else {
        console.log('✅ Development server restarted');
      }
    });
  }

  // Get recovery statistics
  getRecoveryStatistics() {
    const backups = this.backupSystem.getAvailableBackups();
    
    return {
      totalBackups: backups.length,
      predefinedPoints: this.recoveryPoints.size,
      latestBackup: backups[0]?.name || 'None',
      oldestBackup: backups[backups.length - 1]?.name || 'None',
      recoveryMethods: ['git-tag', 'backup', 'timestamp', 'commit', 'predefined']
    };
  }
}

// Export the enhanced recovery system
module.exports = EnhancedRecoverySystem;

// Auto-start if this file is run directly
if (require.main === module) {
  const enhancedRecovery = new EnhancedRecoverySystem();
  
  const target = process.argv[2];
  if (target) {
    enhancedRecovery.recoverToPoint(target);
  } else {
    enhancedRecovery.listRecoveryPoints();
  }
} 