import { toaster } from '@lib/toaster';
import { render } from '@testing-library/react';
import { ToastViewport } from '@ui/ToastViewport';
import { describe, expect, it, vi } from 'vitest';

describe('ToastViewport', () => {
  it('should call setup subscription (smoke)', () => {
    const sub = vi.spyOn(toaster, 'subscribe');

    render(<ToastViewport />);
    expect(sub).toHaveBeenCalled();
  });
});
