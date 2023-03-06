export type LOG_LEVEL = "debug" | "info" | "warn" | "error" | "critical";

export interface Logger {
  info(log: LogData): void;
  error(log: LogData): void;
  debug(log: LogData): void;
  warning(log: LogData): void;
}

export interface LoggerConfiguration {
  level: LOG_LEVEL;
  prettyPrint: boolean;
}

export interface LogData {
  msg: string;
  metadata?: unknown;
}

export type SharedLogContext = {
  dirname: string;
  filename: string;
  functionName?: string;
  metadata?: unknown;
};
