// Gorstan v2.4.0 – All modules validated and standardized
// NewsPopUp.jsx
// Glitchy multiversal broadcast popup for Gorstan
// MIT License © 2025 Geoff Webster

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Uses modern React patterns (function component, hooks).
     - Efficient and readable; no unused variables.
     - Naming is clear and consistent.
     - Defensive error handling for engineRef and event listeners.
  3. 💬 COMMENTS & DOCUMENTATION
     - Module and function-level comments included.
     - MIT license and version header included.
     - PropTypes for all props.
  4. 🤝 INTEGRATION CHECK
     - Can be used anywhere in the app; listens for 'showNewsPopup' event.
     - Integrates with engineRef or window.engineRef for navigation.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could extract error logging to a utility if used elsewhere.
     - Could add unit tests for popup visibility and engine integration.
     - Could accept a `message` or `newsItems` prop for reuse.
*/

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./NewsPopUp.css";

/**
 * NewsPopUp component displays a modal news flash overlay.
 * Listens for a custom 'showNewsPopup' event on window to trigger visibility.
 * Integrates with the Gorstan game engine via engineRef or window.engineRef.
 *
 * @param {Object} props
 * @param {Object} [props.engineRef] - Optional React ref to the game engine instance.
 */
export default function NewsPopUp({ engineRef }) {
  const [visible, setVisible] = useState(false);

  // Show popup when 'showNewsPopup' event is dispatched
  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener("showNewsPopup", handler);
    return () => window.removeEventListener("showNewsPopup", handler);
  }, []);

  // Get engine instance from prop or global, with error trapping
  const getEngine = () => {
    try {
      if (engineRef?.current) return engineRef.current;
      if (window.engineRef?.current) return window.engineRef.current;
    } catch (err) {
      console.error("❌ NewsPopUp: Error accessing engineRef:", err);
    }
    return null;
  };

  // Handler to return to the office room, with error reporting
  const returnToOffice = () => {
    try {
      const engine = getEngine();
      if (engine?.enterRoom) {
        console.log("🔁 NewsPopUp: Returning to 'office'");
        engine.enterRoom("office");
      } else {
        throw new Error("Game engine not available to enter 'office'");
      }
    } catch (err) {
      alert("Unable to return to the office. See console for details.");
      console.error("❌ NewsPopUp: Error in returnToOffice:", err);
    }
    setVisible(false);
  };

  // Handler to close the popup
  const closePopup = () => setVisible(false);

  if (!visible) return null;

  return (
    <div className="glitch-container">
      <div className="glitch-panel" role="dialog" aria-modal="true" aria-label="Multiversal Newsflash">
        <h2 className="glitch-text">📡 MULTIVERSAL NEWSFLASH</h2>
        <p>
          <strong>BREAKING:</strong> Gorstan Books and Game Declared “Multiversal Treasure” by Secret Council of Critics.
        </p>
        <p>
          Emerging from obscurity, the Gorstan universe — created by Geoff Webster — has reportedly broken the fourth wall, rewritten it, and then offered it coffee.
        </p>
        <ul className="list-disc pl-5">
          <li>“I named myself Geoff and unlocked god mode. Now I see everything.” – Definitely Not The Author</li>
          <li>“The coffee isn’t real, but the emotional damage is.” – Casual Player</li>
          <li>“The Reset Room haunts my dreams.” – One of Many Pollys</li>
        </ul>
        <p className="text-sm italic text-center">
          For more, visit{" "}
          <a
            className="underline text-blue-600"
            href="https://www.buymeacoffee.com/gorstan"
            target="_blank"
            rel="noopener noreferrer"
          >
            buymeacoffee.com/gorstan
          </a>
        </p>
        <div className="mt-4 space-y-2">
          <button
            className="w-full bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
            onClick={returnToOffice}
            type="button"
          >
            Enter Office
          </button>
          <button
            className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={closePopup}
            type="button"
          >
            Close Transmission
          </button>
        </div>
      </div>
    </div>
  );
}

// Allow engineRef to be optionally passed for testability or integration
NewsPopUp.propTypes = {
  engineRef: PropTypes.shape({
    current: PropTypes.object,
  }),
};

NewsPopUp.defaultProps = {
  engineRef: null,
};
