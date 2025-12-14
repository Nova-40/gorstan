Mini-games subsystem

This folder contains small standalone mini-quests that can be launched from rooms or the Debug Menu.

Core files:
- core/*: types, registry, overlay, helpers
- atomweaver/*: example mini-quest (ASCII fusion puzzle)

Guidelines:
- Mini-quests are overlays and must return a MiniQuestResult via onComplete.
- They must implement onCancel which should call onComplete with outcome 'abort' or call the provided onCancel.
- Keep mini-quests self-contained; avoid mutating global game state directly (use reward/progress services).
