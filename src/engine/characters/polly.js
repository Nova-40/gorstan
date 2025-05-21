
// Polly NPC
export const polly = {
  id: "polly",
  name: "Polly",
  location: "interrogationbay",
  mood: 0,
  dialogue: [
    {
      condition: (engine) => !engine.hasSpokenTo("polly"),
      text: "Oh joy. Another hero with coffee stains and no clue."
    },
    {
      condition: (engine) => engine.hasMilestone("alResetsDiscussed") && !engine.hasItem("briefcase"),
      text: "Did Al tell you the resets could stop? Ha! He still believes in mercy."
    },
    {
      condition: (engine) => engine.hasItem("briefcase") && !engine.hasMilestone("briefcaseSolved"),
      text: "You're *carrying* the briefcase? What is this, a fashion statement?"
    },
    {
      condition: (engine) => engine.hasItem("briefcase") && engine.hasMilestone("briefcaseSolved"),
      text: "Wow. You *actually* solved the briefcase. That's… worrying."
    },
    {
      condition: (engine) => engine.hasTrait("curious"),
      text: "You ask too many questions. That’s a compliment… probably."
    },
    {
      condition: () => true,
      text: "Still here? Still wrong."
    }
  ]
};
