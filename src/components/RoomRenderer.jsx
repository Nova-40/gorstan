
import React, { useEffect, useState } from "react";

const RoomRenderer = ({ room, state, dispatch }) => {
  const [visited, setVisited] = useState({});

  useEffect(() => {
    if (!visited[room.id]) {
      setVisited((prev) => ({ ...prev, [room.id]: true }));
    }
  }, [room.id, visited]);

  const isDebug = state?.flags?.debug;

  const getRoomDescription = () => {
    if (visited[room.id] && room.altDescription) {
      return room.altDescription;
    }
    return room.description;
  };

  const getVisibleExits = () => {
    if (!room.exits) return {};
    if (isDebug || state.flags?.showAllExits) return room.exits;

    const visibleExits = {};
    for (const [dir, destination] of Object.entries(room.exits)) {
      if (!room.hiddenExits || !room.hiddenExits.includes(dir)) {
        visibleExits[dir] = destination;
      }
    }
    return visibleExits;
  };

  return (
    <div className="border-2 border-green-500 p-4 mb-4 transition-opacity duration-700 ease-in-out">
      <h2 className="text-2xl mb-2">{room.name}</h2>
      <p className="mb-4 whitespace-pre-line">{getRoomDescription()}</p>

      {room.image && (
        <img
          src={`/images/${room.image}`}
          alt={`${room.name}`}
          className="w-full h-auto rounded-lg shadow-md mb-4 transition-opacity duration-1000 ease-in-out"
        />
      )}

      <div className="text-sm text-green-300">
        <strong>Exits:</strong>{" "}
        {Object.entries(getVisibleExits()).map(([dir], index) => (
          <span key={index} className="mr-2">
            {dir}
          </span>
        ))}
      </div>

      {isDebug && (
        <div className="text-yellow-300 mt-2 text-xs">
          <strong>[Debug Info]</strong>: Room ID = {room.id}, Items = {room.items?.join(", ") || "None"}
        </div>
      )}
    </div>
  );
};

export default RoomRenderer;
