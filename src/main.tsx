import './styles.css';

import { App } from '@ui/App';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { AppProviders } from '@/providers/AppProviders';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppProviders>
    <App />
  </AppProviders>,
);
