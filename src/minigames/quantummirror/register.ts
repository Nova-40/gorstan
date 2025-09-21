import { registerMini } from "../core/MiniQuestRegistry";
import QuantumMirrorGame from "./QuantumMirrorGame";
import { MiniQuestSpec } from "../core/MiniQuestTypes";

const spec: MiniQuestSpec = {
  id: 'quantumMirror' as any,
  displayName: 'Quantum Mirror',
  mount: QuantumMirrorGame as any,
  defaultRoomBindings: ['glitchinguniverse'],
  weight: 1,
  tags: ['puzzle','quantum'] as any,
  difficulty: 'normal',
};

registerMini(spec as any);
export default spec;
