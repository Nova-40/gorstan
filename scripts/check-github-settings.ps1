# GitHub Repository Settings Verification Script
# Run this script to check various repository settings and configurations

Write-Host "🔍 GitHub Repository Settings Review - Nova-40/gorstan-game" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (!(Test-Path ".git")) {
    Write-Host "❌ Error: Not in a git repository directory" -ForegroundColor Red
    exit 1
}

Write-Host "`n📍 Repository Information:" -ForegroundColor Yellow

# Get repository URL
$repoUrl = git config --get remote.origin.url
Write-Host "Repository URL: $repoUrl" -ForegroundColor Green

# Get current branch
$currentBranch = git branch --show-current
Write-Host "Current Branch: $currentBranch" -ForegroundColor Green

# Get default branch
$defaultBranch = git symbolic-ref refs/remotes/origin/HEAD 2>$null
if ($defaultBranch) {
    $defaultBranch = $defaultBranch -replace "refs/remotes/origin/", ""
    Write-Host "Default Branch: $defaultBranch" -ForegroundColor Green
} else {
    Write-Host "Default Branch: main (assumed)" -ForegroundColor Yellow
}

Write-Host "`n🌿 Branch Analysis:" -ForegroundColor Yellow

# List all branches
Write-Host "Local Branches:" -ForegroundColor White
git branch | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }

Write-Host "`nRemote Branches:" -ForegroundColor White
git branch -r | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }

Write-Host "`n📊 Repository Status:" -ForegroundColor Yellow

# Check if repo is up to date
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️  Uncommitted changes detected:" -ForegroundColor Yellow
    $status | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
} else {
    Write-Host "✅ Working directory clean" -ForegroundColor Green
}

# Check if we're ahead/behind origin
$gitStatus = git status -b --porcelain=v1 2>$null
if ($gitStatus -match "ahead|behind") {
    Write-Host "⚠️  Branch is ahead/behind origin" -ForegroundColor Yellow
} else {
    Write-Host "✅ Branch is up to date with origin" -ForegroundColor Green
}

Write-Host "`n🔐 Security Check:" -ForegroundColor Yellow

# Check for potential secrets in recent commits
Write-Host "Checking recent commits for potential secrets..." -ForegroundColor White
$secretPatterns = @("password", "token", "key", "secret", "api_key", "private")
$recentCommits = git log --oneline -10 --all

$foundSecrets = $false
foreach ($pattern in $secretPatterns) {
    $matches = $recentCommits | Select-String -Pattern $pattern -SimpleMatch
    if ($matches) {
        Write-Host "⚠️  Potential secret found in commit messages: $pattern" -ForegroundColor Yellow
        $foundSecrets = $true
    }
}

if (-not $foundSecrets) {
    Write-Host "✅ No obvious secrets found in recent commit messages" -ForegroundColor Green
}

Write-Host "`n📁 File Security Check:" -ForegroundColor Yellow

# Check for common secret files
$secretFiles = @(".env", ".env.local", ".env.production", "config.json", "secrets.json")
$foundSecretFiles = @()

foreach ($file in $secretFiles) {
    if (Test-Path $file) {
        $foundSecretFiles += $file
    }
}

if ($foundSecretFiles.Count -gt 0) {
    Write-Host "⚠️  Found potential secret files:" -ForegroundColor Yellow
    $foundSecretFiles | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
    Write-Host "  Make sure these are in .gitignore" -ForegroundColor Gray
} else {
    Write-Host "✅ No obvious secret files found" -ForegroundColor Green
}

# Check .gitignore
if (Test-Path ".gitignore") {
    Write-Host "✅ .gitignore file exists" -ForegroundColor Green
    $gitignoreContent = Get-Content ".gitignore" -Raw
    $importantPatterns = @("node_modules", ".env", "*.log", "dist", "build")
    $missingPatterns = @()
    
    foreach ($pattern in $importantPatterns) {
        if ($gitignoreContent -notmatch [regex]::Escape($pattern)) {
            $missingPatterns += $pattern
        }
    }
    
    if ($missingPatterns.Count -gt 0) {
        Write-Host "⚠️  Consider adding to .gitignore:" -ForegroundColor Yellow
        $missingPatterns | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
    } else {
        Write-Host "✅ .gitignore contains common patterns" -ForegroundColor Green
    }
} else {
    Write-Host "❌ .gitignore file missing" -ForegroundColor Red
}

Write-Host "`n🚀 Deployment Configuration:" -ForegroundColor Yellow

# Check for deployment files
$deploymentFiles = @(".github/workflows/deploy.yml", "netlify.toml", "vercel.json", "package.json")
$foundDeploymentFiles = @()

foreach ($file in $deploymentFiles) {
    if (Test-Path $file) {
        $foundDeploymentFiles += $file
    }
}

if ($foundDeploymentFiles.Count -gt 0) {
    Write-Host "✅ Found deployment configuration files:" -ForegroundColor Green
    $foundDeploymentFiles | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
} else {
    Write-Host "⚠️  No deployment configuration files found" -ForegroundColor Yellow
}

Write-Host "`n📋 Manual Verification Required:" -ForegroundColor Yellow
Write-Host "1. Repository Privacy: https://github.com/Nova-40/gorstan-game/settings" -ForegroundColor White
Write-Host "2. Security Features: https://github.com/Nova-40/gorstan-game/settings/security_analysis" -ForegroundColor White
Write-Host "3. Branch Protection: https://github.com/Nova-40/gorstan-game/settings/branches" -ForegroundColor White
Write-Host "4. Repository Secrets: https://github.com/Nova-40/gorstan-game/settings/secrets/actions" -ForegroundColor White
Write-Host "5. Collaborators: https://github.com/Nova-40/gorstan-game/settings/access" -ForegroundColor White

Write-Host "`nRepository settings review completed!" -ForegroundColor Green
Write-Host "Check GITHUB_SETTINGS_REVIEW.md for detailed recommendations." -ForegroundColor Cyan
