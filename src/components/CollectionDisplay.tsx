/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

import React, { useState } from 'react';
import { Package, Book, Star, Zap, Plus, Search, Filter, X } from 'lucide-react';
import { useGameState } from '../state/gameState';

interface ItemData {
  id: string;
  name: string;
  description: string;
  type: 'artifact' | 'consumable' | 'key' | 'lore' | 'material';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  discoveredAt?: string; // room where found
  discoveredTime?: number; // timestamp
  loreEntry?: string;
  combinesWith?: string[];
  effects?: string[];
  value?: number;
}

interface CollectionDisplayProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CollectionDisplay: React.FC<CollectionDisplayProps> = ({ 
  className = '', 
  isOpen, 
  onClose 
}) => {
  const { state } = useGameState();
  const [activeTab, setActiveTab] = useState<'inventory' | 'codex' | 'combine'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  // Enhanced inventory data - this would integrate with existing inventory system
  const getEnhancedInventory = (): ItemData[] => {
    const basicInventory = state.player.inventory || [];
    
    // Convert basic inventory to enhanced format with metadata
    return basicInventory.map((item, index) => ({
      id: `item_${index}`,
      name: item,
      description: getItemDescription(item),
      type: getItemType(item),
      rarity: getItemRarity(item),
      ...(state.player.currentRoom && { discoveredAt: state.player.currentRoom }),
      discoveredTime: Date.now(),
      loreEntry: getItemLore(item),
      value: getItemValue(item)
    }));
  };
  
  const getItemDescription = (itemName: string): string => {
    const descriptions: Record<string, string> = {
      'coffee': 'A steaming cup of energizing coffee. Restores stamina and improves focus.',
      'ancient_scroll': 'A weathered parchment containing cryptic symbols and forgotten knowledge.',
      'crystal_shard': 'A fragment of pure energy, humming with otherworldly power.',
      'iron_key': 'A heavy key that opens doors to forgotten places.',
      'golden_coin': 'An ancient coin bearing the mark of a long-lost kingdom.',
      'mystical_orb': 'A sphere of swirling energy that seems to contain trapped starlight.',
      'healing_potion': 'A vial of crimson liquid that mends wounds and soothes pain.',
      'rune_stone': 'A carved stone inscribed with powerful magical symbols.'
    };
    return descriptions[itemName] || `A mysterious ${itemName} with unknown properties.`;
  };
  
  const getItemType = (itemName: string): ItemData['type'] => {
    if (['coffee', 'healing_potion'].includes(itemName)) {return 'consumable';}
    if (['iron_key'].includes(itemName)) {return 'key';}
    if (['ancient_scroll'].includes(itemName)) {return 'lore';}
    if (['crystal_shard', 'rune_stone'].includes(itemName)) {return 'material';}
    return 'artifact';
  };
  
  const getItemRarity = (itemName: string): ItemData['rarity'] => {
    if (['mystical_orb'].includes(itemName)) {return 'legendary';}
    if (['crystal_shard', 'ancient_scroll'].includes(itemName)) {return 'epic';}
    if (['rune_stone', 'golden_coin'].includes(itemName)) {return 'rare';}
    if (['iron_key'].includes(itemName)) {return 'uncommon';}
    return 'common';
  };
  
  const getItemLore = (itemName: string): string => {
    const lore: Record<string, string> = {
      'ancient_scroll': 'Found in the ruins of the Great Library, this scroll contains the lost art of dimensional navigation.',
      'crystal_shard': 'Legend speaks of nine crystal shards scattered across the realms, each containing a fragment of pure creation.',
      'mystical_orb': 'The Orb of Eternities, said to show glimpses of all possible futures to those brave enough to gaze within.',
      'rune_stone': 'These stones were carved by the First Mages to channel and focus magical energies.',
      'golden_coin': 'Minted in the Golden Age of Gorstan, these coins were blessed by the ancient prosperity spirits.'
    };
    return lore[itemName] || '';
  };
  
  const getItemValue = (itemName: string): number => {
    const values: Record<string, number> = {
      'mystical_orb': 1000,
      'crystal_shard': 500,
      'ancient_scroll': 300,
      'rune_stone': 200,
      'golden_coin': 100,
      'iron_key': 50,
      'healing_potion': 25,
      'coffee': 10
    };
    return values[itemName] || 5;
  };
  
  const getRarityColor = (rarity: ItemData['rarity']): string => {
    switch (rarity) {
      case 'legendary': return 'text-purple-400 border-purple-500';
      case 'epic': return 'text-orange-400 border-orange-500';
      case 'rare': return 'text-blue-400 border-blue-500';
      case 'uncommon': return 'text-green-400 border-green-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };
  
  const getTypeIcon = (type: ItemData['type']) => {
    switch (type) {
      case 'artifact': return <Star className="w-4 h-4" />;
      case 'consumable': return <Zap className="w-4 h-4" />;
      case 'key': return <Package className="w-4 h-4" />;
      case 'lore': return <Book className="w-4 h-4" />;
      case 'material': return <Plus className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };
  
  const inventory = getEnhancedInventory();
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });
  
  if (!isOpen) {return null;}
  
  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 ${className}`}>
      <div className="absolute inset-4 bg-gray-900 rounded-lg border border-gray-700 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Collection & Inventory</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {[
            { id: 'inventory', label: 'Inventory', icon: <Package className="w-4 h-4" /> },
            { id: 'codex', label: 'Codex', icon: <Book className="w-4 h-4" /> },
            { id: 'combine', label: 'Crafting', icon: <Plus className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-900/50 text-blue-400 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'inventory' && (
            <div className="h-full flex flex-col">
              {/* Search & Filter */}
              <div className="p-4 border-b border-gray-700 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="artifact">Artifacts</option>
                    <option value="consumable">Consumables</option>
                    <option value="key">Keys</option>
                    <option value="lore">Lore Items</option>
                    <option value="material">Materials</option>
                  </select>
                </div>
              </div>
              
              {/* Items Grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {filteredInventory.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No items found</p>
                    <p className="text-sm mt-1">Explore the world to discover treasures!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredInventory.map(item => (
                      <div
                        key={item.id}
                        className={`bg-gray-800 rounded-lg p-4 border-l-4 ${getRarityColor(item.rarity)} hover:bg-gray-750 transition-colors`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded ${getRarityColor(item.rarity).replace('text-', 'bg-').replace('border-', '').replace('-400', '-900/50').replace('-500', '-900/50')}`}>
                            {getTypeIcon(item.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-bold ${getRarityColor(item.rarity).split(' ')[0]}`}>
                              {item.name}
                            </h3>
                            <p className="text-xs text-gray-400 capitalize mb-2">
                              {item.rarity} {item.type}
                            </p>
                            <p className="text-sm text-gray-300 mb-2">
                              {item.description}
                            </p>
                            
                            {item.value && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-yellow-400">Value: {item.value}</span>
                                {item.discoveredAt && (
                                  <span className="text-gray-500">Found in {item.discoveredAt}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'codex' && (
            <div className="h-full p-4 overflow-y-auto">
              <div className="text-center text-gray-500 mt-8">
                <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Codex entries unlock as you discover items with lore</p>
                <div className="mt-6 space-y-4">
                  {inventory.filter(item => item.loreEntry).map(item => (
                    <div key={item.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <h3 className="font-bold text-yellow-400 mb-2">{item.name}</h3>
                      <p className="text-gray-300 text-sm">{item.loreEntry}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'combine' && (
            <div className="h-full p-4 overflow-y-auto">
              <div className="text-center text-gray-500 mt-8">
                <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Crafting system coming soon!</p>
                <p className="text-sm mt-1">Combine materials to create powerful artifacts</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionDisplay;
