import { Button } from '@components/ui/button';
import { t } from '@lib/i18n';
import { toaster } from '@lib/toaster';
import React from 'react';

type Props = { children: React.ReactNode; fallback?: React.ReactNode };
type State = { hasError: boolean; error?: unknown };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('ErrorBoundary caught:', error, info);
    try {
      const err = error as { message?: unknown };
      const msg = typeof err?.message === 'string' ? err.message : String(error);

      toaster.error(msg);
    } catch {}
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{t('error_generic_title')}</h3>
            <Button
              onClick={() => {
                try {
                  window.location.reload();
                } catch {
                  this.setState({ hasError: false, error: undefined });
                }
              }}
            >
              {t('btn_retry')}
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
