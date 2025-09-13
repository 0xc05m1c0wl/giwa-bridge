import { toaster } from '@lib/toaster';
import { render } from '@testing-library/react';
import { ToastViewport } from '@ui/ToastViewport';
import { describe, expect, it, vi } from 'vitest';

describe('ToastViewport', () => {
  it('구독(setup) 호출 스모크 테스트', () => {
    const sub = vi.spyOn(toaster, 'subscribe');

    render(<ToastViewport />);
    expect(sub).toHaveBeenCalled();
  });
});
