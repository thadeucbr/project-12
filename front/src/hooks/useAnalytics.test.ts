import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAnalytics } from './useAnalytics';
import { analyticsService } from '../services/analyticsService';

// Mock analyticsService
vi.mock('../services/analyticsService', () => ({
  analyticsService: {
    trackAccess: vi.fn(),
    getStats: vi.fn(),
  },
}));

// Mock the internal getUserIP function within useAnalytics module
vi.mock('./useAnalytics', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // We need to mock the internal getUserIP function that useAnalytics uses
    // This is a bit tricky as getUserIP is not exported, but we can mock the module itself
    // and provide a mocked version of the hook that uses a mocked getUserIP.
    // However, a simpler approach for testing the hook's behavior is to ensure
    // that the analyticsService.trackAccess is called with the expected IP.
    // The previous mock was trying to mock the hook itself, which is not ideal.
    // Let's go back to mocking global fetch, but ensure it's properly awaited.
  };
});

// Mock global fetch for getUserIP
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ip: '127.0.0.1' }),
    });
  });

  it('should call trackAccess on trackPageView', async () => {
    const { result: _result } = renderHook(() => useAnalytics());

    // Wait for useEffect to run and for the async operation inside it to complete
    await act(async () => {
      // The useEffect in useAnalytics calls trackPageView on mount
      // We need to ensure that the async operation within trackPageView completes
      // before asserting on analyticsService.trackAccess
      // Since trackPageView is called inside useEffect, we don't call it directly here.
      // The act wrapper around renderHook ensures effects are flushed.
    });

    expect(analyticsService.trackAccess).toHaveBeenCalledTimes(1);
    expect(analyticsService.trackAccess).toHaveBeenCalledWith({
      ip: '127.0.0.1',
    });
  });

  it('should call trackAccess on trackPromptCreation', async () => {
    const { result } = renderHook(() => useAnalytics());
    const mockPrompt = 'My test prompt';
    const mockType = 'detailed';

    // Ensure initial trackPageView completes before testing trackPromptCreation
    await act(async () => {
      // Flush effects from initial render
    });

    // Mock fetch again for the second call to getUserIP within trackPromptCreation
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ip: '127.0.0.1' }),
    });

    await act(async () => {
      result.current.trackPromptCreation(mockPrompt, mockType);
    });

    // Expect 2 calls: one for trackPageView (on mount) and one for trackPromptCreation
    expect(analyticsService.trackAccess).toHaveBeenCalledTimes(2);
    expect(analyticsService.trackAccess).toHaveBeenCalledWith({
      ip: '127.0.0.1',
      prompt: mockPrompt,
      enhancementType: mockType,
    });
  });
});