import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AppProviders } from '@/providers/AppProviders';

function Boom(): JSX.Element {
  throw new Error('boom');
}

describe('AppProviders', () => {
  it('should capture error and show default fallback (ErrorBoundary)', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <AppProviders>
        <Boom />
      </AppProviders>,
    );
    expect(screen.getByText(/Error occurred|오류/)).toBeInTheDocument();
    err.mockRestore();
  });
});
