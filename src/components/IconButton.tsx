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

// Gorstan and characters (c) Geoff Webster 2025
// Game module.

type IconButtonProps = {
  icon: React.ReactNode;
  label?: string;
  title?: string;
  ariaLabel?: string;
  tooltipContent?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  attention?: boolean;
  badgeContent?: React.ReactNode;
  className?: string;
};

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  title,
  ariaLabel,
  tooltipContent,
  onClick,
  disabled,
  active = false,
  attention = false,
  badgeContent,
  className = '',
}) => {
  // JSX return block or main return
  return (
    <span className="group relative inline-flex">
      <button
        className={`inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl p-2 text-green-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-30 ${
          active
            ? 'bg-green-900 text-green-100 shadow-[0_0_0_1px_rgba(74,222,128,0.2)]'
            : attention
              ? 'bg-green-950/80 text-green-100 shadow-[0_0_0_1px_rgba(74,222,128,0.18)] hover:bg-green-900'
              : 'bg-transparent hover:bg-green-800'
        } ${className}`}
        onClick={onClick}
        title={title || label}
        disabled={disabled}
        aria-label={ariaLabel || label}
        type="button"
      >
        {icon}
      </button>
      {tooltipContent && (
        <span className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-50 hidden w-max max-w-[14rem] -translate-x-1/2 rounded-xl border border-green-400/20 bg-[rgba(5,10,18,0.82)] px-3 py-2 text-xs leading-5 text-green-50 shadow-2xl backdrop-blur-md group-hover:block group-focus-within:block">
          {tooltipContent}
        </span>
      )}
      {badgeContent !== undefined && badgeContent !== null && badgeContent !== '' && (
        <span className="pointer-events-none absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full border border-black/70 bg-amber-400 px-1 text-[10px] font-semibold leading-none text-black shadow-sm">
          {badgeContent}
        </span>
      )}
    </span>
  );
};

export default IconButton;
