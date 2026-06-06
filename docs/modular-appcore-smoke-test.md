# Modular AppCore Runtime Smoke Test

The modular AppCore is now the default coordinator. The legacy AppCore remains available as a runtime fallback.

## Build checkpoint

Latest confirmed green hardening commit:

```text
c7c57cef487875479f535d8f9003c7ae6d9ef6b2
```

Vercel status: success.

## Runtime mode switch

Default mode:

```text
?appcore=modular
```

Fallback mode:

```text
?appcore=legacy
```

The selected mode is stored in local storage as:

```text
gorstan.appcore
```

If storage is unavailable or blocked, the URL parameter still works for that session.

## Smoke test sequence

Run these checks in modular mode first.

1. Open the deployed app with no `appcore` query parameter.
2. Confirm the splash/welcome flow loads.
3. Start a new adventure.
4. Enter a player name.
5. Choose a normal route.
6. Confirm the intro transition completes into the game stage.
7. Confirm the room view renders.
8. Type `look` and confirm parser output appears.
9. Use a movement command or quick action and confirm the room changes.
10. Use Look Around and confirm the modal opens and closes.
11. Open Inventory and confirm the modal layer opens and closes.
12. Press Escape and confirm the pause menu opens.
13. Close the pause menu.
14. Try `?appcore=legacy` and confirm the legacy coordinator loads.
15. Try `?appcore=modular` and confirm modular mode returns.

## Functional areas to inspect next

- Save/load modal wiring.
- Pick-up modal content wiring.
- NPC console modal content wiring.
- Trap management modal content wiring.
- Miniquest launch/result flow.
- Room transition behaviour when crossing zones.
- Backout history behaviour after multiple room moves.

## Rollback rule

If modular mode loads but a core interaction is broken, use `?appcore=legacy` immediately for player testing, then patch modular mode separately.

If modular mode fails before rendering, revert the single import in `src/App.tsx` back to:

```ts
import AppCore from './components/AppCore';
```
