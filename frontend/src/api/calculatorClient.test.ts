import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildCalculateUrl,
  calculate,
  CalculatorApiError,
} from './calculatorClient';

describe('calculatorClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns result on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ result: 15 }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await calculate({ operation: 'add', operands: [10, 5] }, fetchMock);

    expect(result).toBe(15);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/calculate',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'add', operands: [10, 5] }),
      }),
    );
  });

  it('throws CalculatorApiError on API error response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      text: async () =>
        JSON.stringify({
          error: { code: 'DIVISION_BY_ZERO', message: 'Cannot divide by zero.' },
        }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      calculate({ operation: 'divide', operands: [10, 0] }, fetchMock),
    ).rejects.toMatchObject({
      code: 'DIVISION_BY_ZERO',
      message: 'Cannot divide by zero.',
    });
  });

  it('throws on network failure', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network'));
    vi.stubGlobal('fetch', fetchMock);

    await expect(calculate({ operation: 'add', operands: [1, 2] }, fetchMock)).rejects.toBeInstanceOf(
      CalculatorApiError,
    );
  });

  it('throws on invalid JSON response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => 'not-json',
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(calculate({ operation: 'add', operands: [1, 2] }, fetchMock)).rejects.toMatchObject({
      code: 'INVALID_RESPONSE',
    });
  });

  it('buildCalculateUrl trims trailing slash from base URL', () => {
    expect(buildCalculateUrl('http://localhost:3000/')).toBe(
      'http://localhost:3000/api/v1/calculate',
    );
  });
});
