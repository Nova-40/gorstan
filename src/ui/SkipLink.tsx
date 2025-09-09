import React from 'react';

interface SkipLinkProps {
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function SkipLink({
  href = '#main-content',
  className = '',
  children = 'Skip to main content',
}: SkipLinkProps) {
  const skipLinkStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-40px',
    left: '6px',
    background: '#000',
    color: '#fff',
    padding: '8px',
    textDecoration: 'none',
    zIndex: 100000,
    fontSize: '14px',
    borderRadius: '4px',
    border: '2px solid #fff',
    transition: 'top 0.3s ease',
  };

  const skipLinkFocusStyles: React.CSSProperties = {
    top: '6px',
  };

  return (
    <a
      href={href}
      className={`skip-link ${className}`}
      style={skipLinkStyles}
      onFocus={(e) => {
        Object.assign(e.currentTarget.style, skipLinkFocusStyles);
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-40px';
      }}
    >
      {children}
    </a>
  );
}
