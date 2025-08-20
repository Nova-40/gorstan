# Gorstan Release Tagging Script
# Creates annotated Git tags for triggering secure backup releases

param(
    [string]$Version,
    [switch]$Help
)

# Colors for output
$Green = [System.ConsoleColor]::Green
$Red = [System.ConsoleColor]::Red
$Yellow = [System.ConsoleColor]::Yellow
$Blue = [System.ConsoleColor]::Blue

function Write-ColorOutput {
    param([string]$Message, [System.ConsoleColor]$Color = [System.ConsoleColor]::White)
    Write-Host $Message -ForegroundColor $Color
}

function Show-Help {
    Write-ColorOutput "Gorstan Release Tagging Script" $Blue
    Write-ColorOutput ""
    Write-ColorOutput "Creates annotated Git tags to trigger secure backup releases" 
    Write-ColorOutput ""
    Write-ColorOutput "USAGE:"
    Write-ColorOutput "  .\scripts\tag-release.ps1 -Version v1.0.0"
    Write-ColorOutput "  .\scripts\tag-release.ps1  # Interactive mode"
    Write-ColorOutput ""
    Write-ColorOutput "OPTIONS:"
    Write-ColorOutput "  -Version   Version tag (e.g., v1.0.0, v2.1.3)"
    Write-ColorOutput "  -Help      Show this help message"
    Write-ColorOutput ""
    Write-ColorOutput "EXAMPLES:"
    Write-ColorOutput "  .\scripts\tag-release.ps1 -Version v1.0.0"
    Write-ColorOutput "  .\scripts\tag-release.ps1 -Version v2.1.3-beta"
    Write-ColorOutput ""
    Write-ColorOutput "The GitHub Actions workflow will automatically:"
    Write-ColorOutput "  • Create a secure source backup"
    Write-ColorOutput "  • Generate checksums and SBOM"
    Write-ColorOutput "  • Sign with cosign (keyless)"
    Write-ColorOutput "  • Create GitHub release with artifacts"
    Write-ColorOutput "  • Upload to S3 (if configured)"
}

function Test-GitRepository {
    try {
        $gitStatus = git status --porcelain 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput "❌ Not a Git repository or Git not available" $Red
            return $false
        }
        return $true
    } catch {
        Write-ColorOutput "❌ Git command failed: $($_.Exception.Message)" $Red
        return $false
    }
}

function Test-WorkingDirectory {
    $status = git status --porcelain
    if ($status) {
        Write-ColorOutput "⚠️  Warning: Working directory has uncommitted changes:" $Yellow
        git status --short
        Write-ColorOutput ""
        $response = Read-Host "Continue anyway? (y/N)"
        if ($response -notmatch '^[Yy]') {
            Write-ColorOutput "❌ Aborted by user" $Red
            return $false
        }
    }
    return $true
}

function Get-VersionInput {
    while ($true) {
        $version = Read-Host "Enter version (e.g., v1.0.0, v2.1.3-beta)"
        
        if ([string]::IsNullOrWhiteSpace($version)) {
            Write-ColorOutput "❌ Version cannot be empty" $Red
            continue
        }
        
        # Add 'v' prefix if not present
        if (-not $version.StartsWith('v')) {
            $version = "v$version"
        }
        
        # Basic version format validation
        if ($version -match '^v\d+\.\d+\.\d+(-[\w\.-]+)?$') {
            return $version
        } else {
            Write-ColorOutput "❌ Invalid version format. Use semantic versioning (e.g., v1.0.0)" $Red
        }
    }
}

function Test-TagExists {
    param([string]$Tag)
    
    $existingTag = git tag -l $Tag 2>$null
    if ($existingTag) {
        Write-ColorOutput "❌ Tag '$Tag' already exists" $Red
        
        # Show existing tag info
        $tagInfo = git show --no-patch --format="%ai %s" $Tag 2>$null
        if ($tagInfo) {
            Write-ColorOutput "   Existing tag: $tagInfo" $Yellow
        }
        
        $response = Read-Host "Delete existing tag and continue? (y/N)"
        if ($response -match '^[Yy]') {
            Write-ColorOutput "🗑️  Deleting existing tag..." $Yellow
            git tag -d $Tag
            
            # Delete remote tag if it exists
            git push origin --delete $Tag 2>$null
            return $true
        } else {
            return $false
        }
    }
    return $true
}

function New-ReleaseTag {
    param([string]$Version)
    
    Write-ColorOutput "🏷️  Creating annotated tag: $Version" $Blue
    
    $message = "Gorstan $Version"
    $description = @"
Gorstan $Version

This release includes:
• Complete source code backup
• Cryptographically signed artifacts
• Software Bill of Materials (SBOM)
• Automated security verification

For restore instructions, see docs/restore-from-release.md
"@
    
    try {
        # Create annotated tag
        git tag -a $Version -m $description
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "✅ Tag created successfully" $Green
            return $true
        } else {
            Write-ColorOutput "❌ Failed to create tag" $Red
            return $false
        }
    } catch {
        Write-ColorOutput "❌ Error creating tag: $($_.Exception.Message)" $Red
        return $false
    }
}

function Push-Tags {
    Write-ColorOutput "📤 Pushing tags to origin..." $Blue
    
    try {
        git push --follow-tags
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "✅ Tags pushed successfully" $Green
            Write-ColorOutput ""
            Write-ColorOutput "🚀 GitHub Actions workflow will now:" $Blue
            Write-ColorOutput "   • Create secure backup archive"
            Write-ColorOutput "   • Generate SHA256 checksums"  
            Write-ColorOutput "   • Sign with cosign (keyless)"
            Write-ColorOutput "   • Create GitHub release"
            Write-ColorOutput "   • Upload backup artifacts"
            Write-ColorOutput ""
            Write-ColorOutput "📋 Monitor progress at:" $Blue
            Write-ColorOutput "   https://github.com/Nova-40/gorstan-game/actions"
            return $true
        } else {
            Write-ColorOutput "❌ Failed to push tags" $Red
            Write-ColorOutput "💡 You may need to push manually:" $Yellow
            Write-ColorOutput "   git push --follow-tags"
            return $false
        }
    } catch {
        Write-ColorOutput "❌ Error pushing tags: $($_.Exception.Message)" $Red
        return $false
    }
}

function Main {
    Write-ColorOutput "🏷️  Gorstan Release Tagging Tool" $Blue
    Write-ColorOutput ""
    
    # Show help if requested
    if ($Help) {
        Show-Help
        return
    }
    
    # Validate Git repository
    if (-not (Test-GitRepository)) {
        exit 1
    }
    
    # Check working directory status
    if (-not (Test-WorkingDirectory)) {
        exit 1
    }
    
    # Get version from parameter or prompt
    if ([string]::IsNullOrWhiteSpace($Version)) {
        $Version = Get-VersionInput
    } else {
        # Add 'v' prefix if not present
        if (-not $Version.StartsWith('v')) {
            $Version = "v$Version"
        }
        
        # Validate format
        if ($Version -notmatch '^v\d+\.\d+\.\d+(-[\w\.-]+)?$') {
            Write-ColorOutput "❌ Invalid version format: $Version" $Red
            Write-ColorOutput "💡 Use semantic versioning (e.g., v1.0.0)" $Yellow
            exit 1
        }
    }
    
    Write-ColorOutput "📋 Release Summary:" $Blue
    Write-ColorOutput "   Version: $Version"
    Write-ColorOutput "   Repository: $(git remote get-url origin 2>$null)"
    Write-ColorOutput "   Branch: $(git branch --show-current 2>$null)"
    Write-ColorOutput ""
    
    # Confirm before proceeding
    $response = Read-Host "Create release tag? (Y/n)"
    if ($response -match '^[Nn]') {
        Write-ColorOutput "❌ Aborted by user" $Red
        exit 1
    }
    
    # Check if tag already exists
    if (-not (Test-TagExists $Version)) {
        exit 1
    }
    
    # Create the tag
    if (-not (New-ReleaseTag $Version)) {
        exit 1
    }
    
    # Push tags
    if (-not (Push-Tags)) {
        exit 1
    }
    
    Write-ColorOutput ""
    Write-ColorOutput "🎉 Release tag created successfully!" $Green
    Write-ColorOutput "   Tag: $Version"
    Write-ColorOutput "   Status: Pushed to origin"
    Write-ColorOutput "   Backup: Will be created automatically"
}

# Run main function
Main
