import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { App } from '@ui/App';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { WagmiProvider } from 'wagmi';

import { wagmiConfig } from '@/wagmi';

describe('App', () => {
  it('should render headings and buttons', () => {
    const qc = new QueryClient();

    render(
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={qc}>
          <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <App />
          </MemoryRouter>
        </QueryClientProvider>
      </WagmiProvider>,
    );
    expect(screen.getByText(/GIWA Bridge/i)).toBeInTheDocument();
  });
});
