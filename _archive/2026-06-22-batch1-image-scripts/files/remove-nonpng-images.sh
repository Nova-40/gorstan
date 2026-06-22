#!/usr/bin/env bash
set -euo pipefail

echo "== Removing .gif/.jpg/.jpeg files from public/images =="

mapfile -t files < <(find public/images -type f \( -iname "*.gif" -o -iname "*.jpg" -o -iname "*.jpeg" \) | sort)

if [[ ${#files[@]} -eq 0 ]]; then
  echo "No .gif/.jpg/.jpeg files found in public/images."
  exit 0
fi

printf '%s\n' "${files[@]}"

echo
echo "== Checking whether any are still referenced in src/docs/public =="
for f in "${files[@]}"; do
  base="$(basename "$f")"
  if grep -Rni --exclude-dir=node_modules --exclude-dir=dist "$base" src docs public >/tmp/gorstan-image-ref-check.txt 2>/dev/null; then
    echo
    echo "WARNING: $base is still referenced:"
    cat /tmp/gorstan-image-ref-check.txt
    echo
    echo "Stop and update references before deleting."
    exit 1
  fi
done

echo
echo "No references found. Removing files..."

for f in "${files[@]}"; do
  if git ls-files --error-unmatch "$f" >/dev/null 2>&1; then
    git rm "$f"
  else
    rm -f "$f"
  fi
done

echo
echo "Done."
git status --short
