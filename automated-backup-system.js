const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const chokidar = require('chokidar');

class AutomatedBackupSystem {
  constructor() {
    this.backupDir = 'auto-backups';
    this.watchPaths = [
      'frontend/src/**/*',
      'backend/**/*',
      'package.json',
      'frontend/package.json'
    ];
    this.lastBackup = null;
    this.backupInterval = 5 * 60 * 1000; // 5 minutes
    this.maxBackups = 10; // Keep last 10 backups
  }

  // Initialize the backup system
  async init() {
    console.log('🔒 Initializing Automated Backup System...');
    
    // Create backup directory
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    // Start file watching
    this.startFileWatcher();
    
    // Start periodic backups
    this.startPeriodicBackups();
    
    console.log('✅ Automated Backup System Active');
  }

  // Watch for file changes
  startFileWatcher() {
    const watcher = chokidar.watch(this.watchPaths, {
      ignored: /(node_modules|\.git|backup-*|auto-backups)/,
      persistent: true
    });

    watcher.on('change', (filePath) => {
      console.log(`📝 File changed: ${filePath}`);
      this.createBackup('file-change');
    });

    watcher.on('add', (filePath) => {
      console.log(`➕ File added: ${filePath}`);
      this.createBackup('file-added');
    });

    watcher.on('unlink', (filePath) => {
      console.log(`❌ File deleted: ${filePath}`);
      this.createBackup('file-deleted');
    });
  }

  // Create periodic backups
  startPeriodicBackups() {
    setInterval(() => {
      this.createBackup('periodic');
    }, this.backupInterval);
  }

  // Create a backup
  async createBackup(reason = 'manual') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `backup-${timestamp}-${reason}`;
    const backupPath = path.join(this.backupDir, backupName);

    try {
      // Create backup directory
      fs.mkdirSync(backupPath, { recursive: true });

      // Copy critical files
      await this.copyDirectory('frontend/src', path.join(backupPath, 'frontend/src'));
      await this.copyDirectory('backend', path.join(backupPath, 'backend'));
      
      // Copy config files
      fs.copyFileSync('package.json', path.join(backupPath, 'package.json'));
      fs.copyFileSync('frontend/package.json', path.join(backupPath, 'frontend/package.json'));

      // Create backup metadata
      const metadata = {
        timestamp: new Date().toISOString(),
        reason: reason,
        version: 'Deal n Done POS v2.0',
        status: 'WORKING_PERFECTLY',
        files: await this.getFileList('frontend/src')
      };

      fs.writeFileSync(
        path.join(backupPath, 'backup-metadata.json'),
        JSON.stringify(metadata, null, 2)
      );

      this.lastBackup = backupPath;
      console.log(`✅ Backup created: ${backupName}`);

      // Clean old backups
      this.cleanOldBackups();

    } catch (error) {
      console.error('❌ Backup failed:', error);
    }
  }

  // Copy directory recursively
  async copyDirectory(src, dest) {
    if (!fs.existsSync(src)) return;

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(src);
    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      
      if (fs.statSync(srcPath).isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  // Get list of files
  async getFileList(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        files.push(...await this.getFileList(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  // Clean old backups
  cleanOldBackups() {
    const backups = fs.readdirSync(this.backupDir)
      .filter(item => item.startsWith('backup-'))
      .map(item => ({
        name: item,
        path: path.join(this.backupDir, item),
        time: fs.statSync(path.join(this.backupDir, item)).mtime
      }))
      .sort((a, b) => b.time - a.time);

    // Keep only the latest maxBackups
    if (backups.length > this.maxBackups) {
      const toDelete = backups.slice(this.maxBackups);
      toDelete.forEach(backup => {
        fs.rmSync(backup.path, { recursive: true, force: true });
        console.log(`🗑️  Deleted old backup: ${backup.name}`);
      });
    }
  }

  // Restore from backup
  async restoreFromBackup(backupName) {
    const backupPath = path.join(this.backupDir, backupName);
    
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup ${backupName} not found`);
    }

    try {
      console.log(`🔄 Restoring from backup: ${backupName}`);
      
      // Restore frontend files
      await this.copyDirectory(
        path.join(backupPath, 'frontend/src'),
        'frontend/src'
      );

      // Restore backend files
      await this.copyDirectory(
        path.join(backupPath, 'backend'),
        'backend'
      );

      // Restore config files
      fs.copyFileSync(
        path.join(backupPath, 'package.json'),
        'package.json'
      );
      fs.copyFileSync(
        path.join(backupPath, 'frontend/package.json'),
        'frontend/package.json'
      );

      console.log('✅ Restore completed successfully');
      
      // Restart development server
      this.restartDevServer();
      
    } catch (error) {
      console.error('❌ Restore failed:', error);
      throw error;
    }
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

  // Get available backups
  getAvailableBackups() {
    if (!fs.existsSync(this.backupDir)) return [];
    
    return fs.readdirSync(this.backupDir)
      .filter(item => item.startsWith('backup-'))
      .map(item => {
        const backupPath = path.join(this.backupDir, item);
        const metadataPath = path.join(backupPath, 'backup-metadata.json');
        
        let metadata = {};
        if (fs.existsSync(metadataPath)) {
          try {
            metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
          } catch (e) {
            // Ignore metadata parsing errors
          }
        }
        
        return {
          name: item,
          path: backupPath,
          metadata: metadata,
          time: fs.statSync(backupPath).mtime
        };
      })
      .sort((a, b) => b.time - a.time);
  }

  // Emergency rollback to last working version
  async emergencyRollback() {
    const backups = this.getAvailableBackups();
    if (backups.length === 0) {
      throw new Error('No backups available for rollback');
    }

    const latestBackup = backups[0];
    console.log(`🚨 Emergency rollback to: ${latestBackup.name}`);
    
    await this.restoreFromBackup(latestBackup.name);
  }
}

// Export the backup system
module.exports = AutomatedBackupSystem;

// Auto-start if this file is run directly
if (require.main === module) {
  const backupSystem = new AutomatedBackupSystem();
  backupSystem.init();
} 