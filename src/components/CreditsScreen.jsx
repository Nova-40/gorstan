// Gorstan v2.2.2 – All modules validated and standardized
// CreditsScreen.jsx
// Version 2.1.2
// Endgame credits for Gorstan with flicker effects, background motion, and player details
// MIT License (c) 2025 Geoff Webster
import { useEffect } from "react";
import PropTypes from "prop-types";
import "./CreditsScreen.css";
/**
 * CreditsScreen Component
 * Displays endgame credits, player score, and links.
 * Auto-returns after 30 seconds or on button click.
 * All props are validated and errors are reported.
 */
export default function CreditsScreen({ playerName = "Adventurer", score = 0, onReturn }) {
  // Defensive: Validate props
  if (typeof playerName !== "string" || playerName.trim() === "") {
    console.error("❌ CreditsScreen: Invalid playerName prop. Defaulting to 'Adventurer'.");
    playerName = "Adventurer";
  }
  if (typeof score !== "number" || isNaN(score)) {
    console.error("❌ CreditsScreen: Invalid score prop. Defaulting to 0.");
    score = 0;
  }
  if (typeof onReturn !== "function") {
    console.error("❌ CreditsScreen: onReturn prop is not a function. The reset button will not work.");
  }
  // Auto-return after 30 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        if (typeof onReturn === "function") onReturn();
      } catch (err) {
        console.error("❌ CreditsScreen: Error in auto-return timeout.", err);
      }
    }, 30000);
    return () => clearTimeout(timeout);
  }, [onReturn]);
  return (
    <div className="credits-bg fixed inset-0 text-green-400 font-mono px-6 py-12 overflow-y-auto z-50">
      <div className="max-w-3xl mx-auto space-y-6 text-center">
        <h1 className="text-4xl font-bold text-yellow-400 flicker">🌌 The Gorstan Chronicles</h1>
        <p className="italic text-lg">"You made it, {playerName}. Not everyone does."</p>
        <p className="text-sm text-green-300">Final score: {score}</p>
        <div className="mt-8 space-y-4 text-left">
          <p><strong>Game Design &amp; Lore:</strong> Geoff Webster</p>
          <p><strong>Lead NPCs:</strong> Ayla, Polly, Dale, The Archivist</p>
          <p><strong>Special Thanks:</strong> Emily, Karen, The Council of Stanton Harcourt</p>
          <p><strong>Secret Contributor:</strong> Geoff (in god mode)</p>
          <p><strong>Bug Reports:</strong> The brave few who typed 'throw coffee' and hoped</p>
        </div>
        <div className="mt-10 space-y-2 text-sm text-green-300">
          <p>If you enjoyed your journey,</p>
          <p>
            💚 <a href="https://www.buymeacoffee.com/gorstan" target="_blank" rel="noopener noreferrer" className="underline">Buy me a Gorstan coffee</a>
            &nbsp;|&nbsp;
            📚 <a href="https://your-book-link.com" target="_blank" rel="noopener noreferrer" className="underline">Read the books</a>
          </p>
        </div>
        <div className="mt-12">
          <button
            onClick={() => {
              try {
                if (typeof onReturn === "function") onReturn();
                else alert("Unable to reset the multiverse. See console for details.");
              } catch (err) {
                console.error("❌ CreditsScreen: Error on reset button.", err);
              }
            }}
            className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
          >
            Reset the Multiverse
          </button>
        </div>
      </div>
    </div>
  );
}
// PropTypes for type checking and documentation
CreditsScreen.propTypes = {
  playerName: PropTypes.string,
  score: PropTypes.number,
  onReturn: PropTypes.func,
};
