# 📊 Tracking & Monitoring Setup Guide

## Overview

This project integrates three key tracking and monitoring tools:

1. **Google Analytics** - Track user behavior and engagement
2. **Sentry** - Error tracking and performance monitoring
3. **Custom Logger** - Centralized logging for debugging

---

## 🔧 Setup Instructions

### 1. Google Analytics Setup

#### Step 1: Create Google Analytics Property

1. Go to [Google Analytics](https://analytics.google.com)
2. Sign in with your Google account
3. Click **Admin** → **Create Property**
4. Fill in property details (name, timezone, currency)
5. Accept the terms and create property

#### Step 2: Create Web Data Stream

1. In the newly created property, go to **Data Streams**
2. Click **Create web stream**
3. Enter your website URL (e.g., `https://calomate.com`)
4. Accept terms and create stream

#### Step 3: Copy Measurement ID

1. After creating the stream, you'll see your **Measurement ID** (G-XXXXXXXXXX)
2. Copy this ID

#### Step 4: Configure Environment Variable

```bash
# .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

### 2. Sentry Setup

#### Step 1: Create Sentry Account & Project

1. Go to [Sentry.io](https://sentry.io)
2. Sign up for free account
3. Create new organization (or use existing)
4. Create new project:
   - Select **Next.js** as platform
   - Follow the setup wizard

#### Step 2: Get Your DSN

1. In project settings, find **Client Keys (DSN)**
2. Copy the DSN URL (format: `https://xxxxx@oxxxxxx.ingest.sentry.io/xxxxx`)

#### Step 3: Configure Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@oxxxxxx.ingest.sentry.io/xxxxx
SENTRY_ORG=your-org-name
SENTRY_PROJECT=your-project-name
SENTRY_AUTH_TOKEN=your-auth-token  # Optional, for source maps
```

#### Step 4: Generate Auth Token (Optional but Recommended)

For automatic source map uploads in CI/CD:

1. Go to Sentry Settings → **Auth Tokens**
2. Click **Generate New Token**
3. Select scopes: `project:releases`, `org:read`
4. Copy and add to environment variables

---

## 📝 Usage Examples

### Track Page Views

```typescript
import { trackPageView } from '@/lib/analytics';

useEffect(() => {
  trackPageView({
    path: '/diary',
    title: 'Diary - CaloMate',
  });
}, []);
```

### Track Custom Events

```typescript
import { trackEvent, trackMealLogged } from '@/lib/analytics';

// Track meal logged
trackMealLogged('breakfast', 450, 1);

// Track custom event
trackEvent({
  action: 'form_submit',
  category: 'engagement',
  label: 'profile_setup',
});
```

### Track Profile Setup

```typescript
import { trackProfileSetup } from '@/lib/analytics';

trackProfileSetup({
  age: 25,
  weight: 70,
  height: 175,
  goal: 'lose',
  activityLevel: 'moderate',
});
```

### Use Logger

```typescript
import { logger } from '@/lib/logging';

// Basic logging
logger.info('User logged in', { userId: '123' });
logger.warn('API rate limit approaching', { remaining: 5 });
logger.error('Database connection failed', { error });

// Track events
logger.trackEvent('meal_added', { mealType: 'breakfast', calories: 300 });
logger.trackApiCall('GET', '/api/meals', 200, 150);
```

### Error Tracking with Sentry

```typescript
import { captureException, addBreadcrumb } from '@/lib/sentry.config';

try {
  // Some operation
} catch (error) {
  // Add context
  addBreadcrumb('User attempted profile update', 'user-action', 'info');
  
  // Capture error
  captureException(error as Error, {
    userId: user.id,
    formData: sanitizedFormData,
  });
}
```

---

## 📊 What Gets Tracked

### Google Analytics Events

| Event | Category | Triggered When |
|-------|----------|---|
| `page_view` | navigation | Route change, page load |
| `meal_logged` | diary | User adds meal/ingredient |
| `form_submit` | engagement | User submits any form |
| `profile_setup_complete` | onboarding | New user completes profile |
| `feature_used` | engagement | User uses specific feature |
| `user_interaction` | engagement | Click, scroll, input, toggle |
| `stats_viewed` | analytics | User views stats/analytics |
| `settings_changed` | settings | User modifies settings |
| `error_occurred` | error | Application error |

### Sentry Captures

- **Unhandled Errors** - Automatically captured
- **Performance Issues** - Slow transactions
- **API Errors** - Failed requests (500+)
- **JavaScript Errors** - Runtime exceptions
- **Console Errors** - High-severity logs
- **Breadcrumbs** - User actions leading to errors

### Logger Captures

- All console-level logs (debug, info, warn, error)
- Event tracking
- API call metrics
- Custom context data
- Buffered for debugging

---

## 🔍 Monitoring Dashboard

### Google Analytics Dashboard

1. **Users** → See active users, session duration, bounce rate
2. **Engagement** → Track events, conversions, user flow
3. **Retention** → Monitor day-to-day active users
4. **Reports** → Create custom reports

### Sentry Dashboard

1. **Issues** → View all errors and their frequency
2. **Performance** → Monitor transaction performance
3. **Releases** → Track errors per app version
4. **Alerts** → Set up notifications for critical errors

---

## 🚀 Best Practices

### 1. Sampling

For high-traffic applications, use sampling to reduce costs:

```typescript
// In sentry.config.ts
tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
```

### 2. User Context

Always set user context when available:

```typescript
import { setUserContext } from '@/lib/sentry.config';

setUserContext(userId, userEmail, userName);
```

### 3. Sanitize Sensitive Data

Never log passwords, tokens, or PII:

```typescript
logger.info('Login attempt', {
  email: user.email.substring(0, 3) + '***',
  // Don't log password!
});
```

### 4. Use Breadcrumbs for Context

Add breadcrumbs before errors to provide context:

```typescript
import { addBreadcrumb, captureException } from '@/lib/sentry.config';

addBreadcrumb('User clicked save button', 'user-action');
addBreadcrumb('API request started', 'http');
try {
  // Code that might fail
} catch (error) {
  captureException(error); // Will include above breadcrumbs
}
```

### 5. Custom Event Categorization

Use consistent naming for events:

```typescript
// ✅ Good
trackEvent({
  action: 'meal_logged',
  category: 'diary',
  label: 'breakfast',
});

// ❌ Avoid
trackEvent({
  action: 'something_happened',
  category: 'misc',
});
```

---

## 📈 Debugging

### View Buffered Logs

```typescript
import { logger } from '@/lib/logging';

// Get last 100 logs
const logs = logger.getBufferedLogs();
console.log(logger.exportLogs());

// Clear buffer
logger.clearBuffer();
```

### Test Sentry Locally

```typescript
import { captureException } from '@/lib/sentry.config';

// Simulate error
captureException(new Error('Test error'));
```

### Check GA Tag Manager

Open browser DevTools console:

```javascript
// Check if GA is loaded
console.log(window.gtag);

// View data layer
console.log(window.dataLayer);
```

---

## 🔐 Privacy Considerations

### GDPR Compliance

- `anonymize_ip: true` in GA config - Anonymizes user IP
- No sensitive data should be tracked
- Provide opt-out mechanism for GA

### Cookie Consent

Consider implementing cookie consent before GA initialization:

```typescript
if (window.cookieConsent === 'accepted') {
  initGA();
}
```

---

## 🐛 Troubleshooting

### GA not tracking

1. Check if `NEXT_PUBLIC_GA_ID` is set in `.env.local`
2. Verify GA script is loaded (DevTools → Network)
3. Check if GA is blocked by ad blocker
4. Ensure AnalyticsProvider is in layout

### Sentry not capturing errors

1. Verify `NEXT_PUBLIC_SENTRY_DSN` is set
2. Check if Sentry is blocked by browser
3. Test with `captureException()` manually
4. Check Sentry project is active

### Logger not showing logs

1. Ensure `NODE_ENV !== 'production'`
2. Check browser console filter level
3. Verify logger.ts is imported correctly

---

## 📚 Resources

- [Google Analytics Documentation](https://support.google.com/analytics)
- [Sentry Documentation](https://docs.sentry.io)
- [Next.js Script Component](https://nextjs.org/docs/app/api-reference/components/script)
- [gtag.js Documentation](https://developers.google.com/analytics/devguides/collection/gtagjs)

---

## 🔄 Integration Checklist

- [ ] Created Google Analytics property
- [ ] Created Sentry project
- [ ] Added environment variables to `.env.local`
- [ ] Verified GA script loads in browser
- [ ] Verified Sentry initializes (check console)
- [ ] Tested event tracking
- [ ] Tested error capture
- [ ] Set up Sentry alerts
- [ ] Created GA custom dashboard
- [ ] Documented tracking requirements
- [ ] Reviewed privacy implications
- [ ] Set up team access permissions

---

**Last Updated:** 19/05/2026
