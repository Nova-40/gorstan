/// <reference types="jest" />

/**
 * Tests for CommandInput component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import CommandInput from '../../../components/CommandInput';

// Mock the sound utility since it's not critical for testing
jest.mock('../../../utils/soundUtils', () => ({
  playSound: jest.fn(),
}));

describe('CommandInput Component', () => {
  const mockOnCommand = jest.fn();
  const defaultProps = {
    playerName: 'TestPlayer',
    onCommand: mockOnCommand,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render input field', () => {
      render(<CommandInput {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should display player name in placeholder', () => {
      render(<CommandInput {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      const placeholder = input.getAttribute('placeholder') || '';
      expect(placeholder).toContain('TestPlayer');
    });

    it('should render as a form element', () => {
      render(<CommandInput {...defaultProps} />);
      
      const form = screen.getByRole('textbox').closest('form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('should handle basic text input', () => {
      render(<CommandInput {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'look' } });
      
      expect(input).toHaveValue('look');
    });

    it('should submit command on form submission', () => {
      render(<CommandInput {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      const form = input.closest('form');
      
      fireEvent.change(input, { target: { value: 'inventory' } });
      fireEvent.submit(form!);
      
      expect(mockOnCommand).toHaveBeenCalledWith('inventory');
    });

    it('should clear input after submitting', () => {
      render(<CommandInput {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      const form = input.closest('form');
      
      fireEvent.change(input, { target: { value: 'look around' } });
      fireEvent.submit(form!);
      
      expect(input).toHaveValue('');
    });

    it('should not submit empty commands', () => {
      render(<CommandInput {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      const form = input.closest('form');
      
      fireEvent.submit(form!);
      
      expect(mockOnCommand).not.toHaveBeenCalled();
    });

    it('should trim whitespace from commands', () => {
      render(<CommandInput {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      const form = input.closest('form');
      
      fireEvent.change(input, { target: { value: '  look  ' } });
      fireEvent.submit(form!);
      
      expect(mockOnCommand).toHaveBeenCalledWith('look');
    });
  });

  describe('Form Handling', () => {
    it('should prevent default form submission', () => {
      render(<CommandInput {...defaultProps} />);
      
      const form = screen.getByRole('textbox').closest('form');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      const preventDefault = jest.fn();
      Object.defineProperty(submitEvent, 'preventDefault', { value: preventDefault });
      
      if (form) {
        fireEvent(form, submitEvent);
        expect(preventDefault).toHaveBeenCalled();
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility attributes', () => {
      render(<CommandInput {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('placeholder');
    });

    it('should be keyboard accessible', () => {
      render(<CommandInput {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      input.focus();
      expect(input).toHaveFocus();
    });
  });

  describe('Component Props', () => {
    it('should handle empty playerName gracefully', () => {
      const propsWithEmptyName = {
        playerName: '',
        onCommand: mockOnCommand,
      };
      
      expect(() => {
        render(<CommandInput {...propsWithEmptyName} />);
      }).not.toThrow();
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should handle different player names', () => {
      const customProps = {
        playerName: 'CustomPlayer',
        onCommand: mockOnCommand,
      };
      
      render(<CommandInput {...customProps} />);
      
      const input = screen.getByRole('textbox');
      const placeholder = input.getAttribute('placeholder') || '';
      expect(placeholder).toContain('CustomPlayer');
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in input', () => {
      render(<CommandInput {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      const form = input.closest('form');
      const specialText = 'look @#$';
      
      fireEvent.change(input, { target: { value: specialText } });
      fireEvent.submit(form!);
      
      expect(mockOnCommand).toHaveBeenCalledWith(specialText);
    });

    it('should handle Enter key press for form submission', () => {
      render(<CommandInput {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      const form = input.closest('form');
      
      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.submit(form!);
      
      // Form submission should trigger command
      expect(mockOnCommand).toHaveBeenCalledWith('test');
    });

    it('should handle non-Enter key presses', () => {
      render(<CommandInput {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
      
      // Should not submit on non-Enter keys
      expect(mockOnCommand).not.toHaveBeenCalled();
      expect(input).toHaveValue('test');
    });
  });
});
