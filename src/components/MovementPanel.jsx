// File: src/components/MovementPanel.jsx
// MIT License
// © 2025 Geoff Webster – Gorstan Game Project
// Purpose: Module supporting Gorstan gameplay or UI.


// Gorstan Game (c) Geoff Webster 2025 – MIT License
// Module: MovementPanel.jsx – v2.7.1


// MovementPanel.jsx – Includes full screen toggle and small QA icons only
// MIT License © 2025 Geoff Webster

import React from "react";
import PropTypes from "prop-types";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Eye,
  ArrowBigUpDash,
  Coffee,
  Armchair,
  Expand,
  Minimize
} from "lucide-react";

export default function MovementPanel({
  currentRoom,
  onThrowCoffee,
  onSitDown,
  isFullscreen,
  toggleFullscreen
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-start items-center mt-4">
      <button title="Go North" className="bg-green-800 hover:bg-green-700 p-2 rounded">
        <ArrowUp />
      </ button>
      <button title="Go South" className="bg-green-800 hover:bg-green-700 p-2 rounded">
        <ArrowDown />
      </ button>
      <button title="Go West" className="bg-green-800 hover:bg-green-700 p-2 rounded">
        <ArrowLeft />
      </ button>
      <button title="Go East" className="bg-green-800 hover:bg-green-700 p-2 rounded">
        <ArrowRight />
      </ button>
      <button title="Look Around" className="bg-green-800 hover:bg-green-700 p-2 rounded">
        <Eye />
      </ button>
      <button title="Go Up" className="bg-green-800 hover:bg-green-700 p-2 rounded">
        <ArrowBigUpDash />
      </ button>
      <button
        title="Throw Coffee"
        className="bg-amber-800 hover:bg-amber-700 p-2 rounded border border-green-400"
        onClick={onThrowCoffee}
      >
        <Coffee />
      </ button>
      <button
        title="Sit Down"
        className="bg-blue-800 hover:bg-blue-700 p-2 rounded border border-green-400"
        onClick={onSitDown}
      >
        <Armchair />
      </ button>
      <button
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        onClick={toggleFullscreen}
        className="bg-green-800 hover:bg-green-700 p-2 rounded border border-green-400"
      >
        {isFullscreen ? <Minimize /> : <Expand />}
      </ button>
    </ div>
  );
}

MovementPanel.propTypes = {
  currentRoom: PropTypes.string,
  onThrowCoffee: PropTypes.func,
  onSitDown: PropTypes.func,
  isFullscreen: PropTypes.bool,
  toggleFullscreen: PropTypes.func
};
