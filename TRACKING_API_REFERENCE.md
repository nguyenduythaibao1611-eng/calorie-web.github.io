# 📚 Tracking & Monitoring API Reference

Quick reference for all available tracking and logging functions.

---

## 🎯 Google Analytics (`lib/analytics.ts`)

### Core Functions

```typescript
import {
  initGA,           // Initialize Google Analytics
  trackPageView,    // Track page views
  trackEvent,       // Track custom events
} from '@/lib/analytics';

// Initialize GA (called automatically in AnalyticsProvider)
initGA();

// Track page view
trackPageView({
  path: '/diary',
  title: 'Diary Page',
  referrer: document.referrer,
});

// Track custom event
trackEvent({
  action: 'button_click',
  category: 'engagement',
  label: 'save_button',
  value: 100, // Optional numeric value
});
```

### Specialized Tracking Functions

```typescript
import {
  trackMealLogged,      // Track meal entries
  trackFormSubmit,      // Track form submissions
  trackProfileSetup,    // Track profile setup
  trackFeatureUsage,    // Track feature usage
  trackInteraction,     // Track user interactions
  trackStatsView,       // Track stats page views
  trackSettingsChange,  // Track settings changes
  trackError,          // Track errors
  setUserProperties,   // Set user properties
  trackTimeOnPage,     // Track time spent
  trackConversion,     // Track conversions
} from '@/lib/analytics';

// Track meal
trackMealLogged('breakfast', 450, 3); // mealType, calories, mealsCount

// Track form submit
trackFormSubmit('profile_form', { age: 25, weight: 70 });

// Track profile setup
trackProfileSetup({
  age: 25,
  weight: 70,
  height: 175,
  goal: 'lose',
  activityLevel: 'moderate',
});

// Track feature usage
trackFeatureUsage('meal_search', { query: 'rice' });

// Track interaction
trackInteraction('click', 'add_meal_button');

// Track stats view
trackStatsView('weekly'); // 'daily' | 'weekly' | 'monthly'

// Track settings change
trackSettingsChange('goal', 'maintain', 'lose');

// Track error
trackError('calculation_error', 'TDEE calculation failed', 'high');

// Set user properties
setUserProperties({
  userId: 'user-123',
  email: 'user@example.com',
  userName: 'John Doe',
  userGoal: 'lose',
});

// Track time on page
trackTimeOnPage('/diary', 120); // seconds

// Track conversion
trackConversion('profile_completion', 1);
```

### Utility Functions

```typescript
import { getAnalyticsId } from '@/lib/analytics';

// Get GA ID
const gaId = getAnalyticsId(); // Returns 'G-XXXXXXXXXX' or undefined
```

---

## 🛡️ Sentry Error Monitoring (`lib/sentry.config.ts`)

### Error Capture

```typescript
import {
  captureException,    // Capture errors
  captureMessage,      // Capture messages
  captureApiError,     // Capture API errors
} from '@/lib/sentry.config';

// Capture exception
try {
  // risky code
} catch (error) {
  captureException(error as Error, {
    userId: 'user-123',
    context: 'meal_save',
  });
}

// Capture message
captureMessage('User reached daily calorie goal', 'info');

// Capture API error
captureApiError('POST', '/api/meals', 500, error, 1500); // method, url, status, error, duration
```

### User & Context Management

```typescript
import {
  setUserContext,      // Set user for error reports
  clearUserContext,    // Clear user context
  addBreadcrumb,      // Add breadcrumb for context
} from '@/lib/sentry.config';

// Set user context
setUserContext('user-123', 'user@example.com', 'John Doe');

// Clear user context (on logout)
clearUserContext();

// Add breadcrumb
addBreadcrumb(
  'User clicked save button',
  'user-action', // category
  'info',        // level: 'info' | 'warning' | 'error'
  { buttonId: 'save-btn' }, // optional data
);
```

---

## 📝 Logging (`lib/logging.ts`)

### Logger Instance

```typescript
import { logger } from '@/lib/logging';

// Log levels
logger.debug('Debug message', { data: 'value' });
logger.info('Info message', { data: 'value' });
logger.warn('Warning message', { data: 'value' });
logger.error('Error message', { data: 'value' });

// Specialized tracking
logger.trackEvent('meal_added', { mealType: 'breakfast', calories: 300 });
logger.trackPageView('/diary', { metadata: 'value' });
logger.trackApiCall('GET', '/api/meals', 200, 150); // method, url, status, duration

// Buffer management
const logs = logger.getBufferedLogs(); // Get last 100 logs
const json = logger.exportLogs();      // Export as JSON string
logger.clearBuffer();                   // Clear buffer
```

---

## 🎣 Tracking Hooks (`lib/tracking-hooks.ts`)

### Available Hooks

```typescript
import {
  usePageTime,         // Track time on page
  useFeatureTracking,  // Track feature usage
  useFormTracking,     // Track form interactions
  useButtonTracking,   // Track button clicks
  useUserTracking,     // Track user identification
  useApiTracking,      // Track API calls
  useErrorTracking,    // Track component errors
} from '@/lib/tracking-hooks';

// Track page time (automatically on unmount)
usePageTime('/diary');

// Track feature usage
useFeatureTracking('meal_logging', { version: '1.0' });

// Track form interactions
const { trackFieldChange, trackFieldBlur, trackFormSubmit } = useFormTracking('profile_form');
trackFieldChange('age', 25);
trackFieldBlur('age');
trackFormSubmit({ age: 25, weight: 70 });

// Track button clicks (returns tracking function)
const trackDeleteClick = useButtonTracking('delete_meal_button');
// Use in onClick: onClick={trackDeleteClick}

// Track user
useUserTracking('user-123', 'user@example.com', 'John Doe');

// Track API calls
const { trackCall } = useApiTracking('meal_api');
trackCall('GET', '/api/meals', 200, 150); // method, url, status, duration
trackCall('POST', '/api/meals', 201, 120, null); // null = no error
trackCall('POST', '/api/meals', 500, 200, 'Server error'); // with error

// Track component errors
const trackError = useErrorTracking('MealForm');
trackError(new Error('Validation failed'), { field: 'calories' });
```

---

## 🏪 Analytics Provider (`components/providers/AnalyticsProvider.tsx`)

```typescript
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider';

// Used in layout.tsx - automatically tracks:
// - Page views on route changes
// - Initializes GA on mount
// Add to any layout:
<body>
  <AnalyticsProvider />
  {children}
</body>
```

---

## 🔧 Configuration

### Environment Variables

```bash
# .env.local

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@oxxxxxx.ingest.sentry.io/xxxxx
SENTRY_ORG=org-name
SENTRY_PROJECT=project-name
SENTRY_AUTH_TOKEN=token  # Optional, for source maps

# Version tracking
NEXT_PUBLIC_APP_VERSION=0.1.0
```

---

## 📊 Event Data Structure

### Page View Event
```typescript
{
  page_path: string;      // Current page path
  page_title: string;     // Page title
  page_referrer: string;  // Referrer URL
}
```

### Custom Event
```typescript
{
  action: string;         // Event action name
  category: string;       // Event category
  label?: string;         // Event label
  value?: number;         // Numeric value
  [key: string]: any;     // Additional properties
}
```

### API Call
```typescript
{
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  status: number;         // HTTP status code
  duration: number;       // Duration in ms
  error?: string;         // Error message if any
}
```

---

## 🎯 Common Usage Patterns

### Pattern 1: Track Page + Feature
```typescript
export function DiaryPage() {
  usePageTime('/diary');
  useFeatureTracking('diary_view');

  return <div>Diary Content</div>;
}
```

### Pattern 2: Track Form with Validation
```typescript
export function FormComponent() {
  const { trackFieldChange, trackFormSubmit } = useFormTracking('my_form');

  const handleSubmit = (data) => {
    try {
      trackFormSubmit(data);
      // save data
    } catch (error) {
      logger.error('Form submit failed', { error });
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Pattern 3: Track with Error Handling
```typescript
export function SaveButton() {
  const trackClick = useButtonTracking('save_button');
  const { trackCall } = useApiTracking('save_api');

  const handleSave = async () => {
    trackClick();
    const start = Date.now();

    try {
      const res = await fetch('/api/save', { method: 'POST' });
      const duration = Date.now() - start;

      if (!res.ok) {
        trackCall('POST', '/api/save', res.status, duration, 'HTTP error');
        return;
      }

      trackCall('POST', '/api/save', res.status, duration);
    } catch (error) {
      trackCall('POST', '/api/save', 0, Date.now() - start, (error as Error).message);
      logger.error('Save failed', { error });
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### Pattern 4: Set User Context
```typescript
import { setUserContext } from '@/lib/sentry.config';
import { setUserProperties } from '@/lib/analytics';

export function LoginHandler() {
  const handleLogin = (user) => {
    // Set in Sentry
    setUserContext(user.id, user.email, user.name);

    // Set in GA
    setUserProperties({
      userId: user.id,
      email: user.email,
      userName: user.name,
    });

    logger.info('User logged in', { userId: user.id });
  };
}
```

---

## 🚨 Error Handling with Context

```typescript
import { captureException, addBreadcrumb } from '@/lib/sentry.config';

async function saveProfile(data) {
  try {
    addBreadcrumb('Starting profile save', 'user-action');

    const res = await fetch('/api/profile', { method: 'POST', body: JSON.stringify(data) });

    addBreadcrumb('API response received', 'http', 'info', { status: res.status });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    addBreadcrumb('Profile saved successfully', 'user-action', 'info');
    logger.info('Profile saved', { userId: data.userId });
  } catch (error) {
    addBreadcrumb('Error occurred', 'error', 'error');
    captureException(error as Error, {
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
    logger.error('Profile save failed', { error });
  }
}
```

---

## 📚 Type Definitions

```typescript
// Log level
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Log entry structure
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  page?: string;
  userAgent?: string;
}

// Page view params
interface PageViewParams {
  path: string;
  title?: string;
  referrer?: string;
}

// Event params
interface EventParams {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

// User properties
interface UserProperties {
  userId?: string;
  email?: string;
  userName?: string;
  userGoal?: string;
  [key: string]: any;
}
```

---

## ⚠️ Important Notes

1. **GA ID Required**: Without `NEXT_PUBLIC_GA_ID`, all GA tracking is silently disabled
2. **Sentry Optional**: Without `NEXT_PUBLIC_SENTRY_DSN`, error tracking is disabled
3. **Client-Only**: All tracking functions work only on client side
4. **No Sensitive Data**: Never log passwords, tokens, or PII
5. **Log Buffering**: Logger keeps only last 100 entries
6. **SSR Safe**: All functions check for `typeof window`

---

**Last Updated:** 19/05/2026  
**API Version:** 1.0.0
