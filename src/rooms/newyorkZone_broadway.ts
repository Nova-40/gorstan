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

// Broadway - The Great White Way

import { Room } from '../types/Room';

const broadway: Room = {
  id: 'broadway',
  zone: 'newyorkZone',
  title: 'Broadway',
  description: [
    'You stand on the legendary Broadway, "The Great White Way," where the brightest lights in show business have illuminated dreams for over a century. Theater marquees stretch as far as the eye can see, advertising both timeless classics and cutting-edge new productions.',
    'The sidewalks buzz with anticipation as theatergoers in their finest attire hurry to make curtain calls. Street vendors sell programs, flowers, and last-minute tickets while buskers perform abbreviated versions of famous show tunes, hoping to catch the overflow of Broadway magic.',
    'Historic theaters line the street like jeweled palaces - the Majestic, the Palace, the St. James - each one a cathedral of American entertainment. Stage doors hint at the backstage world where performers transform into characters that will move audiences to tears, laughter, and standing ovations.',
    'The energy here is electric, charged with decades of artistic ambition, creative genius, and the dreams of countless performers who came here seeking stardom. You can almost hear the ghost lights humming in empty theaters, keeping the spirits of Broadway alive between shows.',
  ],
  image: 'newyorkZone_broadway.png',
  ambientAudio: 'broadway_theater_district.mp3',

  consoleIntro: [
    '>> BROADWAY - THE GREAT WHITE WAY',
    '>> Theater count: 41 official Broadway theaters',
    '>> Annual attendance: 14+ million theatergoers',
    '>> Economic impact: $14.8 billion annually to NYC economy',
    '>> Show capacity: 500+ seats minimum per Broadway theater',
    '>> Performance schedule: 8 shows per week standard',
    '>> Cultural significance: MAXIMUM - Center of American theater',
    '>> Ticket prices: $75-$400+ depending on show and seating',
    '>> Historic legacy: 150+ years of continuous operation',
    '>> "There\'s no business like show business"',
  ],

  exits: {
    west: 'newyorkZone_timessquare',
    north: 'newyorkZone_upperwest_theaters',
    south: 'newyorkZone_theater_district_south',
    east: 'newyorkZone_midtown_east',
    
    // Theater entrances
    enter_majestic: 'newyorkZone_majestic_theater',
    enter_palace: 'newyorkZone_palace_theater',
    enter_st_james: 'newyorkZone_stjames_theater',
    enter_lyceum: 'newyorkZone_lyceum_theater',
    
    // Industry locations
    shubert_alley: 'newyorkZone_shubert_alley',
    tkts_booth: 'newyorkZone_tkts_booth',
    stage_door: 'newyorkZone_stage_door_canteen',
    
    // Transportation
    subway: 'newyorkZone_subway_system',
    taxi: 'newyorkZone_timessquare',
  },

  items: [
    'broadway_playbill',
    'theater_ticket_stub',
    'autograph_book',
    'stage_door_photo',
    'tony_award_replica',
    'show_tune_sheet_music',
    'theater_program',
    'backstage_pass',
  ],

  interactables: {
    'theater_marquees': {
      description: 'Iconic illuminated signs advertising the current Broadway productions.',
      actions: ['read', 'photograph', 'admire_design', 'check_showtimes'],
      requires: [],
    },
    'stage_doors': {
      description: 'Modest entrances where Broadway stars enter and exit, often greeting fans.',
      actions: ['wait_for_actors', 'photograph', 'autograph_hunt', 'observe_backstage'],
      requires: ['patience'],
    },
    'street_performers': {
      description: 'Talented buskers performing Broadway classics and original material.',
      actions: ['watch', 'tip', 'request_song', 'audition_advice'],
      requires: [],
    },
    'theater_crowd': {
      description: 'Excited theatergoers dressed up for their Broadway experience.',
      actions: ['people_watch', 'overhear_reviews', 'share_excitement', 'get_recommendations'],
      requires: [],
    },
    'historic_theaters': {
      description: 'Magnificent theater buildings with rich histories and architectural beauty.',
      actions: ['admire_architecture', 'read_history', 'photograph', 'take_tour'],
      requires: ['theater_tour_ticket'],
    },
    'ticket_scalpers': {
      description: 'People offering last-minute tickets at varying prices and legitimacy.',
      actions: ['negotiate', 'evaluate_authenticity', 'compare_prices', 'report_if_illegal'],
      requires: ['street_savvy'],
    },
    'broadway_vendors': {
      description: 'Street vendors selling theater memorabilia, programs, and souvenirs.',
      actions: ['browse', 'purchase', 'haggle', 'collect_memorabilia'],
      requires: ['money'],
    },
  },

  npcs: [
    'broadway_actor',
    'theater_producer',
    'tourist_family',
    'drama_critic',
    'stage_manager',
    'usher',
    'aspiring_performer',
  ],

  events: {
    onEnter: ['feelBroadwayMagic', 'hearShowTunes', 'senseCreativeEnergy'],
    onExit: ['theaterFarewell', 'rememberSpotlights'],
    onInteract: {
      theater_marquees: ['readCurrentShows', 'planTheaterEvening'],
      stage_doors: ['meetBroadwayStars', 'experienceBackstage'],
      street_performers: ['appreciateStreetTalent', 'supportAspiring'],
      historic_theaters: ['learnTheaterHistory', 'appreciateArchitecture'],
    },
  },

  flags: {
    broadwayExplored: false,
    showAttended: false,
    autographObtained: false,
    theaterTourTaken: false,
    performerMet: false,
    broadwayMagicFelt: false,
    theaterHistoryLearned: false,
  },

  quests: {
    main: 'Experience Broadway\'s Theatrical Magic',
    optional: [
      'Attend a Broadway Show',
      'Meet a Broadway Performer',
      'Collect Autographs at Stage Doors',
      'Take a Historic Theater Tour',
      'Support Street Performers',
      'Learn Broadway History',
      'Experience Opening Night Energy',
    ],
  },

  environmental: {
    lighting: 'brilliant_theater_marquee_illumination',
    temperature: 'urban_heat_with_theater_warmth',
    airQuality: 'city_air_with_performance_energy',
    soundscape: ['show_tunes', 'crowd_chatter', 'theater_bells', 'street_performances', 'taxi_horns'],
    hazards: ['heavy_pedestrian_traffic', 'expensive_area', 'pickpocket_risk', 'crowd_crushing'],
  },

  security: {
    level: 'high_theater_district_security',
    accessRequirements: ['public_access', 'theater_tickets_for_shows'],
    alarmTriggers: ['theater_disruption', 'ticket_scalping', 'crowd_disturbance'],
    surveillanceActive: true,
    surveillanceType: 'nypd_theater_unit_private_security',
  },

  metadata: {
    created: '2025-09-07',
    lastModified: '2025-09-07',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'medium',
    estimatedPlayTime: '20-30 minutes',
    keyFeatures: [
      'Broadway theater district',
      'Live performance culture',
      'Historic theater architecture',
      'Celebrity encounters',
      'American entertainment capital',
    ],
  },

  secrets: {
    phantomTunnel: {
      description: 'Hidden tunnels beneath theaters used by performers for quick costume changes',
      requirements: ['befriend stage_manager', 'prove_theater_devotion', 'backstage_access'],
      rewards: ['underground_theater_access', 'phantom_performer_knowledge'],
    },
    openingNightParty: {
      description: 'Exclusive invitation to a Broadway opening night after-party',
      requirements: ['connect_with_producer', 'show_industry_knowledge', 'formal_attire'],
      rewards: ['industry_insider_access', 'celebrity_networking'],
    },
    ghostLightRitual: {
      description: 'Witness the traditional ghost light ceremony in an empty theater',
      requirements: ['theater_historian_connection', 'respect_for_tradition', 'late_night_access'],
      rewards: ['theater_spirit_blessing', 'deep_broadway_knowledge'],
    },
  },

  customActions: {
    'audition_for_show': {
      description: 'Attempt to audition for a Broadway production',
      requirements: ['performance_skills', 'headshot_resume', 'audition_appointment'],
      effects: ['broadway_audition_experience', 'industry_connections'],
    },
    'broadway_marathon': {
      description: 'Attempt to see multiple Broadway shows in one day',
      requirements: ['significant_budget', 'time_management', 'theater_stamina'],
      effects: ['broadway_marathon_achievement', 'theater_expert_status'],
    },
    'street_performance': {
      description: 'Perform your own street show on Broadway',
      requirements: ['performance_permit', 'talent', 'confidence'],
      effects: ['street_performer_status', 'broadway_street_credibility'],
    },
  },

  // New York cultural elements
  newyorkCulture: {
    significance: 'Center_of_American_commercial_theater',
    tradition: 'Continuous_live_performance_since_1750s',
    economy: 'Major_tourist_attraction_economic_driver',
    artistry: 'Highest_level_professional_theater_in_America',
  },

  // Broadway heritage
  broadwayHeritage: {
    evolution: 'Vaudeville_to_musicals_to_modern_theater',
    landmarks: 'Historic_theaters_preserved_and_operating',
    culture: 'Star_system_celebrity_culture_dreams',
    innovation: 'Continuous_theatrical_and_technical_advancement',
  },
};

export default broadway;
