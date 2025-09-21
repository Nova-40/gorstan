# Deletes project test/spec files (excluding node_modules and .restore-test)
$files = Get-ChildItem -Path . -Include *.test.* , *.spec.* -File -Recurse -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\node_modules\\' -and $_.FullName -notmatch '\.restore-test' }
if ($files -and $files.Count -gt 0) {
    foreach ($f in $files) {
        Write-Host "Deleting: $($f.FullName)"
        Remove-Item -LiteralPath $f.FullName -Force -ErrorAction Stop
    }
    Write-Host 'Staging deletions and committing...'
    git add -A
    git commit -m 'chore: remove test files per user request' || Write-Host 'git commit returned non-zero or nothing to commit'
} else {
    Write-Host 'No test/spec files found to delete'
}
