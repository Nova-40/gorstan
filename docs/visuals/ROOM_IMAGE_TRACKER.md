# Gorstan Room Image Tracker

Generated from:

- `public/images/*.png`
- `~/Documents/Development/new-images/*.png`
- Known current visual-room status

## Status meanings

| Status | Meaning |
|---|---|
| `implemented_visual_room` | Fully done or part of current implemented visual-room path. |
| `next_recommended_visual_room` | Image exists and this is the recommended next room to wire. |
| `image_available_work_todo` | Image exists in `public/images`, but implementation still needs metadata/hotspots/tests. |
| `new_image_batch_pending_or_copied` | Image exists in `new-images`, but needs copy/normalisation check. |
| `generated_but_not_mapped` | PNG exists in `public/images`, but has not yet been matched to a canonical room/status. |
| `still_to_generate` | Possible room found in source/data, but no matching PNG exists yet. |
| `still_to_generate_or_missing_source` | Expected image from the new batch map was not found. |

## Summary

| Status | Count |
|---|---:|
| `generated_but_not_mapped` | 83 |
| `image_available_work_todo` | 23 |
| `implemented_visual_room` | 2 |
| `next_recommended_visual_room` | 1 |
| `still_to_generate` | 102 |

## Full list

| Status | Room / label | Canon image | In public/images | In new batch | Notes |
|---|---|---|---|---|---|
| `implemented_visual_room` | Findlater's Café | `londonzone_findlaters.png` | yes | no | PR #13 merged Café visual hotspot slice |
| `implemented_visual_room` | Dale's Apartment | `londonzone_dalesapartment.png` | yes | no | Current Dale visual-scene-system work |
| `next_recommended_visual_room` | Control Nexus | `introzone_controlnexus.png` | yes | no | Recommended third room after Café + Dale playtest |
| `image_available_work_todo` | Elfhame East Woods | `elfhame_eastwoods.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Elfhame Hub | `elfhame_hub.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Elfhame Palace | `elfhame_palace.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Elfhame Woods | `elfhame_woods.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Elhame Lake | `elhame_lake.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Glitch Hub | `glitch_hub.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Gorstan Carron | `gorstan_carron.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Gorstan Carron Spire | `gorstan_carronspire.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Gorstan Hub | `gorstan_hub.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Gorstan Torridon | `gorstan_torridon.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Gorstan Torridon Inn | `gorstan_torridon_inn.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Gorstan Torridon Ruined | `gorstan_torridon_ruined.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Control Room | `introzone_controlroom.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Intro Reset | `introzone_introreset.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Lattice Hub | `lattice_hub.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | St Katharine's Dock | `londonzone_stkatherinesdock.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Trent Park | `londonzone_trentpark.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Maze Hub | `maze_hub.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Aevira Warehouse | `newyork_aevirawarehouse.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Burger Joint | `newyork_burger_joint.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Central Park | `newyork_centralpark.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | Greasy Store Room | `newyork_greasystoreroom.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `image_available_work_todo` | New York Hub | `newyork_hub.png` | yes | yes | Image exists in public/images; visualScene/hotspots/tests still to do |
| `generated_but_not_mapped` | Albie | `Albie.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | Al | `Al.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | artifactChamber | `artifactChamber.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | Ayla | `Ayla.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | Barista | `Barista.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | Caution | `Caution.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | Chef | `Chef.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | Dominic | `Dominic.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | elfhameZone elfhame | `elfhameZone_elfhame.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | elfhameZone faeglade | `elfhameZone_faeglade.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | elfhameZone faelakenorthshore | `elfhameZone_faelakenorthshore.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | elfhameZone faelake | `elfhameZone_faelake.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | elfhameZone faepalacedungeon | `elfhameZone_faepalacedungeon.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | elfhameZone faepalace | `elfhameZone_faepalace.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | elfhameZone lucidveil | `elfhameZone_lucidveil.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | elfhameZone rhianonschamber | `elfhameZone_rhianonschamber.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | fallback | `fallback.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | genericZone surrealPlaceholder | `genericZone_surrealPlaceholder.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | glitchrealm datavoid | `glitchrealm_datavoid.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | glitchrealm glitchexit | `glitchrealm_glitchexit.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | glitchrealm glitchrealmhub | `glitchrealm_glitchrealmhub.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | glitchrealm-zoneravenroom | `glitchrealm-zoneravenroom.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | glitchZone glitchinguniverse | `glitchZone_glitchinguniverse.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | glitchZone issuesdetected | `glitchZone_issuesdetected.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | glitchZone moreissues | `glitchZone_moreissues.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | gorstanicon | `gorstanicon.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | gorstanZone carronspire | `gorstanZone_carronspire.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | gorstanZone exit | `gorstanZone_exit.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | gorstanZone gorstanhub | `gorstanZone_gorstanhub.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | gorstanZone gorstanvillage | `gorstanZone_gorstanvillage.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | gorstanZone spare | `gorstanZone_spare.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | gorstanZone torridonbefore | `gorstanZone_torridonbefore.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | gorstanZone torridoninn | `gorstanZone_torridoninn.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | gorstanZone torridon | `gorstanZone_torridon.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | introZone crossing | `introZone_crossing.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | introZone hiddenlab | `introZone_hiddenlab.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | introZone introreset | `introZone_introreset.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | introZone introstreet1 | `introZone_introstreet1.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | introZone resetroom | `introZone_resetroom.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | latticehub | `latticehub.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | latticeZone hiddenlibrary | `latticeZone_hiddenlibrary.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | latticeZone hub | `latticeZone_hub.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | latticeZone latticelibrary | `latticeZone_latticelibrary.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | latticeZone lattice | `latticeZone_lattice.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | latticeZone libraryofnine | `latticeZone_libraryofnine.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | latticeZone primeconfluence | `latticeZone_primeconfluence.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | Librarian | `Librarian.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | liminalhub | `liminalhub.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | londonZone cafeoffice | `londonZone_cafeoffice.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | londonZone londonhub | `londonZone_londonhub.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | londonZone stkatherinesdock | `londonZone_stkatherinesdock.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | londonZone trentpark | `londonZone_trentpark.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | mazeZone exit | `mazeZone_exit.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | mazeZone forgottenchamber | `mazeZone_forgottenchamber.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | mazeZone introstreetclear | `mazeZone_introstreetclear.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | mazeZone mazehub | `mazeZone_mazehub.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | mazeZone mirrorhall | `mazeZone_mirrorhall.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | mazeZone misleadchamber | `mazeZone_misleadchamber.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | mazeZone pollysbay | `mazeZone_pollysbay.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | mazeZone room | `mazeZone_room.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | mazeZone secretmazeentry | `mazeZone_secretmazeentry.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | mazeZone secrettunnel | `mazeZone_secrettunnel.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | mazeZone storagechamber | `mazeZone_storagechamber.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | Morthos | `Morthos.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | MrWendell | `MrWendell.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | newyorkZone aevirawarehouse | `newyorkZone_aevirawarehouse.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | newyorkZone burgerjoint | `newyorkZone_burgerjoint.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | newyorkZone centralpark | `newyorkZone_centralpark.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | newyorkZone manhattanhub | `newyorkZone_manhattanhub.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | newyorkZone storeroom | `newyorkZone_storeroom.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | offgorstanZone ancientvault | `offgorstanZone_ancientvault.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | offgorstanZone exit | `offgorstanZone_exit.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | offgorstanZone multiversehub | `offgorstanZone_multiversehub.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | offmultiverseZone controlnexusreturned | `offmultiverseZone_controlnexusreturned.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | offmultiverseZone observationroom | `offmultiverseZone_observationroom.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | Polly2 | `Polly2.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | Polly | `Polly.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | stantonharcourtZone silentstanton | `stantonharcourtZone_silentstanton.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | stantonharcourtZone stantonharcourt | `stantonharcourtZone_stantonharcourt.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | stantonZone ascendantStanton | `stantonZone_ascendantStanton.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | stantonZone glitchStanton | `stantonZone_glitchStanton.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | stantonZone villagegreen | `stantonZone_villagegreen.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `generated_but_not_mapped` | starterframe | `starterframe.png` | yes | no | PNG exists in public/images but is not yet mapped in this tracker; confirm canonical room/status |
| `still_to_generate` | ambient-sparkles | `ambient-sparkles.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | ancientsroom | `ancientsroom.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | anothermazeroom | `anothermazeroom.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | cafeoffice | `cafeoffice.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | cafe-office-exit | `cafe-office-exit.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | centralpark | `centralpark.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | controlnexus | `controlnexus.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | controlroom | `controlroom.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | daily_rooms | `daily_rooms.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | dalesapartment | `dalesapartment.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | dales-apartment-exit | `dales-apartment-exit.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | elfhame | `elfhame.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | faelake | `faelake.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | faelakenorthshore | `faelakenorthshore.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | faepalacedungeon | `faepalacedungeon.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | faepalacedungeons | `faepalacedungeons.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | faepalacemainhall | `faepalacemainhall.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | faepalacerhianonsroom | `faepalacerhianonsroom.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | first_room_exploration | `first_room_exploration.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | glitch_entity_encounter | `glitch_entity_encounter.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | glitch_escape_sequence | `glitch_escape_sequence.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | glitch_guardian_boss | `glitch_guardian_boss.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | glitchinguniverse | `glitchinguniverse.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | glitch_lattice | `glitch_lattice.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | glitch_navigation_challenge | `glitch_navigation_challenge.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | glitch_preparation | `glitch_preparation.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | glitch_reality_puzzle_1 | `glitch_reality_puzzle_1.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | glitch_reality_puzzle_2 | `glitch_reality_puzzle_2.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | glitch_realm_entry | `glitch_realm_entry.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | glitch_security_system | `glitch_security_system.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | glitchStanton | `glitchStanton.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | glitch_vault_infiltration | `glitch_vault_infiltration.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | gorstan-cafe-vertical-slice | `gorstan-cafe-vertical-slice.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | gorstanhub | `gorstanhub.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | gorstan_libraries | `gorstan_libraries.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | gorstanvillage | `gorstanvillage.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | greasystoreroom | `greasystoreroom.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | hub-1 | `hub-1.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | hub2 | `hub2.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | hub_hopper | `hub_hopper.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | hub-status | `hub-status.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | intro-controlroom | `intro-controlroom.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | intro_jump | `intro_jump.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | introreset | `introreset.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | introstart | `introstart.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | lattice | `lattice.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | latticelibrary | `latticelibrary.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | latticeobservationentrance | `latticeobservationentrance.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | latticeobservatory | `latticeobservatory.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | lattice_offverse | `lattice_offverse.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | latticespire | `latticespire.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | londonhub | `londonhub.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | manhattanhub | `manhattanhub.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | maze-1 | `maze-1.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | maze-2 | `maze-2.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | mazeecho | `mazeecho.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | maze_echo_navigation | `maze_echo_navigation.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | mazehub | `mazehub.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | maze_lattice | `maze_lattice.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | mazeroom | `mazeroom.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | mazestorage | `mazestorage.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | newyorkhub | `newyorkhub.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | nexus_core_puzzle | `nexus_core_puzzle.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | nexus_countermeasures | `nexus_countermeasures.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | nexus_extraction | `nexus_extraction.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | nexus_final_confrontation | `nexus_final_confrontation.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | nexus_guardian_combat | `nexus_guardian_combat.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | nexus_insertion | `nexus_insertion.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | nexus_security_bypass | `nexus_security_bypass.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | nexus_shutdown_sequence | `nexus_shutdown_sequence.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | nexus_stabilizer | `nexus_stabilizer.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | nexus_stabilizer_awakening_1 | `nexus_stabilizer_awakening_1.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | nexus_stabilizer_origin_1 | `nexus_stabilizer_origin_1.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | nexus_stealth_infiltration | `nexus_stealth_infiltration.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | offverse_gorstan | `offverse_gorstan.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | room1 | `room1.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | room2 | `room2.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | secretmazeentry | `secretmazeentry.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | short10_trialsofgorstan | `short10_trialsofgorstan.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | short30_controlnexusgauntlet | `short30_controlnexusgauntlet.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | short30_glitchrealmheist | `short30_glitchrealmheist.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | short30_trentparkrecon | `short30_trentparkrecon.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | spike_pit_maze | `spike_pit_maze.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | stillamazeroom | `stillamazeroom.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | stkatherinesdock | `stkatherinesdock.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | test-room | `test-room.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | trentpark | `trentpark.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | trentpark_artifact_search | `trentpark_artifact_search.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | trentpark_boss_encounter | `trentpark_boss_encounter.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | trentpark_briefing | `trentpark_briefing.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | trentpark_complex_puzzle | `trentpark_complex_puzzle.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | trent-park-exit | `trent-park-exit.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | trentpark_extraction | `trentpark_extraction.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | trentpark_initial_recon | `trentpark_initial_recon.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | trentpark_intel_compilation | `trentpark_intel_compilation.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | trentpark_logic_deduction | `trentpark_logic_deduction.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | trentpark_shadow_patrol | `trentpark_shadow_patrol.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | trentpark_witness_interview | `trentpark_witness_interview.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | trials_cavemaze | `trials_cavemaze.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | trials_mushroomfield | `trials_mushroomfield.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | trials-of-gorstan | `trials-of-gorstan.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
| `still_to_generate` | tutorial_introduction | `tutorial_introduction.png` | no | no | Possible canonical room id found in source/data but no matching PNG in public/images |
