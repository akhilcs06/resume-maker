import { useRef, useCallback } from 'react';

export default function useDebouncedCallback<P extends unknown[]>(
  callback: (...args: P) => void,
  delay: number
): (...args: P) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: P) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}
