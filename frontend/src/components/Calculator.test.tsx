import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as calculatorClient from '../api/calculatorClient';
import * as calculatorReducerModule from '../utils/calculatorReducer';
import { Calculator } from './Calculator';

function mockFetchSuccess(result: number) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    text: async () => JSON.stringify({ result }),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function mockFetchError(message: string, code = 'DIVISION_BY_ZERO') {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: false,
    text: async () => JSON.stringify({ error: { code, message } }),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('Calculator', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders initial display and controls', () => {
    render(<Calculator />);
    expect(screen.getByTestId('calculator-display')).toHaveTextContent('0');
    expect(screen.getByRole('button', { name: 'Clear entry' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
  });

  it('updates display when digits are entered', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: '3' }));

    expect(screen.getByTestId('calculator-display')).toHaveTextContent('123');
  });

  it('disables other binary operators after selecting one', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '+' }));

    expect(screen.getByRole('button', { name: '+' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '+' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '×' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Square root' })).toBeDisabled();
    expect(screen.getByText('1 +')).toBeInTheDocument();
  });

  it('performs a successful binary calculation', async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetchSuccess(15);
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '0' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: 'Equals' }));

    await waitFor(() => {
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('15');
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/calculate',
      expect.objectContaining({
        body: JSON.stringify({ operation: 'add', operands: [10, 5] }),
      }),
    );
  });

  it('performs square root on the first operand', async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetchSuccess(4);
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '6' }));

    expect(screen.getByRole('button', { name: 'Square root' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Square root' }));

    await waitFor(() => {
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('4');
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/calculate',
      expect.objectContaining({
        body: JSON.stringify({ operation: 'sqrt', operands: [16] }),
      }),
    );
  });

  it('performs square root after a result is shown', async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ result: 16 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ result: 4 }),
      });
    vi.stubGlobal('fetch', fetchMock);
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '6' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '0' }));
    await user.click(screen.getByRole('button', { name: 'Equals' }));

    await waitFor(() => {
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('16');
    });

    expect(screen.getByRole('button', { name: 'Square root' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Square root' }));

    await waitFor(() => {
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('4');
    });

    expect(fetchMock).toHaveBeenLastCalledWith(
      'http://localhost:3000/api/v1/calculate',
      expect.objectContaining({
        body: JSON.stringify({ operation: 'sqrt', operands: [16] }),
      }),
    );
  });

  it('shows backend error messages', async () => {
    const user = userEvent.setup();
    mockFetchError('Cannot divide by zero.');
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '8' }));
    await user.click(screen.getByRole('button', { name: '÷' }));
    await user.click(screen.getByRole('button', { name: '0' }));
    await user.click(screen.getByRole('button', { name: 'Equals' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Cannot divide by zero.');
    });
  });

  it('clears state when CE is pressed', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '9' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: 'Clear entry' }));

    expect(screen.getByTestId('calculator-display')).toHaveTextContent('0');
    expect(screen.getByRole('button', { name: '+' })).not.toHaveAttribute('aria-pressed', 'true');
  });

  it('removes the last digit with backspace', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: 'Backspace' }));

    expect(screen.getByTestId('calculator-display')).toHaveTextContent('1');
  });

  it('accepts keyboard digit and operator input', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.keyboard('12+3');

    expect(screen.getByText('12 +')).toBeInTheDocument();
    expect(screen.getByTestId('calculator-display')).toHaveTextContent('3');
  });

  it('clears with Escape key', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.keyboard('9');
    await user.keyboard('{Escape}');

    expect(screen.getByTestId('calculator-display')).toHaveTextContent('0');
  });

  it('shows a client-side error when calculation cannot be built', async () => {
    const user = userEvent.setup();
    vi.spyOn(calculatorReducerModule, 'buildCalculateRequest').mockReturnValue({
      request: null,
      error: null,
    });
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: 'Equals' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Calculation failed.');
  });

  it('shows a generic error for unexpected calculation failures', async () => {
    const user = userEvent.setup();
    vi.spyOn(calculatorClient, 'calculate').mockRejectedValue(new Error('unexpected'));
    render(<Calculator />);

    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: 'Equals' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('An unexpected error occurred.');
  });
});
