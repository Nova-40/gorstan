/**
 * Route Selection Screen Component
 * Primary interface for choosing game routes with time-boxed adventures
 */

import React, { useState } from 'react';
import { type RouteId } from '../types/routes';
import { getRoutesByCategory } from '../routes/manifest';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import MenuCard from './ui/MenuCard';
import MenuGrid from './ui/MenuGrid';
import { Badge } from './ui/Badge';
import { RouteBadge } from './ui/RouteBadge';
import { Countdown } from './ui/Countdown';
import { cn } from '../utils/cn';
// Demos moved to DemoScreen; demoRouter/demoService not used here anymore
import '../ui/theme.css';

interface RouteSelectScreenProps {
  onRouteSelect: (routeId: RouteId) => void;
  onCancel?: () => void;
  onLoadGame?: () => void;
  className?: string;
}

export const RouteSelectScreen: React.FC<RouteSelectScreenProps> = ({
  onRouteSelect,
  onCancel,
  onLoadGame,
  className,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'short10' | 'short30' | 'full' | null
  >(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteId | null>(null);

  const routeCategories = getRoutesByCategory();

  const handleCategorySelect = (category: 'short10' | 'short30' | 'full') => {
    setSelectedCategory(category);
    setSelectedRoute(null);
  };

  const handleRouteSelect = (routeId: RouteId) => {
    setSelectedRoute(routeId);
  };

  const handleStartAdventure = () => {
    if (selectedRoute) {
      onRouteSelect(selectedRoute);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedRoute(null);
  };

  // demo handling removed — demo routes are presented on the Welcome Demo screen

  // Category selection view
  if (!selectedCategory) {
    return (
      <div
        className={cn(
          'choose-adventure-container',
          'route-select-screen',
          'flex flex-col gap-space-6 p-space-6 max-w-4xl mx-auto',
          className,
        )}
      >
        <div className="text-center">
          <h1 className="text-heading-lg font-bold text-color-text-primary mb-space-2">
            Choose Your Adventure
          </h1>
          <p className="text-body-md text-color-text-secondary">
            Select an adventure type that fits your available time
          </p>
        </div>

        {/* Featured Master Showcase removed — replaced by MORE navigation */}

        <div className="text-center">
          <h2 className="text-heading-md font-semibold text-color-text-primary mb-space-1">
            Or Choose by Time Available
          </h2>
          <p className="text-body-sm text-color-text-secondary mb-space-4">
            Select from these focused adventure categories
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-black rounded-xl p-3 border border-gray-800 shadow-lg">
          {/* Replace category cards with MenuGrid/MenuCard for consistent UI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Top five compact cards so they fit without vertical scroll */}
            {/* Demo Experience removed — demos are available from the Welcome screen Demo card */}

            <MenuCard title="10-Minute Adventures" subtitle="Quick Play" variant="adventure" cover="/images/author/starterframe.png" className="menu-card-compact text-crt-green" onActivate={() => handleCategorySelect('short10')}>
              <div className="p-2">
                <p className="text-body-sm text-color-text-secondary mb-2">Four focused adventures for short play sessions.</p>
                <div className="flex items-center gap-2 text-body-xs text-color-text-tertiary">
                  <Countdown totalSeconds={600} warningThreshold={180} className="text-inherit" />
                  <span>•</span>
                  <span>{routeCategories.short10.length} adventures</span>
                </div>
              </div>
            </MenuCard>

            <MenuCard title="30-Minute Adventures" subtitle="Extended Play" variant="adventure" cover="/images/rooms/fallback.png" className="menu-card-compact text-crt-green" onActivate={() => handleCategorySelect('short30')}>
              <div className="p-2">
                <p className="text-body-sm text-color-text-secondary mb-2">Immersive stories with richer narratives.</p>
                <div className="flex items-center gap-2 text-body-xs text-color-text-tertiary">
                  <Countdown totalSeconds={1800} warningThreshold={600} className="text-inherit" />
                  <span>•</span>
                  <span>{routeCategories.short30.length} adventures</span>
                </div>
              </div>
            </MenuCard>

            <MenuCard title="Full Game Experience" subtitle="Full Story" variant="adventure" cover="/images/gorstanicon.png" className="menu-card-compact text-crt-green" onActivate={() => handleCategorySelect('full')}>
              <div className="p-2">
                <p className="text-body-sm text-color-text-secondary mb-2">The complete Gorstan adventure with all puzzles and story elements.</p>
                <div className="flex items-center gap-2 text-body-xs text-color-text-tertiary">
                  <span>No time limit</span>
                </div>
              </div>
            </MenuCard>

            {/* Continue card moved here from the main menu */}
            {onLoadGame && (
              <MenuCard title="Continue" className="menu-card-compact text-crt-green" onActivate={() => onLoadGame && onLoadGame()}>
                <div className="p-2">
                  <p className="text-body-sm text-color-text-secondary mb-2">Resume a saved game.</p>
                  <div>
                    <Button variant="outline" onClick={() => onLoadGame && onLoadGame()}>Load / Continue</Button>
                  </div>
                </div>
              </MenuCard>
            )}
          </div>
        </div>

        {/* Demo Routes moved to dedicated DemoScreen — removed from RouteSelectScreen per UX cleanup */}

        {onCancel && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={onCancel}>
              Return to Menu
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Route selection within category
  const categoryRoutes = (selectedCategory && (routeCategories as any)[selectedCategory]) || [];
  const categoryTitles = {
    short10: '10-Minute Adventures',
    short30: '30-Minute Adventures',
    full: 'Full Game Experience',
  };

  // Quick demos removed — use the Demo screen from the Welcome menu

  if (selectedCategory === 'full') {
    // Single route categories - auto-select
    const route = categoryRoutes[0];
    if (!route) {
      // No route available for this category - go back to categories
      return (
        <div className={cn('route-select-screen', 'flex flex-col gap-space-6 p-space-6 max-w-2xl mx-auto', className)}>
          <div className="text-center">
            <Button variant="ghost" onClick={handleBackToCategories} className="mb-space-4">
              ← Back to Categories
            </Button>
            <h1 className="text-heading-lg font-bold text-color-text-primary mb-space-2">No routes available</h1>
            <p className="text-body-md text-color-text-secondary">There are currently no routes in this category.</p>
          </div>
        </div>
      );
    }
    return (
      <div
        className={cn(
          'route-select-screen',
          'flex flex-col gap-space-6 p-space-6 max-w-2xl mx-auto',
          className,
        )}
      >
        <div className="text-center">
          <Button variant="ghost" onClick={handleBackToCategories} className="mb-space-4">
            ← Back to Categories
          </Button>
          <h1 className="text-heading-lg font-bold text-color-text-primary mb-space-2">
            {categoryTitles[selectedCategory]}
          </h1>
        </div>

        <Card variant="elevated" className="p-space-6">
          <div className="flex items-center gap-space-3 mb-space-4">
            <RouteBadge
              routeType={
                route.id.startsWith('short10')
                  ? 'short10'
                  : route.id.startsWith('short30')
                    ? 'short30'
                    : (route.id as 'demo' | 'full')
              }
            />
            <Badge variant={route.difficulty === 'story' ? 'success' : 'primary'}>
              {route.difficulty === 'story' ? 'Story Mode' : 'Normal'}
            </Badge>
          </div>

          <h3 className="text-heading-md font-semibold text-color-text-primary mb-space-3">
            {route.label}
          </h3>

          <p className="text-body-md text-color-text-secondary mb-space-4">{route.description}</p>

          <div className="flex flex-wrap gap-space-2 mb-space-6 text-body-sm text-color-text-tertiary">
            {route.targetMinutes < 999 && <span>Target: {route.targetMinutes} minutes</span>}
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
            <Button variant="outline" onClick={handleBackToCategories}>
              Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Multiple route selection (short10, short30)
  return (
    <div
      className={cn(
        'route-select-screen',
        'flex flex-col gap-space-6 p-space-6 max-w-4xl mx-auto',
        className,
      )}
    >
      <div className="text-center">
        <Button variant="ghost" onClick={handleBackToCategories} className="mb-space-4">
          ← Back to Categories
        </Button>
        <h1 className="text-heading-lg font-bold text-color-text-primary mb-space-2">
          {categoryTitles[selectedCategory]}
        </h1>
        <p className="text-body-md text-color-text-secondary">Choose your preferred adventure</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-4">
  {categoryRoutes.map((route: any) => (
          <Card
            key={route.id}
            variant={selectedRoute === route.id ? 'elevated' : 'outlined'}
            className={cn(
              'cursor-pointer transition-all duration-200',
              selectedRoute === route.id
                ? 'ring-2 ring-color-primary shadow-elevation-lg'
                : 'hover:shadow-elevation-md',
            )}
            onClick={() => handleRouteSelect(route.id)}
          >
            <div className="p-space-5">
              <div className="flex items-center gap-space-3 mb-space-3">
                <RouteBadge routeType={route.id.startsWith('short10') ? 'short10' : 'short30'} />
                <Badge
                  variant={
                    route.difficulty === 'story'
                      ? 'success'
                      : route.difficulty === 'veteran'
                        ? 'warning'
                        : 'primary'
                  }
                >
                  {route.difficulty === 'story'
                    ? 'Story'
                    : route.difficulty === 'veteran'
                      ? 'Veteran'
                      : 'Normal'}
                </Badge>
              </div>

              <h3 className="text-heading-sm font-semibold text-color-text-primary mb-space-2">
                {route.label}
              </h3>

              <p className="text-body-sm text-color-text-secondary mb-space-3">
                {route.description}
              </p>

              <div className="flex flex-wrap gap-space-2 text-body-xs text-color-text-tertiary">
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
        <div className="flex gap-space-3 justify-center">
          <Button variant="primary" size="lg" onClick={handleStartAdventure}>
            Start Adventure
          </Button>
          <Button variant="outline" onClick={() => setSelectedRoute(null)}>
            Clear Selection
          </Button>
        </div>
      )}
    </div>
  );
};
