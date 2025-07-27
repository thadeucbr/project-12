import { describe, it, expect, vi, beforeEach } from 'vitest';
import { promptEnhancementService } from './apiService';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('promptEnhancementService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should enhance prompt successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ output: '**Prompt:** Enhanced prompt. **End of Prompt.**' }),
      status: 200,
    });

    const result = await promptEnhancementService.enhancePrompt('test prompt', 'detailed');
    expect(result.success).toBe(true);
    expect(result.enhancedPrompt).toBe('Enhanced prompt.');
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/llm'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('test prompt'),
      })
    );
  });

  it('should handle API error during prompt enhancement', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: () => Promise.resolve('Server error'),
    });

    const result = await promptEnhancementService.enhancePrompt('test prompt', 'detailed');
    expect(result.success).toBe(false);
    expect(result.error).toContain('API Error: 500 - Internal Server Error. Details: Server error');
  });

  it('should request new session token on 401 and retry', async () => {
    // First call: 401 Unauthorized
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: () => Promise.resolve('Unauthorized'),
    });
    // Second call (token refresh): success
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
      status: 200,
    });
    // Third call (retry original request): success
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ output: '**Prompt:** Retried enhanced prompt. **End of Prompt.**' }),
      status: 200,
    });

    const result = await promptEnhancementService.enhancePrompt('test prompt', 'detailed');
    expect(result.success).toBe(true);
    expect(result.enhancedPrompt).toBe('Retried enhanced prompt.');
    expect(mockFetch).toHaveBeenCalledTimes(3); // 401, token refresh, retry
  });

  it('should return error if prompt is empty', async () => {
    const result = await promptEnhancementService.enhancePrompt('', 'detailed');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Prompt cannot be empty');
    expect(result.enhancedPrompt).toBe('');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should handle invalid API response format', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ someOtherField: 'value' }), // Invalid format
      status: 200,
    });

    const result = await promptEnhancementService.enhancePrompt('test prompt', 'detailed');
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid response from the enhancement API.');
    expect(result.enhancedPrompt).toBe('');
  });
});