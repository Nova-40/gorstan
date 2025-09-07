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

// City Centre - The Heart of London's Financial District

import { Room } from '../types/Room';

const citycentre: Room = {
  id: 'citycentre',
  zone: 'londonZone',
  title: 'City Centre',
  description: [
    'You stand in the beating heart of London\'s financial district, where ancient Roman streets now carry the weight of global commerce. Towering glass and steel monuments to capitalism rise around you, their reflective surfaces catching the light and casting geometric shadows on the historic cobblestones below.',
    'The contrast is striking - medieval church spires pierce through the canyon of modern skyscrapers, while Roman ruins peek out from construction sites. This is where old London meets new, where two thousand years of history compress into a few square miles of some of the world\'s most expensive real estate.',
    'The air buzzes with the energy of international finance. Suited professionals stride purposefully between meetings that can move millions, while tourists crane their necks to see the tops of buildings that seem to scrape the very clouds.',
    'From here, all of London spreads out like a vast organism - the Thames winding its ancient course, historic landmarks marking the passage of centuries, and the endless sprawl of one of the world\'s greatest cities.',
  ],
  image: 'londonZone_citycentre.png',
  ambientAudio: 'london_financial_district.mp3',

  consoleIntro: [
    '>> LONDON CITY CENTRE - FINANCIAL DISTRICT CORE',
    '>> Economic significance: EXTREME - Global financial hub',
    '>> Property values: ASTRONOMICAL - World\'s most expensive sq/ft',
    '>> Daily population: 500,000+ workers, millions pass through',
    '>> Historic overlap: Roman Londinium, Medieval guilds, Modern finance',
    '>> Security: MAXIMUM - Financial institution protection',
    '>> Transport: Multiple tube lines, DLR, bus networks',
    '>> Notable: Bank of England, London Stock Exchange, Lloyd\'s',
    '>> Architecture: Roman ruins to cutting-edge skyscrapers',
    '>> Status: PULSING WITH GLOBAL COMMERCE - Money never sleeps',
  ],

  exits: {
    south: 'londonZone_towerbridge',
    east: 'londonZone_towerhill',
    west: 'londonZone_stkatherinesdock',
    north: 'londonZone_londonhub',
    
    // Financial district locations
    bank_of_england: 'londonZone_bankofengland',
    stock_exchange: 'londonZone_stockexchange',
    lloyds_building: 'londonZone_lloydsbuilding',
    guildhall: 'londonZone_guildhall',
    
    // Transit connections
    bank_station: 'londonZone_bank_station',
    monument_station: 'londonZone_monument_station',
    
    // Historic sites
    st_pauls: 'londonZone_stpauls',
    roman_amphitheatre: 'londonZone_roman_ruins',
  },

  items: [
    'financial_times_newspaper',
    'bank_of_england_note',
    'stock_certificate',
    'roman_coin_replica',
    'city_guild_seal',
    'skyscraper_blueprint',
    'london_transport_pass',
    'financial_district_map',
  ],

  interactables: {
    'glass_skyscrapers': {
      description: 'Towering monuments to modern capitalism that house the world\'s financial powerhouses.',
      actions: ['examine', 'admire_architecture', 'photograph', 'enter_lobbies'],
      requires: ['business_attire'],
    },
    'roman_ruins': {
      description: 'Ancient Roman foundations and walls visible through street-level viewing windows.',
      actions: ['examine', 'study_archaeology', 'photograph', 'trace_ancient_streets'],
      requires: [],
    },
    'medieval_churches': {
      description: 'Small medieval churches squeezed between modern towers, survivors of the Great Fire and the Blitz.',
      actions: ['visit', 'attend_service', 'admire_architecture', 'find_peace'],
      requires: [],
    },
    'financial_screens': {
      description: 'Electronic displays showing real-time global market data and financial news.',
      actions: ['read', 'monitor_markets', 'understand_global_economy', 'photograph'],
      requires: [],
    },
    'city_workers': {
      description: 'The bustling crowd of international financiers, traders, and business professionals.',
      actions: ['observe', 'network', 'interview', 'follow_the_money'],
      requires: ['business_credentials'],
    },
    'historic_pubs': {
      description: 'Ancient taverns that have served city workers for centuries, now popular with modern financiers.',
      actions: ['enter', 'order_drink', 'hear_stories', 'network'],
      requires: ['legal_drinking_age'],
    },
    'street_food_vendors': {
      description: 'International food vendors serving the diverse workforce of the global financial district.',
      actions: ['purchase_food', 'chat_with_vendors', 'sample_cuisine', 'people_watch'],
      requires: ['money'],
    },
  },

  npcs: [
    'investment_banker',
    'stock_trader',
    'city_historian',
    'tour_guide',
    'security_guard',
    'street_vendor',
    'city_worker',
  ],

  events: {
    onEnter: ['feelFinancialEnergy', 'hearCityBuzz', 'senseGlobalCommerce'],
    onExit: ['cityFarewell', 'rememberFinancialPower'],
    onInteract: {
      glass_skyscrapers: ['experienceModernArchitecture', 'understandFinancialPower'],
      roman_ruins: ['connectWithAncientHistory', 'understandContinuity'],
      financial_screens: ['comprehendGlobalMarkets', 'witnessMoneyFlow'],
      city_workers: ['networkWithProfessionals', 'understandFinancialCulture'],
    },
  },

  flags: {
    financialDistrictExplored: false,
    romanRuinsFound: false,
    skyScrapersAdmired: false,
    marketsUnderstood: false,
    networkedWithWorkers: false,
    historicalContinuityGrasped: false,
    modernLondonAppreciated: false,
  },

  quests: {
    main: 'Experience the Heart of Global Finance',
    optional: [
      'Discover Roman London Beneath the City',
      'Network with Financial Professionals',
      'Visit Historic City Churches',
      'Understand Global Markets',
      'Explore Architectural Contrasts',
      'Find the Balance of Old and New',
    ],
  },

  environmental: {
    lighting: 'filtered_sunlight_through_glass_canyons',
    temperature: 'urban_heat_island_effect',
    airQuality: 'filtered_urban_air_with_financial_district_energy',
    soundscape: ['traffic_flow', 'construction_sounds', 'business_conversations', 'phone_calls', 'keyboard_clicking'],
    hazards: ['heavy_pedestrian_traffic', 'construction_zones', 'aggressive_cyclists', 'tourist_confusion'],
  },

  security: {
    level: 'maximum_financial_security',
    accessRequirements: ['public_streets', 'private_building_access_varies'],
    alarmTriggers: ['financial_institution_threats', 'suspicious_behavior', 'unauthorized_building_access'],
    surveillanceActive: true,
    surveillanceType: 'comprehensive_cctv_private_security_police',
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
      'Global financial hub',
      'Roman archaeological sites',
      'Modern skyscraper architecture',
      'Historic church preservation',
      'International business culture',
    ],
  },

  secrets: {
    romanTreasureVault: {
      description: 'A hidden Roman vault discovered during modern construction, containing ancient artifacts',
      requirements: ['befriend city_historian', 'gain_archaeological_access', 'prove_scholarly_intent'],
      rewards: ['ancient_roman_artifacts', 'archaeological_knowledge', 'historian_credentials'],
    },
    financialConspiracy: {
      description: 'Evidence of historical financial manipulation hidden in old bank records',
      requirements: ['network_with_senior_bankers', 'gain_insider_trust', 'demonstrate_discretion'],
      rewards: ['insider_financial_knowledge', 'historical_market_secrets'],
    },
    undergroundTunnels: {
      description: 'A network of tunnels connecting major financial institutions, built for security and efficiency',
      requirements: ['high_level_security_clearance', 'financial_industry_insider', 'emergency_access_only'],
      rewards: ['underground_city_access', 'financial_district_secrets'],
    },
  },

  customActions: {
    'attend_financial_meeting': {
      description: 'Participate in high-level financial discussions that shape global markets',
      requirements: ['business_credentials', 'financial_expertise', 'invitation'],
      effects: ['financial_industry_knowledge', 'global_market_understanding'],
    },
    'archaeological_exploration': {
      description: 'Join an archaeological team exploring Roman London beneath the financial district',
      requirements: ['historian_connection', 'archaeological_permit', 'historical_interest'],
      effects: ['ancient_london_knowledge', 'archaeological_skills'],
    },
    'financial_investigation': {
      description: 'Investigate the flow of money through the world\'s financial systems',
      requirements: ['investigative_skills', 'financial_access', 'journalistic_credentials'],
      effects: ['understanding_global_finance', 'investigative_insights'],
    },
  },

  // London cultural elements
  londonCulture: {
    historicalPeriod: 'Roman_to_Modern_continuous_occupation',
    architecturalStyle: 'Roman_Medieval_Georgian_Modern_contrast',
    socialClass: 'International_financial_elite',
    economicActivity: 'Global_financial_center',
  },

  // Financial heritage
  financialHeritage: {
    significance: 'Global_financial_hub_since_Medieval_times',
    institutions: 'Bank_of_England_London_Stock_Exchange_Lloyds',
    modernRole: 'International_banking_insurance_trading',
    historicalContinuity: 'Roman_trade_Medieval_guilds_Modern_finance',
  },
};

export default citycentre;
