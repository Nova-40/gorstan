/**
 * Accessibility Utilities
 * Provides comprehensive accessibility features for inclusive gaming experience
 */

// Accessibility settings interface
export interface AccessibilityConfig {
  screenReader: {
    enabled: boolean;
    announceActions: boolean;
    announceMovement: boolean;
    announceStateChanges: boolean;
    speakRoomDescriptions: boolean;
    speakCombatResults: boolean;
  };
  keyboard: {
    navigationEnabled: boolean;
    shortcuts: Map<string, () => void>;
    focusVisible: boolean;
    skipLinks: boolean;
    tabTrapEnabled: boolean;
  };
  visual: {
    highContrast: boolean;
    reducedMotion: boolean;
    fontSize: 'small' | 'medium' | 'large' | 'xlarge';
    colorBlindSupport: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    focusIndicator: 'subtle' | 'normal' | 'strong';
    flashingSuppression: boolean;
  };
  audio: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    sfxEnabled: boolean;
    voiceEnabled: boolean;
    volume: number;
    audioDescriptions: boolean;
  };
  motor: {
    clickDelay: number;
    holdDuration: number;
    swipeThreshold: number;
    largerTouchTargets: boolean;
    oneHandMode: boolean;
    voiceCommands: boolean;
  };
}

// ARIA live region manager
class LiveRegionManager {
  private politeRegion!: HTMLElement;
  private assertiveRegion!: HTMLElement;
  private statusRegion!: HTMLElement;

  constructor() {
    this.createLiveRegions();
  }

  private createLiveRegions() {
    // Polite announcements (non-interrupting)
    this.politeRegion = document.createElement('div');
    this.politeRegion.setAttribute('aria-live', 'polite');
    this.politeRegion.setAttribute('aria-atomic', 'true');
    this.politeRegion.className = 'sr-only';
    
    // Assertive announcements (interrupting)
    this.assertiveRegion = document.createElement('div');
    this.assertiveRegion.setAttribute('aria-live', 'assertive');
    this.assertiveRegion.setAttribute('aria-atomic', 'true');
    this.assertiveRegion.className = 'sr-only';
    
    // Status updates
    this.statusRegion = document.createElement('div');
    this.statusRegion.setAttribute('role', 'status');
    this.statusRegion.setAttribute('aria-atomic', 'true');
    this.statusRegion.className = 'sr-only';
    
    document.body.appendChild(this.politeRegion);
    document.body.appendChild(this.assertiveRegion);
    document.body.appendChild(this.statusRegion);
  }

  announcePolite(message: string) {
    this.politeRegion.textContent = message;
  }

  announceAssertive(message: string) {
    this.assertiveRegion.textContent = message;
  }

  announceStatus(message: string) {
    this.statusRegion.textContent = message;
  }

  clear() {
    this.politeRegion.textContent = '';
    this.assertiveRegion.textContent = '';
    this.statusRegion.textContent = '';
  }
}

// Screen reader utilities
export class ScreenReaderSupport {
  private liveRegion: LiveRegionManager;
  private speechSynthesis: SpeechSynthesis | null;

  constructor() {
    this.liveRegion = new LiveRegionManager();
    this.speechSynthesis = window.speechSynthesis || null;
  }

  // Announce game state changes
  announceRoomEntry(roomName: string, description: string) {
    const message = `Entered ${roomName}. ${description}`;
    this.liveRegion.announcePolite(message);
    this.speak(message);
  }

  announceAction(action: string, result: string) {
    const message = `${action}. ${result}`;
    this.liveRegion.announcePolite(message);
  }

  announceError(error: string) {
    const message = `Error: ${error}`;
    this.liveRegion.announceAssertive(message);
    this.speak(message, { priority: 'high' });
  }

  announceSuccess(success: string) {
    const message = `Success: ${success}`;
    this.liveRegion.announcePolite(message);
  }

  announceInventoryUpdate(item: string, action: 'added' | 'removed' | 'used') {
    const actions = {
      added: 'added to inventory',
      removed: 'removed from inventory',
      used: 'used'
    };
    const message = `${item} ${actions[action]}`;
    this.liveRegion.announcePolite(message);
  }

  announceHealthChange(currentHealth: number, maxHealth: number, change: number) {
    const direction = change > 0 ? 'increased' : 'decreased';
    const message = `Health ${direction} by ${Math.abs(change)}. Current health: ${currentHealth} out of ${maxHealth}`;
    this.liveRegion.announceStatus(message);
  }

  announceQuestUpdate(questName: string, status: string) {
    const message = `Quest update: ${questName}. ${status}`;
    this.liveRegion.announcePolite(message);
  }

  // Text-to-speech support
  speak(text: string, options: { priority?: 'low' | 'normal' | 'high'; rate?: number; pitch?: number } = {}) {
    if (!this.speechSynthesis) return;

    // Cancel current speech if high priority
    if (options.priority === 'high' && this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    
    this.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
  }

  // Describe current game state for screen readers
  describeGameState(gameState: any) {
    const elements = [];
    
    if (gameState.currentRoom) {
      elements.push(`Current location: ${gameState.currentRoom.name}`);
    }
    
    if (gameState.player?.health !== undefined) {
      elements.push(`Health: ${gameState.player.health}`);
    }
    
    if (gameState.inventory?.length > 0) {
      elements.push(`Inventory contains: ${gameState.inventory.map((item: any) => item.name).join(', ')}`);
    }
    
    if (gameState.availableActions?.length > 0) {
      elements.push(`Available actions: ${gameState.availableActions.join(', ')}`);
    }
    
    const description = elements.join('. ');
    this.liveRegion.announcePolite(description);
    return description;
  }
}

// Keyboard navigation manager
export class KeyboardNavigationManager {
  private focusableElements: HTMLElement[] = [];
  private shortcuts: Map<string, () => void> = new Map();

  constructor() {
    this.setupKeyboardListeners();
    this.createSkipLinks();
  }

  private setupKeyboardListeners() {
    document.addEventListener('keydown', (e) => {
      // Handle tab navigation
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }
      
      // Handle shortcuts
      const shortcutKey = this.getShortcutKey(e);
      if (this.shortcuts.has(shortcutKey)) {
        e.preventDefault();
        this.shortcuts.get(shortcutKey)!();
      }
      
      // Handle arrow key navigation in grid layouts
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        this.handleArrowNavigation(e);
      }
      
      // Handle escape key
      if (e.key === 'Escape') {
        this.handleEscape();
      }
    });
  }

  private createSkipLinks() {
    const skipLinksContainer = document.createElement('div');
    skipLinksContainer.className = 'skip-links';
    skipLinksContainer.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#game-area" class="skip-link">Skip to game area</a>
      <a href="#inventory" class="skip-link">Skip to inventory</a>
      <a href="#actions" class="skip-link">Skip to actions</a>
    `;
    
    // Style skip links
    const style = document.createElement('style');
    style.textContent = `
      .skip-links {
        position: absolute;
        top: -40px;
        left: 6px;
        z-index: 10000;
      }
      
      .skip-link {
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
        background: #000;
        color: #fff;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 0 0 4px 4px;
      }
      
      .skip-link:focus {
        position: static;
        width: auto;
        height: auto;
        left: auto;
        top: auto;
      }
    `;
    document.head.appendChild(style);
    document.body.insertBefore(skipLinksContainer, document.body.firstChild);
  }

  registerShortcut(key: string, callback: () => void, description: string) {
    this.shortcuts.set(key, callback);
    
    // Add to help text or shortcuts list
    const shortcutHelp = document.querySelector('#keyboard-shortcuts');
    if (shortcutHelp) {
      const shortcutElement = document.createElement('div');
      shortcutElement.textContent = `${key}: ${description}`;
      shortcutHelp.appendChild(shortcutElement);
    }
  }

  private getShortcutKey(e: KeyboardEvent): string {
    const modifiers = [];
    if (e.ctrlKey) modifiers.push('Ctrl');
    if (e.altKey) modifiers.push('Alt');
    if (e.shiftKey) modifiers.push('Shift');
    if (e.metaKey) modifiers.push('Meta');
    
    return [...modifiers, e.key].join('+');
  }

  private handleTabNavigation(e: KeyboardEvent) {
    this.updateFocusableElements();
    
    if (this.focusableElements.length === 0) return;
    
    const currentFocus = document.activeElement as HTMLElement;
    const currentIndex = this.focusableElements.indexOf(currentFocus);
    
    if (e.shiftKey) {
      // Backward navigation
      const nextIndex = currentIndex <= 0 ? this.focusableElements.length - 1 : currentIndex - 1;
      this.focusableElements[nextIndex]?.focus();
    } else {
      // Forward navigation
      const nextIndex = currentIndex >= this.focusableElements.length - 1 ? 0 : currentIndex + 1;
      this.focusableElements[nextIndex]?.focus();
    }
    
    e.preventDefault();
  }

  private handleArrowNavigation(e: KeyboardEvent) {
    const gridContainer = (e.target as HTMLElement).closest('[role="grid"], .grid-navigation');
    if (!gridContainer) return;
    
    const gridItems = Array.from(gridContainer.querySelectorAll('[tabindex]')) as HTMLElement[];
    const currentIndex = gridItems.indexOf(e.target as HTMLElement);
    
    if (currentIndex === -1) return;
    
    const columns = parseInt(gridContainer.getAttribute('data-columns') || '1');
    let nextIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowUp':
        nextIndex = currentIndex - columns;
        break;
      case 'ArrowDown':
        nextIndex = currentIndex + columns;
        break;
      case 'ArrowLeft':
        nextIndex = currentIndex - 1;
        break;
      case 'ArrowRight':
        nextIndex = currentIndex + 1;
        break;
    }
    
    if (nextIndex >= 0 && nextIndex < gridItems.length) {
      gridItems[nextIndex].focus();
      e.preventDefault();
    }
  }

  private handleEscape() {
    // Close modals, menus, etc.
    const modals = document.querySelectorAll('[role="dialog"], .modal, .popup');
    modals.forEach(modal => {
      const closeButton = modal.querySelector('[data-dismiss], .close, .modal-close');
      if (closeButton) {
        (closeButton as HTMLElement).click();
      }
    });
  }

  private updateFocusableElements() {
    const selector = `
      a[href]:not([disabled]),
      button:not([disabled]),
      textarea:not([disabled]),
      input[type="text"]:not([disabled]),
      input[type="radio"]:not([disabled]),
      input[type="checkbox"]:not([disabled]),
      select:not([disabled]),
      [tabindex]:not([tabindex="-1"]):not([disabled])
    `;
    
    this.focusableElements = Array.from(document.querySelectorAll(selector))
      .filter(el => this.isVisible(el)) as HTMLElement[];
  }

  private isVisible(element: Element): boolean {
    const htmlElement = element as HTMLElement;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           htmlElement.offsetWidth > 0 && 
           htmlElement.offsetHeight > 0;
  }

  focusElement(selector: string) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      return true;
    }
    return false;
  }

  createFocusTrap(container: HTMLElement) {
    const focusableElements = container.querySelectorAll(`
      a[href]:not([disabled]),
      button:not([disabled]),
      textarea:not([disabled]),
      input:not([disabled]),
      select:not([disabled]),
      [tabindex]:not([tabindex="-1"]):not([disabled])
    `) as NodeListOf<HTMLElement>;
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const trapFocus = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
    
    container.addEventListener('keydown', trapFocus);
    firstElement.focus();
    
    return () => container.removeEventListener('keydown', trapFocus);
  }
}

// Visual accessibility utilities
export const setupVisualAccessibility = (config: AccessibilityConfig['visual']) => {
  const root = document.documentElement;
  
  // High contrast mode
  if (config.highContrast) {
    root.classList.add('high-contrast');
  }
  
  // Reduced motion
  if (config.reducedMotion) {
    root.classList.add('reduce-motion');
  }
  
  // Font size
  root.classList.add(`font-size-${config.fontSize}`);
  
  // Color blind support
  if (config.colorBlindSupport !== 'none') {
    root.classList.add(`colorblind-${config.colorBlindSupport}`);
  }
  
  // Focus indicator strength
  root.classList.add(`focus-${config.focusIndicator}`);
  
  // Suppress flashing content
  if (config.flashingSuppression) {
    root.classList.add('suppress-flashing');
  }
  
  // Add comprehensive accessibility CSS
  const style = document.createElement('style');
  style.textContent = `
    /* Screen reader only content */
    .sr-only {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    }
    
    /* High contrast mode */
    .high-contrast {
      --background-color: #000000;
      --text-color: #ffffff;
      --accent-color: #ffff00;
      --border-color: #ffffff;
      --button-bg: #ffffff;
      --button-text: #000000;
    }
    
    .high-contrast * {
      background-color: var(--background-color) !important;
      color: var(--text-color) !important;
      border-color: var(--border-color) !important;
    }
    
    .high-contrast button,
    .high-contrast [role="button"] {
      background-color: var(--button-bg) !important;
      color: var(--button-text) !important;
      border: 2px solid var(--border-color) !important;
    }
    
    /* Reduced motion */
    .reduce-motion *,
    .reduce-motion *::before,
    .reduce-motion *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
    
    /* Font sizes */
    .font-size-small { font-size: 0.875rem; }
    .font-size-medium { font-size: 1rem; }
    .font-size-large { font-size: 1.25rem; }
    .font-size-xlarge { font-size: 1.5rem; }
    
    /* Focus indicators */
    .focus-subtle *:focus {
      outline: 1px solid #4A90E2;
    }
    
    .focus-normal *:focus {
      outline: 2px solid #4A90E2;
      outline-offset: 2px;
    }
    
    .focus-strong *:focus {
      outline: 3px solid #4A90E2;
      outline-offset: 3px;
      box-shadow: 0 0 0 6px rgba(74, 144, 226, 0.3);
    }
    
    /* Color blind support */
    .colorblind-protanopia {
      filter: url('#protanopia-filter');
    }
    
    .colorblind-deuteranopia {
      filter: url('#deuteranopia-filter');
    }
    
    .colorblind-tritanopia {
      filter: url('#tritanopia-filter');
    }
    
    /* Suppress flashing */
    .suppress-flashing * {
      animation-play-state: paused !important;
    }
    
    .suppress-flashing .flashing,
    .suppress-flashing .blinking {
      animation: none !important;
    }
  `;
  document.head.appendChild(style);
};

// Initialize accessibility features
export const initializeAccessibility = (config: AccessibilityConfig) => {
  const screenReader = new ScreenReaderSupport();
  const keyboardNav = new KeyboardNavigationManager();
  
  setupVisualAccessibility(config.visual);
  
  // Register common shortcuts
  if (config.keyboard.navigationEnabled) {
    keyboardNav.registerShortcut('Alt+h', () => {
      window.location.hash = '#help';
    }, 'Show help');
    
    keyboardNav.registerShortcut('Alt+i', () => {
      keyboardNav.focusElement('#inventory');
    }, 'Focus inventory');
    
    keyboardNav.registerShortcut('Alt+a', () => {
      keyboardNav.focusElement('#actions');
    }, 'Focus actions');
    
    keyboardNav.registerShortcut('Alt+m', () => {
      keyboardNav.focusElement('#main-content');
    }, 'Focus main content');
  }
  
  return {
    screenReader,
    keyboardNav,
    config
  };
};

export default {
  ScreenReaderSupport,
  KeyboardNavigationManager,
  setupVisualAccessibility,
  initializeAccessibility
};
