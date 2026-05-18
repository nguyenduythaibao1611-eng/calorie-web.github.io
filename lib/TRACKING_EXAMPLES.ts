/**
 * TRACKING INTEGRATION EXAMPLES
 * 
 * This file shows patterns for integrating tracking and logging in your components.
 * These are code examples - copy the patterns into your actual component files.
 */

import type {
  trackProfileSetup,
  trackSettingsChange,
  trackMealLogged,
  trackEvent,
  trackStatsView,
  setUserProperties,
} from '@/lib/analytics';

import type {
  useFormTracking,
  usePageTime,
  useFeatureTracking,
  useButtonTracking,
  useApiTracking,
  useUserTracking,
} from '@/lib/tracking-hooks';

import type {
  captureException,
  addBreadcrumb,
  captureApiError,
  setUserContext,
  clearUserContext,
} from '@/lib/sentry.config';

import type { logger } from '@/lib/logging';

/**
export function ErrorHandlingExample() {
  const handleSaveProfile = async (profileData: any) => {
    try {
      addBreadcrumb('User clicked save profile button', 'user-action', 'info');

      const response = await fetch('/api/profile', {
        method: 'POST',
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        captureApiError('POST', '/api/profile', response.status, response);
        throw new Error(`API error: ${response.status}`);
      }

      addBreadcrumb('Profile saved successfully', 'api', 'info');
    } catch (error) {
      addBreadcrumb('Error occurred during profile save', 'error', 'error');

      captureException(error as Error, {
        userId: 'user-123',
        formData: profileData,
        timestamp: new Date().toISOString(),
      });

      logger.error('Failed to save profile', {
        error: (error as Error).message,
        data: profileData,
      });
    }
  };
}
*/

// ════════════════════════════════════════════════════════════════════════════
// EXAMPLE 7: Custom Logger Usage
// ════════════════════════════════════════════════════════════════════════════

// import { logger } from '@/lib/logging';
//
// export function LoggerExample() {
//   const handleComplexOperation = () => {
//     try {
//       logger.debug('Starting complex operation');
//       logger.info('Step 1 completed', { step: 1 });
//       logger.info('Step 2 completed', { step: 2 });
//       logger.info('Operation completed');
//
//       const logs = logger.getBufferedLogs();
//       console.log('Buffered logs:', logs);
//     } catch (error) {
//       logger.error('Operation failed', { error });
//       logger.clearBuffer();
//     }
//   };
// }

// ════════════════════════════════════════════════════════════════════════════
// EXAMPLE 8: User Tracking
// ════════════════════════════════════════════════════════════════════════════

// import { setUserContext, clearUserContext } from '@/lib/sentry.config';
// import { setUserProperties } from '@/lib/analytics';
// import { useUserTracking } from '@/lib/tracking-hooks';
// import { logger } from '@/lib/logging';
//
// export function UserTrackingExample() {
//   useUserTracking('user-123', 'user@example.com', 'John Doe');
//
//   const handleLogin = (userId: string, email: string, name: string) => {
//     setUserContext(userId, email, name);
//     setUserProperties({
//       userId,
//       email,
//       userName: name,
//       userGoal: 'lose',
//     });
//     logger.info('User logged in', { userId });
//   };
//
//   const handleLogout = () => {
//     clearUserContext();
//     logger.info('User logged out');
//   };
// }

// ════════════════════════════════════════════════════════════════════════════
// INTEGRATION CHECKLIST
// ════════════════════════════════════════════════════════════════════════════

/**
 * When integrating tracking into a component:
 *
 * 1. ✓ Import needed functions from @/lib/analytics and @/lib/logging
 * 2. ✓ Use hooks (usePageTime, useFeatureTracking, etc.) in component
 * 3. ✓ Track key user actions (form submits, button clicks, etc.)
 * 4. ✓ Log errors with context for debugging
 * 5. ✓ Use breadcrumbs before critical operations
 * 6. ✓ Set user context when available
 * 7. ✓ Test tracking works in browser console (check window.dataLayer)
 * 8. ✓ Verify errors appear in Sentry dashboard
 * 9. ✓ Use logger.exportLogs() to debug locally
 * 10. ✓ Review buffered logs for missing events
 *
 * For detailed examples and API, see TRACKING_API_REFERENCE.md
 */

export {};
