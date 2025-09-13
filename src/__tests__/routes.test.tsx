import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { App } from '@ui/App';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { WagmiProvider } from 'wagmi';

import { wagmiConfig } from '@/wagmi';

describe('routes', () => {
  it('renders home route and balance notice when disconnected', async () => {
    const qc = new QueryClient();

    render(
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={qc}>
          <MemoryRouter
            initialEntries={['/']}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <App />
          </MemoryRouter>
        </QueryClientProvider>
      </WagmiProvider>,
    );
    expect(await screen.findByText(/지갑 연결 필요/)).toBeInTheDocument();
  });
});
