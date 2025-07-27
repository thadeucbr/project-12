import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyticsService } from './analyticsService';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AnalyticsService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should track access successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
      status: 200,
    });

    const data = { ip: '127.0.0.1', prompt: 'test prompt', enhancementType: 'detailed' };
    await analyticsService.trackAccess(data);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/analytics/track'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      })
    );
  });

  it('should handle error when tracking access', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: () => Promise.resolve('Server error'),
    });

    const data = { ip: '127.0.0.1' };
    await analyticsService.trackAccess(data);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Erro ao rastrear acesso:',
      expect.any(Error)
    );
    consoleErrorSpy.mockRestore();
  });

  it('should get stats successfully', async () => {
    const mockStats = {
      totalAccesses: 100,
      todayAccesses: 10,
      totalPrompts: 50,
      enhancementTypes: { detailed: 30, creative: 20 },
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStats),
      status: 200,
    });

    const stats = await analyticsService.getStats();

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/analytics/stats'),
      expect.objectContaining({
        method: 'GET',
      })
    );
    expect(stats).toEqual(mockStats);
  });

  it('should handle error when getting stats', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: () => Promise.resolve('Stats not found'),
    });

    const stats = await analyticsService.getStats();

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Erro ao buscar estatísticas:',
      expect.any(Error)
    );
    expect(stats).toBeNull();
    consoleErrorSpy.mockRestore();
  });
});