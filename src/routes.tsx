import { Card } from '@components/ui/card';
import { Guard } from '@ui/Guard';
import { StatusBanner } from '@ui/StatusBanner';
import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const loadDeposit = () => import('@ui/Deposit');
const loadWithdraw = () => import('@ui/Withdraw');
const loadDepositEth = () => import('@ui/DepositEth');
const loadWithdrawEth = () => import('@ui/WithdrawEth');
const loadWithdrawProgress = () => import('@ui/WithdrawProgress');
const loadBalances = () => import('@ui/Balances');

import { isPrefetchEnabled, runIdle, shouldSkipByNetwork } from './lib/prefetch';
import type { PrefetchKey } from './lib/prefetchKeys';
const prefetched = new Set<PrefetchKey>();

export const prefetchRoute = (key: PrefetchKey) => prefetchers[key]();

export const prefetchIfNeeded = (key: PrefetchKey) => {
  if (!isPrefetchEnabled()) return;
  if (prefetched.has(key)) return;
  if (shouldSkipByNetwork()) return;
  const run = () => {
    prefetched.add(key);
    prefetchers[key]();
  };

  runIdle(run, 1000);
};

const prefetchers: Record<PrefetchKey, () => Promise<unknown>> = {
  home: () => loadBalances(),
  'token-deposit': () => loadDeposit(),
  'token-withdraw': () => loadWithdraw(),
  'eth-deposit': () => loadDepositEth(),
  'eth-withdraw': () => loadWithdrawEth(),
  'withdraw-progress': () => loadWithdrawProgress(),
};

const Deposit = lazy(() => loadDeposit().then((m) => ({ default: m.Deposit })));
const Withdraw = lazy(() => loadWithdraw().then((m) => ({ default: m.Withdraw })));
const DepositEth = lazy(() => loadDepositEth().then((m) => ({ default: m.DepositEth })));
const WithdrawEth = lazy(() => loadWithdrawEth().then((m) => ({ default: m.WithdrawEth })));
const WithdrawProgress = lazy(() =>
  loadWithdrawProgress().then((m) => ({ default: m.WithdrawProgress })),
);
const Balances = lazy(() => loadBalances().then((m) => ({ default: m.Balances })));

import { t } from '@lib/i18n';

export function AppRoutes() {
  return (
    <>
      <StatusBanner />
      <Suspense fallback={<div>{t('loading_page')}</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <Card>
                <Balances />
              </Card>
            }
          />

          <Route
            path="/deposit"
            element={
              <Guard need="sepolia">
                <Card>
                  <Deposit />
                </Card>
              </Guard>
            }
          />

          <Route
            path="/withdraw"
            element={
              <Guard need="giwa">
                <Card>
                  <Withdraw />
                </Card>
              </Guard>
            }
          />

          <Route
            path="/eth/deposit"
            element={
              <Guard need="sepolia">
                <Card>
                  <DepositEth />
                </Card>
              </Guard>
            }
          />

          <Route
            path="/eth/withdraw"
            element={
              <Guard need="giwa">
                <Card>
                  <WithdrawEth />
                </Card>
              </Guard>
            }
          />

          <Route
            path="/withdraw/progress"
            element={
              <Guard need="sepolia">
                <Card>
                  <WithdrawProgress />
                </Card>
              </Guard>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}
