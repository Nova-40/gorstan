
// commandParser.js — v2.8.2
// Updated to handle /defuse trap command

export const parseCommand = (command, state, dispatch) => {
  const input = command.trim().toLowerCase();

  if (input === "/defuse") {
    import("./trapSystem").then(module => {
      module.defuseTrap(state.room, dispatch);
    });
    return;
  }

  dispatch({ type: "LOG", payload: `Unrecognized command: {command}` });
};
