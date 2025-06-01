
import React from "react";

const directionLabels = {
  north: "North",
  south: "South",
  east: "East",
  west: "West",
  up: "Up",
  down: "Down",
  enter: "Enter",
  exit: "Exit"
};

const MovementPanel = ({ currentRoom, dispatch }) => {
  const isDebug = currentRoom?.debug;

  const getExits = () => {
    if (!currentRoom || !currentRoom.exits) return {};
    if (isDebug || currentRoom.showAllExits) return currentRoom.exits;

    const visibleExits = {};
    for (const [dir, dest] of Object.entries(currentRoom.exits)) {
      if (!currentRoom.hiddenExits || !currentRoom.hiddenExits.includes(dir)) {
        visibleExits[dir] = dest;
      }
    }
    return visibleExits;
  };

  const handleMove = (direction) => {
    const destination = getExits()[direction];
    if (destination) {
      dispatch({ type: "MOVE", payload: { room: destination } });
    }
  };

  const exits = getExits();

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-3">
      {Object.entries(exits).map(([dir, dest]) => (
        <button
          key={dir}
          onClick={() => handleMove(dir)}
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-shadow duration-200 shadow-md hover:shadow-green-400"
          title={isDebug ? `To ${dest}` : `Go ${directionLabels[dir] || dir}`}
          aria-label={`Go ${dir}`}
        >
          {directionLabels[dir] || dir}
        </button>
      ))}
    </div>
  );
};

export default MovementPanel;
