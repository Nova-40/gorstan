#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$HOME/Documents/Development/Gorstan"
DOWNLOADS="$HOME/Downloads"
DEST="$REPO_DIR/public/images"
STAGE="$REPO_DIR/.tmp_batch1_images"

cd "$REPO_DIR"

echo "== Gorstan Batch 1 image installer =="
echo "Repo:      $REPO_DIR"
echo "Downloads: $DOWNLOADS"
echo "Dest:      $DEST"
echo

mkdir -p "$DEST"
rm -rf "$STAGE"
mkdir -p "$STAGE"

echo "== Candidate files in Downloads =="
find "$DOWNLOADS" -maxdepth 1 -type f \
  \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.webp" \) \
  | grep -Ei 'dale|apartment|control|nexus|findlater|coffee|cafe|gorstan|download|image' \
  | sort || true

echo
echo "Enter the exact source filename for each image."
echo "You can paste just the filename if it is directly in ~/Downloads."
echo

read -r -p "Dale apartment image file: " DALE_SRC
read -r -p "Control room image file: " CONTROLROOM_SRC
read -r -p "Control nexus image file: " CONTROLNEXUS_SRC
read -r -p "Findlater coffee shop image file: " FINDLATERS_SRC

resolve_src() {
  local src="$1"
  if [[ "$src" = /* ]]; then
    echo "$src"
  else
    echo "$DOWNLOADS/$src"
  fi
}

copy_as_png() {
  local src="$1"
  local dest="$2"

  if [[ ! -f "$src" ]]; then
    echo "ERROR: source file not found: $src"
    exit 1
  fi

  case "${src,,}" in
    *.png)
      cp "$src" "$dest"
      ;;
    *.jpg|*.jpeg|*.webp)
      if command -v magick >/dev/null 2>&1; then
        magick "$src" "$dest"
      elif command -v convert >/dev/null 2>&1; then
        convert "$src" "$dest"
      else
        echo "ERROR: $src is not PNG and ImageMagick is not installed."
        echo "Install it or export the image as PNG first."
        exit 1
      fi
      ;;
    *)
      echo "ERROR: unsupported image format: $src"
      exit 1
      ;;
  esac
}

DALE_SRC="$(resolve_src "$DALE_SRC")"
CONTROLROOM_SRC="$(resolve_src "$CONTROLROOM_SRC")"
CONTROLNEXUS_SRC="$(resolve_src "$CONTROLNEXUS_SRC")"
FINDLATERS_SRC="$(resolve_src "$FINDLATERS_SRC")"

echo
echo "== Staging renamed lowercase upgraded images =="

copy_as_png "$DALE_SRC"        "$STAGE/londonzone_dalesapartment.png"
copy_as_png "$CONTROLROOM_SRC" "$STAGE/introzone_controlroom.png"
copy_as_png "$CONTROLNEXUS_SRC" "$STAGE/introzone_controlnexus.png"
copy_as_png "$FINDLATERS_SRC"  "$STAGE/londonzone_findlaters.png"

ls -lh "$STAGE"

echo
echo "== Removing old Batch 1 images from public/images =="
rm -f \
  "$DEST/londonZone_dalesapartment.png" \
  "$DEST/introZone_controlroom.png" \
  "$DEST/introZone_controlnexus.gif" \
  "$DEST/introZone_controlnexus.png" \
  "$DEST/londonZone_findlaters.png"

echo
echo "== Installing upgraded lowercase images =="
mv "$STAGE/londonzone_dalesapartment.png" "$DEST/londonzone_dalesapartment.png"
mv "$STAGE/introzone_controlroom.png" "$DEST/introzone_controlroom.png"
mv "$STAGE/introzone_controlnexus.png" "$DEST/introzone_controlnexus.png"
mv "$STAGE/londonzone_findlaters.png" "$DEST/londonzone_findlaters.png"

rmdir "$STAGE"

echo
echo "== Updating room image references to lowercase upgraded names =="

python3 <<'PY'
from pathlib import Path

updates = {
    "src/rooms/londonZone_dalesapartment.ts": (
        "image: 'londonZone_dalesapartment.png'",
        "image: 'londonzone_dalesapartment.png'",
    ),
    "src/rooms/introZone_controlroom.ts": (
        "image: 'introZone_controlroom.png'",
        "image: 'introzone_controlroom.png'",
    ),
    "src/rooms/introZone_controlnexus.ts": (
        "image: 'introZone_controlnexus.gif'",
        "image: 'introzone_controlnexus.png'",
    ),
    "src/rooms/londonZone_findlaterscornercoffeeshop.ts": (
        "image: 'londonZone_findlaters.png'",
        "image: 'londonzone_findlaters.png'",
    ),
}

for file, (old, new) in updates.items():
    p = Path(file)
    text = p.read_text()

    if old in text:
        p.write_text(text.replace(old, new))
        print(f"UPDATED: {file}: {old} -> {new}")
    elif new in text:
        print(f"OK already updated: {file}: {new}")
    else:
        print(f"WARNING: neither old nor new image reference found in {file}")
PY

echo
echo "== Final installed images =="
ls -lh "$DEST" | grep -Ei 'dales|controlroom|controlnexus|findlater' || true

echo
echo "== Remaining references to old image names =="
grep -RniE "londonZone_dalesapartment\.png|introZone_controlroom\.png|introZone_controlnexus\.gif|londonZone_findlaters\.png" src docs public || true

echo
echo "== References to new image names =="
grep -RniE "londonzone_dalesapartment\.png|introzone_controlroom\.png|introzone_controlnexus\.png|londonzone_findlaters\.png" src docs public || true

echo
echo "== Git status =="
git status --short

echo
echo "Done. Next run:"
echo "  npm run build"
echo
echo "Then commit only the room files and public/images changes."
