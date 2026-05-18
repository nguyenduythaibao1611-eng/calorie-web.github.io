/**
 * Google Analytics Wrapper
 * Tracks user behavior, events, and conversions
 * Uses gtag.js loaded via script tag in layout.tsx
 */

import { logger } from './logging';

// Access gtag from window object (loaded via script)
const gtag = typeof window !== 'undefined' ? (window as any).gtag : null;

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

interface PageViewParams {
  path: string;
  title?: string;
  referrer?: string;
}

interface EventParams {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

interface UserProperties {
  userId?: string;
  email?: string;
  userName?: string;
  userGoal?: string; // 'lose' | 'maintain' | 'gain'
  [key: string]: any;
}

/**
 * Initialize Google Analytics
 */
export function initGA() {
  if (!GA_ID) {
    logger.warn('Google Analytics ID not configured. Analytics disabled.');
    return;
  }

  if (typeof window !== 'undefined') {
    const gtagFunc = (window as any).gtag;
    if (!gtagFunc) {
      logger.warn('Google Analytics script not loaded yet.');
      return;
    }

    // Configure gtag
    gtagFunc('config', GA_ID, {
      page_path: window.location.pathname,
      page_title: document.title,
      anonymize_ip: true,
    });

    logger.info('Google Analytics initialized', { gaId: GA_ID });
  }
}

/**
 * Track a page view
 */
export function trackPageView(params: PageViewParams) {
  if (!GA_ID || typeof window === 'undefined') return;

  try {
    const gtagFunc = (window as any).gtag;
    if (!gtagFunc) return;

    gtagFunc('event', 'page_view', {
      page_path: params.path,
      page_title: params.title || document.title,
      page_referrer: params.referrer || document.referrer,
    });

    logger.trackPageView(params.path, {
      title: params.title,
    });
  } catch (error) {
    logger.error('Failed to track page view', { error, path: params.path });
  }
}

/**
 * Track a custom event
 */
export function trackEvent(params: EventParams) {
  if (!GA_ID || typeof window === 'undefined') return;

  try {
    const gtagFunc = (window as any).gtag;
    if (!gtagFunc) return;

    gtagFunc('event', params.action, {
      event_category: params.category,
      event_label: params.label,
      value: params.value,
      ...params,
    });

    logger.trackEvent(params.action, params);
  } catch (error) {
    logger.error('Failed to track event', { error, action: params.action });
  }
}

/**
 * Track meal logging
 */
export function trackMealLogged(mealType: string, calories: number, mealsCount: number) {
  trackEvent({
    action: 'meal_logged',
    category: 'diary',
    label: mealType,
    value: calories,
    custom_map: {
      dimension1: 'meal_type',
      dimension2: 'calories',
      dimension3: 'meals_count',
    },
    meal_type: mealType,
    calories,
    meals_count: mealsCount,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmit(formName: string, formData?: Record<string, any>) {
  trackEvent({
    action: 'form_submit',
    category: 'engagement',
    label: formName,
    ...formData,
  });
}

/**
 * Track profile setup completion
 */
export function trackProfileSetup(profileData: {
  age: number;
  weight: number;
  height: number;
  goal: 'lose' | 'maintain' | 'gain';
  activityLevel: string;
}) {
  trackEvent({
    action: 'profile_setup_complete',
    category: 'onboarding',
    label: profileData.goal,
    custom_map: {
      dimension1: 'age',
      dimension2: 'weight',
      dimension3: 'goal',
    },
    age: profileData.age,
    weight: profileData.weight,
    height: profileData.height,
    goal: profileData.goal,
    activity_level: profileData.activityLevel,
  });
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(featureName: string, metadata?: Record<string, any>) {
  trackEvent({
    action: 'feature_used',
    category: 'engagement',
    label: featureName,
    ...metadata,
  });
}

/**
 * Track page interaction (clicks, scrolls, etc)
 */
export function trackInteraction(
  interactionType: 'click' | 'scroll' | 'input' | 'toggle',
  elementName: string
) {
  trackEvent({
    action: 'user_interaction',
    category: 'engagement',
    label: `${interactionType}_${elementName}`,
  });
}

/**
 * Track stats/analytics view
 */
export function trackStatsView(statsType: 'daily' | 'weekly' | 'monthly') {
  trackEvent({
    action: 'stats_viewed',
    category: 'analytics',
    label: statsType,
  });
}

/**
 * Track settings change
 */
export function trackSettingsChange(settingName: string, oldValue: any, newValue: any) {
  trackEvent({
    action: 'settings_changed',
    category: 'settings',
    label: settingName,
    custom_map: {
      dimension1: 'setting_name',
      dimension2: 'old_value',
      dimension3: 'new_value',
    },
    setting_name: settingName,
    old_value: String(oldValue),
    new_value: String(newValue),
  });
}

/**
 * Track error event
 */
export function trackError(errorType: string, message: string, severity: 'low' | 'medium' | 'high') {
  trackEvent({
    action: 'error_occurred',
    category: 'error',
    label: errorType,
    error_message: message,
    error_severity: severity,
  });
}

/**
 * Set user properties
 */
export function setUserProperties(properties: UserProperties) {
  if (!GA_ID || typeof window === 'undefined') return;

  try {
    const gtagFunc = (window as any).gtag;
    if (!gtagFunc) return;

    gtagFunc('set', {
      user_id: properties.userId,
      user_properties: {
        email: properties.email,
        user_name: properties.userName,
        user_goal: properties.userGoal,
        ...properties,
      },
    });

    logger.info('User properties set', { userId: properties.userId });
  } catch (error) {
    logger.error('Failed to set user properties', { error });
  }
}

/**
 * Track time on page
 */
export function trackTimeOnPage(pagePath: string, timeInSeconds: number) {
  if (timeInSeconds >= 10) {
    // Only track if spent more than 10 seconds
    trackEvent({
      action: 'page_time',
      category: 'engagement',
      label: pagePath,
      value: Math.round(timeInSeconds),
    });
  }
}

/**
 * Track conversion
 */
export function trackConversion(conversionType: string, conversionValue?: number) {
  trackEvent({
    action: 'conversion',
    category: 'conversion',
    label: conversionType,
    value: conversionValue,
  });
}

/**
 * Get analytics ID
 */
export function getAnalyticsId(): string | undefined {
  return GA_ID;
}
