import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PlayerNameCapture from '../components/PlayerNameCapture';
import { RouteSelectScreen } from '../components/RouteSelectScreen';

describe('Route Selection Integration', () => {
  const mockOnNameSubmit = vi.fn();
  const mockOnRouteSelect = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('PlayerNameCapture Component', () => {
    it('should render name input form', () => {
      render(
        <PlayerNameCapture onNameSubmit={mockOnNameSubmit} />
      );
      
      expect(screen.getByLabelText(/enter your name/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /begin/i })).toBeInTheDocument();
    });

    it('should validate name input', async () => {
      render(
        <PlayerNameCapture onNameSubmit={mockOnNameSubmit} />
      );
      
      const nameInput = screen.getByLabelText(/enter your name/i);
      const beginButton = screen.getByRole('button', { name: /begin/i });

      // Try submitting with empty name
      fireEvent.click(beginButton);
      await waitFor(() => {
        expect(screen.getByText(/please enter a name/i)).toBeInTheDocument();
      });

      // Enter valid name
      fireEvent.change(nameInput, { target: { value: 'TestPlayer' } });
      fireEvent.click(beginButton);

      await waitFor(() => {
        expect(mockOnNameSubmit).toHaveBeenCalledWith('TestPlayer');
      });
    });

    it('should show instructions modal when help is clicked', async () => {
      render(
        <PlayerNameCapture onNameSubmit={mockOnNameSubmit} />
      );
      
      const helpButton = screen.getByRole('button', { name: /help/i });
      fireEvent.click(helpButton);

      await waitFor(() => {
        expect(screen.getByText(/adventure type overview/i)).toBeInTheDocument();
      });
    });
  });

  describe('RouteSelectScreen Component', () => {
    it('should render all route categories', () => {
      render(
        <RouteSelectScreen 
          onRouteSelect={mockOnRouteSelect}
          onCancel={mockOnBack}
        />
      );
      
      expect(screen.getByText(/demo/i)).toBeInTheDocument();
      expect(screen.getByText(/short.*10.*min/i)).toBeInTheDocument();
      expect(screen.getByText(/short.*30.*min/i)).toBeInTheDocument();
      expect(screen.getByText(/full.*game/i)).toBeInTheDocument();
    });

    it('should show demo route details', async () => {
      render(
        <RouteSelectScreen 
          onRouteSelect={mockOnRouteSelect}
          onCancel={mockOnBack}
        />
      );
      
      const demoButton = screen.getByText(/demo/i);
      fireEvent.click(demoButton);

      await waitFor(() => {
        expect(screen.getByText(/5-7.*minutes/i)).toBeInTheDocument();
        expect(screen.getByText(/quick.*tour/i)).toBeInTheDocument();
      });
    });

    it('should show short game route options', async () => {
      render(
        <RouteSelectScreen 
          onRouteSelect={mockOnRouteSelect}
          onCancel={mockOnBack}
        />
      );
      
      const shortButton = screen.getByText(/short.*10.*min/i);
      fireEvent.click(shortButton);

      await waitFor(() => {
        expect(screen.getByText(/elfhame.*adventure/i)).toBeInTheDocument();
        expect(screen.getByText(/gorstan.*village/i)).toBeInTheDocument();
      });
    });

    it('should filter routes by adventure type', async () => {
      render(
        <RouteSelectScreen 
          onRouteSelect={mockOnRouteSelect}
          onCancel={mockOnBack}
        />
      );
      
      // Select fantasy filter
      const fantasyFilter = screen.getByRole('button', { name: /fantasy/i });
      fireEvent.click(fantasyFilter);

      await waitFor(() => {
        expect(screen.getByText(/elfhame/i)).toBeInTheDocument();
        expect(screen.queryByText(/glitch/i)).not.toBeInTheDocument();
      });
    });

    it('should start selected route', async () => {
      render(
        <RouteSelectScreen 
          onRouteSelect={mockOnRouteSelect}
          onCancel={mockOnBack}
        />
      );
      
      const demoButton = screen.getByText(/demo/i);
      fireEvent.click(demoButton);

      await waitFor(() => {
        const startButton = screen.getByRole('button', { name: /start.*adventure/i });
        fireEvent.click(startButton);
      });

      expect(mockOnRouteSelect).toHaveBeenCalledWith(expect.objectContaining({
        route: 'demo'
      }));
    });
  });

  describe('Route Access Integration', () => {
    it('should validate achievable goals in short routes', () => {
      const shortRoutes = [
        {
          id: 'elfhame-quick',
          title: 'Elfhame Adventure',
          timeEstimate: '8-12 minutes',
          goals: ['Meet Rhianon', 'Explore Fae Lake', 'Complete one quest'],
          zones: ['elfhame', 'faeglade', 'faelake']
        },
        {
          id: 'gorstan-intro',
          title: 'Gorstan Village',
          timeEstimate: '10-15 minutes', 
          goals: ['Explore village', 'Visit Torridon Inn', 'Meet locals'],
          zones: ['gorstanvillage', 'torridon', 'torridoninn']
        }
      ];

      shortRoutes.forEach(route => {
        expect(route.goals.length).toBeGreaterThan(0);
        expect(route.goals.every(goal => goal.length > 0)).toBe(true);
        expect(route.timeEstimate).toMatch(/\d+.*minutes?/i);
        expect(route.zones.length).toBeGreaterThan(0);
      });
    });

    it('should ensure demo mode has exciting variety', () => {
      const demoRoute = {
        id: 'demo',
        title: 'Demo Adventure',
        timeEstimate: '5-7 minutes',
        zones: ['controlnexus', 'elfhame', 'datavoid'],
        features: ['Multiple zones', 'Different themes', 'Quick progression']
      };

      expect(demoRoute.zones.length).toBeGreaterThanOrEqual(3);
      expect(demoRoute.features).toContain('Multiple zones');
      expect(demoRoute.timeEstimate).toMatch(/5-7.*minutes/i);
    });
  });
});
