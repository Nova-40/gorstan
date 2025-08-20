# Convert Jest to Vitest across all test files
param(
    [string]$Path = "src"
)

Write-Host "Converting Jest to Vitest in all test files..."

# Get all test files
$testFiles = Get-ChildItem -Path $Path -Recurse -Include "*.test.ts", "*.test.tsx", "*.spec.ts", "*.spec.tsx"

foreach ($file in $testFiles) {
    Write-Host "Processing: $($file.FullName)"
    
    # Read file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Skip if file is empty
    if ([string]::IsNullOrWhiteSpace($content)) {
        continue
    }
    
    # Perform Jest to Vitest conversions
    $content = $content -replace 'jest\.fn\(\)', 'vi.fn()'
    $content = $content -replace 'jest\.mock\(', 'vi.mock('
    $content = $content -replace 'jest\.spyOn\(', 'vi.spyOn('
    $content = $content -replace 'jest\.useFakeTimers\(\)', 'vi.useFakeTimers()'
    $content = $content -replace 'jest\.useRealTimers\(\)', 'vi.useRealTimers()'
    $content = $content -replace 'jest\.advanceTimersByTime\(', 'vi.advanceTimersByTime('
    $content = $content -replace 'jest\.clearAllTimers\(\)', 'vi.clearAllTimers()'
    $content = $content -replace 'jest\.clearAllMocks\(\)', 'vi.clearAllMocks()'
    $content = $content -replace 'jest\.restoreAllMocks\(\)', 'vi.restoreAllMocks()'
    $content = $content -replace 'jest\.resetAllMocks\(\)', 'vi.resetAllMocks()'
    
    # Fix Jest.Mock type references
    $content = $content -replace ': jest\.Mock', ': Mock'
    $content = $content -replace '<jest\.Mock>', '<Mock>'
    
    # Add vi import if jest.* functions were found and replaced
    if ($content -match 'vi\.') {
        # Check if vi is already imported
        if ($content -notmatch "import.*vi.*from.*vitest") {
            # Find existing vitest import and add vi
            if ($content -match "import\s*\{([^}]*)\}\s*from\s*['""]vitest['""]") {
                $existingImports = $matches[1]
                if ($existingImports -notmatch '\bvi\b') {
                    $newImports = $existingImports.Trim() + ', vi'
                    $content = $content -replace "import\s*\{[^}]*\}\s*from\s*['""]vitest['""]", "import { $newImports } from 'vitest'"
                }
            } else {
                # Add new vitest import with vi
                $content = "import { vi } from 'vitest';`n" + $content
            }
        }
    }
    
    # Add Mock type import if needed
    if ($content -match ': Mock') {
        if ($content -notmatch "import.*Mock.*from.*vitest") {
            if ($content -match "import\s*\{([^}]*)\}\s*from\s*['""]vitest['""]") {
                $existingImports = $matches[1]
                if ($existingImports -notmatch '\bMock\b') {
                    $newImports = $existingImports.Trim() + ', Mock'
                    $content = $content -replace "import\s*\{[^}]*\}\s*from\s*['""]vitest['""]", "import { $newImports } from 'vitest'"
                }
            }
        }
    }
    
    # Write updated content back to file
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Conversion completed!"
