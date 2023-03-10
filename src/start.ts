import { logger } from "./utils/logger/logger-wrapper";
import { startWebServer } from "./server";
import util from "util";
import { AppError, errorHandler } from "./utils/errors/error-handling";
import { SharedLogContext } from "./utils/logger/definition";

const SHARED_LOG_CONTEXT: SharedLogContext = {
  dirname: __dirname,
  filename: __filename,
};

async function start() {
  SHARED_LOG_CONTEXT.functionName = start.name;
  return Promise.all([startWebServer()]);
}

start()
  .then((startResponses) => {
    logger.info({
      msg: "The app has started successfully",
      metadata: { startResponses },
    });
  })
  .catch((error) => {
    errorHandler.handleError(new AppError("startup-failure", error.message));
  });
