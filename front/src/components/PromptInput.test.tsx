import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PromptInput } from './PromptInput';

describe('PromptInput', () => {
  it('should render the textarea and buttons', () => {
    render(<PromptInput onSubmit={() => {}} isLoading={false} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('placeholder', expect.stringContaining('Descreva o que você quer criar'));
    expect(screen.getByRole('button', { name: /Aprimorar/i })).toBeInTheDocument();
  });
});