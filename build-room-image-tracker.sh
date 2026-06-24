#!/usr/bin/env bash
set -euo pipefail

REPO="$HOME/Documents/Development/Gorstan"
PUBLIC_IMAGES="$REPO/public/images"
NEW_IMAGES="$HOME/Documents/Development/new-images"
OUT_DIR="$REPO/docs/visuals"
OUT_CSV="$OUT_DIR/ROOM_IMAGE_TRACKER.csv"
OUT_MD="$OUT_DIR/ROOM_IMAGE_TRACKER.md"

mkdir -p "$OUT_DIR"

if [ ! -d "$REPO/.git" ]; then
  echo "ERROR: Gorstan repo not found at $REPO"
  exit 1
fi

if [ ! -d "$PUBLIC_IMAGES" ]; then
  echo "ERROR: public/images not found at $PUBLIC_IMAGES"
  exit 1
fi

# Rooms/images that are already implemented or part of the current visual-room path.
# Keep this list conservative. Image existence is not the same as implementation.
implemented_visual_rooms=(
  "londonzone_findlaters.png|Findlater's Café|implemented_visual_room|PR #13 merged Café visual hotspot slice"
  "londonzone_dalesapartment.png|Dale's Apartment|implemented_visual_room|Current Dale visual-scene-system work"
)

current_next_candidates=(
  "introzone_controlnexus.png|Control Nexus|next_recommended_visual_room|Recommended third room after Café + Dale playtest"
)

# Revised/new image batch received in ~/Documents/Development/new-images.
# Left side is source filename in new-images.
# Right side is canonical destination filename expected in public/images.
new_batch_map=(
  "elfhame_eastwoods.png|elfhame_eastwoods.png|Elfhame East Woods"
  "elfhame_hub.png|elfhame_hub.png|Elfhame Hub"
  "elfhame_palace.png|elfhame_palace.png|Elfhame Palace"
  "elfhame_woods.png|elfhame_woods.png|Elfhame Woods"
  "elhame_lake.png|elhame_lake.png|Elhame Lake"
  "glitch_hub.png|glitch_hub.png|Glitch Hub"
  "gorstan_carron.png|gorstan_carron.png|Gorstan Carron"
  "gorstan_carronspire.png|gorstan_carronspire.png|Gorstan Carron Spire"
  "gorstan_hub.png|gorstan_hub.png|Gorstan Hub"
  "gorstan_torridon.png|gorstan_torridon.png|Gorstan Torridon"
  "gorstan_torridon_inn.png|gorstan_torridon_inn.png|Gorstan Torridon Inn"
  "gorstan_torridon_ruined.png|gorstan_torridon_ruined.png|Gorstan Torridon Ruined"
  "intro_controlnexus.png|introzone_controlnexus.png|Control Nexus"
  "intro_controlroom.png|introzone_controlroom.png|Control Room"
  "intro_introreset.png|introzone_introreset.png|Intro Reset"
  "lattice_hub.png|lattice_hub.png|Lattice Hub"
  "london_dalesapartment.png|londonzone_dalesapartment.png|Dale's Apartment"
  "london_findlaterscafe.png|londonzone_findlaters.png|Findlater's Café"
  "london_stkatherinesdock.png|londonzone_stkatherinesdock.png|St Katharine's Dock"
  "london_trentpark.png|londonzone_trentpark.png|Trent Park"
  "maze_hub.png|maze_hub.png|Maze Hub"
  "newyork_aevirawarehouse.png|newyork_aevirawarehouse.png|Aevira Warehouse"
  "newyork_burger_joint.png|newyork_burger_joint.png|Burger Joint"
  "newyork_centralpark.png|newyork_centralpark.png|Central Park"
  "newyork_greasystoreroom.png|newyork_greasystoreroom.png|Greasy Store Room"
  "newyork_hub.png|newyork_hub.png|New York Hub"
)

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

public_list="$tmp_dir/public_images.txt"
new_list="$tmp_dir/new_images.txt"
known_list="$tmp_dir/known_images.txt"
csv_tmp="$tmp_dir/tracker.csv"

find "$PUBLIC_IMAGES" -maxdepth 1 -type f -iname "*.png" -printf "%f\n" | sort > "$public_list"

if [ -d "$NEW_IMAGES" ]; then
  find "$NEW_IMAGES" -maxdepth 1 -type f -iname "*.png" -printf "%f\n" | sort > "$new_list"
else
  : > "$new_list"
fi

printf "room_label,canonical_image,source_new_image,image_in_public_images,image_in_new_batch,status,notes\n" > "$csv_tmp"
: > "$known_list"

add_row() {
  local label="$1"
  local canonical="$2"
  local source_new="$3"
  local status="$4"
  local notes="$5"

  local in_public="no"
  local in_new="no"

  if grep -Fxq "$canonical" "$public_list"; then
    in_public="yes"
  fi

  if [ -n "$source_new" ] && grep -Fxq "$source_new" "$new_list"; then
    in_new="yes"
  fi

  printf "%s\n" "$canonical" >> "$known_list"

  printf '"%s","%s","%s","%s","%s","%s","%s"\n' \
    "$label" "$canonical" "$source_new" "$in_public" "$in_new" "$status" "$notes" >> "$csv_tmp"
}

for row in "${implemented_visual_rooms[@]}"; do
  IFS='|' read -r canonical label status notes <<< "$row"
  add_row "$label" "$canonical" "" "$status" "$notes"
done

for row in "${current_next_candidates[@]}"; do
  IFS='|' read -r canonical label status notes <<< "$row"
  add_row "$label" "$canonical" "" "$status" "$notes"
done

for row in "${new_batch_map[@]}"; do
  IFS='|' read -r source_new canonical label <<< "$row"

  # Avoid downgrading already implemented/current candidate rows.
  if grep -Fxq "$canonical" "$known_list"; then
    continue
  fi

  if grep -Fxq "$canonical" "$public_list"; then
    status="image_available_work_todo"
    notes="Image exists in public/images; visualScene/hotspots/tests still to do"
  elif grep -Fxq "$source_new" "$new_list"; then
    status="new_image_batch_pending_or_copied"
    notes="Image found in new-images; copy/normalise into public/images if not already done"
  else
    status="still_to_generate_or_missing_source"
    notes="Not found in public/images or new-images"
  fi

  add_row "$label" "$canonical" "$source_new" "$status" "$notes"
done

# Add every other PNG already in public/images so the full 70-odd image inventory is visible.
while IFS= read -r img; do
  [ -z "$img" ] && continue

  if grep -Fxq "$img" "$known_list"; then
    continue
  fi

  label="${img%.png}"
  label="${label//_/ }"

  add_row "$label" "$img" "" "generated_but_not_mapped" \
    "PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status"

done < "$public_list"

# Optional: infer possible canonical game rooms from data/source files and identify missing images.
# This is deliberately conservative and may need manual cleanup.
possible_rooms="$tmp_dir/possible_rooms.txt"
grep -RhoE "id: ['\"][a-zA-Z0-9_/-]+['\"]|roomId: ['\"][a-zA-Z0-9_/-]+['\"]" \
  "$REPO/src" "$REPO/data" 2>/dev/null \
  | sed -E "s/.*['\"]([^'\"]+)['\"].*/\1/" \
  | sort -u > "$possible_rooms" || true

while IFS= read -r room_id; do
  [ -z "$room_id" ] && continue

  candidate="${room_id}.png"

  if grep -Fxq "$candidate" "$public_list"; then
    continue
  fi

  # Do not spam the tracker with obvious non-room ids if the grep found command ids or internal ids.
  if [[ "$room_id" =~ ^(north|south|east|west|up|down|inventory|parser|command|save|load)$ ]]; then
    continue
  fi

  # Only add likely room ids with zone-ish prefixes or known naming patterns.
  if [[ "$room_id" =~ (intro|london|elfhame|elhame|gorstan|newyork|maze|lattice|glitch|hub|room|apartment|cafe|dock|park|woods|palace|lake|nexus|control) ]]; then
    add_row "$room_id" "$candidate" "" "still_to_generate" \
      "Possible canonical room id found in source/data but no matching PNG in public/images"
  fi

done < "$possible_rooms"

mv "$csv_tmp" "$OUT_CSV"

# Build Markdown summary.
{
  echo "# Gorstan Room Image Tracker"
  echo
  echo "Generated from:"
  echo
  echo "- \`public/images/*.png\`"
  echo "- \`~/Documents/Development/new-images/*.png\`"
  echo "- Known current visual-room status"
  echo
  echo "## Status meanings"
  echo
  echo "| Status | Meaning |"
  echo "|---|---|"
  echo "| \`implemented_visual_room\` | Fully done or part of current implemented visual-room path. |"
  echo "| \`next_recommended_visual_room\` | Image exists and this is the recommended next room to wire. |"
  echo "| \`image_available_work_todo\` | Image exists in \`public/images\`, but implementation still needs metadata/hotspots/tests. |"
  echo "| \`new_image_batch_pending_or_copied\` | Image exists in \`new-images\`, but needs copy/normalisation check. |"
  echo "| \`generated_but_not_mapped\` | PNG exists in \`public/images\`, but has not yet been matched to a canonical room/status. |"
  echo "| \`still_to_generate\` | Possible room found in source/data, but no matching PNG exists yet. |"
  echo "| \`still_to_generate_or_missing_source\` | Expected image from the new batch map was not found. |"
  echo
  echo "## Summary"
  echo
  echo "| Status | Count |"
  echo "|---|---:|"
  tail -n +2 "$OUT_CSV" | awk -F',' '{gsub(/"/, "", $6); count[$6]++} END {for (s in count) print "| `" s "` | " count[s] " |"}' | sort
  echo
  echo "## Full list"
  echo
  echo "| Status | Room / label | Canon image | In public/images | In new batch | Notes |"
  echo "|---|---|---|---|---|---|"
  tail -n +2 "$OUT_CSV" | while IFS=',' read -r label canon source in_public in_new status notes; do
    label="${label%\"}"; label="${label#\"}"
    canon="${canon%\"}"; canon="${canon#\"}"
    in_public="${in_public%\"}"; in_public="${in_public#\"}"
    in_new="${in_new%\"}"; in_new="${in_new#\"}"
    status="${status%\"}"; status="${status#\"}"
    notes="${notes%\"}"; notes="${notes#\"}"
    echo "| \`$status\` | $label | \`$canon\` | $in_public | $in_new | $notes |"
  done
} > "$OUT_MD"

echo "Wrote:"
echo "  $OUT_CSV"
echo "  $OUT_MD"
echo
echo "Summary:"
tail -n +2 "$OUT_CSV" | awk -F',' '{gsub(/"/, "", $6); count[$6]++} END {for (s in count) print count[s], s}' | sort -nr
echo
echo "Preview:"
sed -n '1,80p' "$OUT_MD"
