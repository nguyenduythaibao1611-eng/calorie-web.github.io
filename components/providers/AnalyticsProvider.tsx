'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, initGA } from '@/lib/analytics';
import { logger } from '@/lib/logging';

/**
 * Analytics Provider Component
 * Tracks page views and initializes Google Analytics
 */
export function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize GA on mount
    initGA();
  }, []);

  useEffect(() => {
    // Track page view on route change
    trackPageView({
      path: pathname,
      title: document.title,
    });

    logger.info('Route changed', { path: pathname });
  }, [pathname]);

  return null;
}
