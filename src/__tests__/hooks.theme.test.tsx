import { useTheme } from '@hooks/useTheme';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

function ThemeProbe() {
  const [dark, toggle] = useTheme();

  return (
    <button onClick={toggle} aria-label="toggle">
      {dark ? 'dark' : 'light'}
    </button>
  );
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('토글 시 DOM 클래스/저장소 동기화', async () => {
    render(<ThemeProbe />);
    const btn = screen.getByRole('button', { name: 'toggle' });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    await userEvent.click(btn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
