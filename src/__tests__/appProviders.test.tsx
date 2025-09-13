import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AppProviders } from '@/providers/AppProviders';

function Boom(): JSX.Element {
  throw new Error('boom');
}

describe('AppProviders', () => {
  it('ErrorBoundary가 오류를 잡아 기본 폴백을 표시', () => {
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
