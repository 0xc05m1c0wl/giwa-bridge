import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@ui/ErrorBoundary';
import { ToastViewport } from '@ui/ToastViewport';
import React from 'react';
import { HashRouter } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';

import { wagmiConfig } from '@/wagmi';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <React.StrictMode>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ErrorBoundary>{children}</ErrorBoundary>
          </HashRouter>
          <ToastViewport />
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  );
}
