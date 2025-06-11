// Gorstan Game Module — v3.0.0
// MIT License © 2025 Geoff Webster
// CRTFrame.jsx — Stylized CRT monitor frame for retro UI effect

import React from "react";
import PropTypes from "prop-types";

/**
 * CRTFrame
 * Wraps children in a stylized CRT monitor frame for retro UI effect.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to display inside the CRT frame.
 * @returns {JSX.Element|null}
 */
const CRTFrame = ({ children }) => {
  // Defensive: If no children, render nothing (could show a fallback if desired)
  if (!children) return null;

  return (
    <div
      className="border-4 border-green-500 rounded-2xl p-6 shadow-[0_0_12px_#00ff00] bg-black text-green-300 font-mono max-w-3xl mx-auto mt-10"
      aria-label="CRT monitor frame"
    >
      {children}
    </div>
  );
};

CRTFrame.propTypes = {
  /** Content to display inside the CRT frame */
  children: PropTypes.node
};

export default CRTFrame;

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ JSDoc comments for component, props, and logic.
- ✅ Defensive guard for missing children.
- ✅ Accessible (aria-label).
- ✅ Tailwind classes for consistent UI.
- ✅ No dead code or unused props.
- ✅ Structure is modular and ready for integration.
*/