import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorMessage } from './ErrorMessage';
import { vi } from 'vitest';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => {
  const filterMotionProps = (props: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { whileHover, whileTap, layout, ...cleanProps } = props;
    return cleanProps;
  };

  return {
    motion: {
      div: (props: any) => <div {...filterMotionProps(props)} />,
      button: (props: any) => <button {...filterMotionProps(props)} />,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe('ErrorMessage', () => {
  const mockOnDismiss = vi.fn();
  const mockOnRetry = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders nothing when message is null', () => {
    const { container } = render(<ErrorMessage message={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders nothing when message is an empty string', () => {
    const { container } = render(<ErrorMessage message="" />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders the message when provided', () => {
    const testMessage = 'This is an error message.';
    render(<ErrorMessage message={testMessage} />);
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  test('calls onDismiss when dismiss button is clicked', () => {
    const testMessage = 'Dismissable message.';
    render(<ErrorMessage message={testMessage} onDismiss={mockOnDismiss} />);
    const dismissButton = screen.getByTitle('Fechar');
    fireEvent.click(dismissButton);
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  test('calls onRetry when retry button is clicked', () => {
    const testMessage = 'Retryable message.';
    render(<ErrorMessage message={testMessage} onRetry={mockOnRetry} />);
    const retryButton = screen.getByTitle('Tentar novamente');
    fireEvent.click(retryButton);
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  test('renders error type by default with correct icon and styles', () => {
    const testMessage = 'Default error.';
    render(<ErrorMessage message={testMessage} />);
    const errorMessageContainer = screen.getByText(testMessage).closest('.rounded-xl');
    expect(errorMessageContainer).toBeInTheDocument();
    expect(errorMessageContainer).toHaveClass('bg-red-50');
    expect(screen.getByTestId('error-icon').querySelector('svg')).toHaveClass('text-red-500'); // AlertCircle icon
  });

  test('renders warning type with correct icon and styles', () => {
    const testMessage = 'Warning message.';
    render(<ErrorMessage message={testMessage} type="warning" />);
    const errorMessageContainer = screen.getByText(testMessage).closest('.rounded-xl');
    expect(errorMessageContainer).toBeInTheDocument();
    expect(errorMessageContainer).toHaveClass('bg-orange-50');
    expect(screen.getByTestId('error-icon').querySelector('svg')).toHaveClass('text-orange-500'); // AlertCircle icon
  });

  test('renders info type with correct icon and styles', () => {
    const testMessage = 'Info message.';
    render(<ErrorMessage message={testMessage} type="info" />);
    const errorMessageContainer = screen.getByText(testMessage).closest('.rounded-xl');
    expect(errorMessageContainer).toBeInTheDocument();
    expect(errorMessageContainer).toHaveClass('bg-blue-50');
    expect(screen.getByTestId('error-icon').querySelector('svg')).toHaveClass('text-blue-500'); // Wifi icon
  });

  test('does not render dismiss button if onDismiss is not provided', () => {
    render(<ErrorMessage message="Test" />);
    expect(screen.queryByTitle('Fechar')).not.toBeInTheDocument();
  });

  test('does not render retry button if onRetry is not provided', () => {
    render(<ErrorMessage message="Test" />);
    expect(screen.queryByTitle('Tentar novamente')).not.toBeInTheDocument();
  });
});
