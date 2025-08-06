const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class GitRecoverySystem {
  constructor() {
    this.workingBranch = 'main';
    this.backupBranch = 'backup-working-version-2025';
    this.autoBackupBranch = 'auto-backup';
    this.recoveryTag = 'v2.0-working';
  }

  // Initialize git recovery system
  async init() {
    console.log('🔒 Initializing Git Recovery System...');
    
    try {
      // Check if git repository exists
      await this.checkGitRepo();
      
      // Create backup branch if it doesn't exist
      await this.createBackupBranch();
      
      // Create auto-backup branch
      await this.createAutoBackupBranch();
      
      // Tag current working version
      await this.tagWorkingVersion();
      
      console.log('✅ Git Recovery System Active');
      
    } catch (error) {
      console.error('❌ Git Recovery System initialization failed:', error);
    }
  }

  // Check if git repository exists
  async checkGitRepo() {
    return new Promise((resolve, reject) => {
      exec('git status', (error, stdout, stderr) => {
        if (error) {
          reject(new Error('Not a git repository. Please initialize git first.'));
        } else {
          resolve(stdout);
        }
      });
    });
  }

  // Create backup branch
  async createBackupBranch() {
    return new Promise((resolve, reject) => {
      exec(`git branch ${this.backupBranch}`, (error, stdout, stderr) => {
        if (error && !error.message.includes('already exists')) {
          reject(error);
        } else {
          console.log(`✅ Backup branch ready: ${this.backupBranch}`);
          resolve();
        }
      });
    });
  }

  // Create auto-backup branch
  async createAutoBackupBranch() {
    return new Promise((resolve, reject) => {
      exec(`git branch ${this.autoBackupBranch}`, (error, stdout, stderr) => {
        if (error && !error.message.includes('already exists')) {
          reject(error);
        } else {
          console.log(`✅ Auto-backup branch ready: ${this.autoBackupBranch}`);
          resolve();
        }
      });
    });
  }

  // Tag working version
  async tagWorkingVersion() {
    return new Promise((resolve, reject) => {
      exec(`git tag -a ${this.recoveryTag} -m "Working version with restored layout"`, (error, stdout, stderr) => {
        if (error && !error.message.includes('already exists')) {
          console.log('⚠️  Tag already exists, skipping...');
        } else {
          console.log(`✅ Working version tagged: ${this.recoveryTag}`);
        }
        resolve();
      });
    });
  }

  // Create automatic backup commit
  async createAutoBackup(message = 'Auto-backup: Working version') {
    return new Promise((resolve, reject) => {
      // Add all changes
      exec('git add .', (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }

        // Create commit
        exec(`git commit -m "${message}"`, (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }

          console.log('✅ Auto-backup commit created');
          resolve();
        });
      });
    });
  }

  // Switch to backup branch
  async switchToBackup() {
    return new Promise((resolve, reject) => {
      exec(`git checkout ${this.backupBranch}`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          console.log(`✅ Switched to backup branch: ${this.backupBranch}`);
          resolve();
        }
      });
    });
  }

  // Switch to working branch
  async switchToWorking() {
    return new Promise((resolve, reject) => {
      exec(`git checkout ${this.workingBranch}`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          console.log(`✅ Switched to working branch: ${this.workingBranch}`);
          resolve();
        }
      });
    });
  }

  // Emergency rollback to working version
  async emergencyRollback() {
    try {
      console.log('🚨 Emergency rollback initiated...');
      
      // Stash any current changes
      await this.stashChanges();
      
      // Switch to backup branch
      await this.switchToBackup();
      
      // Reset to the tagged working version
      await this.resetToWorkingVersion();
      
      // Restart development server
      this.restartDevServer();
      
      console.log('✅ Emergency rollback completed');
      
    } catch (error) {
      console.error('❌ Emergency rollback failed:', error);
      throw error;
    }
  }

  // Stash current changes
  async stashChanges() {
    return new Promise((resolve, reject) => {
      exec('git stash push -m "Emergency rollback stash"', (error, stdout, stderr) => {
        if (error) {
          // No changes to stash, that's okay
          console.log('ℹ️  No changes to stash');
        } else {
          console.log('📦 Changes stashed');
        }
        resolve();
      });
    });
  }

  // Reset to working version
  async resetToWorkingVersion() {
    return new Promise((resolve, reject) => {
      exec(`git reset --hard ${this.recoveryTag}`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          console.log(`✅ Reset to working version: ${this.recoveryTag}`);
          resolve();
        }
      });
    });
  }

  // Get git status
  async getGitStatus() {
    return new Promise((resolve, reject) => {
      exec('git status --porcelain', (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  // Get commit history
  async getCommitHistory(limit = 10) {
    return new Promise((resolve, reject) => {
      exec(`git log --oneline -${limit}`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  // Create recovery point
  async createRecoveryPoint(message = 'Recovery point') {
    try {
      // Create auto-backup commit
      await this.createAutoBackup(message);
      
      // Push to remote if available
      await this.pushToRemote();
      
      console.log('✅ Recovery point created');
      
    } catch (error) {
      console.error('❌ Failed to create recovery point:', error);
      throw error;
    }
  }

  // Push to remote
  async pushToRemote() {
    return new Promise((resolve, reject) => {
      exec('git push origin main', (error, stdout, stderr) => {
        if (error) {
          console.log('⚠️  Could not push to remote (may not be configured)');
        } else {
          console.log('✅ Pushed to remote');
        }
        resolve();
      });
    });
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

  // Monitor for changes and auto-backup
  startAutoBackup() {
    console.log('🔄 Starting auto-backup monitoring...');
    
    // Check for changes every 30 seconds
    setInterval(async () => {
      try {
        const status = await this.getGitStatus();
        if (status.trim()) {
          console.log('📝 Changes detected, creating auto-backup...');
          await this.createRecoveryPoint('Auto-backup: Changes detected');
        }
      } catch (error) {
        console.error('❌ Auto-backup check failed:', error);
      }
    }, 30000); // 30 seconds
  }

  // Get available recovery points
  async getRecoveryPoints() {
    try {
      const history = await this.getCommitHistory(20);
      return history.split('\n').filter(line => line.trim());
    } catch (error) {
      console.error('❌ Failed to get recovery points:', error);
      return [];
    }
  }

  // Restore to specific commit
  async restoreToCommit(commitHash) {
    try {
      console.log(`🔄 Restoring to commit: ${commitHash}`);
      
      // Stash current changes
      await this.stashChanges();
      
      // Reset to specific commit
      return new Promise((resolve, reject) => {
        exec(`git reset --hard ${commitHash}`, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            console.log(`✅ Restored to commit: ${commitHash}`);
            this.restartDevServer();
            resolve();
          }
        });
      });
      
    } catch (error) {
      console.error('❌ Failed to restore to commit:', error);
      throw error;
    }
  }
}

// Export the git recovery system
module.exports = GitRecoverySystem;

// Auto-start if this file is run directly
if (require.main === module) {
  const gitRecovery = new GitRecoverySystem();
  gitRecovery.init().then(() => {
    gitRecovery.startAutoBackup();
  });
} 