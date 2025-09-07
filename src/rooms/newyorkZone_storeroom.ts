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

// Storeroom - NYC Zone Storage Area (Dirty Napkin Location)

import { Room } from '../types/Room';

const storeroom: Room = {
  id: 'storeroom',
  zone: 'newyorkZone',
  title: 'Burger Joint Storeroom',
  description: [
    'You enter the cramped but well-organized storeroom behind the burger joint, where the familiar scents of cooking oils, spices, and cleaning supplies create an authentic restaurant back-of-house atmosphere. Metal shelving units line the walls, stocked with industrial-sized containers of ketchup, mustard, and other burger essentials.',
    'The fluorescent lights flicker occasionally, casting dancing shadows across boxes of napkins, paper cups, and cleaning supplies. This is clearly the working heart of the restaurant - a functional space where the magic of meal preparation is supported by careful organization and abundant supplies.',
    'Among the mundane restaurant supplies, you notice something unusual: one particular box of napkins seems to shimmer with a faint dimensional energy. The label reads "SPECIAL ORDER - LIBRARY ACCESS NAPKINS" in barely visible text that seems to fade in and out of reality.',
    'Stacks of delivery boxes create narrow pathways through the room, while a time clock on the wall keeps track of employee hours across multiple time zones - some of which don\'t exist in this reality. The back door leads to the alley, but also seems to have a shimmer suggesting dimensional transport possibilities.',
    'The dirty napkin dispenser refill supplies are here, including the special interdimensional napkins that serve as keys to the mysterious Library Zone. Finding the right napkin in this maze of supplies might require some careful searching.'
  ],
  image: 'newyorkZone_storeroom.png',
  ambientAudio: 'storeroom_ambience.mp3',

  consoleIntro: [
    '>> BURGER JOINT STOREROOM - NYC ZONE STORAGE FACILITY',
    '>> Inventory status: FULLY STOCKED - 847 unique food service items',
    '>> Temperature: CONTROLLED - Optimal food storage conditions',
    '>> Access level: EMPLOYEE ONLY - Authorized personnel required',
    '>> Special items detected: LIBRARY ACCESS NAPKINS - Dimensional properties confirmed',
    '>> Security: BASIC - Standard restaurant back-of-house protocols',
    '>> Cleaning supplies: COMPREHENSIVE - All health department requirements met',
    '>> Dimensional activity: LOW - Mainly storage-related portal residue',
    '>> Back door: DIMENSIONAL ENHANCED - Alley exit with transport options',
    '>> "The Real Work Happens Behind the Scenes"',
  ],

  exits: {
    // Main connection to burger joint
    front_door: 'newyorkZone_burgerjoint',
    
    // Back alley with dimensional properties
    back_door: 'newyorkZone_alley',
    
    // Emergency exits
    fire_escape: 'newyorkZone_fire_escape',
    basement_stairs: 'newyorkZone_basement',
    
    // Hidden dimensional routes (after napkin discovery)
    hidden_portal: 'libraryZone_entrance', // Activated by dirty napkin
    
    // Service connections
    loading_dock: 'newyorkZone_loading_dock',
    employee_break_room: 'newyorkZone_break_room',
  },

  items: [
    'dirty_napkin_library_key',
    'industrial_ketchup_bottle',
    'cleaning_supply_bucket',
    'employee_time_card',
    'delivery_receipt_stack',
    'special_interdimensional_napkins',
    'restaurant_supply_catalog',
    'back_door_key',
    'inventory_checklist',
    'dimensional_storage_manual',
  ],

  interactables: {
    'library_napkin_box': {
      description: 'A special box of napkins with dimensional properties, containing the key to the Library Zone.',
      actions: ['examine_box', 'search_napkins', 'find_dirty_napkin', 'activate_library_access'],
      requires: ['observational_skills'],
    },
    'restaurant_supply_shelves': {
      description: 'Tall metal shelving units stocked with everything needed to run the burger joint.',
      actions: ['search_shelves', 'check_inventory', 'organize_supplies', 'find_hidden_items'],
      requires: [],
    },
    'employee_time_clock': {
      description: 'A digital time clock tracking employee hours across multiple dimensions.',
      actions: ['punch_in', 'check_schedule', 'view_dimensional_time_zones', 'access_employee_records'],
      requires: ['employee_id'],
    },
    'cleaning_station': {
      description: 'Industrial cleaning supplies and equipment for maintaining restaurant hygiene.',
      actions: ['clean_area', 'organize_supplies', 'check_safety_sheets', 'prepare_cleaning_solution'],
      requires: [],
    },
    'delivery_staging_area': {
      description: 'Space where deliveries are received and organized before being put away.',
      actions: ['check_deliveries', 'organize_boxes', 'verify_orders', 'process_shipments'],
      requires: ['delivery_authorization'],
    },
    'dimensional_storage_unit': {
      description: 'A special storage unit that exists partially in another dimension, expanding storage capacity.',
      actions: ['access_dimensional_space', 'store_items', 'retrieve_supplies', 'calibrate_dimensional_field'],
      requires: ['dimensional_storage_key'],
    },
    'back_door_exit': {
      description: 'The back door leading to the alley, enhanced with subtle dimensional transport capabilities.',
      actions: ['exit_to_alley', 'check_security', 'activate_dimensional_transport', 'monitor_back_area'],
      requires: ['back_door_key'],
    },
  },

  npcs: [
    'storeroom_manager_pete',
    'delivery_driver_maria',
    'cleaning_crew_supervisor',
    'dimensional_storage_technician',
    'inventory_specialist',
    'napkin_guardian_spirit',
  ],

  events: {
    onEnter: ['showStoreroomWelcome', 'detectLibraryNapkinEnergy', 'smellRestaurantSupplies'],
    onExit: ['storeroomFarewell', 'secureStorageArea'],
    onInteract: {
      library_napkin_box: ['findLibraryKey', 'activateLibraryAccess'],
      dimensional_storage_unit: ['experienceExpandedStorage', 'learnDimensionalOrganization'],
      employee_time_clock: ['discoverMultiDimensionalScheduling', 'accessEmployeeNetwork'],
      back_door_exit: ['discoverAlleyPortal', 'enableBackAreaAccess'],
    },
  },

  flags: {
    storeroomDiscovered: true,
    libraryNapkinFound: false,
    libraryAccessActivated: false,
    inventorySearched: false,
    dimensionalStorageAccessed: false,
    employeeRecordsViewed: false,
    cleaningCompleted: false,
    deliveryProcessed: false,
  },

  quests: {
    main: 'Find the Dirty Napkin Library Key',
    optional: [
      'Organize the Restaurant Supply Inventory',
      'Learn Dimensional Storage Management',
      'Access Employee Time Records',
      'Complete Cleaning Protocols',
      'Process Dimensional Deliveries',
      'Map Hidden Storage Areas',
    ],
  },

  environmental: {
    lighting: 'fluorescent_with_occasional_flicker',
    temperature: 'cool_storage_temperature',
    airQuality: 'restaurant_supply_aromas_with_cleaning_chemicals',
    soundscape: ['ventilation_hum', 'delivery_sounds', 'time_clock_beeping', 'storage_activity'],
    hazards: ['slippery_floors', 'heavy_boxes', 'dimensional_storage_fluctuations'],
  },

  security: {
    level: 'employee_access_only',
    accessRequirements: ['employee_status', 'authorized_personnel'],
    alarmTriggers: ['unauthorized_access', 'inventory_theft', 'dimensional_storage_breach'],
    surveillanceActive: true,
    surveillanceType: 'basic_security_cameras_and_access_logs',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'easy_to_moderate',
    estimatedPlayTime: '15-25 minutes',
    keyFeatures: [
      'Library Zone napkin key location',
      'Restaurant supply management',
      'Dimensional storage system',
      'Employee work environment',
      'Hidden portal activation',
    ],
  },

  secrets: {
    dimensionalStorageMastery: {
      description: 'Complete control over the dimensional storage system',
      requirements: ['storage_technician_training', 'dimensional_field_calibration', 'advanced_access_codes'],
      rewards: ['unlimited_storage_access', 'dimensional_organization_skills'],
    },
    employeeTimeManipulation: {
      description: 'Ability to adjust time records across multiple dimensional time zones',
      requirements: ['time_clock_override_codes', 'temporal_mechanics_knowledge', 'employee_system_access'],
      rewards: ['time_clock_mastery', 'multidimensional_scheduling_control'],
    },
    supplierNetworkSecrets: {
      description: 'Knowledge of the interdimensional supplier network and their mysterious operations',
      requirements: ['supplier_relationships', 'delivery_tracking_access', 'network_investigation_skills'],
      rewards: ['supplier_network_knowledge', 'interdimensional_commerce_insights'],
    },
  },

  customActions: {
    'dirty_napkin_search': {
      description: 'Conduct thorough search for the special library access napkin',
      requirements: ['library_napkin_box_access', 'careful_searching_skills', 'dimensional_sensitivity'],
      effects: ['dirty_napkin_library_key_found', 'library_zone_access_activated'],
    },
    'inventory_management': {
      description: 'Complete professional inventory management of all restaurant supplies',
      requirements: ['inventory_checklist', 'organizational_skills', 'attention_to_detail'],
      effects: ['inventory_mastery', 'restaurant_supply_knowledge'],
    },
    'dimensional_storage_optimization': {
      description: 'Optimize the dimensional storage system for maximum efficiency',
      requirements: ['dimensional_storage_key', 'technical_knowledge', 'spatial_organization_skills'],
      effects: ['storage_optimization', 'dimensional_space_mastery'],
    },
  },

  // Library Zone access mechanism
  libraryZoneAccess: {
    keyItem: 'dirty_napkin_library_key',
    activationLocation: 'library_napkin_box',
    unlockDestination: 'libraryZone_entrance',
    activationMethod: 'napkin_discovery_and_activation',
    requiresQuest: 'Find the Dirty Napkin Library Key',
  },

  // Restaurant operations support
  restaurantOperations: {
    inventorySystem: 'comprehensive_supply_management',
    storageCapacity: 'enhanced_with_dimensional_expansion',
    deliveryProcessing: 'interdimensional_supplier_network',
    qualityControl: 'health_department_compliance_with_dimensional_enhancements',
  },

  // Dimensional storage capabilities
  dimensionalStorage: {
    storageExpansion: 'extra_dimensional_space_utilization',
    accessMethod: 'dimensional_field_manipulation',
    securityLevel: 'dimensional_encryption_protocols',
    technicalSupport: 'specialized_dimensional_storage_technicians',
  },
};

export default storeroom;
