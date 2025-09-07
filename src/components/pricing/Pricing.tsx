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

import React from 'react';
import { track } from '@/lib/analytics';

const tiers = [
  { 
    id: 'demo', 
    name: 'Demo', 
    price: 'Free', 
    period: '',
    icon: '🎮',
    perks: ['12‑minute slice', 'Hints & skips', 'Core gameplay'], 
    cta: 'Play Demo', 
    paid: false,
    popular: false
  },
  { 
    id: 'supporter', 
    name: 'Supporter', 
    price: '£5', 
    period: '/mo',
    icon: '💎',
    perks: ['Full game access', 'All features unlocked', 'Discord community', 'Cancel anytime'], 
    cta: 'Become Supporter', 
    paid: true,
    popular: true
  },
  { 
    id: 'founder', 
    name: 'Founder', 
    price: '£12', 
    period: '/mo',
    icon: '👑',
    perks: ['All Supporter perks', 'Name in credits', 'Early access content', 'Direct developer feedback'], 
    cta: 'Become Founder', 
    paid: true,
    popular: false
  }
];

export const Pricing: React.FC = () => (
  <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-black via-zinc-900 to-indigo-950 text-white">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-4">
          Choose Your Adventure
        </h2>
        <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
          Support indie game development and unlock the full Gorstan experience
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {tiers.map(tier => (
          <div 
            key={tier.id} 
            className={`relative p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col ${
              tier.popular 
                ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30 shadow-lg shadow-amber-500/20' 
                : 'bg-zinc-800/30 border-zinc-700/50 hover:border-zinc-600/50'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  ⭐ Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">{tier.icon}</div>
              <h3 className="text-2xl font-bold mb-2 text-amber-300">{tier.name}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.period && <span className="text-zinc-400">{tier.period}</span>}
              </div>
            </div>
            
            <ul className="text-zinc-300 space-y-3 mb-8 flex-1">
              {tier.perks.map(perk => (
                <li key={perk} className="flex items-center gap-3">
                  <span className="text-green-400 text-lg">✓</span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={() => {
                track('pricing_cta_click', { tier: tier.id });
                if (tier.paid) {
                  document.getElementById('unlock')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // Scroll to demo or start demo
                  document.dispatchEvent(new CustomEvent('start-demo'));
                }
              }}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                tier.popular
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-lg hover:shadow-xl hover:shadow-amber-500/25'
                  : tier.paid
                    ? 'bg-zinc-700 hover:bg-zinc-600 text-white border border-zinc-600 hover:border-zinc-500'
                    : 'bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-300 border border-zinc-600/50 hover:border-zinc-500/50'
              }`}
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <div className="inline-flex items-center gap-3 bg-zinc-800/50 rounded-full px-6 py-3 border border-zinc-700/50">
          <span className="text-green-400">🔒</span>
          <span className="text-sm text-zinc-300">Secure payments • Cancel anytime • 30-day satisfaction guarantee</span>
        </div>
      </div>
    </div>
  </section>
);

export default Pricing;
