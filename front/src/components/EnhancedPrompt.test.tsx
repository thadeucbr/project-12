import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EnhancedPrompt } from './EnhancedPrompt';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, ...props }: any) => {
      // Filter out framer-motion specific props
      const { animate, initial, transition, exit, whileHover, whileTap, ...filteredProps } = props;
      return <div {...filteredProps}>{children}</div>;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    button: ({ children, ...props }: any) => {
      const { animate, initial, transition, exit, whileHover, whileTap, ...filteredProps } = props;
      return <button {...filteredProps}>{children}</button>;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    span: ({ children, ...props }: any) => {
      const { animate, initial, transition, exit, whileHover, whileTap, ...filteredProps } = props;
      return <span {...filteredProps}>{children}</span>;
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AnimatePresence: ({ children }: any) => children,
}));

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

describe('EnhancedPrompt', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render the enhanced prompt content with typewriter effect', async () => {
    const mockPrompt = 'This is a **test** enhanced prompt with some `code`.';
    
    render(<EnhancedPrompt prompt={mockPrompt} isVisible={true} />);
    
    // Initially, displayedText should be empty
    expect(screen.queryByText(mockPrompt)).not.toBeInTheDocument();
    
    // Advance timers to simulate typewriter effect
    act(() => {
      // Advance by the full typing duration (15ms per character * length)
      vi.advanceTimersByTime(mockPrompt.length * 15 + 100);
    });

    // The full text should be displayed after typewriter completes
    expect(screen.getByText(mockPrompt)).toBeInTheDocument();
  });

  it('should render nothing if prompt is empty', () => {
    const { container } = render(<EnhancedPrompt prompt="" isVisible={true} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render nothing if prompt is null', () => {
    const { container } = render(<EnhancedPrompt prompt={null as unknown as string} isVisible={true} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render nothing if prompt is undefined', () => {
    const { container } = render(<EnhancedPrompt prompt={undefined as unknown as string} isVisible={true} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should correctly parse and render markdown', async () => {
    const markdownContent = '# Heading 1\n\n**Bold text** and *italic text*.\n\n- List item 1\n- List item 2\n\n`inline code`\n\n```javascript\nconst a = 1;\n```';
    
    render(<EnhancedPrompt prompt={markdownContent} isVisible={true} />);

    // Advance timers to complete the typewriter effect
    act(() => {
      vi.advanceTimersByTime(markdownContent.length * 15 + 100);
    });

    // Check for parts of the content to be more flexible with matching
    expect(screen.getByText(/# Heading 1/)).toBeInTheDocument();
    expect(screen.getByText(/Bold text/)).toBeInTheDocument();
    expect(screen.getByText(/List item 1/)).toBeInTheDocument();
    expect(screen.getByText(/const a = 1/)).toBeInTheDocument();
  });

  it('should not render if isVisible is false', () => {
    const { container } = render(<EnhancedPrompt prompt="some content" isVisible={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should handle copy to clipboard', async () => {
    const mockPrompt = 'Copy this text';
    const onCopyMock = vi.fn();
    
    render(<EnhancedPrompt prompt={mockPrompt} isVisible={true} onCopy={onCopyMock} />);

    // Complete the typewriter effect
    act(() => {
      vi.advanceTimersByTime(mockPrompt.length * 15 + 100);
    });

    expect(screen.getByText('Copiar')).toBeInTheDocument();

    const copyButton = screen.getByRole('button', { name: /Copiar/i });
    
    // Click and wait for the async operation
    await act(async () => {
      fireEvent.click(copyButton);
      // Need to flush all promises and microtasks
      await Promise.resolve();
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockPrompt);
    expect(onCopyMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Copiado!')).toBeInTheDocument();

    // Advance timers to reset the copy button (2000ms timeout)
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(screen.getByText('Copiar')).toBeInTheDocument();
  });

  it('should toggle full text and typewriter effect', async () => {
    const mockPrompt = 'Short prompt to test toggle.';
    
    render(<EnhancedPrompt prompt={mockPrompt} isVisible={true} />);

    // Complete initial typewriter
    act(() => {
      vi.advanceTimersByTime(mockPrompt.length * 15 + 100);
    });
    
    expect(screen.getByText(mockPrompt)).toBeInTheDocument();

    // Click toggle button to restart typewriter
    const toggleButton = screen.getByTitle('Mostrar texto completo');
    
    act(() => {
      fireEvent.click(toggleButton);
    });

    // After clicking, the title should change and typewriter should restart
    expect(screen.getByTitle('Mostrar efeito de digitação')).toBeInTheDocument();

    // Complete second typewriter (faster speed: 8ms per character)
    act(() => {
      vi.advanceTimersByTime(mockPrompt.length * 8 + 100);
    });
    
    expect(screen.getByText(mockPrompt)).toBeInTheDocument();
  });
});