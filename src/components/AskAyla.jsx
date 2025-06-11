// Gorstan Game Module — v3.1.1
// MIT License © 2025 Geoff Webster
// AskAyla.jsx — Button to trigger Ayla's help/hint system

import React from 'react';
import PropTypes from 'prop-types';

/**
 * AskAyla
 * Renders a button to ask Ayla for help or a hint.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onAsk - Callback invoked when help is requested. Receives the topic string.
 * @returns {JSX.Element}
 */
const AskAyla = ({ onAsk }) => (
  <div className="my-2">
    <button
      onClick={() => onAsk("help")}
      className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded"
      type="button"
      aria-label="Ask Ayla for Help"
    >
      Ask Ayla for Help
    </button>
  </div>
);

AskAyla.propTypes = {
  /** Callback invoked when the help button is clicked. Receives the topic string (e.g., "help"). */
  onAsk: PropTypes.func.isRequired,
};

export default AskAyla;
