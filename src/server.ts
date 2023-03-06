import { Server } from "http";
import { AddressInfo } from "net";
import * as configurationProvider from "./utils/configuration/configuration-provider";
import { configurationSchema } from "../config";
import { logger } from "./utils/logger/logger-wrapper";
import { LOG_LEVEL } from "./utils/logger/definition";
import express from "express";
import helmet from "helmet";
import defineRoutes from "./url/url-router";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { errorHandler } from "./utils/errors/error-handling";
import { AppError, ResponseError } from "./utils/errors/errors";

//To DO separate the server builder from the listener
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
    const portToListenTo = configurationProvider.getValue<number>("port");
    const webServerPort = portToListenTo || 0;
    logger.info({
      msg: "server is about to listen to port",
      metadata: { webServerPort },
    });
    connection = expressApp.listen(webServerPort, () => {
      errorHandler.listenToErrorEvents(connection);
      resolve(connection.address() as AddressInfo);
    });
  });
}

function defineErrorHandlingMiddleware(expressApp: express.Application) {
  expressApp.use(
    async (
      error: AppError,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (error && typeof error === "object") {
        if (error.isTrusted === undefined || error.isTrusted === null) {
          error.isTrusted = true;
        }
      }
      errorHandler.handleError(error);
      const httpError = errorHandler.httpErrorMapper(error);
      const errorResponse: ResponseError = {
        message: httpError.message,
        code: httpError.code,
      };
      res.status(httpError.code).json(errorResponse).end();
    }
  );
}

function defineSwaggerDoc(expressApp: express.Application): void {
  const swaggerPath = configurationProvider.getValue<string>("swagger");
  const swaggerDocument = YAML.load(path.join(__dirname, swaggerPath));
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
        logger.info({ msg: "Stopping web server" });
        resolve();
      });
    }
  });
}

export { startWebServer, stopWebServer };
