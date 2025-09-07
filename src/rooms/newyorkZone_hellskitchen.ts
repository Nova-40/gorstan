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

// Hell's Kitchen - NYC's Transformed Neighborhood

import { Room } from '../types/Room';

const hellskitchen: Room = {
  id: 'hellskitchen',
  zone: 'newyorkZone',
  title: 'Hell\'s Kitchen',
  description: [
    'You find yourself in Hell\'s Kitchen, a neighborhood that embodies New York\'s incredible capacity for reinvention. Once notorious for its rough streets and working-class grit, this area has transformed into one of Manhattan\'s most vibrant communities while retaining its authentic New York character.',
    'The streets buzz with an eclectic mix of old-school New Yorkers, young professionals, theater workers, and international visitors. Family-owned restaurants serving authentic ethnic cuisine share blocks with trendy gastropubs and rooftop bars overlooking the Hudson River.',
    'Pre-war tenement buildings stand alongside sleek modern developments, creating a fascinating architectural timeline. Fire escapes zigzag down brick facades while rooftop gardens and terraces hint at the neighborhood\'s ongoing gentrification and renewal.',
    'Despite all the changes, Hell\'s Kitchen maintains its edge - the kind of place where authenticity matters, where neighborhood loyalty runs deep, and where you can still find the real New York that exists beyond the tourist postcards.',
  ],
  image: 'newyorkZone_hellskitchen.png',
  ambientAudio: 'hells_kitchen_neighborhood.mp3',

  consoleIntro: [
    '>> HELL\'S KITCHEN - CLINTON NEIGHBORHOOD',
    '>> Historic reputation: TOUGH - Former Irish working class enclave',
    '>> Current status: GENTRIFIED - Young professionals and theater district',
    '>> Dining scene: EXCEPTIONAL - Diverse international cuisine',
    '>> Population density: HIGH - 45,000+ residents in 1 square mile',
    '>> Transportation: EXCELLENT - Multiple subway lines and bus routes',
    '>> Real estate: EXPENSIVE - Median rent $3,500+ per month',
    '>> Cultural mix: DIVERSE - 50+ countries represented',
    '>> Proximity to Broadway: PRIME - Theater district workers live here',
    '>> "Tough neighborhood with a heart of gold"',
  ],

  exits: {
    east: 'newyorkZone_timessquare',
    north: 'newyorkZone_upperwestside',
    south: 'newyorkZone_chelsea',
    west: 'newyorkZone_hudsonriver',
    
    // Neighborhood spots
    ninth_avenue: 'newyorkZone_ninth_avenue',
    restaurant_row: 'newyorkZone_restaurant_row',
    clinton_park: 'newyorkZone_clinton_park',
    intrepid_museum: 'newyorkZone_intrepid_museum',
    
    // Housing and local
    apartment_building: 'newyorkZone_tenement_apartment',
    local_bar: 'newyorkZone_neighborhood_bar',
    bodega: 'newyorkZone_corner_bodega',
    
    // Transportation
    subway: 'newyorkZone_subway_system',
    bus: 'newyorkZone_crosstown_bus',
  },

  items: [
    'neighborhood_guide',
    'ethnic_restaurant_menu',
    'apartment_rental_listing',
    'local_newspaper',
    'fire_escape_ladder',
    'bodega_coffee_cup',
    'theater_worker_id',
    'community_garden_key',
  ],

  interactables: {
    'ethnic_restaurants': {
      description: 'Authentic family-owned restaurants representing cuisines from around the world.',
      actions: ['dine', 'chat_with_owners', 'learn_recipes', 'discover_culture'],
      requires: ['money', 'open_mind'],
    },
    'pre_war_buildings': {
      description: 'Historic tenement buildings with character, fire escapes, and neighborhood stories.',
      actions: ['admire_architecture', 'climb_fire_escape', 'interview_residents', 'photograph'],
      requires: ['resident_permission'],
    },
    'neighborhood_locals': {
      description: 'Long-time residents who\'ve witnessed the neighborhood\'s transformation.',
      actions: ['chat', 'hear_stories', 'learn_history', 'get_recommendations'],
      requires: ['respectful_approach'],
    },
    'corner_bodegas': {
      description: 'Essential neighborhood shops selling everything from groceries to lottery tickets.',
      actions: ['shop', 'chat_with_owner', 'buy_coffee', 'people_watch'],
      requires: ['money'],
    },
    'rooftop_gardens': {
      description: 'Community gardens and rooftop spaces where neighbors grow plants and socialize.',
      actions: ['visit', 'help_garden', 'enjoy_views', 'meet_neighbors'],
      requires: ['community_permission'],
    },
    'theater_workers': {
      description: 'Broadway performers, technicians, and staff who live in the neighborhood.',
      actions: ['chat', 'hear_theater_stories', 'get_industry_insights', 'network'],
      requires: ['theater_interest'],
    },
    'gentrification_signs': {
      description: 'Visible markers of neighborhood change - new developments, rising rents, closing businesses.',
      actions: ['observe', 'document', 'discuss_impact', 'support_local_business'],
      requires: ['social_awareness'],
    },
  },

  npcs: [
    'longtime_resident',
    'theater_technician',
    'restaurant_owner',
    'bodega_clerk',
    'young_professional',
    'community_activist',
    'retired_irish_longshoreman',
  ],

  events: {
    onEnter: ['feelNeighborhoodEnergy', 'smellDiverseCooking', 'hearUrbanLife'],
    onExit: ['neighborhoodFarewell', 'rememberAuthenticity'],
    onInteract: {
      ethnic_restaurants: ['experienceCulturalDiversity', 'supportLocalBusiness'],
      neighborhood_locals: ['learnHistory', 'understandChange'],
      pre_war_buildings: ['appreciateHistory', 'witnessUrbanEvolution'],
      theater_workers: ['connectWithArts', 'understandCreativeLife'],
    },
  },

  flags: {
    neighborhoodExplored: false,
    localRestaurantTried: false,
    residentStoryHeard: false,
    bodegaVisited: false,
    theaterWorkerMet: false,
    gentrificationUnderstood: false,
    communityConnected: false,
  },

  quests: {
    main: 'Experience Authentic NYC Neighborhood Life',
    optional: [
      'Try Authentic Ethnic Cuisine',
      'Learn Neighborhood History from Locals',
      'Visit a Classic NYC Bodega',
      'Meet Theater District Workers',
      'Understand Gentrification Impact',
      'Find Hidden Community Spaces',
      'Document Neighborhood Character',
    ],
  },

  environmental: {
    lighting: 'urban_street_lighting_with_restaurant_glow',
    temperature: 'urban_heat_island_with_building_warmth',
    airQuality: 'city_air_with_cooking_aromas',
    soundscape: ['diverse_languages', 'restaurant_activity', 'urban_traffic', 'neighborhood_conversations', 'fire_truck_sirens'],
    hazards: ['busy_streets', 'construction_zones', 'expensive_living_costs', 'rapid_neighborhood_change'],
  },

  security: {
    level: 'moderate_neighborhood_security',
    accessRequirements: ['public_access'],
    alarmTriggers: ['property_crime', 'noise_complaints', 'commercial_disputes'],
    surveillanceActive: true,
    surveillanceType: 'nypd_community_policing_building_security',
  },

  metadata: {
    created: '2025-09-07',
    lastModified: '2025-09-07',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'medium',
    estimatedPlayTime: '18-25 minutes',
    keyFeatures: [
      'Authentic NYC neighborhood',
      'Cultural diversity',
      'Gentrification dynamics',
      'Theater district proximity',
      'Working class heritage',
    ],
  },

  secrets: {
    speakeasyBar: {
      description: 'A hidden speakeasy that\'s been operating since Prohibition era',
      requirements: ['local_resident_recommendation', 'password_knowledge', 'evening_visit'],
      rewards: ['prohibition_era_cocktails', 'underground_bar_access', 'neighborhood_insider_status'],
    },
    communityGarden: {
      description: 'A secret rooftop garden maintained by longtime residents',
      requirements: ['gain_community_trust', 'volunteer_commitment', 'gardening_skills'],
      rewards: ['community_garden_access', 'neighborhood_connection', 'urban_farming_knowledge'],
    },
    oldTimersClub: {
      description: 'An informal gathering of neighborhood veterans who remember the old days',
      requirements: ['demonstrate_respect_for_history', 'listen_more_than_talk', 'bring_offering'],
      rewards: ['neighborhood_history_knowledge', 'old_timer_respect', 'authentic_stories'],
    },
  },

  customActions: {
    'neighborhood_food_tour': {
      description: 'Create your own authentic food tour of Hell\'s Kitchen\'s ethnic restaurants',
      requirements: ['culinary_curiosity', 'adequate_budget', 'stomach_capacity'],
      effects: ['culinary_explorer_status', 'neighborhood_food_knowledge'],
    },
    'gentrification_documentation': {
      description: 'Document the ongoing changes in the neighborhood',
      requirements: ['camera', 'sociological_interest', 'resident_interviews'],
      effects: ['urban_studies_knowledge', 'neighborhood_change_documentation'],
    },
    'community_volunteering': {
      description: 'Get involved in neighborhood community organizations',
      requirements: ['time_commitment', 'community_spirit', 'local_needs_understanding'],
      effects: ['community_volunteer_status', 'neighborhood_insider_knowledge'],
    },
  },

  // New York cultural elements
  newyorkCulture: {
    authenticity: 'Real_working_class_New_York_character',
    diversity: 'International_immigrant_community_traditions',
    change: 'Gentrification_and_neighborhood_transformation',
    proximity: 'Theater_district_worker_residential_area',
  },

  // Neighborhood heritage
  neighborhoodHeritage: {
    origins: 'Irish_immigrant_working_class_community',
    evolution: 'Tough_reputation_to_trendy_gentrification',
    preservation: 'Efforts_to_maintain_character_and_affordability',
    culture: 'Mix_of_old_timers_and_newcomers',
  },
};

export default hellskitchen;
