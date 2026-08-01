import * as Sentry from '@sentry/nextjs';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogContext {
  [key: string]: any;
}

class Logger {
  private enableSentry: boolean;
  private logLevel: LogLevel;

  constructor() {
    this.enableSentry = process.env.SENTRY_DSN !== undefined && process.env.SENTRY_DSN !== '';
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    console.info(this.formatMessage(LogLevel.INFO, message, context));
    
    if (this.enableSentry) {
      Sentry.captureMessage(message, {
        level: 'info',
        contexts: { custom: context || {} },
      });
    }
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
    
    if (this.enableSentry) {
      Sentry.captureMessage(message, {
        level: 'warning',
        contexts: { custom: context || {} },
      });
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
    const errorObj = error instanceof Error ? error : new Error(String(error));
    console.error(this.formatMessage(LogLevel.ERROR, message, context), errorObj);
    
    if (this.enableSentry) {
      Sentry.captureException(errorObj, {
        contexts: { custom: { message, ...context } },
      });
    }
  }

  // Track user for error reporting
  setUser(user: { id: string; email: string; role?: string }): void {
    if (this.enableSentry) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    }
  }

  // Clear user context
  clearUser(): void {
    if (this.enableSentry) {
      Sentry.setUser(null);
    }
  }

  // Add breadcrumb for debugging
  addBreadcrumb(message: string, category: string, data?: LogContext): void {
    if (this.enableSentry) {
      Sentry.addBreadcrumb({
        message,
        category,
        data,
        level: 'info',
      });
    }
  }

  // Performance monitoring
  startTransaction(name: string, operation: string): any {
    if (this.enableSentry) {
      return Sentry.startTransaction({
        name,
        op: operation,
      });
    }
    return null;
  }
}

// Singleton instance
export const logger = new Logger();

// Helper function for API error responses
export function createErrorResponse(
  message: string,
  statusCode: number = 500,
  error?: Error | unknown,
  context?: LogContext
) {
  logger.error(message, error, context);

  return {
    error: true,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && error instanceof Error
      ? { stack: error.stack, details: error.message }
      : {}),
  };
}

// Helper for successful API responses
export function createSuccessResponse<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

export default logger;
