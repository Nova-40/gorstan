# Gorstan Secure Backup System

This document describes the secure backup and restore system for the Gorstan text adventure game. The system provides encrypted, checksummed backups with automated verification and restore testing.

## Features

- **🔒 AES-256 Encryption**: Secure encrypted backups using 7-Zip or GPG
- **📋 SHA256 Checksums**: Integrity verification for all backup artifacts
- **🔍 Automated Verification**: Tests backup integrity and extractability
- **🔄 Restore Testing**: Validates complete project restoration and build
- **📦 SBOM Generation**: Software Bill of Materials for supply chain security
- **☁️ GitHub Releases**: Automated signed releases with cosign
- **🌐 S3 Off-site Copy**: Optional encrypted cloud storage

## Quick Start

### Prerequisites

**Required:**
- Node.js 20.x
- npm

**Optional (for encryption):**
- 7-Zip (`7z` on PATH) - Recommended for Windows
- GPG (`gpg` on PATH) - Fallback option

### Setting Up Backup Password

**PowerShell:**
```powershell
$env:BACKUP_PASS = 'YourSecureBackupPassword123!'
```

**Command Prompt:**
```cmd
set BACKUP_PASS=YourSecureBackupPassword123!
```

### One-Command Backup & Test

```powershell
# Generate SBOM, create backup, verify integrity, and test restore
npm run sbom
npm run backup:local
npm run backup:verify
npm run backup:restore-test
```

## Backup Commands

### Individual Commands

```bash
# Generate Software Bill of Materials
npm run sbom

# Create local encrypted backup
npm run backup:local

# Verify backup integrity
npm run backup:verify

# Test complete restore process
npm run backup:restore-test
```

## What Gets Backed Up

### Included Files
- Source code (`src/**`, `examples/**`, `tests/**`)
- Configuration files (`package.json`, `tsconfig*.json`, `vite.config.*`)
- Public assets (`public/**`)
- Documentation (`docs/**`, `README.md`)
- Build configurations (`tailwind.config.mjs`, `postcss.config.js`)
- Scripts (`scripts/**`)
- GitHub workflows (`.github/**`)
- SBOM (`sbom.json`)

### Excluded Files
- Dependencies (`node_modules/**`)
- Build outputs (`dist/**`)
- Git history (`.git/**`)
- **Secrets** (`.env`, `.netlify/**`, `.aws/**`)
- Temporary files (`*.log`, `*.tsbuildinfo`)
- Test artifacts (`.restore-test/**`, `backups/**`)

## Backup Artifacts

The backup process creates the following files in the `backups/` directory:

1. **`gorstan-YYYY-MM-DD-HH-MM-SS-src.zip`** - Unencrypted source archive
2. **`gorstan-YYYY-MM-DD-HH-MM-SS-src.7z`** - AES-256 encrypted archive (if 7-Zip available)
3. **`gorstan-YYYY-MM-DD-HH-MM-SS-src.tar.gz.gpg`** - GPG encrypted archive (fallback)
4. **`SHA256SUMS.txt`** - Checksums for all artifacts
5. **`sbom.json`** - Software Bill of Materials

## Security Features

### Encryption
- **7-Zip**: AES-256 encryption with header encryption (`-mhe=on`)
- **GPG**: AES-256 symmetric encryption with strong key derivation

### Integrity
- SHA-256 checksums for all artifacts
- Automated verification before restore
- Test extraction of critical files

### Secret Protection
- Environment variables for passwords (never stored in files)
- Explicit exclusion of secret directories and files
- SBOM for supply chain transparency

## Restore Process

### Manual Restore from Local Backup

1. **Set backup password:**
   ```powershell
   $env:BACKUP_PASS = 'YourBackupPassword'
   ```

2. **Extract encrypted backup:**
   ```bash
   # For 7z files
   7z x -pYourPassword gorstan-YYYY-MM-DD-HH-MM-SS-src.7z
   
   # For GPG files
   gpg --decrypt --output restored.tar.gz gorstan-YYYY-MM-DD-HH-MM-SS-src.tar.gz.gpg
   tar -xzf restored.tar.gz
   ```

3. **Restore project:**
   ```bash
   cd restored-directory
   npm ci
   npm run build
   ```

### Automated Restore Test

The restore test automatically:
- Finds the latest encrypted backup
- Extracts to a temporary directory
- Verifies critical files are present
- Runs `npm ci && npm run build`
- Reports PASS/FAIL and cleans up

## GitHub Releases (Automated)

### Triggering a Release

```powershell
# Tag and push (triggers automated backup release)
git tag -a v1.0.0 -m "Gorstan v1.0.0"
git push --follow-tags
```

### Release Artifacts

Each GitHub release includes:
- `gorstan-v1.0.0-src.zip` - Source archive
- `sbom.json` - Software Bill of Materials
- `SHA256SUMS.txt` - Checksums
- `SHA256SUMS.txt.sig` - Cosign signature (keyless)

### Verifying Release Signature

```bash
# Install cosign
# Verify signature
cosign verify-blob --certificate-identity-regexp=".*" --certificate-oidc-issuer-regexp=".*" --signature SHA256SUMS.txt.sig SHA256SUMS.txt
```

## S3 Off-site Backup (Optional)

### Setup

Configure these repository secrets:
- `AWS_BUCKET` - S3 bucket name
- `AWS_REGION` - AWS region
- `AWS_KMS_KEY_ID` - KMS key for server-side encryption

### Features
- Server-side encryption with AWS KMS
- OIDC authentication (no static credentials)
- Automated upload with GitHub releases

## Troubleshooting

### Common Issues

**"BACKUP_PASS not set"**
- Set the environment variable before running backup commands
- Unencrypted ZIP backup will still be created

**"7z command not found"**
- Install 7-Zip and ensure `7z` is in PATH
- GPG will be used as fallback if available

**"Build test failed"**
- Check that all required files are included in backup config
- Verify `package-lock.json` is included for reproducible builds

**"Critical files missing"**
- Update `backup/include.exclude.json` to include required files
- Ensure no important files are in the exclude list

### File Locations

- Backup config: `backup/include.exclude.json`
- Backup scripts: `scripts/backup-*.mjs`
- Local backups: `backups/`
- Temporary restore test: `.restore-test/`

## Security Best Practices

1. **Use strong backup passwords** (20+ characters, mixed case, numbers, symbols)
2. **Store passwords securely** (password manager, not in scripts)
3. **Verify checksums** before restoring critical backups
4. **Test restore process** regularly
5. **Keep multiple backup copies** (local + off-site)
6. **Rotate backup passwords** periodically

## Support

For issues with the backup system:
1. Check this documentation
2. Verify all prerequisites are installed
3. Test with a simple backup first
4. Check file permissions and disk space
