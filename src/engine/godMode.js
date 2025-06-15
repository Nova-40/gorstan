
// Gorstan Godmode Engine
// Only enabled for playerName === "Geoff"

const godPowers = {
  isActive: false,
  playerName: "",

  activate(name) {
    if (name.toLowerCase() === "geoff") {
      this.isActive = true;
      this.playerName = name;
      return "🌟 Godmode activated. The multiverse obeys.";
    }
    return "Permission denied. Only Geoff may wield the power of the multiverse.";
  },

  help() {
    return [
      "/doors - Reveal all room exits",
      "/goto [roomID] - Teleport to any room",
      "/get [itemID] - Add item to inventory",
      "/solve - Instantly solve current puzzle",
      "/killtrap - Disarm all traps in current room",
      "/debug - Toggle debug overlay",
      "/friends - Max out all NPC loyalties",
      "/flags - List and toggle story flags",
      "/resetcount - View/change reset count",
      "/summon [npcID] - Summon NPC to this room",
      "/traits [trait list] - Grant yourself traits",
      "/wipe - Clear flags & inventory",
      "/unleash - Unlock all doors, spawn glitch NPCs",
      "/godhelp - List available godmode powers"
    ];
  },

  handle(command, context) {
    const [cmd, ...args] = command.split(" ");
    switch (cmd) {
      case "/godhelp":
        return this.help().join("\n");
      case "/doors":
        context.revealAllDoors();
        return "🚪 All doors revealed.";
      case "/goto":
        context.teleport(args[0]);
        return `🌀 Teleporting to ${args[0]}`;
      case "/get":
        context.addItem(args[0]);
        return `🎁 You now hold ${args[0]}`;
      case "/solve":
        context.solveCurrentPuzzle();
        return "✅ Puzzle solved by divine intervention.";
      case "/killtrap":
        context.disarmTraps();
        return "🛡️ Traps neutralized.";
      case "/debug":
        context.toggleDebug();
        return "🧪 Debug overlay toggled.";
      case "/friends":
        context.maxAllFriendship();
        return "👥 All NPCs now love you.";
      case "/flags":
        return context.listFlags();
      case "/resetcount":
        return context.resetCount();
      case "/summon":
        context.summonNPC(args[0]);
        return `👻 ${args[0]} appears with a puff of logic.`;
      case "/traits":
        context.addTraits(args);
        return `✨ Traits granted: ${args.join(", ")}`;
      case "/wipe":
        context.clearFlagsAndInventory();
        return "🧼 Clean slate applied.";
      case "/unleash":
        context.unleashEverything();
        return "💥 Chaos protocol initiated.";
      default:
        return "❓ Unknown godmode command.";
    }
  }
};

export default godPowers;
