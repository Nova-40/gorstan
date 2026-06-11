# Restoring from GitHub Release

This guide explains how to restore the Gorstan project from a GitHub release backup.

## Download Release Artifacts

1. Go to the [Releases page](https://github.com/Nova-40/gorstan-game/releases)
2. Download the latest release artifacts:
   - `gorstan-vX.Y.Z-src.zip` - Source archive
   - `sbom.json` - Software Bill of Materials
   - `SHA256SUMS.txt` - Checksums
   - `SHA256SUMS.txt.sig` - Cosign signature

## Verify Integrity

### 1. Verify Checksums

**Linux/macOS:**
```bash
sha256sum -c SHA256SUMS.txt
```

**Windows PowerShell:**
```powershell
# Check individual files
$expectedHash = (Get-Content SHA256SUMS.txt | Select-String "gorstan-.*\.zip").ToString().Split()[0]
$actualHash = (Get-FileHash "gorstan-vX.Y.Z-src.zip" -Algorithm SHA256).Hash.ToLower()

if ($expectedHash -eq $actualHash) {
    Write-Host "✅ Checksum verification passed" -ForegroundColor Green
} else {
    Write-Host "❌ Checksum verification failed" -ForegroundColor Red
    Write-Host "Expected: $expectedHash"
    Write-Host "Actual:   $actualHash"
}
```

### 2. Verify Cosign Signature (Optional)

Install [cosign](https://docs.sigstore.dev/cosign/installation/) and verify:

```bash
cosign verify-blob \
  --certificate-identity-regexp=".*" \
  --certificate-oidc-issuer-regexp=".*" \
  --signature SHA256SUMS.txt.sig \
  SHA256SUMS.txt
```

## Restore Project

### 1. Extract Archive

**Windows:**
```powershell
Expand-Archive -Path "gorstan-vX.Y.Z-src.zip" -DestinationPath "gorstan-restored"
cd gorstan-restored
```

**Linux/macOS:**
```bash
unzip gorstan-vX.Y.Z-src.zip -d gorstan-restored
cd gorstan-restored
```

### 2. Install Dependencies

```bash
npm ci
```

### 3. Verify Restore

```bash
# TypeScript check
npm run typecheck

# Build project
npm run build

# Run tests (optional)
npm test
```

## Verification Checklist

- [ ] Archive extracts without errors
- [ ] `package.json` and `package-lock.json` present
- [ ] `src/` directory contains TypeScript source files
- [ ] `npm ci` installs dependencies successfully
- [ ] `npm run typecheck` passes without errors
- [ ] `npm run build` creates `dist/` folder
- [ ] Build artifacts include `index.html` and JavaScript bundles

## Common Issues

### "Package-lock.json not found"
- Ensure you downloaded the complete source archive
- Check that the backup includes the lock file

### "TypeScript errors during build"
- Verify all source files were extracted
- Check Node.js version matches `engines` in `package.json`

### "Missing dependencies"
- Run `npm ci` (not `npm install`) for reproducible builds
- Ensure `package-lock.json` is present

### "Build artifacts missing"
- Check that Vite configuration files were restored
- Verify `vite.config.ts` and `tsconfig.json` are present

## Security Notes

- Always verify checksums before using restored backups
- Use official release artifacts from the GitHub repository
- Keep backup passwords secure and rotate them regularly
- Consider verifying cosign signatures for additional security

## Support

If you encounter issues:
1. Check the main [README_BACKUP.md](README_BACKUP.md) documentation
2. Verify all prerequisites are installed
3. Compare with a known working local development setup
4. Open an issue with error details if restoration fails
