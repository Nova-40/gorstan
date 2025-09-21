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
}

export const MenuCard: React.FC<MenuCardProps> = ({ title, subtitle, icon, children, footer, className, onActivate }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!onActivate) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate(e);
    }
  };

  return (
    <Card
      className={`p-4 ${className || ''}`}
      padding="md"
      onClick={onActivate}
    >
      {title && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon && <div className="w-8 h-8 text-cyan-400">{icon}</div>}
              <div>
                <div className="font-semibold">{title}</div>
                {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
              </div>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export default MenuCard;
