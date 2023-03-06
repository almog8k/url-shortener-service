import {
  pino,
  Logger as PinoLoggerImpl,
  DestinationStream,
  LoggerOptions,
} from "pino";
import { LOG_LEVEL, Logger, LogData } from "./definition";

export default class PinoLogger implements Logger {
  private readonly logger: PinoLoggerImpl;

  constructor(
    private level: LOG_LEVEL,
    private prettyPrintEnabled: boolean,
    private destStream?: DestinationStream | string
  ) {
    const opts: LoggerOptions = {
      level,
      transport: prettyPrintEnabled
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
              sync: true,
            },
          }
        : undefined,
    };
    this.logger = pino(opts);
  }

  debug(log: LogData): void {
    this.logger.debug(log);
  }

  error(log: LogData): void {
    this.logger.error(log);
  }

  info(log: LogData): void {
    this.logger.info(log);
  }

  warning(log: LogData): void {
    this.logger.warn(log);
  }
}
