import React from 'react';
import { render, screen } from '@testing-library/react';
import { PromptAnalytics } from './PromptAnalytics';
import { vi } from 'vitest';
import type { Prompt } from '../types';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
  },
}));

const mockPrompts: Prompt[] = [
  {
    id: '1',
    originalPrompt: 'prompt 1',
    enhancedPrompt: 'enhanced prompt 1',
    enhancementType: 'detailed',
    timestamp: new Date(new Date().setDate(new Date().getDate())).toISOString(),
    characterCount: 10,
    tags: [],
  },
  {
    id: '2',
    originalPrompt: 'prompt 2',
    enhancedPrompt: 'enhanced prompt 2',
    enhancementType: 'creative',
    timestamp: new Date(new Date().setDate(new Date().getDate())).toISOString(),
    characterCount: 20,
    tags: [],
  },
  {
    id: '3',
    originalPrompt: 'prompt 3',
    enhancedPrompt: 'enhanced prompt 3',
    enhancementType: 'detailed',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(), // Last week
    characterCount: 30,
    tags: [],
  },
  {
    id: '4',
    originalPrompt: 'prompt 4',
    enhancedPrompt: 'enhanced prompt 4',
    enhancementType: 'image-realistic',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    characterCount: 40,
    tags: [],
    mediaType: 'image',
  },
  {
    id: '5',
    originalPrompt: 'prompt 5',
    enhancedPrompt: 'enhanced prompt 5',
    enhancementType: 'video-cinematic',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    characterCount: 50,
    tags: [],
    mediaType: 'video',
  },
];

describe('PromptAnalytics', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const mockDate = new Date(2024, 6, 26, 10, 0, 0); // July 26, 2024, 10:00:00
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders with no prompts', () => {
    render(<PromptAnalytics prompts={[]} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('prompts criados')).toBeInTheDocument();
    
    // Check for all the zeros more specifically by using getAllByText
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThan(0); // Should have multiple zeros
  });

  test('renders with provided prompts and displays correct metrics', () => {
    render(<PromptAnalytics prompts={mockPrompts} />);

    // Check for text labels first
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Hoje')).toBeInTheDocument();
    expect(screen.getByText('Tendência')).toBeInTheDocument();
    expect(screen.getByText('prompts criados')).toBeInTheDocument();
    expect(screen.getByText('prompts hoje')).toBeInTheDocument();

    // Check for specific values using more specific queries
    const totalElements = screen.getAllByText('5');
    expect(totalElements.length).toBeGreaterThan(0); // Should have total and month count
    
    // Check for trend - it should be a positive percentage
    expect(screen.getByText(/\+.*%/)).toBeInTheDocument(); // Any positive percentage
    
    // Check for time format
    expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument(); // Time format

    // Enhancement Types section
    expect(screen.getByText('Tipos de Aprimoramento')).toBeInTheDocument();
    
    // Media Types section
    expect(screen.getByText('Tipos de Mídia')).toBeInTheDocument();

    // Additional Stats section
    expect(screen.getByText('Estatísticas Adicionais')).toBeInTheDocument();
    expect(screen.getByText('Caracteres médios')).toBeInTheDocument();
    expect(screen.getByText('Esta semana')).toBeInTheDocument();
    expect(screen.getByText('Este mês')).toBeInTheDocument();
    expect(screen.getByText('Tokens médios')).toBeInTheDocument();
  });

  test('calculates weekly trend correctly when no previous week data', () => {
    const newPrompts: Prompt[] = [
      {
        id: '1',
        originalPrompt: 'prompt 1',
        enhancedPrompt: 'enhanced prompt 1',
        enhancementType: 'detailed',
        timestamp: new Date(new Date().setDate(new Date().getDate())).toISOString(),
        characterCount: 10,
        tags: [],
      },
    ];
    render(<PromptAnalytics prompts={newPrompts} />);
    expect(screen.getByText('+100%')).toBeInTheDocument();
  });

  test('calculates weekly trend correctly when no current week data', () => {
    const newPrompts: Prompt[] = [
      {
        id: '1',
        originalPrompt: 'prompt 1',
        enhancedPrompt: 'enhanced prompt 1',
        enhancementType: 'detailed',
        timestamp: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(),
        characterCount: 10,
        tags: [],
      },
    ];
    render(<PromptAnalytics prompts={newPrompts} />);
    expect(screen.getByText('-100%')).toBeInTheDocument(); // Decrease from 1 to 0 prompts
  });
});
