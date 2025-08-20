/**
 * Route Manager
 * Handles route state management, transitions, and integration with existing game engine
 */

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { type RouteId, type RouteManifest, type RouteProgress } from '../types/routes';
import { getRouteById } from '../routes/manifest';

// Route Manager State
interface RouteManagerState {
  currentRoute: RouteManifest | null;
  progress: RouteProgress | null;
  isActive: boolean;
  isLoading: boolean;
  error: string | null;
  timeRemaining?: number;
}

// Route Manager Actions
type RouteManagerAction =
  | { type: 'START_ROUTE'; routeId: RouteId }
  | { type: 'ROUTE_LOADED'; route: RouteManifest; progress?: RouteProgress }
  | { type: 'UPDATE_PROGRESS'; progress: RouteProgress }
  | { type: 'PAUSE_ROUTE' }
  | { type: 'RESUME_ROUTE' }
  | { type: 'COMPLETE_ROUTE' }
  | { type: 'EXIT_ROUTE' }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_TIME'; timeRemaining: number };

// Initial state
const initialState: RouteManagerState = {
  currentRoute: null,
  progress: null,
  isActive: false,
  isLoading: false,
  error: null,
};

// Reducer
function routeManagerReducer(state: RouteManagerState, action: RouteManagerAction): RouteManagerState {
  switch (action.type) {
    case 'START_ROUTE':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'ROUTE_LOADED':
      return {
        ...state,
        currentRoute: action.route,
        progress: action.progress || {
          routeId: action.route.id,
          currentNodeIndex: 0,
          currentNodeId: action.route.nodes[0]?.id || '',
          completedNodes: [],
          skippedNodes: [],
          elapsedTimeMs: 0,
          timeStarted: Date.now(),
          lastSaved: Date.now(),
          objectives: {
            completed: [],
            total: action.route.nodes.map(node => node.id),
          },
        },
        isActive: true,
        isLoading: false,
        error: null,
      };

    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: action.progress,
      };

    case 'PAUSE_ROUTE':
      return {
        ...state,
        isActive: false,
      };

    case 'RESUME_ROUTE':
      return {
        ...state,
        isActive: true,
      };

    case 'COMPLETE_ROUTE':
      return {
        ...state,
        isActive: false,
      };

    case 'EXIT_ROUTE':
      return {
        ...state,
        currentRoute: null,
        progress: null,
        isActive: false,
        isLoading: false,
        timeRemaining: undefined,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'UPDATE_TIME':
      return {
        ...state,
        timeRemaining: action.timeRemaining,
      };

    default:
      return state;
  }
}

// Context
interface RouteManagerContextValue {
  state: RouteManagerState;
  startRoute: (routeId: RouteId) => Promise<void>;
  updateProgress: (progress: RouteProgress) => void;
  pauseRoute: () => void;
  resumeRoute: () => void;
  completeRoute: () => void;
  exitRoute: () => void;
  clearError: () => void;
}

const RouteManagerContext = createContext<RouteManagerContextValue | null>(null);

// Provider Props
interface RouteManagerProviderProps {
  children: ReactNode;
  onRouteStart?: (route: RouteManifest) => void;
  onRouteComplete?: (route: RouteManifest, progress: RouteProgress) => void;
  onRouteExit?: (route: RouteManifest | null, progress: RouteProgress | null) => void;
  saveProgressToStorage?: (progress: RouteProgress) => Promise<void>;
  loadProgressFromStorage?: (routeId: RouteId) => Promise<RouteProgress | null>;
}

// Provider Component
export const RouteManagerProvider: React.FC<RouteManagerProviderProps> = ({
  children,
  onRouteStart,
  onRouteComplete,
  onRouteExit,
  saveProgressToStorage,
  loadProgressFromStorage,
}) => {
  const [state, dispatch] = useReducer(routeManagerReducer, initialState);

  const startRoute = async (routeId: RouteId) => {
    try {
      dispatch({ type: 'START_ROUTE', routeId });

      const route = getRouteById(routeId);
      if (!route) {
        throw new Error(`Route not found: ${routeId}`);
      }

      // Try to load existing progress
      let savedProgress: RouteProgress | null = null;
      if (loadProgressFromStorage) {
        try {
          savedProgress = await loadProgressFromStorage(routeId);
        } catch (error) {
          console.warn('Failed to load saved progress:', error);
        }
      }

      dispatch({ type: 'ROUTE_LOADED', route, progress: savedProgress || undefined });
      onRouteStart?.(route);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const updateProgress = (progress: RouteProgress) => {
    dispatch({ type: 'UPDATE_PROGRESS', progress });
    
    // Auto-save progress
    if (saveProgressToStorage) {
      saveProgressToStorage(progress).catch(error => {
        console.warn('Failed to save progress:', error);
      });
    }
  };

  const pauseRoute = () => {
    dispatch({ type: 'PAUSE_ROUTE' });
  };

  const resumeRoute = () => {
    dispatch({ type: 'RESUME_ROUTE' });
  };

  const completeRoute = () => {
    dispatch({ type: 'COMPLETE_ROUTE' });
    if (state.currentRoute && state.progress) {
      onRouteComplete?.(state.currentRoute, state.progress);
    }
  };

  const exitRoute = () => {
    onRouteExit?.(state.currentRoute, state.progress);
    dispatch({ type: 'EXIT_ROUTE' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Update elapsed time periodically
  useEffect(() => {
    if (!state.isActive || !state.progress) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedTimeMs = now - state.progress!.timeStarted;
      
      const updatedProgress: RouteProgress = {
        ...state.progress!,
        elapsedTimeMs,
        lastSaved: now,
      };
      
      updateProgress(updatedProgress);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [state.isActive, state.progress?.timeStarted]);

  const contextValue: RouteManagerContextValue = {
    state,
    startRoute,
    updateProgress,
    pauseRoute,
    resumeRoute,
    completeRoute,
    exitRoute,
    clearError,
  };

  return (
    <RouteManagerContext.Provider value={contextValue}>
      {children}
    </RouteManagerContext.Provider>
  );
};

// Hook for using the context
export const useRouteManager = (): RouteManagerContextValue => {
  const context = useContext(RouteManagerContext);
  if (!context) {
    throw new Error('useRouteManager must be used within a RouteManagerProvider');
  }
  return context;
};

// Route wrapper component for existing game integration
interface RouteWrapperProps {
  children: ReactNode;
  onNodeComplete?: (nodeId: string) => void;
  onNodeStart?: (nodeId: string) => void;
  className?: string;
}

export const RouteWrapper: React.FC<RouteWrapperProps> = ({
  children,
  onNodeComplete,
  onNodeStart,
  className,
}) => {
  const { state, updateProgress } = useRouteManager();

  const handleNodeComplete = (nodeId: string) => {
    onNodeComplete?.(nodeId);
    
    if (state.progress && state.currentRoute) {
      const updatedProgress: RouteProgress = {
        ...state.progress,
        completedNodes: [...state.progress.completedNodes, nodeId],
        lastSaved: Date.now(),
      };
      
      // Update current node to next incomplete required node
      const nextNode = state.currentRoute.nodes.find(node => 
        node.required && 
        !updatedProgress.completedNodes.includes(node.id) &&
        !updatedProgress.skippedNodes.includes(node.id)
      );
      
      if (nextNode) {
        const nextNodeIndex = state.currentRoute.nodes.findIndex(node => node.id === nextNode.id);
        updatedProgress.currentNodeIndex = nextNodeIndex;
        updatedProgress.currentNodeId = nextNode.id;
      }
      
      updateProgress(updatedProgress);
    }
  };

  const handleNodeStart = (nodeId: string) => {
    onNodeStart?.(nodeId);
    
    if (state.progress && state.currentRoute) {
      const nodeIndex = state.currentRoute.nodes.findIndex(node => node.id === nodeId);
      if (nodeIndex >= 0) {
        const updatedProgress: RouteProgress = {
          ...state.progress,
          currentNodeIndex: nodeIndex,
          currentNodeId: nodeId,
          lastSaved: Date.now(),
        };
        
        updateProgress(updatedProgress);
      }
    }
  };

  // Expose global handlers for game engine integration
  useEffect(() => {
    // @ts-ignore - Global assignment for existing game engine
    window.routeHandlers = {
      onNodeComplete: handleNodeComplete,
      onNodeStart: handleNodeStart,
    };

    return () => {
      // @ts-ignore - Cleanup
      window.routeHandlers = undefined;
    };
  }, [state.progress, state.currentRoute]);

  return <div className={className}>{children}</div>;
};
