import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePromptEnhancement } from './usePromptEnhancement';
import { promptEnhancementService, getLocalEnhancement } from '../services/apiService';

// Mock apiService
vi.mock('../services/apiService', () => ({
  promptEnhancementService: {
    enhancePrompt: vi.fn(),
  },
  getLocalEnhancement: vi.fn(),
}));

describe('usePromptEnhancement', () => {
  let mockOnSuccess: vi.Mock;
  let mockOnSave: vi.Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSuccess = vi.fn();
    mockOnSave = vi.fn();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePromptEnhancement(mockOnSuccess, mockOnSave));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful prompt enhancement', async () => {
    const mockEnhancedPrompt = 'This is an enhanced prompt.';
    (promptEnhancementService.enhancePrompt as vi.Mock).mockResolvedValueOnce({
      success: true,
      enhancedPrompt: mockEnhancedPrompt,
    });

    const { result } = renderHook(() => usePromptEnhancement(mockOnSuccess, mockOnSave));

    await act(async () => {
      await result.current.enhancePrompt('original prompt', 'detailed');
    });

    expect(promptEnhancementService.enhancePrompt).toHaveBeenCalledTimes(1);
    expect(promptEnhancementService.enhancePrompt).toHaveBeenCalledWith(
      'original prompt',
      'detailed'
    );
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    expect(mockOnSuccess).toHaveBeenCalledWith(mockEnhancedPrompt);
    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      originalPrompt: 'original prompt',
      enhancedPrompt: mockEnhancedPrompt,
    }));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle prompt enhancement error and fallback to local', async () => {
    const errorMessage = 'API failed';
    const mockLocalEnhanced = 'Local enhanced prompt.';

    (promptEnhancementService.enhancePrompt as vi.Mock).mockResolvedValueOnce({
      success: false,
      error: errorMessage,
    });
    (getLocalEnhancement as vi.Mock).mockReturnValueOnce(mockLocalEnhanced);

    const { result } = renderHook(() => usePromptEnhancement(mockOnSuccess, mockOnSave));

    await act(async () => {
      await result.current.enhancePrompt('original prompt', 'detailed');
    });

    expect(promptEnhancementService.enhancePrompt).toHaveBeenCalledTimes(1);
    expect(getLocalEnhancement).toHaveBeenCalledTimes(1);
    expect(getLocalEnhancement).toHaveBeenCalledWith('original prompt', 'detailed');
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    expect(mockOnSuccess).toHaveBeenCalledWith(mockLocalEnhanced);
    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      originalPrompt: 'original prompt',
      enhancedPrompt: mockLocalEnhanced,
    }));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toContain(`Aviso: ${errorMessage}. Usando aprimoramento local.`);
  });

  it('should handle complete failure (API and local fallback)', async () => {
    (promptEnhancementService.enhancePrompt as vi.Mock).mockRejectedValueOnce(new Error('Network error'));
    (getLocalEnhancement as vi.Mock).mockImplementationOnce(() => {
      throw new Error('Local fallback failed');
    });

    const { result } = renderHook(() => usePromptEnhancement(mockOnSuccess, mockOnSave));

    await act(async () => {
      await result.current.enhancePrompt('original prompt', 'detailed');
    });

    expect(promptEnhancementService.enhancePrompt).toHaveBeenCalledTimes(1);
    expect(getLocalEnhancement).toHaveBeenCalledTimes(1);
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Erro ao processar o prompt. Tente novamente.');
  });

  it('should set isLoading to true during enhancement and false afterwards', async () => {
    (promptEnhancementService.enhancePrompt as vi.Mock).mockResolvedValueOnce({
      success: true,
      enhancedPrompt: 'enhanced',
    });

    const { result } = renderHook(() => usePromptEnhancement(mockOnSuccess, mockOnSave));

    let enhancePromise: Promise<void>;
    act(() => {
      enhancePromise = result.current.enhancePrompt('original', 'detailed');
    });

    // At this point, isLoading should be true
    expect(result.current.isLoading).toBe(true);

    // Await the promise to ensure all async updates are flushed
    await act(async () => {
      await enhancePromise;
    });

    // After the promise resolves, isLoading should be false
    expect(result.current.isLoading).toBe(false);
  });

  it('should clear error on new enhancement call', async () => {
    // First call to set error
    (promptEnhancementService.enhancePrompt as vi.Mock)
      .mockResolvedValueOnce({ success: false, error: 'initial error from API' });
    (getLocalEnhancement as vi.Mock).mockReturnValueOnce('local fallback prompt');

    const { result } = renderHook(() => usePromptEnhancement(mockOnSuccess, mockOnSave));

    await act(async () => {
      await result.current.enhancePrompt('prompt1', 'detailed');
    });

    expect(result.current.error).toContain('Aviso: initial error from API. Usando aprimoramento local.');

    // Second call (successful)
    (promptEnhancementService.enhancePrompt as vi.Mock)
      .mockResolvedValueOnce({ success: true, enhancedPrompt: 'new enhanced' });

    await act(async () => {
      await result.current.enhancePrompt('prompt2', 'detailed');
    });

    expect(result.current.error).toBeNull();
    expect(mockOnSuccess).toHaveBeenCalledWith('new enhanced');
  });

  it('should clear error when clearError is called', async () => {
    const { result } = renderHook(() => usePromptEnhancement(mockOnSuccess, mockOnSave));
    
    // Simulate an error occurring
    (promptEnhancementService.enhancePrompt as vi.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Simulated error',
    });
    (getLocalEnhancement as vi.Mock).mockReturnValueOnce('local fallback for error');

    await act(async () => {
      await result.current.enhancePrompt('valid prompt', 'detailed');
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.error).toContain('Simulated error');

    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });
});