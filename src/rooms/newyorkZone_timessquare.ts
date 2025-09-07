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

// Times Square - New York Zone Landing Point

import { Room } from '../types/Room';

const timessquare: Room = {
  id: 'timessquare',
  zone: 'newyorkZone',
  title: 'Times Square',
  description: [
    'You emerge into the electric energy of Times Square, where towering digital billboards paint the night in brilliant neon colors. The famous "Crossroads of the World" pulses with life as millions of LED lights create a dazzling urban aurora overhead.',
    'Yellow taxi cabs honk their way through the controlled chaos while street performers, costume characters, and tourists from every corner of the globe create a vibrant human tapestry. The air buzzes with multiple languages, car horns, and the distant sound of Broadway shows.',
    'Massive electronic screens advertise everything from Broadway musicals to global brands, their light so intense it turns night into an artificial day. Steam rises from manholes, creating an almost mystical atmosphere in this concrete canyon.',
    'Among all the urban intensity, you notice subtle dimensional distortions in some of the electronic displays - as if this nexus of human energy has created tears in reality itself, perfect for interdimensional travel.',
  ],
  image: 'newyorkzone_timessquare.png',
  ambientAudio: 'times_square_atmosphere.mp3',

  consoleIntro: [
    '>> TIMES SQUARE - NEW YORK ZONE LANDING POINT',
    '>> Pedestrian traffic: EXTREME - 330,000 people per day average',
    '>> Digital signage: MAXIMUM - 68 active billboards detected',
    '>> Noise level: 85 decibels - Standard NYC urban environment',
    '>> Dimensional stability: GOOD - High energy facilitates travel',
    '>> Tourist services: COMPREHENSIVE - Information, food, entertainment',
    '>> Transportation: EXCELLENT - Subway hub, taxi access, bus routes',
    '>> Security: HIGH - NYPD presence, surveillance systems active',
    '>> Cultural significance: ICONIC - Heart of American entertainment',
    '>> "Welcome to the City That Never Sleeps"',
  ],

  exits: {
    north: 'newyorkZone_centralpark',
    south: 'newyorkZone_manhattanhub',
    east: 'newyorkZone_broadway',
    west: 'newyorkZone_hellskitchen',
    
    // Direct connection from London
    portal_london: 'londonZone_stkatherinesdock',
    
    // NYC attractions
    enter_theater: 'newyorkZone_broadway_theater',
    take_subway: 'newyorkZone_subway_system',
    enter_restaurant: 'newyorkZone_burgerjoint',
    
    // Dimensional return
    dimensional_return: 'introZone_crossing',
  },

  items: [
    'times_square_postcard',
    'yellow_taxi_receipt',
    'broadway_show_ticket',
    'nyc_metro_card',
    'street_vendor_pretzel',
    'nypd_badge_replica',
    'digital_billboard_photo',
    'subway_map',
  ],

  interactables: {
    'digital_billboards': {
      description: 'Massive electronic screens displaying ads, news, and entertainment from around the world.',
      actions: ['watch', 'photograph', 'study_content', 'detect_anomalies'],
      requires: [],
    },
    'yellow_taxi_cabs': {
      description: 'Iconic NYC yellow cabs navigating the busy streets with characteristic New York efficiency.',
      actions: ['hail', 'ride', 'photograph', 'chat_with_driver'],
      requires: ['nyc_currency'],
    },
    'street_performers': {
      description: 'Talented artists, musicians, and entertainers showcasing their skills for appreciative crowds.',
      actions: ['watch', 'tip', 'join_performance', 'request_song'],
      requires: [],
    },
    'costume_characters': {
      description: 'People dressed as famous characters posing for photos with tourists.',
      actions: ['photograph_with', 'chat', 'tip', 'unmask'],
      requires: ['tourist_camera'],
    },
    'subway_entrance': {
      description: 'The entrance to the Times Square-42nd Street subway complex, one of the busiest in the world.',
      actions: ['enter', 'study_map', 'buy_metrocard', 'people_watch'],
      requires: [],
    },
    'tkts_booth': {
      description: 'The famous red steps and discount theater ticket booth, a Times Square landmark.',
      actions: ['climb_steps', 'buy_tickets', 'view_skyline', 'people_watch'],
      requires: [],
    },
    'dimensional_displays': {
      description: 'Certain billboards that flicker with otherworldly content, suggesting dimensional portals.',
      actions: ['examine_closely', 'touch_screen', 'activate_portal', 'analyze_energy'],
      requires: ['dimensional_sensitivity'],
    },
  },

  npcs: [
    'street_performer_musician',
    'taxi_driver_frank',
    'tourist_information_guide',
    'broadway_ticket_seller',
    'nypd_officer',
    'hot_dog_vendor',
    'dimensional_observer',
  ],

  events: {
    onEnter: ['showNYCWelcome', 'experienceSensoryOverload', 'hearUrbanSymphony'],
    onExit: ['nycFarewell', 'rememberEnergeticVibes'],
    onInteract: {
      digital_billboards: ['experienceInformationOverload', 'detectDimensionalAnomalies'],
      street_performers: ['enjoyUrbanCulture', 'supportLocalArtists'],
      yellow_taxi_cabs: ['experienceNYCTransport', 'hearDriverStories'],
      dimensional_displays: ['discoverPortalNetwork', 'enableInterzonalTravel'],
    },
  },

  flags: {
    timesSquareDiscovered: true,
    billboardsStudied: false,
    subwayExplored: false,
    broadwayTicketsBought: false,
    dimensionalDisplaysFound: false,
    streetPerformanceSeen: false,
    taxiRideTaken: false,
  },

  quests: {
    main: 'Experience the Energy of New York City',
    optional: [
      'See a Broadway Show',
      'Take the Subway to Different Boroughs',
      'Try Authentic NYC Street Food',
      'Photograph Iconic NYC Landmarks',
      'Discover Hidden Dimensional Portals',
      'Meet Locals and Learn Their Stories',
    ],
  },

  environmental: {
    lighting: 'brilliant_artificial_neon_and_led_lights',
    temperature: 'variable_urban_microclimate',
    airQuality: 'urban_with_exhaust_and_food_aromas',
    soundscape: ['traffic_noise', 'street_music', 'crowd_chatter', 'subway_rumbling'],
    hazards: ['heavy_pedestrian_traffic', 'vehicle_congestion', 'sensory_overload'],
  },

  security: {
    level: 'high_urban_security',
    accessRequirements: ['public_access'],
    alarmTriggers: ['suspicious_behavior', 'crowd_disturbances', 'traffic_violations'],
    surveillanceActive: true,
    surveillanceType: 'extensive_cctv_and_police_presence',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'moderate',
    estimatedPlayTime: '15-25 minutes',
    keyFeatures: [
      'Iconic NYC atmosphere',
      'Urban energy and diversity',
      'Broadway theater culture',
      'Dimensional portal integration',
      'Authentic street life',
    ],
  },

  secrets: {
    hiddenSubwayTunnel: {
      description: 'An abandoned subway tunnel beneath Times Square with dimensional properties',
      requirements: ['subway_worker_access', 'explore_deep_underground', 'dimensional_detection'],
      rewards: ['access_to_secret_transit', 'underground_dimensional_network'],
    },
    billboardHacking: {
      description: 'The ability to control the digital billboards for communication across dimensions',
      requirements: ['advanced_hacking_skills', 'dimensional_technology_knowledge', 'billboard_access_codes'],
      rewards: ['billboard_control_system', 'cross_dimensional_messaging'],
    },
    nycUrbanLegends: {
      description: 'True stories behind New York\'s most famous urban legends',
      requirements: ['befriend_locals', 'explore_hidden_areas', 'cultural_research'],
      rewards: ['nyc_insider_knowledge', 'urban_legend_verification'],
    },
  },

  customActions: {
    'broadway_experience': {
      description: 'Attend a full Broadway show and immerse in NYC theater culture',
      requirements: ['broadway_show_ticket', 'evening_time', 'cultural_appreciation'],
      effects: ['cultural_enrichment', 'nyc_theater_knowledge'],
    },
    'food_truck_tour': {
      description: 'Sample authentic NYC street food from various vendors',
      requirements: ['nyc_currency', 'adventurous_palate', 'food_safety_awareness'],
      effects: ['culinary_discovery', 'local_food_knowledge'],
    },
    'photo_documentary': {
      description: 'Create a photographic documentary of Times Square\'s energy and diversity',
      requirements: ['professional_camera', 'artistic_eye', 'people_skills'],
      effects: ['artistic_portfolio', 'cultural_documentation'],
    },
  },

  // NYC culture elements
  nycCulture: {
    energyLevel: 'maximum_urban_intensity',
    diversity: 'global_multicultural_melting_pot',
    paceOfLife: 'fast_paced_never_stops',
    attitude: 'direct_honest_resilient',
  },

  // Tourist and local dynamics
  urbanDynamics: {
    touristDensity: 'extremely_high',
    localToleranceLevel: 'pragmatically_helpful',
    commercialActivity: 'maximum_capitalist_energy',
    culturalSignificance: 'global_entertainment_center',
  },
};

export default timessquare;
