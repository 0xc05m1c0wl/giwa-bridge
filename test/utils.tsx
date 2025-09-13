import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';

import { wagmiConfig } from '@/wagmi';

export function renderWithProviders(
  ui: React.ReactElement,
  options?: { route?: string },
): RenderResult {
  const qc = new QueryClient();
  const route = options?.route ?? '/';

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={qc}>
          <MemoryRouter
            initialEntries={[route]}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            {children}
          </MemoryRouter>
        </QueryClientProvider>
      </WagmiProvider>
    );
  }

  return render(ui, { wrapper: Wrapper as React.ComponentType });
}
