/**
 * Unified logger for consistent logging across the application
 */
const prefix = "[MCP-Server-Chart]";

/**
 * Indicates if the logger is in stdio mode.
 * When true, logs are directed to stderr for info, warn, and success messages, using console.error.
 * When false, logs are directed to stdout.
 */
let IS_STDIO = true;

function setIsStdio(isStdio: boolean): void {
  IS_STDIO = isStdio;
}

function getPrefix(): string {
  const timestamp = new Date().toISOString();
  return `${prefix} ${timestamp}`;
}

/**
 * Log info message
 */
function info(message: string, ...args: unknown[]): void {
  const fn = IS_STDIO ? console.error : console.log;
  fn(`${getPrefix()} ℹ️  ${message}`, ...args);
}

/**
 * Log warning message
 */
function warn(message: string, ...args: unknown[]): void {
  const fn = IS_STDIO ? console.warn : console.log;
  fn(`${getPrefix()} ⚠️  ${message}`, ...args);
}

/**
 * Log error message
 */
function error(message: string, error?: unknown): void {
  console.error(`${getPrefix()} ❌ ${message}`, error || "");
}

/**
 * Log success message
 */
function success(message: string, ...args: unknown[]): void {
  const fn = IS_STDIO ? console.error : console.log;
  fn(`${getPrefix()} ✅ ${message}`, ...args);
}

/**
 * Logger object for backward compatibility
 */
export const logger = {
  info,
  warn,
  error,
  success,
  setIsStdio,
};
