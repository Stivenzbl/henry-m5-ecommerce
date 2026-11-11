import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../hooks/useDebounce';

describe('useDebounce Custom Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('auriculares', 300));
    expect(result.current).toBe('auriculares');
  });

  it('should debounce value changes until the delay passes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'smart', delay: 300 } }
    );

    expect(result.current).toBe('smart');

    // Update the input value
    rerender({ value: 'smartwatch', delay: 300 });

    // Should still have previous value before delay
    expect(result.current).toBe('smart');

    // Fast-forward by 200ms (not yet 300ms)
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('smart');

    // Fast-forward the remaining 100ms
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('smartwatch');
  });

  it('should cancel previous timer if value changes rapidly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 400 } }
    );

    rerender({ value: 'ab', delay: 400 });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: 'abc', delay: 400 });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    // Total 400ms passed, but 'abc' was set only 200ms ago
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(200);
    });
    // Now 400ms passed for 'abc'
    expect(result.current).toBe('abc');
  });
});
