/**
 * Unified logger for consistent logging across the application
 */
const prefix = "[MCP-Server-Chart]";

/**
 * Log info message
 */
function info(message: string, ...args: unknown[]): void {
  console.log(`${prefix} ℹ️  ${message}`, ...args);
}

/**
 * Log warning message
 */
function warn(message: string, ...args: unknown[]): void {
  console.warn(`${prefix} ⚠️  ${message}`, ...args);
}

/**
 * Log error message
 */
function error(message: string, error?: unknown): void {
  console.error(`${prefix} ❌ ${message}`, error || "");
}

/**
 * Log success message
 */
function success(message: string, ...args: unknown[]): void {
  console.log(`${prefix} ✅ ${message}`, ...args);
}

/**
 * Logger object for backward compatibility
 */
export const logger = {
  info,
  warn,
  error,
  success,
};
