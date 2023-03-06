import { LogData, Logger, LoggerConfiguration } from "./definition";
import PinoLogger from "../../utils/logger/pino-logger";

export class LoggerWrapper implements Logger {
  private underlyingLogger: Logger | null = null;

  configureLogger(
    configuration: Partial<LoggerConfiguration>,
    overrideIfExists = true
  ): void {
    if (this.underlyingLogger === null || overrideIfExists === true) {
      this.underlyingLogger = new PinoLogger(
        configuration.level || "info",
        configuration.prettyPrint || false,
        undefined
      );
    }
  }

  resetLogger() {
    this.underlyingLogger = null;
  }

  debug(log: LogData): void {
    this.configureLogger({}, false);
    this.underlyingLogger?.debug(log);
  }

  error(log: LogData): void {
    this.configureLogger({}, false);
    this.underlyingLogger?.error(log);
  }

  info(log: LogData): void {
    // If never initialized, the set default configuration
    this.configureLogger({}, false);
    this.underlyingLogger?.info(log);
  }

  warning(log: LogData): void {
    this.configureLogger({}, false);
    this.underlyingLogger?.warning(log);
  }
}

export const logger = new LoggerWrapper();
