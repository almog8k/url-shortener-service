import { Server } from "http";
import { AddressInfo } from "net";
import * as configurationProvider from "../../utils/configuration/configuration-provider";
import { configurationSchema } from "../../config";
import { logger } from "../../utils/logger/logger-wrapper";
import { LOG_LEVEL } from "../../utils/logger/definition";
import express from "express";
import helmet from "helmet";
import defineRoutes from "./routes";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { errorHandler } from "../../utils/errors/error-handling";
import { BaseError } from "../../utils/errors/errors";

let connection: Server;

async function startWebServer(): Promise<AddressInfo> {
  configurationProvider.initialize(configurationSchema);
  logger.configureLogger(
    {
      prettyPrint:
        configurationProvider.getValue<boolean>("logger.prettyPrint"),
      level: configurationProvider.getValue<LOG_LEVEL>("logger.level"),
    },
    true
  );

  const expressApp = express();
  expressApp.use(helmet());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(express.json());
  defineSwaggerDoc(expressApp);
  defineRoutes(expressApp);
  defineErrorHandlingMiddleware(expressApp);
  const APIAddress = await openConnection(expressApp);
  return APIAddress;
}

async function openConnection(
  expressApp: express.Application
): Promise<AddressInfo> {
  return new Promise((resolve) => {
    const portToListenTo = configurationProvider.getValue("port");
    const webServerPort = portToListenTo || 0;
    logger.info(`server is about to listen to port ${webServerPort}`);
    connection = expressApp.listen(webServerPort, () => {
      errorHandler.listenToErrorEvents(connection);
      resolve(connection.address() as AddressInfo);
    });
  });
}

function defineErrorHandlingMiddleware(expressApp: express.Application) {
  expressApp.use(
    async (
      error: BaseError,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (error && typeof error === "object") {
        if (error.isTrusted === undefined || error.isTrusted === null) {
          error.isTrusted = true;
        }
      }
      const handledError = errorHandler.handleError(error);
      const errorResponse = errorHandler.getErrorResponse(handledError);
      res.status(errorResponse.code).json(errorResponse).end();
    }
  );
}

function defineSwaggerDoc(expressApp: express.Application) {
  const swaggerDocument = YAML.load(path.join(__dirname, "../../openapi.yaml"));
  expressApp.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );
}

async function stopWebServer() {
  return new Promise<void>((resolve) => {
    if (connection !== undefined) {
      connection.close(() => {
        logger.info("Stopping web server");
        resolve();
      });
    }
  });
}

export { startWebServer, stopWebServer };
