/**
 * Sentry Configuration for Error Tracking & Monitoring
 * Sentry captures and reports errors from both client and server
 */

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

/**
 * Initialize Sentry for error tracking
 */
export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
    
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Release tracking
    release: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
    
    // Before sending event to Sentry
    beforeSend(event, hint) {
      // Filter out 404 errors in development
      if (
        process.env.NODE_ENV === 'development' &&
        (event as any).status === 404
      ) {
        return null;
      }
      return event;
    },

    // Ignored errors
    ignoreErrors: [
      // Browser extensions
      'chrome-extension://',
      'moz-extension://',
      // Random plugin/extension errors
      'top.GLOBALS',
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
    ],

    // Client options
    ...(typeof window !== 'undefined' && {
      // Set user context if available
      initialScope: {
        tags: {
          component: 'react',
          framework: 'next.js',
        },
      },
    }),
  });
}

/**
 * Capture an exception
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (!SENTRY_DSN) return;

  Sentry.captureException(error, {
    contexts: context ? { custom: context } : undefined,
  });
}

/**
 * Capture a message
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  if (!SENTRY_DSN) return;

  Sentry.captureMessage(message, level);
}

/**
 * Set user context
 */
export function setUserContext(userId: string, userEmail?: string, userName?: string) {
  if (!SENTRY_DSN) return;

  Sentry.setUser({
    id: userId,
    email: userEmail,
    username: userName,
  });
}

/**
 * Clear user context
 */
export function clearUserContext() {
  if (!SENTRY_DSN) return;

  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string = 'user-action',
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, any>
) {
  if (!SENTRY_DSN) return;

  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Capture API error with context
 */
export function captureApiError(
  method: string,
  url: string,
  status: number,
  error: any,
  duration?: number
) {
  if (!SENTRY_DSN) return;

  const context = {
    method,
    url,
    status,
    duration: duration ? `${duration}ms` : undefined,
    error: error?.message || String(error),
  };

  Sentry.captureException(new Error(`API Error: ${method} ${url}`), {
    contexts: { api: context },
    level: status >= 500 ? 'error' : 'warning',
  });
}

export { Sentry };
