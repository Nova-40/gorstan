// MIT License © 2025 Geoff Webster
// Gorstan v2.5
import React, { useState } from "react";
import PropTypes from "prop-types";
/**
 * AylaButton Component
 * This component provides a text input and button interface for the player to ask Ayla for help or advice.
 * It handles user input, validates queries, and triggers the provided callback function with the query.
 *
 * Props:
 * - onAsk: A callback function triggered when the player submits a query.
 */
export default function AylaButton({ onAsk }) {
  const [query, setQuery] = useState(""); // Tracks the current query input
  const [error, setError] = useState(null); // Tracks any errors during query submission
  /**
   * Handles the submission of the query.
   */
  const handleAsk = () => {
    try {
      if (!query.trim()) {
        throw new Error("Query cannot be empty. Please ask something meaningful.");
      }
      onAsk(query.trim()); // Trigger the callback with the trimmed query
      setQuery(""); // Clear the input field after submission
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("❌ Error submitting query to Ayla:", err);
      setError(err.message); // Display the error message to the user
    }
  };
  return (
    <div className="border border-green-700 p-2 rounded shadow-md bg-gray-900">
      {/* Title */}
      <div className="text-white text-md font-semibold mb-1 font-sans">Ask Ayla</div>
      {/* Input and Button */}
      <div className="flex gap-2">
        <input
          className="bg-gray-800 text-green-400 p-1 flex-grow rounded focus:outline-none focus:ring focus:ring-green-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Update the query state on input change
          onKeyDown={(e) => e.key === "Enter" && handleAsk()} // Submit the query on Enter key press
          placeholder="Ask about something..."
        />
<button
  className="bg-green-700 hover:bg-green-600 text-white px-2 py-1 text-sm rounded transition whitespace-nowrap"
  onClick={handleAsk}
>
  Ask
</button>
      </div>
      {/* Error Message */}
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
}
// PropTypes for type-checking
AylaButton.propTypes = {
  onAsk: PropTypes.func.isRequired, // Callback function triggered when the player submits a query
};
