import './styles.css';

import { initAnalytics } from '@lib/analytics';
import { App } from '@ui/App';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { AppProviders } from '@/providers/AppProviders';

initAnalytics();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppProviders>
    <App />
  </AppProviders>,
);
