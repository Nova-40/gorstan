import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App', () => {
  it('renders and responds to interaction', async () => {
    render(<App />);
    expect(screen.getByText(/gorstan/i)).toBeInTheDocument();

    // Try to find a start button or similar interaction
    const startButtons = screen.queryAllByRole('button', { name: /start/i });
    if (startButtons.length > 0) {
      const startButton = startButtons[0];
      if (!startButton) {
        throw new Error('Start button not found in test');
      }
      await userEvent.click(startButton);
      expect(screen.getByText(/console/i)).toBeInTheDocument();
    }
  });
});
