#!/usr/bin/env node
/**
 * Backup Restore Test Script for Gorstan
 * Tests complete restore process and validates the project builds
 */

import { $, fs, path } from 'zx';
import { execSync } from 'child_process';

// Configuration
const BACKUP_DIR = 'backups';
const RESTORE_TEST_DIR = '.restore-test';

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function error(message) {
  log(colors.red, `❌ ERROR: ${message}`);
}

function success(message) {
  log(colors.green, `✅ ${message}`);
}

function info(message) {
  log(colors.blue, `ℹ️  ${message}`);
}

function warn(message) {
  log(colors.yellow, `⚠️  ${message}`);
}

// Check if command exists
function commandExists(command) {
  try {
    execSync(`where ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Generate timestamp
function getTimestamp() {
  return new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
}

// Find latest encrypted backup
async function findLatestEncryptedBackup() {
  if (!(await fs.pathExists(BACKUP_DIR))) {
    error(`Backup directory ${BACKUP_DIR} does not exist`);
    process.exit(1);
  }

  const files = await fs.readdir(BACKUP_DIR);

  // Find latest encrypted backup
  const encryptedFiles = files.filter((f) =>
    f.match(/^gorstan-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-src\.(7z|tar\.gz\.gpg)$/),
  );

  if (encryptedFiles.length === 0) {
    error('No encrypted backup files found');
    process.exit(1);
  }

  // Sort by timestamp (newest first)
  encryptedFiles.sort().reverse();

  return path.join(BACKUP_DIR, encryptedFiles[0]);
}

// Extract encrypted backup
async function extractBackup(backupFile, testDir) {
  const backupPass = process.env.BACKUP_PASS;

  if (!backupPass) {
    error('BACKUP_PASS environment variable must be set for restore test');
    process.exit(1);
  }

  info(`Extracting backup: ${path.basename(backupFile)}`);

  try {
    if (backupFile.endsWith('.7z')) {
      if (!commandExists('7z')) {
        error('7z command not found - cannot extract .7z backup');
        process.exit(1);
      }

      await $`7z x -p${backupPass} -o${testDir} ${backupFile}`;
    } else if (backupFile.endsWith('.tar.gz.gpg')) {
      if (!commandExists('gpg')) {
        error('gpg command not found - cannot extract .gpg backup');
        process.exit(1);
      }

      const tempTar = path.join(testDir, 'temp.tar.gz');

      // Decrypt
      await $`gpg --quiet --batch --yes --decrypt --passphrase ${backupPass} --output ${tempTar} ${backupFile}`;

      // Extract
      await $`tar -xzf ${tempTar} -C ${testDir}`;

      // Clean up temp tar
      await fs.remove(tempTar);
    } else {
      error(`Unsupported backup format: ${path.basename(backupFile)}`);
      process.exit(1);
    }

    success('Backup extracted successfully');
  } catch (err) {
    error(`Failed to extract backup: ${err.message}`);
    process.exit(1);
  }
}

// Verify critical files exist
async function verifyCriticalFiles(testDir) {
  info('Verifying critical files...');

  const criticalFiles = [
    'package.json',
    'src/main.tsx',
    'src/App.tsx',
    'index.html',
    'tsconfig.json',
    'vite.config.ts',
  ];

  for (const file of criticalFiles) {
    const filePath = path.join(testDir, file);
    if (!(await fs.pathExists(filePath))) {
      error(`Critical file missing: ${file}`);
      return false;
    }
  }

  success('All critical files present');
  return true;
}

// Run build test
async function runBuildTest(testDir) {
  info('Running build test...');

  const originalCwd = process.cwd();

  try {
    // Change to test directory
    process.chdir(testDir);

    // Install dependencies
    info('Installing dependencies...');
    await $`npm ci`;
    success('Dependencies installed');

    // Run TypeScript check
    info('Running TypeScript check...');
    await $`npm run typecheck`;
    success('TypeScript check passed');

    // Run build
    info('Running build...');
    await $`npm run build`;
    success('Build completed successfully');

    // Verify dist folder exists and has content
    if ((await fs.pathExists('dist')) && (await fs.readdir('dist')).length > 0) {
      success('Build artifacts created');
      return true;
    } else {
      error('Build artifacts not found');
      return false;
    }
  } catch (err) {
    error(`Build test failed: ${err.message}`);
    return false;
  } finally {
    // Restore original working directory
    process.chdir(originalCwd);
  }
}

// Clean up test directory
async function cleanup(testDir, keepOnFailure = false) {
  if (keepOnFailure) {
    warn(`Keeping test directory for inspection: ${testDir}`);
  } else {
    info('Cleaning up test directory...');
    if (await fs.pathExists(testDir)) {
      await fs.remove(testDir);
    }
    success('Cleanup completed');
  }
}

// Main restore test function
async function main() {
  let testDir = null;
  let testPassed = false;

  try {
    log(colors.bold + colors.blue, '🔄 Gorstan Backup Restore Test');
    console.log();

    // Find latest encrypted backup
    const backupFile = await findLatestEncryptedBackup();
    info(`Found backup: ${path.basename(backupFile)}`);

    // Create test directory
    const timestamp = getTimestamp();
    testDir = path.join(RESTORE_TEST_DIR, timestamp);
    await fs.ensureDir(testDir);

    info(`Test directory: ${testDir}`);

    // Extract backup
    await extractBackup(backupFile, testDir);

    // Verify critical files
    const filesValid = await verifyCriticalFiles(testDir);
    if (!filesValid) {
      throw new Error('Critical files verification failed');
    }

    // Run build test
    const buildValid = await runBuildTest(testDir);
    if (!buildValid) {
      throw new Error('Build test failed');
    }

    testPassed = true;

    console.log();
    log(colors.bold + colors.green, '🎉 RESTORE TEST PASSED');
    console.log('✅ Backup can be successfully restored');
    console.log('✅ All critical files are present');
    console.log('✅ Project builds without errors');
    console.log('✅ Backup integrity confirmed');
  } catch (err) {
    console.log();
    log(colors.bold + colors.red, '💥 RESTORE TEST FAILED');
    error(err.message);

    if (testDir) {
      warn(`Test directory preserved for debugging: ${testDir}`);
    }

    process.exit(1);
  } finally {
    // Clean up on success, keep on failure
    if (testDir) {
      await cleanup(testDir, !testPassed);
    }
  }
}

// Handle CTRL+C gracefully
process.on('SIGINT', async () => {
  warn('Restore test interrupted by user');
  process.exit(1);
});

main();
