import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import { useTheme } from '../contexts/ThemeContext';
import { vi } from 'vitest';

// Mock useTheme
vi.mock('../contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
}));

// Mock framer-motion to avoid animation issues in tests
import { MotionProps } from '../types/FramerMotion';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => {
  const filterMotionProps = (props: MotionProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { whileHover, whileTap, layout, ...cleanProps } = props;
    return cleanProps;
  };

  return {
    motion: {
      header: (props: MotionProps) => <header {...filterMotionProps(props)} />,
      div: (props: MotionProps) => <div {...filterMotionProps(props)} />,
      button: (props: MotionProps) => <button {...filterMotionProps(props)} />,
    },
  };
});

const mockOnHistoryToggle = vi.fn();
const mockOnSurpriseMe = vi.fn();

const defaultProps = {
  onHistoryToggle: mockOnHistoryToggle,
  onSurpriseMe: mockOnSurpriseMe,
  isHistoryOpen: false,
};

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTheme as vi.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn(),
    });
  });

  test('renders logo and description', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('Prompts Barbudas')).toBeInTheDocument();
    expect(screen.getByText('AI Enhancement Engine')).toBeInTheDocument();
  });

  test('toggles theme when theme button is clicked', () => {
    const mockToggleTheme = vi.fn();
    (useTheme as vi.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });
    render(<Header {...defaultProps} />);
    const themeButton = screen.getByTitle('Toggle Theme (Ctrl+Shift+T)');
    fireEvent.click(themeButton);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  test('calls onSurpriseMe when "Surprise Me" button is clicked', () => {
    render(<Header {...defaultProps} />);
    const surpriseButton = screen.getByTitle('Surprise Me (Ctrl+Shift+R)');
    fireEvent.click(surpriseButton);
    expect(mockOnSurpriseMe).toHaveBeenCalledTimes(1);
  });

  test('calls onHistoryToggle when history button is clicked and changes style', () => {
    const { rerender } = render(<Header {...defaultProps} isHistoryOpen={false} />);
    const historyButton = screen.getByTitle('Toggle History (Ctrl+Shift+H)');
    
    expect(historyButton).toHaveClass('bg-gray-100'); // Initial state
    fireEvent.click(historyButton);
    expect(mockOnHistoryToggle).toHaveBeenCalledTimes(1);

    rerender(<Header {...defaultProps} isHistoryOpen={true} />);
    expect(historyButton).toHaveClass('bg-purple-100'); // State after toggle
  });
});
