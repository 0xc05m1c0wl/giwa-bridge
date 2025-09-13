import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@ui/ErrorBoundary';
import { ToastViewport } from '@ui/ToastViewport';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';

import { wagmiConfig } from '@/wagmi';

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  const rawBase = (import.meta.env.BASE_URL || '/') as string;
  const basename = rawBase === '/' ? undefined : rawBase.replace(/\/+$/, '');

  return (
    <React.StrictMode>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter
            basename={basename}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <ErrorBoundary>{children}</ErrorBoundary>
          </BrowserRouter>
          <ToastViewport />
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  );
}
