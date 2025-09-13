import { Card } from '@components/ui/card';
import { Container } from '@components/ui/container';
import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs';
import { usePrefetchHandlers } from '@hooks/usePrefetchHandlers';
import { useStorageToggle } from '@hooks/useStorageToggle';
import { useTheme } from '@hooks/useTheme';
import { getLocale, setLocale, t } from '@lib/i18n';
import type { PrefetchKey } from '@lib/prefetchKeys';
import { Connect } from '@ui/Connect';
import React, { useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { AppRoutes } from '@/routes';

const tabToPath: Record<PrefetchKey, string> = {
  home: '/',
  'token-deposit': '/deposit',
  'token-withdraw': '/withdraw',
  'eth-deposit': '/eth/deposit',
  'eth-withdraw': '/eth/withdraw',
  'withdraw-progress': '/withdraw/progress',
};

export function App() {
  const [_locale, setLocaleState] = useState(getLocale());
  const change = (l: 'ko' | 'en') => {
    setLocale(l);
    setLocaleState(l);
  };

  const [dark, toggleTheme] = useTheme();
  const [prefetchOn, togglePrefetch] = useStorageToggle('prefetch', true);

  return (
    <Container className="pt-12">
      <h1 className="text-2xl font-semibold">{t('app_title')}</h1>
      <p className="text-slate-600 dark:text-slate-300">{t('app_intro')}</p>
      <Card>
        <Connect />
      </Card>
      {}
      <div className="flex items-center justify-between gap-3">
        <div className="md:hidden">
          <NavTabs />
        </div>
        <div className="flex items-center gap-2 flex-wrap" aria-label="설정/전환">
          <button className="px-2 py-1 text-sm rounded-md border" onClick={() => change('ko')}>
            KO
          </button>
          <button className="px-2 py-1 text-sm rounded-md border" onClick={() => change('en')}>
            EN
          </button>
          <button className="px-2 py-1 text-sm rounded-md border" onClick={toggleTheme}>
            {dark ? 'Light' : 'Dark'}
          </button>
          <button className="px-2 py-1 text-sm rounded-md border" onClick={togglePrefetch}>
            {prefetchOn ? t('prefetch_on') : t('prefetch_off')}
          </button>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4 items-start">
        <aside className="hidden md:block">
          <SidebarNav />
        </aside>
        <section>
          <AppRoutes />
        </section>
      </div>
      <footer className="mt-10 text-xs text-slate-500 dark:text-slate-400">
        {t('footer_open_source')} ·{' '}
        <a
          href="https://github.com/0xc05m1c0wl/giwa-bridge"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-700 dark:hover:text-slate-200"
        >
          GitHub
        </a>
      </footer>
    </Container>
  );
}

function getBaseUrl() {
  return (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
}

function normalizePathname(pathname: string, base: string) {
  if (base && pathname.startsWith(base)) {
    const sliced = pathname.slice(base.length);

    return sliced || '/';
  }

  return pathname;
}

function mapPathToTab(p: string): PrefetchKey {
  if (p === '/') return 'home';
  if (p.startsWith('/withdraw/progress')) return 'withdraw-progress';
  if (p.startsWith('/deposit')) return 'token-deposit';
  if (p.startsWith('/withdraw')) return 'token-withdraw';
  if (p.startsWith('/eth/deposit')) return 'eth-deposit';
  if (p.startsWith('/eth/withdraw')) return 'eth-withdraw';

  return 'home';
}

function NavTabs() {
  const location = useLocation();
  const navigate = useNavigate();

  const value = useMemo(() => {
    const base = getBaseUrl();
    const p = normalizePathname(location.pathname, base);

    return mapPathToTab(p);
  }, [location.pathname]);

  return (
    <Tabs value={value} onValueChange={(v) => navigate(tabToPath[v as PrefetchKey])}>
      <TabsList>
        <TabsTrigger value="home" {...usePrefetchHandlers('home')}>
          {t('nav_home')}
        </TabsTrigger>
        <TabsTrigger value="token-deposit" {...usePrefetchHandlers('token-deposit')}>
          {t('nav_token_deposit')}
        </TabsTrigger>
        <TabsTrigger value="token-withdraw" {...usePrefetchHandlers('token-withdraw')}>
          {t('nav_token_withdraw')}
        </TabsTrigger>
        <TabsTrigger value="eth-deposit" {...usePrefetchHandlers('eth-deposit')}>
          {t('nav_eth_deposit')}
        </TabsTrigger>
        <TabsTrigger value="eth-withdraw" {...usePrefetchHandlers('eth-withdraw')}>
          {t('nav_eth_withdraw')}
        </TabsTrigger>
        <TabsTrigger value="withdraw-progress" {...usePrefetchHandlers('withdraw-progress')}>
          {t('nav_withdraw_progress')}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

import { DownloadIcon, HomeIcon, RocketIcon, UploadIcon } from '@radix-ui/react-icons';

function SidebarNav() {
  const base =
    'block w-full text-left px-3 py-2 rounded-md border hover:bg-slate-50 dark:hover:bg-slate-900';

  return (
    <nav className="flex flex-col gap-2">
      <NavLink
        {...usePrefetchHandlers('home')}
        className={({ isActive }) => `${base} ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
        to="/"
        end
      >
        <span className="inline-flex items-center gap-2">
          <HomeIcon /> {t('nav_home')}
        </span>
      </NavLink>
      <NavLink
        {...usePrefetchHandlers('token-deposit')}
        className={({ isActive }) => `${base} ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
        to="/deposit"
      >
        <span className="inline-flex items-center gap-2">
          <UploadIcon /> {t('nav_token_deposit')}
        </span>
      </NavLink>
      <NavLink
        {...usePrefetchHandlers('token-withdraw')}
        className={({ isActive }) => `${base} ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
        to="/withdraw"
        end
      >
        <span className="inline-flex items-center gap-2">
          <DownloadIcon /> {t('nav_token_withdraw')}
        </span>
      </NavLink>
      <NavLink
        {...usePrefetchHandlers('eth-deposit')}
        className={({ isActive }) => `${base} ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
        to="/eth/deposit"
      >
        <span className="inline-flex items-center gap-2">
          <UploadIcon /> {t('nav_eth_deposit')}
        </span>
      </NavLink>
      <NavLink
        {...usePrefetchHandlers('eth-withdraw')}
        className={({ isActive }) => `${base} ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
        to="/eth/withdraw"
      >
        <span className="inline-flex items-center gap-2">
          <DownloadIcon /> {t('nav_eth_withdraw')}
        </span>
      </NavLink>
      <NavLink
        {...usePrefetchHandlers('withdraw-progress')}
        className={({ isActive }) => `${base} ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
        to="/withdraw/progress"
      >
        <span className="inline-flex items-center gap-2">
          <RocketIcon /> {t('nav_withdraw_progress')}
        </span>
      </NavLink>
    </nav>
  );
}
