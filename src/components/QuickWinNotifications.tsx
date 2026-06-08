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

import React, { useState, useEffect } from 'react';
import { X, Trophy, Star, Target, MapPin, Heart, Zap, Gift } from 'lucide-react';

export interface NotificationData {
  id: string;
  type:
    | 'achievement'
    | 'score_milestone'
    | 'room_discovery'
    | 'puzzle_solved'
    | 'relationship_improved'
    | 'level_up'
    | 'item_collected';
  title: string;
  description: string;
  points?: number;
  icon?: React.ReactNode;
  color?: string;
  duration?: number; // ms, defaults to 4000
}

interface NotificationProps {
  notification: NotificationData;
  onDismiss: (id: string) => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Fade in
    setTimeout(() => setIsVisible(true), 100);

    // Auto-dismiss
    const timer = setTimeout(() => {
      handleDismiss();
    }, notification.duration || 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300);
  };

  const getIcon = () => {
    if (notification.icon) {
      return notification.icon;
    }

    switch (notification.type) {
      case 'achievement':
        return <Trophy className="w-5 h-5" />;
      case 'score_milestone':
        return <Star className="w-5 h-5" />;
      case 'room_discovery':
        return <MapPin className="w-5 h-5" />;
      case 'puzzle_solved':
        return <Target className="w-5 h-5" />;
      case 'relationship_improved':
        return <Heart className="w-5 h-5" />;
      case 'level_up':
        return <Zap className="w-5 h-5" />;
      case 'item_collected':
        return <Gift className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const getColorClasses = () => {
    if (notification.color) {
      return notification.color;
    }

    switch (notification.type) {
      case 'achievement':
        return 'border-yellow-500 bg-yellow-900/20 text-yellow-300';
      case 'score_milestone':
        return 'border-purple-500 bg-purple-900/20 text-purple-300';
      case 'room_discovery':
        return 'border-blue-500 bg-blue-900/20 text-blue-300';
      case 'puzzle_solved':
        return 'border-green-500 bg-green-900/20 text-green-300';
      case 'relationship_improved':
        return 'border-pink-500 bg-pink-900/20 text-pink-300';
      case 'level_up':
        return 'border-orange-500 bg-orange-900/20 text-orange-300';
      case 'item_collected':
        return 'border-cyan-500 bg-cyan-900/20 text-cyan-300';
      default:
        return 'border-gray-500 bg-gray-900/20 text-gray-300';
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out border-l-4 bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 shadow-lg
        ${getColorClasses()}
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isLeaving ? 'scale-95' : 'scale-100'}
        hover:scale-105 cursor-pointer
      `}
      onClick={handleDismiss}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold">{notification.title}</h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-1">{notification.description}</p>

          {notification.points && (
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-medium text-yellow-400">
                +{notification.points} points
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface QuickWinNotificationsProps {
  className?: string;
}

export const QuickWinNotifications: React.FC<QuickWinNotificationsProps> = ({ className = '' }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // Global notification listener
  useEffect(() => {
    const handleNotification = (event: CustomEvent<NotificationData>) => {
      const newNotification = { ...event.detail, id: Date.now().toString() };
      window.setTimeout(() => {
        setNotifications((prev) => [...prev, newNotification]);
      }, 0);
    };

    window.addEventListener('gorstan-notification' as any, handleNotification);
    return () => window.removeEventListener('gorstan-notification' as any, handleNotification);
  }, []);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className={`fixed top-4 right-4 z-50 space-y-2 max-w-sm ${className}`}>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onDismiss={dismissNotification}
        />
      ))}
    </div>
  );
};

// Utility function to trigger notifications
export const showNotification = (notification: Omit<NotificationData, 'id'>) => {
  if (typeof window === 'undefined') {
    return;
  }

  const event = new CustomEvent('gorstan-notification', { detail: notification });
  window.dispatchEvent(event);
};

export default QuickWinNotifications;
