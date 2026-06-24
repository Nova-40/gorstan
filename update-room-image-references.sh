#!/usr/bin/env bash
set -euo pipefail

REPO="$HOME/Documents/Development/Gorstan"

# old|new
MAP=$(cat <<'MAPEOF'
elfhameZone_elfhame.png|elfhame_hub.png
elfhameZone_faeglade.png|elfhame_woods.png
elfhameZone_faelakenorthshore.png|elhame_lake.png
elfhameZone_faelake.png|elhame_lake.png
elfhameZone_faepalace.png|elfhame_palace.png
glitchrealm_glitchrealmhub.png|glitch_hub.png
glitchZone_glitchinguniverse.png|glitch_hub.png
gorstanZone_carronspire.png|gorstan_carronspire.png
gorstanZone_gorstanhub.png|gorstan_hub.png
gorstanZone_torridon.png|gorstan_torridon.png
gorstanZone_torridonbefore.png|gorstan_torridon_ruined.png
gorstanZone_torridoninn.png|gorstan_torridon_inn.png
introZone_introreset.png|introzone_introreset.png
introZone_resetroom.png|introzone_introreset.png
latticehub.png|lattice_hub.png
latticeZone_hub.png|lattice_hub.png
londonZone_stkatherinesdock.png|londonzone_stkatherinesdock.png
londonZone_trentpark.png|londonzone_trentpark.png
mazeZone_mazehub.png|maze_hub.png
MAPEOF
)

echo "Updating live source/docs image references..."
echo

while IFS='|' read -r old new; do
  [ -z "${old:-}" ] && continue

  echo "$old -> $new"

  grep -RIl \
    --exclude-dir=.git \
    --exclude-dir=node_modules \
    --exclude-dir=dist \
    --exclude-dir=.restore-test \
    --exclude-dir=_archive \
    "$old" \
    "$REPO/src" "$REPO/docs" 2>/dev/null \
    | while read -r file; do
        sed -i "s|$old|$new|g" "$file"
        echo "  updated $file"
      done

done <<< "$MAP"

echo
echo "Remaining live references to old filenames:"
while IFS='|' read -r old new; do
  [ -z "${old:-}" ] && continue

  refs="$(grep -RIn \
    --exclude-dir=.git \
    --exclude-dir=node_modules \
    --exclude-dir=dist \
    --exclude-dir=.restore-test \
    --exclude-dir=_archive \
    "$old" \
    "$REPO/src" "$REPO/docs" 2>/dev/null || true)"

  if [ -n "$refs" ]; then
    echo
    echo "$old"
    echo "$refs"
  fi
done <<< "$MAP"

echo
echo "Git status:"
git status --short src docs
