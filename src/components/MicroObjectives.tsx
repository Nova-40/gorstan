import React, { useEffect, useState } from 'react';
import { useGameState, CompleteMicroObjectivePayload } from '../state/gameState';
import { showNotification } from './QuickWinNotifications';
import { playSound } from '../utils/soundUtils';

interface ObjectiveState {
  id: string;
  text: string;
  completed: boolean;
}

const MicroObjectives: React.FC = () => {
  const { state, dispatch } = useGameState();
  const room = state.roomMap?.[state.currentRoomId];

  // persisted list of completed objective ids for the current room
  const completedForRoom: string[] = (state.microObjectiveState && state.microObjectiveState[state.currentRoomId]) || [];

  const objectives: ObjectiveState[] = (room?.microObjectives || []).map((o: any) => ({
    id: o.id,
    text: o.text,
    completed: completedForRoom.includes(o.id),
  }));

  useEffect(() => {
    const handleGlobal = (ev: Event) => {
      const custom = ev as CustomEvent;
      const detail = (custom && custom.detail) || {};
      // handle item_collected and flag_set events
      if (detail.type === 'item_collected' || detail.type === 'flag_set') {
        (room?.microObjectives || []).forEach((roomObj: any) => {
          if (!roomObj || !roomObj.trigger) return;
          const alreadyCompleted = completedForRoom.includes(roomObj.id);
          if (roomObj.trigger.type === 'item_collected' && detail.item === roomObj.trigger.target) {
            if (!alreadyCompleted) {
              // persist completion
              dispatch({ type: 'COMPLETE_MICROOBJECTIVE', payload: { roomId: state.currentRoomId, objectiveId: roomObj.id } as CompleteMicroObjectivePayload });
              // UI feedback
              showNotification({ type: 'item_collected', title: 'Objective Complete', description: roomObj.text, duration: 3000 });
              playSound('success');
            }
          }
          if (roomObj.trigger.type === 'flag_set' && detail.flag === roomObj.trigger.target) {
            if (!alreadyCompleted) {
              dispatch({ type: 'COMPLETE_MICROOBJECTIVE', payload: { roomId: state.currentRoomId, objectiveId: roomObj.id } as CompleteMicroObjectivePayload });
              showNotification({ type: 'achievement', title: 'Objective Complete', description: roomObj.text, duration: 3000 });
              playSound('success');
            }
          }
        });
      }
    };

  window.addEventListener('gorstan-notification', handleGlobal as EventListener);
  // Also listen for game events dispatched via CustomEvent 'game-event'
  window.addEventListener('game-event', handleGlobal as EventListener);

    return () => {
  window.removeEventListener('gorstan-notification', handleGlobal as EventListener);
  window.removeEventListener('game-event', handleGlobal as EventListener);
    };
  }, [state.currentRoomId, room]);

  if (!objectives || objectives.length === 0) return null;

  return (
    <div className="micro-objectives fixed left-4 bottom-4 z-40 bg-black/70 border border-green-700 p-3 rounded-md max-w-xs">
      <h4 className="text-sm font-semibold text-green-300">Objectives</h4>
      <ul className="mt-2 space-y-1 text-xs text-gray-300">
        {objectives.map((o) => (
          <li key={o.id} className={`flex items-center gap-2 ${o.completed ? 'opacity-50 line-through' : ''}`}>
            <span className={`w-3 h-3 rounded-full ${o.completed ? 'bg-green-400' : 'bg-gray-700'}`} />
            <span>{o.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MicroObjectives;
