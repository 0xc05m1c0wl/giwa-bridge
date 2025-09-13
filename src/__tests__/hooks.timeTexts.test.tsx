import { useTimeTexts } from '@hooks/useTimeTexts';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';

function Probe({
  startedAt,
  lastUpdated,
}: {
  startedAt: number | null;
  lastUpdated: number | null;
}) {
  const { elapsedText, lastUpdatedText } = useTimeTexts(startedAt, lastUpdated);

  return (
    <div>
      <span aria-label="elapsed">{elapsedText}</span>
      <span aria-label="updated">{lastUpdatedText}</span>
    </div>
  );
}

describe('useTimeTexts', () => {
  it('경과/업데이트 텍스트 계산', async () => {
    vi.useFakeTimers();
    const now = Date.now();

    render(<Probe startedAt={now} lastUpdated={now} />);

    expect(screen.getByLabelText('elapsed').textContent).toMatch(/\d{2}:\d{2}/);
    expect(screen.getByLabelText('updated').textContent).toMatch(/\d{2}:\d{2}:\d{2}/);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(61_000);
    });
    expect(screen.getByLabelText('elapsed').textContent).toBe('01:01');
    vi.useRealTimers();
  });
});
