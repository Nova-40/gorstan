/*
  Gorstan – Interactive Game Framework
  Copyright © 2025 Geoff Webster. All Rights Reserved.

  This source code is proprietary and confidential.
  Unauthorised copying, distribution, modification, resale,
  reverse engineering, or use of this file, via any medium,
  is strictly prohibited without prior written consent
  from the copyright holder.

  Licensed access is granted only to authorised users who have
  purchased access to Gorstan through official channels.
  Such licence is strictly limited to running and playing the
  Gorstan game. No part of this source code may be used to
  create derivative works, other games, or redistributed in
  any form.

  Third-party libraries and assets are included under their
  respective licences as detailed in package.json and assets/.
*/

// Central Park - NYC's Green Heart

import { Room } from '../types/Room';

const centralpark: Room = {
  id: 'centralpark',
  zone: 'newyorkZone',
  title: 'Central Park',
  description: [
    'You find yourself in the verdant heart of Manhattan, where Central Park provides a stunning contrast to the surrounding urban jungle. This 843-acre oasis feels like a different world entirely, with tree-lined paths winding through carefully designed landscapes that have been enchanting visitors since 1857.',
    'The park bustles with New York life - joggers following the reservoir loop, families picnicking on the Great Lawn, street musicians playing near Bethesda Fountain, and horse-drawn carriages carrying tourists along scenic routes. The sounds of the city fade to a gentle hum beyond the treeline.',
    'Iconic landmarks dot the landscape: the serene Bow Bridge arching over the lake, the majestic Bethesda Terrace with its ornate fountain, and the whimsical Alice in Wonderland statue where children climb and play. Each season transforms the park into a different masterpiece.',
    'There\'s something almost magical about this place - perhaps it\'s the way nature and humanity coexist so perfectly, or maybe it\'s the countless stories and memories that have been made here. You sense that this place might hold more mysteries than its designers ever intended.',
  ],
  image: 'newyorkZone_centralpark.png',
  ambientAudio: 'central_park_atmosphere.mp3',

  consoleIntro: [
    '>> CENTRAL PARK - MANHATTAN\'S GREEN SANCTUARY',
    '>> Area: 843 acres (341 hectares) of designed landscape',
    '>> Annual visitors: 42+ million - Most visited park in USA',
    '>> Established: 1857 - Frederick Law Olmsted & Calvert Vaux design',
    '>> Ecosystems: Woodlands, meadows, lakes, formal gardens',
    '>> Recreation: Running tracks, tennis courts, playgrounds, boating',
    '>> Cultural sites: Museums, theater, concert venues',
    '>> Wildlife: 200+ bird species, mammals, urban adaptation',
    '>> Seasonal beauty: Four distinct transformations annually',
    '>> "In the middle of difficulty lies opportunity" - Einstein',
  ],

  exits: {
    south: 'newyorkZone_timessquare',
    east: 'newyorkZone_uppereastside',
    west: 'newyorkZone_upperwestside',
    north: 'newyorkZone_harlem',
    
    // Park features
    bethesda_fountain: 'newyorkZone_bethesdafountain',
    bow_bridge: 'newyorkZone_bowbridge',
    strawberry_fields: 'newyorkZone_strawberryfields',
    great_lawn: 'newyorkZone_greatlawn',
    
    // Museums adjacent
    met_museum: 'newyorkZone_metmuseum',
    natural_history: 'newyorkZone_naturalhistory',
    
    // Transportation
    subway_entrance: 'newyorkZone_subway_system',
    taxi_stand: 'newyorkZone_timessquare',
    
    // Express to Manhattan Hub
    corporate_shuttle: 'newyorkZone_manhattanhub',
  },

  items: [
    'central_park_map',
    'autumn_leaf_collection',
    'horse_carriage_ticket',
    'park_bench_plaque',
    'bird_watching_guide',
    'jogging_path_marker',
    'street_musician_cd',
    'park_conservancy_badge',
  ],

  interactables: {
    'bethesda_fountain': {
      description: 'The iconic centerpiece of Central Park, crowned by the Angel of the Waters statue.',
      actions: ['admire', 'photograph', 'make_wish', 'study_architecture'],
      requires: [],
    },
    'bow_bridge': {
      description: 'The park\'s most romantic spot, a beautiful cast iron bridge spanning the lake.',
      actions: ['cross', 'photograph', 'admire_views', 'propose_marriage'],
      requires: [],
    },
    'great_lawn': {
      description: 'A vast open meadow perfect for picnics, concerts, and recreational activities.',
      actions: ['picnic', 'play_frisbee', 'sunbathe', 'attend_concert'],
      requires: ['outdoor_activity_permit'],
    },
    'horse_carriages': {
      description: 'Traditional horse-drawn carriages offering romantic tours through the park.',
      actions: ['ride', 'pet_horses', 'photograph', 'chat_with_driver'],
      requires: ['carriage_fare'],
    },
    'street_musicians': {
      description: 'Talented performers sharing their music with park visitors.',
      actions: ['listen', 'tip', 'request_song', 'join_performance'],
      requires: [],
    },
    'joggers_path': {
      description: 'The popular running loop that circles the park\'s reservoir.',
      actions: ['jog', 'walk', 'exercise', 'people_watch'],
      requires: ['athletic_wear'],
    },
    'alice_statue': {
      description: 'The whimsical Alice in Wonderland statue where children love to climb and play.',
      actions: ['climb', 'photograph', 'read_inscription', 'play_with_children'],
      requires: [],
    },
    'ancient_trees': {
      description: 'Magnificent old trees that have witnessed generations of New York history.',
      actions: ['admire', 'hug', 'study_rings', 'climb'],
      requires: ['tree_climbing_permit'],
    },
  },

  npcs: [
    'park_ranger',
    'carriage_driver',
    'street_musician',
    'tourist_family',
    'jogger',
    'dog_walker',
    'artist_sketching',
  ],

  events: {
    onEnter: ['hearBirdsinging', 'smellFreshAir', 'feelUrbanNatureBalance'],
    onExit: ['parkFarewell', 'rememberTranquility'],
    onInteract: {
      bethesda_fountain: ['experienceIconicLandmark', 'feelRomance'],
      bow_bridge: ['captureBeauty', 'appreciateDesign'],
      great_lawn: ['enjoyOpenSpace', 'participateInActivity'],
      street_musicians: ['appreciateStreetArt', 'supportLocalTalent'],
    },
  },

  flags: {
    parkExplored: false,
    fountainVisited: false,
    bridgeCrossed: false,
    musiciansHeard: false,
    carriageRidden: false,
    naturePeaceFound: false,
    exerciseCompleted: false,
  },

  quests: {
    main: 'Experience Manhattan\'s Green Heart',
    optional: [
      'Visit Bethesda Fountain',
      'Cross the Bow Bridge',
      'Ride a Horse Carriage',
      'Listen to Street Musicians',
      'Find Peace in Nature',
      'Explore All Four Seasons',
      'Spot Central Park Wildlife',
    ],
  },

  environmental: {
    lighting: 'natural_filtered_through_tree_canopy',
    temperature: 'mild_park_microclimate',
    airQuality: 'fresh_park_air_with_urban_traces',
    soundscape: ['bird_songs', 'rustling_leaves', 'distant_city_hum', 'fountain_water', 'children_playing'],
    hazards: ['cyclist_traffic', 'uneven_paths', 'weather_exposure', 'crowded_areas'],
  },

  security: {
    level: 'moderate_park_security',
    accessRequirements: ['public_access'],
    alarmTriggers: ['vandalism', 'wildlife_disturbance', 'after_hours_access'],
    surveillanceActive: true,
    surveillanceType: 'park_rangers_and_cctv',
  },

  metadata: {
    created: '2025-09-07',
    lastModified: '2025-09-07',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'easy',
    estimatedPlayTime: '15-25 minutes',
    keyFeatures: [
      'Urban nature sanctuary',
      'Iconic NYC landmarks',
      'Recreational activities',
      'Cultural performances',
      'Seasonal beauty',
    ],
  },

  secrets: {
    hiddenGarden: {
      description: 'A secret garden known only to longtime park staff and frequent visitors',
      requirements: ['befriend park_ranger', 'show_deep_park_knowledge', 'prove_environmental_respect'],
      rewards: ['exclusive_garden_access', 'rare_plant_knowledge', 'park_insider_status'],
    },
    undergroundTunnels: {
      description: 'Forgotten maintenance tunnels beneath the park from the original construction',
      requirements: ['historical_research', 'maintenance_access_key', 'urban_exploration_skills'],
      rewards: ['historical_artifacts', 'original_park_blueprints', 'secret_tunnel_access'],
    },
    wildlifeWhisperer: {
      description: 'A mysterious person who seems to communicate with the park\'s wildlife',
      requirements: ['spend_time_observing_wildlife', 'show_patience_with_animals', 'visit_at_dawn'],
      rewards: ['animal_communication_skills', 'wildlife_protection_knowledge'],
    },
  },

  customActions: {
    'seasonal_photography': {
      description: 'Capture the park\'s beauty across all four seasons',
      requirements: ['professional_camera', 'year_long_commitment', 'artistic_eye'],
      effects: ['master_photographer_status', 'seasonal_park_documentation'],
    },
    'park_conservation': {
      description: 'Participate in park conservation and maintenance activities',
      requirements: ['environmental_commitment', 'physical_capability', 'volunteer_registration'],
      effects: ['park_conservationist_badge', 'environmental_awareness'],
    },
    'urban_nature_study': {
      description: 'Conduct scientific study of urban wildlife and ecosystem adaptation',
      requirements: ['scientific_background', 'research_permit', 'long_term_observation'],
      effects: ['urban_ecology_expertise', 'wildlife_research_credentials'],
    },
  },

  // New York cultural elements
  newyorkCulture: {
    significance: 'Urban_oasis_democratic_green_space',
    activities: 'Recreation_culture_nature_appreciation',
    seasonality: 'Four_distinct_seasonal_experiences',
    accessibility: 'Free_public_access_all_backgrounds',
  },

  // Park heritage
  parkHeritage: {
    design: 'Olmsted_Vaux_landscape_architecture_masterpiece',
    purpose: 'Democratic_park_accessible_to_all_social_classes',
    evolution: 'Continuous_adaptation_urban_needs',
    conservation: 'Modern_restoration_historical_preservation',
  },
};

export default centralpark;
