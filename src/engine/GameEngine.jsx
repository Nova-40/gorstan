
import React, { useReducer, useEffect } from "react";
import RoomRenderer from "../components/RoomRenderer";
import rooms from "./rooms";
import { getIntroResult } from "./introLogic";
import { storyFlagsReducer, initialStoryState } from "./storyProgress";
import MovementPanel from "../components/MovementPanel";
import StatusPanel from "../components/StatusPanel";
import AylaButton from "../components/AylaButton";

const gameReducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        ...getIntroResult(action.payload.choice, state)
      };
    case "MOVE":
      return {
        ...state,
        room: action.payload.room,
        checkTrap: true,
      };
    case "UPDATE_INVENTORY":
      return {
        ...state,
        inventory: action.payload,
      };
    case "LOG":
      return {
        ...state,
        log: [...state.log, action.payload]
      };
    default:
      return state;
  }
};

const GameEngine = ({ introChoice }) => {
  const [state, dispatch] = useReducer(gameReducer, {
    room: "placeholder",
    inventory: [],
    traits: [],
    score: 0,
    flags: {},
    log: []
  });

  const [storyState, storyDispatch] = useReducer(storyFlagsReducer, initialStoryState);

  useEffect(() => {
    dispatch({ type: "INIT", payload: { choice: introChoice } });
  }, [introChoice]);

  const currentRoom = rooms[state.room];

  if (!currentRoom) {
    return (
      <div className="text-red-500 font-mono p-4">
        ❌ No Room Selected<br />
        Please select a valid room to continue.
      </div>
    );
  }

  useEffect(() => {
  if (state.checkTrap && currentRoom) {
    import("./trapSystem").then(module => {
      module.checkForTrap(state.room, state, dispatch);
    });
  }
}, [state.checkTrap, currentRoom]);

  return (
    <main className="min-h-screen bg-black text-green-400 font-mono p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <RoomRenderer room={currentRoom} state={state} dispatch={dispatch} />
          <MovementPanel currentRoom={currentRoom} dispatch={dispatch} />
        </div>
        <div className="lg:col-span-1 space-y-4">
          <StatusPanel state={state} />
          <AylaButton />
        </div>
      </div>
    



    </main>
  );
};

export default GameEngine;
