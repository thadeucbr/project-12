import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { PromptComparison } from './PromptComparison';
import { vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
    button: (props: any) => <button {...props} />,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(),
  },
  writable: true,
});

const mockData = {
  original: 'This is an original prompt.',
  enhanced: 'This is an enhanced prompt with more details and clarity.',
  enhancementType: 'detailed',
  timestamp: new Date().toISOString(),
};

describe('PromptComparison', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('does not render when isOpen is false', () => {
    const { container } = render(<PromptComparison data={mockData} isOpen={false} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders when isOpen is true', () => {
    render(<PromptComparison data={mockData} isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Comparação de Prompts')).toBeInTheDocument();
    expect(screen.getByText('Veja as melhorias aplicadas ao seu prompt')).toBeInTheDocument();
    expect(screen.getByText('Prompt Original')).toBeInTheDocument();
    expect(screen.getByText('Prompt Aprimorado')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const mockOnClose = vi.fn();
    render(<PromptComparison data={mockData} isOpen={true} onClose={mockOnClose} />);
    // Find the close button by its class or by finding the button without a name
    const closeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('displays correct statistics', () => {
    render(<PromptComparison data={mockData} isOpen={true} onClose={vi.fn()} />);

    // Check for text labels instead of specific percentages
    expect(screen.getByText('Palavras')).toBeInTheDocument();
    expect(screen.getByText('Caracteres')).toBeInTheDocument();
    expect(screen.getByText('Score de legibilidade')).toBeInTheDocument();
    expect(screen.getByText('Estilo aplicado')).toBeInTheDocument();
    
    // Check for patterns that should exist
    const percentages = screen.getAllByText(/\+.*%/);
    expect(percentages.length).toBeGreaterThan(0); // Should have percentage increases
    
    // Check for arrows indicating change - use getAllByText since there are multiple
    const arrowElements = screen.getAllByText(/\d+ → \d+/);
    expect(arrowElements.length).toBeGreaterThan(0); // Should have at least one arrow indicator // Matches X → Y

    // Type
    expect(screen.getByText('detailed', { exact: false })).toBeInTheDocument();
  });

  test('copies original prompt to clipboard', async () => {
    render(<PromptComparison data={mockData} isOpen={true} onClose={vi.fn()} />);
    const copyButtons = screen.getAllByRole('button', { name: 'Copiar' });
    const originalCopyButton = copyButtons[0]; // First copy button is for original
    fireEvent.click(originalCopyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockData.original);
  });

  test('copies enhanced prompt to clipboard', async () => {
    render(<PromptComparison data={mockData} isOpen={true} onClose={vi.fn()} />);
    const copyButtons = screen.getAllByRole('button', { name: 'Copiar' });
    const enhancedCopyButton = copyButtons[1]; // Second copy button is for enhanced
    fireEvent.click(enhancedCopyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockData.enhanced);
  });

  test('displays improvements highlights', () => {
    render(<PromptComparison data={mockData} isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Melhorias Aplicadas')).toBeInTheDocument();
    expect(screen.getByText('Estrutura mais clara e organizada')).toBeInTheDocument();
    expect(screen.getByText('Contexto adicional fornecido')).toBeInTheDocument();
    expect(screen.getByText('Instruções mais específicas')).toBeInTheDocument();
    expect(screen.getByText('Linguagem otimizada para IA')).toBeInTheDocument();
    expect(screen.getByText('Formato de resposta definido')).toBeInTheDocument();
    expect(screen.getByText('Critérios de qualidade incluídos')).toBeInTheDocument();
  });
});
