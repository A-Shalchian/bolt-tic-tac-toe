"use client";

import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

export const useDebouncedCallback = <T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

export const useThrottledCallback = <T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): T => {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callback(...args);
        }, delay - (now - lastCallRef.current));
      }
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
};

export const useRenderPerformance = (componentName: string) => {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef<number>(0);
  const totalRenderTimeRef = useRef<number>(0);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const renderStart = performance.now();
      renderCountRef.current += 1;

      return () => {
        const renderEnd = performance.now();
        const renderTime = renderEnd - renderStart;
        totalRenderTimeRef.current += renderTime;
        lastRenderTimeRef.current = renderTime;

        // Log performance warnings for slow renders
        if (renderTime > 16) { // More than one frame at 60fps
          console.warn(
            `⚠️ Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms (render #${renderCountRef.current})`
          );
        }

        // Log performance summary every 10 renders
        if (renderCountRef.current % 10 === 0) {
          const avgRenderTime = totalRenderTimeRef.current / renderCountRef.current;
          console.log(
            `📊 ${componentName} performance summary:`,
            `\n  Total renders: ${renderCountRef.current}`,
            `\n  Average render time: ${avgRenderTime.toFixed(2)}ms`,
            `\n  Last render time: ${renderTime.toFixed(2)}ms`
          );
        }
      };
    }
  }, [componentName]);

  return {
    renderCount: renderCountRef.current,
    lastRenderTime: lastRenderTimeRef.current,
    averageRenderTime: renderCountRef.current > 0 
      ? totalRenderTimeRef.current / renderCountRef.current 
      : 0
  };
};

export const useStableMemo = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
};

export const useStableCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: React.DependencyList
): T => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, deps);
};

export const useLazyComponent = <T extends React.ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>
) => {
  const [component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    importFn()
      .then((module) => {
        if (mounted) {
          setComponent(() => module.default);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [importFn]);

  return {
    Component: component,
    loading,
    error
  };
};
