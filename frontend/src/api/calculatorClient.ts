import { apiBaseUrl } from '../config/env';
import type {
  CalculateErrorResponse,
  CalculateRequest,
  CalculateResponse,
} from '../types/calculator';

export class CalculatorApiError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'CalculatorApiError';
    this.code = code;
  }
}

export function buildCalculateUrl(baseUrl: string = apiBaseUrl): string {
  return `${baseUrl.replace(/\/$/, '')}/api/v1/calculate`;
}

export async function calculate(
  request: CalculateRequest,
  fetchImpl: typeof fetch = fetch,
): Promise<number> {
  let response: Response;
  try {
    response = await fetchImpl(buildCalculateUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  } catch {
    throw new CalculatorApiError('NETWORK_ERROR', 'Could not reach calculator API.');
  }

  const text = await response.text();
  let payload: unknown;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    throw new CalculatorApiError('INVALID_RESPONSE', 'Calculator API returned invalid JSON.');
  }

  if (response.ok) {
    const success = payload as CalculateResponse;
    if (typeof success?.result !== 'number' || !Number.isFinite(success.result)) {
      throw new CalculatorApiError('INVALID_RESPONSE', 'Calculator API returned an invalid result.');
    }
    return success.result;
  }

  const failure = payload as CalculateErrorResponse;
  const message = failure?.error?.message ?? 'Calculation failed.';
  const code = failure?.error?.code ?? 'UNKNOWN_ERROR';
  throw new CalculatorApiError(code, message);
}
