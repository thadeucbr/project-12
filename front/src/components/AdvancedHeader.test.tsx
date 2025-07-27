import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdvancedHeader } from './AdvancedHeader';
import { useTheme } from '../contexts/ThemeContext';
import { vi } from 'vitest';

// Mock useTheme
vi.mock('../contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
}));

// Mock framer-motion to avoid animation issues in tests
import { MotionProps } from '../types/FramerMotion';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    header: ({ ...props }: MotionProps) => {
      return <header {...props} />;
    },
    div: ({ ...props }: MotionProps) => {
      return <div {...props} />;
    },
    button: ({ ...props }: MotionProps) => {
      return <button {...props} />;
    },
    span: ({ ...props }: MotionProps) => {
      return <span {...props} />;
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockOnHistoryToggle = vi.fn();
const mockOnSurpriseMe = vi.fn();
const mockOnTemplatesOpen = vi.fn();
const mockOnAnalyticsOpen = vi.fn();
const mockOnExportOpen = vi.fn();
const mockOnComparisonOpen = vi.fn();
const mockOnLiveAnalyticsOpen = vi.fn();

const defaultProps = {
  onHistoryToggle: mockOnHistoryToggle,
  onSurpriseMe: mockOnSurpriseMe,
  onTemplatesOpen: mockOnTemplatesOpen,
  onAnalyticsOpen: mockOnAnalyticsOpen,
  onExportOpen: mockOnExportOpen,
  onComparisonOpen: mockOnComparisonOpen,
  isHistoryOpen: false,
};

describe('AdvancedHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTheme as vi.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn(),
    });
  });

  test('renders logo and description', () => {
    render(<AdvancedHeader {...defaultProps} />);
    expect(screen.getByText('Prompts Barbudas')).toBeInTheDocument();
    expect(screen.getByText('Aprimoramento Inteligente de Prompts')).toBeInTheDocument();
  });

  test('toggles theme when theme button is clicked', () => {
    const mockToggleTheme = vi.fn();
    (useTheme as vi.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });
    render(<AdvancedHeader {...defaultProps} />);
    const themeButton = screen.getByTitle('Alternar Tema (Ctrl+Shift+T)');
    fireEvent.click(themeButton);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  test('calls onSurpriseMe when "Me Surpreenda" button is clicked', () => {
    render(<AdvancedHeader {...defaultProps} />);
    const surpriseButton = screen.getByTitle('Me Surpreenda (Ctrl+Shift+R)');
    fireEvent.click(surpriseButton);
    expect(mockOnSurpriseMe).toHaveBeenCalledTimes(1);
  });

  test('calls onHistoryToggle when history button is clicked and changes style', () => {
    const { rerender } = render(<AdvancedHeader {...defaultProps} isHistoryOpen={false} />);
    const historyButton = screen.getByTitle('Alternar Histórico (Ctrl+Shift+H)');
    
    expect(historyButton).toHaveClass('bg-gray-100'); // Initial state
    fireEvent.click(historyButton);
    expect(mockOnHistoryToggle).toHaveBeenCalledTimes(1);

    rerender(<AdvancedHeader {...defaultProps} isHistoryOpen={true} />);
    expect(historyButton).toHaveClass('bg-purple-100'); // State after toggle
  });

  describe('Desktop Navigation', () => {
    test('opens and closes tools dropdown', async () => {
      render(<AdvancedHeader {...defaultProps} />);
      const toolsButton = screen.getByRole('button', { name: /Ferramentas/i });
      
      // Open dropdown
      fireEvent.click(toolsButton);
      expect(screen.getByText('Modelos')).toBeInTheDocument();
      expect(screen.getByText('Estatísticas')).toBeInTheDocument();

      // Close dropdown by clicking the overlay
      const overlay = screen.getByTestId('overlay'); // Add data-testid="overlay" to the overlay div
      fireEvent.click(overlay);
      expect(screen.queryByText('Modelos')).not.toBeInTheDocument();
    });

    test('calls correct action when a tool is clicked in desktop dropdown', () => {
      render(<AdvancedHeader {...defaultProps} />);
      const toolsButton = screen.getByRole('button', { name: /Ferramentas/i });
      fireEvent.click(toolsButton); // Open dropdown

      fireEvent.click(screen.getByText('Modelos'));
      expect(mockOnTemplatesOpen).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Modelos')).not.toBeInTheDocument(); // Dropdown closes

      fireEvent.click(toolsButton); // Re-open
      fireEvent.click(screen.getByText('Estatísticas'));
      expect(mockOnAnalyticsOpen).toHaveBeenCalledTimes(1);

      fireEvent.click(toolsButton); // Re-open
      fireEvent.click(screen.getByText('Exportar'));
      expect(mockOnExportOpen).toHaveBeenCalledTimes(1);

      fireEvent.click(toolsButton); // Re-open
      fireEvent.click(screen.getByText('Comparar'));
      expect(mockOnComparisonOpen).toHaveBeenCalledTimes(1);
    });

    test('renders Live Analytics button when onLiveAnalyticsOpen is provided', () => {
      render(<AdvancedHeader {...defaultProps} onLiveAnalyticsOpen={mockOnLiveAnalyticsOpen} />);
      const liveAnalyticsButton = screen.getByRole('button', { name: /Analytics/i });
      expect(liveAnalyticsButton).toBeInTheDocument();
      fireEvent.click(liveAnalyticsButton);
      expect(mockOnLiveAnalyticsOpen).toHaveBeenCalledTimes(1);
    });

    test('does not render Live Analytics button when onLiveAnalyticsOpen is not provided', () => {
      render(<AdvancedHeader {...defaultProps} onLiveAnalyticsOpen={undefined} />);
      expect(screen.queryByRole('button', { name: /Analytics/i })).not.toBeInTheDocument();
    });
  });

  describe('Mobile Navigation', () => {
    beforeEach(() => {
      // Mock window.innerWidth to simulate mobile view
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
    });

    afterEach(() => {
      // Reset window.innerWidth
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    });

    test('opens and closes mobile menu', () => {
      render(<AdvancedHeader {...defaultProps} />);
      const mobileMenuButton = screen.getByLabelText('Abrir menu');
      
      // Open menu
      fireEvent.click(mobileMenuButton);
      expect(screen.getByText('Surpresa')).toBeInTheDocument();
      expect(screen.getByText('Histórico')).toBeInTheDocument();
      expect(screen.getByText('Escuro')).toBeInTheDocument(); // Theme toggle in mobile
      expect(screen.getByText('Modelos')).toBeInTheDocument(); // Tools in mobile

      // Close menu by clicking the X icon
      const closeButton = screen.getByLabelText('Fechar menu');
      fireEvent.click(closeButton);
      expect(screen.queryByText('Surpresa')).not.toBeInTheDocument();
    });

    test('calls correct actions when quick actions are clicked in mobile menu', () => {
      const mockToggleTheme = vi.fn();
      (useTheme as vi.Mock).mockReturnValue({
        theme: 'light',
        toggleTheme: mockToggleTheme,
      });
      render(<AdvancedHeader {...defaultProps} />);
      const mobileMenuButton = screen.getByLabelText('Abrir menu');
      fireEvent.click(mobileMenuButton); // Open menu

      fireEvent.click(screen.getByText('Surpresa'));
      expect(mockOnSurpriseMe).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Surpresa')).not.toBeInTheDocument(); // Menu closes

      fireEvent.click(screen.getByLabelText('Abrir menu')); // Re-open
      fireEvent.click(screen.getByText('Histórico'));
      expect(mockOnHistoryToggle).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByLabelText('Abrir menu')); // Re-open
      fireEvent.click(screen.getByText('Escuro'));
      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    test('calls correct action when a tool is clicked in mobile menu', () => {
      render(<AdvancedHeader {...defaultProps} />);
      const mobileMenuButton = screen.getByLabelText('Abrir menu');
      fireEvent.click(mobileMenuButton); // Open menu

      fireEvent.click(screen.getByText('Modelos'));
      expect(mockOnTemplatesOpen).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Modelos')).not.toBeInTheDocument(); // Menu closes

      fireEvent.click(screen.getByLabelText('Abrir menu')); // Re-open
      fireEvent.click(screen.getByText('Estatísticas'));
      expect(mockOnAnalyticsOpen).toHaveBeenCalledTimes(1);
    });

    test('renders Live Analytics button in mobile when onLiveAnalyticsOpen is provided', () => {
      render(<AdvancedHeader {...defaultProps} onLiveAnalyticsOpen={mockOnLiveAnalyticsOpen} />);
      const mobileMenuButton = screen.getByLabelText('Abrir menu');
      fireEvent.click(mobileMenuButton); // Open menu
      // Find the mobile live analytics button by its specific text content within the mobile menu
      const liveAnalyticsButton = screen.getByRole('button', { name: 'Analytics Globais LIVE' }); 
      expect(liveAnalyticsButton).toBeInTheDocument();
      fireEvent.click(liveAnalyticsButton);
      expect(mockOnLiveAnalyticsOpen).toHaveBeenCalledTimes(1);
    });
  });
});
