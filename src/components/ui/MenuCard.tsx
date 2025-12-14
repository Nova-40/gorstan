import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './Card';

export interface MenuCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  onActivate?: (e?: any) => void;
  variant?: 'default' | 'adventure' | 'compact';
  cover?: string;
}

export const MenuCard: React.FC<MenuCardProps> = ({ title, subtitle, icon, children, footer, className, onActivate, variant = 'default', cover }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!onActivate) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate(e);
    }
  };

  return (
    <Card
      role={onActivate ? 'button' : undefined}
      tabIndex={onActivate ? 0 : undefined}
      aria-pressed={onActivate ? false : undefined}
      className={`menu-card ${className || ''} card-root card-centered ${variant === 'compact' ? 'card-compact' : ''} ${variant === 'adventure' ? 'menu-card--adventure' : ''}`}
      padding="md"
      onClick={onActivate}
      onKeyDown={handleKeyDown}
    >
      {cover && (
        <div className="menu-card-cover mb-3 w-full h-36 rounded-md overflow-hidden">
          <img src={cover} alt={title || 'cover'} className="w-full h-full object-cover" />
        </div>
      )}
      {title && (
        <CardHeader>
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              {icon && <div className="w-8 h-8 menu-card-icon" aria-hidden>{icon}</div>}
              <div>
                <h3 className="menu-card-title text-crt-green text-center w-full">{title}</h3>
                {subtitle && <div className="menu-card-subtitle text-xs text-crt-green/80 text-center">{subtitle}</div>}
              </div>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className="menu-card-content">{children}</CardContent>
      {footer && <CardFooter className="menu-card-footer">{footer}</CardFooter>}
    </Card>
  );
};

export default MenuCard;
