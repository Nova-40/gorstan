#!/usr/bin/env bash
set -euo pipefail

REPO="$HOME/Documents/Development/Gorstan"
DL="$HOME/Downloads"
IMG="$REPO/public/images"

cd "$REPO"
mkdir -p "$IMG"

echo "== Installing Batch 1 upgraded room images =="

echo "== Checking source files exist =="
for f in \
  "$DL/London_dalesapartment.png" \
  "$DL/Intro_controlroom.png" \
  "$DL/Intro_controlnexus.png" \
  "$DL/London_findlaterscafe.png"
do
  if [[ ! -f "$f" ]]; then
    echo "Missing: $f"
    exit 1
  fi
  echo "Found: $f"
done

echo
echo "== Removing old mixed-case Batch 1 images if present =="
rm -f \
  "$IMG/londonZone_dalesapartment.png" \
  "$IMG/introZone_controlroom.png" \
  "$IMG/introZone_controlnexus.gif" \
  "$IMG/introZone_controlnexus.png" \
  "$IMG/londonZone_findlaters.png"

echo
echo "== Copying new lowercase images into public/images =="
cp "$DL/London_dalesapartment.png"  "$IMG/londonzone_dalesapartment.png"
cp "$DL/Intro_controlroom.png"      "$IMG/introzone_controlroom.png"
cp "$DL/Intro_controlnexus.png"     "$IMG/introzone_controlnexus.png"
cp "$DL/London_findlaterscafe.png"  "$IMG/londonzone_findlaters.png"

echo
echo "== Updating room image references =="
python3 <<'PY'
from pathlib import Path

updates = {
    "src/rooms/londonZone_dalesapartment.ts": [
        ("image: 'londonZone_dalesapartment.png'", "image: 'londonzone_dalesapartment.png'"),
    ],
    "src/rooms/introZone_controlroom.ts": [
        ("image: 'introZone_controlroom.png'", "image: 'introzone_controlroom.png'"),
    ],
    "src/rooms/introZone_controlnexus.ts": [
        ("image: 'introZone_controlnexus.gif'", "image: 'introzone_controlnexus.png'"),
        ("image: 'introZone_controlnexus.png'", "image: 'introzone_controlnexus.png'"),
    ],
    "src/rooms/londonZone_findlaterscornercoffeeshop.ts": [
        ("image: 'londonZone_findlaters.png'", "image: 'londonzone_findlaters.png'"),
    ],
}

for file, replacements in updates.items():
    p = Path(file)
    text = p.read_text()
    original = text

    for old, new in replacements:
        text = text.replace(old, new)

    if text != original:
        p.write_text(text)
        print(f"Updated {file}")
    else:
        print(f"Already OK or no matching old value: {file}")
PY

echo
echo "== Installed Batch 1 images =="
ls -lh "$IMG" | grep -Ei 'dales|controlroom|controlnexus|findlater' || true

echo
echo "== Room image references now =="
grep -Rni "image:" \
  src/rooms/londonZone_dalesapartment.ts \
  src/rooms/introZone_controlroom.ts \
  src/rooms/introZone_controlnexus.ts \
  src/rooms/londonZone_findlaterscornercoffeeshop.ts

echo
echo "== Git status =="
git status --short

echo
echo "Done. Now run:"
echo "  npm run build"
