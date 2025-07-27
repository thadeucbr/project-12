import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';
import { vi } from 'vitest';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('LoadingSpinner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders the loading spinner and initial message', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Aprimorando seu prompt')).toBeInTheDocument();
    expect(screen.getByText('Analisando seu prompt...')).toBeInTheDocument();
  });

  test('cycles through loading messages', () => {
    render(<LoadingSpinner />);

    // Initial message
    expect(screen.getByText('Analisando seu prompt...')).toBeInTheDocument();

    // Advance timers by 1.5 seconds (first message change)
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByText('Aplicando inteligência artificial...')).toBeInTheDocument();

    // Advance timers again (second message change)
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByText('Otimizando estrutura...')).toBeInTheDocument();

    // Advance timers to cycle back to the first message
    act(() => {
      vi.advanceTimersByTime(1500 * 3); // 3 more messages to cycle back
    });
    expect(screen.getByText('Analisando seu prompt...')).toBeInTheDocument();
  });

  test('renders animated divs (mocked framer-motion)', () => {
    render(<LoadingSpinner />);
    // Check for the presence of the mocked motion.div elements
    // Since framer-motion is mocked, we just verify the component renders without crashing
    expect(screen.getByText('Aprimorando seu prompt')).toBeInTheDocument();
    expect(screen.getByText('Analisando seu prompt...')).toBeInTheDocument();
  });
});
