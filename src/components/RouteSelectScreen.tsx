/**
 * Route Selection Screen Component
 * Primary interface for choosing game routes with time-boxed adventures
 */

import React, { useState, useEffect } from 'react';
import { type RouteId } from '../types/routes';
import { getRoutesByCategory } from '../routes/manifest';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { RouteBadge } from './ui/RouteBadge';
import { Countdown } from './ui/Countdown';
import { cn } from '../utils/cn';
import '../ui/theme.css';

interface RouteSelectScreenProps {
  onRouteSelect: (routeId: RouteId) => void;
  onCancel?: () => void;
  className?: string;
}

export const RouteSelectScreen: React.FC<RouteSelectScreenProps> = ({ onRouteSelect, className }) => {
  const [selectedCategory, setSelectedCategory] = useState<'demo' | 'short10' | 'short30' | 'full' | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteId | null>(null);
  // Compact view toggles (featured & demos removed per request)
  const routeCategories = getRoutesByCategory();

  const handleCategorySelect = (category: 'demo' | 'short10' | 'short30' | 'full') => { setSelectedCategory(category); setSelectedRoute(null); };
  const handleRouteSelect = (routeId: RouteId) => setSelectedRoute(routeId);
  const handleStartAdventure = () => { if (selectedRoute) onRouteSelect(selectedRoute); };
  const handleBackToCategories = () => { setSelectedCategory(null); setSelectedRoute(null); };

  // CATEGORY SELECTION MODE -------------------------------------------------
  if (!selectedCategory) {
    const categories: Array<{ id: 'demo'|'short10'|'short30'|'full'; title: string; subtitle: string; desc: string; seconds?: number; meta?: string[] }>= [
      { id: 'demo', title: 'Guided Intro', subtitle: 'Assisted Walkthrough', desc: 'A training-focused guided walkthrough introducing core mechanics & interface with contextual tips.', seconds: 420, meta: ['Training','New Player'] },
      { id: 'short10', title: 'Short Adventures', subtitle: 'Quick Play', desc: `${routeCategories.short10.length} focused ~10 minute adventures (Rune Sprint, Catacomb Dash & more).`, seconds: 600, meta: ['Fast Session'] },
      { id: 'short30', title: 'Medium Adventures', subtitle: 'Extended Play', desc: `${routeCategories.short30.length} immersive ~30 minute stories with richer arcs.`, seconds: 1800, meta: ['Narrative Depth'] },
      { id: 'full', title: 'Full Game Experience', subtitle: 'Complete', desc: 'The entire canonical journey with all quests, rooms & secrets.', meta: ['No Time Limit'] },
    ];
    const [focusIndex, setFocusIndex] = useState(0);

    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if (selectedCategory) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); setFocusIndex(i => (i + 1) % categories.length); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); setFocusIndex(i => (i - 1 + categories.length) % categories.length); }
  else if (e.key === 'Enter') { e.preventDefault(); const c = categories[focusIndex]; if (c) handleCategorySelect(c.id); }
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }, [selectedCategory, focusIndex]);

    return (
      <div className="min-h-screen flex items-start justify-center pt-4 bg-[#060f17] font-mono text-green-300">
        <div className={cn('w-full max-w-5xl px-6 pt-3 pb-6 rounded-2xl border border-green-400 bg-[#101B24] shadow-xl flex flex-col', className)}>
          <header className="text-center pb-2 border-b border-green-800/50">
            <h1 className="text-[1.55rem] font-bold mb-0.5 tracking-wide">Choose Your Adventure</h1>
            <p className="text-[10px] text-green-400/70">Select an adventure type (guided & timed modes)</p>
          </header>
          <div className="mt-3 space-y-5" role="region" aria-label="Adventure selection">

            {/* Categories */}
            <section aria-labelledby="categories-heading" className="space-y-3 pt-0">
              <h2 id="categories-heading" className="text-[13px] font-semibold text-green-300 text-center tracking-wide uppercase tracking-wider">Modes & Timed Routes</h2>
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-3" role="list">
                {categories.map((cat, idx) => (
                  <li key={cat.id} role="listitem">
                    <Card
                      variant="elevated"
                      tabIndex={0}
                      aria-label={`${cat.title} category`}
                      onFocus={() => setFocusIndex(idx)}
                      className={cn('cursor-pointer transition-shadow duration-200 bg-[#0b141d] border border-green-700/40 rounded-md h-full flex flex-col min-h-[150px] group', focusIndex === idx ? 'outline outline-2 outline-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.35)]' : 'hover:border-green-400/60 hover:shadow-[0_0_10px_rgba(16,185,129,0.25)]')}
                      onClick={() => handleCategorySelect(cat.id)}
                    >
                      <div className="p-3 flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-1 text-[9px] flex-wrap justify-between">
                          <span className="px-1.5 py-0.5 rounded bg-cyan-800/40 border border-cyan-500/40 flex items-center gap-1"><RouteBadge routeType={cat.id === 'full' ? 'full' : cat.id} /><span className="hidden md:inline">{cat.subtitle}</span></span>
                          {cat.seconds && <span className="px-1.5 py-0.5 rounded bg-emerald-800/40 border border-emerald-500/40 tabular-nums">{cat.seconds/60}m</span>}
                        </div>
                        <h3 className="text-[12px] font-semibold text-green-200 tracking-wide leading-tight">{cat.title}</h3>
                        <p className="text-[10px] text-green-400/70 leading-snug line-clamp-2 flex-1">{cat.desc}</p>
                        <div className="flex items-center justify-between text-[9px] text-green-500/60 pt-0.5">
                          {cat.seconds ? <Countdown totalSeconds={cat.seconds} warningThreshold={Math.round(cat.seconds/3)} className="text-inherit" /> : <span className="opacity-60">No limit</span>}
                          <span className="opacity-70 group-hover:text-green-300 transition-colors">Enter ▶</span>
                        </div>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>

            {/* Additional demo/extended sections removed per request */}
          </div>
          {/* Footer & return button removed to keep frame minimal */}
        </div>
      </div>
    );
  }

  // Route selection within category
  const categoryRoutes = routeCategories[selectedCategory];
  const categoryTitles = {
    demo: 'Guided Intro',
  short10: 'Short Adventures',
  short30: 'Medium Adventures',
    full: 'Full Game Experience'
  };

  if (selectedCategory === 'demo' || selectedCategory === 'full') {
    // Single route categories - auto-select
    const route = categoryRoutes[0];
    if (!route) {
      return (
        <div className={cn('p-6 text-center text-red-400', className)}>
          No route available in this category.
          <Button className="mt-4" onClick={handleBackToCategories}>Back</Button>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-start justify-center pt-14 bg-[#060f17] font-mono text-green-300">
        <div className="w-full max-w-3xl px-8 pt-6 pb-10 rounded-2xl border border-green-400 bg-[#101B24] shadow-xl">
          <div className="text-center mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBackToCategories}
              className="mb-4 text-green-300 hover:text-emerald-400"
            >
              ← Back to Categories
            </Button>
            <h1 className="text-2xl font-bold mb-2 tracking-wide">
              {categoryTitles[selectedCategory]}
            </h1>
          </div>

          <Card variant="elevated" className="p-6 bg-[#0a131e]/80 border border-green-600/40 rounded-xl">
          <div className="flex items-center gap-space-3 mb-space-4">
            <RouteBadge routeType={route.id.startsWith('short10') ? 'short10' : route.id.startsWith('short30') ? 'short30' : route.id as 'demo' | 'full'} />
            <Badge variant={route.difficulty === 'story' ? 'success' : 'primary'}>
              {route.difficulty === 'story' ? 'Story Mode' : 'Normal'}
            </Badge>
          </div>
          
          <h3 className="text-xl font-semibold text-green-200 mb-3">
            {route.label}
          </h3>
          
          <p className="text-sm text-green-400/70 mb-4 leading-relaxed">
            {route.description}
          </p>

          <div className="flex flex-wrap gap-space-2 mb-space-6 text-body-sm text-color-text-tertiary">
            {route.targetMinutes < 999 && (
              <span>Target: {route.targetMinutes} minutes</span>
            )}
            <span>•</span>
            <span>Hints: {route.hintPolicy}</span>
            <span>•</span>
            <span>Skips: {route.allowedSkips}</span>
            {route.enableFastTravel && (
              <>
                <span>•</span>
                <span>Fast travel enabled</span>
              </>
            )}
          </div>

          <div className="flex gap-space-3">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => onRouteSelect(route.id)}
              className="flex-1"
            >
              Start Adventure
            </Button>
            <Button 
              variant="outline" 
              onClick={handleBackToCategories}
            >
              Back
            </Button>
          </div>
          </Card>
        </div>
      </div>
    );
  }

  // Multiple route selection (short10 => Short, short30 => Medium)
  return (
    <div className="min-h-screen flex items-start justify-center pt-10 bg-[#060f17] font-mono text-green-300">
      <div className={cn('w-full max-w-5xl px-8 pt-6 pb-10 rounded-2xl border border-green-400 bg-[#101B24] shadow-xl flex flex-col gap-8', className)}>
      <div className="text-center">
        <Button 
          variant="ghost" 
          onClick={handleBackToCategories}
          className="mb-4 text-green-300 hover:text-emerald-400"
        >
          ← Back to Categories
        </Button>
        <h1 className="text-3xl font-bold mb-2 text-green-300 tracking-wide">
          {categoryTitles[selectedCategory]}
        </h1>
        <p className="text-sm text-green-500/70">
          Choose your preferred adventure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categoryRoutes.map((route) => (
          <Card 
            key={route.id}
            variant={selectedRoute === route.id ? "elevated" : "outlined"}
            className={cn(
              'cursor-pointer transition-all duration-300 bg-[#0a131e]/80 border border-green-600/30 hover:border-green-400/40 rounded-lg',
              selectedRoute === route.id 
                ? 'ring-2 ring-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.35)]' 
                : 'hover:shadow-[0_0_12px_rgba(16,185,129,0.25)]'
            )}
            onClick={() => handleRouteSelect(route.id)}
          >
            <div className="p-5">
              <div className="flex items-center gap-space-3 mb-space-3">
                <RouteBadge routeType={route.id.startsWith('short10') ? 'short10' : 'short30'} />
                <Badge variant={
                  route.difficulty === 'story' ? 'success' :
                  route.difficulty === 'veteran' ? 'warning' :
                  'primary'
                }>
                  {route.difficulty === 'story' ? 'Story' :
                   route.difficulty === 'veteran' ? 'Veteran' : 'Normal'}
                </Badge>
              </div>
              
              <h3 className="text-lg font-semibold text-green-200 mb-2 tracking-wide">
                {route.label}
              </h3>
              
              <p className="text-xs text-green-400/70 mb-3 leading-relaxed">
                {route.description}
              </p>

              <div className="flex flex-wrap gap-2 text-[10px] text-green-500/60">
                <span>Target: {route.targetMinutes}m</span>
                <span>•</span>
                <span>Hints: {route.hintPolicy}</span>
                <span>•</span>
                <span>Skips: {route.allowedSkips}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedRoute && (
        <div className="flex gap-4 justify-center">
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleStartAdventure}
            className="bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/40 shadow-md shadow-emerald-500/20"
          >
            Start Adventure
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setSelectedRoute(null)}
            className="border-green-500/40 text-green-300 hover:bg-slate-800/60"
          >
            Clear Selection
          </Button>
        </div>
      )}
      </div>
    </div>
  );
};
