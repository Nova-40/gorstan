
import React, { useState } from "react";

const moodLevels = [
  "How can I help?",
  "Again? Okay...",
  "Really?",
  "You do know I lie sometimes, right?",
  "Maybe try thinking for once."
];

const AylaButton = ({ onAsk }) => {
  const [askCount, setAskCount] = useState(0);
  const [response, setResponse] = useState("");

  const handleAsk = () => {
    const newCount = askCount + 1;
    setAskCount(newCount);

    const moodIndex = Math.min(moodLevels.length - 1, newCount - 1);
    const moodMessage = moodLevels[moodIndex];

    setResponse(moodMessage);

    if (typeof onAsk === "function") {
      onAsk(); // Trigger contextual help if wired
    }

    setTimeout(() => setResponse(""), 4000); // Hide message after 4s
  };

  return (
    <div className="text-center">
      <button
        onClick={handleAsk}
        className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-shadow duration-200 shadow-md hover:shadow-green-400"
        aria-label="Ask Ayla"
      >
        Ask Ayla
      </button>
      {response && (
        <div className="mt-2 text-green-300 italic text-sm animate-pulse">
          {response}
        </div>
      )}
    </div>
  );
};

export default AylaButton;
