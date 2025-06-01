// Gorstan Game Module — v2.8.0

export function handleIntroChoice(choice, setStartGame, setStartingRoom, setScore, setInventory) {
  switch (choice) {
    case "jump":
      setStartingRoom("controlnexus");
      setScore(prev => prev + 10);
      setInventory(["coffee"]);
      break;
    case "wait":
      setStartingRoom("introreset");
      setScore(prev => prev - 10);
      setInventory([]); // coffee dropped in room
      break;
    case "sip":
      setStartingRoom("quantumlattice");
      setScore(prev => prev + 40);
      setInventory(["coffee"]);
      break;
    default:
      setStartingRoom("controlnexus");
  }
  setStartGame(true);
}