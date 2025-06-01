// File: src/engine/core/rooms.js
// MIT License
// © 2025 Geoff Webster – Gorstan Game Project
// Purpose: Module supporting Gorstan gameplay or UI.


// Gorstan Game (c) Geoff Webster 2025 – MIT License
// Module: rooms.js – v2.4.1

const rooms = {
  "1": {
    "id": 1,
    "title": "introstart",
    "zone": "Intro",
    "zoneNumber": 1,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/introstart.png",
    "description": "introstart hums with the tension of impending choice. You sense your path diverging before your feet even move.",
    "exits": {}
  },
  "2": {
    "id": 2,
    "title": "introjump",
    "zone": "Intro",
    "zoneNumber": 1,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/introjump.png",
    "description": "introjump hums with the tension of impending choice. You sense your path diverging before your feet even move.",
    "exits": {}
  },
  "3": {
    "id": 3,
    "title": "introreset",
    "zone": "Intro",
    "zoneNumber": 1,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/introreset.png",
    "description": "introreset hums with the tension of impending choice. You sense your path diverging before your feet even move.",
    "exits": {}
  },
  "4": {
    "id": 4,
    "title": "introsplat",
    "zone": "Intro",
    "zoneNumber": 1,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/introsplat.png",
    "description": "introsplat hums with the tension of impending choice. You sense your path diverging before your feet even move.",
    "exits": {}
  },
  "5": {
    "id": 5,
    "title": "introstreet1",
    "zone": "Intro",
    "zoneNumber": 1,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/introstreet1.png",
    "description": "introstreet1 hums with the tension of impending choice. You sense your path diverging before your feet even move.",
    "exits": {}
  },
  "6": {
    "id": 6,
    "title": "introstreet2",
    "zone": "Intro",
    "zoneNumber": 1,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/introstreet2.png",
    "description": "introstreet2 hums with the tension of impending choice. You sense your path diverging before your feet even move.",
    "exits": {}
  },
  "7": {
    "id": 7,
    "title": "introafter",
    "zone": "Intro",
    "zoneNumber": 1,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/introstreetclear.png",
    "description": "introafter hums with the tension of impending choice. You sense your path diverging before your feet even move.",
    "exits": {}
  },
  "8": {
    "id": 8,
    "title": "Another Control Room",
    "zone": "Off Multiverse",
    "zoneNumber": 2,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/controlnexus.png",
    "description": "Another Control Room bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {}
  },
  "9": {
    "id": 9,
    "title": "Control Room 1",
    "zone": "Off Multiverse",
    "zoneNumber": 2,
    "trap": true,
    "trapLevel": "Easy",
    "npc": null,
    "image": "/images/controlnexusreturned.png",
    "description": "Control Room 1 bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "E": 10
    }
  },
  "10": {
    "id": 10,
    "title": "Control Room 2",
    "zone": "Off Multiverse",
    "zoneNumber": 2,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/controlroom.png",
    "description": "Control Room 2 bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "W": 10
    }
  },
  "11": {
    "id": 11,
    "title": "Danger - Hidden Lab",
    "zone": "Off Multiverse",
    "zoneNumber": 2,
    "trap": true,
    "trapLevel": "Easy",
    "npc": null,
    "image": "/images/hiddenlab.png",
    "description": "Danger - Hidden Lab bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {}
  },
  "12": {
    "id": 12,
    "title": "Caf\u00e9 office",
    "zone": "London",
    "zoneNumber": 3,
    "trap": true,
    "trapLevel": "Easy",
    "npc": null,
    "image": "/images/cafeoffice.png",
    "description": "Caf\u00e9 office stands skewed in time, touched by both the familiar hum of the city and something foreign \u2014 folded and spliced into place.",
    "exits": {
      "E": 14
    }
  },
  "13": {
    "id": 13,
    "title": "Dale's Apartment ",
    "zone": "London",
    "zoneNumber": 3,
    "trap": true,
    "trapLevel": "Medium",
    "npc": "Polly",
    "image": "/images/dalesapartment.png",
    "description": "Dale's Apartment stands skewed in time, touched by both the familiar hum of the city and something foreign \u2014 folded and spliced into place.",
    "exits": {
      "S": 16
    }
  },
  "14": {
    "id": 14,
    "title": "Findlaters Corner Coffee Shop",
    "zone": "London",
    "zoneNumber": 3,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/findlaterscornercafe.png",
    "description": "Findlaters Corner Coffee Shop stands skewed in time, touched by both the familiar hum of the city and something foreign \u2014 folded and spliced into place.",
    "exits": {
      "W": 12
    }
  },
  "15": {
    "id": 15,
    "title": "St Katherines Dock",
    "zone": "London",
    "zoneNumber": 3,
    "trap": false,
    "trapLevel": null,
    "npc": "Al, Morthos",
    "image": "/images/stkatherinesdock.png",
    "description": "St Katherines Dock stands skewed in time, touched by both the familiar hum of the city and something foreign \u2014 folded and spliced into place.",
    "exits": {
      "P": 19
    }
  },
  "16": {
    "id": 16,
    "title": "Trent Park",
    "zone": "London",
    "zoneNumber": 3,
    "trap": false,
    "trapLevel": null,
    "npc": "Al",
    "image": "/images/trentparkearth.png",
    "description": "Trent Park stands skewed in time, touched by both the familiar hum of the city and something foreign \u2014 folded and spliced into place.",
    "exits": {}
  },
  "17": {
    "id": 17,
    "title": "Aevira Warehouse",
    "zone": "New York",
    "zoneNumber": 4,
    "trap": true,
    "trapLevel": "Medium",
    "npc": null,
    "image": "/images/aevirawarehouse.png",
    "description": "Aevira Warehouse bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "W": 19
    }
  },
  "18": {
    "id": 18,
    "title": "Burger Joint",
    "zone": "New York",
    "zoneNumber": 4,
    "trap": false,
    "trapLevel": null,
    "npc": "Chef",
    "image": "/images/burgerjoint.png",
    "description": "Burger Joint bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "N": 19
    }
  },
  "19": {
    "id": 19,
    "title": "Central Park",
    "zone": "New York",
    "zoneNumber": 4,
    "trap": true,
    "trapLevel": "Medium",
    "npc": null,
    "image": "/images/centralpark.png",
    "description": "Central Park bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "P": 15
    }
  },
  "20": {
    "id": 20,
    "title": "Store Room",
    "zone": "New York",
    "zoneNumber": 4,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/greasystoreroom.png",
    "description": "Store Room bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "E": 18
    }
  },
  "21": {
    "id": 21,
    "title": "Lattice",
    "zone": "Lattice",
    "zoneNumber": 5,
    "trap": false,
    "trapLevel": "Ayla",
    "npc": null,
    "image": "/images/latticeroom.png",
    "description": "Lattice bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "D": 8
    }
  },
  "22": {
    "id": 22,
    "title": "Lattice Library",
    "zone": "Lattice",
    "zoneNumber": 5,
    "trap": true,
    "trapLevel": "Hard",
    "npc": "The Archivist",
    "image": "/images/libraryarchivist.png",
    "description": "Lattice Library bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "C": 25
    }
  },
  "23": {
    "id": 23,
    "title": "Lattice observation entrance",
    "zone": "Lattice",
    "zoneNumber": 5,
    "trap": true,
    "trapLevel": "Hard",
    "npc": null,
    "image": "/images/lucidveil.png",
    "description": "Lattice observation entrance bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "S": 21
    }
  },
  "24": {
    "id": 24,
    "title": "Lattice Observatory",
    "zone": "Lattice",
    "zoneNumber": 5,
    "trap": true,
    "trapLevel": "Hard",
    "npc": null,
    "image": "/images/observationsuite.png",
    "description": "Lattice Observatory bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {}
  },
  "25": {
    "id": 25,
    "title": "Libraryofnine",
    "zone": "Lattice",
    "zoneNumber": 5,
    "trap": false,
    "trapLevel": null,
    "npc": "The Archivist",
    "image": "",
    "description": "Libraryofnine bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {}
  },
  "26": {
    "id": 26,
    "title": "Forgotton Chamber",
    "zone": "Maze",
    "zoneNumber": 6,
    "trap": false,
    "trapLevel": "Hard",
    "npc": null,
    "image": "/images/forgottenchamber.png",
    "description": "Forgotton Chamber defies memory. Each turn forgets the last, every wall slightly wrong, like a dream you can't retell.",
    "exits": {}
  },
  "27": {
    "id": 27,
    "title": "Maze Room",
    "zone": "Maze",
    "zoneNumber": 6,
    "trap": false,
    "trapLevel": "Hard",
    "npc": null,
    "image": "/images/maze1.png",
    "description": "Maze Room defies memory. Each turn forgets the last, every wall slightly wrong, like a dream you can't retell.",
    "exits": {}
  },
  "28": {
    "id": 28,
    "title": "Another Maze Room",
    "zone": "Maze",
    "zoneNumber": 6,
    "trap": false,
    "trapLevel": "Hard",
    "npc": null,
    "image": "/images/maze2.png",
    "description": "Another Maze Room defies memory. Each turn forgets the last, every wall slightly wrong, like a dream you can't retell.",
    "exits": {}
  },
  "29": {
    "id": 29,
    "title": "Still a Maze Room",
    "zone": "Maze",
    "zoneNumber": 6,
    "trap": false,
    "trapLevel": "Hard",
    "npc": null,
    "image": "/images/maze3.png",
    "description": "Still a Maze Room defies memory. Each turn forgets the last, every wall slightly wrong, like a dream you can't retell.",
    "exits": {}
  },
  "30": {
    "id": 30,
    "title": "Polly's Room",
    "zone": "Maze",
    "zoneNumber": 6,
    "trap": true,
    "trapLevel": "Very Hard",
    "npc": "Polly",
    "image": "/images/pollysbay.png",
    "description": "Polly's Room defies memory. Each turn forgets the last, every wall slightly wrong, like a dream you can't retell.",
    "exits": {
      "S": 27
    }
  },
  "31": {
    "id": 31,
    "title": "Ancientvault",
    "zone": "Off Gorstan",
    "zoneNumber": 7,
    "trap": true,
    "trapLevel": "Very Hard",
    "npc": null,
    "image": "/images/ancientvault.png",
    "description": "Ancientvault bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {}
  },
  "32": {
    "id": 32,
    "title": "Arbitercore",
    "zone": "Off Gorstan",
    "zoneNumber": 7,
    "trap": true,
    "trapLevel": "Very Hard",
    "npc": null,
    "image": "/images/arbitercore.png",
    "description": "Arbitercore bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "N": 32
    }
  },
  "33": {
    "id": 33,
    "title": "Ancients Library",
    "zone": "Off Gorstan",
    "zoneNumber": 7,
    "trap": true,
    "trapLevel": "Very Hard",
    "npc": "The Archivist",
    "image": "/images/hiddenlibrary.png",
    "description": "Ancients Library bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "N": 49
    }
  },
  "34": {
    "id": 34,
    "title": "Ancients Room",
    "zone": "Off Gorstan",
    "zoneNumber": 7,
    "trap": true,
    "trapLevel": "Very Hard",
    "npc": null,
    "image": "/images/primeconfluence.png",
    "description": "Ancients Room bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {}
  },
  "35": {
    "id": 35,
    "title": "Failure",
    "zone": "Glitch",
    "zoneNumber": 9,
    "trap": true,
    "trapLevel": "Hard",
    "npc": null,
    "image": "/images/fallback.png",
    "description": "Failure bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {}
  },
  "36": {
    "id": 36,
    "title": "Issues Detected",
    "zone": "Glitch",
    "zoneNumber": 9,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/glitchrealm.png",
    "description": "Issues Detected bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "S": 35
    }
  },
  "37": {
    "id": 37,
    "title": "More Issues",
    "zone": "Glitch",
    "zoneNumber": 9,
    "trap": true,
    "trapLevel": "very hard",
    "npc": null,
    "image": "/images/glitchroom.png",
    "description": "More Issues bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "S": 36
    }
  },
  "38": {
    "id": 38,
    "title": "Glitching universe",
    "zone": "Glitch",
    "zoneNumber": 9,
    "trap": true,
    "trapLevel": "very hard",
    "npc": null,
    "image": "/images/hallucinationroom.png",
    "description": "Glitching universe bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {}
  },
  "39": {
    "id": 39,
    "title": "Elfhame",
    "zone": "Elfhame",
    "zoneNumber": 8,
    "trap": true,
    "trapLevel": "special",
    "npc": null,
    "image": "/images/elfhame.png",
    "description": "Elfhame bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {}
  },
  "40": {
    "id": 40,
    "title": "Fae Lake",
    "zone": "Elfhame",
    "zoneNumber": 8,
    "trap": true,
    "trapLevel": "special",
    "npc": null,
    "image": "/images/faelake.png",
    "description": "Fae Lake bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "N": 41
    }
  },
  "41": {
    "id": 41,
    "title": "Fae Lake north shore",
    "zone": "Elfhame",
    "zoneNumber": 8,
    "trap": true,
    "trapLevel": "special",
    "npc": null,
    "image": "/images/faelake2.png",
    "description": "Fae Lake north shore bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "N": 44
    }
  },
  "42": {
    "id": 42,
    "title": "Fae Palace Rhianons room",
    "zone": "Elfhame",
    "zoneNumber": 8,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/rhianonschamber.png",
    "description": "Fae Palace Rhianons room bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "W": 44
    }
  },
  "43": {
    "id": 43,
    "title": "Fae Palace dungeons",
    "zone": "Elfhame",
    "zoneNumber": 8,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/storagechamber.png",
    "description": "Fae Palace dungeons bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "U": 44
    }
  },
  "44": {
    "id": 44,
    "title": "Fae Palace Main Hall",
    "zone": "Elfhame",
    "zoneNumber": 8,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/faepalace.png",
    "description": "Fae Palace Main Hall bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "W": 39
    }
  },
  "45": {
    "id": 45,
    "title": "Carronspire",
    "zone": "Gorstan",
    "zoneNumber": 10,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/carronspire.png",
    "description": "Carronspire bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {}
  },
  "46": {
    "id": 46,
    "title": "Torridon ",
    "zone": "Gorstan",
    "zoneNumber": 10,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/torridonafter.png",
    "description": "Torridon bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "N": 14
    }
  },
  "47": {
    "id": 47,
    "title": "Torridon in the past",
    "zone": "Gorstan",
    "zoneNumber": 10,
    "trap": true,
    "trapLevel": null,
    "npc": null,
    "image": "/images/torridonbefore.png",
    "description": "Torridon in the past bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "N": 14
    }
  },
  "48": {
    "id": 48,
    "title": "Torridon Inn",
    "zone": "Gorstan",
    "zoneNumber": 10,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/torridoninn.png",
    "description": "Torridon Inn bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {}
  },
  "49": {
    "id": 49,
    "title": "Reset room",
    "zone": "Off Multiverse",
    "zoneNumber": 11,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/resetroom.png",
    "description": "Reset room bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "chair": 16
    }
  },
  "50": {
    "id": 50,
    "title": "prewelcome screen",
    "zone": "preWelcome",
    "zoneNumber": 11,
    "trap": false,
    "trapLevel": "extra hard",
    "npc": null,
    "image": "/images/Starterframe",
    "description": "prewelcome screen bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {}
  },
  "51": {
    "id": 51,
    "title": "Secret Tunnel",
    "zone": "Multiple zones",
    "zoneNumber": null,
    "trap": false,
    "trapLevel": "random",
    "npc": null,
    "image": "/images/secrettunnel.png",
    "description": "Secret Tunnel bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "N": 24,
      "S": 26,
      "E": 38
    }
  },
  "52": {
    "id": 52,
    "title": "The Crossing",
    "zone": "internal-reset",
    "zoneNumber": null,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/crossing2.png",
    "description": "The Crossing bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {
      "N": 14
    }
  },
  "53": {
    "id": 53,
    "title": "Stanton Harcourt",
    "zone": "StantonHarcourt",
    "zoneNumber": null,
    "trap": false,
    "trapLevel": null,
    "npc": null,
    "image": "/images/stantonharcourt.png",
    "description": "Stanton Harcourt bears the marks of unseen hands. You are not the first to arrive \u2014 and likely not the last.",
    "exits": {}
  }
};

export default rooms;
