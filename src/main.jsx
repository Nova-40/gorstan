// main.jsx — Gorstan Game Entry Point (v2.5)
// MIT License © 2025 Geoff Webster

import React from "react";
import ReactDOM from "react-dom/client";
import AppCore from "./components/core/AppCore.jsx";
import "./tailwind.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppCore />
  </React.StrictMode>
);
