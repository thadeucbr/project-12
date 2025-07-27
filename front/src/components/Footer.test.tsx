import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';
import { vi } from 'vitest';

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
      footer: (props: MotionProps) => <footer {...filterMotionProps(props)} />,
      div: (props: MotionProps) => <div {...filterMotionProps(props)} />,
      a: (props: MotionProps) => <a {...filterMotionProps(props)} />,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe('Footer', () => {
  test('renders the footer with correct text content', () => {
    render(<Footer />);
    expect(screen.getByText('Desenvolvido com')).toBeInTheDocument();
    expect(screen.getByText('por')).toBeInTheDocument();
    expect(screen.getByText('com muita ajuda de')).toBeInTheDocument();
    expect(screen.getByText('© 2024 Prompts Barbudas. Transformando ideias em prompts poderosos.')).toBeInTheDocument();
  });

  test('renders the LinkedIn link with correct attributes', () => {
    render(<Footer />);
    const linkedinLink = screen.getByRole('link', { name: /Thadeu Castelo Branco Ramos/i });
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/thadeucbr/');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('renders the bolt.new link with correct attributes', () => {
    render(<Footer />);
    const boltLink = screen.getByRole('link', { name: /bolt.new/i });
    expect(boltLink).toBeInTheDocument();
    expect(boltLink).toHaveAttribute('href', 'https://bolt.new');
    expect(boltLink).toHaveAttribute('target', '_blank');
    expect(boltLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
