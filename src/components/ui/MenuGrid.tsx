import React from 'react';

export interface MenuGridProps {
  children?: React.ReactNode;
  className?: string;
  cols?: number;
}

export const MenuGrid: React.FC<MenuGridProps> = ({ children, className, cols = 3 }) => {
  const colClass = cols === 1 ? 'grid-cols-1' : cols === 2 ? 'grid-cols-2' : 'grid-cols-3';
  return (
    <div className={`grid ${colClass} gap-4 mx-auto ${className || ''}`}>{children}</div>
  );
};

export default MenuGrid;
