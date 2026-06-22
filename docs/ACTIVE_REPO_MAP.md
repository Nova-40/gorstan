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
