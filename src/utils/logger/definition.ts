export type LOG_LEVEL = "debug" | "info" | "warn" | "error" | "critical";

export interface Logger {
  info(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
  warning(message: string, ...args: unknown[]): void;
}

export interface LoggerConfiguration {
  level: LOG_LEVEL;
  prettyPrint: boolean;
}

export type SharedLogContext = {
  dirname: string;
  filename: string;
  functionName?: string;
  metadata?: unknown;
};
