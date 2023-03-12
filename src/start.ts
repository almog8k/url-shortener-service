import { logger } from "./utils/logger/logger-wrapper";
import { startWebServer } from "./server";
import { AppError, errorHandler } from "./utils/errors/error-handling";

async function start() {
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
