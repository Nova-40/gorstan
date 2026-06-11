#!/usr/bin/env node
/**
 * Local Encrypted Backup Script for Gorstan
 * Creates secure, checksummed backups with AES-256 encryption
 */

import { $, fs, path, os } from 'zx';
import { createHash, randomUUID } from 'crypto';
import { execSync } from 'child_process';

// Configuration
const BACKUP_DIR = 'backups';
const STAGING_DIR = '.backup-staging';
const CONFIG_FILE = 'backup/include.exclude.json';
const SBOM_FILE = 'sbom.json';

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

// Generate timestamp for backup
function getTimestamp() {
  return new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
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
    // Special case for 7z on Windows - check common installation path
    if (command === '7z') {
      try {
        execSync('"C:\\Program Files\\7-Zip\\7z.exe" -h', { stdio: 'ignore' });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

// Load backup configuration
async function loadConfig() {
  try {
    const configData = await fs.readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(configData);
  } catch (err) {
    error(`Failed to load configuration from ${CONFIG_FILE}: ${err.message}`);
    process.exit(1);
  }
}

// Ensure SBOM is generated
async function ensureSBOM() {
  info('Ensuring SBOM is generated...');

  if (!(await fs.pathExists(SBOM_FILE))) {
    info('Generating SBOM...');
    try {
      await $`npm run sbom`;
      success('SBOM generated successfully');
    } catch (err) {
      warn(`SBOM generation failed: ${err.message}`);
      warn('Creating minimal SBOM as fallback...');

      // Create a minimal SBOM as fallback
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf-8'));
      const minimalSBOM = {
        bomFormat: 'CycloneDX',
        specVersion: '1.6',
        serialNumber: `urn:uuid:${randomUUID()}`,
        version: 1,
        metadata: {
          timestamp: new Date().toISOString(),
          tools: [
            {
              vendor: 'Gorstan Backup System',
              name: 'backup-local.mjs',
              version: '1.0.0',
            },
          ],
          component: {
            type: 'application',
            'bom-ref': `${packageJson.name}@${packageJson.version}`,
            name: packageJson.name,
            version: packageJson.version,
            description: packageJson.description,
          },
        },
        components: [],
      };

      await fs.writeFile(SBOM_FILE, JSON.stringify(minimalSBOM, null, 2));
      success('Minimal SBOM created as fallback');
    }
  } else {
    success('SBOM already exists');
  }
}

// Create staging directory with filtered files
async function createStaging(config) {
  info('Creating staging directory...');

  // Clean staging directory
  if (await fs.pathExists(STAGING_DIR)) {
    await fs.remove(STAGING_DIR);
  }
  await fs.ensureDir(STAGING_DIR);

  const { include, exclude } = config;

  // Create exclude patterns for fast-glob
  const globby = await import('globby');

  try {
    const files = await globby.globby(include, {
      ignore: exclude,
      dot: true,
      gitignore: false,
    });

    info(`Found ${files.length} files to backup`);

    // Copy files to staging
    for (const file of files) {
      const destPath = path.join(STAGING_DIR, file);
      await fs.ensureDir(path.dirname(destPath));
      await fs.copy(file, destPath);
    }

    success(`Staged ${files.length} files`);
    return files.length;
  } catch (err) {
    error(`Failed to stage files: ${err.message}`);
    process.exit(1);
  }
}

// Create zip archive
async function createZipArchive(timestamp) {
  const zipFile = path.join(BACKUP_DIR, `gorstan-${timestamp}-src.zip`);

  info('Creating ZIP archive...');

  try {
    // Use 7-Zip if available, otherwise Node's built-in
    if (commandExists('7z')) {
      const sevenZipPath = '"C:\\Program Files\\7-Zip\\7z.exe"';
      execSync(`${sevenZipPath} a -tzip "${zipFile}" "${STAGING_DIR}\\*"`, { stdio: 'inherit' });
    } else {
      // Fallback to Node archiver
      const archiver = await import('archiver');
      const archive = archiver.default('zip', { zlib: { level: 9 } });

      const output = fs.createWriteStream(zipFile);

      return new Promise((resolve, reject) => {
        output.on('close', () => {
          success(`ZIP archive created: ${zipFile}`);
          resolve(zipFile);
        });

        archive.on('error', reject);
        archive.pipe(output);
        archive.directory(STAGING_DIR, false);
        archive.finalize();
      });
    }

    success(`ZIP archive created: ${zipFile}`);
    return zipFile;
  } catch (err) {
    error(`Failed to create ZIP archive: ${err.message}`);
    process.exit(1);
  }
}

// Create encrypted archive
async function createEncryptedArchive(timestamp) {
  const backupPass = process.env.BACKUP_PASS;

  if (!backupPass) {
    warn('BACKUP_PASS environment variable not set - skipping encrypted backup');
    return null;
  }

  let encryptedFile = null;

  // Try 7-Zip first (AES-256)
  if (commandExists('7z')) {
    encryptedFile = path.join(BACKUP_DIR, `gorstan-${timestamp}-src.7z`);
    info('Creating encrypted 7z archive...');

    try {
      const sevenZipPath = '"C:\\Program Files\\7-Zip\\7z.exe"';
      execSync(
        `${sevenZipPath} a -t7z -p"${backupPass}" -mhe=on -mx=9 "${encryptedFile}" "${STAGING_DIR}\\*"`,
        { stdio: 'inherit' },
      );
      success(`Encrypted 7z archive created: ${encryptedFile}`);
    } catch (err) {
      error(`Failed to create 7z archive: ${err.message}`);
      return null;
    }
  }
  // Try GPG fallback
  else if (commandExists('gpg')) {
    const tarFile = path.join(BACKUP_DIR, `gorstan-${timestamp}-src.tar.gz`);
    encryptedFile = `${tarFile}.gpg`;

    info('Creating encrypted GPG archive...');

    try {
      // Create tar.gz first
      await $`tar -czf ${tarFile} -C ${STAGING_DIR} .`;

      // Encrypt with GPG
      await $`gpg --symmetric --cipher-algo AES256 --compress-algo 1 --s2k-mode 3 --s2k-digest-algo SHA512 --s2k-count 65536 --force-mdc --quiet --batch --passphrase ${backupPass} --output ${encryptedFile} ${tarFile}`;

      // Remove unencrypted tar
      await fs.remove(tarFile);

      success(`Encrypted GPG archive created: ${encryptedFile}`);
    } catch (err) {
      error(`Failed to create GPG archive: ${err.message}`);
      return null;
    }
  } else {
    warn('Neither 7z nor gpg found - skipping encrypted backup');
  }

  return encryptedFile;
}

// Generate checksums
async function generateChecksums(files) {
  const checksumFile = path.join(BACKUP_DIR, 'SHA256SUMS.txt');
  const checksums = [];

  info('Generating SHA256 checksums...');

  for (const file of files) {
    if (file && (await fs.pathExists(file))) {
      const hash = await calculateFileHash(file);
      const basename = path.basename(file);
      checksums.push(`${hash}  ${basename}`);
      info(`${basename}: ${hash}`);
    }
  }

  await fs.writeFile(checksumFile, checksums.join('\n') + '\n');
  success(`Checksums written to: ${checksumFile}`);

  return checksumFile;
}

// Main backup function
async function main() {
  try {
    log(colors.bold + colors.blue, '🔒 Gorstan Secure Backup Tool');
    console.log();

    // Ensure backup directory exists
    await fs.ensureDir(BACKUP_DIR);

    // Load configuration
    const config = await loadConfig();

    // Ensure SBOM exists
    await ensureSBOM();

    // Create staging area
    const fileCount = await createStaging(config);

    // Generate timestamp
    const timestamp = getTimestamp();

    // Create archives
    const zipFile = await createZipArchive(timestamp);
    const encryptedFile = await createEncryptedArchive(timestamp);

    // Generate checksums
    const files = [zipFile, encryptedFile].filter(Boolean);
    const checksumFile = await generateChecksums(files);

    // Clean up staging
    await fs.remove(STAGING_DIR);

    // Summary
    console.log();
    log(colors.bold + colors.green, '📦 Backup Summary');
    console.log(`📅 Timestamp: ${timestamp}`);
    console.log(`📁 Files backed up: ${fileCount}`);
    console.log(`📄 ZIP archive: ${path.basename(zipFile)}`);
    if (encryptedFile) {
      console.log(`🔐 Encrypted archive: ${path.basename(encryptedFile)}`);
    }
    console.log(`🔍 Checksums: ${path.basename(checksumFile)}`);
    console.log();
    success('Backup completed successfully!');
  } catch (err) {
    error(`Backup failed: ${err.message}`);
    process.exit(1);
  }
}

// Handle CTRL+C gracefully
process.on('SIGINT', async () => {
  warn('Backup interrupted by user');
  if (await fs.pathExists(STAGING_DIR)) {
    await fs.remove(STAGING_DIR);
  }
  process.exit(1);
});

main();
