import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the calculator inside the themed layout', () => {
    render(<App />);

    expect(screen.getByTestId('calculator')).toBeInTheDocument();
    expect(screen.getByTestId('calculator-display')).toHaveTextContent('0');
  });
});
