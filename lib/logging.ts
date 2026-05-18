/**
 * Centralized Logging Utility
 * Captures logs for debugging and monitoring
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  page?: string;
  userAgent?: string;
}

/**
 * Logger class for centralized logging
 */
class Logger {
  private isDevelopment = typeof window !== 'undefined' ? process.env.NODE_ENV === 'development' : false;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 100;

  /**
   * Log a message with context
   */
  log(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      page: typeof window !== 'undefined' ? window.location.pathname : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    // Console output
    this.consoleLog(level, message, context);

    // Buffer for later upload
    this.addToBuffer(entry);

    // Send to monitoring service if error
    if (level === 'error' && typeof window !== 'undefined') {
      this.sendToMonitoring(entry);
    }
  }

  /**
   * Debug level log
   */
  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  }

  /**
   * Info level log
   */
  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  /**
   * Warning level log
   */
  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  /**
   * Error level log (highest priority)
   */
  error(message: string, context?: Record<string, any>) {
    this.log('error', message, context);
  }

  /**
   * Track user interaction
   */
  trackEvent(eventName: string, details?: Record<string, any>) {
    this.info(`Event: ${eventName}`, details);
  }

  /**
   * Track page view
   */
  trackPageView(page: string, metadata?: Record<string, any>) {
    this.info(`Page view: ${page}`, metadata);
  }

  /**
   * Track API call
   */
  trackApiCall(
    method: string,
    url: string,
    status: number,
    duration: number,
    error?: string
  ) {
    const context = {
      method,
      url,
      status,
      duration: `${duration}ms`,
      error,
    };
    this.info(`API: ${method} ${url} [${status}]`, context);
  }

  /**
   * Console output based on level
   */
  private consoleLog(level: LogLevel, message: string, context?: Record<string, any>) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (this.isDevelopment) {
      switch (level) {
        case 'debug':
          console.debug(`${prefix}`, message, context || '');
          break;
        case 'info':
          console.info(`${prefix}`, message, context || '');
          break;
        case 'warn':
          console.warn(`${prefix}`, message, context || '');
          break;
        case 'error':
          console.error(`${prefix}`, message, context || '');
          break;
      }
    }
  }

  /**
   * Add entry to buffer
   */
  private addToBuffer(entry: LogEntry) {
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }
  }

  /**
   * Send to monitoring service (Sentry, etc)
   */
  private sendToMonitoring(entry: LogEntry) {
    try {
      if (typeof window !== 'undefined') {
        const sentryWindow = (window as any).__SENTRY__;
        if (sentryWindow && sentryWindow.captureException) {
          sentryWindow.captureException(new Error(entry.message), {
            contexts: {
              log: entry.context,
            },
            level: entry.level as any,
          });
        }
      }
    } catch (err) {
      // Silent fail to avoid recursive errors
      console.error('Failed to send log to monitoring:', err);
    }
  }

  /**
   * Get buffered logs
   */
  getBufferedLogs(): LogEntry[] {
    return [...this.logBuffer];
  }

  /**
   * Clear buffer
   */
  clearBuffer() {
    this.logBuffer = [];
  }

  /**
   * Export logs for debugging
   */
  exportLogs(): string {
    return JSON.stringify(this.logBuffer, null, 2);
  }
}

// Singleton instance
export const logger = new Logger();
