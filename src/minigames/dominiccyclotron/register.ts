import { registerMini } from "../core/MiniQuestRegistry";
import DominicCyclotronGame from "./DominicCyclotronGame";
import { MiniQuestSpec } from "../core/MiniQuestTypes";

const spec: MiniQuestSpec = {
  // cast id to any to avoid needing to expand MiniQuestId union here
  id: 'dominicCyclotron' as any,
  displayName: 'Dominic · Cyclotron Swim',
  mount: DominicCyclotronGame as any,
  defaultRoomBindings: ['faeglade.lab', 'glitchrealm.hall'],
  weight: 1,
  tags: ['reflex'],
  difficulty: 'normal',
};

// register on import
registerMini(spec as any);

export default spec;
