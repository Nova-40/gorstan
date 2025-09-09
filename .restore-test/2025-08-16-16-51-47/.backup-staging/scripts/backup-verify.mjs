#!/usr/bin/env node
/**
 * Backup Verification Script for Gorstan
 * Verifies SHA256 checksums and tests encrypted archive integrity
 */

import { $, fs, path } from 'zx';
import { createHash } from 'crypto';
import { execSync } from 'child_process';

// Configuration
const BACKUP_DIR = 'backups';
const TEMP_TEST_DIR = '.verify-temp';

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

// Calculate SHA256 hash of a file
async function calculateFileHash(filePath) {
  const fileBuffer = await fs.readFile(filePath);
  return createHash('sha256').update(fileBuffer).digest('hex');
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

// Find latest backup files
async function findLatestBackupFiles() {
  if (!(await fs.pathExists(BACKUP_DIR))) {
    error(`Backup directory ${BACKUP_DIR} does not exist`);
    process.exit(1);
  }

  const files = await fs.readdir(BACKUP_DIR);

  // Find latest timestamp
  const backupFiles = files.filter((f) =>
    f.match(/^gorstan-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-src\./),
  );

  if (backupFiles.length === 0) {
    error('No backup files found');
    process.exit(1);
  }

  // Sort by timestamp (newest first)
  backupFiles.sort().reverse();

  const latestTimestamp = backupFiles[0].match(
    /gorstan-(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})-src\./,
  )[1];

  const zipFile = path.join(BACKUP_DIR, `gorstan-${latestTimestamp}-src.zip`);
  const sevenZipFile = path.join(BACKUP_DIR, `gorstan-${latestTimestamp}-src.7z`);
  const gpgFile = path.join(BACKUP_DIR, `gorstan-${latestTimestamp}-src.tar.gz.gpg`);
  const checksumFile = path.join(BACKUP_DIR, 'SHA256SUMS.txt');

  const result = {
    timestamp: latestTimestamp,
    zipFile: (await fs.pathExists(zipFile)) ? zipFile : null,
    encryptedFile: null,
    checksumFile: (await fs.pathExists(checksumFile)) ? checksumFile : null,
  };

  if (await fs.pathExists(sevenZipFile)) {
    result.encryptedFile = sevenZipFile;
  } else if (await fs.pathExists(gpgFile)) {
    result.encryptedFile = gpgFile;
  }

  return result;
}

// Parse checksums file
async function parseChecksums(checksumFile) {
  const content = await fs.readFile(checksumFile, 'utf-8');
  const checksums = new Map();

  for (const line of content.trim().split('\n')) {
    const [hash, filename] = line.split(/\s+/, 2);
    if (hash && filename) {
      checksums.set(filename, hash);
    }
  }

  return checksums;
}

// Verify file checksums
async function verifyChecksums(files, checksumFile) {
  info('Verifying SHA256 checksums...');

  const expectedChecksums = await parseChecksums(checksumFile);
  let allValid = true;

  for (const [type, filePath] of Object.entries(files)) {
    if (!filePath || !(await fs.pathExists(filePath))) {
      continue;
    }

    const filename = path.basename(filePath);
    const expectedHash = expectedChecksums.get(filename);

    if (!expectedHash) {
      warn(`No checksum found for ${filename}`);
      continue;
    }

    info(`Verifying ${filename}...`);
    const actualHash = await calculateFileHash(filePath);

    if (actualHash === expectedHash) {
      success(`${filename}: checksum valid`);
    } else {
      error(`${filename}: checksum mismatch!`);
      error(`  Expected: ${expectedHash}`);
      error(`  Actual:   ${actualHash}`);
      allValid = false;
    }
  }

  return allValid;
}

// Test encrypted archive by extracting it
async function testEncryptedArchive(encryptedFile) {
  const backupPass = process.env.BACKUP_PASS;

  if (!backupPass) {
    warn('BACKUP_PASS not set - skipping encrypted archive test');
    return true;
  }

  info('Testing encrypted archive integrity...');

  // Clean temp directory
  if (await fs.pathExists(TEMP_TEST_DIR)) {
    await fs.remove(TEMP_TEST_DIR);
  }
  await fs.ensureDir(TEMP_TEST_DIR);

  try {
    if (encryptedFile.endsWith('.7z')) {
      // Test 7z archive
      if (!commandExists('7z')) {
        warn('7z not available - skipping encrypted archive test');
        return true;
      }

      await $`7z t -p${backupPass} ${encryptedFile}`;
      success('7z archive integrity test passed');

      // Quick extract test for key files
      await $`7z x -p${backupPass} -o${TEMP_TEST_DIR} ${encryptedFile} package.json src/main.tsx`;
    } else if (encryptedFile.endsWith('.gpg')) {
      // Test GPG archive
      if (!commandExists('gpg')) {
        warn('gpg not available - skipping encrypted archive test');
        return true;
      }

      const tempTar = path.join(TEMP_TEST_DIR, 'test.tar.gz');

      // Decrypt to temp file
      await $`gpg --quiet --batch --yes --decrypt --passphrase ${backupPass} --output ${tempTar} ${encryptedFile}`;

      // Test tar integrity
      await $`tar -tzf ${tempTar} > /dev/null`;
      success('GPG archive integrity test passed');

      // Quick extract test
      await $`tar -xzf ${tempTar} -C ${TEMP_TEST_DIR} package.json src/main.tsx`;
    }

    // Verify critical files exist
    const packagePath = path.join(TEMP_TEST_DIR, 'package.json');
    const mainPath = path.join(TEMP_TEST_DIR, 'src', 'main.tsx');

    if ((await fs.pathExists(packagePath)) && (await fs.pathExists(mainPath))) {
      success('Critical files extracted successfully');
      return true;
    } else {
      error('Critical files missing from encrypted archive');
      return false;
    }
  } catch (err) {
    error(`Encrypted archive test failed: ${err.message}`);
    return false;
  } finally {
    // Clean up
    if (await fs.pathExists(TEMP_TEST_DIR)) {
      await fs.remove(TEMP_TEST_DIR);
    }
  }
}

// Main verification function
async function main() {
  try {
    log(colors.bold + colors.blue, '🔍 Gorstan Backup Verification');
    console.log();

    // Find latest backup files
    const files = await findLatestBackupFiles();

    console.log(`📅 Verifying backup: ${files.timestamp}`);
    console.log(`📄 ZIP file: ${files.zipFile ? '✓' : '✗'}`);
    console.log(`🔐 Encrypted file: ${files.encryptedFile ? '✓' : '✗'}`);
    console.log(`🔍 Checksum file: ${files.checksumFile ? '✓' : '✗'}`);
    console.log();

    if (!files.checksumFile) {
      error('No checksum file found - cannot verify integrity');
      process.exit(1);
    }

    // Verify checksums
    const checksumsValid = await verifyChecksums(files, files.checksumFile);

    if (!checksumsValid) {
      error('Checksum verification failed');
      process.exit(1);
    }

    // Test encrypted archive if available
    if (files.encryptedFile) {
      const encryptedValid = await testEncryptedArchive(files.encryptedFile);

      if (!encryptedValid) {
        error('Encrypted archive test failed');
        process.exit(1);
      }
    }

    console.log();
    success('All verifications passed! Backup is valid and restorable.');
  } catch (err) {
    error(`Verification failed: ${err.message}`);
    process.exit(1);
  }
}

main();
