/**
 * Route Selection Screen Component
 * Primary interface for choosing game routes with time-boxed adventures
 */

import React, { useState } from 'react';
import { type RouteId } from '../types/routes';
import { getRoutesByCategory } from '../routes/manifest';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { RouteBadge } from './ui/RouteBadge';
import { Countdown } from './ui/Countdown';
import { cn } from '../utils/cn';
import { startDemo, demoRoutes } from '../demo/demoRouter';
import '../ui/theme.css';

interface RouteSelectScreenProps {
  onRouteSelect: (routeId: RouteId) => void;
  onCancel?: () => void;
  className?: string;
}

export const RouteSelectScreen: React.FC<RouteSelectScreenProps> = ({
  onRouteSelect,
  onCancel,
  className,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'demo' | 'short10' | 'short30' | 'full' | null
  >(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteId | null>(null);

  const routeCategories = getRoutesByCategory();

  const handleCategorySelect = (category: 'demo' | 'short10' | 'short30' | 'full') => {
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

  // Demo route handler
  const handleDemoStart = (demoRouteId: string) => {
    console.log(`[RouteSelectScreen] Starting demo route: ${demoRouteId}`);
    startDemo(demoRouteId);

    // If we have a route select handler, we might want to notify it
    // For now, let the demo system handle everything
  };

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

        {/* Featured Master Showcase */}
        {demoRoutes
          .filter((route) => route.kind === 'featured')
          .map((route) => (
            <Card
              key={route.id}
              variant="elevated"
              className={cn(
                'featured-showcase cursor-pointer',
                'hover:shadow-elevation-xl transition-all duration-300',
                'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200',
              )}
              onClick={() => handleDemoStart(route.id)}
            >
              <div className="p-space-8">
                <div className="flex items-center justify-center gap-space-3 mb-space-4">
                  <Badge variant="success" className="text-sm font-semibold">
                    ⭐ FEATURED
                  </Badge>
                  <Badge variant="primary" className="text-sm">
                    ~15 minutes
                  </Badge>
                  <Badge variant="info" className="text-sm">
                    Complete Tour
                  </Badge>
                </div>
                <div className="text-center">
                  <h2 className="text-heading-lg font-bold text-color-text-primary mb-space-3">
                    {route.title}
                  </h2>
                  <p className="text-body-lg text-color-text-secondary mb-space-6 max-w-2xl mx-auto">
                    {route.summary}
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    className="px-space-8 py-space-3 text-lg font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDemoStart(route.id);
                    }}
                  >
                    🎮 Start Master Showcase
                  </Button>
                </div>
              </div>
            </Card>
          ))}

        <div className="text-center">
          <h2 className="text-heading-md font-semibold text-color-text-primary mb-space-1">
            Or Choose by Time Available
          </h2>
          <p className="text-body-sm text-color-text-secondary mb-space-4">
            Select from these focused adventure categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-4">
          {/* Demo Card */}
          <Card
            variant="elevated"
            className="cursor-pointer hover:shadow-elevation-lg transition-shadow duration-300"
            onClick={() => handleCategorySelect('demo')}
          >
            <div className="p-space-6">
              <div className="flex items-center gap-space-3 mb-space-4">
                <RouteBadge routeType="demo" />
                <Badge variant="success">New Player Friendly</Badge>
              </div>
              <h3 className="text-heading-sm font-semibold text-color-text-primary mb-space-2">
                Demo Experience
              </h3>
              <p className="text-body-sm text-color-text-secondary mb-space-4">
                A guided 5-7 minute introduction to Gorstan with hints and an artifact teaser.
                Perfect for first-time players.
              </p>
              <div className="flex items-center gap-space-2 text-color-text-tertiary text-body-xs">
                <Countdown totalSeconds={420} warningThreshold={120} className="text-inherit" />
                <span>•</span>
                <span>Guided experience</span>
              </div>
            </div>
          </Card>

          {/* 10-Minute Adventures Card */}
          <Card
            variant="elevated"
            className="cursor-pointer hover:shadow-elevation-lg transition-shadow duration-300"
            onClick={() => handleCategorySelect('short10')}
          >
            <div className="p-space-6">
              <div className="flex items-center gap-space-3 mb-space-4">
                <RouteBadge routeType="short10" />
                <Badge variant="primary">Quick Play</Badge>
              </div>
              <h3 className="text-heading-sm font-semibold text-color-text-primary mb-space-2">
                10-Minute Adventures
              </h3>
              <p className="text-body-sm text-color-text-secondary mb-space-4">
                Four focused adventures: Rune Sprint, Catacomb Dash, Fae Glade Relay, and Trials of
                Gorstan. Perfect for coffee breaks.
              </p>
              <div className="flex items-center gap-space-2 text-color-text-tertiary text-body-xs">
                <Countdown totalSeconds={600} warningThreshold={180} className="text-inherit" />
                <span>•</span>
                <span>{routeCategories.short10.length} adventures</span>
              </div>
            </div>
          </Card>

          {/* 30-Minute Adventures Card */}
          <Card
            variant="elevated"
            className="cursor-pointer hover:shadow-elevation-lg transition-shadow duration-300"
            onClick={() => handleCategorySelect('short30')}
          >
            <div className="p-space-6">
              <div className="flex items-center gap-space-3 mb-space-4">
                <RouteBadge routeType="short30" />
                <Badge variant="secondary">Extended Play</Badge>
              </div>
              <h3 className="text-heading-sm font-semibold text-color-text-primary mb-space-2">
                30-Minute Adventures
              </h3>
              <p className="text-body-sm text-color-text-secondary mb-space-4">
                Four immersive stories: Trent Park Recon, Control Nexus Gauntlet, Glitch Realm
                Heist, and The Fae Bargain. Rich narratives with multiple challenges.
              </p>
              <div className="flex items-center gap-space-2 text-color-text-tertiary text-body-xs">
                <Countdown totalSeconds={1800} warningThreshold={600} className="text-inherit" />
                <span>•</span>
                <span>{routeCategories.short30.length} adventures</span>
              </div>
            </div>
          </Card>

          {/* Full Game Card */}
          <Card
            variant="elevated"
            className="cursor-pointer hover:shadow-elevation-lg transition-shadow duration-300"
            onClick={() => handleCategorySelect('full')}
          >
            <div className="p-space-6">
              <div className="flex items-center gap-space-3 mb-space-4">
                <RouteBadge routeType="full" />
                <Badge variant="warning">Complete Experience</Badge>
              </div>
              <h3 className="text-heading-sm font-semibold text-color-text-primary mb-space-2">
                Full Game Experience
              </h3>
              <p className="text-body-sm text-color-text-secondary mb-space-4">
                The complete Gorstan adventure with all original puzzles, quests, and story
                elements. Unchanged canonical experience.
              </p>
              <div className="flex items-center gap-space-2 text-color-text-tertiary text-body-xs">
                <span>No time limit</span>
                <span>•</span>
                <span>Full story arc</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Demo Routes Section */}
        <div className="border-t border-gray-200 pt-space-6">
          <div className="text-center mb-space-4">
            <h2 className="text-heading-md font-semibold text-color-text-primary mb-space-2">
              Quick Demo Routes
            </h2>
            <p className="text-body-sm text-color-text-secondary">
              Experience Gorstan with curated demo adventures
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-3">
            {demoRoutes
              .filter((route) => route.kind === 'short')
              .map((route) => (
                <Card
                  key={route.id}
                  variant="elevated"
                  className={cn(
                    'adventure-card demo-short cursor-pointer',
                    'hover:shadow-elevation-lg transition-all duration-300',
                  )}
                  onClick={() => handleDemoStart(route.id)}
                >
                  <div className="p-space-4">
                    <div className="flex items-center gap-space-2 mb-space-2">
                      <Badge variant="info" className="text-xs">
                        Demo
                      </Badge>
                      <Badge variant="success" className="text-xs">
                        ~10min
                      </Badge>
                    </div>
                    <h3 className="text-heading-xs font-semibold text-color-text-primary mb-space-1">
                      {route.title}
                    </h3>
                    <p className="text-body-xs text-color-text-secondary mb-space-3">
                      {route.summary}
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      className="adventure-button w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDemoStart(route.id);
                      }}
                    >
                      Start Demo
                    </Button>
                  </div>
                </Card>
              ))}
          </div>

          <div className="mt-space-4">
            <h3 className="text-heading-sm font-medium text-color-text-primary mb-space-3 text-center">
              Extended Adventures
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-3">
              {demoRoutes
                .filter((route) => route.kind === 'long')
                .map((route) => (
                  <Card
                    key={route.id}
                    variant="elevated"
                    className={cn(
                      'adventure-card demo-long cursor-pointer',
                      'hover:shadow-elevation-lg transition-all duration-300',
                    )}
                    onClick={() => handleDemoStart(route.id)}
                  >
                    <div className="p-space-4">
                      <div className="flex items-center gap-space-2 mb-space-2">
                        <Badge variant="secondary" className="text-xs">
                          Adventure
                        </Badge>
                        <Badge variant="warning" className="text-xs">
                          ~30min
                        </Badge>
                      </div>
                      <h3 className="text-heading-xs font-semibold text-color-text-primary mb-space-1">
                        {route.title}
                      </h3>
                      <p className="text-body-xs text-color-text-secondary mb-space-3">
                        {route.summary}
                      </p>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="adventure-button w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDemoStart(route.id);
                        }}
                      >
                        Start Adventure
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </div>

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
  const categoryRoutes = routeCategories[selectedCategory];
  const categoryTitles = {
    demo: 'Demo Experience',
    short10: '10-Minute Adventures',
    short30: '30-Minute Adventures',
    full: 'Full Game Experience',
  };

  if (selectedCategory === 'demo' || selectedCategory === 'full') {
    // Single route categories - auto-select
    const route = categoryRoutes[0];
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
        {categoryRoutes.map((route) => (
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
