/**
 * Class Name Utility
 * Combines class names conditionally
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[];

/**
 * Simple utility function to conditionally combine class names
 */
export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ');
}

/**
 * Utility function to create consistent focus ring styles
 */
export function focusRing(color: string = 'primary-500'): string {
  return `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}`;
}

/**
 * Utility function for consistent transition styles
 */
export function transition(properties: string = 'all', duration: string = '150ms'): string {
  return `transition-${properties} duration-${duration} ease-out`;
}
