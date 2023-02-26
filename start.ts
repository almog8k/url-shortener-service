import { logger } from "@practica/logger";
import { startWebServer } from "./entry-points/api/server";
import util from "util";
import { AppError, errorHandler } from "./utils/error-handling";
import { SharedLogContext } from "./utils/shared-logger-context";

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
    logger.info(
      `The app has started successfully ${util.inspect(startResponses)}}`
    );
  })
  .catch((error) => {
    errorHandler.handleError(
      new AppError(
        "startup-failure",
        error.message,
        SHARED_LOG_CONTEXT,
        500,
        false
      )
    );
  });
