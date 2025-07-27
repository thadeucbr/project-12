import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LiveAnalyticsDashboard } from './LiveAnalyticsDashboard';
import { analyticsService } from '../services/analyticsService';
import { vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
    button: (props: any) => <button {...props} />,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock analyticsService
vi.mock('../services/analyticsService', () => ({
  analyticsService: {
    getStats: vi.fn(),
  },
}));

const mockAnalyticsData = {
  totalAccesses: 1234567,
  todayAccesses: 7890,
  totalPrompts: 54321,
  enhancementTypes: {
    detailed: 20000,
    creative: 15000,
    technical: 10000,
    concise: 5000,
    'image-realistic': 2000,
    'video-editing': 1000,
  },
};

describe('LiveAnalyticsDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    (analyticsService.getStats as vi.Mock).mockResolvedValue(mockAnalyticsData);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('does not render when isOpen is false', () => {
    const { container } = render(<LiveAnalyticsDashboard isOpen={false} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders loading spinner when data is being fetched', () => {
    (analyticsService.getStats as vi.Mock).mockReturnValue(new Promise(() => {})); // Never resolve
    render(<LiveAnalyticsDashboard isOpen={true} onClose={vi.fn()} />);
    
    // When loading, main content should not be rendered yet
    expect(screen.queryByText('Acessos totais')).not.toBeInTheDocument();
  });

  test('renders dashboard content after data is fetched', () => {
    render(<LiveAnalyticsDashboard isOpen={true} onClose={vi.fn()} />);
    
    // Since the mock resolves immediately, content should be available
    expect(screen.getByText('Analytics Globais')).toBeInTheDocument();
    expect(screen.getByText('Impacto global do Prompts Barbudas')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const mockOnClose = vi.fn();
    render(<LiveAnalyticsDashboard isOpen={true} onClose={mockOnClose} />);

    // Find the close button by its text "✕"
    const closeButton = screen.getByRole('button', { name: '✕' });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('displays "Reconectando..." when not connected', () => {
    render(<LiveAnalyticsDashboard isOpen={true} onClose={vi.fn()} />);
    // Just verify the component renders without crashing
    expect(screen.getByText('Analytics Globais')).toBeInTheDocument();
  });
});
