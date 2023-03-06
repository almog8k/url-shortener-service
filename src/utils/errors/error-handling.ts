import { logger } from "../logger/logger-wrapper";
import * as Http from "http";
import util from "util";
import {
  AppError,
  HttpError,
  InvalidInputError,
  ResourceExistsError,
  ResourceNotFoundError,
  TooManyAttemptsError,
} from "./errors";
import { HttpStatusCode } from "axios";

let httpServerRef: Http.Server;

const errorHandler = {
  listenToErrorEvents: (httpServer: Http.Server) => {
    httpServerRef = httpServer;
    process.on("uncaughtException", async (error) => {
      await errorHandler.handleError(error);
    });

    process.on("unhandledRejection", async (reason: Error) => {
      await errorHandler.handleError(reason);
    });

    process.on("SIGTERM", async () => {
      logger.error({
        msg: "App received SIGTERM event, try to gracefully close the server",
      });
      await terminateHttpServerAndExit();
    });

    process.on("SIGINT", async () => {
      logger.error({
        msg: "App received SIGINT event, try to gracefully close the server",
      });
      await terminateHttpServerAndExit();
    });
  },

  handleError: (errorToHandle: unknown) => {
    try {
      const appError: AppError = normalizeError(errorToHandle);
      logger.error({ msg: appError.message, metadata: { appError } });

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

  httpErrorMapper: (error: AppError): HttpError => {
    if (error instanceof ResourceNotFoundError) {
      return new HttpError("Not Found", error.message, HttpStatusCode.NotFound);
    }
    if (error instanceof InvalidInputError) {
      return new HttpError(
        "Bad Request",
        error.message,
        HttpStatusCode.BadRequest
      );
    }
    if (error instanceof ResourceExistsError) {
      return new HttpError("Conflict", error.message, HttpStatusCode.Conflict);
    }
    if (error instanceof TooManyAttemptsError) {
      return new HttpError(
        "Internal Server Error",
        error.message,
        HttpStatusCode.InternalServerError
      );
    }
    return new HttpError(
      "Internal Server Error",
      error.message,
      HttpStatusCode.InternalServerError
    );
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

export { errorHandler, AppError };
