# Gorstan Active Repo Map

This document records active repo structure and implementation direction.

## Visual vertical slices

### Findlater's Corner Coffee Shop / Gorstan Café

Status: first active visual vertical slice.

The Café scene is the proving slice for the hybrid parser plus visual-room direction.

Rules:

- React renders the room image, hotspot affordances, focus states, labels, and ambient presentation only.
- Hotspot clicks dispatch `COMMAND_INPUT` with the same command string a player could type.
- Parser, reducer, movement, inventory, custom action, save/load, room flags, and story consequences remain in the existing game path.
- React must not duplicate interaction logic or become a second game engine.
- Tests should prove command-path equivalence rather than pixel-perfect hotspot positioning.

## Café command-feedback proving slice

Findlater's Corner Coffee Shop / Gorstan Café is now the proving slice for player-facing command feedback.

Rules:

- Typed and clicked interactions must converge before game logic.
- Hotspot clicks dispatch `COMMAND_INPUT`; the reducer/history path echoes the same command string as typed input.
- Natural aliases for Café interactions belong in the parser and room data path, not in React.
- React presents hotspots and visual affordances only; it does not decide consequences.
- Tests should prove command equivalence and useful feedback, not pixel-perfect hotspot placement.

## Visual Scene System v1

Visual Scene System v1 is active.

Current visual slices:

- Findlater's Corner Coffee Shop / Gorstan Café: first visual slice and command-feedback proving slice.
- Dale and Polly's Apartment: second visual slice and first reuse of the visual-room pattern.

Rules:

- `RoomRenderer` is the rendering integration point.
- Rooms provide visual scene metadata and hotspot data.
- React renders presentation only: room image, hotspot affordances, focus states, labels, and optional ambient overlays.
- Hotspots dispatch `COMMAND_INPUT` with the same command strings a player can type.
- Parser, reducer, movement, inventory, room flags, save/load, and story consequences remain authoritative outside React.
- New visual rooms should add room scene data, parser/data aliases, useful feedback, and tests rather than bespoke React logic.
