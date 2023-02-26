import { logger } from "@practica/logger";
import * as Http from "http";
import util from "util";
import { SharedLogContext } from "./shared-logger-context";

let httpServerRef: Http.Server;

const errorHandler = {
  listenToErrorEvents: (httpServer: Http.Server) => {
    httpServerRef = httpServer;
    process.on("uncaughtException", async (error) => {
      await errorHandler.handleError(error);
    });

    process.on("unhandledRejection", async (reason) => {
      await errorHandler.handleError(reason);
    });

    process.on("SIGTERM", async () => {
      logger.error(
        "App received SIGTERM event, try to gracefully close the server"
      );
      await terminateHttpServerAndExit();
    });

    process.on("SIGINT", async () => {
      logger.error(
        "App received SIGINT event, try to gracefully close the server"
      );
      await terminateHttpServerAndExit();
    });
  },

  handleError: (errorToHandle: unknown) => {
    try {
      const appError: AppError = normalizeError(errorToHandle);
      const { stack, ...rest } = appError;
      logger.error(`${appError.message}: ${util.inspect(rest)}`, appError);

      if (!appError.isTrusted) {
        terminateHttpServerAndExit();
      }
    } catch (handlingError: unknown) {
      process.stdout.write(
        "The error handler failed, here are the handler failure and then the origin error that it tried to handle"
      );
      process.stdout.write(JSON.stringify(handlingError));
      process.stdout.write(JSON.stringify(errorToHandle));
    }
  },
};

const terminateHttpServerAndExit = async () => {
  if (httpServerRef) {
    await httpServerRef.close();
  }
  process.exit();
};

const normalizeError = (errorToHandle: unknown): AppError => {
  if (errorToHandle instanceof AppError) {
    return errorToHandle;
  }
  if (errorToHandle instanceof Error) {
    const appError = new AppError(errorToHandle.name, errorToHandle.message);
    appError.stack = errorToHandle.stack;
    return appError;
  }
  const inputType = typeof errorToHandle;
  return new AppError(
    "general-error",
    `Error Handler received a none error instance with type - ${inputType}, value - ${util.inspect(
      errorToHandle
    )}`
  );
};

class AppError extends Error {
  constructor(
    public name: string,
    public message: string,
    public logContext?: SharedLogContext,
    public HTTPStatus: number = 500,
    public isTrusted = true
  ) {
    super(message);
  }
}
export { errorHandler, AppError };
