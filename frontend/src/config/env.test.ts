import { describe, expect, it } from 'vitest';
import { apiBaseUrl } from './env';

describe('env', () => {
  it('exposes a non-empty API base URL', () => {
    expect(apiBaseUrl).toBeTruthy();
    expect(apiBaseUrl).not.toMatch(/\/$/);
  });
});
