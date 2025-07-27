import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HistoryPanel } from './HistoryPanel';
import { vi } from 'vitest';
import type { Prompt } from '../types';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ whileHover, whileTap, layout, ...props }: any) => <div {...props} />,
    button: ({ whileHover, whileTap, layout, ...props }: any) => <button {...props} />,
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

describe('HistoryPanel', () => {
  const mockPrompts: Prompt[] = [
    {
      id: '1',
      originalPrompt: 'prompt original 1',
      enhancedPrompt: 'prompt aprimorado 1',
      enhancementType: 'detailed',
      timestamp: new Date(new Date().setDate(new Date().getDate())).toISOString(), // Today
      tags: ['tag1', 'tag2'],
    },
    {
      id: '2',
      originalPrompt: 'prompt original 2',
      enhancedPrompt: 'prompt aprimorado 2',
      enhancementType: 'creative',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Yesterday
      tags: ['tag2', 'tag3'],
    },
    {
      id: '3',
      originalPrompt: 'prompt de imagem',
      enhancedPrompt: 'prompt aprimorado de imagem',
      enhancementType: 'image-generation',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), // 5 days ago (within week)
      tags: ['imagem'],
    },
    {
      id: '4',
      originalPrompt: 'prompt de video',
      enhancedPrompt: 'prompt aprimorado de video',
      enhancementType: 'video-editing',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), // 10 days ago (within month)
      tags: ['video'],
    },
    {
      id: '5',
      originalPrompt: 'prompt de edicao',
      enhancedPrompt: 'prompt aprimorado de edicao',
      enhancementType: 'text-editing',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 40)).toISOString(), // 40 days ago (outside month)
      tags: ['edicao'],
    },
  ];
  
  const defaultProps = {
    prompts: mockPrompts,
    onPromptSelect: vi.fn(),
    onPromptDelete: vi.fn(),
    onClearHistory: vi.fn(),
    isOpen: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset body overflow style before each test
    document.body.style.overflow = '';
  });

  test('renders when isOpen is true', () => {
    render(<HistoryPanel {...defaultProps} />);
    expect(screen.getByText('Histórico de Prompts')).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    const { container } = render(<HistoryPanel {...defaultProps} isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('calls onClose when close button is clicked', () => {
    render(<HistoryPanel {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Fechar painel'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClearHistory when clear history button is clicked', () => {
    render(<HistoryPanel {...defaultProps} />);
    fireEvent.click(screen.getByTitle('Limpar todo o histórico'));
    expect(defaultProps.onClearHistory).toHaveBeenCalledTimes(1);
  });

  test('filters prompts by search term', () => {
    render(<HistoryPanel {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Buscar prompts...');
    fireEvent.change(searchInput, { target: { value: 'original 1' } });
    expect(screen.getByText('prompt original 1')).toBeInTheDocument();
    expect(screen.queryByText('prompt original 2')).not.toBeInTheDocument();
  });

  test('filters prompts by date range (today)', () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0); // Set to noon for consistency

    const mockPromptsToday: Prompt[] = [
      {
        id: '1',
        originalPrompt: 'prompt de hoje',
        enhancedPrompt: 'prompt aprimorado de hoje',
        enhancementType: 'detailed',
        timestamp: today.toISOString(),
        tags: [],
      },
    ];

    render(<HistoryPanel {...defaultProps} prompts={mockPromptsToday} />);
    fireEvent.click(screen.getByRole('button', { name: 'Hoje' }));
    expect(screen.getByText('prompt de hoje')).toBeInTheDocument();
    expect(screen.queryByText('prompt original 2')).not.toBeInTheDocument();
    expect(screen.queryByText('prompt de imagem')).not.toBeInTheDocument();
  });

  test('filters prompts by date range (week)', () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 5);

    const mockPromptsWeek: Prompt[] = [
      {
        id: '1',
        originalPrompt: 'prompt de hoje',
        enhancedPrompt: 'prompt aprimorado de hoje',
        enhancementType: 'detailed',
        timestamp: today.toISOString(),
        tags: [],
      },
      {
        id: '3',
        originalPrompt: 'prompt de imagem',
        enhancedPrompt: 'prompt aprimorado de imagem',
        enhancementType: 'image-generation',
        timestamp: fiveDaysAgo.toISOString(),
        tags: ['imagem'],
      },
    ];

    render(<HistoryPanel {...defaultProps} prompts={mockPromptsWeek} />);
    fireEvent.click(screen.getByRole('button', { name: 'Semana' }));
    expect(screen.getByText('prompt de hoje')).toBeInTheDocument();
    expect(screen.getByText('prompt de imagem')).toBeInTheDocument();
    expect(screen.queryByText('prompt original 2')).not.toBeInTheDocument();
  });

  test('filters prompts by date range (month)', () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 10);

    const mockPromptsMonth: Prompt[] = [
      {
        id: '1',
        originalPrompt: 'prompt de hoje',
        enhancedPrompt: 'prompt aprimorado de hoje',
        enhancementType: 'detailed',
        timestamp: today.toISOString(),
        tags: [],
      },
      {
        id: '4',
        originalPrompt: 'prompt de video',
        enhancedPrompt: 'prompt aprimorado de video',
        enhancementType: 'video-editing',
        timestamp: tenDaysAgo.toISOString(),
        tags: ['video'],
      },
    ];

    render(<HistoryPanel {...defaultProps} prompts={mockPromptsMonth} />);
    fireEvent.click(screen.getByRole('button', { name: 'Mês' }));
    expect(screen.getByText('prompt de hoje')).toBeInTheDocument();
    expect(screen.getByText('prompt de video')).toBeInTheDocument();
    expect(screen.queryByText('prompt original 2')).not.toBeInTheDocument();
  });

  test('filters prompts by media type (image)', () => {
    render(<HistoryPanel {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Imagem' }));
    expect(screen.getByText('prompt de imagem')).toBeInTheDocument();
    expect(screen.queryByText('prompt original 1')).not.toBeInTheDocument();
  });

  test('filters prompts by tags', () => {
    render(<HistoryPanel {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'tag1' }));
    expect(screen.getByText('prompt original 1')).toBeInTheDocument();
    expect(screen.queryByText('prompt original 2')).not.toBeInTheDocument();
  });

  test('calls onPromptSelect when "Usar este prompt" is clicked', () => {
    render(<HistoryPanel {...defaultProps} />);
    fireEvent.click(screen.getAllByTitle('Usar este prompt')[0]);
    expect(defaultProps.onPromptSelect).toHaveBeenCalledTimes(1);
    expect(defaultProps.onPromptSelect).toHaveBeenCalledWith(mockPrompts[0]);
  });

  test('calls onPromptDelete when "Excluir prompt" is clicked', () => {
    render(<HistoryPanel {...defaultProps} />);
    fireEvent.click(screen.getAllByTitle('Excluir prompt')[0]);
    expect(defaultProps.onPromptDelete).toHaveBeenCalledTimes(1);
    expect(defaultProps.onPromptDelete).toHaveBeenCalledWith(mockPrompts[0].id);
  });

  test('copies enhanced prompt to clipboard when copy button is clicked', async () => {
    render(<HistoryPanel {...defaultProps} />);
    const copyButton = screen.getAllByTitle('Copiar prompt aprimorado')[0];
    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockPrompts[0].enhancedPrompt);
    await waitFor(() => expect(screen.getAllByText('✓')[0]).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('✓')).not.toBeInTheDocument(), { timeout: 3000 });
  });

  test('displays "Nenhum prompt ainda" when no prompts are provided', () => {
    render(<HistoryPanel {...defaultProps} prompts={[]} />);
    expect(screen.getByText('Nenhum prompt ainda')).toBeInTheDocument();
  });

  test('displays "Nenhum prompt corresponde aos seus filtros" when filters yield no results', () => {
    render(<HistoryPanel {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Buscar prompts...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    expect(screen.getByText('Nenhum prompt corresponde aos seus filtros')).toBeInTheDocument();
  });

  test('body overflow is hidden when panel is open and restored when closed', () => {
    const { rerender } = render(<HistoryPanel {...defaultProps} isOpen={true} />);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<HistoryPanel {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('');
  });
});