// Gorstan Game Module — v3.1.2
// MIT License © 2025 Geoff Webster
// RoomRenderer.jsx — Renders a room and QA tools side-by-side, centred

import React from "react";
import PropTypes from "prop-types";
import CombinedActions from "./CombinedActions";

function highlightDescription(description) {
  if (typeof description !== "string") return "";
  return description.replace(
    /\b(book|button|panel|vent|desk|note|map|device|key|terminal|lever)\b/gi,
    match =>
      `<span class='text-yellow-300 font-semibold underline'>${match}</span>`
  );
}

const RoomRenderer = ({ room, state }) => {
  if (!room || typeof room !== "object" || !room.name || !room.description) {
    return (
      <div className="text-yellow-400 p-6 text-center" role="alert">
        ⚠️ No Room Data<br />
        <span className="text-sm text-green-300">Room data is missing or invalid.</span>
      </div>
    );
  }

  const { id, name, image, description, onReturnDescription } = room;
  const showReturn = onReturnDescription && state?.visitedRooms?.includes(id);
  const finalDesc = showReturn ? onReturnDescription : description;

  return (
    <div className="flex flex-row justify-center gap-8 items-start">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold text-green-400 mb-2">{name}</h1>
        {image && (
          <img
            src={`/images/${image}`}
            alt={name}
            style={{ width: '400px', border: '2px solid lime' }}
          />
        )}
        <p
          className="text-green-200 mt-4 max-w-xl"
          dangerouslySetInnerHTML={{ __html: highlightDescription(finalDesc) }}
        />
      </div>

      <CombinedActions exits={room.exits || {}} state={state} onCommand={(cmd) => {
        console.log("Quick Action Triggered:", cmd);
      }} />
    </div>
  );
};

RoomRenderer.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    description: PropTypes.string.isRequired,
    onReturnDescription: PropTypes.string
  }),
  state: PropTypes.object
};

export default RoomRenderer;

