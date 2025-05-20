// Auto-generated rooms.js from spreadsheet
export const rooms = {
  "room1": {
  "title": "introstart",
  "description": "introstart lies deep within Intro, a space that waits, watching, as though expecting something only you can bring.",
  "image": "/images/introstart.png",
  "exits": {

  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into introstart.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Intro",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room2": {
  "title": "introjump",
  "description": "introjump lies deep within Intro, a space that waits, watching, as though expecting something only you can bring.",
  "image": "/images/introjump.png",
  "exits": {

  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into introjump.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Intro",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room3": {
  "title": "introreset",
  "description": "introreset lies deep within Intro, a space that waits, watching, as though expecting something only you can bring.",
  "image": "/images/introreset.png",
  "exits": {

  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into introreset.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Intro",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room4": {
  "title": "introsplat",
  "description": "introsplat lies deep within Intro, a space that waits, watching, as though expecting something only you can bring.",
  "image": "/images/introsplat.png",
  "exits": {

  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into introsplat.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Intro",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room5": {
  "title": "introstreet1",
  "description": "introstreet1 lies deep within Intro, a space that waits, watching, as though expecting something only you can bring.",
  "image": "/images/introstreet1.png",
  "exits": {

  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into introstreet1.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Intro",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room6": {
  "title": "introstreet2",
  "description": "introstreet2 lies deep within Intro, a space that waits, watching, as though expecting something only you can bring.",
  "image": "/images/introstreet2.png",
  "exits": {

  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into introstreet2.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Intro",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room7": {
  "title": "introafter",
  "description": "introafter lies deep within Intro, a space that waits, watching, as though expecting something only you can bring.",
  "image": "/images/introstreetclear.png",
  "exits": {
    "north": "room"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into introafter.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Intro",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room8": {
  "title": "Another Control Room",
  "description": "Another Control Room lies deep within Off Multiverse, where the machinery of the multiverse pulses beneath the surface, humming in a language older than stars.",
  "image": "/images/controlnexus.png",
  "exits": {
    "east": "room"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Another Control Room.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Off Multiverse",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room9": {
  "title": "Control Room 1",
  "description": "Control Room 1 lies deep within Off Multiverse, a place where reality coils and folds unpredictably. Each moment feels borrowed, and the walls carry secrets best left unspoken.",
  "image": "/images/controlnexusreturned.png",
  "exits": {
    "east": "room10",
    "west": "room9",
    "center": "room7"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Control Room 1.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Off Multiverse",
    "trap": true,
    "trap_level": "Easy",
    "npc": null
  }
},
  "room10": {
  "title": "Control Room 2",
  "description": "Control Room 2 lies deep within Off Multiverse, where the machinery of the multiverse pulses beneath the surface, humming in a language older than stars.",
  "image": "/images/controlroom.png",
  "exits": {
    "west": "room10",
    "south": "room49",
    "center": "room7"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Control Room 2.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Off Multiverse",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room11": {
  "title": "Danger - Hidden Lab",
  "description": "Danger - Hidden Lab lies deep within Off Multiverse, a place where reality coils and folds unpredictably. Each moment feels borrowed, and the walls carry secrets best left unspoken.",
  "image": "/images/hiddenlab.png",
  "exits": {
    "up": "room",
    "center": "room7",
    "south": "room25"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Danger - Hidden Lab.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Off Multiverse",
    "trap": true,
    "trap_level": "Easy",
    "npc": null
  }
},
  "room12": {
  "title": "Cafe office",
  "description": "The Cafe Office retains a faint hum of normality. Chairs are askew, coffee cups cold. This is where lives used to happen\u2014until something rewrote the script.",
  "image": "/images/cafeoffice.png",
  "exits": {
    "east": "room14"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Cafe office.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "London",
    "trap": true,
    "trap_level": "Easy",
    "npc": null
  }
},
  "room13": {
  "title": "Dale's Apartment",
  "description": "Dale's Apartment lies deep within London, a place where reality coils and folds unpredictably. Each moment feels borrowed, and the walls carry secrets best left unspoken.",
  "image": "/images/dalesapartment.png",
  "exits": {
    "south": "room16",
    "north": "room14",
    "east": "room15"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Dale's Apartment.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "London",
    "trap": true,
    "trap_level": "Medium",
    "npc": null
  }
},
  "room14": {
  "title": "Findlaters Corner Coffee Shop",
  "description": "Findlaters Corner Coffee Shop just by London Bridge, a space that waits, watching, as though expecting something only you can bring.",
  "image": "/images/findlaterscornercafe.png",
  "exits": {
    "west": "room12",
    "south": "room13",
    "north": "room15",
    "east": "room16"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Findlaters Corner Coffee Shop.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "London",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room15": {
  "title": "St Katherines Dock",
  "description": "St Katherines Dock lies near Tower Bridge, London, a space that waits, watching, as though expecting something only you can bring.",
  "image": "/images/stkatherinesdock.png",
  "exits": {
    "portal": "room19",
    "south": "room14",
    "north": "room13",
    "west": "room16"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into St Katherines Dock.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "London",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room16": {
  "title": "Trent Park",
  "description": "Trent Park stretches around you in unsettling silence. Everything here seems to wait, as if the park itself is holding its breath for your next move.",
  "image": "/images/trentparkearth.png",
  "exits": {
    "east": "room15",
    "west": "room14"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Trent Park.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "London",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room17": {
  "title": "Aevira Warehouse",
  "description": "Aevirawarehouse stretches around you in unsettling silence. Everything here seems to wait, as if the room itself is holding its breath for your next move.",
  "image": "/images/aevirawarehouse.png",
  "exits": {
    "west": "room19",
    "back": "room"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Aevira Warehouse.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "New York",
    "trap": true,
    "trap_level": "Medium",
    "npc": null
  }
},
  "room18": {
  "title": "Burger Joint",
  "description": "Burgerjoint retains a faint hum of normality. Chairs are askew, coffee cups cold. This is where lives used to happen\u2014until something rewrote the script.",
  "image": "/images/burgerjoint.png",
  "exits": {
    "north": "room19",
    "west": "room20"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Burger Joint.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "New York",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room19": {
  "title": "Central Park",
  "description": "Central Park lies deep within New York, a place where reality coils and folds unpredictably. Each moment feels borrowed, and the walls carry secrets best left unspoken.",
  "image": "/images/centralpark.png",
  "exits": {
    "portal": "room15",
    "south": "room18",
    "east": "room17"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Central Park.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "New York",
    "trap": true,
    "trap_level": "Medium",
    "npc": null
  }
},
  "room20": {
  "title": "Store Room",
  "description": "Store Room lies deep within New York, a space that waits, watching, as though expecting something only you can bring.",
  "image": "/images/greasystoreroom.png",
  "exits": {
    "east": "room18"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Store Room.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "New York",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room21": {
  "title": "Lattice",
  "description": "Lattice lies deep within Lattice, a space that waits, watching, as though expecting something only you can bring.",
  "image": "/images/latticeroom.png",
  "exits": {
    "down": "room8",
    "up": "room19",
    "north": "room23"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Lattice.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Lattice",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room22": {
  "title": "Lattice Library",
  "description": "Lattice Library lies deep within Lattice, a place where reality coils and folds unpredictably. Each moment feels borrowed, and the walls carry secrets best left unspoken.",
  "image": "/images/libraryarchivist.png",
  "exits": {
    "center": "room25"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Lattice Library.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Lattice",
    "trap": true,
    "trap_level": "Hard",
    "npc": null
  }
},
  "room23": {
  "title": "Lattice observation entrance",
  "description": "Lattice observation entrance lies deep within Lattice, a place where reality coils and folds unpredictably. Each moment feels borrowed, and the walls carry secrets best left unspoken.",
  "image": "/images/lucidveil.png",
  "exits": {
    "south": "room21",
    "north": "room24"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Lattice observation entrance.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Lattice",
    "trap": true,
    "trap_level": "Hard",
    "npc": null
  }
},
  "room24": {
  "title": "Lattice Observatory",
  "description": "Lattice Observatory lies deep within Lattice, a place where reality coils and folds unpredictably. Each moment feels borrowed, and the walls carry secrets best left unspoken.",
  "image": "/images/observationsuite.png",
  "exits": {
    "center": "room22"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Lattice Observatory.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Lattice",
    "trap": true,
    "trap_level": "Hard",
    "npc": null
  }
},
  "room25": {
  "title": "Libraryofnine",
  "description": "The Libraryofnine is heavy with the scent of ink and dust. Ancient tomes line every surface, many older than this world\u2014or yours. A presence watches you, unseen but knowing.",
  "image": null,
  "exits": {

  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Libraryofnine.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Lattice",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room26": {
  "title": "Forgotton Chamber",
  "description": "Forgotton Chamber lies deep within Maze, a fragmented corridor of unreliable space, shifting when unobserved.",
  "image": "/images/forgottenchamber.png",
  "exits": {

  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Forgotton Chamber.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Maze",
    "trap": false,
    "trap_level": "Hard",
    "npc": null
  }
},
  "room27": {
  "title": "Maze Room",
  "description": "Maze Room lies deep within Maze, a fragmented corridor of unreliable space, shifting when unobserved.",
  "image": "/images/maze1.png",
  "exits": {

  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Maze Room.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Maze",
    "trap": false,
    "trap_level": "Hard",
    "npc": null
  }
},
  "room28": {
  "title": "Another Maze Room",
  "description": "Another Maze Room lies deep within Maze, a fragmented corridor of unreliable space, shifting when unobserved.",
  "image": "/images/maze2.png",
  "exits": {

  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Another Maze Room.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Maze",
    "trap": false,
    "trap_level": "Hard",
    "npc": null
  }
},
  "room29": {
  "title": "Still a Maze Room",
  "description": "Still a Maze Room lies deep within Maze, a fragmented corridor of unreliable space, shifting when unobserved.",
  "image": "/images/maze3.png",
  "exits": {

  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Still a Maze Room.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Maze",
    "trap": false,
    "trap_level": "Hard",
    "npc": null
  }
},
  "room30": {
  "title": "Polly's Room",
  "description": "Polly's Room lies deep within Maze, a place where reality coils and folds unpredictably. Each moment feels borrowed, and the walls carry secrets best left unspoken.",
  "image": "/images/pollysbay.png",
  "exits": {
    "south": "room27",
    "north": "room31"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Polly's Room.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Maze",
    "trap": true,
    "trap_level": "Very Hard",
    "npc": null
  }
},
  "room31": {
  "title": "Ancientvault",
  "description": "Ancientvault stretches around you in unsettling silence. Everything here seems to wait, as if the room itself is holding its breath for your next move.",
  "image": "/images/ancientvault.png",
  "exits": {

  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Ancientvault.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Off Gorstan",
    "trap": true,
    "trap_level": "Very Hard",
    "npc": null
  }
},
  "room32": {
  "title": "Arbitercore",
  "description": "Arbitercore stretches around you in unsettling silence. Everything here seems to wait, as if the room itself is holding its breath for your next move.",
  "image": "/images/arbitercore.png",
  "exits": {
    "north": "room32"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Arbitercore.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Off Gorstan",
    "trap": true,
    "trap_level": "Very Hard",
    "npc": null
  }
},
  "room33": {
  "title": "Ancients Library",
  "description": "Ancients Library lies deep within Off Gorstan, a place where reality coils and folds unpredictably. Each moment feels borrowed, and the walls carry secrets best left unspoken.",
  "image": "/images/hiddenlibrary.png",
  "exits": {
    "north": "room49"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Ancients Library.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Off Gorstan",
    "trap": true,
    "trap_level": "Very Hard",
    "npc": null
  }
},
  "room34": {
  "title": "Ancients Room",
  "description": "Ancients Room lies deep within Off Gorstan, a place where reality coils and folds unpredictably. Each moment feels borrowed, and the walls carry secrets best left unspoken.",
  "image": "/images/primeconfluence.png",
  "exits": {

  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Ancients Room.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Off Gorstan",
    "trap": true,
    "trap_level": "Very Hard",
    "npc": null
  }
},
  "room35": {
  "title": "Failure",
  "description": "Failure lies deep within Glitch, a place where reality coils and folds unpredictably. Each moment feels borrowed, and the walls carry secrets best left unspoken.",
  "image": "/images/fallback.png",
  "exits": {
    "center": "room"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Failure.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Glitch",
    "trap": true,
    "trap_level": "Hard",
    "npc": null
  }
},
  "room36": {
  "title": "Issues Detected",
  "description": "Issues Detected lies deep within Glitch, a fragmented corridor of unreliable space, shifting when unobserved.",
  "image": "/images/glitchrealm.png",
  "exits": {
    "south": "room35",
    "north": "room37"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Issues Detected.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Glitch",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room37": {
  "title": "More Issues",
  "description": "More Issues lies deep within Glitch, a place where reality coils and folds unpredictably. Each moment feels borrowed, and the walls carry secrets best left unspoken.",
  "image": "/images/glitchroom.png",
  "exits": {
    "south": "room36",
    "north": "room38"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into More Issues.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Glitch",
    "trap": true,
    "trap_level": "very hard",
    "npc": null
  }
},
  "room38": {
  "title": "Glitching universe",
  "description": "Glitching universe lies deep within Glitch, a place where reality coils and folds unpredictably. Each moment feels borrowed, and the walls carry secrets best left unspoken.",
  "image": "/images/hallucinationroom.png",
  "exits": {

  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Glitching universe.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Glitch",
    "trap": true,
    "trap_level": "very hard",
    "npc": null
  }
},
  "room39": {
  "title": "Elfhame",
  "description": "Elfhame lies deep within Elfhame, a place where reality coils and folds unpredictably. Each moment feels borrowed, and the walls carry secrets best left unspoken.",
  "image": "/images/elfhame.png",
  "exits": {
    "north": "room",
    "south": "room",
    "east": "room"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Elfhame.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Elfhame",
    "trap": true,
    "trap_level": "special",
    "npc": null
  }
},
  "room40": {
  "title": "Fae Lake",
  "description": "Fae Lake lies deep within Elfhame, a place where reality coils and folds unpredictably. Each moment feels borrowed, and the walls carry secrets best left unspoken.",
  "image": "/images/faelake.png",
  "exits": {
    "north": "room41",
    "south": "room39"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Fae Lake.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Elfhame",
    "trap": true,
    "trap_level": "special",
    "npc": null
  }
},
  "room41": {
  "title": "Fae Lake north shore",
  "description": "Fae Lake north shore lies deep within Elfhame, a place where reality coils and folds unpredictably. Each moment feels borrowed, and the walls carry secrets best left unspoken.",
  "image": "/images/faelake2.png",
  "exits": {
    "north": "room44"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Fae Lake north shore.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Elfhame",
    "trap": true,
    "trap_level": "special",
    "npc": null
  }
},
  "room42": {
  "title": "Fae Palace Rhianons room",
  "description": "Fae Palace Rhianons room lies deep within Elfhame, bathed in an enchantment too perfect to trust. Time doesn\u2019t flow here \u2014 it glides.",
  "image": "/images/rhianonschamber.png",
  "exits": {
    "west": "room44"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Fae Palace Rhianons room.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Elfhame",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room43": {
  "title": "Fae Palace dungeons",
  "description": "Fae Palace dungeons lies deep within Elfhame, bathed in an enchantment too perfect to trust. Time doesn\u2019t flow here \u2014 it glides.",
  "image": "/images/storagechamber.png",
  "exits": {
    "up": "room44"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Fae Palace dungeons.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Elfhame",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room44": {
  "title": "Fae Palace Main Hall",
  "description": "Fae Palace Main Hall lies deep within Elfhame, bathed in an enchantment too perfect to trust. Time doesn\u2019t flow here \u2014 it glides.",
  "image": "/images/faepalace.png",
  "exits": {
    "west": "room39",
    "south": "room41",
    "east": "room42",
    "down": "room"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Fae Palace Main Hall.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Elfhame",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room45": {
  "title": "Carronspire",
  "description": "Carronspire stretches around you in unsettling silence. Everything here seems to wait, as if the room itself is holding its breath for your next move.",
  "image": "/images/carronspire.png",
  "exits": {
    "portal": "room",
    "north": "room46",
    "center": "room50"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Carronspire.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Gorstan",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room46": {
  "title": "Torridon",
  "description": "Torridon lies deep within Gorstan, a space that waits, watching, as though expecting something only you can bring.",
  "image": "/images/torridonafter.png",
  "exits": {
    "north": "room14",
    "south": "room",
    "east": "room"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Torridon.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Gorstan",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room47": {
  "title": "Torridon in the past",
  "description": "Torridon in the past lies deep within Gorstan, a place where reality coils and folds unpredictably. Each moment feels borrowed, and the walls carry secrets best left unspoken.",
  "image": "/images/torridonbefore.png",
  "exits": {
    "north": "room14",
    "south": "room",
    "east": "room"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Torridon in the past.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Gorstan",
    "trap": true,
    "trap_level": null,
    "npc": null
  }
},
  "room48": {
  "title": "Torridon Inn",
  "description": "Torridon Inn lies deep within Gorstan, a space that waits, watching, as though expecting something only you can bring.",
  "image": "/images/torridoninn.png",
  "exits": {
    "west": "room"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Torridon Inn.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Gorstan",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room49": {
  "title": "Reset room",
  "description": "In Resetroom, the machinery of the multiverse hums beneath your feet. A single misstep could undo timelines or birth new ones. This is not a place for idle curiosity.",
  "image": "/images/resetroom.png",
  "exits": {
    "north": "room10"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Reset room.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Off Multiverse",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room50": {
  "title": "prewelcome screen",
  "description": "prewelcome screen lies deep within preWelcome, a space that waits, watching, as though expecting something only you can bring.",
  "image": "/images/Starterframe",
  "exits": {

  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into prewelcome screen.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "preWelcome",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room51": {
  "title": "Secret Tunnel",
  "description": "Secret Tunnel lies deep within Multiple zones, a space that waits, watching, as though expecting something only you can bring.",
  "image": "/images/secrettunnel.png",
  "exits": {

  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Secret Tunnel.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "Multiple zones",
    "trap": false,
    "trap_level": "random",
    "npc": null
  }
},
  "room52": {
  "title": "The Crossing",
  "description": "The Crossing lies deep within internal-reset, a space that waits, watching, as though expecting something only you can bring.",
  "image": "/images/crossing2.png",
  "exits": {
    "north": "room14",
    "south": "room",
    "east": "room"
  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into The Crossing.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "internal-reset",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
  "room53": {
  "title": "Stanton Harcourt",
  "description": "Stanton Harcourt lies deep within StantonHarcourt, a space that waits, watching, as though expecting something only you can bring.",
  "image": "/images/stantonharcourt.png",
  "exits": {

  },
  "items": [  ],
  "onEnter": "(engine) => { engine.addToOutput('You step into Stanton Harcourt.'); }",
  "onSay": null,
  "onItemUse": null,
  "meta": {
    "zone": "StantonHarcourt",
    "trap": false,
    "trap_level": null,
    "npc": null
  }
},
};
