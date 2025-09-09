import type { LocalGameState } from '../state/gameState';

/**
 * DemoShadowState - Intercepts game state writes during demo to prevent persistence
 */
export class DemoShadowState {
  private originalDispatch: any = null;
  private overrides: Record<string, any> = {};

  attach(game: { state: LocalGameState; dispatch: (a: any) => void }) {
    if (!game?.dispatch) {
      return;
    }
    this.originalDispatch = game.dispatch;

    const self = this;
    game.dispatch = function (action: any) {
      // Intercept persistent state changes
      if (action?.type) {
        const persistentActions = [
          'ADD_TO_INVENTORY',
          'USE_ITEM',
          'USE_ITEM_WITH',
          'SET_FLAG',
          'SET_PLAYER_NAME',
        ];
        if (persistentActions.includes(action.type)) {
          self.overrides[action.type] = self.overrides[action.type] || [];
          self.overrides[action.type].push(action.payload);
          return; // Don't forward to original
        }
      }
      return self.originalDispatch(action);
    };
  }

  detach(game?: { dispatch?: (a: any) => void }) {
    if (game?.dispatch && this.originalDispatch) {
      game.dispatch = this.originalDispatch;
    }
    this.originalDispatch = null;
  }

  clear() {
    this.overrides = {};
  }

  getOverrides() {
    return this.overrides;
  }
}

export default DemoShadowState;
