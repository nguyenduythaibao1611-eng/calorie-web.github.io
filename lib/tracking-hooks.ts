/**
 * Tracking Hooks - Helper functions for tracking user interactions
 */

import { useEffect, useRef } from 'react';
import { trackEvent, trackTimeOnPage, setUserProperties } from '@/lib/analytics';
import { logger } from '@/lib/logging';

/**
 * Hook to track page time spent
 */
export function usePageTime(pageName: string) {
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    return () => {
      const timeSpent = (Date.now() - startTimeRef.current) / 1000;
      trackTimeOnPage(pageName, timeSpent);
      logger.trackEvent('page_time_spent', {
        page: pageName,
        seconds: Math.round(timeSpent),
      });
    };
  }, [pageName]);
}

/**
 * Hook to track feature usage
 */
export function useFeatureTracking(featureName: string, metadata?: Record<string, any>) {
  useEffect(() => {
    trackEvent({
      action: 'feature_used',
      category: 'engagement',
      label: featureName,
      ...metadata,
    });
    logger.trackEvent(`feature_${featureName}`, metadata);
  }, [featureName, metadata]);
}

/**
 * Hook to track form interactions
 */
export function useFormTracking(formName: string) {
  const trackFieldChange = (fieldName: string, value: any) => {
    trackEvent({
      action: 'form_field_changed',
      category: 'engagement',
      label: `${formName}_${fieldName}`,
      value_type: typeof value,
    });
  };

  const trackFieldBlur = (fieldName: string) => {
    trackEvent({
      action: 'form_field_blur',
      category: 'engagement',
      label: `${formName}_${fieldName}`,
    });
  };

  const trackFormSubmit = (data?: Record<string, any>) => {
    trackEvent({
      action: 'form_submit',
      category: 'engagement',
      label: formName,
      fields_count: data ? Object.keys(data).length : 0,
    });
    logger.trackEvent(`${formName}_submitted`, data);
  };

  return {
    trackFieldChange,
    trackFieldBlur,
    trackFormSubmit,
  };
}

/**
 * Hook to track button clicks
 */
export function useButtonTracking(buttonName: string) {
  return () => {
    trackEvent({
      action: 'button_click',
      category: 'engagement',
      label: buttonName,
    });
    logger.trackEvent(`button_${buttonName}`, { interaction_type: 'click' });
  };
}

/**
 * Hook to track user profile
 */
export function useUserTracking(userId?: string, userEmail?: string, userName?: string) {
  useEffect(() => {
    if (userId) {
      setUserProperties({
        userId,
        email: userEmail,
        userName,
      });
      logger.info('User tracking initialized', { userId });
    }
  }, [userId, userEmail, userName]);
}

/**
 * Hook to track API calls
 */
export function useApiTracking(apiName: string) {
  const trackCall = (method: string, url: string, status: number, duration: number, error?: string) => {
    logger.trackApiCall(method, url, status, duration, error);

    trackEvent({
      action: 'api_call',
      category: 'api',
      label: apiName,
      status_code: status,
      duration_ms: duration,
      has_error: !!error,
    });
  };

  return { trackCall };
}

/**
 * Hook to track errors
 */
export function useErrorTracking(componentName: string) {
  return (error: Error, context?: Record<string, any>) => {
    logger.error(`Error in ${componentName}`, { ...context, error: error.message });

    trackEvent({
      action: 'error_occurred',
      category: 'error',
      label: componentName,
      error_message: error.message,
      ...context,
    });
  };
}
