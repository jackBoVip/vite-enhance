export interface Logger {
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
  success(message: string, ...args: unknown[]): void;
}

/** Log levels */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

/** Global log level configuration */
let globalLogLevel: LogLevel = process.env.DEBUG ? 'debug' : 'info';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

/**
 * Set the global log level
 */
export function setLogLevel(level: LogLevel): void {
  globalLogLevel = level;
}

/**
 * Get the current log level
 */
export function getLogLevel(): LogLevel {
  return globalLogLevel;
}

/**
 * Check if a log level should be displayed
 */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[globalLogLevel];
}

/**
 * Format log prefix with color (for terminal)
 */
function formatPrefix(name: string, level: LogLevel): string {
  const prefix = `[vite-enhance:${name}]`;
  
  // Add level indicator for non-info levels
  if (level === 'warn') return `⚠ ${prefix}`;
  if (level === 'error') return `✖ ${prefix}`;
  if (level === 'debug') return `● ${prefix}`;
  
  return prefix;
}

/**
 * Create a logger instance
 */
export function createLogger(name: string): Logger {
  return {
    info(message: string, ...args: unknown[]): void {
      if (shouldLog('info')) {
        console.log(formatPrefix(name, 'info'), message, ...args);
      }
    },
    
    warn(message: string, ...args: unknown[]): void {
      if (shouldLog('warn')) {
        console.warn(formatPrefix(name, 'warn'), message, ...args);
      }
    },
    
    error(message: string, ...args: unknown[]): void {
      if (shouldLog('error')) {
        console.error(formatPrefix(name, 'error'), message, ...args);
      }
    },
    
    debug(message: string, ...args: unknown[]): void {
      if (shouldLog('debug')) {
        console.debug(formatPrefix(name, 'debug'), message, ...args);
      }
    },
    
    success(message: string, ...args: unknown[]): void {
      if (shouldLog('info')) {
        console.log(`✓ [vite-enhance:${name}]`, message, ...args);
      }
    },
  };
}

// Default logger for internal use
export const defaultLogger = createLogger('core');